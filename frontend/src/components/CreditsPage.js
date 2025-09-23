import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { toast } from 'sonner';
import { 
  Coins, 
  TrendingUp, 
  Clock, 
  Shield, 
  Zap,
  Gift,
  History,
  AlertCircle,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react';

const CreditsPage = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (user) {
      fetchCreditsData();
    }
  }, [user]);

  const fetchCreditsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Vous devez être connecté pour accéder à cette page');
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Récupérer le solde, les transactions et la configuration
      const [balanceRes, transactionsRes, configRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/credits/balance`, { headers }),
        fetch(`${BACKEND_URL}/api/credits/transactions?limit=20`, { headers }),
        fetch(`${BACKEND_URL}/api/credits/config`, { headers })
      ]);

      if (balanceRes.ok) {
        const balanceData = await balanceRes.json();
        setBalance(balanceData);
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData);
      }

      if (configRes.ok) {
        const configData = await configRes.json();
        setConfig(configData);
      }

    } catch (err) {
      setError(`Erreur lors du chargement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAwardPoints = async (actionType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/credits/award-points`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action_type: actionType,
          metadata: { test: true, timestamp: new Date().toISOString() }
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`✅ ${data.message}`);
        fetchCreditsData(); // Rafraîchir les données
      } else {
        const errorData = await response.json();
        toast.error(`❌ ${errorData.detail || 'Erreur lors de l\'attribution des points'}`);
      }
    } catch (err) {
      toast.error(`❌ Erreur: ${err.message}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionsByRole = (userRole) => {
    // Valeurs corrigées pour conformité légale - pas de gains passifs excessifs
    const actions = {
      student: [
        { type: 'daily_login', name: 'Connexion quotidienne', points: 1 },  // Réduit de 10 à 1
        { type: 'profile_completed', name: 'Profil complété', points: 2 },  // Réduit de 50 à 2
        { type: 'application_sent', name: 'Candidature envoyée', points: 1 },  // Réduit de 15 à 1
        { type: 'company_review', name: 'Avis entreprise', points: 5 },  // Réduit de 25 à 5
        { type: 'cv_update', name: 'CV mis à jour', points: 1 }  // Réduit de 20 à 1
      ],
      mentor: [
        { type: 'cv_evaluation', name: 'Évaluation CV (gratuite)', points: 5 },  // Points bonus pour service gratuit
        { type: 'flash_advice', name: 'Conseil flash (gratuit)', points: 2 },  // Points bonus pour service gratuit
        { type: 'objective_reached', name: 'Objectif étudiant atteint', points: 15 },  // Points bonus pour succès
        { type: 'program_completed', name: 'Programme terminé', points: 20 }  // Points bonus pour succès
      ],
      company: [
        { type: 'job_posted', name: 'Offre publiée', points: 5 },  // Réduit de 20 à 5
        { type: 'intern_recruited', name: 'Stagiaire recruté', points: 15 },  // Réduit de 100 à 15
        { type: 'training_given', name: 'Formation donnée', points: 10 }  // Réduit de 50 à 10
      ],
      institution: [
        { type: 'student_supported', name: 'Étudiant accompagné', points: 2 },  // Réduit de 30 à 2
        { type: 'partnership_created', name: 'Partenariat créé', points: 20 },  // Réduit de 200 à 20
        { type: 'event_organized', name: 'Événement organisé', points: 25 }  // Réduit de 300 à 25
      ]
    };
    
    return actions[userRole] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos crédits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Erreur</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Coins className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            ÉMÉRÉS Credits
          </h1>
          <p className="text-xl text-center text-teal-100 max-w-2xl mx-auto">
            Gagnez des points en utilisant la plateforme, convertissez-les en crédits automatiquement
          </p>
          <div className="mt-4 bg-red-500 bg-opacity-20 rounded-lg p-4 max-w-3xl mx-auto">
            <p className="text-teal-100 text-sm font-semibold">
              ⚖️ CONFORMITÉ LÉGALE : Les crédits sont à usage interne uniquement - 
              pas de conversion en euros, pas de retrait bancaire
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Solde */}
        {balance && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Points</p>
                  <p className="text-3xl font-bold text-gray-900">{balance.points_balance}</p>
                  <p className="text-sm text-gray-500">
                    {Math.floor(balance.points_balance / 5)} crédits à venir
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Crédits</p>
                  <p className="text-3xl font-bold text-gray-900">{balance.credits_balance_euros.toFixed(2)}€</p>
                  <p className="text-sm text-gray-500">
                    Utilisables dans vos commandes
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Coins className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Gagné</p>
                  <p className="text-3xl font-bold text-gray-900">{balance.total_points_earned}</p>
                  <p className="text-sm text-gray-500">
                    Points gagnés au total
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Règles d'utilisation */}
        {config && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Règles du système</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ArrowRight className="h-6 w-6 text-blue-600" />
                </div>
                <p className="font-semibold text-gray-900">Conversion</p>
                <p className="text-sm text-gray-600">5 points = 1 crédit = 1€</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <p className="font-semibold text-gray-900">Usage Max</p>
                <p className="text-sm text-gray-600">30% du panier</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <p className="font-semibold text-gray-900">Seuil Mini</p>
                <p className="text-sm text-gray-600">10€ minimum</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <p className="font-semibold text-gray-900">Expiration</p>
                <p className="text-sm text-gray-600">12 mois</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions pour gagner des points */}
        {user && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gagner des points</h2>
            <p className="text-gray-600 mb-6">
              Testez le système en gagnant des points selon votre rôle : <strong>{user.role}</strong>
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getActionsByRole(user.role).map((action) => (
                <button
                  key={action.type}
                  onClick={() => testAwardPoints(action.type)}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-4 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Gift className="h-5 w-5" />
                    <span className="text-sm font-semibold">+{action.points} pts</span>
                  </div>
                  <p className="font-medium">{action.name}</p>
                  <p className="text-sm text-teal-100">Cliquez pour tester</p>
                </button>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800 font-medium">Limite d'actions</p>
                  <p className="text-sm text-amber-700">
                    Certaines actions ont des limites quotidiennes/mensuelles pour éviter les abus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Historique des transactions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <History className="h-6 w-6 mr-2" />
            Historique des transactions
          </h2>
          
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      transaction.type === 'points' 
                        ? 'bg-teal-100 text-teal-600' 
                        : 'bg-teal-100 text-teal-600'
                    }`}>
                      {transaction.type === 'points' ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <Coins className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.type === 'points' ? 'Points gagnés' : 'Crédits'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(transaction.created_at)}
                      </p>
                      {transaction.expires_at && (
                        <p className="text-xs text-gray-500">
                          Expire le {formatDate(transaction.expires_at)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.amount_display.startsWith('+') 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.amount_display}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune transaction pour le moment</p>
              <p className="text-sm text-gray-500">
                Commencez à utiliser ÉMÉRÉS pour gagner vos premiers points !
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;