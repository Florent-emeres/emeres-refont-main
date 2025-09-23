import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { toast } from 'sonner';
import { 
  Zap, 
  Brain, 
  GamepadIcon,
  Focus,
  Headphones,
  Shield,
  TrendingUp,
  Trophy,
  Users,
  Sparkles,
  Clock,
  Target,
  BookOpen,
  Rocket,
  Crown,
  Check,
  Star,
  Play
} from 'lucide-react';

const PremiumPage = () => {
  const { user } = useAuth();
  const [catalog, setCatalog] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(null);
  const [subscribing, setSubscribing] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (user) {
      fetchPremiumData();
    }
  }, [user]);

  const fetchPremiumData = async () => {
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

      // Récupérer le catalogue et l'abonnement
      const [catalogRes, subscriptionRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/premium/catalog`, { headers }),
        fetch(`${BACKEND_URL}/api/premium/my-subscription`, { headers })
      ]);

      if (catalogRes.ok) {
        const catalogData = await catalogRes.json();
        setCatalog(catalogData);
      }

      if (subscriptionRes.ok) {
        const subscriptionData = await subscriptionRes.json();
        setSubscription(subscriptionData.subscription);
      }

    } catch (err) {
      toast.error(`Erreur lors du chargement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (tierKey, creditsToUse = 0) => {
    try {
      setSubscribing(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${BACKEND_URL}/api/premium/subscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription_tier: tierKey,
          credits_to_use_euros: creditsToUse,
          metadata: { source: 'premium_page' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`🎉 ${data.message}`);
        fetchPremiumData(); // Rafraîchir les données
        setSelectedTier(null);
      } else {
        const errorData = await response.json();
        toast.error(`❌ ${errorData.detail}`);
      }
    } catch (err) {
      toast.error(`❌ Erreur: ${err.message}`);
    } finally {
      setSubscribing(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'focus': return Focus;
      case 'learning': return Brain;
      case 'edutainment': return GamepadIcon;
      default: return Sparkles;
    }
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
          <p className="text-gray-600">Chargement des services premium...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Image globale pour premium */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-16 relative overflow-hidden">
        {/* Background Image pour header avec contraste élevé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        {/* Overlay pour maintenir le contraste */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/85 via-pink-600/85 to-orange-500/85" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                <Crown className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ÉMÉRÉS Premium
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Boostez votre concentration, accélérez votre apprentissage, et amusez-vous tout en développant vos compétences professionnelles
            </p>
            
            {subscription && (
              <div className="bg-white bg-opacity-20 rounded-2xl p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-5 w-5 text-blue-300 mr-2" />
                  <span className="font-semibold">Abonnement Actif</span>
                </div>
                <p className="text-purple-100">{subscription.subscription_tier}</p>
                <p className="text-sm text-purple-200">
                  Expire le {new Date(subscription.end_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Packs d'abonnement */}
        {catalog && catalog.subscriptions && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Choisissez votre pack
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Tous les packs incluent une période d'essai et peuvent être payés jusqu'à 30% en crédits ÉMÉRÉS
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(catalog.subscriptions).map(([tierKey, tierConfig]) => {
                if (tierKey === 'free') return null;
                
                const isCurrentTier = subscription?.subscription_tier === tierKey;
                
                return (
                  <div
                    key={tierKey}
                    className={`bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden ${
                      isCurrentTier ? 'ring-2 ring-purple-500' : ''
                    } ${tierKey === 'premium_all' ? 'transform scale-105 border-2 border-purple-500' : ''}`}
                  >
                    {/* Image de fond pour cartes premium */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                      style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`
                      }}
                    />
                    
                    {tierKey === 'premium_all' && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Le Plus Populaire
                        </span>
                      </div>
                    )}
                    
                    {isCurrentTier && (
                      <div className="absolute -top-3 right-4">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Actuel
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-6 relative z-10">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {tierConfig.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {tierConfig.description}
                      </p>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-gray-900">
                          {tierConfig.price_euros}€
                        </span>
                        <span className="text-gray-600">/mois</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Écoles: {tierConfig.price_school_per_student}€/étudiant
                      </div>
                    </div>
                    
                    <div className="mb-6 relative z-10">
                      <h4 className="font-semibold text-gray-900 mb-3">Modules inclus:</h4>
                      <div className="space-y-2">
                        {tierConfig.modules?.slice(0, 4).map((moduleType) => {
                          const moduleConfig = catalog.modules[moduleType];
                          const IconComponent = getModuleIcon(moduleType);
                          
                          return (
                            <div key={moduleType} className="flex items-center text-sm">
                              <IconComponent className="h-4 w-4 text-teal-600 mr-2" />
                              <span className="text-gray-700">
                                {moduleConfig?.name || moduleType}
                              </span>
                            </div>
                          );
                        })}
                        {tierConfig.modules?.length > 4 && (
                          <div className="text-sm text-gray-500">
                            +{tierConfig.modules.length - 4} autres modules
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6 relative z-10">
                      <h4 className="font-semibold text-gray-900 mb-2">Avantages:</h4>
                      <ul className="space-y-1">
                        {tierConfig.benefits?.map((benefit, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="relative z-10">
                      {!isCurrentTier && (
                        <button
                          onClick={() => handleSubscribe(tierKey, 0)}
                          disabled={subscribing}
                          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                            tierKey === 'premium_all'
                              ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-teal-600 text-white hover:bg-teal-700'
                          } disabled:opacity-50`}
                        >
                          {subscribing ? 'Abonnement...' : 'S\'abonner'}
                        </button>
                      )}
                      
                      {isCurrentTier && (
                        <div className="w-full py-3 px-4 bg-green-100 text-green-800 rounded-lg text-center font-semibold">
                          Abonnement Actif
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modules par catégorie */}
        {catalog && catalog.modules && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Explorez tous nos modules
            </h2>
            
            {/* Focus Modules */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                  <Focus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Focus & Concentration</h3>
                  <p className="text-gray-600">Outils pour améliorer votre focus et productivité</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(catalog.modules)
                  .filter(([_, config]) => config.category === 'focus')
                  .map(([moduleType, config]) => {
                    const IconComponent = getModuleIcon(moduleType);
                    
                    return (
                      <div key={moduleType} className="bg-white rounded-xl shadow-lg p-6 overflow-hidden relative">
                        {/* Image de fond pour modules focus */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                          style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1606248896999-387b3a9f621c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`
                          }}
                        />
                        
                        <div className="relative z-10">
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <IconComponent className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{config.name}</h4>
                              <p className="text-sm text-blue-600">{config.price_euros}€/mois</p>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4">{config.description}</p>
                          
                          <div className="mb-4">
                            <h5 className="text-xs font-semibold text-gray-700 mb-2">GRATUIT:</h5>
                            <ul className="space-y-1">
                              {config.free_features?.slice(0, 2).map((feature, index) => (
                                <li key={index} className="text-xs text-gray-600 flex items-center">
                                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="mb-4">
                            <h5 className="text-xs font-semibold text-purple-700 mb-2">PREMIUM:</h5>
                            <ul className="space-y-1">
                              {config.premium_features?.slice(0, 2).map((feature, index) => (
                                <li key={index} className="text-xs text-purple-600 flex items-center">
                                  <Crown className="w-3 h-3 mr-2" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            
            {/* Learning Modules */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Learning & Skills</h3>
                  <p className="text-gray-600">Accélérez votre apprentissage avec l'IA</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(catalog.modules)
                  .filter(([_, config]) => config.category === 'learning')
                  .map(([moduleType, config]) => {
                    const IconComponent = getModuleIcon(moduleType);
                    
                    return (
                      <div key={moduleType} className="bg-white rounded-xl shadow-lg p-6 overflow-hidden relative">
                        {/* Image de fond pour modules learning */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                          style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`
                          }}
                        />
                        
                        <div className="relative z-10">
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                              <IconComponent className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{config.name}</h4>
                              <p className="text-sm text-green-600">{config.price_euros}€/mois</p>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4">{config.description}</p>
                          
                          <div className="mb-4">
                            <h5 className="text-xs font-semibold text-gray-700 mb-2">GRATUIT:</h5>
                            <ul className="space-y-1">
                              {config.free_features?.slice(0, 2).map((feature, index) => (
                                <li key={index} className="text-xs text-gray-600 flex items-center">
                                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="mb-4">
                            <h5 className="text-xs font-semibold text-purple-700 mb-2">PREMIUM:</h5>
                            <ul className="space-y-1">
                              {config.premium_features?.slice(0, 2).map((feature, index) => (
                                <li key={index} className="text-xs text-purple-600 flex items-center">
                                  <Crown className="w-3 h-3 mr-2" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            
            {/* Edutainment Modules */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                  <GamepadIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Edutainment & Games</h3>
                  <p className="text-gray-600">Apprenez en vous amusant avec des expériences immersives</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(catalog.modules)
                  .filter(([_, config]) => config.category === 'edutainment')
                  .map(([moduleType, config]) => {
                    const IconComponent = getModuleIcon(moduleType);
                    
                    return (
                      <div key={moduleType} className="bg-white rounded-xl shadow-lg p-6 overflow-hidden relative">
                        {/* Image de fond pour modules edutainment */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                          style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`
                          }}
                        />
                        
                        <div className="relative z-10">
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                              <IconComponent className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{config.name}</h4>
                              <p className="text-sm text-purple-600">{config.price_euros}€</p>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-6">{config.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-xs font-semibold text-gray-700 mb-2">GRATUIT:</h5>
                              <ul className="space-y-1">
                                {config.free_features?.map((feature, index) => (
                                  <li key={index} className="text-xs text-gray-600 flex items-center">
                                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="text-xs font-semibold text-purple-700 mb-2">PREMIUM:</h5>
                              <ul className="space-y-1">
                                {config.premium_features?.map((feature, index) => (
                                  <li key={index} className="text-xs text-purple-600 flex items-center">
                                    <Crown className="w-3 h-3 mr-2" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-8 text-white text-center overflow-hidden relative">
          {/* Image de fond pour CTA */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
            }}
          />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Prêt à booster votre réussite ?</h2>
            <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
              Rejoignez des milliers d'étudiants qui utilisent ÉMÉRÉS Premium pour améliorer leur concentration, 
              accélérer leur apprentissage et réussir leurs objectifs professionnels.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Voir les packs
              </button>
              <button
                onClick={() => window.location.href = '/credits'}
                className="bg-teal-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-300 transition-colors"
              >
                Mes Crédits
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;