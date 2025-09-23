/**
 * Composant ThreadList - Liste des conversations
 * Affiche titre, contexte (badge couleur), dernier message (snippet), compteur non lus
 * Filtre par contexte + recherche plein-texte + scroll infini
 */

import React, { useState, useCallback, useMemo } from 'react';
import { 
  MessageSquare, 
  Building, 
  User, 
  GraduationCap, 
  Users, 
  HeadphonesIcon,
  Briefcase,
  Search,
  Filter,
  Clock,
  AlertCircle
} from 'lucide-react';
import EmeresInput from '../ui/EmeresInput';
import EmeresBadge from '../ui/EmeresBadge';
import EmeresButton from '../ui/EmeresButton';
import { Thread, ThreadContext } from '../../types/messaging';
import { cn } from '../../lib/utils';

const contextConfig = {
  candidature: { 
    label: 'Candidatures', 
    icon: Building, 
    color: 'bg-purple-100 text-purple-600',
    badge: 'bg-purple-500'
  },
  mentorat: { 
    label: 'Mentorat', 
    icon: User, 
    color: 'bg-emerald-100 text-emerald-600',
    badge: 'bg-emerald-500'
  },
  scolaire: { 
    label: 'École', 
    icon: GraduationCap, 
    color: 'bg-blue-100 text-blue-600',
    badge: 'bg-blue-500'
  },
  partenariat: { 
    label: 'Partenariats', 
    icon: Users, 
    color: 'bg-orange-100 text-orange-600',
    badge: 'bg-orange-500'
  },
  stage: { 
    label: 'Stages', 
    icon: Briefcase, 
    color: 'bg-indigo-100 text-indigo-600',
    badge: 'bg-indigo-500'
  },
  support: { 
    label: 'Support', 
    icon: HeadphonesIcon, 
    color: 'bg-red-100 text-red-600',
    badge: 'bg-red-500'
  }
};

const ThreadList = ({
  threads = [],
  selectedThreadId,
  onThreadSelect,
  loading = false,
  error = null,
  onSearch,
  onContextFilter,
  onLoadMore,
  hasMore = false,
  totalUnread = 0,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContext, setSelectedContext] = useState('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Contextes disponibles basés sur les threads
  const availableContexts = useMemo(() => {
    const contexts = new Set(['all']);
    threads.forEach(thread => contexts.add(thread.context));
    return Array.from(contexts);
  }, [threads]);

  // Gestion de la recherche avec debounce
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  }, [onSearch]);

  // Changement de contexte
  const handleContextChange = useCallback((context) => {
    setSelectedContext(context);
    if (onContextFilter) {
      onContextFilter(context);
    }
  }, [onContextFilter]);

  // Formatage du temps relatif
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;

    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 168) { // 7 jours
      return `Il y a ${Math.floor(diffInHours / 24)}j`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  // Rendu d'un thread
  const renderThread = (thread) => {
    const config = contextConfig[thread.context] || contextConfig.support;
    const Icon = config.icon;
    const isSelected = selectedThreadId === thread.id;
    const hasUnread = thread.unreadCount > 0;

    return (
      <div
        key={thread.id}
        className={cn(
          "p-4 cursor-pointer transition-all duration-200 border-l-2 hover:bg-gray-50",
          isSelected 
            ? "bg-teal-50 border-l-teal-500 shadow-sm" 
            : "border-l-transparent hover:border-l-gray-200"
        )}
        onClick={() => onThreadSelect?.(thread)}
      >
        <div className="flex items-start gap-3">
          {/* Icône du contexte */}
          <div className={cn("p-2 rounded-lg flex-shrink-0", config.color)}>
            <Icon className="h-4 w-4" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Header avec badges et timestamp */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <EmeresBadge 
                  variant="secondary" 
                  size="xs" 
                  className={config.color}
                >
                  {config.label}
                </EmeresBadge>

                {thread.priority !== 'normal' && (
                  <EmeresBadge 
                    variant="secondary" 
                    size="xs"
                    className="bg-blue-100 text-amber-700"
                  >
                    {thread.priority}
                  </EmeresBadge>
                )}

                {hasUnread && (
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full text-white font-medium",
                    config.badge
                  )}>
                    {thread.unreadCount}
                  </span>
                )}
              </div>

              <span className="text-xs text-gray-500 flex-shrink-0">
                {formatRelativeTime(thread.lastActivityAt)}
              </span>
            </div>

            {/* Titre du thread */}
            <h3 className={cn(
              "font-medium truncate text-sm mb-1",
              hasUnread ? "text-gray-900" : "text-gray-700"
            )}>
              {thread.title}
            </h3>

            {/* Dernier message */}
            {thread.lastMessage && (
              <div className="text-sm text-gray-500 truncate">
                <span className="font-medium">
                  {thread.lastMessage.senderName}:
                </span>
                <span className="ml-1">
                  {thread.lastMessage.content}
                </span>
              </div>
            )}

            {/* Tags si présents */}
            {thread.tags && thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {thread.tags.slice(0, 2).map((tag, index) => (
                  <EmeresBadge key={index} variant="outline" size="xs">
                    {tag}
                  </EmeresBadge>
                ))}
                {thread.tags.length > 2 && (
                  <span className="text-xs text-gray-400">
                    +{thread.tags.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Participants */}
            <div className="flex items-center gap-1 mt-2">
              <Users className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {thread.participants.length} participant{thread.participants.length > 1 ? 's' : ''}
              </span>
              
              {thread.status !== 'active' && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500 capitalize">
                    {thread.status}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Header avec stats et recherche */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Conversations
          </h2>
          
          {totalUnread > 0 && (
            <EmeresBadge variant="primary" size="sm">
              {totalUnread} non lu{totalUnread > 1 ? 's' : ''}
            </EmeresBadge>
          )}
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <EmeresInput
            placeholder="Rechercher dans les conversations..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={cn(
              "pl-10 transition-all duration-200",
              isSearchFocused && "ring-2 ring-teal-500"
            )}
          />
        </div>

        {/* Filtres par contexte */}
        <div className="flex flex-wrap gap-2">
          {availableContexts.map((context) => {
            const config = context === 'all' 
              ? { label: 'Tous', color: 'bg-gray-100 text-gray-700' }
              : contextConfig[context];
            
            const isActive = selectedContext === context;
            const threadCount = context === 'all' 
              ? threads.length 
              : threads.filter(t => t.context === context).length;

            return (
              <button
                key={context}
                onClick={() => handleContextChange(context)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                  isActive
                    ? "bg-teal-500 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                )}
              >
                {config?.label || context}
                {threadCount > 0 && (
                  <span className={cn(
                    "ml-1.5 px-1.5 py-0.5 rounded-full text-xs",
                    isActive 
                      ? "bg-white/20 text-white" 
                      : "bg-gray-200 text-gray-600"
                  )}>
                    {threadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Liste des threads */}
      <div className="flex-1 overflow-y-auto">
        {error ? (
          <div className="p-4 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 font-medium mb-2">Erreur de chargement</p>
            <p className="text-sm text-gray-600 mb-4">{error.message}</p>
            <EmeresButton 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </EmeresButton>
          </div>
        ) : threads.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">
              {searchQuery ? 'Aucun résultat' : 'Aucune conversation'}
            </h3>
            <p className="text-sm text-gray-600">
              {searchQuery 
                ? 'Essayez un autre terme de recherche'
                : 'Vos conversations apparaîtront ici'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {threads.map(renderThread)}
            
            {/* Bouton "Charger plus" */}
            {hasMore && (
              <div className="p-4 text-center border-t">
                <EmeresButton
                  variant="ghost"
                  size="sm"
                  onClick={onLoadMore}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600 mr-2" />
                      Chargement...
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Charger plus
                    </>
                  )}
                </EmeresButton>
              </div>
            )}
          </div>
        )}

        {/* Indicateur de chargement initial */}
        {loading && threads.length === 0 && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des conversations...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadList;