import React, { useState, useEffect } from 'react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import EmeresInput from '../ui/EmeresInput';
import { 
  Plus,
  Edit,
  Trash2,
  Clock,
  Users,
  Target,
  AlertCircle,
  CheckCircle,
  Eye,
  MessageSquare,
  Calendar,
  Star,
  Send,
  Save,
  X,
  Lightbulb,
  BookOpen,
  Award,
  TrendingUp
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PostMentorshipAd = () => {
  const [myAds, setMyAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [adForm, setAdForm] = useState({
    title: '',
    description: '',
    field_of_study: '',
    desired_expertise: [],
    mentorship_goals: [],
    mentorship_type: 'individual',
    duration_expected: '',
    time_commitment: '',
    preferred_communication: [],
    availability_schedule: '',
    urgency_level: 'medium'
  });

  const [newExpertise, setNewExpertise] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const predefinedExpertise = [
    'Développement Web', 'Intelligence Artificielle', 'Data Science', 'Marketing Digital',
    'UX/UI Design', 'Entrepreneuriat', 'Finance', 'Conseil en Stratégie', 
    'Product Management', 'Leadership', 'Communication', 'E-commerce'
  ];

  const predefinedGoals = [
    'Orienter ma carrière', 'Améliorer mes compétences techniques', 'Préparer mes entretiens',
    'Développer mon réseau professionnel', 'Créer mon entreprise', 'Trouver un stage/alternance',
    'Améliorer mon CV et portfolio', 'Développer ma confiance en moi'
  ];

  const communicationOptions = [
    { value: 'email', label: 'Email' },
    { value: 'video', label: 'Visioconférence' },
    { value: 'chat', label: 'Chat/Messagerie' },
    { value: 'phone', label: 'Téléphone' }
  ];

  useEffect(() => {
    loadMyAds();
  }, []);

  const loadMyAds = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/student/mentorship-ads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const ads = await response.json();
        setMyAds(ads);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setAdForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value, isChecked) => {
    setAdForm(prev => ({
      ...prev,
      [field]: isChecked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !adForm.desired_expertise.includes(newExpertise.trim())) {
      setAdForm(prev => ({
        ...prev,
        desired_expertise: [...prev.desired_expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const removeExpertise = (expertise) => {
    setAdForm(prev => ({
      ...prev,
      desired_expertise: prev.desired_expertise.filter(e => e !== expertise)
    }));
  };

  const addGoal = () => {
    if (newGoal.trim() && !adForm.mentorship_goals.includes(newGoal.trim())) {
      setAdForm(prev => ({
        ...prev,
        mentorship_goals: [...prev.mentorship_goals, newGoal.trim()]
      }));
      setNewGoal('');
    }
  };

  const removeGoal = (goal) => {
    setAdForm(prev => ({
      ...prev,
      mentorship_goals: prev.mentorship_goals.filter(g => g !== goal)
    }));
  };

  const submitAd = async () => {
    if (!adForm.title.trim() || !adForm.description.trim() || !adForm.field_of_study.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/student/mentorship-ads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adForm)
      });

      if (response.ok) {
        alert('Annonce créée avec succès !');
        setShowCreateModal(false);
        resetForm();
        loadMyAds();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.detail}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce:', error);
      alert('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setAdForm({
      title: '',
      description: '',
      field_of_study: '',
      desired_expertise: [],
      mentorship_goals: [],
      mentorship_type: 'individual',
      duration_expected: '',
      time_commitment: '',
      preferred_communication: [],
      availability_schedule: '',
      urgency_level: 'medium'
    });
    setNewExpertise('');
    setNewGoal('');
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
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
          <p className="text-gray-600">Chargement de vos annonces...</p>
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
            Mes Annonces de Mentorat
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Créez des annonces pour attirer des mentors dans vos domaines d'intérêt
          </p>
        </div>
        
        <EmeresButton
          variant="primary"
          icon={<Plus />}
          onClick={() => setShowCreateModal(true)}
        >
          Créer une annonce
        </EmeresButton>
      </div>

      {/* My Ads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {myAds.map((ad) => (
          <EmeresCard key={ad.id} className="hover:shadow-lg transition-shadow duration-200">
            <EmeresCardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <EmeresCardTitle className="text-lg mb-2">
                    {ad.title}
                  </EmeresCardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(ad.urgency_level)}`}>
                      {getUrgencyIcon(ad.urgency_level)}
                      {ad.urgency_level === 'urgent' ? 'Urgent' : 
                       ad.urgency_level === 'high' ? 'Prioritaire' :
                       ad.urgency_level === 'medium' ? 'Normal' : 'Pas pressé'}
                    </div>
                    <EmeresBadge variant="secondary" size="sm">
                      {ad.field_of_study}
                    </EmeresBadge>
                  </div>
                </div>
              </div>
            </EmeresCardHeader>
            
            <EmeresCardContent className="space-y-4">
              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-3">
                {ad.description}
              </p>

              {/* Desired Expertise */}
              {ad.desired_expertise && ad.desired_expertise.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">Expertise recherchée</div>
                  <div className="flex flex-wrap gap-1">
                    {ad.desired_expertise.slice(0, 3).map((expertise, index) => (
                      <EmeresBadge key={index} variant="primary" size="sm">
                        {expertise}
                      </EmeresBadge>
                    ))}
                    {ad.desired_expertise.length > 3 && (
                      <EmeresBadge variant="outline" size="sm">
                        +{ad.desired_expertise.length - 3}
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
                        <div className="w-1 h-1 bg-teal-500 rounded-full"></div>
                        {goal}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Durée</div>
                  <div className="text-sm font-medium text-gray-900">
                    {ad.duration_expected || 'Non précisée'}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Engagement</div>
                  <div className="text-sm font-medium text-gray-900">
                    {ad.time_commitment || 'Flexible'}
                  </div>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{ad.responses_count || 0} réponse{(ad.responses_count || 0) > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(ad.created_at)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <EmeresButton variant="outline" size="sm" icon={<Eye />}>
                    Voir
                  </EmeresButton>
                  <EmeresButton variant="outline" size="sm" icon={<Edit />}>
                    Modifier
                  </EmeresButton>
                </div>
              </div>
            </EmeresCardContent>
          </EmeresCard>
        ))}
      </div>

      {myAds.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce créée</h3>
          <p className="text-gray-600 mb-4">
            Créez votre première annonce pour attirer des mentors expérimentés.
          </p>
          <EmeresButton
            variant="primary"
            icon={<Plus />}
            onClick={() => setShowCreateModal(true)}
          >
            Créer ma première annonce
          </EmeresButton>
        </div>
      )}

      {/* Create Ad Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Créer une annonce de mentorat
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'annonce *
                  </label>
                  <EmeresInput
                    value={adForm.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Recherche mentor en développement web..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description détaillée *
                  </label>
                  <textarea
                    value={adForm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Décrivez votre situation, vos besoins et ce que vous recherchez chez un mentor..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domaine d'études *
                  </label>
                  <EmeresInput
                    value={adForm.field_of_study}
                    onChange={(e) => handleInputChange('field_of_study', e.target.value)}
                    placeholder="Ex: Informatique, Marketing, Design..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expertise recherchée
                  </label>
                  <div className="flex gap-2 mb-2">
                    <EmeresInput
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                      placeholder="Ajouter une expertise..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addExpertise();
                        }
                      }}
                    />
                    <EmeresButton
                      variant="outline"
                      size="sm"
                      icon={<Plus />}
                      onClick={addExpertise}
                    />
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-xs text-gray-600 mb-1">Suggestions:</div>
                    <div className="flex flex-wrap gap-1">
                      {predefinedExpertise
                        .filter(exp => !adForm.desired_expertise.includes(exp))
                        .slice(0, 6)
                        .map((exp) => (
                          <button
                            key={exp}
                            onClick={() => handleInputChange('desired_expertise', [...adForm.desired_expertise, exp])}
                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                          >
                            + {exp}
                          </button>
                        ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {adForm.desired_expertise.map((expertise, index) => (
                      <EmeresBadge key={index} variant="primary" size="sm">
                        {expertise}
                        <button
                          onClick={() => removeExpertise(expertise)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </EmeresBadge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objectifs du mentorat
                  </label>
                  <div className="flex gap-2 mb-2">
                    <EmeresInput
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="Ajouter un objectif..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addGoal();
                        }
                      }}
                    />
                    <EmeresButton
                      variant="outline"
                      size="sm"
                      icon={<Plus />}
                      onClick={addGoal}
                    />
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-xs text-gray-600 mb-1">Suggestions:</div>
                    <div className="flex flex-wrap gap-1">
                      {predefinedGoals
                        .filter(goal => !adForm.mentorship_goals.includes(goal))
                        .slice(0, 4)
                        .map((goal) => (
                          <button
                            key={goal}
                            onClick={() => handleInputChange('mentorship_goals', [...adForm.mentorship_goals, goal])}
                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                          >
                            + {goal}
                          </button>
                        ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {adForm.mentorship_goals.map((goal, index) => (
                      <EmeresBadge key={index} variant="secondary" size="sm">
                        {goal}
                        <button
                          onClick={() => removeGoal(goal)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </EmeresBadge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de mentorat
                    </label>
                    <select
                      value={adForm.mentorship_type}
                      onChange={(e) => handleInputChange('mentorship_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="individual">Individuel</option>
                      <option value="group">En groupe</option>
                      <option value="project-based">Basé sur un projet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgence
                    </label>
                    <select
                      value={adForm.urgency_level}
                      onChange={(e) => handleInputChange('urgency_level', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="low">Pas pressé</option>
                      <option value="medium">Normal</option>
                      <option value="high">Prioritaire</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée souhaitée
                    </label>
                    <EmeresInput
                      value={adForm.duration_expected}
                      onChange={(e) => handleInputChange('duration_expected', e.target.value)}
                      placeholder="Ex: 3 mois, 6 mois..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Engagement temporel
                    </label>
                    <EmeresInput
                      value={adForm.time_commitment}
                      onChange={(e) => handleInputChange('time_commitment', e.target.value)}
                      placeholder="Ex: 2h/semaine..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modes de communication préférés
                  </label>
                  <div className="space-y-2">
                    {communicationOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={adForm.preferred_communication.includes(option.value)}
                          onChange={(e) => handleArrayChange('preferred_communication', option.value, e.target.checked)}
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Créneaux de disponibilité
                  </label>
                  <EmeresInput
                    value={adForm.availability_schedule}
                    onChange={(e) => handleInputChange('availability_schedule', e.target.value)}
                    placeholder="Ex: Lundis et mercredis 18h-20h..."
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
              <EmeresButton
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                disabled={submitting}
              >
                Annuler
              </EmeresButton>
              <EmeresButton
                variant="primary"
                icon={<Save />}
                onClick={submitAd}
                disabled={submitting}
              >
                {submitting ? 'Création en cours...' : 'Créer l\'annonce'}
              </EmeresButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostMentorshipAd;