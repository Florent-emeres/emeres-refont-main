import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '../App';
import EmeresButton from './ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from './ui/EmeresCard';
import EmeresBadge from './ui/EmeresBadge';
import EmeresInput from './ui/EmeresInput';
import EmeresBreadcrumb from './ui/EmeresBreadcrumb';
import OnboardingChecklist from './ui/OnboardingChecklist';
import {
  Search,
  MapPin,
  Clock,
  Building,
  Star,
  Send,
  User,
  BookOpen,
  Award,
  Target,
  Briefcase,
  Plus,
  Trash2,
  Brain,
  Sparkles,
  TrendingUp,
  BarChart3,
  Bell,
  Menu,
  Eye,
  Edit,
  Zap,
  Heart,
  Globe,
  ChevronDown,
  LogOut,
  Settings,
  Users,
  FileText,
  MessageSquare,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Database,
  UserCheck,
  Library,
  Coins,
  ChevronRight
} from 'lucide-react';
import AIMatchingResults from './AIMatchingResults';
import CVGenerator from './CVGenerator';
import EvolutionPortfolio from './portfolio-evolution/EvolutionPortfolio';
import StudentAssistant from './student/StudentAssistant';
import ProgressBadges from './ProgressBadges';
import CoverLetterGenerator from './CoverLetterGenerator';
import InterviewSimulator from './InterviewSimulator';
import EnhancedStudentProfile from './EnhancedStudentProfile';
import StrategyModule from './strategy-module/StrategyModule';
import MentorDiscovery from './student/MentorDiscovery';
import PostMentorshipAd from './student/PostMentorshipAd';
import MessagingHub from './messaging/MessagingHub';
import InternshipJournal from './InternshipJournal';
import NotificationCenter from './student/NotificationCenter';
import ResourcesLibrary from './ResourcesLibrary';
import CreditsPage from './CreditsPage';
import CreditsWidget from './CreditsWidget';
import creditsService from '../services/creditsService';
import CoachIAEtudes from './tools/CoachIAEtudes';
import FocusRoomsPro from './tools/FocusRoomsPro';
import CartesMemoires from './tools/CartesMemoires';
import CVEvaluator from './tools/CVEvaluator';
import EntretienIA from './tools/EntretienIA';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [mentorshipAds, setMentorshipAds] = useState([]);
  const [availableMentors, setAvailableMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    education_level: '',
    field_of_study: '',
    school_name: '',
    skills: [],
    interests: [],
    preferred_sectors: [],
    preferred_locations: [],
    experience_level: '',
    bio: '',
    linkedin_url: '',
    portfolio_url: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newSector, setNewSector] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const sectors = [
    'Technologie', 'Finance', 'Santé', 'Éducation', 'Marketing',
    'Design', 'Ingénierie', 'Juridique', 'Commerce', 'RH'
  ];

  const educationLevels = [
    'Bac+1', 'Bac+2', 'Bac+3', 'Bac+4', 'Bac+5', 'Doctorat'
  ];

  const experienceLevels = [
    'Débutant', 'Intermédiaire', 'Avancé'
  ];

  const skillSuggestionsByField = {
    'Technologie': [
      'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'HTML/CSS', 'Java', 'C++', 'Docker'
    ],
    'Finance': [
      'Excel avancé', 'Analyse financière', 'Modélisation financière', 'Bloomberg', 'VBA', 'Python', 'R', 'Comptabilité', 'Audit', 'Risk Management'
    ],
    'Marketing': [
      'Google Analytics', 'SEO/SEM', 'Social Media', 'Content Marketing', 'Adobe Creative Suite', 'Email Marketing', 'CRM', 'A/B Testing', 'Copywriting', 'Brand Management'
    ],
    'Design': [
      'Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Sketch', 'UI/UX Design', 'Prototyping', 'Typography', 'Color Theory', 'Wireframing', 'User Research'
    ],
    'Ingénierie': [
      'AutoCAD', 'SolidWorks', 'MATLAB', 'Python', 'Project Management', 'Quality Control', 'Lean Manufacturing', 'Six Sigma', 'CAD/CAM', 'Simulation'
    ],
    'RH': [
      'Recrutement', 'Gestion des talents', 'Formation', 'Paie', 'Droit du travail', 'SIRH', 'Communication', 'Négociation', 'Coaching', 'Analytics RH'
    ],
    'Commerce': [
      'Négociation', 'CRM', 'Prospection', 'Closing', 'Account Management', 'Sales Analytics', 'Lead Generation', 'Customer Success', 'E-commerce', 'B2B Sales'
    ],
    'Santé': [
      'Soins infirmiers', 'Anatomie', 'Pharmacologie', 'Premiers secours', 'Hygiène hospitalière', 'Dossier patient', 'Communication patient', 'Éthique médicale', 'Urgences', 'Prévention'
    ],
    'Éducation': [
      'Pédagogie', 'Gestion de classe', 'Évaluation', 'Différenciation', 'TICE', 'Psychologie de l\'enfant', 'Communication parents', 'Projet éducatif', 'Inclusion', 'Formation continue'
    ],
    'Juridique': [
      'Droit des contrats', 'Droit du travail', 'Recherche juridique', 'Rédaction juridique', 'Procédure civile', 'Compliance', 'Due diligence', 'Négociation', 'Contentieux', 'Veille juridique'
    ]
  };

  // Gérer la sidebar responsive intelligemment
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
    'mentors': false,
    'tools': false,
    'tracking': false,
    'resources': false,
    'profile-settings': false
  });

  // Toggle expansion d'une catégorie
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Configuration de la sidebar avec catégorisation logique ÉMÉRÉS
  const sidebarCategories = [
    {
      id: 'dashboard',
      label: 'Accueil',
      icon: User,
      description: "Vue d'ensemble",
      gradient: 'from-teal-500 to-teal-600',
      isStandalone: true
    },
    {
      id: 'offers',
      label: 'Offres',
      icon: Search,
      description: 'Trouver un stage ou une alternance',
      gradient: 'from-purple-500 to-pink-600',
      isStandalone: true
    },
    {
      id: 'applications',
      label: 'Candidatures',
      icon: Send,
      description: 'Suivi de mes candidatures',
      gradient: 'from-orange-500 to-red-500',
      badge: applications.length > 0 ? applications.length.toString() : null,
      isStandalone: true
    },
    {
      id: 'messaging',
      label: 'Messagerie',
      icon: MessageSquare,
      description: 'Mes conversations',
      gradient: 'from-emerald-500 to-green-600',
      badge: notificationCount > 0 ? notificationCount.toString() : null,
      isStandalone: true
    },
    {
      id: 'mentors',
      label: 'Mentors',
      icon: UserCheck,
      description: 'Trouver et gérer mon mentorat',
      gradient: 'from-amber-500 to-orange-600',
      items: [
        {
          id: 'discover-mentors',
          label: 'Découvrir Mentors',
          icon: UserCheck,
          description: 'Trouver un mentor'
        },
        {
          id: 'mentorship-ads',
          label: 'Mes Annonces',
          icon: MessageSquare,
          description: 'Annonces de mentorat'
        }
      ]
    },
    {
      id: 'tools',
      label: 'Outils IA',
      icon: Zap,
      description: 'Assistant et création',
      gradient: 'from-blue-500 to-purple-600',
      items: [
        {
          id: 'recommendations',
          label: 'IA Matching',
          icon: Brain,
          description: 'Recommandations IA',
          badge: 'IA'
        },
        {
          id: 'cv',
          label: 'CV Generator',
          icon: BookOpen,
          description: 'Création de CV',
          badge: 'IA'
        },
        {
          id: 'cover-letter',
          label: 'Lettre IA',
          icon: Sparkles,
          description: 'Génération lettres',
          badge: 'IA'
        },
        {
          id: 'interview',
          label: 'Entretien IA',
          icon: Target,
          description: 'Simulation entretiens',
          badge: 'IA'
        },
        {
          id: 'coach-ia',
          label: 'Coach IA Études',
          icon: Brain,
          description: 'Assistant IA personnel',
          badge: 'IA'
        },
        {
          id: 'focus-room',
          label: 'Focus Room',
          icon: Users,
          description: 'Salles de concentration',
          badge: 'Premium'
        }
      ]
    },
    {
      id: 'tracking',
      label: 'Mon Parcours',
      icon: TrendingUp,
      description: 'Progression et suivi',
      gradient: 'from-orange-500 to-red-500',
      items: [
        {
          id: 'progress',
          label: 'Progression',
          icon: TrendingUp,
          description: 'Badges & stats'
        },
        {
          id: 'strategy',
          label: 'Stratégie Carrière',
          icon: BarChart3,
          description: 'Conseil & Planification',
          badge: 'IA'
        },
        {
          id: 'journal',
          label: 'Journal',
          icon: FileText,
          description: 'Suivi de stage'
        },
        {
          id: 'credits',
          label: 'Mes Crédits',
          icon: Coins,
          description: 'Points et crédits'
        }
      ]
    },
    {
      id: 'resources',
      label: 'Ressources',
      icon: Library,
      description: 'Contenus et apprentissage',
      gradient: 'from-emerald-500 to-green-600',
      items: [
        {
          id: 'resources',
          label: 'Bibliothèque',
          icon: Library,
          description: 'Ressources éducatives'
        },
        {
          id: 'cartes-memoires',
          label: 'Cartes Mémoires',
          icon: BookOpen,
          description: 'Système de révision',
          badge: 'Premium'
        },
        {
          id: 'portfolio',
          label: 'Portfolio',
          icon: Award,
          description: 'Projets & réalisations'
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: Bell,
          description: 'Centre de notifications',
          badge: notificationCount > 0 ? notificationCount.toString() : null
        }
      ]
    },
    {
      id: 'profile-settings',
      label: 'Compte',
      icon: User,
      description: 'Profil et paramètres',
      gradient: 'from-gray-500 to-slate-600',
      items: [
        {
          id: 'profile',
          label: 'Mon Profil',
          icon: User,
          description: 'Informations personnelles'
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
        title: 'Tableau de bord étudiant',
        breadcrumbs: ['Dashboard'],
        description: 'Vue d\'ensemble de votre parcours et opportunités'
      },
      recommendations: {
        title: 'Recommandations IA',
        breadcrumbs: ['Recherche', 'IA Matching'],
        description: 'Offres personnalisées basées sur votre profil'
      },
      'discover-mentors': {
        title: 'Découvrir des Mentors',
        breadcrumbs: ['Mentorat', 'Découvrir Mentors'],
        description: 'Trouvez des mentors expérimentés dans vos domaines d\'intérêt'
      },
      'mentorship-ads': {
        title: 'Mes Annonces de Mentorat',
        breadcrumbs: ['Mentorat', 'Mes Annonces'],
        description: 'Créez et gérez vos annonces pour attirer des mentors'
      },
      messaging: {
        title: 'Messagerie Interne',
        breadcrumbs: ['Communication', 'Messagerie Sécurisée'],
        description: 'Communications sécurisées et contextualisées'
      },
      notifications: {
        title: 'Centre de Notifications',
        breadcrumbs: ['Système', 'Notifications'],
        description: 'Restez informé de toutes vos interactions'
      },
      offers: {
        title: 'Recherche d\'offres de stage',
        breadcrumbs: ['Recherche', 'Offres'],
        description: 'Explorez et postulez aux offres disponibles'
      },
      applications: {
        title: 'Mes candidatures',
        breadcrumbs: ['Suivi', 'Candidatures'],
        description: 'Suivez l\'état de vos candidatures'
      },
      'cover-letter': {
        title: 'Générateur de lettres IA',
        breadcrumbs: ['Outils IA', 'Lettre de motivation'],
        description: 'Créez des lettres personnalisées avec l\'IA'
      },
      interview: {
        title: 'Simulateur d\'entretien IA',
        breadcrumbs: ['Outils IA', 'Entretien'],
        description: 'Préparez vos entretiens avec l\'IA'
      },
      portfolio: {
        title: 'Portfolio Évolutif',
        breadcrumbs: ['Professionnel', 'Portfolio'],
        description: 'Présentez vos projets et réalisations'
      },
      cv: {
        title: 'Générateur de CV',
        breadcrumbs: ['Professionnel', 'CV'],
        description: 'Créez votre CV professionnel'
      },
      progress: {
        title: 'Progression et badges',
        breadcrumbs: ['Suivi', 'Progression'],
        description: 'Visualisez vos progrès et réalisations'
      },
      profile: {
        title: 'Mon profil étudiant',
        breadcrumbs: ['Paramètres', 'Profil'],
        description: 'Gérez vos informations personnelles'
      },
      resources: {
        title: 'Bibliothèque de Ressources',
        breadcrumbs: ['Apprentissage', 'Bibliothèque'],
        description: 'Développez vos compétences avec des ressources expertises'
      },
      credits: {
        title: 'Mes Crédits ÉMÉRÉS',
        breadcrumbs: ['Système', 'Crédits'],
        description: 'Gagnez des points et convertissez-les en crédits'
      },
      'coach-ia': {
        title: 'Coach IA Études',
        breadcrumbs: ['Outils', 'Coach IA Études'],
        description: 'Votre assistant IA pour l\'apprentissage et la productivité'
      },
      strategy: {
        title: 'Stratégie Carrière IA',
        breadcrumbs: ['Suivi & Analytics', 'Stratégie Carrière'],
        description: 'Planification et conseil personnalisé pour votre carrière'
      },
      'focus-room': {
        title: 'Focus Room',
        breadcrumbs: ['Outils', 'Focus Room'],
        description: 'Salles de concentration collaborative'
      },
      'cartes-memoires': {
        title: 'Cartes Mémoires Pro',
        breadcrumbs: ['Ressources', 'Cartes Mémoires'],
        description: 'Système de révision par cartes mémoire avec répétition espacée'
      },
      settings: {
        title: 'Paramètres',
        breadcrumbs: ['Profil & Paramètres', 'Paramètres'],
        description: 'Configuration de votre compte et préférences'
      }
    };

    return configs[pageId] || {
      title: 'Page',
      breadcrumbs: ['Dashboard'],
      description: 'Description non disponible'
    };
  };

  const loadNotificationCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/student/notifications/unread-count`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setNotificationCount(data.total_unread || 0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du compteur de notifications:', error);
    }
  };

  // Navigation vers une page spécifique
  const navigateToPage = (page) => {
    setActivePage(page);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [profileRes, offersRes, applicationsRes, statsRes, adsRes, mentorsRes] = await Promise.all([
        axios.get(`${API}/profile/student`),
        axios.get(`${API}/offers`),
        axios.get(`${API}/applications/my`),
        fetch(`${API}/student/dashboard/stats`, { headers }).then(res => res.ok ? res.json() : null),
        fetch(`${API}/student/mentorship-ads`, { headers }).then(res => res.ok ? res.json() : []),
        fetch(`${API}/student/discover-mentors`, { headers }).then(res => res.ok ? res.json() : [])
      ]);

      setProfile(profileRes.data);
      const profileData = {
        ...profileRes.data,
        email: profileRes.data.email || user?.email || ''
      };
      setProfileForm(profileData);
      setOffers(offersRes.data);
      setApplications(applicationsRes.data);

      // Set real data from backend
      if (statsRes) setDashboardStats(statsRes);
      setMentorshipAds(adsRes);
      setAvailableMentors(mentorsRes);

      // Load notification count
      loadNotificationCount();
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 404) {
        const initialProfile = {
          email: user?.email || '',
          first_name: user?.first_name || '',
          last_name: user?.last_name || ''
        };
        setProfile(initialProfile);
        setProfileForm(initialProfile);
      } else {
        toast.error('Erreur lors du chargement des données');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData = null) => {
    setProfileLoading(true);
    try {
      const dataToSend = updatedData || profileForm;
      const response = await axios.put(`${API}/profile/student`, dataToSend);
      setProfile(response.data);
      if (updatedData) {
        setProfileForm(prev => ({ ...prev, ...updatedData }));
      }
      toast.success('Profil mis à jour avec succès !');

      // Attribution automatique de points pour mise à jour profil
      await creditsService.onCvUpdated();

      // Vérifier si le profil est complet pour attribution bonus
      const completionFields = ['first_name', 'last_name', 'email', 'school', 'field', 'level'];
      const completedFields = completionFields.filter(field => response.data[field]);
      const completionPercentage = (completedFields.length / completionFields.length) * 100;

      if (completionPercentage >= 90) {
        await creditsService.onProfileCompleted(completionPercentage);
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setProfileLoading(false);
    }
  };

  const applyToOffer = async (offerId) => {
    try {
      await axios.post(`${API}/applications`, { offer_id: offerId });
      toast.success('Candidature envoyée avec succès !');

      // Attribution automatique de points pour candidature envoyée
      await creditsService.onApplicationSent(offerId, 'Entreprise inconnue');

      fetchData();
    } catch (error) {
      console.error('Error applying:', error);
      toast.error(error.response?.data?.detail || 'Erreur lors de la candidature');
    }
  };

  const addToArray = (field, value, setter) => {
    if (value.trim()) {
      setProfileForm(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()]
      }));
      setter('');
    }
  };

  const removeFromArray = (field, index) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === '' || selectedSector === 'tous' || offer.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const hasApplied = (offerId) => {
    return applications.some(app => app.offer_id === offerId);
  };

  // Rendu des cartes du dashboard avec design ÉMÉRÉS optimisé
  const renderDashboardCards = () => {
    // Calculer les vraies données dynamiquement
    const profileFields = [
      'first_name', 'last_name', 'phone', 'birth_date', 'school_name', 'field_of_study',
      'degree_preparing', 'main_skills', 'bio', 'search_objective', 'cover_letter'
    ];
    const filledProfileFields = profileFields.filter((f) => {
      const v = profile?.[f];
      return Array.isArray(v) ? v.length > 0 : v && v !== '';
    }).length;
    const profileCompletion = profile ?
      Math.min(100, Math.round(filledProfileFields / profileFields.length * 100)) : 15;

    const mentorshipAdsCount = mentorshipAds?.length || 0;
    const availableMentorsCount = availableMentors?.length || 0;

    // Calculer les stats depuis le portfolio réel
    const portfolioProjects = profile?.portfolio_projects?.length || 0;

    const cards = [
      {
        id: 'profile',
        title: 'Mon Profil',
        description: 'Complétez votre profil',
        icon: User,
        gradient: 'from-teal-500 to-teal-600',
        stats: profile?.first_name ? 'Profil créé' : 'À compléter',
        value: `${profileCompletion}%`,
        change: 'Complétion',
        action: () => navigateToPage('profile'),
        urgent: !profile?.first_name
      },
      {
        id: 'recommendations',
        title: 'IA Matching',
        description: 'Offres recommandées',
        icon: Brain,
        gradient: 'from-blue-500 to-blue-600',
        stats: 'Recommandations IA',
        value: offers.length.toString(),
        change: 'offres disponibles',
        action: () => navigateToPage('recommendations'),
        badge: 'IA'
      },
      {
        id: 'discover-mentors',
        title: 'Découvrir Mentors',
        description: 'Trouvez votre mentor idéal',
        icon: UserCheck,
        gradient: 'from-purple-500 to-purple-600',
        stats: 'Mentors disponibles',
        value: availableMentorsCount.toString(),
        change: availableMentorsCount > 0 ? 'Compatible avec votre profil' : 'Aucun mentor disponible',
        action: () => navigateToPage('discover-mentors'),
        badge: availableMentorsCount > 0 ? 'Disponible' : 'Bientôt',
        urgent: availableMentorsCount === 0
      },
      {
        id: 'mentorship-ads',
        title: 'Mes Annonces',
        description: 'Recherches de mentorat',
        icon: MessageSquare,
        gradient: 'from-indigo-500 to-indigo-600',
        stats: 'Annonces actives',
        value: mentorshipAdsCount.toString(),
        change: mentorshipAdsCount === 0 ? 'Créez votre première annonce' : `${mentorshipAdsCount} annonce${mentorshipAdsCount > 1 ? 's' : ''} active${mentorshipAdsCount > 1 ? 's' : ''}`,
        action: () => navigateToPage('mentorship-ads'),
        urgent: mentorshipAdsCount === 0
      },
      {
        id: 'applications',
        title: 'Candidatures',
        description: 'Suivi de vos candidatures',
        icon: Send,
        gradient: 'from-green-500 to-green-600',
        stats: `${applications.length} candidatures`,
        value: applications.length.toString(),
        change: applications.length === 0 ? 'Commencez à postuler' : 'En cours de traitement',
        action: () => navigateToPage('applications'),
        urgent: applications.length === 0,
        badge: applications.length > 0 ? 'Actif' : null
      },
      {
        id: 'offers',
        title: 'Offres Disponibles',
        description: 'Recherche de stages',
        icon: Search,
        gradient: 'from-orange-500 to-orange-600',
        stats: `${offers.length} offres disponibles`,
        value: offers.length.toString(),
        change: offers.length > 5 ? '+5 cette semaine' : 'Nouvelles offres',
        action: () => navigateToPage('offers')
      },
      {
        id: 'portfolio',
        title: 'Portfolio',
        description: 'Vos projets',
        icon: Award,
        gradient: 'from-cyan-500 to-cyan-600',
        stats: 'Portfolio évolutif',
        value: portfolioProjects.toString(),
        change: portfolioProjects > 0 ? `projet${portfolioProjects > 1 ? 's' : ''} ajouté${portfolioProjects > 1 ? 's' : ''}` : 'Ajoutez vos projets',
        action: () => navigateToPage('portfolio'),
        badge: portfolioProjects > 0 ? 'Actif' : null,
        urgent: portfolioProjects === 0
      },
      {
        id: 'cv',
        title: 'CV Generator',
        description: 'Création de CV',
        icon: BookOpen,
        gradient: 'from-indigo-500 to-indigo-600',
        stats: 'CV professionnel',
        value: profile?.cv_generated ? '1' : '0',
        change: profile?.cv_generated ? 'CV généré' : 'Créez votre CV',
        action: () => navigateToPage('cv'),
        urgent: !profile?.cv_generated
      },
      {
        id: 'cover-letter',
        title: 'Lettre IA',
        description: 'Génération automatique',
        icon: Sparkles,
        gradient: 'from-purple-500 to-purple-600',
        stats: 'Lettres générées',
        value: profile?.cover_letters_generated?.toString() || '0',
        change: profile?.cover_letters_generated > 0 ? 'Dernière: Récemment' : 'Générez votre première lettre',
        action: () => navigateToPage('cover-letter'),
        badge: 'IA'
      },
      {
        id: 'interview',
        title: 'Entretien IA',
        description: 'Simulation d\'entretiens',
        icon: Target,
        gradient: 'from-pink-500 to-pink-600',
        stats: 'Simulations faites',
        value: profile?.interview_simulations?.toString() || '0',
        change: profile?.interview_simulations > 0 ? `Score: ${profile?.last_interview_score || 'N/A'}%` : 'Commencez la simulation',
        action: () => navigateToPage('interview'),
        badge: 'IA',
        urgent: !profile?.interview_simulations
      },
      {
        id: 'progress',
        title: 'Ma Progression',
        description: 'Badges & statistiques',
        icon: TrendingUp,
        gradient: 'from-blue-500 to-emerald-600',
        stats: 'Progression générale',
        value: `${profileCompletion}%`,
        change: `${filledProfileFields}/${profileFields.length} champs de profil complétés`,
        action: () => navigateToPage('progress')
      },
      {
        id: 'journal',
        title: 'Journal de Bord',
        description: 'Suivi de stage structuré',
        icon: BookOpen,
        gradient: 'from-emerald-500 to-emerald-600',
        stats: 'Workflow complet',
        value: profile?.active_internships?.toString() || '0',
        change: profile?.active_internships > 0 ? 'Stage en cours' : 'Créez votre journal',
        action: () => navigateToPage('journal'),
        badge: profile?.active_internships > 0 ? 'Actif' : null,
        urgent: !profile?.active_internships
      },
      {
        id: 'strategy',
        title: 'Stratégie Carrière',
        description: 'Conseil personnalisé',
        icon: BarChart3,
        gradient: 'from-violet-500 to-violet-600',
        stats: 'Objectifs atteints',
        value: profile?.career_objectives_completed ? `${profile.career_objectives_completed}/${profile.career_objectives_total || 8}` : '0/8',
        change: profile?.career_objectives_completed > 0 ? 'Excellent progrès' : 'Définissez vos objectifs',
        action: () => navigateToPage('strategy'),
        badge: 'IA'
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;

          // Images de fond spécifiques par catégorie de carte
          const getCardBackgroundImage = (cardId) => {
            const imageMap = {
              'recommendations': 'https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // AI Network
              'discover-mentors': 'https://images.unsplash.com/photo-1606248896999-387b3a9f621c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // MacBook interface
              'cv': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Code interface
              'cover-letter': 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // AI visualization
              'interview': 'https://images.unsplash.com/photo-1659035260002-11d486d6e9f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Modern interface
              'strategy': 'https://images.pexels.com/photos/16053029/pexels-photo-16053029.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'  // Dashboard interface
            };
            return imageMap[cardId] || null;
          };

          const backgroundImage = getCardBackgroundImage(card.id);

          return (
            <EmeresCard
              key={card.id}
              variant="default"
              interactive={false}
              padding="none"
              className={`
                group transition-all duration-300 hover-lift
                ${card.urgent ? 'ring-2 ring-red-200 border-red-200' : ''}
                hover:shadow-emeres-lg overflow-hidden
              `}
            >
              <div className={`bg-gradient-to-r ${card.gradient} p-3 sm:p-4 text-white relative overflow-hidden`}>
                {/* Background image subtile pour certaines cartes */}
                {backgroundImage && (
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                    style={{ backgroundImage: `url('${backgroundImage}')` }}
                  />
                )}

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

                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </div>

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
                        card.change.includes('nouvelles') ? 'text-blue-600' : 'text-gray-600'}
                    `}>
                      {card.change}
                    </div>
                  </div>
                </div>

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
                    <span className="hidden sm:inline">Accéder</span>
                  </EmeresButton>
                </div>
              </div>
            </EmeresCard>
          );
        })}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header ÉMÉRÉS unique et complet */}
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
                  <div className="text-xs text-gray-500 hidden sm:block">Dashboard Étudiant</div>
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
                icon={<User />}
                className="text-xs lg:text-sm"
              >
                <span className="hidden lg:inline">Accueil</span>
              </EmeresButton>

              <EmeresButton
                variant={activePage === 'recommendations' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigateToPage('recommendations')}
                icon={<Brain />}
                className="text-xs lg:text-sm"
              >
                <span className="hidden lg:inline">IA Matching</span>
              </EmeresButton>

              <EmeresButton
                variant={activePage === 'offers' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigateToPage('offers')}
                icon={<Search />}
                className="text-xs lg:text-sm"
              >
                <span className="hidden lg:inline">Offres</span>
              </EmeresButton>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-3">
              <div className="relative hidden xl:block">
                <EmeresInput
                  placeholder="Rechercher..."
                  className="w-48 xl:w-64"
                  leftIcon={<Search className="h-4 w-4 text-gray-400" />}
                />
              </div>

              <div className="relative">
                <EmeresButton
                  variant="ghost"
                  size="sm"
                  icon={<Bell />}
                  className="relative p-1 sm:p-2"
                  onClick={() => navigateToPage('notifications')}
                >
                  {notificationCount > 0 && (
                    <EmeresBadge
                      variant="error"
                      size="xs"
                      className="absolute -top-1 -right-1 px-1 py-0.5 text-xs leading-none"
                    >
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </EmeresBadge>
                  )}
                </EmeresButton>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-2 p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-emeres-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                      {profile?.first_name || user?.first_name || 'Étudiant'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Compte Étudiant
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 hidden lg:block" />
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-emeres-lg border border-gray-100 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={() => navigateToPage('profile')}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Mon Profil
                  </button>
                  <button
                    onClick={() => navigateToPage('settings')}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
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
                      {!sidebarCollapsed && category.badge && (
                        <EmeresBadge
                          variant="error"
                          size="xs"
                          className="relative z-10 flex-shrink-0"
                        >
                          {category.badge}
                        </EmeresBadge>
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
              <div className="mt-4 p-2 bg-gradient-emeres-subtle rounded-lg border border-teal-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-gradient-emeres-primary rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-900">ÉMÉRÉS</div>
                  </div>
                </div>
                <EmeresButton
                  variant="primary"
                  size="sm"
                  fullWidth
                  className="text-xs py-1"
                >
                  Découvrir
                </EmeresButton>
              </div>
            )}
          </div>
        </aside>

        <main className={`
          transition-all duration-300 min-h-screen w-full relative
          ${sidebarCollapsed ? 'lg:ml-12' : 'lg:ml-56'}
        `}>
          {/* Background image subtile pour le dashboard principal */}
          {activePage === 'dashboard' && (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1541178735493-479c1a27ed24?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
              }}
            />
          )}

          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-none relative z-10">
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
                </div>
              </div>
            )}

            <div className="space-y-4 sm:space-y-6">
              {activePage === 'dashboard' && (
                <div>
                  <div className="mb-6 sm:mb-8 relative">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {getPageConfig('dashboard').title}
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg">
                      Bienvenue {user?.first_name} ! {getPageConfig('dashboard').description}
                    </p>
                  </div>

                  {/* Checklist premiers pas */}
                  <OnboardingChecklist
                    className="mb-6"
                    title="Premiers pas"
                    steps={[
                      {
                        label: 'Compléter mon profil',
                        description: 'Téléphone, compétences et objectifs de recherche',
                        done: !!(
                          profile &&
                          profile.phone &&
                          ((profile.main_skills && profile.main_skills.length > 0) ||
                            (profile.skills && profile.skills.length > 0))
                        ),
                        page: 'profile'
                      },
                      {
                        label: 'Postuler à ma première offre',
                        description: 'Parcourez les offres et candidatez en un clic',
                        done: applications.length > 0,
                        page: 'offers'
                      },
                      {
                        label: 'Trouver un mentor',
                        description: 'Découvrez les mentors disponibles dans votre domaine',
                        done: mentorshipAds.length > 0,
                        page: 'discover-mentors'
                      }
                    ]}
                    onNavigate={navigateToPage}
                  />

                  {/* Widget crédits intégré */}
                  <div className="mb-6">
                    <CreditsWidget size="normal" showActions={true} />
                  </div>

                  {renderDashboardCards()}
                </div>
              )}

              {activePage === 'recommendations' && (
                <div className="max-w-7xl">
                  <AIMatchingResults onApply={applyToOffer} />
                </div>
              )}

              {activePage === 'discover-mentors' && (
                <div className="max-w-7xl">
                  <MentorDiscovery />
                </div>
              )}

              {activePage === 'mentorship-ads' && (
                <div className="max-w-7xl">
                  <PostMentorshipAd />
                </div>
              )}

              {activePage === 'messaging' && (
                <div className="max-w-7xl">
                  <MessagingHub userRole={user?.role || "student"} />
                </div>
              )}

              {activePage === 'notifications' && (
                <div className="max-w-7xl">
                  <NotificationCenter />
                </div>
              )}

              {activePage === 'offers' && (
                <div className="max-w-7xl space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Search className="h-5 w-5" />
                        <span>Rechercher des stages</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <Input
                              placeholder="Rechercher par titre ou description..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="h-12"
                            />
                          </div>
                          <div className="w-full md:w-48">
                            <Select value={selectedSector} onValueChange={setSelectedSector}>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Secteur" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tous">Tous les secteurs</SelectItem>
                                {sectors.map(sector => (
                                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredOffers.map((offer) => (
                      <Card key={offer.id} className="card-hover transition-all duration-300">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl mb-2">{offer.title}</CardTitle>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Building className="h-4 w-4" />
                                  <span>Entreprise</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{offer.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{offer.duration}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary">{offer.sector}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-gray-700 line-clamp-3">{offer.description}</p>

                          {offer.skills_required && offer.skills_required.length > 0 && (
                            <div>
                              <h4 className="font-medium text-sm text-gray-800 mb-2">Compétences requises :</h4>
                              <div className="flex flex-wrap gap-1">
                                {offer.skills_required.slice(0, 3).map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {offer.skills_required.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{offer.skills_required.length - 3} autres
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-4">
                            <div className="flex items-center space-x-2">
                              <Badge variant={offer.level === 'beginner' ? 'secondary' :
                                            offer.level === 'intermediate' ? 'default' : 'destructive'}>
                                {offer.level === 'beginner' ? 'Débutant' :
                                 offer.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                              </Badge>
                              {offer.is_remote && (
                                <Badge variant="outline">Télétravail</Badge>
                              )}
                            </div>

                            <Button
                              onClick={() => applyToOffer(offer.id)}
                              disabled={hasApplied(offer.id)}
                              className={hasApplied(offer.id)
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                              }
                            >
                              {hasApplied(offer.id) ? 'Déjà candidaté' : 'Postuler'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredOffers.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                          Aucune offre trouvée
                        </h3>
                        <p className="text-gray-600">
                          Essayez de modifier vos critères de recherche
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activePage === 'applications' && (
                <div className="max-w-7xl">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Send className="h-5 w-5" />
                        <span>Mes candidatures ({applications.length})</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {applications.length === 0 ? (
                        <div className="text-center py-12">
                          <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-800 mb-2">
                            Aucune candidature envoyée
                          </h3>
                          <p className="text-gray-600">
                            Commencez à postuler aux offres qui vous intéressent !
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {applications.map((app) => (
                            <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h4 className="font-medium">Candidature #{app.id.slice(0, 8)}</h4>
                                <p className="text-sm text-gray-600">Envoyée le {new Date(app.created_at).toLocaleDateString('fr-FR')}</p>
                              </div>
                              <Badge variant={
                                app.status === 'pending' ? 'secondary' :
                                app.status === 'accepted' ? 'default' : 'destructive'
                              }>
                                {app.status === 'pending' ? 'En attente' :
                                 app.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activePage === 'cover-letter' && (
                <div className="max-w-7xl">
                  <CoverLetterGenerator profile={profile} user={user} />
                </div>
              )}

              {activePage === 'interview' && (
                <div className="max-w-7xl">
                  <InterviewSimulator profile={profile} user={user} />
                </div>
              )}

              {activePage === 'portfolio' && (
                <div className="max-w-7xl">
                  <EvolutionPortfolio
                    profile={profile}
                    updateProfile={async (updatedProfile) => {
                      await updateProfile();
                      setProfile(updatedProfile);
                    }}
                    skillSuggestionsByField={skillSuggestionsByField}
                  />
                </div>
              )}

              {activePage === 'cv' && (
                <div className="max-w-7xl">
                  <CVGenerator profile={profile} user={user} />
                </div>
              )}

              {activePage === 'progress' && (
                <div className="max-w-7xl">
                  <ProgressBadges
                    profile={profile}
                    applications={applications}
                    projects={profile?.portfolio_projects || []}
                  />
                </div>
              )}

              {activePage === 'profile' && (
                <div className="max-w-7xl">
                  <EnhancedStudentProfile profile={profile} updateProfile={updateProfile} user={user} />
                </div>
              )}

              {activePage === 'resources' && (
                <div className="max-w-7xl">
                  <ResourcesLibrary />
                </div>
              )}

              {activePage === 'credits' && (
                <div className="max-w-7xl">
                  <CreditsPage />
                </div>
              )}

              {activePage === 'journal' && (
                <div className="max-w-7xl">
                  <InternshipJournal />
                </div>
              )}

              {activePage === 'strategy' && (
                <div className="max-w-7xl">
                  <StrategyModule
                    user={user}
                    userProfile={profile}
                    userRole="student"
                  />
                </div>
              )}

              {activePage === 'focus-room' && (
                <div className="max-w-7xl">
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Focus Room</h2>
                    <p className="text-gray-600 mb-6">
                      Les salles de concentration collaborative sont disponibles avec Premium.
                    </p>
                    <EmeresButton
                      variant="primary"
                      onClick={() => window.location.href = '/premium'}
                    >
                      Découvrir Premium
                    </EmeresButton>
                  </div>
                </div>
              )}

              {activePage === 'coach-ia' && (
                <div className="max-w-7xl">
                  <CoachIAEtudes user={user} />
                </div>
              )}

              {activePage === 'focus-room' && (
                <div className="max-w-7xl">
                  <FocusRoomsPro user={user} />
                </div>
              )}

              {activePage === 'cartes-memoires' && (
                <div className="max-w-7xl">
                  <CartesMemoires user={user} />
                </div>
              )}

              {activePage === 'cv-evaluator' && (
                <div className="max-w-7xl">
                  <CVEvaluator user={user} />
                </div>
              )}

              {activePage === 'coaching-tools' && (
                <div className="max-w-7xl">
                  <CoachIAEtudes user={user} />
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
                            Notifications
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" defaultChecked />
                              <span className="text-sm text-gray-600">Notifications par email</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" defaultChecked />
                              <span className="text-sm text-gray-600">Notifications push</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confidentialité
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" defaultChecked />
                              <span className="text-sm text-gray-600">Profil visible par les mentors</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span className="text-sm text-gray-600">Profil visible par les entreprises</span>
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
      <StudentAssistant onNavigate={navigateToPage} />
    </div>
  );
};

export default StudentDashboard;
