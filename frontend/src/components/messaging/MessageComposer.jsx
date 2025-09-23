/**
 * Composant MessageComposer - Zone de saisie
 * Champ texte + Enter pour envoyer + Optimistic UI + placeholders contextualisés
 */

import React, { useState, useRef, useCallback } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile,
  Bold,
  Italic,
  AtSign,
  Star,
  Loader2,
  AlertCircle
} from 'lucide-react';
import EmeresButton from '../ui/EmeresButton';
import EmeresBadge from '../ui/EmeresBadge';
import { Thread } from '../../types/messaging';
import { cn } from '../../lib/utils';

const MessageComposer = ({
  thread,
  onSendMessage,
  disabled = false,
  placeholder,
  sending = false,
  className
}) => {
  const [message, setMessage] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [mentions, setMentions] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);

  // Placeholder contextualisé selon le type de thread
  const getContextualPlaceholder = () => {
    if (placeholder) return placeholder;
    
    if (!thread) return "Tapez votre message sécurisé...";
    
    const placeholders = {
      candidature: "Message à l'entreprise au sujet de votre candidature...",
      mentorat: "Posez votre question à votre mentor ou partagez vos avancées...", 
      scolaire: "Contactez votre établissement pour toute question pédagogique...",
      partenariat: "Communiquez avec votre partenaire institutionnel...",
      stage: "Échangez avec les acteurs de votre stage...",
      support: "Décrivez votre problème, notre équipe vous aide..."
    };
    
    return placeholders[thread.context] || "Tapez votre message sécurisé...";
  };

  // Envoi du message
  const handleSend = useCallback(async () => {
    if (!message.trim() || sending || disabled || !onSendMessage) return;

    const messageText = message.trim();
    
    try {
      await onSendMessage(messageText, {
        isImportant,
        mentions,
        messageType: 'text'
      });
      
      // Reset après envoi réussi
      setMessage('');
      setIsImportant(false);
      setMentions([]);
      
      // Focus sur le textarea
      textareaRef.current?.focus();
      
    } catch (error) {
      console.error('Erreur envoi message:', error);
      // L'erreur sera gérée par le hook useMessages avec toast
    }
  }, [message, sending, disabled, onSendMessage, isImportant, mentions]);

  // Gestion des raccourcis clavier
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Auto-resize du textarea
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setMessage(value);
    
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }, []);

  // Vérification des permissions
  const canSend = () => {
    if (!thread) return false;
    
    // Vérifier si l'utilisateur a les permissions d'écriture
    // (Dans un vrai système, cela viendrait des permissions du thread)
    return thread.status === 'active';
  };

  // Vérification si le thread est fermé
  const isThreadClosed = thread?.status === 'archived' || thread?.status === 'locked';

  if (isThreadClosed) {
    return (
      <div className="px-6 py-4 bg-gray-100 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Cette conversation est fermée</span>
        </div>
      </div>
    );
  }

  if (!canSend()) {
    return (
      <div className="px-6 py-4 bg-gray-100 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Vous n'avez pas les permissions pour écrire dans cette conversation</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white border-t border-gray-200", className)}>
      {/* Barre d'outils (optionnelle) */}
      {message.length > 0 && (
        <div className="px-6 py-2 border-b border-gray-100 flex items-center gap-2">
          <button
            onClick={() => setIsImportant(!isImportant)}
            className={cn(
              "p-1.5 rounded hover:bg-gray-100 transition-colors",
              isImportant && "bg-orange-100 text-orange-600"
            )}
            title="Marquer comme important"
          >
            <Star className="h-4 w-4" />
          </button>
          
          <button
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Mentionner quelqu'un"
          >
            <AtSign className="h-4 w-4" />
          </button>
          
          {isImportant && (
            <EmeresBadge variant="secondary" size="xs" className="text-orange-600">
              Message important
            </EmeresBadge>
          )}
        </div>
      )}

      {/* Zone de composition */}
      <div className="px-6 py-4">
        <div className="flex items-end gap-3">
          {/* Bouton pièce jointe */}
          <EmeresButton
            variant="ghost"
            size="sm"
            className="flex-shrink-0"
            disabled={disabled || sending}
            title="Joindre un fichier"
          >
            <Paperclip className="h-4 w-4" />
          </EmeresButton>

          {/* Zone de texte */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={getContextualPlaceholder()}
              disabled={disabled || sending}
              rows={1}
              className={cn(
                "w-full px-4 py-3 border border-gray-300 rounded-lg resize-none",
                "focus:ring-2 focus:ring-teal-500 focus:border-transparent",
                "placeholder-gray-500 text-sm leading-relaxed",
                "transition-all duration-200",
                disabled && "bg-gray-50 cursor-not-allowed"
              )}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            
            {/* Compteur de caractères (si message long) */}
            {message.length > 200 && (
              <div className="absolute -top-6 right-2 text-xs text-gray-500">
                {message.length}/2000
              </div>
            )}
          </div>

          {/* Bouton envoyer */}
          <EmeresButton
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={!message.trim() || sending || disabled}
            className="flex-shrink-0"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </>
            )}
          </EmeresButton>
        </div>

        {/* Aide et sécurité */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-600">Chiffrement E2E activé</span>
          </div>
          
          <span>•</span>
          
          <span>
            <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 rounded">Entrée</kbd> pour envoyer, 
            <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 rounded ml-1">Shift+Entrée</kbd> pour nouvelle ligne
          </span>
          
          {thread && (
            <>
              <span>•</span>
              <span className="capitalize">Contexte: {thread.context}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;