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
  Mail
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const StudentDiscovery = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    domain: 'all',
    objective: 'all',
    matchingScore: 0
  });
  const [mentorSpecializations, setMentorSpecializations] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    loadAvailableStudents();
    loadMyRequests();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, selectedFilters]);

  const loadAvailableStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/discover-students`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
        setMentorSpecializations(data.mentor_specializations || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/mentorship-requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const requests = await response.json();
        setMyRequests(requests);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(student => 
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(term) ||
        student.field_of_study.toLowerCase().includes(term) ||
        student.search_domain.toLowerCase().includes(term) ||
        student.institution_name.toLowerCase().includes(term)
      );
    }

    // Filter by domain
    if (selectedFilters.domain !== 'all') {
      filtered = filtered.filter(student => 
        student.field_of_study.toLowerCase().includes(selectedFilters.domain.toLowerCase()) ||
        student.search_domain.toLowerCase().includes(selectedFilters.domain.toLowerCase())
      );
    }

    // Filter by objective
    if (selectedFilters.objective !== 'all') {
      filtered = filtered.filter(student => 
        student.search_objective.toLowerCase() === selectedFilters.objective.toLowerCase()
      );
    }

    // Filter by matching score
    filtered = filtered.filter(student => 
      student.matching_score >= selectedFilters.matchingScore
    );

    setFilteredStudents(filtered);
  };

  const handleRequestMentorship = (student) => {
    setSelectedStudent(student);
    setRequestMessage(`Bonjour ${student.first_name},

Je suis intéressé(e) par vous accompagner dans votre parcours en ${student.field_of_study}. Avec mon expérience dans les domaines de ${mentorSpecializations.slice(0, 2).join(' et ')}, je pense pouvoir vous aider à atteindre vos objectifs professionnels.

J'aimerais discuter de vos projets et voir comment je peux vous soutenir dans votre recherche de ${student.search_objective.toLowerCase()}.

Cordialement`);
    setShowRequestModal(true);
  };

  const submitMentorshipRequest = async () => {
    if (!selectedStudent) return;

    setSubmittingRequest(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/request-mentorship`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_id: selectedStudent.user_id,
          message: requestMessage
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Demande de mentorat envoyée avec succès !');
        setShowRequestModal(false);
        setSelectedStudent(null);
        setRequestMessage('');
        
        // Reload students and requests
        loadAvailableStudents();
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

  const getRequestStatus = (studentId) => {
    const request = myRequests.find(req => req.student?.user_id === studentId);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Recherche d'étudiants disponibles...</p>
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
            Découvrir des Étudiants
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Trouvez des étudiants qui recherchent un mentor dans vos domaines d'expertise
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{filteredStudents.length} étudiant{filteredStudents.length > 1 ? 's' : ''} disponible{filteredStudents.length > 1 ? 's' : ''}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <EmeresInput
                placeholder="Rechercher un étudiant..."
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
              <option value="ingénierie">Ingénierie</option>
              <option value="entrepreneuriat">Entrepreneuriat</option>
              <option value="communication">Communication</option>
            </select>

            {/* Objective Filter */}
            <select
              value={selectedFilters.objective}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, objective: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">Tous les objectifs</option>
              <option value="stage">Stage</option>
              <option value="alternance">Alternance</option>
              <option value="premier emploi">Premier emploi</option>
              <option value="création d'entreprise">Création d'entreprise</option>
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

      {/* Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student) => {
          const requestStatus = getRequestStatus(student.user_id);
          
          return (
            <EmeresCard key={student.id} className="hover:shadow-lg transition-shadow duration-200">
              <EmeresCardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                      {student.first_name[0]}{student.last_name[0]}
                    </div>
                    <div>
                      <EmeresCardTitle className="text-lg">
                        {student.first_name} {student.last_name}
                      </EmeresCardTitle>
                      <EmeresCardDescription>
                        {student.degree_preparing} {student.study_year} année
                      </EmeresCardDescription>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getMatchingScoreColor(student.matching_score)}`}>
                    {getMatchingScoreIcon(student.matching_score)}
                    {student.matching_score}%
                  </div>
                </div>
              </EmeresCardHeader>
              
              <EmeresCardContent className="space-y-4">
                {/* Institution & Field */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="h-4 w-4" />
                    <span>{student.institution_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span>{student.field_of_study}</span>
                  </div>
                </div>

                {/* Search Objective */}
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">{student.search_objective}</span>
                  <span className="text-sm text-gray-600">en {student.search_domain}</span>
                </div>

                {/* Skills */}
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">Compétences principales</div>
                  <div className="flex flex-wrap gap-1">
                    {student.main_skills.slice(0, 3).map((skill, index) => (
                      <EmeresBadge key={index} variant="secondary" size="sm">
                        {skill}
                      </EmeresBadge>
                    ))}
                    {student.main_skills.length > 3 && (
                      <EmeresBadge variant="outline" size="sm">
                        +{student.main_skills.length - 3}
                      </EmeresBadge>
                    )}
                  </div>
                </div>

                {/* Mentorship Goals */}
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">Objectifs de mentorat</div>
                  <div className="space-y-1">
                    {student.mentorship_goals.slice(0, 2).map((goal, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-1 h-1 bg-teal-500 rounded-full"></div>
                        {goal}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{student.availability_schedule}</span>
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
                      onClick={() => handleRequestMentorship(student)}
                      className="w-full"
                    >
                      Proposer un mentorat
                    </EmeresButton>
                  )}
                </div>
              </EmeresCardContent>
            </EmeresCard>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun étudiant trouvé</h3>
          <p className="text-gray-600">
            Essayez de modifier vos critères de recherche ou vos filtres.
          </p>
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Demande de mentorat pour {selectedStudent.first_name} {selectedStudent.last_name}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getMatchingScoreColor(selectedStudent.matching_score)}`}>
                    {getMatchingScoreIcon(selectedStudent.matching_score)}
                    Compatibilité {selectedStudent.matching_score}%
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedStudent.field_of_study} • {selectedStudent.search_objective} • {selectedStudent.search_domain}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message personnalisé
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Rédigez votre message de présentation..."
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <EmeresButton
                variant="outline"
                onClick={() => {
                  setShowRequestModal(false);
                  setSelectedStudent(null);
                  setRequestMessage('');
                }}
                disabled={submittingRequest}
              >
                Annuler
              </EmeresButton>
              <EmeresButton
                variant="primary"
                icon={<Send />}
                onClick={submitMentorshipRequest}
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

export default StudentDiscovery;