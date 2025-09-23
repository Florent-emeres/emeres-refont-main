import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { 
  // Outils
  Target, Sparkles, Award, BookOpen, MessageSquare, Zap,
  // Ressources  
  Book, GraduationCap, Video, FileText, HelpCircle, Users,
  // Suivi & Analytics
  TrendingUp, BarChart3, Calendar, Send, Bell, Clipboard,
  // Découverte
  Search, UserSearch, Megaphone,
  // Profil
  User, Coins, Settings,
  // Navigation
  ArrowRight, ChevronRight, Plus, Star
} from 'lucide-react';
import CreditsWidget from './CreditsWidget';

const CategorizedDashboard = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('outils');
  const [stats, setStats] = useState({
    applications: 0,
    notifications: 0,
    offers: 5,
    mentors: 12
  });

  // Catégories avec leurs fonctionnalités
  const categories = {
    outils: {
      title: 'Outils de Travail',
      description: 'Fonctionnalités actives pour optimiser votre recherche',
      icon: Target,
      color: 'blue',
      items: [
        {
          id: 'ai-matching',
          title: 'IA Matching',
          description: 'Offres recommandées par IA',
          icon: Target,
          badge: 'IA',
          stats: `${stats.offers} offres`,
          href: '/student-dashboard?page=ai-matching',
          premium: false
        },
        {
          id: 'cv-generator', 
          title: 'CV Generator',
          description: 'Création de CV intelligente',
          icon: Award,
          badge: 'IA',
          stats: 'Prêt à utiliser',
          href: '/student-dashboard?page=cv-generator',
          premium: false
        },
        {
          id: 'lettre-ia',
          title: 'Lettre IA', 
          description: 'Génération de lettres de motivation',
          icon: Sparkles,
          badge: 'IA',
          stats: 'Génération instantanée',
          href: '/student-dashboard?page=lettre-ia',  
          premium: false
        },
        {
          id: 'entretien-ia',
          title: 'Entretien IA',
          description: 'Simulation d\'entretiens réalistes', 
          icon: Users,
          badge: 'IA',
          stats: 'Entraînement illimité',
          href: '/student-dashboard?page=entretien-ia',
          premium: false
        },
        {
          id: 'portfolio',
          title: 'Portfolio',
          description: 'Gestion projets & réalisations',
          icon: BookOpen,
          stats: 'Projets visuels',
          href: '/student-dashboard?page=portfolio',
          premium: false
        },
        {
          id: 'messaging',
          title: 'Messagerie Pro',
          description: 'Communication sécurisée',
          icon: MessageSquare,
          badge: stats.notifications > 0 ? stats.notifications.toString() : null,
          stats: 'Messages chiffrés',
          href: '/student-dashboard?page=messaging',
          premium: false
        }
      ]
    },
    
    ressources: {
      title: 'Ressources & Formation',
      description: 'Documentation, guides et contenus éducatifs',
      icon: Book,  
      color: 'green',
      items: [
        {
          id: 'focus-rooms',
          title: 'Focus Rooms',
          description: 'Salles de travail collaboratives',
          icon: Users,
          badge: 'Premium',
          stats: 'Sessions Pomodoro',
          href: '/resources#focus-rooms',
          premium: true
        },
        {
          id: 'micro-quests',
          title: 'Micro Quêtes',
          description: 'Parcours gamifiés de compétences',
          icon: Star,
          badge: 'Premium', 
          stats: 'Apprentissage ludique',
          href: '/resources#micro-quests',
          premium: true
        },
        {
          id: 'bibliotheque',
          title: 'Bibliothèque',
          description: 'Ressources documentaires',
          icon: Book,
          stats: '200+ ressources',
          href: '/resources/library',
          premium: false
        },
        {
          id: 'guides',
          title: 'Guides Pratiques', 
          description: 'Documentation étape par étape',
          icon: FileText,
          stats: 'Guides complets',
          href: '/resources/guides',
          premium: false  
        },
        {
          id: 'webinaires',
          title: 'Webinaires',
          description: 'Sessions de formation live',
          icon: Video,
          stats: 'Formation continue',
          href: '/resources/webinaires', 
          premium: false
        },
        {
          id: 'faq',
          title: 'FAQ & Support',
          description: 'Aide et questions fréquentes',
          icon: HelpCircle,
          stats: 'Support 24/7',
          href: '/resources/faq',
          premium: false
        }
      ]
    },
    
    suivi: {
      title: 'Suivi & Analytics',
      description: 'Monitoring de votre progression et performances',
      icon: BarChart3,
      color: 'purple', 
      items: [
        {
          id: 'progression',
          title: 'Ma Progression',
          description: 'Badges, stats & KPIs personnels',
          icon: TrendingUp,
          stats: '170% progression',
          href: '/student-dashboard?page=progression',
          premium: false
        },
        {
          id: 'journal',
          title: 'Journal de Bord',
          description: 'Suivi de stage structuré',
          icon: Clipboard,
          stats: 'Workflow complet',
          href: '/student-dashboard?page=journal',
          premium: false
        },
        {
          id: 'strategie',
          title: 'Stratégie Carrière',
          description: 'Planification objectifs pro',
          icon: Target,
          stats: '0/8 objectifs',
          href: '/student-dashboard?page=strategie',
          premium: false
        },
        {
          id: 'candidatures',
          title: 'Mes Candidatures',
          description: 'Suivi complet candidatures',
          icon: Send,
          badge: stats.applications > 0 ? stats.applications.toString() : null,
          stats: `${stats.applications} candidatures`,
          href: '/student-dashboard?page=applications',
          premium: false
        },
        {
          id: 'notifications',
          title: 'Centre Notifications',
          description: 'Alertes et rappels importants',
          icon: Bell,
          badge: stats.notifications > 0 ? stats.notifications.toString() : null,
          stats: 'Alertes temps réel',
          href: '/student-dashboard?page=notifications',
          premium: false
        }
      ]
    },
    
    decouverte: {
      title: 'Découverte & Recherche',
      description: 'Exploration d\'opportunités et de contacts',
      icon: Search,
      color: 'orange',
      items: [
        {
          id: 'offers',
          title: 'Recherche Offres',
          description: 'Stages & emplois disponibles',
          icon: Search,
          stats: `${stats.offers} nouvelles offres`,
          href: '/student-dashboard?page=offers', 
          premium: false
        },
        {
          id: 'mentors',
          title: 'Découvrir Mentors',
          description: 'Trouvez votre mentor idéal',
          icon: UserSearch,
          badge: 'Nouveau', 
          stats: `${stats.mentors} mentors disponibles`,
          href: '/student-dashboard?page=mentors',
          premium: false
        },
        {
          id: 'annonces',
          title: 'Mes Annonces',
          description: 'Gestion annonces mentorat',
          icon: Megaphone,
          stats: 'Recherches mentoring',
          href: '/student-dashboard?page=annonces',
          premium: false
        }
      ]
    }
  };

  const getCategoryColor = (color, type = 'bg') => {
    const colors = {
      blue: type === 'bg' ? 'bg-blue-500' : 'text-blue-600 border-blue-200 bg-blue-50',
      green: type === 'bg' ? 'bg-green-500' : 'text-green-600 border-green-200 bg-green-50', 
      purple: type === 'bg' ? 'bg-purple-500' : 'text-purple-600 border-purple-200 bg-purple-50',
      orange: type === 'bg' ? 'bg-orange-500' : 'text-orange-600 border-orange-200 bg-orange-50'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec widget crédits */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Espace Étudiant
              </h1>
              <p className="text-gray-600">
                Bienvenue {user?.first_name} ! Organisez votre parcours professionnel
              </p>
            </div>
          </div>
          
          {/* Widget crédits intégré */}
          <div className="mb-4">
            <CreditsWidget size="compact" showActions={true} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation par catégories */}
        <div className="flex space-x-1 mb-8 bg-white rounded-xl p-1 shadow-sm">
          {Object.entries(categories).map(([key, category]) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === key;
            
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  isActive 
                    ? `${getCategoryColor(category.color)} text-white shadow-lg` 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="hidden sm:inline">{category.title}</span>
              </button>
            );
          })}
        </div>

        {/* Contenu de la catégorie active */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className={`w-12 h-12 ${getCategoryColor(categories[activeCategory].color)} rounded-xl flex items-center justify-center mr-4`}>
              {React.createElement(categories[activeCategory].icon, { className: "h-6 w-6 text-white" })}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{categories[activeCategory].title}</h2>
              <p className="text-gray-600">{categories[activeCategory].description}</p>
            </div>
          </div>

          {/* Grille des fonctionnalités */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories[activeCategory].items.map((item) => {
              const IconComponent = item.icon;
              
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer ${
                    item.premium ? 'ring-2 ring-blue-200' : ''
                  }`}
                  onClick={() => window.location.href = item.href}
                >
                  {/* Header de la carte */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${getCategoryColor(categories[activeCategory].color)} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex space-x-2">
                      {item.premium && (
                        <span className="bg-blue-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">
                          Premium
                        </span>
                      )}
                      {item.badge && !item.premium && (
                        <span className={`${getCategoryColor(categories[activeCategory].color, 'text')} text-xs font-semibold px-2 py-1 rounded-full border`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contenu */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  
                  {/* Stats/Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{item.stats}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Besoin d'aide pour commencer ?</h2>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
            Consultez nos guides de démarrage ou contactez le support pour maximiser votre utilisation d'ÉMÉRÉS
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setActiveCategory('ressources')}
              className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Voir les Guides
            </button>
            <button
              onClick={() => window.location.href = '/contact'}
              className="bg-teal-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-300 transition-colors"
            >
              Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorizedDashboard;