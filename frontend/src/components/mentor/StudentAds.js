import React, { useState, useEffect } from 'react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import EmeresInput from '../ui/EmeresInput';
import { 
  Search,
  Filter,
  Star,
  Clock,
  Send,
  GraduationCap,
  Target,
  MessageSquare,
  User,
  Calendar,
  MapPin,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Award,
  BookOpen,
  Users,
  Heart,
  Eye,
  Mail,
  Phone,
  Video,
  Lightbulb,
  Briefcase,
  Building
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const StudentAds = () => {
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    domain: 'all',
    urgency: 'all',
    type: 'all',
    matchingScore: 0
  });
  const [mentorSpecializations, setMentorSpecializations] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [myResponses, setMyResponses] = useState([]);

  useEffect(() => {
    loadStudentAds();
    loadMyResponses();
  }, []);

  useEffect(() => {
    filterAds();
  }, [ads, searchTerm, selectedFilters]);

  const loadStudentAds = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/mentorship-ads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAds(data.ads || []);
        setMentorSpecializations(data.mentor_specializations || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyResponses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/ad-responses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const responses = await response.json();
        setMyResponses(responses || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réponses:', error);
    }
  };

  const filterAds = () => {
    let filtered = [...ads];

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(ad => 
        ad.title.toLowerCase().includes(term) ||
        ad.description.toLowerCase().includes(term) ||
        ad.field_of_study.toLowerCase().includes(term) ||
        (ad.student_name && ad.student_name.toLowerCase().includes(term)) ||
        ad.desired_expertise.some(exp => exp.toLowerCase().includes(term))
      );
    }

    // Filter by domain
    if (selectedFilters.domain !== 'all') {
      filtered = filtered.filter(ad => 
        ad.field_of_study.toLowerCase().includes(selectedFilters.domain.toLowerCase()) ||
        ad.desired_expertise.some(exp => exp.toLowerCase().includes(selectedFilters.domain.toLowerCase()))
      );
    }

    // Filter by urgency
    if (selectedFilters.urgency !== 'all') {
      filtered = filtered.filter(ad => ad.urgency_level === selectedFilters.urgency);
    }

    // Filter by type
    if (selectedFilters.type !== 'all') {
      filtered = filtered.filter(ad => ad.mentorship_type === selectedFilters.type);
    }

    // Filter by matching score
    filtered = filtered.filter(ad => 
      (ad.matching_score || 0) >= selectedFilters.matchingScore
    );

    setFilteredAds(filtered);
  };

  const handleRespondToAd = (ad) => {
    setSelectedAd(ad);
    setResponseMessage(`Bonjour ${ad.student_name || 'Étudiant'},

J'ai lu votre annonce "${ad.title}" avec beaucoup d'intérêt. 

Avec mon expérience dans les domaines de ${mentorSpecializations.slice(0, 2).join(' et ')}, je pense pouvoir vous apporter l'accompagnement que vous recherchez pour ${ad.mentorship_goals.slice(0, 2).join(' et ')}.

Votre projet en ${ad.field_of_study} correspond parfaitement à mon expertise, et je serais ravi de vous accompagner pendant ${ad.duration_expected || 'la durée souhaitée'}.

Êtes-vous disponible pour une première discussion afin de mieux comprendre vos besoins et voir comment je peux vous aider ?

Cordialement`);
    setShowResponseModal(true);
  };

  const submitResponse = async () => {
    if (!selectedAd) return;

    setSubmittingResponse(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/mentorship-ads/${selectedAd.id}/respond`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: responseMessage
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Réponse envoyée avec succès !');
        setShowResponseModal(false);
        setSelectedAd(null);
        setResponseMessage('');
        
        // Reload ads and responses
        loadStudentAds();
        loadMyResponses();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.detail}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      alert('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setSubmittingResponse(false);
    }
  };

  const getMatchingScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getMatchingScoreIcon = (score) => {
    if (score >= 80) return <Star className="h-4 w-4" />;
    if (score >= 60) return <TrendingUp className="h-4 w-4" />;
    if (score >= 40) return <Zap className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'urgent': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getUrgencyIcon = (level) => {
    switch (level) {
      case 'urgent': return <AlertCircle className="h-4 w-4" />;
      case 'high': return <TrendingUp className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getUrgencyLabel = (level) => {
    switch (level) {
      case 'urgent': return 'URGENT';
      case 'high': return 'Prioritaire';
      case 'medium': return 'Normal';
      case 'low': return 'Pas pressé';
      default: return 'Normal';
    }
  };

  const getResponseStatus = (adId) => {
    const response = myResponses.find(resp => resp.ad_id === adId);
    return response?.status || null;
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending':
        return <EmeresBadge variant="warning" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          En attente
        </EmeresBadge>;
      case 'accepted':
        return <EmeresBadge variant="success" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Acceptée
        </EmeresBadge>;
      case 'rejected':
        return <EmeresBadge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Refusée
        </EmeresBadge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des annonces d'étudiants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Annonces d'Étudiants
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Découvrez les étudiants qui recherchent activement un mentor
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MessageSquare className="h-4 w-4" />
          <span>{filteredAds.length} annonce{filteredAds.length > 1 ? 's' : ''} disponible{filteredAds.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Mentor Specializations */}
      {mentorSpecializations.length > 0 && (
        <EmeresCard>
          <EmeresCardHeader>
            <EmeresCardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Vos Spécialisations
            </EmeresCardTitle>
            <EmeresCardDescription>
              Les annonces sont triées par compatibilité avec votre expertise
            </EmeresCardDescription>
          </EmeresCardHeader>
          <EmeresCardContent>
            <div className="flex flex-wrap gap-2">
              {mentorSpecializations.map((spec, index) => (
                <EmeresBadge key={index} variant="primary">
                  {spec}
                </EmeresBadge>
              ))}
            </div>
          </EmeresCardContent>
        </EmeresCard>
      )}

      {/* Search and Filters */}
      <EmeresCard>
        <EmeresCardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <EmeresInput
                placeholder="Rechercher une annonce..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Domain Filter */}
            <select
              value={selectedFilters.domain}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, domain: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">Tous les domaines</option>
              <option value="informatique">Informatique</option>
              <option value="marketing">Marketing</option>
              <option value="design">Design</option>
              <option value="finance">Finance</option>
              <option value="entrepreneuriat">Entrepreneuriat</option>
              <option value="communication">Communication</option>
            </select>

            {/* Urgency Filter */}
            <select
              value={selectedFilters.urgency}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, urgency: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">Toutes les urgences</option>
              <option value="urgent">URGENT</option>
              <option value="high">Prioritaire</option>
              <option value="medium">Normal</option>
              <option value="low">Pas pressé</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedFilters.type}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="individual">Individuel</option>
              <option value="group">En groupe</option>
              <option value="project-based">Basé sur projet</option>
            </select>

            {/* Matching Score Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Score min:</span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={selectedFilters.matchingScore}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, matchingScore: parseInt(e.target.value) }))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900 w-8">{selectedFilters.matchingScore}%</span>
            </div>
          </div>
        </EmeresCardContent>
      </EmeresCard>

      {/* Student Ads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAds.map((ad) => {
          const responseStatus = getResponseStatus(ad.id);
          const matchingScore = ad.matching_score || 0;
          
          return (
            <EmeresCard key={ad.id} className="hover:shadow-lg transition-shadow duration-200">
              <EmeresCardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(ad.urgency_level)}`}>
                        {getUrgencyIcon(ad.urgency_level)}
                        {getUrgencyLabel(ad.urgency_level)}
                      </div>
                      {matchingScore > 0 && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getMatchingScoreColor(matchingScore)}`}>
                          {getMatchingScoreIcon(matchingScore)}
                          {matchingScore}%
                        </div>
                      )}
                    </div>
                    <EmeresCardTitle className="text-lg mb-2 line-clamp-2">
                      {ad.title}
                    </EmeresCardTitle>
                  </div>
                </div>
              </EmeresCardHeader>
              
              <EmeresCardContent className="space-y-4">
                {/* Student Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                    {ad.student_name ? ad.student_name.split(' ').map(n => n[0]).join('').slice(0,2) : 'ET'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {ad.student_name || 'Étudiant'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {ad.field_of_study}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {ad.description}
                  </p>
                </div>

                {/* Desired Expertise */}
                {ad.desired_expertise && ad.desired_expertise.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-2">Expertise recherchée</div>
                    <div className="flex flex-wrap gap-1">
                      {ad.desired_expertise.slice(0, 4).map((expertise, index) => (
                        <EmeresBadge key={index} variant="primary" size="sm">
                          {expertise}
                        </EmeresBadge>
                      ))}
                      {ad.desired_expertise.length > 4 && (
                        <EmeresBadge variant="outline" size="sm">
                          +{ad.desired_expertise.length - 4}
                        </EmeresBadge>
                      )}
                    </div>
                  </div>
                )}

                {/* Goals */}
                {ad.mentorship_goals && ad.mentorship_goals.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-2">Objectifs</div>
                    <div className="space-y-1">
                      {ad.mentorship_goals.slice(0, 2).map((goal, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                          <Target className="h-3 w-3 text-teal-500 flex-shrink-0" />
                          {goal}
                        </div>
                      ))}
                      {ad.mentorship_goals.length > 2 && (
                        <div className="text-xs text-gray-500 italic">
                          +{ad.mentorship_goals.length - 2} autre{ad.mentorship_goals.length > 3 ? 's' : ''} objectif{ad.mentorship_goals.length > 3 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Type</div>
                    <div className="text-sm font-medium text-gray-900">
                      {ad.mentorship_type === 'individual' ? 'Individuel' : 
                       ad.mentorship_type === 'group' ? 'Groupe' : 'Projet'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Durée</div>
                    <div className="text-sm font-medium text-gray-900">
                      {ad.duration_expected || 'À définir'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Engagement</div>
                    <div className="text-sm font-medium text-gray-900">
                      {ad.time_commitment || 'Flexible'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Publié</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(ad.created_at)}
                    </div>
                  </div>
                </div>

                {/* Availability */}
                {ad.availability_schedule && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{ad.availability_schedule}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100">
                  {responseStatus ? (
                    <div className="flex items-center justify-between">
                      {getStatusDisplay(responseStatus)}
                      {responseStatus === 'accepted' && (
                        <EmeresButton variant="outline" size="sm" icon={<MessageSquare />}>
                          Contacter
                        </EmeresButton>
                      )}
                    </div>
                  ) : (
                    <EmeresButton 
                      variant="primary" 
                      size="sm"
                      icon={<Send />}
                      onClick={() => handleRespondToAd(ad)}
                      className="w-full"
                    >
                      Répondre à l'annonce
                    </EmeresButton>
                  )}
                </div>
              </EmeresCardContent>
            </EmeresCard>
          );
        })}
      </div>

      {filteredAds.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce trouvée</h3>
          <p className="text-gray-600">
            {ads.length === 0 
              ? "Aucun étudiant n'a encore publié d'annonce de recherche de mentor."
              : "Essayez de modifier vos critères de recherche ou vos filtres."
            }
          </p>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Répondre à l'annonce de {selectedAd.student_name || 'l\'étudiant'}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedAd.title}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <EmeresBadge variant="secondary" size="sm">
                    {selectedAd.field_of_study}
                  </EmeresBadge>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(selectedAd.urgency_level)}`}>
                    {getUrgencyIcon(selectedAd.urgency_level)}
                    {getUrgencyLabel(selectedAd.urgency_level)}
                  </div>
                  {selectedAd.matching_score > 0 && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getMatchingScoreColor(selectedAd.matching_score)}`}>
                      {getMatchingScoreIcon(selectedAd.matching_score)}
                      Compatibilité {selectedAd.matching_score}%
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">{selectedAd.description}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre message de réponse
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Rédigez votre réponse personnalisée..."
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <EmeresButton
                variant="outline"
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedAd(null);
                  setResponseMessage('');
                }}
                disabled={submittingResponse}
              >
                Annuler
              </EmeresButton>
              <EmeresButton
                variant="primary"
                icon={<Send />}
                onClick={submitResponse}
                disabled={submittingResponse}
              >
                {submittingResponse ? 'Envoi en cours...' : 'Envoyer la réponse'}
              </EmeresButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAds;