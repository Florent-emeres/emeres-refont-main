/**
 * Client API typé pour le système de messagerie ÉMÉRÉS
 * Gestion auth, erreurs, retries, abort controller
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || '';
const API_TIMEOUT = 30000; // 30 secondes

class MessagingApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'MessagingApiError';
    this.status = status;
    this.message = message;
    this.details = details;
  }
}

class MessagingApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = `${baseUrl}/api`;
    this.abortControllers = new Map();
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  createAbortController(key) {
    // Annuler la requête précédente si elle existe
    this.abortControllers.get(key)?.abort();
    
    const controller = new AbortController();
    this.abortControllers.set(key, controller);
    
    // Nettoyer après timeout
    setTimeout(() => {
      this.abortControllers.delete(key);
    }, API_TIMEOUT);
    
    return controller;
  }

  async makeRequest(url, options = {}, retries = 2, abortKey) {
    const controller = abortKey ? this.createAbortController(abortKey) : new AbortController();
    
    const config = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      signal: controller.signal,
      timeout: API_TIMEOUT,
    };

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${url}`, config);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new MessagingApiError(
            response.status,
            errorData.detail || errorData.message || `HTTP ${response.status}`,
            errorData
          );
        }

        const data = await response.json();
        return data;
      } catch (error) {
        if (error instanceof MessagingApiError) {
          // Erreurs HTTP ne doivent pas être retentées sauf 5xx
          if (error.status < 500 || attempt === retries) {
            throw error;
          }
        } else if (error.name === 'AbortError') {
          throw new MessagingApiError(0, 'Requête annulée');
        } else if (attempt === retries) {
          throw new MessagingApiError(0, 'Erreur réseau', error);
        }

        // Attendre avant retry (exponential backoff)
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw new MessagingApiError(0, 'Maximum retries exceeded');
  }

  // =====================================
  // THREADS API
  // =====================================

  async getThreads(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.context && filters.context !== 'all') {
      params.append('context', filters.context);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.page) {
      params.append('page', filters.page.toString());
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }

    const queryString = params.toString();
    const url = `/threads${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.makeRequest(url, {}, 2, 'get-threads');
    
    // Transformer la réponse backend vers le format attendu
    const threads = [];
    let totalUnread = 0;

    if (response.tabs) {
      Object.entries(response.tabs).forEach(([contextType, tabData]) => {
        if (tabData.threads) {
          tabData.threads.forEach((thread) => {
            threads.push({
              id: thread.thread_id,
              context: contextType,
              contextId: thread.context_id || thread.thread_id,
              title: thread.title,
              status: thread.status || 'active',
              priority: thread.priority || 'normal',
              updatedAt: thread.last_activity_at,
              lastActivityAt: thread.last_activity_at,
              createdAt: thread.created_at || thread.last_activity_at,
              participants: thread.participants || [],
              tags: thread.tags || [],
              unreadCount: thread.unread_count || 0,
              lastMessage: thread.last_message,
              contextData: thread.context_data || {}
            });
            totalUnread += thread.unread_count || 0;
          });
        }
      });
    }

    return {
      items: threads,
      total: threads.length,
      nextPage: null, // Sera implémenté avec pagination
      hasMore: false
    };
  }

  async getThread(threadId) {
    const response = await this.makeRequest(`/threads/${threadId}`, {}, 2, `get-thread-${threadId}`);
    
    return {
      id: response.id,
      context: response.context_type,
      contextId: response.context_id,
      title: response.title,
      status: response.status || 'active',
      priority: response.priority || 'normal',
      updatedAt: response.last_activity_at || response.updated_at,
      lastActivityAt: response.last_activity_at || response.updated_at,
      createdAt: response.created_at,
      participants: response.participants || [],
      tags: response.tags || [],
      unreadCount: 0, // Sera calculé côté hook
      contextData: response.context_data || {}
    };
  }

  async createThread(request) {
    const response = await this.makeRequest(`/threads/context/${request.contextType}`, {
      method: 'POST',
      body: JSON.stringify({
        context_id: request.contextId,
        title: request.title,
        participants: request.participants,
        context_data: request.contextData,
        priority: request.priority
      })
    });

    return {
      id: response.thread_id,
      context: request.contextType,
      contextId: request.contextId,
      title: request.title || response.title,
      status: 'active',
      priority: request.priority || 'normal',
      updatedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      participants: request.participants.map(p => ({
        userId: p.userId,
        role: p.role,
        name: '', // Sera rempli par le backend
        permissions: p.permissions || ['read', 'write']
      })),
      tags: [],
      unreadCount: 0,
      contextData: request.contextData || {}
    };
  }

  async markThreadAsRead(threadId) {
    await this.makeRequest(`/threads/${threadId}/read`, {
      method: 'PUT',
      body: JSON.stringify({})
    }, 1, `mark-read-${threadId}`);
  }

  async searchThreads(query, context) {
    const params = new URLSearchParams({ q: query });
    if (context) {
      params.append('context', context);
    }

    const response = await this.makeRequest(`/threads/search?${params}`, {}, 2, 'search-threads');
    
    const threads = response.results?.map((thread) => ({
      id: thread.thread_id,
      context: thread.context_type,
      contextId: thread.context_id,
      title: thread.title,
      status: thread.status || 'active',
      priority: thread.priority || 'normal',
      updatedAt: thread.last_activity_at,
      lastActivityAt: thread.last_activity_at,
      createdAt: thread.created_at || thread.last_activity_at,
      participants: thread.participants || [],
      tags: thread.tags || [],
      unreadCount: thread.unread_count || 0,
      lastMessage: thread.last_message,
      contextData: thread.context_data || {}
    })) || [];

    return {
      items: threads,
      total: response.total || threads.length,
      nextPage: null,
      hasMore: false
    };
  }

  // =====================================
  // MESSAGES API
  // =====================================

  async getMessages(threadId, cursor, limit = 50) {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString();
    const url = `/threads/${threadId}/messages${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.makeRequest(url, {}, 2, `get-messages-${threadId}`);
    
    const messages = response.messages?.map((msg) => ({
      id: msg.message_id,
      threadId: msg.thread_id || threadId,
      senderId: msg.sender_id,
      senderName: msg.sender_name,
      senderRole: msg.sender_role,
      body: msg.content, // Déjà déchiffré par le backend
      messageType: msg.message_type || 'text',
      createdAt: msg.created_at,
      editedAt: msg.edited_at,
      deletedAt: msg.deleted_at,
      isOwn: msg.is_own || false,
      isRead: msg.is_read || false,
      isImportant: msg.is_important || false,
      attachments: msg.attachments || [],
      mentions: msg.mentions || [],
      replyToMessageId: msg.reply_to_message_id
    })) || [];

    return {
      items: messages,
      total: messages.length,
      nextCursor: response.nextCursor,
      hasMore: response.has_more || false
    };
  }

  async sendMessage(threadId, request) {
    const response = await this.makeRequest(`/threads/${threadId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        body: request.body,
        message_type: request.messageType || 'text',
        attachments: request.attachments || [],
        mentions: request.mentions || [],
        is_important: request.isImportant || false,
        reply_to_message_id: request.replyToMessageId
      })
    }, 1, `send-message-${threadId}`);

    return {
      id: response.message_id,
      threadId: threadId,
      senderId: '', // Sera rempli par le hook
      senderName: '', // Sera rempli par le hook
      senderRole: '',
      body: request.body,
      messageType: request.messageType || 'text',
      createdAt: response.created_at || new Date().toISOString(),
      isOwn: true,
      isRead: true,
      isImportant: request.isImportant || false,
      attachments: request.attachments || [],
      mentions: request.mentions || [],
      replyToMessageId: request.replyToMessageId
    };
  }

  // =====================================
  // UTILITAIRES
  // =====================================

  abortRequest(key) {
    this.abortControllers.get(key)?.abort();
    this.abortControllers.delete(key);
  }

  abortAllRequests() {
    this.abortControllers.forEach(controller => controller.abort());
    this.abortControllers.clear();
  }
}

// Instance singleton
export const messagingApi = new MessagingApiClient();

// Helper pour gestion d'erreurs
export const handleApiError = (error) => {
  if (error instanceof MessagingApiError) {
    return {
      status: error.status,
      message: error.message,
      details: error.details
    };
  }
  
  return {
    status: 0,
    message: error instanceof Error ? error.message : 'Erreur inconnue'
  };
};

export default messagingApi;