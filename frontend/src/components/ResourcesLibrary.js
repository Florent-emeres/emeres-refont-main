import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { 
  BookOpen, 
  Play, 
  Download, 
  Star, 
  Clock, 
  Users, 
  Filter,
  Search,
  Eye,
  Award,
  TrendingUp,
  FileText,
  Video,
  Headphones,
  CheckSquare,
  Settings,
  Globe,
  Lightbulb,
  Target,
  Zap,
  Heart,
  BookMarked,
  RotateCcw,
  ChevronRight,
  User,
  Calendar,
  BarChart3
} from 'lucide-react';
import EmeresButton from './ui/EmeresButton';
import EmeresBadge from './ui/EmeresBadge';
import { useAuth } from '../App';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ResourcesLibrary = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [featuredResources, setFeaturedResources] = useState([]);
  const [collections, setCollections] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [myProgress, setMyProgress] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [activeTab, setActiveTab] = useState('discover');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    resource_type: '',
    difficulty_level: ''
  });

  const categories = [
    { id: 'career_development', label: 'Développement Carrière', icon: TrendingUp },
    { id: 'interview_preparation', label: 'Préparation Entretien', icon: Users },
    { id: 'cv_writing', label: 'Rédaction CV', icon: FileText },
    { id: 'networking', label: 'Réseautage', icon: Globe },
    { id: 'technical_skills', label: 'Compétences Techniques', icon: Settings },
    { id: 'soft_skills', label: 'Compétences Comportementales', icon: Heart },
    { id: 'entrepreneurship', label: 'Entrepreneuriat', icon: Lightbulb },
    { id: 'mentoring', label: 'Mentorat', icon: Target },
    { id: 'internship_guide', label: 'Guide Stage', icon: BookMarked },
    { id: 'job_search', label: 'Recherche Emploi', icon: Search },
    { id: 'personal_branding', label: 'Personal Branding', icon: Zap }
  ];

  const resourceTypes = [
    { id: 'guide', label: 'Guide', icon: BookOpen },
    { id: 'video', label: 'Vidéo', icon: Video },
    { id: 'course', label: 'Formation', icon: Award },
    { id: 'template', label: 'Modèle', icon: FileText },
    { id: 'tool', label: 'Outil', icon: Settings },
    { id: 'article', label: 'Article', icon: FileText },
    { id: 'webinar', label: 'Webinaire', icon: Video },
    { id: 'podcast', label: 'Podcast', icon: Headphones },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare }
  ];

  const difficultyLevels = [
    { id: 'beginner', label: 'Débutant', color: 'bg-green-100 text-green-800' },
    { id: 'intermediate', label: 'Intermédiaire', color: 'bg-blue-100 text-amber-800' },
    { id: 'advanced', label: 'Avancé', color: 'bg-orange-100 text-orange-800' },
    { id: 'expert', label: 'Expert', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadResources(),
        loadFeaturedResources(),
        loadCollections(),
        loadRecommendations(),
        loadMyProgress()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadResources = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.resource_type) params.append('resource_type', filters.resource_type);
      if (filters.difficulty_level) params.append('difficulty_level', filters.difficulty_level);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`${API}/resources?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setResources(data.resources || []);
      }
    } catch (error) {
      console.error('Error loading resources:', error);
    }
  };

  const loadFeaturedResources = async () => {
    try {
      const response = await fetch(`${API}/resources/featured`);
      if (response.ok) {
        const data = await response.json();
        setFeaturedResources(data.featured_resources || []);
      }
    } catch (error) {
      console.error('Error loading featured resources:', error);
    }
  };

  const loadCollections = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/resources/collections`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections || []);
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/resources/recommendations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const loadMyProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/resources/my-progress`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMyProgress(data);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleSearch = async () => {
    await loadResources();
  };

  const handleFilterChange = async (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Trigger search after filter change
    setTimeout(loadResources, 100);
  };

  const openResource = async (resource) => {
    try {
      const token = localStorage.getItem('token');
      
      // Track view and get detailed resource
      const response = await fetch(`${API}/resources/${resource.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedResource(data);
      }
    } catch (error) {
      console.error('Error opening resource:', error);
    }
  };

  const updateProgress = async (resourceId, progressPercentage) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/resources/${resourceId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          progress_percentage: progressPercentage,
          time_spent_minutes: 30 // Example time
        })
      });

      if (response.ok) {
        loadMyProgress(); // Refresh progress
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const rateResource = async (resourceId, rating, review = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/resources/${resourceId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, review })
      });

      if (response.ok) {
        setSelectedResource(prev => prev ? {
          ...prev,
          resource: { ...prev.resource, user_rating: rating }
        } : null);
      }
    } catch (error) {
      console.error('Error rating resource:', error);
    }
  };

  const getResourceIcon = (type) => {
    const iconMap = {
      guide: BookOpen,
      video: Video,
      course: Award,
      template: FileText,
      tool: Settings,
      article: FileText,
      webinar: Video,
      podcast: Headphones,
      checklist: CheckSquare
    };
    return iconMap[type] || BookOpen;
  };

  const getCategoryIcon = (category) => {
    const categoryMap = categories.find(c => c.id === category);
    return categoryMap?.icon || BookOpen;
  };

  const getDifficultyColor = (level) => {
    const levelMap = difficultyLevels.find(l => l.id === level);
    return levelMap?.color || 'bg-gray-100 text-gray-800';
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h${remainingMinutes}min` : `${hours}h`;
  };

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'student':
        return {
          title: 'Bibliothèque Étudiante',
          description: 'Ressources pour développer vos compétences et réussir votre carrière',
          welcomeMessage: 'Découvrez des ressources adaptées à votre parcours étudiant'
        };
      case 'mentor':
        return {
          title: 'Ressources Mentor',
          description: 'Outils et guides pour optimiser votre accompagnement',
          welcomeMessage: 'Perfectionnez vos techniques de mentorat'
        };
      case 'company':
        return {
          title: 'Centre de Ressources RH',
          description: 'Guides et outils pour optimiser vos processus RH',
          welcomeMessage: 'Améliorez vos pratiques de recrutement et management'
        };
      default:
        return {
          title: 'Bibliothèque de Ressources',
          description: 'Accédez à une vaste collection de ressources éducatives',
          welcomeMessage: 'Développez vos compétences avec nos ressources expertes'
        };
    }
  };

  const roleContent = getRoleSpecificContent();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RotateCcw className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2">Chargement de la bibliothèque...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{roleContent.title}</h2>
          <p className="text-gray-600">{roleContent.description}</p>
        </div>
      </div>

      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Lightbulb className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900">
                {roleContent.welcomeMessage}
              </h3>
              <p className="text-purple-700">
                {featuredResources.length} ressources mises en avant • {resources.length} ressources au total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'discover', label: 'Découvrir', icon: Search },
            { id: 'collections', label: 'Collections', icon: BookMarked },
            { id: 'progress', label: 'Mon Progrès', icon: BarChart3 }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'discover' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Recherche et Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher des ressources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <EmeresButton onClick={handleSearch}>
                    Rechercher
                  </EmeresButton>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Catégorie</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">Toutes les catégories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={filters.resource_type}
                      onChange={(e) => handleFilterChange('resource_type', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">Tous les types</option>
                      {resourceTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Niveau</label>
                    <select
                      value={filters.difficulty_level}
                      onChange={(e) => handleFilterChange('difficulty_level', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">Tous les niveaux</option>
                      {difficultyLevels.map(level => (
                        <option key={level.id} value={level.id}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Resources */}
          {featuredResources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-500" />
                  Ressources Mises en Avant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredResources.slice(0, 6).map((resource) => {
                    const ResourceIcon = getResourceIcon(resource.resource_type);
                    return (
                      <div
                        key={resource.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => openResource(resource)}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <ResourceIcon className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 line-clamp-2">
                              {resource.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {resource.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <EmeresBadge className={getDifficultyColor(resource.difficulty_level)}>
                              {difficultyLevels.find(l => l.id === resource.difficulty_level)?.label}
                            </EmeresBadge>
                            {resource.duration_minutes && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                {formatDuration(resource.duration_minutes)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-blue-400 fill-current" />
                            <span className="text-sm text-gray-600">
                              {resource.rating_average?.toFixed(1) || '0.0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Recommandé pour vous
                </CardTitle>
                <CardDescription>
                  Basé sur votre profil et votre activité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.slice(0, 4).map((resource) => {
                    const ResourceIcon = getResourceIcon(resource.resource_type);
                    return (
                      <div
                        key={resource.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => openResource(resource)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <ResourceIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {resource.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {resource.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {resource.view_count}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {resource.rating_average?.toFixed(1)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Toutes les Ressources</CardTitle>
              <CardDescription>
                {resources.length} ressource{resources.length > 1 ? 's' : ''} trouvée{resources.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.map((resource) => {
                  const ResourceIcon = getResourceIcon(resource.resource_type);
                  const CategoryIcon = getCategoryIcon(resource.category);
                  
                  return (
                    <div
                      key={resource.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => openResource(resource)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <ResourceIcon className="h-4 w-4 text-gray-600" />
                          </div>
                          <EmeresBadge variant="outline" className="text-xs">
                            {resourceTypes.find(t => t.id === resource.resource_type)?.label}
                          </EmeresBadge>
                        </div>
                        <CategoryIcon className="h-4 w-4 text-gray-400" />
                      </div>

                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {resource.title}
                      </h4>
                      
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                        {resource.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <EmeresBadge className={getDifficultyColor(resource.difficulty_level)}>
                          {difficultyLevels.find(l => l.id === resource.difficulty_level)?.label}
                        </EmeresBadge>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          {resource.duration_minutes && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(resource.duration_minutes)}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {resource.rating_average?.toFixed(1) || '0.0'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {resource.view_count}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'collections' && (
        <div className="space-y-6">
          {collections.map((collection) => (
            <Card key={collection.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookMarked className="h-5 w-5" />
                  {collection.title}
                </CardTitle>
                <CardDescription>
                  {collection.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collection.resources?.slice(0, 6).map((resource) => {
                    const ResourceIcon = getResourceIcon(resource.resource_type);
                    return (
                      <div
                        key={resource.id}
                        className="p-3 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                        onClick={() => openResource(resource)}
                      >
                        <div className="flex items-center gap-3">
                          <ResourceIcon className="h-4 w-4 text-gray-600" />
                          <div>
                            <h5 className="font-medium text-gray-900 text-sm line-clamp-1">
                              {resource.title}
                            </h5>
                            <p className="text-xs text-gray-600">
                              {formatDuration(resource.duration_minutes)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {collection.resources?.length > 6 && (
                  <div className="mt-4 text-center">
                    <EmeresButton variant="outline" size="sm">
                      Voir les {collection.resources.length - 6} autres
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </EmeresButton>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'progress' && myProgress && (
        <div className="space-y-6">
          {/* Progress Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Mes Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {myProgress.stats?.total_resources || 0}
                  </div>
                  <div className="text-sm text-gray-600">Ressources vues</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {myProgress.stats?.completed_resources || 0}
                  </div>
                  <div className="text-sm text-gray-600">Terminées</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {myProgress.stats?.in_progress_resources || 0}
                  </div>
                  <div className="text-sm text-gray-600">En cours</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {myProgress.stats?.average_progress || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Progression moyenne</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Records */}
          <Card>
            <CardHeader>
              <CardTitle>Mon Progrès Détaillé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myProgress.progress_records?.map((progress) => {
                  const resource = progress.resource;
                  if (!resource) return null;
                  
                  const ResourceIcon = getResourceIcon(resource.resource_type);
                  
                  return (
                    <div key={progress.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <ResourceIcon className="h-5 w-5 text-gray-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {resource.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {categories.find(c => c.id === resource.category)?.label}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {progress.progress_percentage}%
                          </div>
                          {progress.completed_at && (
                            <EmeresBadge variant="success" className="text-xs">
                              Terminé
                            </EmeresBadge>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress.progress_percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div>
                          Commencé le {new Date(progress.started_at).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center gap-4">
                          {progress.time_spent_minutes > 0 && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(progress.time_spent_minutes)}
                            </div>
                          )}
                          {!progress.completed_at && (
                            <EmeresButton
                              size="sm"
                              onClick={() => updateProgress(resource.id, Math.min(100, progress.progress_percentage + 25))}
                            >
                              Continuer
                            </EmeresButton>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    {React.createElement(getResourceIcon(selectedResource.resource.resource_type), {
                      className: "h-6 w-6 text-purple-600"
                    })}
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {selectedResource.resource.title}
                    </CardTitle>
                    <CardDescription>
                      Par {selectedResource.resource.author}
                    </CardDescription>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                {/* Resource Info */}
                <div className="flex items-center gap-4 flex-wrap">
                  <EmeresBadge className={getDifficultyColor(selectedResource.resource.difficulty_level)}>
                    {difficultyLevels.find(l => l.id === selectedResource.resource.difficulty_level)?.label}
                  </EmeresBadge>
                  
                  <EmeresBadge variant="outline">
                    {resourceTypes.find(t => t.id === selectedResource.resource.resource_type)?.label}
                  </EmeresBadge>
                  
                  {selectedResource.resource.duration_minutes && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {formatDuration(selectedResource.resource.duration_minutes)}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-blue-400 fill-current" />
                    {selectedResource.resource.rating_average?.toFixed(1)} ({selectedResource.resource.rating_count} avis)
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Eye className="h-4 w-4" />
                    {selectedResource.resource.view_count} vues
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedResource.resource.description}</p>
                </div>

                {/* Learning Outcomes */}
                {selectedResource.resource.learning_outcomes?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Objectifs d'apprentissage</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {selectedResource.resource.learning_outcomes.map((outcome, index) => (
                        <li key={index}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* User Progress */}
                {selectedResource.user_progress && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Votre progression</h3>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-blue-800">Progression</span>
                        <span className="font-bold text-blue-900">
                          {selectedResource.user_progress.progress_percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${selectedResource.user_progress.progress_percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex gap-3">
                        <EmeresButton
                          size="sm"
                          onClick={() => {
                            updateProgress(selectedResource.resource.id, 25);
                            setSelectedResource(prev => ({
                              ...prev,
                              user_progress: {
                                ...prev.user_progress,
                                progress_percentage: Math.min(100, prev.user_progress.progress_percentage + 25)
                              }
                            }));
                          }}
                        >
                          +25%
                        </EmeresButton>
                        <EmeresButton
                          size="sm"
                          onClick={() => {
                            updateProgress(selectedResource.resource.id, 100);
                            setSelectedResource(prev => ({
                              ...prev,
                              user_progress: {
                                ...prev.user_progress,
                                progress_percentage: 100,
                                completed_at: new Date().toISOString()
                              }
                            }));
                          }}
                        >
                          Marquer comme terminé
                        </EmeresButton>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rating */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Évaluer cette ressource</h3>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => rateResource(selectedResource.resource.id, rating)}
                        className="text-2xl hover:scale-110 transition-transform"
                      >
                        <Star 
                          className={`h-6 w-6 ${
                            rating <= (selectedResource.user_progress?.rating || 0)
                              ? 'text-blue-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <EmeresButton className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Commencer
                  </EmeresButton>
                  
                  {selectedResource.resource.content_url && (
                    <EmeresButton variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </EmeresButton>
                  )}
                  
                  <EmeresButton variant="outline">
                    <Heart className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </EmeresButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResourcesLibrary;