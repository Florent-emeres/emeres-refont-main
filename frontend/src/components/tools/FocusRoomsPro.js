import React, { useState, useEffect } from 'react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import { 
  Users, 
  Volume2, 
  Shield, 
  Play, 
  Pause,
  Clock,
  Settings,
  Plus,
  UserPlus,
  Headphones,
  Timer,
  Zap,
  Star
} from 'lucide-react';

const FocusRoomsPro = ({ user }) => {
  const [activeRoom, setActiveRoom] = useState(null);
  const [timer, setTimer] = useState({ minutes: 25, seconds: 0 });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedSoundscape, setSelectedSoundscape] = useState('forest');

  const focusRooms = [
    {
      id: 'deep-focus',
      name: 'Deep Focus Session',
      description: 'Session de concentration profonde',
      participants: 12,
      maxParticipants: 25,
      category: 'Étude',
      difficulty: 'Expert',
      duration: '50min',
      soundscape: 'forest'
    },
    {
      id: 'pomodoro-group',
      name: 'Pomodoro Collectif',
      description: 'Sessions Pomodoro en groupe',
      participants: 8,
      maxParticipants: 15,
      category: 'Productivité',
      difficulty: 'Intermédiaire',
      duration: '25min',
      soundscape: 'rain'
    },
    {
      id: 'exam-prep',
      name: 'Préparation Examens',
      description: 'Révisions intensives partagées',
      participants: 15,
      maxParticipants: 30,
      category: 'Révisions',
      difficulty: 'Débutant',
      duration: '90min',
      soundscape: 'cafe'
    }
  ];

  const soundscapes = [
    { id: 'forest', name: 'Forêt mystique', icon: '🌲', description: 'Sons de la nature apaisants' },
    { id: 'rain', name: 'Pluie douce', icon: '🌧️', description: 'Bruit de pluie relaxant' },
    { id: 'cafe', name: 'Café studieux', icon: '☕', description: 'Ambiance café cosy' },
    { id: 'ocean', name: 'Océan calme', icon: '🌊', description: 'Vagues apaisantes' },
    { id: 'library', name: 'Bibliothèque', icon: '📚', description: 'Silence studieux' }
  ];

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && activeRoom) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer.seconds === 0) {
            if (prevTimer.minutes === 0) {
              setIsTimerRunning(false);
              // Timer finished
              return { minutes: 25, seconds: 0 };
            }
            return { minutes: prevTimer.minutes - 1, seconds: 59 };
          }
          return { ...prevTimer, seconds: prevTimer.seconds - 1 };
        });
      }, 1000);
    } else if (!isTimerRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, activeRoom]);

  const joinRoom = (room) => {
    setActiveRoom(room);
    setSelectedSoundscape(room.soundscape);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const formatTime = (time) => {
    return `${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Image pour Focus Rooms */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-8"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1606248896999-387b3a9f621c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      {/* Overlay pour maintenir le contraste */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50/90 via-indigo-50/90 to-purple-50/90" />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Focus Rooms Pro</h1>
              <p className="text-gray-600">Salles de concentration collaborative avec ambiances sonores</p>
            </div>
            <EmeresBadge variant="primary" className="ml-auto">
              <Star className="w-4 h-4 mr-1" />
              Premium
            </EmeresBadge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Liste des salles disponibles */}
          <div className="lg:col-span-2">
            <EmeresCard className="overflow-hidden relative">
              {/* Image de fond pour carte des salles */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`
                }}
              />
              
              <EmeresCardHeader className="relative z-10">
                <EmeresCardTitle>Salles Disponibles</EmeresCardTitle>
                <EmeresCardDescription>
                  Rejoignez une session de concentration collaborative
                </EmeresCardDescription>
              </EmeresCardHeader>
              <EmeresCardContent className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {focusRooms.map((room) => (
                    <div 
                      key={room.id}
                      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden relative ${
                        activeRoom?.id === room.id
                          ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => joinRoom(room)}
                    >
                      {/* Mini background pour chaque salle */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                        style={{
                          backgroundImage: `url('https://images.unsplash.com/photo-1606248896999-387b3a9f621c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')`
                        }}
                      />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{room.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{room.participants}/{room.maxParticipants}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{room.duration}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <EmeresBadge size="sm" variant="secondary">
                              {room.category}
                            </EmeresBadge>
                            <EmeresBadge 
                              size="sm" 
                              variant={room.difficulty === 'Expert' ? 'destructive' : 
                                      room.difficulty === 'Intermédiaire' ? 'default' : 'secondary'}
                            >
                              {room.difficulty}
                            </EmeresBadge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(room.participants / room.maxParticipants) * 100}%` }}
                            />
                          </div>
                          <span className="ml-3 text-xs text-gray-600">
                            {Math.round((room.participants / room.maxParticipants) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <EmeresButton 
                    variant="outline" 
                    icon={<Plus />}
                    className="w-full md:w-auto"
                  >
                    Créer une nouvelle salle
                  </EmeresButton>
                </div>
              </EmeresCardContent>
            </EmeresCard>
          </div>

          {/* Panneau de contrôle */}
          <div className="space-y-6">
            
            {/* Timer de focus */}
            <EmeresCard className="overflow-hidden relative">
              {/* Image de fond pour timer */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')`
                }}
              />
              
              <EmeresCardHeader className="relative z-10">
                <EmeresCardTitle>Timer de Focus</EmeresCardTitle>
                <EmeresCardDescription>
                  {activeRoom ? `Session: ${activeRoom.name}` : 'Sélectionnez une salle'}
                </EmeresCardDescription>
              </EmeresCardHeader>
              <EmeresCardContent className="text-center relative z-10">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {formatTime(timer)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isTimerRunning ? 'En cours...' : 'En pause'}
                  </div>
                </div>
                
                <div className="flex gap-3 justify-center mb-4">
                  <EmeresButton
                    onClick={toggleTimer}
                    disabled={!activeRoom}
                    icon={isTimerRunning ? <Pause /> : <Play />}
                    variant={isTimerRunning ? "destructive" : "primary"}
                  >
                    {isTimerRunning ? 'Pause' : 'Démarrer'}
                  </EmeresButton>
                  
                  <EmeresButton 
                    variant="outline" 
                    icon={<Settings />}
                    disabled={!activeRoom}
                  >
                    Réglages
                  </EmeresButton>
                </div>
                
                {activeRoom && (
                  <div className="text-xs text-gray-500">
                    {activeRoom.participants} autres personnes se concentrent avec vous
                  </div>
                )}
              </EmeresCardContent>
            </EmeresCard>

            {/* Ambiances sonores */}
            <EmeresCard className="overflow-hidden relative">
              {/* Image de fond pour soundscapes */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')`
                }}
              />
              
              <EmeresCardHeader className="relative z-10">
                <EmeresCardTitle>Ambiances Sonores</EmeresCardTitle>
                <EmeresCardDescription>
                  Choisissez votre environnement sonore
                </EmeresCardDescription>
              </EmeresCardHeader>
              <EmeresCardContent className="relative z-10">
                <div className="space-y-3">
                  {soundscapes.map((soundscape) => (
                    <button
                      key={soundscape.id}
                      onClick={() => setSelectedSoundscape(soundscape.id)}
                      className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                        selectedSoundscape === soundscape.id
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{soundscape.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{soundscape.name}</div>
                          <div className="text-xs text-gray-600">{soundscape.description}</div>
                        </div>
                        {selectedSoundscape === soundscape.id && (
                          <Volume2 className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Volume</span>
                    <span className="text-gray-900">75%</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-3/4" />
                  </div>
                </div>
              </EmeresCardContent>
            </EmeresCard>

            {/* Statistiques de session */}
            <EmeresCard className="overflow-hidden relative">
              {/* Image de fond pour stats */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')`
                }}
              />
              
              <EmeresCardHeader className="relative z-10">
                <EmeresCardTitle>Vos Statistiques</EmeresCardTitle>
              </EmeresCardHeader>
              <EmeresCardContent className="relative z-10">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">2h 15min</div>
                    <div className="text-xs text-gray-600">Aujourd'hui</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-xs text-gray-600">Sessions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">87%</div>
                    <div className="text-xs text-gray-600">Focus Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">5j</div>
                    <div className="text-xs text-gray-600">Streak</div>
                  </div>
                </div>
              </EmeresCardContent>
            </EmeresCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusRoomsPro;