/**
 * Types partagés front/back pour le système de messagerie ÉMÉRÉS
 * Architecture Thread-based avec chiffrement E2E
 */

// Note: En JavaScript, nous documentons les types avec JSDoc
// Ceci est converti depuis TypeScript pour compatibilité

/**
 * @typedef {'candidature' | 'mentorat' | 'scolaire' | 'partenariat' | 'stage' | 'support'} ThreadContext
 */

/**
 * @typedef {Object} ThreadParticipant
 * @property {string} userId
 * @property {string} role
 * @property {string} name
 * @property {string} [avatar]
 * @property {string[]} permissions
 * @property {string} [lastReadAt]
 */

/**
 * @typedef {Object} Thread
 * @property {string} id
 * @property {ThreadContext} context
 * @property {string} contextId
 * @property {string} title
 * @property {'active' | 'archived' | 'locked' | 'resolved'} status
 * @property {'low' | 'normal' | 'high' | 'urgent'} priority
 * @property {string} updatedAt
 * @property {string} lastActivityAt
 * @property {string} createdAt
 * @property {ThreadParticipant[]} participants
 * @property {string[]} [tags]
 * @property {number} unreadCount
 * @property {Object} [lastMessage]
 * @property {string} lastMessage.id
 * @property {string} lastMessage.senderId
 * @property {string} lastMessage.senderName
 * @property {string} lastMessage.content
 * @property {string} lastMessage.createdAt
 * @property {Record<string, any>} [contextData]
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} threadId
 * @property {string} senderId
 * @property {string} senderName
 * @property {string} senderRole
 * @property {string} body
 * @property {'text' | 'file' | 'image' | 'system'} messageType
 * @property {string} createdAt
 * @property {string} [editedAt]
 * @property {string} [deletedAt]
 * @property {boolean} isOwn
 * @property {boolean} isRead
 * @property {boolean} isImportant
 * @property {Array<Object>} [attachments]
 * @property {string[]} [mentions]
 * @property {string} [replyToMessageId]
 */

/**
 * @typedef {Object} ThreadsQuery
 * @property {Thread[]} items
 * @property {number} total
 * @property {string|null} [nextPage]
 * @property {boolean} hasMore
 */

/**
 * @typedef {Object} MessagesQuery
 * @property {Message[]} items
 * @property {number} total
 * @property {string|null} [nextCursor]
 * @property {boolean} hasMore
 */

/**
 * @typedef {Object} ThreadsFilter
 * @property {ThreadContext | 'all'} [context]
 * @property {string} [search]
 * @property {string} [status]
 * @property {number} [page]
 * @property {number} [limit]
 */

/**
 * @typedef {Object} SendMessageRequest
 * @property {string} body
 * @property {'text' | 'file' | 'image'} [messageType]
 * @property {Array<Object>} [attachments]
 * @property {string[]} [mentions]
 * @property {boolean} [isImportant]
 * @property {string} [replyToMessageId]
 */

/**
 * @typedef {Object} CreateThreadRequest
 * @property {ThreadContext} contextType
 * @property {string} contextId
 * @property {string} [title]
 * @property {Array<Object>} participants
 * @property {Record<string, any>} [contextData]
 * @property {'low' | 'normal' | 'high' | 'urgent'} [priority]
 */

/**
 * @typedef {Object} ApiResponse
 * @template T
 * @property {T} data
 * @property {boolean} success
 * @property {string} [message]
 * @property {string} [error]
 */

/**
 * @typedef {Object} ApiError
 * @property {number} status
 * @property {string} message
 * @property {Record<string, any>} [details]
 */

/**
 * @typedef {Object} RealtimeMessage
 * @property {'message_sent' | 'message_read' | 'thread_updated' | 'participant_joined'} type
 * @property {string} threadId
 * @property {any} data
 * @property {string} timestamp
 */

/**
 * @typedef {Object} UseThreadsState
 * @property {Thread[]} threads
 * @property {boolean} loading
 * @property {ApiError|null} error
 * @property {boolean} hasMore
 * @property {number} totalUnread
 */

/**
 * @typedef {Object} UseMessagesState
 * @property {Message[]} messages
 * @property {boolean} loading
 * @property {ApiError|null} error
 * @property {boolean} hasMore
 * @property {boolean} sending
 */

/**
 * @typedef {Object} UseRealtimeState
 * @property {boolean} connected
 * @property {string|null} error
 * @property {RealtimeMessage|null} lastMessage
 */

export {
  // Ces exports sont juste pour la documentation
  // En JavaScript, les typedefs sont utilisés pour l'IntelliSense
};