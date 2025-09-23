import React, { useState, useEffect, useRef } from 'react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import EmeresInput from '../ui/EmeresInput';
import { 
  MessageSquare,
  Send,
  Lock,
  Shield,
  Search,
  Filter,
  Archive,
  Download,
  Users,
  Building,
  GraduationCap,
  User,
  HeadphonesIcon,
  ChevronRight,
  ArrowLeft,
  MoreVertical,
  Bell,
  Clock,
  Check,
  CheckCheck,
  Star,
  Pin,
  Paperclip,
  AlertCircle,
  Eye,
  FileText,
  Briefcase,
  Plus,
  Settings,
  RefreshCw
} from 'lucide-react';

// Import des nouveaux composants d'action
import NewConversationModal from './NewConversationModal';
import ThreadActionsMenu from './ThreadActionsMenu';
import MessageComposer from './MessageComposer';

// Import des hooks
import { useThreads } from '../../hooks/useThreads';
import { useMessages } from '../../hooks/useMessages';
import { useRealtime } from '../../hooks/useRealtime';
import { useToast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MessagingHub = ({ userRole }) => {
  // État local
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [showMobileThread, setShowMobileThread] = useState(false);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const { toast } = useToast();

  // Hooks pour la gestion des données
  const {
    threads,
    loading: threadsLoading,
    error: threadsError,
    totalUnread,
    filters,
    setSearch,
    setContext,
    markThreadAsRead,
    refetch: refetchThreads
  } = useThreads({
    initialFilters: { context: 'all' },
    autoRefresh: true,
    refreshInterval: 30000
  });

  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    sending,
    sendMessage,
    markAsRead
  } = useMessages({
    threadId: selectedThreadId,
    autoMarkAsRead: true,
    optimisticUpdates: true
  });

  // Hook temps réel
  const { connected: realtimeConnected } = useRealtime({
    threadId: selectedThreadId,
    enabled: !!selectedThreadId,
    onMessage: (newMessage) => {
      // Le hook useMessages gère automatiquement les nouveaux messages
      console.log('Nouveau message reçu:', newMessage);
    },
    onThreadUpdate: (threadId, updates) => {
      console.log('Thread mis à jour:', threadId, updates);
      refetchThreads();
    }
  });

  // Trouver le thread sélectionné
  const selectedThread = threads.find(t => t.id === selectedThreadId);

  // =====================================
  // ACTIONS DES BOUTONS
  // =====================================

  // Création d'une nouvelle conversation
  const handleCreateConversation = async (conversationData) => {
    try {
      // Appeler l'API pour créer une nouvelle conversation
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/threads/context/${conversationData.contextType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(conversationData)
      });

      if (response.ok) {
        toast({
          title: "Conversation créée",
          description: "Votre nouvelle conversation a été créée avec succès",
          variant: "default"
        });
        refetchThreads();
        setShowNewConversationModal(false);
      } else {
        throw new Error('Erreur lors de la création');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la conversation",
        variant: "destructive"
      });
    }
  };

  // Actions sur les threads
  const handleArchiveThread = async (threadId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/threads/${threadId}/archive`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        toast({
          title: "Thread archivé",
          description: "La conversation a été archivée",
          variant: "default"
        });
        refetchThreads();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'archiver la conversation",
        variant: "destructive"
      });
    }
  };

  const handleExportThread = async (threadId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/threads/${threadId}/export`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        const data = await response.json();
        // Créer et télécharger le fichier JSON
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversation-${threadId}.json`;
        a.click();
        URL.revokeObjectURL(url);

        toast({
          title: "Export réussi",
          description: "La conversation a été exportée",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter la conversation",
        variant: "destructive"
      });
    }
  };

  const handleMarkThreadAsRead = async (threadId) => {
    await markThreadAsRead(threadId);
  };

  const handleSendMessage = async (text, options = {}) => {
    if (!selectedThreadId) return;
    
    try {
      await sendMessage(text, options);
    } catch (error) {
      console.error('Erreur envoi message:', error);
    }
  };

  // Sélection d'un thread
  const handleThreadSelect = (thread) => {
    setSelectedThreadId(thread.id);
    setShowMobileThread(true);
    
    // Marquer comme lu après sélection
    if (thread.unreadCount > 0) {
      setTimeout(() => markThreadAsRead(thread.id), 500);
    }
  };

  const getContextIcon = (contextType) => {
    switch (contextType) {
      case 'candidature': return <Building className="h-5 w-5" />;
      case 'mentorat': return <User className="h-5 w-5" />;
      case 'scolaire': return <GraduationCap className="h-5 w-5" />;
      case 'partenariat': return <Users className="h-5 w-5" />;
      case 'stage': return <Briefcase className="h-5 w-5" />;
      case 'support': return <HeadphonesIcon className="h-5 w-5" />;
      default: return <MessageSquare className="h-5 w-5" />;
    }
  };

  const getContextColor = (contextType) => {
    switch (contextType) {
      case 'candidature': return 'text-purple-600 bg-purple-100';
      case 'mentorat': return 'text-emerald-600 bg-emerald-100';
      case 'scolaire': return 'text-blue-600 bg-blue-100';
      case 'partenariat': return 'text-orange-600 bg-orange-100';
      case 'stage': return 'text-indigo-600 bg-indigo-100';
      case 'support': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-gray-600 bg-gray-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;

    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const formatThreadTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;

    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  // Filtrer les threads selon la recherche
  const getFilteredThreads = (threadsList) => {
    if (!filters.search?.trim()) return threadsList;
    
    const query = filters.search.toLowerCase();
    return threadsList.filter(thread => 
      thread.title.toLowerCase().includes(query) ||
      (thread.lastMessage?.content || '').toLowerCase().includes(query) ||
      JSON.stringify(thread.contextData).toLowerCase().includes(query)
    );
  };

  if (threadsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre messagerie...</p>
        </div>
      </div>
    );
  }

  const filteredThreads = getFilteredThreads(threads);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Messagerie Interne ÉMÉRÉS
            </h1>
            <p className="text-gray-600 text-sm sm:text-base flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Communications professionnelles sécurisées avec chiffrement E2E
            </p>
          </div>
        </div>
        
        {/* Stats globales */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-teal-600">{totalUnread || 0}</div>
            <div className="text-xs text-gray-600">Non lus</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">
              {threads.length}
            </div>
            <div className="text-xs text-gray-600">Conversations</div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${realtimeConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-xs text-gray-600">
              {realtimeConnected ? 'Connecté' : 'Hors ligne'}
            </span>
          </div>
        </div>
      </div>

      {/* Interface principale */}
      <div className="h-[calc(100vh-280px)] flex bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Sidebar gauche - Onglets et threads */}
        <div className={`${showMobileThread ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-1/3 border-r border-gray-200`}>
          
          {/* Header avec actions */}
          <div className="p-4 border-b border-gray-200 bg-teal-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
              <div className="flex items-center gap-2">
                <EmeresBadge variant="primary" size="sm">
                  {totalUnread || 0}
                </EmeresBadge>
                <EmeresButton
                  variant="ghost"
                  size="sm"
                  onClick={refetchThreads}
                  title="Actualiser"
                >
                  <RefreshCw className="h-4 w-4" />
                </EmeresButton>
                <EmeresButton
                  variant="primary"
                  size="sm"
                  onClick={() => setShowNewConversationModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle
                </EmeresButton>
              </div>
            </div>
            
            {/* Recherche */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <EmeresInput
                placeholder="Rechercher dans toutes les conversations..."
                value={filters.search || ''}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filtres par contexte */}
            <div className="grid grid-cols-2 gap-2">
              {['all', 'candidature', 'mentorat', 'scolaire', 'support'].map((context) => {
                const contextLabels = {
                  all: 'Tous',
                  candidature: 'Candidatures',
                  mentorat: 'Mentorat', 
                  scolaire: 'École',
                  support: 'Support'
                };
                
                const isActive = (filters.context || 'all') === context;
                const threadCount = context === 'all' 
                  ? threads.length 
                  : threads.filter(t => t.context === context).length;

                return (
                  <button
                    key={context}
                    onClick={() => setContext(context)}
                    className={`
                      p-2 rounded-lg text-left text-xs transition-all duration-200
                      ${isActive 
                        ? 'bg-teal-500 text-white shadow-md' 
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{contextLabels[context]}</span>
                      {threadCount > 0 && (
                        <span className={`
                          text-xs px-1.5 py-0.5 rounded-full
                          ${isActive ? 'bg-white/20 text-white' : 'bg-teal-500 text-white'}
                        `}>
                          {threadCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Liste des threads */}
          <div className="flex-1 overflow-y-auto">
            {threadsError ? (
              <div className="p-4 text-center text-red-600">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>Erreur de chargement</p>
                <EmeresButton variant="outline" size="sm" onClick={refetchThreads} className="mt-2">
                  Réessayer
                </EmeresButton>
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="font-medium">Aucune conversation</p>
                <p className="text-sm">
                  {filters.search ? 'Aucun résultat pour cette recherche' : 'Créez votre première conversation'}
                </p>
                {!filters.search && (
                  <EmeresButton
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewConversationModal(true)}
                    className="mt-3"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle conversation
                  </EmeresButton>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors relative group ${
                      selectedThreadId === thread.id 
                        ? 'bg-teal-50 border-r-2 border-teal-500' 
                        : ''
                    }`}
                    onClick={() => handleThreadSelect(thread)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icône contexte */}
                      <div className={`p-2 rounded-lg flex-shrink-0 ${getContextColor(thread.context)}`}>
                        {getContextIcon(thread.context)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Header avec badges */}
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {thread.priority !== 'normal' && (
                              <EmeresBadge variant="secondary" size="xs">
                                {thread.priority}
                              </EmeresBadge>
                            )}
                            {thread.unreadCount > 0 && (
                              <span className="bg-teal-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                                {thread.unreadCount}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">
                              {formatThreadTime(thread.lastActivityAt)}
                            </span>
                            
                            {/* Menu d'actions (visible au hover) */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <ThreadActionsMenu
                                thread={thread}
                                onArchive={handleArchiveThread}
                                onMarkAsRead={handleMarkThreadAsRead}
                                onExport={handleExportThread}
                                userRole={userRole}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Titre du thread */}
                        <h3 className="font-medium text-gray-900 truncate text-sm mb-1">
                          {thread.title}
                        </h3>
                        
                        {/* Dernier message */}
                        {thread.lastMessage && (
                          <div className="text-sm text-gray-500 truncate">
                            <span className="font-medium">{thread.lastMessage.senderName}:</span>
                            <span className="ml-1">{thread.lastMessage.content}</span>
                          </div>
                        )}
                        
                        {/* Sécurité */}
                        <div className="flex items-center gap-1 mt-2">
                          <Lock className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">Chiffré E2E</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zone de conversation */}
        <div className={`${showMobileThread ? 'flex' : 'hidden lg:flex'} flex-1 flex-col`}>
          {selectedThread && selectedThread ? (
            <>
              {/* Header du thread */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <EmeresButton
                      variant="ghost"
                      size="sm"
                      icon={<ArrowLeft />}
                      onClick={() => setShowMobileThread(false)}
                      className="lg:hidden"
                    />
                    
                    <div className={`p-2 rounded-lg ${getContextColor(selectedThread.context)}`}>
                      {getContextIcon(selectedThread.context)}
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedThread.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <EmeresBadge variant="secondary" size="xs">
                          {selectedThread.context}
                        </EmeresBadge>
                        <div className="flex items-center gap-1">
                          <Lock className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">Chiffré E2E</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{selectedThread.participants?.length} participant{selectedThread.participants?.length > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ThreadActionsMenu
                      thread={selectedThread}
                      onArchive={handleArchiveThread}
                      onMarkAsRead={handleMarkThreadAsRead}
                      onExport={handleExportThread}
                      userRole={userRole}
                    />
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messagesLoading && messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des messages...</p>
                  </div>
                ) : messagesError ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">Erreur de chargement des messages</p>
                    <EmeresButton variant="outline" size="sm" className="mt-2">
                      Réessayer
                    </EmeresButton>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucun message dans cette conversation</p>
                    <p className="text-sm text-gray-500">Commencez la conversation ci-dessous</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] ${message.isOwn ? 'order-2' : 'order-1'}`}>
                        {/* Nom de l'expéditeur (si pas le sien) */}
                        {!message.isOwn && (
                          <div className="text-xs text-gray-600 mb-1 font-medium">
                            {message.senderName}
                          </div>
                        )}
                        
                        <div
                          className={`px-4 py-3 rounded-lg ${
                            message.isOwn
                              ? 'bg-teal-500 text-white'
                              : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                          }`}
                        >
                          {/* Message important */}
                          {message.isImportant && (
                            <div className={`flex items-center gap-1 mb-2 text-xs ${
                              message.isOwn ? 'text-teal-100' : 'text-orange-600'
                            }`}>
                              <Star className="h-3 w-3" />
                              <span>Message important</span>
                            </div>
                          )}
                          
                          {/* Contenu (déchiffré automatiquement par le backend) */}
                          <p className="whitespace-pre-wrap">{message.body}</p>
                          
                          {/* Pièces jointes */}
                          {message.attachments?.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className={`flex items-center gap-2 text-sm p-2 rounded ${
                                  message.isOwn ? 'bg-teal-600' : 'bg-gray-100'
                                }`}>
                                  <Paperclip className="h-3 w-3" />
                                  <span className="truncate">{attachment.filename}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Métadonnées du message */}
                        <div className={`text-xs text-gray-500 mt-1 flex items-center gap-2 ${
                          message.isOwn ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>{formatMessageTime(message.createdAt)}</span>
                          {message.isOwn && (
                            <span>
                              {message.isRead ? (
                                <CheckCheck className="inline h-3 w-3 text-teal-600" />
                              ) : (
                                <Check className="inline h-3 w-3" />
                              )}
                            </span>
                          )}
                          <Lock className="h-3 w-3 text-green-600" title="Message chiffré E2E" />
                          {message.editedAt && (
                            <span className="italic">modifié</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Zone de saisie avec nouveau composant */}
              <MessageComposer
                thread={selectedThread}
                onSendMessage={handleSendMessage}
                sending={sending}
                disabled={selectedThread.status !== 'active'}
              />
            </>
          ) : (
            /* Aucun thread sélectionné */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center max-w-md">
                <div className="mb-6">
                  <Shield className="h-20 w-20 text-teal-500 mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Messagerie Interne Multi-Contextes
                </h3>
                <p className="text-gray-600 mb-6">
                  Sélectionnez une conversation pour commencer à échanger dans un environnement 
                  sécurisé et contextualisé selon votre rôle.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span>Chiffrement E2E</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span>Audit complet</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>RBAC strict</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="h-4 w-4 text-orange-600" />
                    <span>Export PDF</span>
                  </div>
                </div>
                
                {threads.length === 0 && (
                  <div className="mt-8">
                    <EmeresButton
                      variant="primary"
                      onClick={() => setShowNewConversationModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Créer votre première conversation
                    </EmeresButton>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal nouvelle conversation */}
      <NewConversationModal
        isOpen={showNewConversationModal}
        onClose={() => setShowNewConversationModal(false)}
        onCreateConversation={handleCreateConversation}
        userRole={userRole}
        availableUsers={[]} // À implémenter avec vraie liste d'utilisateurs
        loading={false}
      />
    </div>
  );
};

export default MessagingHub;