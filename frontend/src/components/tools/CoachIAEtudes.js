import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import EmeresInput from '../ui/EmeresInput';
import {
  Brain,
  Send,
  MessageSquare,
  BookOpen,
  Target,
  Clock,
  Star,
  TrendingUp,
  Plus,
  MoreVertical,
  RefreshCw,
  Sparkles,
  User,
  Bot
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CoachIAEtudes = ({ user }) => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const messagesEndRef = useRef(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Auto-scroll vers le bas des messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Charger les sessions existantes au démarrage
  useEffect(() => {
    loadCoachSessions();
  }, []);

  const loadCoachSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/api/tools/coach-ia/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.sessions) {
        setSessions(response.data.sessions);

        // Si pas de session courante et qu'il y a des sessions, prendre la plus récente
        if (!currentSession && response.data.sessions.length > 0) {
          const latestSession = response.data.sessions[0];
          setCurrentSession(latestSession);
          loadChatHistory(latestSession.session_id);
        }
      }
    } catch (error) {
      console.error('Erreur chargement sessions:', error);
    }
  };

  const createNewSession = async () => {
    setIsCreatingSession(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${backendUrl}/api/tools/coach-ia/session`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const newSession = {
          session_id: response.data.session_id,
          tool_type: 'coach_ia',
          created_at: new Date().toISOString(),
          metadata: {}
        };

        setSessions(prev => [newSession, ...prev]);
        setCurrentSession(newSession);
        setMessages([]);

        toast({
          title: "Nouvelle session créée",
          description: "Votre session de coaching IA est prête !",
          variant: "success",
        });
      }
    } catch (error) {
      console.error('Erreur création session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer une nouvelle session",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSession(false);
    }
  };

  const loadChatHistory = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/api/tools/coach-ia/history/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.history) {
        setMessages(response.data.history);
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !currentSession || isLoading) return;

    const userMessage = messageInput.trim();
    setMessageInput('');
    setIsLoading(true);

    // Ajouter le message utilisateur immédiatement
    const tempUserMessage = {
      message_id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${backendUrl}/api/tools/coach-ia/chat/${currentSession.session_id}`,
        { message: userMessage },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Remplacer le message temporaire et ajouter la réponse
        const aiMessage = {
          message_id: response.data.message_id,
          role: 'assistant',
          content: response.data.response,
          timestamp: response.data.timestamp
        };

        setMessages(prev => [
          ...prev.filter(msg => msg.message_id !== tempUserMessage.message_id),
          {
            ...tempUserMessage,
            message_id: `user-${Date.now()}`
          },
          aiMessage
        ]);
      } else {
        throw new Error(response.data.message || response.data.error || 'Erreur de communication');
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);

      // Supprimer le message temporaire en cas d'erreur
      setMessages(prev => prev.filter(msg => msg.message_id !== tempUserMessage.message_id));

      toast({
        title: error.message === 'ai_unavailable' ? "IA indisponible" : "Erreur",
        description: error.message === 'ai_unavailable'
          ? "L'IA conversationnelle n'est pas encore activée. Réessayez plus tard."
          : error.message || "Impossible d'envoyer le message. Réessayez.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionPreview = (session) => {
    if (session.last_message) {
      return session.last_message.content.substring(0, 60) + '...';
    }
    return 'Nouvelle session de coaching';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />

      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10">

        {/* Header avec design amélioré */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4 relative">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center relative">
              <Brain className="h-6 w-6 text-white" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl animate-pulse opacity-50"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Coach IA Études
                <EmeresBadge variant="default" size="sm" className="bg-blue-100 text-blue-700">
                  IA
                </EmeresBadge>
              </h1>
              <p className="text-gray-600">Votre assistant intelligent pour l'apprentissage et la productivité</p>
            </div>
          </div>

          {/* Suggestions d'utilisation avec images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-blue-200 hover:border-blue-300 transition-colors duration-300 relative overflow-hidden group">
              {/* Image de fond pour Méthodes d'étude */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Méthodes d'étude</span>
                </div>
                <p className="text-sm text-gray-600">Techniques de mémorisation, planning de révisions, organisation</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-purple-200 hover:border-purple-300 transition-colors duration-300 relative overflow-hidden group">
              {/* Image de fond pour Productivité */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1606248896999-387b3a9f621c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Productivité</span>
                </div>
                <p className="text-sm text-gray-600">Gestion du temps, motivation, élimination de la procrastination</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-pink-200 hover:border-pink-300 transition-colors duration-300 relative overflow-hidden group">
              {/* Image de fond pour Orientation */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-pink-600" />
                  <span className="font-medium text-gray-900">Orientation</span>
                </div>
                <p className="text-sm text-gray-600">Conseils carrière, choix de formation, stratégies</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">

          {/* Sidebar des sessions - Responsive */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <EmeresCard>
              <EmeresCardHeader className="flex flex-row items-center justify-between">
                <EmeresCardTitle className="text-base sm:text-lg">Mes Sessions</EmeresCardTitle>
                <EmeresButton
                  variant="ghost"
                  size="sm"
                  onClick={createNewSession}
                  disabled={isCreatingSession}
                  icon={isCreatingSession ? <RefreshCw className="animate-spin" /> : <Plus />}
                  className="text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Nouvelle</span>
                  <span className="sm:hidden">+</span>
                </EmeresButton>
              </EmeresCardHeader>
              <EmeresCardContent>
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <button
                      key={session.session_id}
                      onClick={() => {
                        setCurrentSession(session);
                        loadChatHistory(session.session_id);
                      }}
                      className={`w-full text-left p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                        currentSession?.session_id === session.session_id
                          ? 'bg-blue-100 border-2 border-blue-300'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 sm:gap-2 mb-1">
                            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              Session {sessions.indexOf(session) + 1}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                            {getSessionPreview(session)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(session.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}

                  {sessions.length === 0 && (
                    <div className="text-center py-4 sm:py-8">
                      <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2 sm:mb-3" />
                      <p className="text-xs sm:text-sm text-gray-600">Aucune session</p>
                      <p className="text-xs text-gray-500">Créez votre première session</p>
                    </div>
                  )}
                </div>
              </EmeresCardContent>
            </EmeresCard>
          </div>

          {/* Zone de chat principale - Responsive */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            <EmeresCard className="h-[500px] sm:h-[600px] lg:h-[700px] flex flex-col">
              <EmeresCardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <EmeresCardTitle>
                        {currentSession ? `Session de Coaching` : 'Aucune session active'}
                      </EmeresCardTitle>
                      <EmeresCardDescription>
                        {currentSession
                          ? 'Posez vos questions sur l\'apprentissage et la productivité'
                          : 'Créez une nouvelle session pour commencer'
                        }
                      </EmeresCardDescription>
                    </div>
                  </div>

                  {currentSession && (
                    <EmeresBadge variant="secondary" className="bg-green-100 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Actif
                    </EmeresBadge>
                  )}
                </div>
              </EmeresCardHeader>

              {/* Zone des messages */}
              <EmeresCardContent className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                  {!currentSession ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Commencez une session de coaching</h3>
                        <p className="text-gray-500 mb-4">Créez une nouvelle session pour discuter avec votre Coach IA</p>
                        <EmeresButton
                          onClick={createNewSession}
                          disabled={isCreatingSession}
                          icon={isCreatingSession ? <RefreshCw className="animate-spin" /> : <Plus />}
                        >
                          {isCreatingSession ? 'Création...' : 'Nouvelle Session'}
                        </EmeresButton>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Sparkles className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Session prête !</h3>
                        <p className="text-gray-500 mb-4">Posez votre première question au Coach IA</p>
                        <div className="text-sm text-gray-400">
                          <p>Exemples : "Comment organiser mes révisions ?" ou "J'ai du mal à me concentrer"</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <div
                          key={message.message_id}
                          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.role === 'assistant' && (
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                          )}

                          <div className={`max-w-[80%] rounded-xl p-4 ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white ml-auto'
                              : 'bg-white border shadow-sm'
                          }`}>
                            <div className="whitespace-pre-wrap break-words">
                              {message.content}
                            </div>
                            <div className={`text-xs mt-2 ${
                              message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                            }`}>
                              {formatTime(message.timestamp)}
                            </div>
                          </div>

                          {message.role === 'user' && (
                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                      ))}

                      {isLoading && (
                        <div className="flex gap-3 justify-start">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-white border shadow-sm rounded-xl p-4">
                            <div className="flex items-center gap-2">
                              <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                              <span className="text-gray-600">Le Coach IA réfléchit...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Zone de saisie */}
                {currentSession && (
                  <div className="border-t pt-4">
                    <div className="flex gap-3">
                      <EmeresInput
                        placeholder="Posez votre question au Coach IA..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                        disabled={isLoading}
                      />
                      <EmeresButton
                        onClick={sendMessage}
                        disabled={!messageInput.trim() || isLoading}
                        icon={isLoading ? <RefreshCw className="animate-spin" /> : <Send />}
                      >
                        {isLoading ? '' : 'Envoyer'}
                      </EmeresButton>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      Appuyez sur Entrée pour envoyer • Shift + Entrée pour une nouvelle ligne
                    </div>
                  </div>
                )}
              </EmeresCardContent>
            </EmeresCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachIAEtudes;
