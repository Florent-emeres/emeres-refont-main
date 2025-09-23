/**
 * Hook useMessages - Gestion des messages d'un thread
 * Charge l'historique, gère cursor, prepend/append, expose send(text), markAsRead()
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { messagingApi, handleApiError } from '../api/messaging';
import { useToast } from './use-toast';

export const useMessages = (options = {}) => {
  const { 
    threadId, 
    limit = 50, 
    autoMarkAsRead = true, 
    optimisticUpdates = true 
  } = options;
  
  const { toast } = useToast();
  
  const [state, setState] = useState({
    messages: [],
    loading: false,
    error: null,
    hasMore: false,
    sending: false
  });

  const [cursor, setCursor] = useState(null);
  const optimisticMessagesRef = useRef(new Set());
  const lastThreadIdRef = useRef();

  // Charger les messages
  const fetchMessages = useCallback(async (
    targetThreadId, 
    loadMore = false, 
    showLoading = true
  ) => {
    const currentThreadId = targetThreadId || threadId;
    if (!currentThreadId) return;

    if (showLoading && !loadMore) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }

    try {
      const currentCursor = loadMore ? cursor : undefined;
      const result = await messagingApi.getMessages(currentThreadId, currentCursor, limit);
      
      setState(prev => ({
        ...prev,
        messages: loadMore 
          ? [...result.items, ...prev.messages] // Prepend pour historique
          : result.items, // Replace pour nouveau thread
        hasMore: result.hasMore,
        loading: false,
        error: null
      }));

      setCursor(result.nextCursor || null);

      // Auto-marquer comme lu si activé
      if (autoMarkAsRead && !loadMore) {
        setTimeout(() => markAsRead(currentThreadId), 500);
      }

    } catch (error) {
      const apiError = handleApiError(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }));

      if (showLoading) {
        toast({
          title: "Erreur de chargement",
          description: apiError.message,
          variant: "destructive"
        });
      }
    }
  }, [threadId, cursor, limit, autoMarkAsRead, toast]);

  // Charger plus de messages (historique)
  const loadMore = useCallback(() => {
    if (state.hasMore && !state.loading && threadId) {
      fetchMessages(threadId, true, false);
    }
  }, [state.hasMore, state.loading, threadId, fetchMessages]);

  // Envoyer un message
  const sendMessage = useCallback(async (
    text, 
    options = {}
  ) => {
    if (!threadId || !text.trim()) return null;

    const messageRequest = {
      body: text.trim(),
      messageType: 'text',
      ...options
    };

    // ID temporaire pour message optimiste
    const optimisticId = `optimistic-${Date.now()}-${Math.random()}`;
    
    // Message optimiste
    const optimisticMessage = {
      id: optimisticId,
      threadId,
      senderId: 'current-user', // Sera remplacé
      senderName: 'Vous',
      senderRole: 'user',
      body: messageRequest.body,
      messageType: messageRequest.messageType || 'text',
      createdAt: new Date().toISOString(),
      isOwn: true,
      isRead: true,
      isImportant: messageRequest.isImportant || false,
      attachments: messageRequest.attachments || [],
      mentions: messageRequest.mentions || [],
      replyToMessageId: messageRequest.replyToMessageId
    };

    setState(prev => ({ ...prev, sending: true }));

    // Ajout optimiste
    if (optimisticUpdates) {
      optimisticMessagesRef.current.add(optimisticId);
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, optimisticMessage]
      }));
    }

    try {
      const sentMessage = await messagingApi.sendMessage(threadId, messageRequest);
      
      setState(prev => ({
        ...prev,
        messages: optimisticUpdates
          ? prev.messages.map(msg => 
              msg.id === optimisticId ? { ...sentMessage, isOwn: true } : msg
            )
          : [...prev.messages, { ...sentMessage, isOwn: true }],
        sending: false
      }));

      optimisticMessagesRef.current.delete(optimisticId);
      return sentMessage;

    } catch (error) {
      const apiError = handleApiError(error);
      
      setState(prev => ({
        ...prev,
        sending: false,
        // Retirer le message optimiste en cas d'erreur
        messages: optimisticUpdates 
          ? prev.messages.filter(msg => msg.id !== optimisticId)
          : prev.messages
      }));

      optimisticMessagesRef.current.delete(optimisticId);

      toast({
        title: "Erreur d'envoi",
        description: apiError.message,
        variant: "destructive"
      });

      throw error;
    }
  }, [threadId, optimisticUpdates, toast]);

  // Marquer le thread comme lu
  const markAsRead = useCallback(async (targetThreadId) => {
    const currentThreadId = targetThreadId || threadId;
    if (!currentThreadId) return;

    try {
      await messagingApi.markThreadAsRead(currentThreadId);
      
      // Mettre à jour l'état local des messages
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => ({
          ...msg,
          isRead: true
        }))
      }));

    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  }, [threadId]);

  // Ajouter un nouveau message (temps réel)
  const addMessage = useCallback((message) => {
    // Éviter les doublons avec messages optimistes
    if (optimisticMessagesRef.current.has(message.id)) {
      return;
    }

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));

    // Auto-marquer comme lu si c'est le thread actif
    if (autoMarkAsRead && message.threadId === threadId && !message.isOwn) {
      setTimeout(() => markAsRead(threadId), 100);
    }
  }, [threadId, autoMarkAsRead, markAsRead]);

  // Mettre à jour un message existant
  const updateMessage = useCallback((messageId, updates) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    }));
  }, []);

  // Supprimer un message
  const removeMessage = useCallback((messageId) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.filter(msg => msg.id !== messageId)
    }));
  }, []);

  // Reset quand le threadId change
  useEffect(() => {
    if (threadId && threadId !== lastThreadIdRef.current) {
      lastThreadIdRef.current = threadId;
      
      // Reset de l'état
      setState({
        messages: [],
        loading: false,
        error: null,
        hasMore: false,
        sending: false
      });
      setCursor(null);
      optimisticMessagesRef.current.clear();
      
      // Charger les nouveaux messages
      fetchMessages(threadId, false, true);
    }
  }, [threadId, fetchMessages]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (threadId) {
        messagingApi.abortRequest(`get-messages-${threadId}`);
        messagingApi.abortRequest(`send-message-${threadId}`);
      }
    };
  }, [threadId]);

  return {
    // État
    messages: state.messages,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    sending: state.sending,
    
    // Actions
    sendMessage,
    markAsRead,
    loadMore,
    
    // Pour le temps réel
    addMessage,
    updateMessage,
    removeMessage,
    
    // Utilitaires
    refresh: () => fetchMessages(threadId, false, true),
  };
};