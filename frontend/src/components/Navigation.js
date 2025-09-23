import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  Users, 
  Building2, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Search,
  Settings,
  Moon,
  Sun,
  ChevronDown,
  Sparkles,
  Home,
  Info,
  Mail,
  Building,
  GraduationCap,
  BookOpen,
  BrainCircuit,
  FileText,
  HelpCircle,
  Video,
  Download,
  BookMarked,
  Heart,
  Globe,
  Target,
  Award,
  Briefcase,
  Crown,
  Star,
  Rocket,
  Gem,
  Coins,
  Zap,
  UserCircle,
  Handshake,
  BarChart3
} from 'lucide-react';
import EmeresButton from './ui/EmeresButton';
import EmeresBadge from './ui/EmeresBadge';

const Navigation = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [solutionsMenuOpen, setSolutionsMenuOpen] = useState(false);
  const [resourcesMenuOpen, setResourcesMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Fermer les menus au changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location]);

  // Gérer les clics en dehors des menus pour les fermer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-dropdown]')) {
        setProfileMenuOpen(false);
        setMobileMenuOpen(false);
        setSolutionsMenuOpen(false);
        setResourcesMenuOpen(false);
        setAboutMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', !darkMode ? 'dark' : 'light');
  };

  // Navigation items basés sur le rôle
  const getNavigationItems = () => {
    // Navigation pour utilisateurs NON connectés (visiteurs)
    if (!user) {
      return [
        { name: 'Accueil', href: '/', icon: Sparkles },
        { name: 'Tarifs', href: '/tarifs' },
        { name: 'Contact', href: '/contact' }
      ];
    }

    // Navigation pour utilisateurs CONNECTÉS (espace de travail)
    // Base commune : Ressources utiles même connecté
    const connectedBaseItems = [
      { name: 'Accueil', href: '/', icon: Sparkles },
      { name: 'Ressources', href: '/resources', icon: BookOpen } // Utile pour tous
    ];

    switch (user.role) {
      case 'student':
        return [
          ...connectedBaseItems,
          { name: 'Dashboard', href: '/student-dashboard', icon: User },
          { name: 'Offres', href: '/offers', icon: Briefcase },
          { name: 'Premium', href: '/premium', icon: Zap },
          { name: 'Mes Crédits', href: '/credits', icon: Coins },
          { name: 'Mon Profil', href: '/profile', icon: UserCircle }
        ];
        
      case 'company':
        return [
          ...connectedBaseItems,
          { name: 'Dashboard', href: '/company-dashboard', icon: Building2 },
          { name: 'Candidats', href: '/candidates', icon: Users },
          { name: 'Premium', href: '/premium', icon: Zap },
          { name: 'Mes Crédits', href: '/credits', icon: Coins },
          { name: 'Mon Entreprise', href: '/company-profile', icon: Building }
        ];
        
      case 'mentor':
        return [
          ...connectedBaseItems,
          { name: 'Dashboard', href: '/mentor-dashboard', icon: User },
          { name: 'Mes Étudiants', href: '/my-students', icon: GraduationCap },
          { name: 'Premium', href: '/premium', icon: Zap },
          { name: 'Mes Crédits', href: '/credits', icon: Coins },
          { name: 'Mon Profil', href: '/mentor-profile', icon: UserCircle }
        ];
        
      case 'school':
        return [
          ...connectedBaseItems,
          { name: 'Dashboard', href: '/school-dashboard', icon: Users },
          { name: 'Étudiants', href: '/students', icon: GraduationCap },
          { name: 'Premium', href: '/premium', icon: Zap },
          { name: 'Mes Crédits', href: '/credits', icon: Coins },
          { name: 'Partenariats', href: '/partnerships', icon: Handshake }
        ];
        
      case 'institution':
        return [
          ...connectedBaseItems,
          { name: 'Dashboard', href: '/institution-dashboard', icon: Building },
          { name: 'Statistiques', href: '/institution-stats', icon: BarChart3 },
          { name: 'Premium', href: '/premium', icon: Zap },
          { name: 'Mes Crédits', href: '/credits', icon: Coins },
          { name: 'Configuration', href: '/institution-config', icon: Settings }
        ];
        
      default:
        return connectedBaseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const roleLabels = {
    student: '�tudiant',
    company: 'Entreprise',
    school: '�cole',
    mentor: 'Mentor',
    institution: 'Institution'
  };

  const brandSubtitle = user ? (roleLabels[user.role] ?? user.role) : 'IA & Mentorat connect�';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/');
  };

  // About dropdown data
  const aboutData = [
    {
      name: 'Notre Équipe',
      href: '/a-propos/equipe',
      icon: Crown,
      description: 'Rencontrez les experts qui créent l\'avenir'
    },
    {
      name: 'Écosystème',
      href: '/a-propos/ecosysteme',
      icon: Rocket,
      description: 'Notre réseau de partenaires et acteurs'
    },
    {
      name: 'Mission & Vision',
      href: '/a-propos/mission',
      icon: Star,
      description: 'Nos valeurs et notre raison d\'être'
    },
    {
      name: 'Nos Récompenses',
      href: '/a-propos/recompenses',
      icon: Gem,
      description: 'Reconnaissances et certifications'
    },
    {
      name: 'Rejoignez-nous',
      href: '/a-propos/carrieres',
      icon: Sparkles,
      description: 'Opportunités de carrière chez ÉMÉRÉS'
    }
  ];

  // Resources dropdown data
  const resourcesData = [
    {
      name: 'Blog',
      href: '/ressources/blog',
      icon: FileText,
      description: 'Actualités, conseils et tendances du marché'
    },
    {
      name: 'FAQ',
      href: '/ressources/faq',
      icon: HelpCircle,
      description: 'Réponses aux questions fréquentes'
    },
    {
      name: 'Guides',
      href: '/ressources/guides',
      icon: BookMarked,
      description: 'Guides pratiques et méthodologies'
    },
    {
      name: 'Webinaires',
      href: '/ressources/webinaires',
      icon: Video,
      description: 'Sessions de formation en ligne'
    },
    {
      name: 'Téléchargements',
      href: '/ressources/telechargements',
      icon: Download,
      description: 'Templates, documents et outils'
    }
  ];

  // Solutions dropdown data
  const solutionsData = [
    {
      name: 'Étudiants',
      href: '/solutions/etudiants',
      icon: GraduationCap,
      description: 'Trouvez votre stage ou alternance idéale'
    },
    {
      name: 'Établissements',
      href: '/solutions/etablissements',
      icon: BookOpen,
      description: 'Connectez vos étudiants aux entreprises'
    },
    {
      name: 'Mentors',
      href: '/solutions/mentors',
      icon: BrainCircuit,
      description: 'Accompagnez la nouvelle génération'
    },
    {
      name: 'Institutions',
      href: '/solutions/institutions',
      icon: Building,
      description: 'Pilotez votre écosystème formation'
    },
    {
      name: 'Entreprises',
      href: '/solutions/entreprises',
      icon: Users,
      description: 'Recrutez vos futurs talents'
    }
  ];

  const AboutDropdown = () => (
    <div className="relative" data-dropdown>
      <button
        onClick={() => {
          setAboutMenuOpen(!aboutMenuOpen);
          setSolutionsMenuOpen(false);
          setResourcesMenuOpen(false);
        }}
        className={`nav-item-emeres ${aboutMenuOpen ? 'active' : ''} flex items-center gap-1`}
      >
        <Heart className="w-4 h-4" />
        À propos
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${aboutMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      {aboutMenuOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-emeres-lg border border-gray-100 py-3 z-50 animate-scale-in" data-dropdown>
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">À Propos d'ÉMÉRÉS</h3>
            <p className="text-xs text-gray-500">Découvrez notre histoire et nos valeurs</p>
          </div>
          
          <div className="py-2">
            {aboutData.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setAboutMenuOpen(false)}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-indigo-200 transition-colors duration-200">
                    <Icon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="border-t border-gray-100 px-4 py-3">
            <Link
              to="/a-propos"
              onClick={() => setAboutMenuOpen(false)}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              En savoir plus sur ÉMÉRÉS →
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  const ResourcesDropdown = () => (
    <div className="relative" data-dropdown>
      <button
        onClick={() => {
          setResourcesMenuOpen(!resourcesMenuOpen);
          setSolutionsMenuOpen(false);
          setAboutMenuOpen(false);
        }}
        className={`nav-item-emeres ${resourcesMenuOpen ? 'active' : ''} flex items-center gap-1`}
      >
        <BookMarked className="w-4 h-4" />
        Ressources
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${resourcesMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      {resourcesMenuOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-emeres-lg border border-gray-100 py-3 z-50 animate-scale-in" data-dropdown>
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Centre de Ressources</h3>
            <p className="text-xs text-gray-500">Guides, conseils et outils pour réussir</p>
          </div>
          
          <div className="py-2">
            {resourcesData.map((resource) => {
              const Icon = resource.icon;
              return (
                <Link
                  key={resource.name}
                  to={resource.href}
                  onClick={() => setResourcesMenuOpen(false)}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-red-200 transition-colors duration-200">
                    <Icon className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                      {resource.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {resource.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="border-t border-gray-100 px-4 py-3">
            <Link
              to="/ressources"
              onClick={() => setResourcesMenuOpen(false)}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium"
            >
              Voir toutes les ressources →
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  const SolutionsDropdown = () => (
    <div className="relative" data-dropdown>
      <button
        onClick={() => {
          setSolutionsMenuOpen(!solutionsMenuOpen);
          setResourcesMenuOpen(false);
          setAboutMenuOpen(false);
        }}
        className={`nav-item-emeres ${solutionsMenuOpen ? 'active' : ''} flex items-center gap-1`}
      >
        <Users className="w-4 h-4" />
        Solutions
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${solutionsMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      {solutionsMenuOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-emeres-lg border border-gray-100 py-3 z-50 animate-scale-in" data-dropdown>
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Nos Solutions</h3>
            <p className="text-xs text-gray-500">Découvrez comment ÉMÉRÉS peut vous accompagner</p>
          </div>
          
          <div className="py-2">
            {solutionsData.map((solution) => {
              const Icon = solution.icon;
              return (
                <Link
                  key={solution.name}
                  to={solution.href}
                  onClick={() => setSolutionsMenuOpen(false)}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center group-hover:from-teal-200 group-hover:to-cyan-200 transition-colors duration-200">
                    <Icon className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-teal-600 transition-colors duration-200">
                      {solution.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {solution.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="border-t border-gray-100 px-4 py-3">
            <Link
              to="/solutions"
              onClick={() => setSolutionsMenuOpen(false)}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium"
            >
              Voir toutes nos solutions →
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  const ProfileMenu = () => (
    <div className="relative" data-dropdown>
      <button
        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {user?.first_name} {user?.last_name}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {user?.role}
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {profileMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-emeres-lg border border-gray-100 py-2 z-50 animate-scale-in" data-dropdown>
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="text-sm font-medium text-gray-900">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
          
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <User className="w-4 h-4" />
            Mon Profil
          </Link>
          
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {darkMode ? 'Mode Clair' : 'Mode Sombre'}
          </button>
          
          <Link
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <Settings className="w-4 h-4" />
            Paramètres
          </Link>
          
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <nav className="navbar-emeres sticky top-0 z-40">
      <div className="container-emeres">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover-lift">
            <div className="relative">
              <img 
                src="/emeres-logo.png" 
                alt="ÉMÉRÉS" 
                className="h-10 w-10" 
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%2314B8A6"/><text x="50" y="60" text-anchor="middle" fill="white" font-size="40" font-family="Arial, sans-serif">É</text></svg>';
                }}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-emeres-accent rounded-full"></div>
            </div>
            <div>
              <span className="nav-brand-title">
                �M�R�S
              </span>
              <div className="nav-brand-subtitle">
                {brandSubtitle}
              </div>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Navigation avant les dropdowns - Accueil */}
            {navigationItems.slice(0, 1).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href && !solutionsMenuOpen && !resourcesMenuOpen && !aboutMenuOpen;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-item-emeres ${isActive ? 'active' : ''}`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.name}
                </Link>
              );
            })}
            
            {/* Solutions Dropdown */}
            <SolutionsDropdown />
            
            {/* Resources Dropdown */}
            <ResourcesDropdown />
            
            {/* About Dropdown */}
            <AboutDropdown />
            
            {/* Navigation après les dropdowns - incluant Tarifs */}
            {navigationItems.slice(1).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href && !solutionsMenuOpen && !resourcesMenuOpen && !aboutMenuOpen;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-item-emeres ${isActive ? 'active' : ''}`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Actions droite */}
          <div className="nav-actions-emeres">
            {/* Barre de recherche */}
            {user && (
              <div className="hidden lg:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="input-emeres w-64 pl-10 py-2"
                />
              </div>
            )}

            {/* Notifications */}
            {user && (
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <EmeresBadge
                    variant="error"
                    size="xs"
                    className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs leading-none"
                  >
                    {notifications}
                  </EmeresBadge>
                )}
              </button>
            )}

            {/* Profile ou Auth */}
            {user ? (
              <ProfileMenu />
            ) : (
              <div className="flex items-center gap-2">
                <EmeresButton
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Connexion
                </EmeresButton>
                <EmeresButton
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  S'inscrire
                </EmeresButton>
              </div>
            )}

            {/* Menu mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              aria-label="Menu mobile"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 transition-all duration-300 ease-in-out"
               style={{
                 animation: 'slideDown 0.3s ease-out'
               }}
          >
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#0f4c81] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.name}
                  </Link>
                );
              })}
              
              {!user && (
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                  <EmeresButton
                    variant="ghost"
                    fullWidth
                    onClick={() => navigate('/login')}
                  >
                    Connexion
                  </EmeresButton>
                  <EmeresButton
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/register')}
                  >
                    S'inscrire
                  </EmeresButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

