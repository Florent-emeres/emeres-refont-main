import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { toast } from 'sonner';
import { 
  Users,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Volume2,
  VolumeX,
  Settings,
  MessageCircle,
  Coffee,
  CheckCircle,
  Target,
  Timer,
  Zap
} from 'lucide-react';
import creditsService from '../services/creditsService';

const FocusRoomApp = ({ roomId, onClose }) => {
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [sessionState, setSessionState] = useState('idle'); // idle, focus, break
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes par défaut
  const [currentSession, setCurrentSession] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (roomId) {
      loadRoomData();
      // Simulation de la mise à jour en temps réel des participants
      const interval = setInterval(loadRoomData, 10000);
      return () => clearInterval(interval);
    }
  }, [roomId]);

  useEffect(() => {
    let interval = null;
    if (sessionState === 'focus' || sessionState === 'break') {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionState]);

  const loadRoomData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/premium/focus/rooms`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const currentRoom = data.rooms.find(r => r.id === roomId);
        if (currentRoom) {
          setRoom(currentRoom);
          setParticipants(currentRoom.current_participants || []);
        }
      }
    } catch (err) {
      console.error('Erreur chargement salle:', err);
    }
  };

  const handleSessionEnd = async () => {
    if (sessionState === 'focus') {
      // Fin d'une session de focus
      setTotalSessions(prev => prev + 1);
      setSessionState('break');
      setTimeLeft(5 * 60); // 5 minutes de pause
      
      if (soundEnabled) {
        // Jouer son de fin de session
        playNotificationSound();
      }
      
      toast.success('🎉 Session de focus terminée ! Temps de pause.');
      
      // Attribution automatique de points pour session terminée
      await creditsService.awardPoints('skill_test', {
        session_type: 'focus_room',
        room_id: roomId,
        duration_minutes: Math.floor((25 * 60 - timeLeft) / 60)
      });
      
    } else if (sessionState === 'break') {
      // Fin de la pause
      setSessionState('idle');
      setCurrentSession(prev => prev + 1);
      setTimeLeft(25 * 60);
      
      if (soundEnabled) {
        playNotificationSound();
      }
      
      toast.success('⚡ Pause terminée ! Prêt pour la prochaine session ?');
    }
  };

  const playNotificationSound = () => {
    // Simulation du son
    console.log('🔔 Notification sonore');
  };

  const startFocusSession = () => {
    setSessionState('focus');
    setTimeLeft(25 * 60); // 25 minutes
    toast.success('🎯 Session de focus démarrée !');
  };

  const pauseSession = () => {
    setSessionState('idle');
    toast.info('⏸️ Session mise en pause');
  };

  const resetSession = () => {
    setSessionState('idle');
    setTimeLeft(25 * 60);
    toast.info('🔄 Session réinitialisée');
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: user.first_name || 'Vous',
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionTypeLabel = () => {
    switch (sessionState) {
      case 'focus': return 'Focus';
      case 'break': return 'Pause';
      default: return 'En attente';
    }
  };

  const getSessionColor = () => {
    switch (sessionState) {
      case 'focus': return 'text-green-600 bg-green-100';
      case 'break': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la salle de focus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec contrôles */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Retour
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{room.name}</h1>
              <p className="text-sm text-gray-600">
                {participants.length} participant{participants.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg ${soundEnabled ? 'text-teal-600' : 'text-gray-400'}`}
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
            <Settings className="h-5 w-5 text-gray-400 cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timer principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="mb-6">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getSessionColor()}`}>
                  <Timer className="h-4 w-4 mr-2" />
                  {getSessionTypeLabel()}
                </div>
              </div>
              
              <div className="mb-8">
                <div className="text-6xl md:text-8xl font-mono font-bold text-gray-900 mb-4">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-lg text-gray-600">
                  Session {currentSession} • {totalSessions} terminée{totalSessions > 1 ? 's' : ''}
                </div>
              </div>
              
              {/* Contrôles */}
              <div className="flex justify-center space-x-4">
                {sessionState === 'idle' && (
                  <button
                    onClick={startFocusSession}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Play className="h-5 w-5" />
                    <span>Démarrer Focus</span>
                  </button>
                )}
                
                {(sessionState === 'focus' || sessionState === 'break') && (
                  <button
                    onClick={pauseSession}
                    className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center space-x-2"
                  >
                    <Pause className="h-5 w-5" />
                    <span>Pause</span>
                  </button>
                )}
                
                <button
                  onClick={resetSession}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Reset</span>
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="mt-8">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      sessionState === 'focus' ? 'bg-green-500' : 
                      sessionState === 'break' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{ 
                      width: sessionState !== 'idle' 
                        ? `${((sessionState === 'focus' ? 25*60 : 5*60) - timeLeft) / (sessionState === 'focus' ? 25*60 : 5*60) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Statistiques de session */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{totalSessions}</div>
                <div className="text-sm text-gray-600">Sessions</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.floor(totalSessions * 25 / 60)}h{(totalSessions * 25) % 60}m</div>
                <div className="text-sm text-gray-600">Temps total</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{participants.length}</div>
                <div className="text-sm text-gray-600">Participants</div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Participants et Chat */}
          <div className="space-y-6">
            {/* Participants */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Users className="h-5 w-5 text-teal-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Participants</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.first_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.first_name} (Vous)</div>
                    <div className="text-xs text-green-600 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      En ligne
                    </div>
                  </div>
                </div>
                
                {/* Simulation d'autres participants */}
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">
                      {`P${i}`}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Participant {i}</div>
                      <div className="text-xs text-green-600 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        En focus
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chat rapide */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <MessageCircle className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Chat</h3>
              </div>
              
              <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                {messages.map(message => (
                  <div key={message.id} className="text-sm">
                    <div className="font-medium text-gray-900">{message.user}</div>
                    <div className="text-gray-600">{message.message}</div>
                    <div className="text-xs text-gray-400">{message.timestamp}</div>
                  </div>
                ))}
                
                {messages.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-4">
                    Aucun message pour le moment
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Message rapide..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-teal-600 text-white px-3 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  →
                </button>
              </div>
            </div>
            
            {/* Motivational */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center">
              <Zap className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Restez motivé !</h3>
              <p className="text-sm text-purple-100">
                Chaque session vous rapproche de vos objectifs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusRoomApp;