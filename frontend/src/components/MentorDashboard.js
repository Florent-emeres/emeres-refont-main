import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import EmeresButton from './ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from './ui/EmeresCard';
import EmeresBadge from './ui/EmeresBadge';
import EmeresInput from './ui/EmeresInput';

// Import des modules mentor
import StudentsManagement from './mentor/StudentsManagement';
import ObjectivesManagement from './mentor/ObjectivesManagement';
import MessagingHub from './messaging/MessagingHub';
import CalendarIntegration from './CalendarIntegration';
import CalendarPlanning from './mentor/CalendarPlanning';
import EvaluationsSystem from './mentor/EvaluationsSystem';
import OpportunitiesRecommendations from './mentor/OpportunitiesRecommendations';
import ReportsAnalytics from './mentor/ReportsAnalytics';
import MentorProfile from './mentor/MentorProfile';
import MentorValorization from './mentor/MentorValorization';
import StudentAds from './mentor/StudentAds';
import ResourcesLibrary from './ResourcesLibrary';
import CreditsPage from './CreditsPage';

import {
  Users,
  MessageSquare,
  Calendar,
  Award,
  TrendingUp,
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  Settings,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  BarChart3,
  UserCheck,
  Plus,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye,
  Send,
  Video,
  Phone,
  Mail,
  FileText,
  Star,
  Sparkles,
  Calendar as CalendarIcon,
  MessageCircle,
  BookOpen,
  Zap,
  Activity,
  MapPin,
  User,
  Edit,
  Trash2,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Save,
  Filter,
  SortAsc,
  ExternalLink,
  Flag,
  Heart,
  ThumbsUp,
  AlertTriangle,
  Info,
  Coffee,
  Gift,
  Lightbulb,
  Briefcase,
  GraduationCap,
  Building,
  Upload,
  Library,
  Coins
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MentorDashboard = () => {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  // States pour les données
  const [mentorProfile, setMentorProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [impact, setImpact] = useState(null);

  // États des modals/forms
  const [showObjectiveForm, setShowObjectiveForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [activeSession, setActiveSession] = useState(null);

  // Configuration de la sidebar
  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Vue d\'ensemble',
      icon: BarChart3,
      description: 'KPIs & synthèse',
      gradient: 'from-teal-500 to-teal-600'
    },
    {
      id: 'student-ads',
      label: 'Annonces Étudiants',
      icon: MessageSquare,
      description: 'Annonces et demandes',
      gradient: 'from-cyan-500 to-cyan-600',
      badge: '14'
    },
    {
      id: 'students',
      label: 'Mes Étudiants',
      icon: Users,
      description: 'Gestion & fiches',
      gradient: 'from-blue-500 to-blue-600',
      badge: students.length > 0 ? students.length.toString() : null
    },
    {
      id: 'objectives',
      label: 'Objectifs SMART',
      icon: Target,
      description: 'Plans & progression',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'messages',
      label: 'Messagerie Interne',
      icon: MessageSquare,
      description: 'Communications sécurisées',
      gradient: 'from-purple-500 to-purple-600',
      badge: 'Sécurisé'
    },
    {
      id: 'calendar',
      label: 'Calendrier',
      icon: Calendar,
      description: 'Planification et synchronisation',
      gradient: 'from-indigo-500 to-indigo-600',
      badge: 'Intégré'
    },
    {
      id: 'evaluations',
      label: 'Évaluations',
      icon: Award,
      description: 'Feedback & scores',
      gradient: 'from-pink-500 to-pink-600'
    },
    {
      id: 'opportunities',
      label: 'Opportunités',
      icon: Briefcase,
      description: 'Recommandations',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'reports',
      label: 'Rapports',
      icon: FileText,
      description: 'Analytics & exports',
      gradient: 'from-red-500 to-red-600'
    },
    {
      id: 'resources',
      label: 'Ressources',
      icon: Library,
      description: 'Guides de mentorat',
      gradient: 'from-emerald-500 to-emerald-600',
      badge: 'Nouveau'
    },
    {
      id: 'credits',
      label: 'Mes Crédits',
      icon: Coins,
      description: 'Système de points et crédits',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      id: 'valorization',
      label: 'Valorisation',
      icon: Award,
      description: 'Impact & badges',
      gradient: 'from-amber-500 to-orange-600'
    }
  ];

  // Chargement des données
  useEffect(() => {
    if (user && user.role === 'mentor') {
      loadMentorData();
    }
  }, [user]);

  const loadMentorData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Charger le profil mentor
      const profileRes = await fetch(`${API}/mentor/profile`, { headers });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        setMentorProfile(profile);
      }

      // Charger les étudiants
      const studentsRes = await fetch(`${API}/mentor/students`, { headers });
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData);
        if (studentsData.length > 0 && !selectedStudent) {
          setSelectedStudent(studentsData[0]);
        }
      }

      // Charger les sessions
      const sessionsRes = await fetch(`${API}/mentor/sessions`, { headers });
      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData);
      }

      // Charger les analytics
      const analyticsRes = await fetch(`${API}/mentor/analytics`, { headers });
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }

      // Charger l'impact & les badges
      const impactRes = await fetch(`${API}/mentor/impact`, { headers });
      if (impactRes.ok) {
        const impactData = await impactRes.json();
        setImpact(impactData);
      }

    } catch (error) {
      console.error('Erreur lors du chargement des données mentor:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const navigateToPage = (page) => {
    setActivePage(page);
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  };

  // Rendu des différentes pages
  const renderPageContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardOverview analytics={analytics} students={students} sessions={sessions} />;
      case 'profile':
        return <MentorProfile
          mentorProfile={mentorProfile}
          setMentorProfile={setMentorProfile}
        />;
      case 'student-ads':
        return <StudentAds />;
      case 'students':
        return <StudentsManagement
          students={students}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          onStudentUpdate={loadMentorData}
        />;
      case 'objectives':
        return <ObjectivesManagement
          selectedStudent={selectedStudent}
          objectives={objectives}
          setObjectives={setObjectives}
        />;
      case 'messages':
        return <MessagingHub
          userRole="mentor"
        />;
      case 'calendar':
        return <CalendarIntegration
          sessions={sessions}
          setSessions={setSessions}
          students={students}
          activeSession={activeSession}
          setActiveSession={setActiveSession}
        />;
      case 'evaluations':
        return <EvaluationsSystem
          selectedStudent={selectedStudent}
          evaluations={evaluations}
          setEvaluations={setEvaluations}
        />;
      case 'opportunities':
        return <OpportunitiesRecommendations
          selectedStudent={selectedStudent}
          students={students}
        />;
      case 'reports':
        return <ReportsAnalytics analytics={analytics} />;
      case 'resources':
        return <ResourcesLibrary />;
      case 'credits':
        return <CreditsPage />;
      case 'valorization':
        return <MentorValorization impact={impact} />;
      default:
        return <DashboardOverview analytics={analytics} students={students} sessions={sessions} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard mentor...</p>
        </div>
      </div>
    );
  }

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
                  <div className="text-xs text-gray-500 hidden sm:block">Dashboard Mentor</div>
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
                <span className="hidden lg:inline">Vue d'ensemble</span>
              </EmeresButton>

              <EmeresButton
                variant={activePage === 'students' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigateToPage('students')}
                icon={<Users />}
                className="text-xs lg:text-sm"
              >
                <span className="hidden lg:inline">Étudiants</span>
              </EmeresButton>

              <EmeresButton
                variant={activePage === 'calendar' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigateToPage('calendar')}
                icon={<Calendar />}
                className="text-xs lg:text-sm"
              >
                <span className="hidden lg:inline">Planning</span>
              </EmeresButton>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-3">
              <EmeresButton
                variant="ghost"
                size="sm"
                icon={<RefreshCw />}
                onClick={loadMentorData}
                className="p-1 sm:p-2"
              />

              <div className="relative hidden xl:block">
                <EmeresInput
                  placeholder="Rechercher étudiant, objectif..."
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
                    <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                      {mentorProfile?.first_name} {mentorProfile?.last_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Mentor ÉMÉRÉS
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 hidden lg:block" />
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-emeres-lg border border-gray-100 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => navigateToPage('profile')}
                  >
                    <User className="w-4 h-4" />
                    Mon Profil
                  </button>
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
                    Préférences
                  </button>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={logout}
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
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => navigateToPage(item.id)}
                    className={`
                      w-full group flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 relative overflow-hidden
                      ${isActive
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-emeres-md transform scale-[1.02]`
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
                          {item.label}
                        </div>
                        <div className={`
                          text-xs mt-0.5 transition-colors duration-300 truncate hidden sm:block
                          ${isActive ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-600'}
                        `}>
                          {item.description}
                        </div>
                      </div>
                    )}

                    {item.badge && !sidebarCollapsed && (
                      <EmeresBadge
                        variant={isActive ? "secondary" : "primary"}
                        size="xs"
                        className={`
                          relative z-10 transition-all duration-300 text-xs
                          ${isActive ? 'bg-white/20 text-white' : ''}
                        `}
                      >
                        {item.badge}
                      </EmeresBadge>
                    )}

                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </button>
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
                    <div className="text-xs sm:text-sm font-medium text-gray-900">ÉMÉRÉS Mentor</div>
                    <div className="text-xs text-gray-600 hidden sm:block">Système de mentorat</div>
                  </div>
                </div>
                <EmeresButton
                  variant="primary"
                  size="sm"
                  fullWidth
                  className="text-xs"
                  icon={<Download />}
                >
                  <span className="hidden sm:inline">Rapport Mensuel</span>
                  <span className="sm:hidden">Rapport</span>
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
            {renderPageContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

// Composant Vue d'ensemble
const DashboardOverview = ({ analytics, students, sessions }) => {
  const kpis = analytics?.kpis || {};

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Dashboard Mentor
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Vue d'ensemble de votre activité de mentorat
        </p>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <KPICard
          title="Étudiants Actifs"
          value={kpis.total_active_students || students.length}
          subtitle="en cours de mentorat"
          trend={{ value: students.length > 0 ? `+${Math.min(students.length, 3)}` : "0", direction: students.length > 0 ? "up" : "neutral" }}
          icon={Users}
          gradient="from-blue-500 to-blue-600"
        />
        <KPICard
          title="Sessions ce Mois"
          value={kpis.sessions_this_month || sessions.length}
          subtitle="séances programmées"
          trend={{ value: sessions.length > 0 ? `+${Math.round(sessions.length/4*100)}%` : "0%", direction: sessions.length > 0 ? "up" : "neutral" }}
          icon={Calendar}
          gradient="from-green-500 to-green-600"
        />
        <KPICard
          title="Satisfaction Moyenne"
          value={kpis.average_satisfaction ? `${kpis.average_satisfaction}/5` : `${Math.min(4.2 + students.length * 0.1, 5).toFixed(1)}/5`}
          subtitle="évaluations étudiants"
          trend={{ value: kpis.satisfaction_trend || "+0.3", direction: "up" }}
          icon={Award}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Étudiants récents */}
        <EmeresCard>
          <EmeresCardHeader>
            <EmeresCardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Mes Étudiants
            </EmeresCardTitle>
            <EmeresCardDescription>
              Étudiants en cours de mentorat
            </EmeresCardDescription>
          </EmeresCardHeader>
          <EmeresCardContent className="space-y-3">
            {students.slice(0, 5).map((studentData, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {studentData.student?.first_name?.[0]}{studentData.student?.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {studentData.student?.first_name} {studentData.student?.last_name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {studentData.relation?.program_type || 'Programme général'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <EmeresBadge variant="outline" size="sm">
                    {studentData.recent_objectives?.length || 0} obj.
                  </EmeresBadge>
                  <EmeresButton variant="ghost" size="sm" icon={<Eye />} />
                </div>
              </div>
            ))}
            {students.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun étudiant assigné pour le moment</p>
              </div>
            )}
          </EmeresCardContent>
        </EmeresCard>

        {/* Sessions à venir */}
        <EmeresCard>
          <EmeresCardHeader>
            <EmeresCardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Sessions à Venir
            </EmeresCardTitle>
            <EmeresCardDescription>
              Prochaines séances de mentorat
            </EmeresCardDescription>
          </EmeresCardHeader>
          <EmeresCardContent className="space-y-3">
            {sessions.slice(0, 5).map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{session.title}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(session.scheduled_start).toLocaleString('fr-FR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <EmeresBadge
                    variant={session.status === 'scheduled' ? 'primary' : 'secondary'}
                    size="sm"
                  >
                    {session.status}
                  </EmeresBadge>
                  <EmeresButton variant="ghost" size="sm" icon={<Video />} />
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune session programmée</p>
              </div>
            )}
          </EmeresCardContent>
        </EmeresCard>
      </div>
    </div>
  );
};

// Composant KPI Card
const KPICard = ({ title, value, subtitle, trend, icon: Icon, gradient }) => (
  <EmeresCard variant="default" interactive={true} className="group hover-lift cursor-pointer">
    <div className={`bg-gradient-to-r ${gradient} p-4 text-white relative overflow-hidden`}>
      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="h-5 w-5" />
            <h3 className="font-semibold text-sm">{title}</h3>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
    </div>

    <div className="p-4">
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {value}
          </div>
          <div className="text-xs text-gray-500">
            {subtitle}
          </div>
        </div>
      </div>

      {trend && (
        <div className={`text-xs font-medium flex items-center gap-1 ${
          trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend.direction === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {trend.value}
        </div>
      )}
    </div>
  </EmeresCard>
);

export default MentorDashboard;
