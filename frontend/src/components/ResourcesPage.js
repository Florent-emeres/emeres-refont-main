import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { toast } from 'sonner';
import { 
  Users,
  Headphones,
  Shield,
  Target,
  Trophy,
  BookOpen,
  Brain,
  TrendingUp,
  GamepadIcon,
  Crown,
  Play,
  Clock,
  Star,
  Zap,
  ChevronRight,
  Lock,
  CheckCircle,
  Focus,
  Sparkles,
  Award
} from 'lucide-react';

const ResourcesPage = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [availableModules, setAvailableModules] = useState([]);
  const [focusRooms, setFocusRooms] = useState([]);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (user) {
      loadResourcesData();
    }
  }, [user]);

  const loadResourcesData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Charger l'abonnement, les focus rooms, et les quêtes
      const [subscriptionRes, roomsRes, questsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/premium/my-subscription`, { headers }),
        fetch(`${BACKEND_URL}/api/premium/focus/rooms`, { headers }),
        fetch(`${BACKEND_URL}/api/premium/learning/quests`, { headers })
      ]);

      if (subscriptionRes.ok) {
        const subData = await subscriptionRes.json();
        setSubscription(subData.subscription);
        
        // Déterminer les modules disponibles basés sur l'abonnement
        if (subData.subscription && subData.tier_config) {
          setAvailableModules(subData.tier_config.modules || []);
        }
      }

      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        setFocusRooms(roomsData.rooms || []);
      }

      if (questsRes.ok) {
        const questsData = await questsRes.json();
        setQuests(questsData.quests || []);
      }

    } catch (err) {
      toast.error(`Erreur lors du chargement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const joinFocusRoom = async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/premium/focus/join-room`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ room_id: roomId })
      });

      if (response.ok) {
        toast.success('🎉 Vous avez rejoint la salle de focus !');
        loadResourcesData(); // Rafraîchir
      } else {
        const error = await response.json();
        toast.error(`❌ ${error.detail}`);
      }
    } catch (err) {
      toast.error(`❌ Erreur: ${err.message}`);
    }
  };

  const createFocusRoom = async () => {
    try {
      const roomName = prompt('Nom de votre salle de focus :');
      if (!roomName) return;

      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/premium/focus/create-room`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: roomName,
          room_type: 'private',
          max_participants: 10
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`🎉 Salle "${roomName}" créée avec succès !`);
        loadResourcesData(); // Rafraîchir
      } else {
        const error = await response.json();
        toast.error(`❌ ${error.detail}`);
      }
    } catch (err) {
      toast.error(`❌ Erreur: ${err.message}`);
    }
  };

  const startQuest = (questId) => {
    toast.success(`🎮 Démarrage de la quête... (Simulation)`);
    // Ici on intégrerait la logique de lancement de quête
  };

  const getModuleIcon = (moduleType) => {
    const icons = {
      focus_rooms: Users,
      soundscapes: Headphones,
      distraction_blocker: Shield,
      flow_coach: Target,
      micro_quests: Trophy,
      spaced_repetition: BookOpen,
      ai_study_coach: Brain,
      assessment_simulation: TrendingUp,
      career_escape_room: GamepadIcon,
      sponsored_tournaments: Crown
    };
    return icons[moduleType] || Sparkles;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos ressources...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Ressources Premium
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Vous devez avoir un abonnement actif pour accéder aux ressources premium.
            </p>
            <button
              onClick={() => window.location.href = '/premium'}
              className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Découvrir Premium
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Image globale avec contraste optimal */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-12 relative overflow-hidden">
        {/* Background image pour header avec overlay fort pour le contraste */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/90 to-cyan-500/90" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Mes Ressources Premium
              </h1>
              <p className="text-xl text-teal-100">
                Tous vos outils débloqués avec {subscription.subscription_tier}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-2xl p-4 text-center">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Abonnement Actif</span>
              </div>
              <p className="text-sm text-teal-100">
                Expire le {new Date(subscription.end_date).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Outils IA ÉMÉRÉS (fonctionnalités existantes) */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Outils IA ÉMÉRÉS</h2>
              <p className="text-gray-600">Intelligence artificielle pour votre réussite professionnelle</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* IA Matching */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">IA Matching</h3>
                  <p className="text-sm text-gray-600">Offres recommandées</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Intelligence artificielle qui analyse votre profil pour vous proposer les meilleures opportunités
              </p>
              <button
                onClick={() => window.location.href = '/student-dashboard?page=ai-matching'}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Target className="h-4 w-4" />
                <span>Découvrir mes offres</span>
              </button>
            </div>

            {/* CV Generator */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">CV Generator</h3>
                  <p className="text-sm text-gray-600">Création de CV</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Générateur intelligent de CV personnalisés selon votre profil et le poste visé
              </p>
              <button
                onClick={() => window.location.href = '/student-dashboard?page=cv-generator'}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Award className="h-4 w-4" />
                <span>Créer mon CV</span>
              </button>
            </div>

            {/* Lettre IA */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Lettre IA</h3>
                  <p className="text-sm text-gray-600">Génération automatique</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                IA qui génère des lettres de motivation personnalisées pour chaque candidature
              </p>
              <button
                onClick={() => window.location.href = '/student-dashboard?page=lettre-ia'}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Zap className="h-4 w-4" />
                <span>Générer ma lettre</span>
              </button>
            </div>

            {/* Entretien IA */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Entretien IA</h3>
                  <p className="text-sm text-gray-600">Simulation d'entretiens</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Entraînez-vous aux entretiens avec notre IA qui simule des recruteurs réels
              </p>
              <button
                onClick={() => window.location.href = '/student-dashboard?page=entretien-ia'}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>S'entraîner</span>
              </button>
            </div>
          </div>
        </div>

        {/* Focus Tools */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
              <Focus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Outils de Concentration</h2>
              <p className="text-gray-600">Boostez votre productivité et votre focus</p>
            </div>
          </div>

          {availableModules.includes('focus_rooms') && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Focus Rooms</h3>
                    <p className="text-gray-600">Salles de travail collaboratives</p>
                  </div>
                </div>
                <button
                  onClick={createFocusRoom}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Créer une Salle
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {focusRooms.slice(0, 6).map((room) => (
                  <div key={room.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{room.name}</h4>
                      {room.is_premium && (
                        <Crown className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{room.current_participants?.length || 0}/{room.max_participants} participants</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        room.room_type === 'public' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {room.room_type}
                      </span>
                    </div>
                    <button
                      onClick={() => joinFocusRoom(room.id)}
                      className="w-full bg-teal-600 text-white py-2 px-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>Rejoindre</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Autres outils Focus */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableModules.includes('soundscapes') && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Headphones className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Soundscapes</h3>
                    <p className="text-sm text-gray-600">Ambiances de concentration</p>
                  </div>
                </div>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Lancer
                </button>
              </div>
            )}

            {availableModules.includes('distraction_blocker') && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-red-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Bloqueur</h3>
                    <p className="text-sm text-gray-600">Anti-distractions</p>
                  </div>
                </div>
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                  Activer
                </button>
              </div>
            )}

            {availableModules.includes('flow_coach') && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Coach Flow</h3>
                    <p className="text-sm text-gray-600">Assistant concentration</p>
                  </div>
                </div>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Démarrer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Learning Tools */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Outils d'Apprentissage</h2>
              <p className="text-gray-600">Accélérez votre développement de compétences</p>
            </div>
          </div>

          {availableModules.includes('micro_quests') && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Trophy className="h-8 w-8 text-amber-600 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Quêtes Micro-Learning</h3>
                    <p className="text-gray-600">Parcours gamifiés de compétences</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quests.slice(0, 6).map((quest) => (
                  <div key={quest.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{quest.title}</h4>
                      <div className="flex items-center text-sm text-amber-600">
                        <Star className="h-4 w-4 mr-1" />
                        <span>{quest.difficulty_level}/5</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{quest.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{quest.estimated_duration_minutes}min</span>
                      <span>+{quest.points_reward} points</span>
                    </div>
                    <button
                      onClick={() => startQuest(quest.id)}
                      className="w-full bg-amber-600 text-white py-2 px-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>Commencer</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Autres outils Learning */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableModules.includes('spaced_repetition') && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Cartes Mémoires</h3>
                    <p className="text-sm text-gray-600">Révision espacée</p>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Réviser
                </button>
              </div>
            )}

            {availableModules.includes('ai_study_coach') && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Brain className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Coach IA</h3>
                    <p className="text-sm text-gray-600">Assistant d'études</p>
                  </div>
                </div>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Discuter
                </button>
              </div>
            )}

            {availableModules.includes('assessment_simulation') && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Simulations</h3>
                    <p className="text-sm text-gray-600">Entraînement pro</p>
                  </div>
                </div>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Simuler
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Outils de Suivi & Analytics */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Suivi & Analytics</h2>
              <p className="text-gray-600">Suivez votre progression et optimisez vos résultats</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Ma Progression */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-amber-600 mr-3" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Ma Progression</h3>
                  <p className="text-sm text-gray-600">Badges & statistiques</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-600 mb-2">170%</div>
              <p className="text-sm text-gray-600 mb-4">Progression générale • +17% ce mois</p>
              <button
                onClick={() => window.location.href = '/student-dashboard?page=progression'}
                className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Voir ma progression
              </button>
            </div>

            {/* Journal de Bord */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-teal-600 mr-3" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Journal de Bord</h3>
                  <p className="text-sm text-gray-600">Suivi de stage structuré</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Documentez votre parcours professionnel et vos apprentissages
              </p>
              <button
                onClick={() => window.location.href = '/student-dashboard?page=journal'}
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Ouvrir journal
              </button>
            </div>

            {/* Stratégie Carrière */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Stratégie Carrière</h3>
                  <p className="text-sm text-gray-600">Conseil personnalisé</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-2">0/8</div>
              <p className="text-sm text-gray-600 mb-4">Objectifs atteints • Définissez vos objectifs</p>
              <button
                onClick={() => window.location.href = '/student-dashboard?page=strategie'}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Planifier carrière
              </button>
            </div>
          </div>
        </div>

        {/* Edutainment Tools */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <GamepadIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edutainment & Jeux</h2>
              <p className="text-gray-600">Apprenez en vous amusant</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {availableModules.includes('career_escape_room') && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <GamepadIcon className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Escape Rooms Carrière</h3>
                    <p className="text-sm text-gray-600">Découverte métiers par énigmes</p>
                  </div>
                </div>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Jouer
                </button>
              </div>
            )}

            {availableModules.includes('sponsored_tournaments') && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Crown className="h-8 w-8 text-amber-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Tournois Pro</h3>
                    <p className="text-sm text-gray-600">Compétitions sponsorisées</p>
                  </div>
                </div>
                <button className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors">
                  Participer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Besoin d'aide avec vos outils Premium ?</h2>
          <p className="text-teal-100 mb-6">
            Consultez nos guides ou contactez le support pour maximiser votre utilisation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/contact'}
              className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Support Premium
            </button>
            <button
              onClick={() => window.location.href = '/credits'}
              className="bg-teal-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-300 transition-colors"
            >
              Gérer mes Crédits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;