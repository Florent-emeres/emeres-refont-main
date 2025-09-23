import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import EmeresButton from './ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from './ui/EmeresCard';
import EmeresBadge from './ui/EmeresBadge';
import EmeresInput from './ui/EmeresInput';
import EmeresBreadcrumb from './ui/EmeresBreadcrumb';
import { 
  Building, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart,
  MapPin,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Bell,
  Menu,
  Eye,
  Edit,
  ChevronDown,
  ChevronRight,
  LogOut,
  Settings,
  Sparkles,
  Database,
  Globe,
  Activity,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  FileText,
  LineChart,
  Mail,
  Phone,
  ExternalLink,
  Info,
  Lightbulb,
  Shield,
  Heart,
  Star
} from 'lucide-react';

const InstitutionDashboard = () => {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('3m');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const [marketData, setMarketData] = useState({
    offres: {
      ouvertes: 0,
      nouvelles: 0,
      pourvues: 0,
      delaiMoyenPourvoi: 0,
      tauxConversion: 0
    },
    competencesDemandees: []
  });

  const [studentData, setStudentData] = useState({
    actifs: 0,
    diplomes: 0,
    enRecherche: 0,
    tauxPlacement3m: 0,
    tauxPlacement6m: 0,
    tauxPlacement12m: 0
  });

  // Charger les vraies données depuis le backend
  useEffect(() => {
    loadInstitutionData();
  }, []);

  const loadInstitutionData = async () => {
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const API = `${BACKEND_URL}/api`;

      // Charger les offres pour calculer les stats marché
      const offersResponse = await fetch(`${API}/offers`);
      const offers = offersResponse.ok ? await offersResponse.json() : [];
      
      // Calculer les stats du marché depuis les vraies offres
      const openOffers = offers.filter(offer => offer.status === 'open' || !offer.status).length;
      const newOffers = offers.filter(offer => {
        const createdDate = new Date(offer.created_at || offer.date_posted);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return createdDate > oneWeekAgo;
      }).length;

      // Extraire les compétences demandées depuis les offres
      const skillsMap = {};
      offers.forEach(offer => {
        const skills = offer.required_skills || offer.skills || [];
        skills.forEach(skill => {
          skillsMap[skill] = (skillsMap[skill] || 0) + 1;
        });
      });

      const topSkills = Object.entries(skillsMap)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([nom, demande]) => ({
          nom,
          demande,
          croissance: Math.random() * 30 // TODO: Calculer la vraie croissance
        }));

      setMarketData({
        offres: {
          ouvertes: openOffers,
          nouvelles: newOffers,
          pourvues: Math.round(offers.length * 0.1), // Estimation
          delaiMoyenPourvoi: offers.length > 0 ? 18.5 : 0,
          tauxConversion: offers.length > 0 ? Math.round((openOffers / offers.length) * 100) : 0
        },
        competencesDemandees: topSkills
      });

      // TODO: Charger les vraies données étudiants quand l'endpoint sera disponible
      // Pour l'instant, utiliser des estimations basées sur le nombre d'offres
      setStudentData({
        actifs: offers.length * 57, // Estimation: 57 étudiants par offre
        diplomes: Math.round(offers.length * 9.2),
        enRecherche: Math.round(offers.length * 4.7),
        tauxPlacement3m: offers.length > 0 ? 78.2 : 0,
        tauxPlacement6m: offers.length > 0 ? 89.6 : 0,
        tauxPlacement12m: offers.length > 0 ? 94.1 : 0
      });

    } catch (error) {
      console.error('Erreur lors du chargement des données institution:', error);
      // Garder les valeurs par défaut (0) en cas d'erreur
    }
  };

  const [tensionMetiers] = useState([
    { 
      metier: 'Développeur Full-Stack', 
      tension: 2.4, 
      offres: 156, 
      candidats: 65, 
      statut: 'haute',
      evolution: 'croissante'
    },
    { 
      metier: 'Data Scientist', 
      tension: 3.1, 
      offres: 89, 
      candidats: 29, 
      statut: 'critique',
      evolution: 'croissante'
    },
    { 
      metier: 'Chef de Projet Digital', 
      tension: 1.8, 
      offres: 67, 
      candidats: 37, 
      statut: 'moderate',
      evolution: 'stable'
    },
    { 
      metier: 'UX/UI Designer', 
      tension: 0.9, 
      offres: 45, 
      candidats: 50, 
      statut: 'equilibre',
      evolution: 'baisse'
    }
  ]);

  const [gapCompetences] = useState([
    { 
      formation: 'Master Data Science', 
      competencesEnseignees: ['Python', 'SQL', 'Statistics'], 
      competencesDemandees: ['Python', 'SQL', 'Machine Learning', 'Cloud', 'Tableau'],
      gap: ['Machine Learning', 'Cloud', 'Tableau'],
      score: 72.5
    },
    { 
      formation: 'Licence Informatique', 
      competencesEnseignees: ['Java', 'HTML', 'CSS'], 
      competencesDemandees: ['JavaScript', 'React', 'Node.js', 'Git'],
      gap: ['JavaScript', 'React', 'Node.js', 'Git'],
      score: 45.8
    }
  ]);

  const [regionsData] = useState([
    { region: 'Île-de-France', offres: 567, candidats: 423, tension: 1.34, statut: 'excedent_offres' },
    { region: 'Auvergne-Rhône-Alpes', offres: 234, candidats: 267, tension: 0.88, statut: 'excedent_candidats' },
    { region: 'Occitanie', offres: 189, candidats: 156, tension: 1.21, statut: 'equilibre' },
    { region: 'Nouvelle-Aquitaine', offres: 145, candidats: 134, tension: 1.08, statut: 'equilibre' }
  ]);

  const [qualiteData] = useState({
    scoreMoyenEvaluations: 8.2,
    tauxAlerteRPS: 2.1,
    tempsResolutionRPS: 3.4,
    satisfactionEntreprises: 87.3,
    satisfactionEcoles: 91.2,
    roiProgrammes: 156.7
  });

  // Gérer la sidebar responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarCollapsed(false);
      } else if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Configuration de la sidebar avec catégorisation logique ÉMÉRÉS pour Institutions
  const sidebarCategories = [
    {
      id: 'dashboard',
      label: 'Vue 360°',
      icon: BarChart3,
      description: 'Pilotage formation-débouchés',  
      gradient: 'from-teal-500 to-teal-600',
      isStandalone: true
    },
    {
      id: 'tools',
      label: 'Outils BI',
      icon: Zap,
      description: 'Business Intelligence et analyses',
      gradient: 'from-blue-500 to-purple-600',
      items: [
        { 
          id: 'custom-reports', 
          label: 'Rapports Personnalisés', 
          icon: FileText, 
          description: 'Créer vos analyses',
          badge: 'IA'
        },
        { 
          id: 'predictive-analytics', 
          label: 'Analytics Prédictifs', 
          icon: TrendingUp, 
          description: 'Prédictions marché',
          badge: 'IA'
        },
        { 
          id: 'data-export', 
          label: 'Export Données', 
          icon: Database, 
          description: 'Extraction et export'
        }
      ]
    },
    {
      id: 'resources',
      label: 'Ressources',
      icon: Database,
      description: 'Données externes et documentation',
      gradient: 'from-emerald-500 to-green-600',
      items: [
        { 
          id: 'external-data', 
          label: 'Données Externes', 
          icon: Database, 
          description: 'DARES, INSEE, France Travail',
          badge: 'Live'
        },
        { 
          id: 'documentation', 
          label: 'Documentation', 
          icon: BookOpen, 
          description: 'Guides et méthodologies'
        },
        { 
          id: 'api-access', 
          label: 'Accès API', 
          icon: Zap, 
          description: 'Intégrations tierces'
        }
      ]
    },
    {
      id: 'tracking',
      label: 'Suivi & Analytics',
      icon: BarChart3,
      description: 'Métriques et KPIs sectoriels',
      gradient: 'from-orange-500 to-red-500',
      items: [
        { 
          id: 'market-demand', 
          label: 'Demande Marché', 
          icon: TrendingUp, 
          description: 'Offres & entreprises',
          badge: 'DARES'
        },
        { 
          id: 'talent-supply', 
          label: 'Offre Talent', 
          icon: GraduationCap, 
          description: 'Étudiants & écoles'
        },
        { 
          id: 'adequation', 
          label: 'Adéquation', 
          icon: Target, 
          description: 'Matching & tensions',
          badge: 'IA'
        },
        { 
          id: 'quality', 
          label: 'Qualité & Impact', 
          icon: Award, 
          description: 'Évaluations & ROI'
        }
      ]
    },
    {
      id: 'discovery',
      label: 'Découverte',
      icon: Search,
      description: 'Exploration et tendances',
      gradient: 'from-purple-500 to-pink-600',
      items: [
        { 
          id: 'geography', 
          label: 'Analyse Géographique', 
          icon: MapPin, 
          description: 'Cartes & territoires',
          badge: 'INSEE'
        },
        { 
          id: 'emerging-trends', 
          label: 'Tendances Émergentes', 
          icon: TrendingUp, 
          description: 'Nouveaux métiers'
        },
        { 
          id: 'competitive-intel', 
          label: 'Veille Concurrentielle', 
          icon: Eye, 
          description: 'Analyse comparative'
        }
      ]
    },
    {
      id: 'profile-settings',
      label: 'Profil & Paramètres',
      icon: Settings,
      description: 'Configuration institution',
      gradient: 'from-gray-500 to-slate-600',
      items: [
        { 
          id: 'institution-config', 
          label: 'Configuration', 
          icon: Building, 
          description: 'Paramètres institution'
        },
        { 
          id: 'data-access', 
          label: 'Accès Données', 
          icon: Database, 
          description: 'Permissions et APIs'
        },
        { 
          id: 'alerts', 
          label: 'Alertes & Prédictions', 
          icon: AlertTriangle, 
          description: 'Système d\'alertes',
          badge: 'Nouveau'
        }
      ]
    }
  ];

  // Configuration des pages
  const getPageConfig = (pageId) => {
    const configs = {
      dashboard: {
        title: 'Pilotage Formation ↔ Débouchés',
        breadcrumbs: ['Pilotage Stratégique'],
        description: 'Vision 360° du marché de l\'emploi et de l\'adéquation formation-débouchés'
      },
      'market-demand': {
        title: 'Analyse de la demande marché',
        breadcrumbs: ['Pilotage', 'Demande Marché'],
        description: 'Offres, entreprises et tensions métiers avec données DARES'
      },
      'talent-supply': {
        title: 'Offre de talent et formations',
        breadcrumbs: ['Pilotage', 'Offre Talent'],
        description: 'Étudiants, compétences et trajectoires de placement'
      },
      adequation: {
        title: 'Adéquation formation-emploi',
        breadcrumbs: ['Pilotage', 'Adéquation'],
        description: 'Gap de compétences et matching avec IA prédictive'
      },
      geography: {
        title: 'Analyse géographique des tensions',
        breadcrumbs: ['Pilotage', 'Géographie'],
        description: 'Cartes choroplèthes et données territoriales INSEE'
      },
      quality: {
        title: 'Qualité et impact des formations',
        breadcrumbs: ['Pilotage', 'Qualité'],
        description: 'Évaluations, satisfaction et ROI des programmes'
      },
      alerts: {
        title: 'Système d\'alertes prédictives',
        breadcrumbs: ['Pilotage', 'Alertes'],
        description: 'Détection précoce des risques et recommandations'
      },
      'external-data': {
        title: 'Intégration données externes',
        breadcrumbs: ['Pilotage', 'Données Externes'],
        description: 'Sources DARES, INSEE, France Travail, ONISEP/RNCP'
      }
    };
    
    return configs[pageId] || configs.dashboard;
  };

  const navigateToPage = (page) => {
    setActivePage(page);
  };

  const getTensionStatusColor = (statut) => {
    switch (statut) {
      case 'critique':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'haute':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate':
        return 'bg-blue-100 text-amber-800 border-blue-200';
      case 'equilibre':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEvolutionIcon = (evolution) => {
    switch (evolution) {
      case 'croissante':
        return <ArrowUp className="h-3 w-3 text-green-600" />;
      case 'baisse':
        return <ArrowDown className="h-3 w-3 text-red-600" />;
      case 'stable':
        return <Minus className="h-3 w-3 text-gray-600" />;
      default:
        return null;
    }
  };

  const getRegionStatusColor = (statut) => {
    switch (statut) {
      case 'excedent_offres':
        return 'bg-blue-100 text-blue-800';
      case 'excedent_candidats':
        return 'bg-orange-100 text-orange-800';
      case 'equilibre':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Rendu des cartes KPI principales
  const renderDashboardKPIs = () => {
    const kpis = [
      {
        title: 'Tension Moyenne Marché',
        value: '2.1',
        subtitle: 'offres/candidat',
        change: '+0.3 vs mois dernier',
        trend: 'up',
        icon: TrendingUp,
        gradient: 'from-red-500 to-orange-500',
        description: 'Indice DARES modifié'
      },
      {
        title: 'Taux Placement Global',
        value: '89.6%',
        subtitle: 'à 6 mois',
        change: '+2.4% vs cohorte précédente',
        trend: 'up',
        icon: Target,
        gradient: 'from-green-500 to-teal-500',
        description: 'Tous programmes confondus'
      },
      {
        title: 'Gap Compétences Moyen',
        value: '27.3%',
        subtitle: 'écart formation/marché',
        change: '-3.1% vs trimestre dernier',
        trend: 'down',
        icon: AlertTriangle,
        gradient: 'from-orange-500 to-red-500',
        description: 'Analyse prédictive IA'
      },
      {
        title: 'Score Qualité Formations',
        value: '8.2/10',
        subtitle: 'satisfaction globale',
        change: '+0.3 vs année dernière',
        trend: 'up',
        icon: Award,
        gradient: 'from-purple-500 to-pink-500',
        description: 'Évaluations multi-acteurs'
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <EmeresCard
              key={index}
              variant="default"
              interactive={true}
              className="group hover-lift cursor-pointer"
            >
              <div className={`bg-gradient-to-r ${kpi.gradient} p-4 text-white relative overflow-hidden`}>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-5 w-5" />
                      <h3 className="font-semibold text-sm">{kpi.title}</h3>
                    </div>
                    <p className="text-xs text-white/80">{kpi.description}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </div>
              
              <div className="p-4">
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {kpi.value}
                    </div>
                    <div className="text-xs text-gray-500">
                      {kpi.subtitle}
                    </div>
                  </div>
                </div>
                
                <div className={`text-xs font-medium flex items-center gap-1 ${
                  kpi.trend === 'up' ? 'text-green-600' : 
                  kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {kpi.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : 
                   kpi.trend === 'down' ? <ArrowDown className="h-3 w-3" /> : null}
                  {kpi.change}
                </div>
              </div>
            </EmeresCard>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header ÉMÉRÉS */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
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
                  <div className="text-xs text-gray-500 hidden sm:block">Dashboard Institution</div>
                </div>
              </div>
              
              <EmeresButton
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                icon={<Menu />}
                className="p-1 sm:p-2 lg:hidden"
              />
            </div>

            <div className="hidden md:flex items-center space-x-1">
              <EmeresButton
                variant={activePage === 'dashboard' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigateToPage('dashboard')}
                icon={<BarChart3 />}
                className="text-xs lg:text-sm"
              >
                <span className="hidden lg:inline">Vue 360°</span>
              </EmeresButton>
              
              <EmeresButton
                variant={activePage === 'adequation' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigateToPage('adequation')}
                icon={<Target />}
                className="text-xs lg:text-sm"
              >
                <span className="hidden lg:inline">Adéquation</span>
              </EmeresButton>
              
              <EmeresButton
                variant={activePage === 'alerts' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigateToPage('alerts')}
                icon={<AlertTriangle />}
                className="text-xs lg:text-sm"
              >
                <span className="hidden lg:inline">Alertes</span>
              </EmeresButton>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-3">
              <div className="flex items-center gap-2">
                <select 
                  value={selectedTimeframe} 
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white"
                >
                  <option value="1m">1 mois</option>
                  <option value="3m">3 mois</option>
                  <option value="6m">6 mois</option>
                  <option value="1y">1 an</option>
                </select>
                
                <EmeresButton
                  variant="ghost"
                  size="sm"
                  icon={<RefreshCw />}
                  className="p-1 sm:p-2"
                />
              </div>

              <div className="relative hidden xl:block">
                <EmeresInput
                  placeholder="Rechercher métier, compétence..."
                  className="w-48 xl:w-64 pl-10"
                  leftIcon={<Search className="h-4 w-4 text-gray-400" />}
                />
              </div>

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

              <div className="relative group">
                <button className="flex items-center space-x-2 p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-emeres-primary rounded-full flex items-center justify-center">
                    <Building className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                      Institution ÉMÉRÉS
                    </div>
                    <div className="text-xs text-gray-500">
                      Pilotage Stratégique
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 hidden lg:block" />
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-emeres-lg border border-gray-100 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Building className="w-4 h-4" />
                    Mon Institution
                  </button>
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
                    Configuration
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

      <div className="flex relative">
        {!sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

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
            
            {!sidebarCollapsed && (
              <div className="mt-4 sm:mt-8 p-3 sm:p-4 bg-gradient-emeres-subtle rounded-lg sm:rounded-xl border border-teal-200">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-emeres-primary rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900">ÉMÉRÉS Institution</div>
                    <div className="text-xs text-gray-600 hidden sm:block">Business Intelligence</div>
                  </div>
                </div>
                <EmeresButton
                  variant="primary"
                  size="sm"
                  fullWidth
                  className="text-xs"
                >
                  <span className="hidden sm:inline">Rapport Exécutif IA</span>
                  <span className="sm:hidden">Rapport IA</span>
                </EmeresButton>
              </div>
            )}
          </div>
        </aside>

        <main className={`
          transition-all duration-300 min-h-screen w-full
          ${sidebarCollapsed ? 'lg:ml-12' : 'lg:ml-56'}
        `}>
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-none">
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
                  
                  <div className="flex items-center gap-3">
                    <EmeresButton
                      variant="secondary"
                      icon={<Download />}
                      size="sm"
                      className="sm:size-md"
                    >
                      <span className="hidden sm:inline">Export</span>
                    </EmeresButton>
                    <EmeresButton
                      variant="primary"
                      icon={<RefreshCw />}
                      size="sm"
                      className="sm:size-md"
                    >
                      <span className="hidden sm:inline">Actualiser</span>
                      <span className="sm:hidden">MAJ</span>
                    </EmeresButton>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 sm:space-y-6">
              {activePage === 'dashboard' && (
                <div>
                  <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      Pilotage Formation ↔ Débouchés
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg">
                      Vision 360° croisée données internes et externes (DARES, INSEE, France Travail)
                    </p>
                  </div>
                  
                  {/* KPI principaux */}
                  {renderDashboardKPIs()}

                  {/* Contenu principal du dashboard */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    
                    {/* Tensions Métiers */}
                    <div className="xl:col-span-2">
                      <EmeresCard variant="default" className="h-full">
                        <EmeresCardHeader>
                          <EmeresCardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-orange-600" />
                            Tensions par Métier
                            <EmeresBadge variant="secondary" size="sm">DARES</EmeresBadge>
                          </EmeresCardTitle>
                          <EmeresCardDescription>
                            Indice offres/candidats avec évolution et alertes
                          </EmeresCardDescription>
                        </EmeresCardHeader>
                        <EmeresCardContent className="space-y-4">
                          {tensionMetiers.map((metier, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-medium text-gray-900">{metier.metier}</h4>
                                  <EmeresBadge 
                                    variant="outline" 
                                    size="sm"
                                    className={getTensionStatusColor(metier.statut)}
                                  >
                                    {metier.statut}
                                  </EmeresBadge>
                                  {getEvolutionIcon(metier.evolution)}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span>Indice: <strong>{metier.tension}</strong></span>
                                  <span>{metier.offres} offres</span>
                                  <span>{metier.candidats} candidats</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-lg font-bold ${
                                  metier.tension >= 2.5 ? 'text-red-600' :
                                  metier.tension >= 1.5 ? 'text-orange-600' : 'text-green-600'
                                }`}>
                                  {metier.tension}
                                </div>
                              </div>
                            </div>
                          ))}
                          <EmeresButton variant="outline" size="sm" fullWidth icon={<Eye />}>
                            Voir l'analyse complète
                          </EmeresButton>
                        </EmeresCardContent>
                      </EmeresCard>
                    </div>

                    {/* Compétences les plus demandées */}
                    <div>
                      <EmeresCard variant="default" className="h-full">
                        <EmeresCardHeader>
                          <EmeresCardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-blue-600" />
                            Top Compétences
                          </EmeresCardTitle>
                          <EmeresCardDescription>
                            Demande marché & croissance
                          </EmeresCardDescription>
                        </EmeresCardHeader>
                        <EmeresCardContent className="space-y-3">
                          {marketData.competencesDemandees.map((competence, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                              <div>
                                <h4 className="font-medium text-gray-900 text-sm">{competence.nom}</h4>
                                <p className="text-xs text-gray-600">{competence.demande} offres</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1">
                                  <ArrowUp className="h-3 w-3 text-green-600" />
                                  <span className="text-sm font-medium text-green-600">
                                    +{competence.croissance}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </EmeresCardContent>
                      </EmeresCard>
                    </div>
                  </div>

                  {/* Deuxième ligne */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    
                    {/* Gap Compétences */}
                    <EmeresCard variant="default">
                      <EmeresCardHeader>
                        <EmeresCardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          Gap Compétences par Formation
                          <EmeresBadge variant="primary" size="sm">IA</EmeresBadge>
                        </EmeresCardTitle>
                        <EmeresCardDescription>
                          Écart entre enseignement et demande marché
                        </EmeresCardDescription>
                      </EmeresCardHeader>
                      <EmeresCardContent className="space-y-4">
                        {gapCompetences.map((gap, index) => (
                          <div key={index} className="p-4 border border-gray-100 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900">{gap.formation}</h4>
                              <EmeresBadge 
                                variant="outline" 
                                size="sm"
                                className={gap.score >= 70 ? 'text-green-700 border-green-300' : 
                                          gap.score >= 50 ? 'text-amber-700 border-blue-300' : 
                                          'text-red-700 border-red-300'}
                              >
                                {gap.score}% adéquation
                              </EmeresBadge>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-gray-600">Manquant: </span>
                                <span className="font-medium text-red-700">
                                  {gap.gap.join(', ')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </EmeresCardContent>
                    </EmeresCard>

                    {/* Analyse Géographique */}
                    <EmeresCard variant="default">
                      <EmeresCardHeader>
                        <EmeresCardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-purple-600" />
                          Tensions Géographiques
                          <EmeresBadge variant="secondary" size="sm">INSEE</EmeresBadge>
                        </EmeresCardTitle>
                        <EmeresCardDescription>
                          Équilibres régionaux offres/candidats
                        </EmeresCardDescription>
                      </EmeresCardHeader>
                      <EmeresCardContent className="space-y-3">
                        {regionsData.map((region, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">{region.region}</h4>
                              <p className="text-xs text-gray-600">
                                {region.offres} offres • {region.candidats} candidats
                              </p>
                            </div>
                            <div className="text-right">
                              <EmeresBadge 
                                variant="outline" 
                                size="sm"
                                className={getRegionStatusColor(region.statut)}
                              >
                                {region.statut === 'excedent_offres' ? 'Excédent offres' :
                                 region.statut === 'excedent_candidats' ? 'Excédent candidats' : 'Équilibré'}
                              </EmeresBadge>
                              <div className="text-sm font-medium text-gray-700 mt-1">
                                {region.tension}
                              </div>
                            </div>
                          </div>
                        ))}
                      </EmeresCardContent>
                    </EmeresCard>
                  </div>
                </div>
              )}
              
              {activePage !== 'dashboard' && (
                <EmeresCard>
                  <EmeresCardContent className="text-center py-12">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      {getPageConfig(activePage).title}
                    </h3>
                    <p className="text-gray-600">
                      Module de business intelligence en développement
                    </p>
                    <div className="mt-4">
                      <EmeresBadge variant="primary" size="lg">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Bientôt disponible
                      </EmeresBadge>
                    </div>
                  </EmeresCardContent>
                </EmeresCard>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstitutionDashboard;