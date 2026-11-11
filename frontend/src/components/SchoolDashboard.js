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
  GraduationCap,
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
  LogOut,
  Building,
  BookOpen,
  Library,
  Building2,
  Handshake
} from 'lucide-react';
import { useToast } from './hooks/use-toast';
import {
  StudentProgressPage,
  PlacementStatsPage,
  AnalyticsPage,
  SatisfactionPage,
  OpportunitiesPage,
  DocumentsPage,
  CommunicationPage,
  LibraryPage,
  MentorNetworkPage
} from './school/SchoolExtraPages';

const SchoolDashboard = ({ user }) => {
  const { toast } = useToast();
  const [schoolProfile, setSchoolProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [partnerships, setPartnerships] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [creatingPartnership, setCreatingPartnership] = useState(false);
  const [newPartnership, setNewPartnership] = useState({
    company_name: '',
    sector: '',
    contact_email: '',
    partnership_type: 'stage',
    description: ''
  });
  const [profileForm, setProfileForm] = useState(null);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [searchingStudents, setSearchingStudents] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [generatedInvitation, setGeneratedInvitation] = useState(null);
  const [schoolStats, setSchoolStats] = useState({
    total_students: 0,
    active_students: 0,
    partnerships_count: 0,
    placement_rate: 0,
    average_satisfaction: 0
  });
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  // Configuration de la sidebar avec catégorisation logique ÉMÉRÉS pour École
  const sidebarCategories = [
    {
      id: 'dashboard',
      label: 'Accueil',
      icon: GraduationCap,
      description: 'Vue d\'ensemble',
      gradient: 'from-teal-500 to-teal-600',
      isStandalone: true
    },
    {
      id: 'tools',
      label: 'Outils Pédagogiques',
      icon: Zap,
      description: 'Gestion étudiants et administration',
      gradient: 'from-blue-500 to-purple-600',
      items: [
        {
          id: 'students-management',
          label: 'Gestion Étudiants',
          icon: Users,
          description: 'Suivi et administration'
        },
        {
          id: 'curriculum-builder',
          label: 'Créateur Cursus',
          icon: BookOpen,
          description: 'Conception programmes',
          badge: 'Nouveau'
        },
        {
          id: 'partnerships-tool',
          label: 'Outil Partenariats',
          icon: Handshake,
          description: 'Création partenariats'
        }
      ]
    },
    {
      id: 'resources',
      label: 'Ressources',
      icon: Library,
      description: 'Contenus pédagogiques et communication',
      gradient: 'from-emerald-500 to-green-600',
      items: [
        {
          id: 'library',
          label: 'Bibliothèque',
          icon: Library,
          description: 'Ressources pédagogiques'
        },
        {
          id: 'communication',
          label: 'Communication',
          icon: MessageSquare,
          description: 'Messages et annonces'
        },
        {
          id: 'documents',
          label: 'Documents',
          icon: FileText,
          description: 'Conventions et contrats'
        }
      ]
    },
    {
      id: 'tracking',
      label: 'Suivi & Analytics',
      icon: BarChart3,
      description: 'Performance et statistiques',
      gradient: 'from-orange-500 to-red-500',
      items: [
        {
          id: 'student-progress',
          label: 'Progression Étudiants',
          icon: TrendingUp,
          description: 'Suivi des performances'
        },
        {
          id: 'placement-stats',
          label: 'Taux de Placement',
          icon: Target,
          description: 'Statistiques d\'insertion'
        },
        {
          id: 'analytics',
          label: 'Analytics École',
          icon: BarChart3,
          description: 'Métriques et KPIs'
        },
        {
          id: 'satisfaction',
          label: 'Satisfaction',
          icon: Award,
          description: 'Évaluations formations'
        }
      ]
    },
    {
      id: 'discovery',
      label: 'Découverte',
      icon: Search,
      description: 'Entreprises et opportunités',
      gradient: 'from-purple-500 to-pink-600',
      items: [
        {
          id: 'partnerships',
          label: 'Partenaires',
          icon: Building,
          description: 'Entreprises partenaires'
        },
        {
          id: 'opportunities',
          label: 'Opportunités',
          icon: Search,
          description: 'Stages et emplois'
        },
        {
          id: 'mentor-network',
          label: 'Réseau Mentors',
          icon: UserCheck,
          description: 'Mentors disponibles'
        }
      ]
    },
    {
      id: 'profile-settings',
      label: 'Profil & Paramètres',
      icon: Settings,
      description: 'Configuration école',
      gradient: 'from-gray-500 to-slate-600',
      items: [
        {
          id: 'school-profile',
          label: 'Profil École',
          icon: GraduationCap,
          description: 'Informations publiques'
        },
        {
          id: 'team-management',
          label: 'Gestion Équipe',
          icon: Users,
          description: 'Administration équipe'
        }
      ]
    }
  ];

  // Configuration des pages avec titres contextuels et breadcrumbs
  const getPageConfig = (pageId) => {
    const configs = {
      dashboard: {
        title: 'Vue d\'ensemble de l\'école',
        breadcrumbs: ['Dashboard'],
        description: 'Métriques clés et gestion des étudiants'
      },
      'school-profile': {
        title: 'Profil de l\'école',
        breadcrumbs: ['Profil & Paramètres', 'Profil École'],
        description: 'Informations publiques et présentation'
      },
      'students-management': {
        title: 'Gestion des étudiants',
        breadcrumbs: ['Outils Pédagogiques', 'Gestion Étudiants'],
        description: 'Administration et suivi des étudiants'
      },
      'curriculum-builder': {
        title: 'Créateur de cursus',
        breadcrumbs: ['Outils Pédagogiques', 'Créateur Cursus'],
        description: 'Conception et gestion des programmes'
      },
      'partnerships-tool': {
        title: 'Outil de partenariats',
        breadcrumbs: ['Outils Pédagogiques', 'Outil Partenariats'],
        description: 'Création et gestion des partenariats'
      },
      library: {
        title: 'Bibliothèque pédagogique',
        breadcrumbs: ['Ressources', 'Bibliothèque'],
        description: 'Ressources et contenus éducatifs'
      },
      communication: {
        title: 'Centre de communication',
        breadcrumbs: ['Ressources', 'Communication'],
        description: 'Messages et annonces'
      },
      documents: {
        title: 'Gestion documentaire',
        breadcrumbs: ['Ressources', 'Documents'],
        description: 'Conventions et documents administratifs'
      },
      'student-progress': {
        title: 'Progression des étudiants',
        breadcrumbs: ['Suivi & Analytics', 'Progression'],
        description: 'Suivi des performances individuelles'
      },
      'placement-stats': {
        title: 'Statistiques de placement',
        breadcrumbs: ['Suivi & Analytics', 'Placement'],
        description: 'Taux d\'insertion et débouchés'
      },
      analytics: {
        title: 'Analytics de l\'école',
        breadcrumbs: ['Suivi & Analytics', 'Analytics'],
        description: 'Tableaux de bord et métriques'
      },
      satisfaction: {
        title: 'Évaluations et satisfaction',
        breadcrumbs: ['Suivi & Analytics', 'Satisfaction'],
        description: 'Retours et évaluations formations'
      },
      partnerships: {
        title: 'Partenaires entreprises',
        breadcrumbs: ['Découverte', 'Partenaires'],
        description: 'Réseau d\'entreprises partenaires'
      },
      opportunities: {
        title: 'Opportunités pour étudiants',
        breadcrumbs: ['Découverte', 'Opportunités'],
        description: 'Stages et emplois disponibles'
      },
      'mentor-network': {
        title: 'Réseau de mentors',
        breadcrumbs: ['Découverte', 'Mentors'],
        description: 'Mentors disponibles pour les étudiants'
      },
      'team-management': {
        title: 'Gestion de l\'équipe',
        breadcrumbs: ['Profil & Paramètres', 'Équipe'],
        description: 'Administration de l\'équipe pédagogique'
      },
      settings: {
        title: 'Paramètres de l\'école',
        breadcrumbs: ['Profil & Paramètres', 'Paramètres'],
        description: 'Configuration générale du système'
      }
    };

    return configs[pageId] || configs.dashboard;
  };

  // Navigation vers une page spécifique
  const navigateToPage = (page) => {
    setActivePage(page);
  };

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
      const res = await axios.put(`${backendUrl}/api/school/profile`, profileForm, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSchoolProfile(res.data);
      setProfileForm(res.data);
      toast.success('Profil mis à jour');
    } catch (error) {
      console.error('Error saving school profile:', error);
      toast.error("Impossible d'enregistrer le profil.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCreatePartnership = async () => {
    if (!newPartnership.company_name.trim()) {
      toast.error('Le nom de l\'entreprise partenaire est obligatoire.');
      return;
    }
    try {
      setCreatingPartnership(true);
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
      const res = await axios.post(`${backendUrl}/api/school/partnerships`, newPartnership, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPartnerships([res.data, ...partnerships]);
      setNewPartnership({ company_name: '', sector: '', contact_email: '', partnership_type: 'stage', description: '' });
      toast.success(`${res.data.company_name} a été ajouté aux partenaires.`);
    } catch (error) {
      console.error('Error creating partnership:', error);
      toast.error('Impossible de créer le partenariat.');
    } finally {
      setCreatingPartnership(false);
    }
  };

  const handleUpdatePartnershipStatus = async (partnershipId, status) => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
      await axios.put(`${backendUrl}/api/school/partnerships/${partnershipId}`, { status }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPartnerships(partnerships.map(p => p.id === partnershipId ? { ...p, status } : p));
    } catch (error) {
      console.error('Error updating partnership:', error);
      toast.error('Impossible de mettre à jour le partenariat.');
    }
  };

  const handleSearchStudents = async () => {
    try {
      setSearchingStudents(true);
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
      const res = await axios.get(`${backendUrl}/api/school/students/available?q=${encodeURIComponent(studentSearch)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAvailableStudents(res.data);
    } catch (error) {
      console.error('Error searching students:', error);
      toast.error('Impossible de rechercher les étudiants.');
    } finally {
      setSearchingStudents(false);
    }
  };

  const handleAttachStudent = async (studentUserId) => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
      await axios.post(`${backendUrl}/api/school/students/${studentUserId}/attach`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAvailableStudents(availableStudents.filter(s => s.user_id !== studentUserId));
      toast.success('Étudiant rattaché à votre établissement.');
      const refresh = await axios.get(`${backendUrl}/api/school/students`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStudents(refresh.data);
    } catch (error) {
      console.error('Error attaching student:', error);
      toast.error(error.response?.data?.detail || 'Impossible de rattacher l\'étudiant.');
    }
  };

  const handleDetachStudent = async (studentUserId) => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
      await axios.post(`${backendUrl}/api/school/students/${studentUserId}/detach`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStudents(students.filter(s => s.user_id !== studentUserId));
      toast.success('Étudiant détaché de votre établissement.');
    } catch (error) {
      console.error('Error detaching student:', error);
      toast.error('Impossible de détacher l\'étudiant.');
    }
  };

  const handleGenerateInvitation = async () => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
      const res = await axios.post(`${backendUrl}/api/school/invitations`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setGeneratedInvitation(res.data);
      setInvitations([res.data, ...invitations]);
      toast.success(`Code d'invitation généré : ${res.data.code}`);
    } catch (error) {
      console.error('Error generating invitation:', error);
      toast.error('Impossible de générer le code d\'invitation.');
    }
  };

  const handleCancelInvitation = async (invitationId) => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
      await axios.delete(`${backendUrl}/api/school/invitations/${invitationId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setInvitations(invitations.map(i => i.id === invitationId ? { ...i, status: 'cancelled' } : i));
      toast.success('Invitation annulée.');
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      toast.error('Impossible d\'annuler l\'invitation.');
    }
  };

  // Rendu des cartes du dashboard avec design ÉMÉRÉS optimisé
  const renderDashboardCards = () => {
    const cards = [
      {
        id: 'students',
        title: 'Étudiants Actifs',
        description: 'Étudiants inscrits',
        icon: Users,
        gradient: 'from-teal-500 to-teal-600',
        stats: `${schoolStats.total_students} étudiants`,
        value: schoolStats.total_students.toString(),
        change: schoolStats.active_students > 0 ? `${schoolStats.active_students} actifs` : 'Aucun actif',
        action: () => navigateToPage('students-management'),
        urgent: schoolStats.total_students === 0
      },
      {
        id: 'partnerships',
        title: 'Partenariats',
        description: 'Entreprises partenaires',
        icon: Building,
        gradient: 'from-blue-500 to-blue-600',
        stats: `${schoolStats.partnerships_count} partenaires`,
        value: schoolStats.partnerships_count.toString(),
        change: schoolStats.partnerships_count > 0 ? 'Réseau actif' : 'À développer',
        action: () => navigateToPage('partnerships'),
        badge: schoolStats.partnerships_count > 5 ? 'Excellent' : null
      },
      {
        id: 'placement',
        title: 'Taux de Placement',
        description: 'Insertion professionnelle',
        icon: Target,
        gradient: 'from-green-500 to-green-600',
        stats: `${schoolStats.placement_rate}% de placement`,
        value: `${schoolStats.placement_rate}%`,
        change: schoolStats.placement_rate > 80 ? 'Excellent' : 'À améliorer',
        action: () => navigateToPage('placement-stats')
      },
      {
        id: 'satisfaction',
        title: 'Satisfaction',
        description: 'Évaluations formations',
        icon: Award,
        gradient: 'from-purple-500 to-purple-600',
        stats: `${schoolStats.average_satisfaction}/5 moyenne`,
        value: `${schoolStats.average_satisfaction}/5`,
        change: schoolStats.average_satisfaction > 4 ? 'Très bien' : 'Correct',
        action: () => navigateToPage('satisfaction')
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                hover:shadow-emeres-lg cursor-pointer
              `}
              onClick={card.action}
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
                      ${card.change.includes('Excellent') || card.change.includes('Très bien') ? 'text-green-600' :
                        card.change.includes('À') ? 'text-orange-600' : 'text-gray-600'}
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

  // Charger les données de l'école
  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const backendUrl = process.env.REACT_APP_BACKEND_URL || '';

        const [profileRes, statsRes, studentsRes, partnershipsRes, activityRes, invitationsRes] = await Promise.all([
          axios.get(`${backendUrl}/api/school/profile`, { headers }),
          axios.get(`${backendUrl}/api/school/stats`, { headers }),
          axios.get(`${backendUrl}/api/school/students`, { headers }),
          axios.get(`${backendUrl}/api/school/partnerships`, { headers }),
          axios.get(`${backendUrl}/api/school/activity`, { headers }),
          axios.get(`${backendUrl}/api/school/invitations`, { headers })
        ]);

        setSchoolProfile(profileRes.data);
        setProfileForm(profileRes.data);
        setSchoolStats(statsRes.data);
        setStudents(studentsRes.data);
        setPartnerships(partnershipsRes.data);
        setRecentActivity(activityRes.data);
        setInvitations(invitationsRes.data);
      } catch (error) {
        console.error('Error fetching school data:', error);
        // En cas d'erreur, garder les valeurs par défaut
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
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
                  <div className="text-xs text-gray-500 hidden sm:block">Dashboard École</div>
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
                icon={<GraduationCap />}
                className="text-xs lg:text-sm"
              >
                <span className="hidden lg:inline">Accueil</span>
              </EmeresButton>

              <EmeresButton
                variant={activePage === 'students-management' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigateToPage('students-management')}
                icon={<Users />}
                className="text-xs lg:text-sm"
              >
                <span className="hidden lg:inline">Étudiants</span>
              </EmeresButton>

              <EmeresButton
                variant={activePage === 'partnerships' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigateToPage('partnerships')}
                icon={<Building />}
                className="text-xs lg:text-sm"
              >
                <span className="hidden lg:inline">Partenaires</span>
              </EmeresButton>
            </div>

            {/* Actions droite - notifications et profil */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Barre de recherche - cachée sur mobile */}
              <div className="relative hidden xl:block">
                <EmeresInput
                  placeholder="Rechercher étudiant..."
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
                    2
                  </EmeresBadge>
                </EmeresButton>
              </div>

              {/* Menu profil utilisateur */}
              <div className="relative group">
                <button className="flex items-center space-x-2 p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-emeres-primary rounded-full flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                      {schoolProfile?.school_name || user?.first_name || 'École'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Compte École
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 hidden lg:block" />
                </button>

                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-emeres-lg border border-gray-100 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={() => navigateToPage('school-profile')}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Mon École
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
                    <div className="text-xs sm:text-sm font-medium text-gray-900">ÉMÉRÉS École</div>
                    <div className="text-xs text-gray-600 hidden sm:block">Plateforme éducative</div>
                  </div>
                </div>
                <EmeresButton
                  variant="primary"
                  size="sm"
                  fullWidth
                  className="text-xs"
                >
                  <span className="hidden sm:inline">Découvrir les outils</span>
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
                    {activePage === 'students-management' && (
                      <EmeresButton
                        variant="primary"
                        icon={<PlusCircle />}
                        size="sm"
                        onClick={() => {/* Action création */}}
                        className="sm:size-md"
                      >
                        <span className="hidden sm:inline">Nouvel étudiant</span>
                        <span className="sm:hidden">Nouveau</span>
                      </EmeresButton>
                    )}
                    {activePage === 'partnerships' && (
                      <EmeresButton
                        variant="primary"
                        icon={<Building />}
                        size="sm"
                        onClick={() => {/* Action création */}}
                        className="sm:size-md"
                      >
                        <span className="hidden sm:inline">Nouveau partenaire</span>
                        <span className="sm:hidden">Nouveau</span>
                      </EmeresButton>
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

                  {/* Cartes principales */}
                  {renderDashboardCards()}

                  {/* Contenu principal du dashboard */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

                    {/* Activité récente */}
                    <div className="xl:col-span-2">
                      <EmeresCard>
                        <EmeresCardHeader>
                          <EmeresCardTitle>Activité Récente</EmeresCardTitle>
                          <EmeresCardDescription>
                            Dernières actions dans votre école
                          </EmeresCardDescription>
                        </EmeresCardHeader>
                        <EmeresCardContent>
                          <div className="space-y-4">
                            {recentActivity.length === 0 && (
                              <p className="text-sm text-gray-500 text-center py-4">
                                Aucune activité pour le moment.
                              </p>
                            )}
                            {recentActivity.map((item, index) => {
                              const config = {
                                student: { icon: Users, className: 'bg-blue-50', iconClassName: 'text-blue-600' },
                                partnership: { icon: Building, className: 'bg-green-50', iconClassName: 'text-green-600' },
                                evaluation: { icon: Award, className: 'bg-purple-50', iconClassName: 'text-purple-600' }
                              }[item.type] || { icon: Clock, className: 'bg-gray-50', iconClassName: 'text-gray-600' };
                              const Icon = config.icon;
                              return (
                                <div key={index} className={`flex items-center gap-3 p-3 ${config.className} rounded-lg`}>
                                  <Icon className={`h-5 w-5 ${config.iconClassName}`} />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                                    {item.date && (
                                      <p className="text-xs text-gray-500">
                                        {new Date(item.date).toLocaleDateString('fr-FR')}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </EmeresCardContent>
                      </EmeresCard>
                    </div>

                    {/* Actions rapides */}
                    <div>
                      <EmeresCard>
                        <EmeresCardHeader>
                          <EmeresCardTitle>Actions Rapides</EmeresCardTitle>
                          <EmeresCardDescription>
                            Raccourcis vers les tâches courantes
                          </EmeresCardDescription>
                        </EmeresCardHeader>
                        <EmeresCardContent className="space-y-3">
                          <EmeresButton
                            variant="outline"
                            fullWidth
                            icon={<Users />}
                            onClick={() => navigateToPage('students-management')}
                          >
                            Gérer les étudiants
                          </EmeresButton>

                          <EmeresButton
                            variant="outline"
                            fullWidth
                            icon={<Building />}
                            onClick={() => navigateToPage('partnerships')}
                          >
                            Voir les partenaires
                          </EmeresButton>

                          <EmeresButton
                            variant="outline"
                            fullWidth
                            icon={<BarChart3 />}
                            onClick={() => navigateToPage('analytics')}
                          >
                            Analytics détaillés
                          </EmeresButton>

                          <EmeresButton
                            variant="outline"
                            fullWidth
                            icon={<FileText />}
                            onClick={() => navigateToPage('documents')}
                          >
                            Gérer les documents
                          </EmeresButton>
                        </EmeresCardContent>
                      </EmeresCard>
                    </div>
                  </div>
                </div>
              )}

              {/* Gestion des étudiants - données réelles */}
              {activePage === 'students-management' && (
                <div className="space-y-6">
                <EmeresCard>
                  <EmeresCardHeader>
                    <EmeresCardTitle>Étudiants de l'école</EmeresCardTitle>
                    <EmeresCardDescription>
                      {students.filter(s => s.attachment_status === 'attached').length} rattaché(s) ·{' '}
                      {students.filter(s => s.attachment_status === 'declared').length} ayant déclaré votre établissement
                    </EmeresCardDescription>
                  </EmeresCardHeader>
                  <EmeresCardContent>
                    {students.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">
                        Aucun étudiant. Recherchez ci-dessous les comptes étudiants indépendants
                        pour les rattacher, ou attendez que des étudiants déclarent votre
                        établissement dans leur profil.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-500 border-b border-gray-200">
                              <th className="py-2 pr-4 font-medium">Étudiant</th>
                              <th className="py-2 pr-4 font-medium">Formation</th>
                              <th className="py-2 pr-4 font-medium">Candidatures</th>
                              <th className="py-2 pr-4 font-medium">Acceptées</th>
                              <th className="py-2 pr-4 font-medium">Rattachement</th>
                              <th className="py-2 font-medium">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((student) => (
                              <tr key={student.id} className="border-b border-gray-100">
                                <td className="py-3 pr-4 font-medium text-gray-900">
                                  {student.first_name} {student.last_name}
                                </td>
                                <td className="py-3 pr-4 text-gray-600">
                                  {student.field_of_study || student.degree_preparing || '—'}
                                </td>
                                <td className="py-3 pr-4 text-gray-600">{student.applications_count}</td>
                                <td className="py-3 pr-4 text-gray-600">{student.accepted_count}</td>
                                <td className="py-3 pr-4">
                                  <EmeresBadge
                                    variant={student.attachment_status === 'attached' ? 'primary' : 'secondary'}
                                    size="sm"
                                  >
                                    {student.attachment_status === 'attached' ? 'Rattaché' : 'A rattaché'}
                                  </EmeresBadge>
                                </td>
                                <td className="py-3">
                                  {student.attachment_status === 'attached' ? (
                                    <EmeresButton
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDetachStudent(student.user_id)}
                                    >
                                      Détacher
                                    </EmeresButton>
                                  ) : (
                                    <EmeresButton
                                      variant="primary"
                                      size="sm"
                                      onClick={() => handleAttachStudent(student.user_id)}
                                    >
                                      Rattacher
                                    </EmeresButton>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </EmeresCardContent>
                </EmeresCard>

                <EmeresCard>
                  <EmeresCardHeader>
                    <EmeresCardTitle>Rechercher un compte étudiant indépendant</EmeresCardTitle>
                    <EmeresCardDescription>
                      Les étudiants ayant créé leur compte sans établissement peuvent être rattachés ici
                    </EmeresCardDescription>
                  </EmeresCardHeader>
                  <EmeresCardContent>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <EmeresInput
                        placeholder="Nom, email ou établissement..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                      />
                      <EmeresButton
                        variant="primary"
                        onClick={handleSearchStudents}
                        disabled={searchingStudents}
                      >
                        {searchingStudents ? 'Recherche...' : 'Rechercher'}
                      </EmeresButton>
                    </div>
                    {availableStudents.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {availableStudents.map((student) => (
                          <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {student.first_name} {student.last_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {student.institution_name || 'Sans établissement'}
                                {student.email ? ` · ${student.email}` : ''}
                              </p>
                            </div>
                            <EmeresButton
                              variant="primary"
                              size="sm"
                              onClick={() => handleAttachStudent(student.user_id)}
                            >
                              Rattacher
                            </EmeresButton>
                          </div>
                        ))}
                      </div>
                    )}
                    {studentSearch && !searchingStudents && availableStudents.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Aucun compte indépendant trouvé pour cette recherche.
                      </p>
                    )}
                  </EmeresCardContent>
                </EmeresCard>

                <EmeresCard>
                  <EmeresCardHeader>
                    <EmeresCardTitle>Invitations étudiants</EmeresCardTitle>
                    <EmeresCardDescription>
                      Générez un code que l'étudiant saisit dans son profil pour rejoindre votre établissement
                    </EmeresCardDescription>
                  </EmeresCardHeader>
                  <EmeresCardContent>
                    <EmeresButton variant="primary" onClick={handleGenerateInvitation}>
                      Générer un code d'invitation
                    </EmeresButton>
                    {generatedInvitation && (
                      <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Code à transmettre à l'étudiant (valable 7 jours) :</p>
                        <p className="text-2xl font-bold tracking-widest text-teal-800">{generatedInvitation.code}</p>
                      </div>
                    )}
                    {invitations.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {invitations.map((invitation) => (
                          <div key={invitation.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="min-w-0">
                              <p className="text-sm font-mono font-medium text-gray-900">{invitation.code}</p>
                              <p className="text-xs text-gray-500">
                                {invitation.expires_at ? `Expire le ${new Date(invitation.expires_at).toLocaleDateString('fr-FR')}` : ''}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <EmeresBadge
                                variant={invitation.status === 'pending' ? 'secondary' : invitation.status === 'accepted' ? 'success' : 'error'}
                                size="sm"
                              >
                                {invitation.status === 'pending' ? 'En attente' : invitation.status === 'accepted' ? 'Utilisée' : 'Annulée'}
                              </EmeresBadge>
                              {invitation.status === 'pending' && (
                                <EmeresButton
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelInvitation(invitation.id)}
                                >
                                  Annuler
                                </EmeresButton>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </EmeresCardContent>
                </EmeresCard>
                </div>
              )}
              {activePage === 'partnerships' && (
                <div className="space-y-6">
                  <EmeresCard>
                    <EmeresCardHeader>
                      <EmeresCardTitle>Nouveau partenariat</EmeresCardTitle>
                      <EmeresCardDescription>
                        Ajouter une entreprise partenaire de l'école
                      </EmeresCardDescription>
                    </EmeresCardHeader>
                    <EmeresCardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <EmeresInput
                          placeholder="Nom de l'entreprise *"
                          value={newPartnership.company_name}
                          onChange={(e) => setNewPartnership({ ...newPartnership, company_name: e.target.value })}
                        />
                        <EmeresInput
                          placeholder="Secteur"
                          value={newPartnership.sector}
                          onChange={(e) => setNewPartnership({ ...newPartnership, sector: e.target.value })}
                        />
                        <EmeresInput
                          placeholder="Email de contact"
                          value={newPartnership.contact_email}
                          onChange={(e) => setNewPartnership({ ...newPartnership, contact_email: e.target.value })}
                        />
                        <EmeresInput
                          placeholder="Type de partenariat (stage, alternance...)"
                          value={newPartnership.partnership_type}
                          onChange={(e) => setNewPartnership({ ...newPartnership, partnership_type: e.target.value })}
                        />
                      </div>
                      <EmeresButton
                        variant="primary"
                        className="mt-4"
                        onClick={handleCreatePartnership}
                        disabled={creatingPartnership}
                      >
                        {creatingPartnership ? 'Création...' : 'Créer le partenariat'}
                      </EmeresButton>
                    </EmeresCardContent>
                  </EmeresCard>

                  <EmeresCard>
                    <EmeresCardHeader>
                      <EmeresCardTitle>Entreprises partenaires</EmeresCardTitle>
                      <EmeresCardDescription>
                        {partnerships.length} partenariat(s) enregistré(s)
                      </EmeresCardDescription>
                    </EmeresCardHeader>
                    <EmeresCardContent>
                      {partnerships.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-8">
                          Aucun partenariat enregistré pour le moment.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {partnerships.map((partnership) => (
                            <div key={partnership.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900">{partnership.company_name}</p>
                                <p className="text-xs text-gray-500">
                                  {partnership.sector || 'Secteur non spécifié'} · {partnership.partnership_type}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <EmeresBadge
                                  variant={partnership.status === 'active' ? 'primary' : partnership.status === 'pending' ? 'secondary' : 'error'}
                                  size="sm"
                                >
                                  {partnership.status === 'active' ? 'Actif' : partnership.status === 'pending' ? 'En attente' : 'Terminé'}
                                </EmeresBadge>
                                {partnership.status !== 'active' && (
                                  <EmeresButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdatePartnershipStatus(partnership.id, 'active')}
                                  >
                                    Activer
                                  </EmeresButton>
                                )}
                                {partnership.status === 'active' && (
                                  <EmeresButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdatePartnershipStatus(partnership.id, 'ended')}
                                  >
                                    Clôturer
                                  </EmeresButton>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </EmeresCardContent>
                  </EmeresCard>
                </div>
              )}

              {/* Profil école - données réelles */}
              {activePage === 'school-profile' && profileForm && (
                <EmeresCard>
                  <EmeresCardHeader>
                    <EmeresCardTitle>Informations de l'école</EmeresCardTitle>
                    <EmeresCardDescription>
                      Ces informations servent à rattacher automatiquement vos étudiants
                    </EmeresCardDescription>
                  </EmeresCardHeader>
                  <EmeresCardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <EmeresInput
                        placeholder="Nom de l'école *"
                        value={profileForm.school_name || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, school_name: e.target.value })}
                      />
                      <EmeresInput
                        placeholder="Type d'établissement (Lycée, Université, CFA...)"
                        value={profileForm.institution_type || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, institution_type: e.target.value })}
                      />
                      <EmeresInput
                        placeholder="Adresse"
                        value={profileForm.address || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      />
                      <EmeresInput
                        placeholder="Ville"
                        value={profileForm.city || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      />
                      <EmeresInput
                        placeholder="Code postal"
                        value={profileForm.postal_code || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, postal_code: e.target.value })}
                      />
                      <EmeresInput
                        placeholder="Téléphone"
                        value={profileForm.phone || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      />
                      <EmeresInput
                        placeholder="Site web"
                        value={profileForm.website || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                      />
                    </div>
                    <EmeresButton
                      variant="primary"
                      className="mt-4"
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                    >
                      {savingProfile ? 'Enregistrement...' : 'Enregistrer'}
                    </EmeresButton>
                  </EmeresCardContent>
                </EmeresCard>
              )}

              {/* Pages réelles secondaires */}
              {activePage === 'student-progress' && <StudentProgressPage students={students} />}
              {activePage === 'placement-stats' && <PlacementStatsPage schoolStats={schoolStats} />}
              {activePage === 'analytics' && <AnalyticsPage />}
              {activePage === 'satisfaction' && <SatisfactionPage />}
              {activePage === 'opportunities' && <OpportunitiesPage />}
              {activePage === 'documents' && <DocumentsPage />}
              {activePage === 'communication' && <CommunicationPage />}
              {activePage === 'library' && <LibraryPage />}
              {activePage === 'mentor-network' && <MentorNetworkPage />}

              {/* Pages avec contenu placeholder */}
              {!['dashboard', 'students-management', 'partnerships', 'school-profile',
                'student-progress', 'placement-stats', 'analytics', 'satisfaction',
                'opportunities', 'documents', 'communication', 'library', 'mentor-network'
              ].includes(activePage) && (
                <EmeresCard>
                  <EmeresCardContent className="text-center py-12">
                    <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      {getPageConfig(activePage).title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {getPageConfig(activePage).description}
                    </p>
                    <div className="space-y-2">
                      <EmeresBadge variant="primary" size="lg">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Module en développement
                      </EmeresBadge>
                      <p className="text-xs text-gray-500">
                        Cette fonctionnalité sera bientôt disponible dans votre dashboard école.
                      </p>
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

export default SchoolDashboard;
