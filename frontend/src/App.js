import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

// Components
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import CompanyRegistration from "./components/CompanyRegistration";
import StudentDashboard from "./components/StudentDashboard";
import CompanyDashboard from "./components/CompanyDashboard";
import SchoolDashboard from "./components/SchoolDashboard";
import MentorDashboard from "./components/MentorDashboard";
import InstitutionDashboard from "./components/InstitutionDashboard";
import Navigation from "./components/Navigation";
import InstitutionRegistrationDemo from "./components/InstitutionRegistrationDemo";
import Homepage from "./components/Homepage";
import AboutPage from "./components/AboutPage";
import EmailConfirmation from "./components/EmailConfirmation";
import CalendarCallback from "./components/CalendarCallback";
import ContactPage from "./components/ContactPage";
import MaintenancePage from "./components/MaintenancePage";
import AuthMaintenancePage from "./components/AuthMaintenancePage";
import UnderDevelopmentPage from "./components/UnderDevelopmentPage";
import SolutionsOverview from "./components/solutions/SolutionsOverview";
import SolutionEtudiants from "./components/solutions/SolutionEtudiants";
import SolutionEntreprises from "./components/solutions/SolutionEntreprises";
import SolutionEtablissements from "./components/solutions/SolutionEtablissements";
import SolutionMentors from "./components/solutions/SolutionMentors";
import SolutionInstitutions from "./components/solutions/SolutionInstitutions";
import ResourcesOverview from "./components/resources/ResourcesOverview";
import BlogPage from "./components/resources/BlogPage";
import FAQPage from "./components/resources/FAQPage";
import GuidesPage from "./components/resources/GuidesPage";
import WebinairesPage from "./components/resources/WebinairesPage";
import TelechargementPage from "./components/resources/TelechargementPage";
import AboutOverview from "./components/about/AboutOverview";
import EquipePage from "./components/about/EquipePage";
import EcosystemePage from "./components/about/EcosystemePage";
import MissionPage from "./components/about/MissionPage";
import RecompensesPage from "./components/about/RecompensesPage";
import CarrieresPage from "./components/about/CarrieresPage";
import TarifsPage from "./components/TarifsPage";
import CreditsPage from "./components/CreditsPage";
import PremiumPage from "./components/PremiumPage";
import ResourcesPage from "./components/ResourcesPage";
import CreditsNotificationSystem from "./components/CreditsNotificationSystem";
import creditsService from "./services/creditsService";
import ProtectedResource from "./components/ProtectedResource";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Variables de contrôle des pages de maintenance
const MAINTENANCE_MODE = process.env.REACT_APP_MAINTENANCE_MODE === 'true';
const AUTH_MAINTENANCE = process.env.REACT_APP_AUTH_MAINTENANCE === 'true';
const MODULES_UNDER_DEV = process.env.REACT_APP_MODULES_UNDER_DEV === 'true';

// Auth context
const AuthContext = React.createContext();

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        // Vérifier si le token est valide avant de l'utiliser
        try {
          // Décoder le JWT pour vérifier l'expiration
          const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          // Si le token est expiré, nettoyer le storage
          if (tokenPayload.exp && tokenPayload.exp < currentTime) {
            console.log('Token expiré, nettoyage du storage');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setLoading(false);
            return;
          }
          
          // Token valide, continuer l'authentification
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Attribution automatique de points pour connexion quotidienne
          creditsService.onLogin();
        } catch (error) {
          console.error('Erreur lors de la vérification du token:', error);
          // Token malformé, nettoyer le storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Intercepteur axios pour gérer les tokens expirés
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expiré ou invalide
          console.log('Token invalide détecté, déconnexion automatique');
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      const { access_token, user: userData } = response.data;
      
      setToken(access_token);
      setUser(userData);
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      toast.success('Connexion réussie !');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Erreur de connexion';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API}/auth/register`, userData);
      const { access_token, user: newUser } = response.data;
      
      setToken(access_token);
      setUser(newUser);
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(newUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      toast.success('Inscription réussie !');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Erreur lors de l\'inscription';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Déconnexion réussie');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'student') {
    return <StudentDashboard />;
  } else if (user?.role === 'company') {
    return <CompanyDashboard user={user} />;
  } else if (user?.role === 'school') {
    return <SchoolDashboard />;
  } else if (user?.role === 'mentor') {
    return <MentorDashboard />;
  } else if (user?.role === 'institution') {
    return <InstitutionDashboard />;
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Tableau de bord en développement
          </h2>
          <p className="text-gray-600">
            Le tableau de bord pour votre rôle ({user?.role}) sera bientôt disponible.
          </p>
        </div>
      </div>
    );
  }
};

function App() {
  // Fonction pour gérer le succès d'inscription entreprise
  const handleCompanyRegistrationSuccess = (result) => {
    // Stocker le token et les infos utilisateur
    localStorage.setItem('token', result.access_token);
    localStorage.setItem('user', JSON.stringify(result.user));
    
    // Rediriger vers le dashboard
    window.location.href = '/dashboard';
  };

  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <AppContent handleCompanyRegistrationSuccess={handleCompanyRegistrationSuccess} />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

// Nouveau composant pour accéder au contexte Auth
const AppContent = ({ handleCompanyRegistrationSuccess }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Gestion des pages de maintenance
  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }
  
  // Gestion maintenance authentification
  if (AUTH_MAINTENANCE && ['/login', '/register', '/company/register'].includes(location.pathname)) {
    return <AuthMaintenancePage />;
  }
  
  // Pages qui ont leur propre navigation (dashboards)
  const pagesWithOwnNavigation = [
    '/dashboard', 
    '/student-dashboard', 
    '/company-dashboard', 
    '/school-dashboard',
    '/mentor-dashboard',
    '/institution-dashboard'
  ];
  
  // Pages publiques sans navigation
  const pagesWithoutNavigation = ['/login', '/register', '/company/register'];
  
  // Détection plus robuste des dashboards
  const isDashboardPage = pagesWithOwnNavigation.includes(location.pathname) || 
                         (user && location.pathname === '/' && ['company', 'student', 'school', 'mentor', 'institution'].includes(user.role)); // Homepage avec utilisateur connecté ayant un dashboard = dashboard
  
  // Pages publiques qui ont besoin de la navigation globale
  const shouldShowNavigation = !pagesWithoutNavigation.includes(location.pathname) && !isDashboardPage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {shouldShowNavigation && <Navigation user={user} onLogout={logout} />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirm-email" element={<EmailConfirmation />} />
        <Route path="/calendar/callback" element={<CalendarCallback />} />
        <Route path="/company/register" element={<CompanyRegistration onRegistrationSuccess={handleCompanyRegistrationSuccess} />} />
        <Route path="/institution-demo" element={<InstitutionRegistrationDemo />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route 
          path="/" 
          element={
            user ? (
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            ) : (
              <Homepage />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <CompanyDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/school-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['school']}>
              <SchoolDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mentor-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <MentorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/institution-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['institution']}>
              <InstitutionDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Routes pour les pages de maintenance */}
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/auth-maintenance" element={<AuthMaintenancePage />} />
        <Route path="/under-development" element={<UnderDevelopmentPage />} />
        
        {/* Routes pour les pages Solutions */}
        <Route path="/solutions" element={<SolutionsOverview />} />
        <Route path="/solutions/etudiants" element={<SolutionEtudiants />} />
        <Route path="/solutions/entreprises" element={<SolutionEntreprises />} />
        <Route path="/solutions/etablissements" element={<SolutionEtablissements />} />
        <Route path="/solutions/mentors" element={<SolutionMentors />} />
        <Route path="/solutions/institutions" element={<SolutionInstitutions />} />
        
        {/* Routes pour les pages Ressources */}
        <Route path="/ressources" element={<ResourcesOverview />} />
        <Route path="/ressources/blog" element={<BlogPage />} />
        <Route path="/ressources/faq" element={<FAQPage />} />
        <Route path="/ressources/guides" element={<GuidesPage />} />
        <Route path="/ressources/webinaires" element={<WebinairesPage />} />
        <Route path="/ressources/telechargements" element={<TelechargementPage />} />
        
        {/* Routes pour les pages À propos */}
        <Route path="/a-propos" element={<AboutOverview />} />
        <Route path="/a-propos/equipe" element={<EquipePage />} />
        <Route path="/a-propos/ecosysteme" element={<EcosystemePage />} />
        <Route path="/a-propos/mission" element={<MissionPage />} />
        <Route path="/a-propos/recompenses" element={<RecompensesPage />} />
        <Route path="/a-propos/carrieres" element={<CarrieresPage />} />
        
        {/* Route pour la page Tarifs */}
        <Route path="/tarifs" element={<TarifsPage />} />
        
        {/* Route pour la page Crédits */}
        <Route path="/credits" element={<ProtectedResource><CreditsPage /></ProtectedResource>} />
        
        {/* Route pour la page Premium */}
        <Route path="/premium" element={<ProtectedResource><PremiumPage /></ProtectedResource>} />
        
        {/* Route pour la page Ressources */}
        <Route path="/resources" element={<ProtectedResource><ResourcesPage /></ProtectedResource>} />
      </Routes>
      <Toaster />
      
      {/* Système de notifications crédits */}
      <CreditsNotificationSystem />
    </div>
  );
}

export default App;