import React, { useState, useEffect } from 'react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import EmeresInput from '../ui/EmeresInput';
import { 
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  Users,
  Send,
  Heart,
  GraduationCap,
  Briefcase,
  Clock,
  Target,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  TrendingUp,
  Award,
  BookOpen,
  Globe,
  Mail,
  Building,
  Trophy,
  UserCheck
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MentorDiscovery = () => {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    specialization: 'all',
    experience: 'all',
    availability: 'all',
    matchingScore: 0
  });
  const [studentInterests, setStudentInterests] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    loadAvailableMentors();
    loadMyRequests();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [mentors, searchTerm, selectedFilters]);

  const loadAvailableMentors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/student/discover-mentors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMentors(data.mentors || []);
        setStudentInterests(data.student_interests || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/student/mentorship-requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const requests = await response.json();
        setMyRequests(requests || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
    }
  };

  const filterMentors = () => {
    let filtered = [...mentors];

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(mentor => 
        `${mentor.first_name} ${mentor.last_name}`.toLowerCase().includes(term) ||
        mentor.company.toLowerCase().includes(term) ||
        mentor.position.toLowerCase().includes(term) ||
        mentor.specializations.some(spec => spec.toLowerCase().includes(term))
      );
    }

    // Filter by specialization
    if (selectedFilters.specialization !== 'all') {
      filtered = filtered.filter(mentor => 
        mentor.specializations.some(spec => 
          spec.toLowerCase().includes(selectedFilters.specialization.toLowerCase())
        )
      );
    }

    // Filter by experience
    if (selectedFilters.experience !== 'all') {
      const expRange = selectedFilters.experience;
      filtered = filtered.filter(mentor => {
        const exp = mentor.experience_years;
        switch (expRange) {
          case '0-5': return exp <= 5;
          case '5-10': return exp >= 5 && exp <= 10;
          case '10+': return exp >= 10;
          default: return true;
        }
      });
    }

    // Filter by availability
    if (selectedFilters.availability !== 'all') {
      filtered = filtered.filter(mentor => {
        const available = mentor.max_students - mentor.current_students_count;
        switch (selectedFilters.availability) {
          case 'high': return available >= 3;
          case 'medium': return available >= 2 && available < 3;
          case 'low': return available >= 1 && available < 2;
          default: return true;
        }
      });
    }

    // Filter by matching score
    filtered = filtered.filter(mentor => 
      mentor.matching_score >= selectedFilters.matchingScore
    );

    setFilteredMentors(filtered);
  };

  const handleRequestMentor = (mentor) => {
    setSelectedMentor(mentor);
    setRequestMessage(`Bonjour ${mentor.first_name},

J'ai été impressionné(e) par votre profil et votre expertise en ${mentor.specializations.slice(0, 2).join(' et ')}. En tant qu'étudiant(e), j'aimerais beaucoup bénéficier de votre mentorat pour développer mes compétences et orienter ma carrière professionnelle.

Mon domaine d'étude et mes intérêts correspondent bien à votre expertise, et je pense que votre accompagnement serait très précieux pour mon développement professionnel.

Seriez-vous disponible pour une première discussion ?

Cordialement`);
    setShowRequestModal(true);
  };

  const submitMentorRequest = async () => {
    if (!selectedMentor) return;

    setSubmittingRequest(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/student/request-mentor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mentor_id: selectedMentor.user_id,
          message: requestMessage
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Demande de mentorat envoyée avec succès !');
        setShowRequestModal(false);
        setSelectedMentor(null);
        setRequestMessage('');
        
        // Reload mentors and requests
        loadAvailableMentors();
        loadMyRequests();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.detail}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      alert('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setSubmittingRequest(false);
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

  const getRequestStatus = (mentorId) => {
    const request = myRequests.find(req => req.mentor_id === mentorId);
    return request?.status || null;
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

  const getAvailabilityColor = (mentor) => {
    const available = mentor.max_students - mentor.current_students_count;
    if (available >= 3) return 'text-green-600 bg-green-100';
    if (available >= 2) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Recherche de mentors disponibles...</p>
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
            Découvrir des Mentors
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Trouvez des mentors expérimentés dans vos domaines d'intérêt
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{filteredMentors.length} mentor{filteredMentors.length > 1 ? 's' : ''} disponible{filteredMentors.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Student Interests */}
      {studentInterests.length > 0 && (
        <EmeresCard>
          <EmeresCardHeader>
            <EmeresCardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Vos Centres d'Intérêt
            </EmeresCardTitle>
          </EmeresCardHeader>
          <EmeresCardContent>
            <div className="flex flex-wrap gap-2">
              {studentInterests.filter(interest => interest && interest.trim()).map((interest, index) => (
                <EmeresBadge key={index} variant="secondary">
                  {interest}
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
                placeholder="Rechercher un mentor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Specialization Filter */}
            <select
              value={selectedFilters.specialization}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, specialization: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">Toutes les spécialisations</option>
              <option value="développement">Développement</option>
              <option value="marketing">Marketing</option>
              <option value="design">Design</option>
              <option value="finance">Finance</option>
              <option value="conseil">Conseil</option>
              <option value="entrepreneuriat">Entrepreneuriat</option>
            </select>

            {/* Experience Filter */}
            <select
              value={selectedFilters.experience}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, experience: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">Toute expérience</option>
              <option value="0-5">0-5 ans</option>
              <option value="5-10">5-10 ans</option>
              <option value="10+">10+ ans</option>
            </select>

            {/* Availability Filter */}
            <select
              value={selectedFilters.availability}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, availability: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">Toute disponibilité</option>
              <option value="high">Très disponible (3+ places)</option>
              <option value="medium">Disponible (2 places)</option>
              <option value="low">Peu disponible (1 place)</option>
            </select>

            {/* Matching Score Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Score min:</span>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={selectedFilters.matchingScore}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, matchingScore: parseInt(e.target.value) }))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900 w-8">{selectedFilters.matchingScore}%</span>
            </div>
          </div>
        </EmeresCardContent>
      </EmeresCard>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => {
          const requestStatus = getRequestStatus(mentor.user_id);
          const available = mentor.max_students - mentor.current_students_count;
          
          return (
            <EmeresCard key={mentor.id} className="hover:shadow-lg transition-shadow duration-200">
              <EmeresCardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                      {mentor.first_name[0]}{mentor.last_name[0]}
                    </div>
                    <div>
                      <EmeresCardTitle className="text-lg">
                        {mentor.first_name} {mentor.last_name}
                      </EmeresCardTitle>
                      <EmeresCardDescription>
                        {mentor.position}
                      </EmeresCardDescription>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getMatchingScoreColor(mentor.matching_score)}`}>
                    {getMatchingScoreIcon(mentor.matching_score)}
                    {mentor.matching_score}%
                  </div>
                </div>
              </EmeresCardHeader>
              
              <EmeresCardContent className="space-y-4">
                {/* Company & Experience */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="h-4 w-4" />
                    <span>{mentor.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="h-4 w-4" />
                    <span>{mentor.experience_years} ans d'expérience</span>
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">Spécialisations</div>
                  <div className="flex flex-wrap gap-1">
                    {mentor.specializations.slice(0, 3).map((spec, index) => (
                      <EmeresBadge key={index} variant="primary" size="sm">
                        {spec}
                      </EmeresBadge>
                    ))}
                    {mentor.specializations.length > 3 && (
                      <EmeresBadge variant="outline" size="sm">
                        +{mentor.specializations.length - 3}
                      </EmeresBadge>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-1">À propos</div>
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {mentor.bio}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">{mentor.success_stories}</div>
                    <div className="text-xs text-gray-500">Succès</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-semibold px-2 py-1 rounded-full ${getAvailabilityColor(mentor)}`}>
                      {available} place{available > 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500">Disponible{available > 1 ? 's' : ''}</div>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{mentor.availability_hours_per_week}h/semaine • {mentor.mentorship_style}</span>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100">
                  {requestStatus ? (
                    <div className="flex items-center justify-between">
                      {getStatusDisplay(requestStatus)}
                      {requestStatus === 'accepted' && (
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
                      onClick={() => handleRequestMentor(mentor)}
                      className="w-full"
                      disabled={available === 0}
                    >
                      {available === 0 ? 'Complet' : 'Demander un mentorat'}
                    </EmeresButton>
                  )}
                </div>
              </EmeresCardContent>
            </EmeresCard>
          );
        })}
      </div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun mentor trouvé</h3>
          <p className="text-gray-600">
            Essayez de modifier vos critères de recherche ou vos filtres.
          </p>
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Demande de mentorat à {selectedMentor.first_name} {selectedMentor.last_name}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getMatchingScoreColor(selectedMentor.matching_score)}`}>
                    {getMatchingScoreIcon(selectedMentor.matching_score)}
                    Compatibilité {selectedMentor.matching_score}%
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedMentor.position} chez {selectedMentor.company} • {selectedMentor.experience_years} ans d'expérience
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedMentor.specializations.slice(0, 3).map((spec, index) => (
                    <EmeresBadge key={index} variant="secondary" size="sm">
                      {spec}
                    </EmeresBadge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message de présentation
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Présentez-vous et expliquez pourquoi vous souhaitez ce mentorat..."
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <EmeresButton
                variant="outline"
                onClick={() => {
                  setShowRequestModal(false);
                  setSelectedMentor(null);
                  setRequestMessage('');
                }}
                disabled={submittingRequest}
              >
                Annuler
              </EmeresButton>
              <EmeresButton
                variant="primary"
                icon={<Send />}
                onClick={submitMentorRequest}
                disabled={submittingRequest}
              >
                {submittingRequest ? 'Envoi en cours...' : 'Envoyer la demande'}
              </EmeresButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDiscovery;