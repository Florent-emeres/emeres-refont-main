/**
 * Composant MessageView - Vue conversation
 * Timeline des messages + auto-scroll + markAsRead() + gestion états
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { 
  Lock, 
  Check, 
  CheckCheck, 
  Star, 
  Paperclip, 
  Reply,
  MoreVertical,
  AlertCircle,
  Loader2,
  ArrowDown
} from 'lucide-react';
import EmeresButton from '../ui/EmeresButton';
import EmeresBadge from '../ui/EmeresBadge';
import { Message, Thread } from '../../types/messaging';
import { cn } from '../../lib/utils';

const MessageView = ({
  thread,
  messages = [],
  loading = false,
  error = null,
  hasMore = false,
  onLoadMore,
  onMarkAsRead,
  onReply,
  className
}) => {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  // Auto-scroll vers le bas si utilisateur est en bas
  const scrollToBottom = useCallback((force = false) => {
    if (force || isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: force ? 'instant' : 'smooth',
        block: 'end'
      });
      setHasScrolledToBottom(true);
    }
  }, [isAtBottom]);

  // Détecter si l'utilisateur est en bas
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setIsAtBottom(isNearBottom);
    setShowScrollButton(!isNearBottom && scrollTop > 200);

    // Marquer comme lu si on scroll en bas
    if (isNearBottom && thread && onMarkAsRead) {
      onMarkAsRead(thread.id);
    }
  }, [thread, onMarkAsRead]);

  // Grouper les messages par jour
  const groupedMessages = React.useMemo(() => {
    if (!messages.length) return [];

    const groups = [];
    let currentDate = null;
    let currentGroup = null;

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString();
      
      if (messageDate !== currentDate) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        
        currentDate = messageDate;
        currentGroup = {
          date: messageDate,
          messages: [message]
        };
      } else {
        currentGroup.messages.push(message);
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  }, [messages]);

  // Formatage de l'heure
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    } else {
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
  };

  // Auto-scroll lors de nouveaux messages
  useEffect(() => {
    if (messages.length > 0 && hasScrolledToBottom) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom, hasScrolledToBottom]);

  // Marquer comme lu au mount et quand on arrive en bas
  useEffect(() => {
    if (thread && onMarkAsRead && isAtBottom) {
      const timer = setTimeout(() => {
        onMarkAsRead(thread.id);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [thread, onMarkAsRead, isAtBottom]);

  // Scroll initial vers le bas
  useEffect(() => {
    if (messages.length > 0 && !hasScrolledToBottom) {
      setTimeout(() => {
        scrollToBottom(true);
      }, 100);
    }
  }, [messages.length, scrollToBottom, hasScrolledToBottom]);

  // Rendu d'un message
  const renderMessage = (message, isLastInGroup = false) => {
    const isOwn = message.isOwn;
    const showAvatar = !isOwn && isLastInGroup;

    return (
      <div
        key={message.id}
        className={cn(
          "flex gap-3 group",
          isOwn ? "justify-end" : "justify-start"
        )}
      >
        {/* Avatar pour les messages des autres */}
        {!isOwn && (
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
            showAvatar 
              ? "bg-gradient-to-br from-teal-400 to-cyan-500 text-white"
              : "invisible"
          )}>
            {showAvatar && message.senderName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className={cn(
          "flex flex-col max-w-[75%]",
          isOwn && "items-end"
        )}>
          {/* Nom de l'expéditeur */}
          {!isOwn && showAvatar && (
            <div className="text-xs font-medium text-gray-600 mb-1 px-1">
              {message.senderName}
              <EmeresBadge variant="outline" size="xs" className="ml-2">
                {message.senderRole}
              </EmeresBadge>
            </div>
          )}

          {/* Bulle de message */}
          <div
            className={cn(
              "px-4 py-3 rounded-2xl relative group/message",
              isOwn
                ? "bg-gradient-to-br from-teal-500 to-teal-600 text-white"
                : "bg-white border border-gray-200 shadow-sm text-gray-900",
              message.isImportant && "ring-2 ring-orange-200"
            )}
          >
            {/* Badge message important */}
            {message.isImportant && (
              <div className={cn(
                "flex items-center gap-1 text-xs mb-2",
                isOwn ? "text-teal-100" : "text-orange-600"
              )}>
                <Star className="h-3 w-3" />
                <span>Message important</span>
              </div>
            )}

            {/* Contenu du message */}
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.body}
            </div>

            {/* Pièces jointes */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg text-sm",
                      isOwn ? "bg-teal-600/50" : "bg-gray-100"
                    )}
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="truncate">{attachment.filename}</span>
                    <span className="text-xs opacity-75">
                      {(attachment.size / 1024).toFixed(1)} Ko
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions du message (au hover) */}
            <div className="absolute -top-2 right-2 opacity-0 group-hover/message:opacity-100 transition-opacity">
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1">
                {!isOwn && (
                  <button
                    onClick={() => onReply?.(message)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Répondre"
                  >
                    <Reply className="h-3 w-3 text-gray-500" />
                  </button>
                )}
                <button
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Plus d'actions"
                >
                  <MoreVertical className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Métadonnées */}
          <div className={cn(
            "flex items-center gap-2 text-xs text-gray-500 mt-1 px-1",
            isOwn && "flex-row-reverse"
          )}>
            <span>{formatTime(message.createdAt)}</span>
            
            {message.editedAt && (
              <span className="italic">modifié</span>
            )}
            
            <Lock className="h-3 w-3 text-green-600" title="Message chiffré E2E" />
            
            {isOwn && (
              <span title={message.isRead ? "Lu" : "Envoyé"}>
                {message.isRead ? (
                  <CheckCheck className="h-3 w-3 text-teal-600" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <EmeresButton onClick={() => window.location.reload()}>
            Réessayer
          </EmeresButton>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <Lock className="h-16 w-16 text-teal-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sélectionnez une conversation
          </h3>
          <p className="text-gray-600">
            Choisissez une conversation dans la liste pour commencer à échanger
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-gray-50", className)}>
      {/* Header du thread */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">{thread.title}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
              <EmeresBadge variant="secondary" size="xs">
                {thread.context}
              </EmeresBadge>
              
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3 text-green-600" />
                <span className="text-green-600">Chiffré E2E</span>
              </div>
              
              <span>
                {thread.participants.length} participant{thread.participants.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Actions du thread */}
          </div>
        </div>
      </div>

      {/* Zone des messages */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
      >
        {/* Bouton "Charger plus" en haut */}
        {hasMore && (
          <div className="text-center pb-4">
            <EmeresButton
              variant="ghost"
              size="sm"
              onClick={onLoadMore}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Chargement...
                </>
              ) : (
                'Charger les messages précédents'
              )}
            </EmeresButton>
          </div>
        )}

        {/* Messages groupés par jour */}
        {groupedMessages.map((group, groupIndex) => (
          <div key={group.date} className="space-y-4">
            {/* Séparateur de date */}
            <div className="flex items-center justify-center">
              <div className="bg-white px-4 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-600">
                {formatDate(group.date)}
              </div>
            </div>

            {/* Messages du jour */}
            <div className="space-y-4">
              {group.messages.map((message, messageIndex) => {
                const isLastInGroup = messageIndex === group.messages.length - 1 ||
                  group.messages[messageIndex + 1]?.senderId !== message.senderId;
                
                return renderMessage(message, isLastInGroup);
              })}
            </div>
          </div>
        ))}

        {/* État vide */}
        {messages.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              Aucun message dans cette conversation
            </div>
            <div className="text-sm text-gray-500">
              Commencez la conversation ci-dessous
            </div>
          </div>
        )}

        {/* Indicateur de chargement */}
        {loading && messages.length === 0 && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500 mx-auto mb-4" />
            <div className="text-gray-600">Chargement des messages...</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bouton de retour en bas */}
      {showScrollButton && (
        <div className="absolute bottom-24 right-6">
          <EmeresButton
            variant="primary"
            size="sm"
            onClick={() => scrollToBottom(true)}
            className="rounded-full shadow-lg"
          >
            <ArrowDown className="h-4 w-4" />
          </EmeresButton>
        </div>
      )}
    </div>
  );
};

export default MessageView;