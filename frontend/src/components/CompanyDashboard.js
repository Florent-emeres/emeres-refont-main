import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmeresButton from './ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from './ui/EmeresCard';
import EmeresBadge from './ui/EmeresBadge';
import EmeresInput from './ui/EmeresInput';
import EmeresBreadcrumb from './ui/EmeresBreadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Building2, 
  Users, 
  FileText, 
  Settings, 
  CheckCircle, 
  Star,
  PlusCircle,
  Search,
  Filter,
  BarChart3,
  MessageSquare,
  Calendar,
  Award,
  Database,
  UserCheck,
  Briefcase,
  Target,
  Bell,
  Menu,
  AlertTriangle,
  TrendingUp,
  Clock,
  Eye,
  Edit,
  Zap,
  Heart,
  Globe,
  Sparkles,
  ChevronDown,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useToast } from './hooks/use-toast';
import EnhancedCompanyProfile from './company-sections/OptimizedCompanyProfile';
import OfferManagement from './company-sections/OfferManagement';
import ApplicationTracking from './company-sections/ApplicationTracking';
import AnalyticsDashboard from './company-sections/AnalyticsDashboard';
import TeamManagement from './company-sections/TeamManagement';
import CompanyBlog from './company-sections/CompanyBlog';
import DocumentManagement from './company-sections/DocumentManagement';
import InternshipTracking from './company-sections/InternshipTracking';
import IntegrationsManagement from './company-sections/IntegrationsManagement';
import AdvancedCommunication from './company-sections/AdvancedCommunication';
import StrategyModule from './strategy-module/StrategyModule';

const CompanyDashboard = ({ user }) => {
  const { toast } = useToast();
  const [companyProfile, setCompanyProfile] = useState(null);
  const [companyOffers, setCompanyOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [companyStats, setCompanyStats] = useState({
    total_offers: 0,
    active_offers: 0,
    total_applications: 0,
    new_applications_today: 0,
    active_interns: 0
  });
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Gérer la sidebar responsive intelligemment
  useEffect(() => {
    const handleResize = () => {
      // Sur desktop (lg+), la sidebar est toujours ouverte
      if (window.innerWidth >= 1024) {
        setSidebarCollapsed(false);
      }
      // Sur mobile/tablette, la sidebar est fermée par défaut
      else if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    // Écouter les changements de taille d'écran
    window.addEventListener('resize', handleResize);
    
    // Appliquer la logique au chargement
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fonction pour mettre à jour le profil depuis les sous-composants
  const handleProfileUpdate = (updatedProfile) => {
    setCompanyProfile(updatedProfile);
  };

  // Actions pour les boutons rapides
  const handleQuickAction = (action) => {
    switch (action) {
      case 'publish_offer':
        setActivePage('offers');
        break;
      case 'search_candidates':
        setActivePage('candidates');
        break;
      case 'complete_profile':
        setActivePage('profile');
        break;
      default:
        break;
    }
  };

  // État pour gérer l'expansion des catégories
  const [expandedCategories, setExpandedCategories] = useState({
    'tools': true,
    'resources': false,
    'tracking': false, 
    'discovery': false,
    'profile-settings': false
  });

  // Toggle expansion d'une catégorie
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Configuration de la sidebar avec catégorisation logique ÉMÉRÉS pour Entreprises
  const sidebarCategories = [
    {
      id: 'dashboard',
      label: 'Accueil',
      icon: Building2,
      description: 'Vue d\'ensemble',
      gradient: 'from-teal-500 to-teal-600',
      isStandalone: true
    },
    {
      id: 'tools',
      label: 'Outils RH',
      icon: Zap,
      description: 'Outils de recrutement et RH',
      gradient: 'from-blue-500 to-purple-600',
      items: [
        { 
          id: 'offers', 
          label: 'Gestion Offres', 
          icon: Briefcase, 
          description: 'Créer et gérer vos postes'
        },
        { 
          id: 'strategy', 
          label: 'Stratégie RH', 
          icon: Target, 
          description: 'Conseil & Planification',
          badge: 'IA'
        },
        { 
          id: 'integrations', 
          label: 'Intégrations', 
          icon: Zap, 
          description: 'API & Outils connectés'
        }
      ]
    },
    {
      id: 'resources',
      label: 'Ressources',
      icon: FileText,
      description: 'Documents et communication',
      gradient: 'from-emerald-500 to-green-600',
      items: [
        { 
          id: 'documents', 
          label: 'Documents', 
          icon: FileText, 
          description: 'Conventions et contrats'
        },
        { 
          id: 'communication', 
          label: 'Communication', 
          icon: MessageSquare, 
          description: 'Messages & Chat'
        },
        { 
          id: 'team', 
          label: 'Équipe RH', 
          icon: Users, 
          description: 'Collaboration équipe'
        }
      ]
    },
    {
      id: 'tracking',
      label: 'Suivi & Analytics',
      icon: BarChart3,
      description: 'Métriques et performance',
      gradient: 'from-orange-500 to-red-500',
      items: [
        { 
          id: 'candidates', 
          label: 'Candidatures', 
          icon: Users, 
          description: 'Suivi candidats',
          badge: companyStats.new_applications_today > 0 ? `${companyStats.new_applications_today} nouvelles` : null
        },
        { 
          id: 'analytics', 
          label: 'Analytics RH', 
          icon: BarChart3, 
          description: 'Métriques et KPIs'
        },
        { 
          id: 'satisfaction', 
          label: 'Satisfaction', 
          icon: Award, 
          description: 'Feedback stagiaires'
        }
      ]
    },
    {
      id: 'discovery',
      label: 'Découverte',
      icon: Search,
      description: 'Candidats et stagiaires',
      gradient: 'from-purple-500 to-pink-600',
      items: [
        { 
          id: 'interns', 
          label: 'Stagiaires', 
          icon: UserCheck, 
          description: 'Gestion des stages'
        },
        { 
          id: 'talent-search', 
          label: 'Recherche Talents', 
          icon: Search, 
          description: 'Découvrir candidats'
        }
      ]
    },
    {
      id: 'profile-settings',
      label: 'Profil & Paramètres',
      icon: Settings,
      description: 'Configuration entreprise',
      gradient: 'from-gray-500 to-slate-600',
      items: [
        { 
          id: 'profile', 
          label: 'Profil Entreprise', 
          icon: Building2, 
          description: 'Informations publiques'
        },
        { 
          id: 'settings', 
          label: 'Paramètres', 
          icon: Settings, 
          description: 'Configuration compte'
        }
      ]
    }
  ];

  // Configuration des pages avec titres contextuels et breadcrumbs
  const getPageConfig = (pageId) => {
    const configs = {
      dashboard: {
        title: 'Vue d\'ensemble de l\'activité',
        breadcrumbs: ['Dashboard'],
        description: 'Métriques clés et résumé de performance'
      },
      profile: {
        title: 'Configuration de votre profil entreprise',
        breadcrumbs: ['Paramètres', 'Profil'],
        description: 'Informations publiques et coordonnées'
      },
      offers: {
        title: 'Gestion des offres d\'emploi',
        breadcrumbs: ['Recrutement', 'Offres'],
        description: 'Créez et gérez vos annonces de poste'
      },
      candidates: {
        title: 'Suivi des candidatures',
        breadcrumbs: ['Recrutement', 'Candidatures'],
        description: 'Processus de sélection et évaluation'
      },
      interns: {
        title: 'Suivi des stagiaires',
        breadcrumbs: ['Formation', 'Stagiaires'],
        description: 'Encadrement et évaluation des stages'
      },
      team: {
        title: 'Gestion de l\'équipe RH',
        breadcrumbs: ['Organisation', 'Équipe RH'],
        description: 'Collaboration et gestion des accès'
      },
      analytics: {
        title: 'Tableau de bord analytique',
        breadcrumbs: ['Reporting', 'Analytics'],
        description: 'Métriques RH et indicateurs de performance'
      },
      communication: {
        title: 'Centre de communication',
        breadcrumbs: ['Outils', 'Communication'],
        description: 'Messages et notifications'
      },
      documents: {
        title: 'Bibliothèque documentaire',
        breadcrumbs: ['Ressources', 'Documents'],
        description: 'Conventions, contrats et fichiers partagés'
      },
      strategy: {
        title: 'Tableau de pilotage stratégique',
        breadcrumbs: ['Pilotage', 'Stratégie'],
        description: 'Objectifs et conseil personnalisé IA'
      },
      satisfaction: {
        title: 'Baromètre de satisfaction',
        breadcrumbs: ['Qualité', 'Satisfaction'],
        description: 'Retours et évaluations des stagiaires'
      },
      integrations: {
        title: 'Hub d\'intégrations',
        breadcrumbs: ['Outils RH', 'Intégrations'],
        description: 'Connexions API et automatisations'
      },
      'talent-search': {
        title: 'Recherche de talents',
        breadcrumbs: ['Découverte', 'Talents'],
        description: 'Découvrir et contacter les meilleurs candidats'
      },
      settings: {
        title: 'Paramètres de l\'entreprise',
        breadcrumbs: ['Profil & Paramètres', 'Paramètres'],
        description: 'Configuration générale du compte'
      }
    };
    
    return configs[pageId] || configs.dashboard;
  };

  // Navigation vers une page spécifique
  const navigateToPage = (page) => {
    setActivePage(page);
  };

  // Rendu des cartes du dashboard avec design ÉMÉRÉS optimisé
  const renderDashboardCards = () => {
    const cards = [
      {
        id: 'profile',
        title: 'Profil Entreprise',
        description: 'Votre vitrine digitale',
        icon: Building2,
        gradient: 'from-teal-500 to-teal-600',
        stats: companyProfile?.company_name ? 'Profil complété' : 'À compléter',
        value: companyProfile?.company_name ? '100%' : '45%',
        change: companyProfile?.company_name ? 'Profil complété' : 'Complétez votre profil',
        action: () => navigateToPage('profile'),
        urgent: !companyProfile?.company_name
      },
      {
        id: 'offers',
        title: 'Offres Actives',
        description: 'Postes à pourvoir',
        icon: Briefcase,
        gradient: 'from-blue-500 to-blue-600',
        stats: '8 offres publiées',
        value: '8',
        change: '+3 cette semaine',
        action: () => navigateToPage('offers'),
        badge: 'Nouvelle'
      },
      {
        id: 'candidates',
        title: 'Candidatures',
        description: 'Applications reçues',
        icon: Users,
        gradient: 'from-orange-500 to-orange-600',
        stats: `${companyStats.total_applications} candidatures`,
        value: companyStats.total_applications.toString(),
        change: companyStats.new_applications_today > 0 ? `+${companyStats.new_applications_today} aujourd'hui` : 'Aucune aujourd\'hui',
        action: () => navigateToPage('candidates'),
        urgent: companyStats.total_applications === 0,
        badge: companyStats.new_applications_today > 0 ? `${companyStats.new_applications_today} nouvelles` : null
      },
      {
        id: 'interns',
        title: 'Stagiaires Actifs',
        description: 'En cours de stage',
        icon: UserCheck,
        gradient: 'from-green-500 to-green-600',
        stats: `${companyStats.active_interns} stagiaires`,
        value: companyStats.active_interns.toString(),
        change: companyStats.active_interns > 0 ? `Actifs ce mois` : 'Aucun stagiaire',
        action: () => navigateToPage('interns')
      },
      {
        id: 'analytics',
        title: 'Performance RH',
        description: 'Métriques clés',
        icon: BarChart3,
        gradient: 'from-purple-500 to-purple-600',
        stats: 'Tendance positive',
        value: '↗ 23%',
        change: 'vs mois dernier',
        action: () => navigateToPage('analytics')
      },
      {
        id: 'satisfaction',
        title: 'Satisfaction',
        description: 'Retours stagiaires',
        icon: Heart,
        gradient: 'from-pink-500 to-pink-600',
        stats: 'Excellente',
        value: '4.8/5',
        change: '+0.2 ce mois',
        action: () => navigateToPage('satisfaction')
      },
      {
        id: 'team',
        title: 'Équipe RH',
        description: 'Collaborateurs actifs',
        icon: Users,
        gradient: 'from-cyan-500 to-cyan-600',
        stats: '6 membres',
        value: '6',
        change: 'Équipe complète',
        action: () => navigateToPage('team')
      },
      {
        id: 'communication',
        title: 'Messages',
        description: 'Communications',
        icon: MessageSquare,
        gradient: 'from-indigo-500 to-indigo-600',
        stats: '24 messages',
        value: '24',
        change: '8 non lus',
        action: () => navigateToPage('communication'),
        badge: '8'
      },
      {
        id: 'documents',
        title: 'Documents',
        description: 'Fichiers partagés',
        icon: FileText,
        gradient: 'from-amber-500 to-amber-600',
        stats: '142 fichiers',
        value: '142',
        change: '+5 cette semaine',
        action: () => navigateToPage('documents')
      },
      {
        id: 'strategy',
        title: 'Stratégie RH',
        description: 'Pilotage & conseils',
        icon: Target,
        gradient: 'from-red-500 to-red-600',
        stats: 'Objectifs en cours',
        value: '75%',
        change: 'Progrès excellent',
        action: () => navigateToPage('strategy'),
        badge: 'IA'
      },
      {
        id: 'integrations',
        title: 'Intégrations',
        description: 'Outils connectés',
        icon: Zap,
        gradient: 'from-violet-500 to-violet-600',
        stats: `${companyStats.total_offers} offres publiées`,
        value: companyStats.active_offers.toString(),
        change: companyStats.active_offers > 0 ? `${companyStats.active_offers} actives` : 'Aucune offre active',
        action: () => navigateToPage('integrations')
      },
      {
        id: 'activity',
        title: 'Activité Récente',
        description: 'Dernières actions',
        icon: Clock,
        gradient: 'from-emerald-500 to-emerald-600',
        stats: 'Très actif',
        value: '↗ 45%',
        change: 'vs semaine dernière',
        action: () => {} // Pas de navigation spécifique
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          
          return (
            <EmeresCard
              key={card.id}
              variant="default"
              interactive={false}
              padding="none"
              className={`
                group transition-all duration-300 hover-lift
                ${card.urgent ? 'ring-2 ring-red-200 border-red-200' : ''}
                hover:shadow-emeres-lg
              `}
            >
              {/* Header de la carte - responsive */}
              <div className={`bg-gradient-to-r ${card.gradient} p-3 sm:p-4 text-white relative overflow-hidden`}>
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <h3 className="font-semibold text-xs sm:text-sm truncate">{card.title}</h3>
                      {card.badge && (
                        <EmeresBadge
                          variant="secondary"
                          size="xs"
                          className="bg-white/20 text-white border-white/20 flex-shrink-0"
                        >
                          {card.badge}
                        </EmeresBadge>
                      )}
                    </div>
                    <p className="text-xs text-white/80 truncate">{card.description}</p>
                  </div>
                  
                  {card.urgent && (
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse flex-shrink-0"></div>
                  )}
                </div>
                
                {/* Effet de brillance au hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </div>
              
              {/* Contenu de la carte - responsive */}
              <div className="p-3 sm:p-4">
                <div className="flex items-end justify-between mb-2 sm:mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
                      {card.value}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {card.stats}
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className={`
                      text-xs font-medium truncate
                      ${card.change.includes('+') ? 'text-green-600' : 
                        card.change.includes('↗') ? 'text-green-600' : 'text-gray-600'}
                    `}>
                      {card.change}
                    </div>
                  </div>
                </div>
                
                {/* Actions rapides - responsive */}
                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
                  <EmeresButton
                    variant="ghost"
                    size="sm"
                    className="text-xs p-1 sm:p-2 h-auto"
                    icon={<Eye />}
                    onClick={(e) => {
                      e.stopPropagation();
                      card.action();
                    }}
                  >
                    <span className="hidden sm:inline">Voir</span>
                  </EmeresButton>
                  
                  <EmeresButton
                    variant="ghost"
                    size="sm"
                    className="text-xs p-1 sm:p-2 h-auto"
                    icon={<Edit />}
                    onClick={(e) => {
                      e.stopPropagation();
                      card.action();
                    }}
                  >
                    <span className="hidden sm:inline">Gérer</span>
                  </EmeresButton>
                </div>
              </div>
            </EmeresCard>
          );
        })}
      </div>
    );
  };

  // Charger le profil entreprise
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Charger le profil company
        const profileRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/company/profile`);
        setCompanyProfile(profileRes.data);

        // Charger les offres de l'entreprise  
        const offersRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/offers/my`, { headers });
        const offersData = offersRes.ok ? await offersRes.json() : [];
        setCompanyOffers(offersData);

        // Charger les candidatures reçues
        const applicationsRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/company/applications`, { headers });
        const applicationsData = applicationsRes.ok ? await applicationsRes.json() : [];
        setApplications(applicationsData);

        // Calculer les stats dynamiquement
        const activeOffers = offersData.filter(offer => offer.status === 'open' || !offer.status).length;
        const todayApplications = applicationsData.filter(app => {
          const appDate = new Date(app.created_at || app.application_date);
          const today = new Date();
          return appDate.toDateString() === today.toDateString();
        }).length;

        setCompanyStats({
          total_offers: offersData.length,
          active_offers: activeOffers,
          total_applications: applicationsData.length,
          new_applications_today: todayApplications,
          active_interns: applicationsData.filter(app => app.status === 'accepted' || app.status === 'internship').length
        });

      } catch (error) {
        console.error('Error fetching company data:', error);
        // En cas d'erreur, garder les valeurs par défaut
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  // Badge de statut de vérification
  const VerificationBadge = ({ status }) => {
    const badges = {
      'auto_declared': {
        icon: <Lock className="h-4 w-4" />,
        text: 'Auto-déclaré',
        color: 'bg-blue-100 text-amber-800',
        description: 'Profil en attente de vérification'
      },
      'verified': {
        icon: <CheckCircle className="h-4 w-4" />,
        text: 'Vérifié',
        color: 'bg-green-100 text-green-800',
        description: 'Entreprise vérifiée par ÉMÉRÉS'
      },
      'partner': {
        icon: <Star className="h-4 w-4" />,
        text: 'Partenaire',
        color: 'bg-purple-100 text-purple-800',
        description: 'Partenaire certifié ÉMÉRÉS'
      }
    };

    const badge = badges[status] || badges['auto_declared'];

    return (
      <div className="flex items-center space-x-2">
        <Badge className={`${badge.color} flex items-center space-x-1`}>
          {badge.icon}
          <span>{badge.text}</span>
        </Badge>
        <span className="text-xs text-gray-500">{badge.description}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Background Image globale pour dashboard entreprise */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Header ÉMÉRÉS unique et complet - remplace la navigation globale */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo ÉMÉRÉS avec navigation contextuelle */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <img 
                  src="/emeres-logo.png" 
                  alt="ÉMÉRÉS" 
                  className="h-6 w-6 sm:h-8 sm:w-8 cursor-pointer" 
                  onClick={() => setActivePage('dashboard')}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%2314B8A6"/><text x="50" y="60" text-anchor="middle" fill="white" font-size="40" font-family="Arial, sans-serif">É</text></svg>';
                  }}
                />
                <div>
                  <span 
                    className="text-lg sm:text-xl font-bold text-blue-600 cursor-pointer"
                    onClick={() => setActivePage('dashboard')}
                  >
                    ÉMÉRÉS
                  </span>
                  <div className="text-xs text-gray-500 hidden sm:block">Dashboard Entreprise</div>
                </div>
              </div>
              
              {/* Menu burger - uniquement mobile/tablette */}
              <EmeresButton
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                icon={<Menu />}
                className="p-1 sm:p-2 lg:hidden"
              />
            </div>

            {/* Navigation contextuelle du dashboard */}
            <div className="hidden md:flex items-center space-x-1">
              <EmeresButton
                variant={activePage === 'dashboard' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigateToPage('dashboard')}
                icon={<Building2 />}
                className="text-xs lg:text-sm"
              >
                <span className="hidden lg:inline">Accueil</span>
              </EmeresButton>
              
              <EmeresButton
                variant={activePage === 'candidates' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigateToPage('candidates')}
                icon={<Users />}
                className="text-xs lg:text-sm"
              >
                <span className="hidden lg:inline">Candidats</span>
              </EmeresButton>
              
              <EmeresButton
                variant={activePage === 'profile' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigateToPage('profile')}
                icon={<Building2 />}
                className="text-xs lg:text-sm"
              >
                <span className="hidden lg:inline">Mon Entreprise</span>
              </EmeresButton>
            </div>

            {/* Actions droite - notifications et profil */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Barre de recherche - cachée sur mobile */}
              <div className="relative hidden xl:block">
                <EmeresInput
                  placeholder="Rechercher..."
                  className="w-48 xl:w-64"
                  leftIcon={<Search className="h-4 w-4 text-gray-400" />}
                />
              </div>

              {/* Notifications responsive */}
              <div className="relative">
                <EmeresButton
                  variant="ghost"
                  size="sm"
                  icon={<Bell />}
                  className="relative p-1 sm:p-2"
                >
                  <EmeresBadge
                    variant="error"
                    size="xs"
                    className="absolute -top-1 -right-1 px-1 py-0.5 text-xs leading-none"
                  >
                    3
                  </EmeresBadge>
                </EmeresButton>
              </div>

              {/* Menu profil utilisateur */}
              <div className="relative group">
                <button className="flex items-center space-x-2 p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-emeres-primary rounded-full flex items-center justify-center">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                      {companyProfile?.company_name || user?.first_name || 'Entreprise'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Compte Entreprise
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 hidden lg:block" />
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-emeres-lg border border-gray-100 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button 
                    onClick={() => navigateToPage('profile')}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Building2 className="w-4 h-4" />
                    Mon Entreprise
                  </button>
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
                    Paramètres
                  </button>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button 
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/';
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Layout avec sidebar responsive */}
      <div className="flex relative">
        {/* Overlay mobile pour fermer la sidebar */}
        {!sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        {/* Sidebar responsive avec breakpoints */}
        <aside className={`
          ${sidebarCollapsed ? 'w-12' : 'w-56'} 
          bg-white/95 backdrop-blur-md border-r border-gray-200 
          fixed left-0 top-16 bottom-0 z-30 transition-all duration-300 overflow-hidden shadow-emeres-sm
          ${sidebarCollapsed 
            ? 'lg:translate-x-0 -translate-x-full lg:-translate-x-0' 
            : 'translate-x-0'
          }
        `}>
          <div className="h-full overflow-y-auto emeres-scrollbar p-2 sm:p-4">
            <div className="space-y-1 sm:space-y-2">
              {sidebarCategories.map((category) => {
                if (category.isStandalone) {
                  // Traitement spécial pour l'Accueil
                  const Icon = category.icon;
                  const isActive = activePage === category.id;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        navigateToPage(category.id);
                        if (window.innerWidth < 1024) {
                          setSidebarCollapsed(true);
                        }
                      }}
                      className={`
                        w-full group flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 relative overflow-hidden
                        ${isActive 
                          ? `bg-gradient-to-r ${category.gradient} text-white shadow-emeres-md transform scale-[1.02]` 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className={`
                        relative z-10 flex-shrink-0 transition-transform duration-300
                        ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                      `}>
                        <Icon className={`
                          h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300
                          ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}
                        `} />
                      </div>
                      
                      {!sidebarCollapsed && (
                        <div className="flex-1 text-left relative z-10 min-w-0">
                          <div className={`
                            font-medium text-xs sm:text-sm transition-colors duration-300 truncate
                            ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'}
                          `}>
                            {category.label}
                          </div>
                          <div className={`
                            text-xs mt-0.5 transition-colors duration-300 truncate hidden sm:block
                            ${isActive ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-600'}
                          `}>
                            {category.description}
                          </div>
                        </div>
                      )}
                      
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          {category.label}
                        </div>
                      )}
                    </button>
                  );
                }
                
                // Traitement pour les catégories avec sous-éléments
                const CategoryIcon = category.icon;
                const isExpanded = expandedCategories[category.id];
                const hasActiveChild = category.items.some(item => activePage === item.id);
                
                return (
                  <div key={category.id} className="space-y-1">
                    {/* En-tête de catégorie */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={`
                        w-full group flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 relative overflow-hidden
                        ${hasActiveChild 
                          ? `bg-gradient-to-r ${category.gradient} text-white shadow-emeres-md` 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className={`
                        relative z-10 flex-shrink-0 transition-transform duration-300
                        ${hasActiveChild ? 'scale-110' : 'group-hover:scale-105'}
                      `}>
                        <CategoryIcon className={`
                          h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300
                          ${hasActiveChild ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}
                        `} />
                      </div>
                      
                      {!sidebarCollapsed && (
                        <>
                          <div className="flex-1 text-left relative z-10 min-w-0">
                            <div className={`
                              font-semibold text-xs sm:text-sm transition-colors duration-300 truncate
                              ${hasActiveChild ? 'text-white' : 'text-gray-800 group-hover:text-gray-900'}
                            `}>
                              {category.label}
                            </div>
                            <div className={`
                              text-xs mt-0.5 transition-colors duration-300 truncate hidden sm:block
                              ${hasActiveChild ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-600'}
                            `}>
                              {category.description}
                            </div>
                          </div>
                          
                          {/* Chevron d'expansion */}
                          <ChevronRight className={`
                            h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 relative z-10
                            ${isExpanded ? 'rotate-90' : ''}
                            ${hasActiveChild ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}
                          `} />
                        </>
                      )}
                      
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          {category.label}
                        </div>
                      )}
                    </button>
                    
                    {/* Sous-éléments de la catégorie */}
                    {!sidebarCollapsed && isExpanded && (
                      <div className="ml-6 space-y-1">
                        {category.items.map((item) => {
                          const ItemIcon = item.icon;
                          const isActive = activePage === item.id;
                          
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                navigateToPage(item.id);
                                if (window.innerWidth < 1024) {
                                  setSidebarCollapsed(true);
                                }
                              }}
                              className={`
                                w-full group flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg transition-all duration-300 relative overflow-hidden text-left
                                ${isActive 
                                  ? 'bg-gray-100 text-teal-700 border-l-2 border-teal-500' 
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }
                              `}
                            >
                              <div className={`
                                relative z-10 flex-shrink-0 transition-transform duration-300
                                ${isActive ? 'scale-105' : 'group-hover:scale-105'}
                              `}>
                                <ItemIcon className={`
                                  h-3 w-3 sm:h-4 sm:w-4 transition-colors duration-300
                                  ${isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-600'}
                                `} />
                              </div>
                              
                              <div className="flex-1 text-left relative z-10 min-w-0">
                                <div className={`
                                  font-medium text-xs transition-colors duration-300 truncate
                                  ${isActive ? 'text-teal-700' : 'text-gray-700 group-hover:text-gray-900'}
                                `}>
                                  {item.label}
                                </div>
                                <div className={`
                                  text-xs mt-0.5 transition-colors duration-300 truncate hidden sm:block
                                  ${isActive ? 'text-teal-600' : 'text-gray-500 group-hover:text-gray-600'}
                                `}>
                                  {item.description}
                                </div>
                              </div>
                              
                              {item.badge && (
                                <EmeresBadge
                                  variant={isActive ? "default" : "secondary"}
                                  size="xs"
                                  className={`
                                    relative z-10 transition-all duration-300 text-xs
                                    ${isActive ? 'bg-teal-100 text-teal-700' : ''}
                                  `}
                                >
                                  {item.badge}
                                </EmeresBadge>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Footer responsive de la sidebar */}
            {!sidebarCollapsed && (
              <div className="mt-4 sm:mt-8 p-3 sm:p-4 bg-gradient-emeres-subtle rounded-lg sm:rounded-xl border border-teal-200">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-emeres-primary rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900">ÉMÉRÉS Pro</div>
                    <div className="text-xs text-gray-600 hidden sm:block">Plateforme avancée</div>
                  </div>
                </div>
                <EmeresButton
                  variant="primary"
                  size="sm"
                  fullWidth
                  className="text-xs"
                >
                  <span className="hidden sm:inline">Découvrir les fonctionnalités</span>
                  <span className="sm:hidden">Découvrir</span>
                </EmeresButton>
              </div>
            )}
          </div>
        </aside>

        {/* Contenu principal responsive - s'adapte à toutes les tailles */}
        <main className={`
          transition-all duration-300 min-h-screen w-full
          ${sidebarCollapsed ? 'lg:ml-12' : 'lg:ml-56'}
        `}>
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-none">
            {/* Breadcrumb et header contextuel - responsive */}
            {activePage !== 'dashboard' && (
              <div className="mb-6 sm:mb-8">
                <EmeresBreadcrumb items={getPageConfig(activePage).breadcrumbs} />
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {getPageConfig(activePage).title}
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg">
                      {getPageConfig(activePage).description}
                    </p>
                  </div>
                  
                  {/* Actions contextuelles rapides - responsive */}
                  <div className="flex items-center gap-3">
                    {activePage === 'offers' && (
                      <EmeresButton
                        variant="primary"
                        icon={<PlusCircle />}
                        size="sm"
                        onClick={() => {/* Action création */}}
                        className="sm:size-md"
                      >
                        <span className="hidden sm:inline">Nouvelle offre</span>
                        <span className="sm:hidden">Nouvelle</span>
                      </EmeresButton>
                    )}
                    {activePage === 'strategy' && (
                      <EmeresBadge variant="gradient" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
                        IA Conseil
                      </EmeresBadge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Contenu spécifique responsive avec grilles adaptatives */}
            <div className="space-y-4 sm:space-y-6">
              {activePage === 'dashboard' && (
                <div>
                  {/* Pas de breadcrumb pour la page d'accueil du dashboard */}
                  <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {getPageConfig('dashboard').title}
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg">
                      {getPageConfig('dashboard').description}
                    </p>
                  </div>
                  {renderDashboardCards()}
                </div>
              )}
              
              {activePage === 'profile' && (
                <div className="max-w-7xl">
                  <EnhancedCompanyProfile 
                    user={user}
                    companyProfile={companyProfile}
                    onProfileUpdate={setCompanyProfile}
                  />
                </div>
              )}
              
              {activePage === 'offers' && (
                <div className="max-w-7xl">
                  <OfferManagement 
                    user={user}
                    companyProfile={companyProfile}
                  />
                </div>
              )}
              
              {activePage === 'candidates' && (
                <div className="max-w-7xl">
                  <ApplicationTracking 
                    user={user}
                    companyProfile={companyProfile}
                  />
                </div>
              )}
              
              {activePage === 'interns' && (
                <div className="max-w-7xl">
                  <InternshipTracking 
                    user={user}
                    companyProfile={companyProfile}
                  />
                </div>
              )}
              
              {activePage === 'team' && (
                <div className="max-w-7xl">
                  <TeamManagement 
                    user={user}
                    companyProfile={companyProfile}
                  />
                </div>
              )}
              
              {activePage === 'analytics' && (
                <div className="max-w-7xl">
                  <AnalyticsDashboard 
                    user={user}
                    companyProfile={companyProfile}
                  />
                </div>
              )}
              
              {activePage === 'communication' && (
                <div className="max-w-7xl">
                  <AdvancedCommunication 
                    user={user}
                    companyProfile={companyProfile}
                  />
                </div>
              )}
              
              {activePage === 'documents' && (
                <div className="max-w-7xl">
                  <DocumentManagement 
                    user={user}
                    companyProfile={companyProfile}
                  />
                </div>
              )}
              
              {activePage === 'strategy' && (
                <div className="max-w-7xl">
                  <StrategyModule 
                    user={user}
                    userProfile={companyProfile}
                    userRole="company"
                  />
                </div>
              )}
              
              {activePage === 'satisfaction' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl">
                  <EmeresCard variant="default" className="border-green-200 bg-green-50">
                    <EmeresCardContent padding="md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">Note Moyenne</p>
                          <p className="text-2xl sm:text-3xl font-bold text-green-900">4.8/5</p>
                          <p className="text-xs text-green-600">+0.2 ce mois</p>
                        </div>
                        <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                      </div>
                    </EmeresCardContent>
                  </EmeresCard>
                  
                  <EmeresCard variant="default" className="border-blue-200 bg-blue-50">
                    <EmeresCardContent padding="md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Recommandations</p>
                          <p className="text-2xl sm:text-3xl font-bold text-blue-900">94%</p>
                          <p className="text-xs text-blue-600">Très positif</p>
                        </div>
                        <Star className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                      </div>
                    </EmeresCardContent>
                  </EmeresCard>
                  
                  <EmeresCard variant="default" className="border-orange-200 bg-orange-50 sm:col-span-2 lg:col-span-1">
                    <EmeresCardContent padding="md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-orange-600 font-medium">Commentaires</p>
                          <p className="text-2xl sm:text-3xl font-bold text-orange-900">28</p>
                          <p className="text-xs text-orange-600">Cette semaine</p>
                        </div>
                        <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
                      </div>
                    </EmeresCardContent>
                  </EmeresCard>
                </div>
              )}
              
              {activePage === 'integrations' && (
                <div className="max-w-7xl">
                  <IntegrationsManagement 
                    user={user}
                    companyProfile={companyProfile}
                  />
                </div>
              )}
              
              {activePage === 'talent-search' && (
                <div className="max-w-7xl">
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Search className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Recherche de Talents</h2>
                    <p className="text-gray-600 mb-6">
                      Découvrez et contactez les candidats les plus qualifiés pour vos postes.
                    </p>
                    <EmeresButton
                      variant="primary"
                      onClick={() => navigateToPage('candidates')}
                    >
                      Voir les candidatures reçues
                    </EmeresButton>
                  </div>
                </div>
              )}
              
              {activePage === 'settings' && (
                <div className="max-w-7xl">
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Paramètres du Compte</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notifications Candidatures
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" defaultChecked />
                              <span className="text-sm text-gray-600">Email instantané pour nouvelles candidatures</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" defaultChecked />
                              <span className="text-sm text-gray-600">Rapport hebdomadaire de performance</span>
                            </label>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Visibilité Entreprise
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" defaultChecked />
                              <span className="text-sm text-gray-600">Profil visible dans l'annuaire ÉMÉRÉS</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span className="text-sm text-gray-600">Réception de candidatures spontanées</span>
                            </label>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Équipe RH
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" defaultChecked />
                              <span className="text-sm text-gray-600">Permettre ajout de collaborateurs</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" defaultChecked />
                              <span className="text-sm text-gray-600">Notifications partagées avec l'équipe</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;