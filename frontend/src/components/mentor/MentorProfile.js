import React, { useState, useEffect } from 'react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import EmeresInput from '../ui/EmeresInput';
import { 
  User, 
  Building,
  Clock,
  Phone,
  Mail,
  Linkedin,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  MapPin,
  Calendar,
  Star,
  Award,
  MessageSquare,
  Video,
  Users,
  Target,
  BookOpen,
  Briefcase,
  GraduationCap,
  Settings,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  Eye,
  EyeOff,
  Globe,
  Smartphone,
  Laptop,
  Coffee,
  Heart,
  Zap,
  Lightbulb
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MentorProfile = ({ mentorProfile, setMentorProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    company: '',
    position: '',
    experience_years: 0,
    specializations: [],
    bio: '',
    availability_hours_per_week: 0,
    preferred_communication: [],
    linkedin_url: '',
    phone: ''
  });

  const [newSpecialization, setNewSpecialization] = useState('');

  useEffect(() => {
    if (mentorProfile) {
      setProfileForm({
        first_name: mentorProfile.first_name || '',
        last_name: mentorProfile.last_name || '',
        company: mentorProfile.company || '',
        position: mentorProfile.position || '',
        experience_years: mentorProfile.experience_years || 0,
        specializations: mentorProfile.specializations || [],
        bio: mentorProfile.bio || '',
        availability_hours_per_week: mentorProfile.availability_hours_per_week || 0,
        preferred_communication: mentorProfile.preferred_communication || [],
        linkedin_url: mentorProfile.linkedin_url || '',
        phone: mentorProfile.phone || ''
      });
    }
  }, [mentorProfile]);

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileForm)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setMentorProfile(updatedProfile);
        setIsEditing(false);
        console.log('✅ Profil mis à jour avec succès');
        // Optionnel: Afficher une notification de succès
        alert('Profil mis à jour avec succès !');
      } else {
        const errorData = await response.json();
        console.error('❌ Erreur du serveur:', errorData);
        alert(`Erreur lors de la mise à jour: ${errorData.detail || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du profil:', error);
      alert('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value, isChecked) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: isChecked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !profileForm.specializations.includes(newSpecialization.trim())) {
      setProfileForm(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()]
      }));
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (specialization) => {
    setProfileForm(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== specialization)
    }));
  };

  const communicationOptions = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'video', label: 'Visioconférence', icon: Video },
    { value: 'chat', label: 'Chat/Messagerie', icon: MessageSquare },
    { value: 'phone', label: 'Téléphone', icon: Phone }
  ];

  const predefinedSpecializations = [
    'Développement Web', 'Data Science', 'Intelligence Artificielle', 'Marketing Digital',
    'Commerce', 'Finance', 'Ressources Humaines', 'Design UX/UI', 'Gestion de Projet',
    'Entrepreneuriat', 'Consulting', 'Vente', 'Communication', 'Leadership',
    'Innovation', 'Transformation Digitale', 'E-commerce', 'Cybersécurité'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Mon Profil Mentor
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Gérez vos informations personnelles et préférences de mentorat
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <>
              <EmeresButton
                variant="secondary"
                icon={<Download />}
                size="sm"
                data-testid="export-profile-btn"
              >
                Exporter Profil
              </EmeresButton>
              <EmeresButton
                variant="primary"
                icon={<Edit />}
                onClick={() => setIsEditing(true)}
                data-testid="edit-profile-btn"
              >
                Modifier Profil
              </EmeresButton>
            </>
          ) : (
            <>
              <EmeresButton
                variant="outline"
                icon={<X />}
                onClick={() => {
                  setIsEditing(false);
                  // Reset form to original data
                  if (mentorProfile) {
                    setProfileForm({
                      first_name: mentorProfile.first_name || '',
                      last_name: mentorProfile.last_name || '',
                      company: mentorProfile.company || '',
                      position: mentorProfile.position || '',
                      experience_years: mentorProfile.experience_years || 0,
                      specializations: mentorProfile.specializations || [],
                      bio: mentorProfile.bio || '',
                      availability_hours_per_week: mentorProfile.availability_hours_per_week || 0,
                      preferred_communication: mentorProfile.preferred_communication || [],
                      linkedin_url: mentorProfile.linkedin_url || '',
                      phone: mentorProfile.phone || ''
                    });
                  }
                }}
                disabled={loading}
                data-testid="cancel-edit-btn"
              >
                Annuler
              </EmeresButton>
              <EmeresButton
                variant="primary"
                icon={<Save />}
                onClick={updateProfile}
                disabled={loading}
                data-testid="save-profile-btn"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </EmeresButton>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <div className="lg:col-span-2 space-y-6">
          <EmeresCard>
            <EmeresCardHeader>
              <EmeresCardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Informations Personnelles
              </EmeresCardTitle>
              <EmeresCardDescription>
                {isEditing ? 'Modifiez vos informations de base' : 'Vos informations de base'}
              </EmeresCardDescription>
            </EmeresCardHeader>
            <EmeresCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  {isEditing ? (
                    <EmeresInput
                      value={profileForm.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      required
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {profileForm.first_name || 'Non renseigné'}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  {isEditing ? (
                    <EmeresInput
                      value={profileForm.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      required
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {profileForm.last_name || 'Non renseigné'}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprise
                  </label>
                  {isEditing ? (
                    <EmeresInput
                      value={profileForm.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Nom de l'entreprise"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {profileForm.company || 'Non renseigné'}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste
                  </label>
                  {isEditing ? (
                    <EmeresInput
                      value={profileForm.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="Intitulé du poste"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {profileForm.position || 'Non renseigné'}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Années d'expérience
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={profileForm.experience_years}
                    onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {profileForm.experience_years || 0} année{profileForm.experience_years > 1 ? 's' : ''}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio / Présentation
                </label>
                {isEditing ? (
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Présentez-vous en quelques lignes..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 min-h-[100px]">
                    {profileForm.bio || 'Aucune présentation renseignée'}
                  </div>
                )}
              </div>
            </EmeresCardContent>
          </EmeresCard>

          {/* Spécialisations */}
          <EmeresCard>
            <EmeresCardHeader>
              <EmeresCardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-600" />
                Domaines d'Expertise
              </EmeresCardTitle>
              <EmeresCardDescription>
                {profileForm.specializations.length} spécialisation{profileForm.specializations.length > 1 ? 's' : ''} renseignée{profileForm.specializations.length > 1 ? 's' : ''}
              </EmeresCardDescription>
            </EmeresCardHeader>
            <EmeresCardContent className="space-y-4">
              {isEditing && (
                <div className="flex gap-2">
                  <EmeresInput
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    placeholder="Ajouter une spécialisation..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSpecialization();
                      }
                    }}
                  />
                  <EmeresButton
                    variant="outline"
                    size="sm"
                    icon={<Plus />}
                    onClick={addSpecialization}
                  />
                </div>
              )}
              
              {isEditing && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Suggestions:</div>
                  <div className="flex flex-wrap gap-2">
                    {predefinedSpecializations
                      .filter(spec => !profileForm.specializations.includes(spec))
                      .slice(0, 6)
                      .map((spec) => (
                        <button
                          key={spec}
                          onClick={() => handleInputChange('specializations', [...profileForm.specializations, spec])}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                        >
                          + {spec}
                        </button>
                      ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {profileForm.specializations.map((specialization, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <EmeresBadge variant="primary" size="sm">
                      {specialization}
                      {isEditing && (
                        <button
                          onClick={() => removeSpecialization(specialization)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </EmeresBadge>
                  </div>
                ))}
                {profileForm.specializations.length === 0 && (
                  <div className="text-gray-500 text-sm italic">
                    Aucune spécialisation renseignée
                  </div>
                )}
              </div>
            </EmeresCardContent>
          </EmeresCard>
        </div>

        {/* Panel latéral */}
        <div className="space-y-6">
          {/* Disponibilités */}
          <EmeresCard>
            <EmeresCardHeader>
              <EmeresCardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Disponibilités
              </EmeresCardTitle>
            </EmeresCardHeader>
            <EmeresCardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heures par semaine
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={profileForm.availability_hours_per_week}
                    onChange={(e) => handleInputChange('availability_hours_per_week', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">
                      {profileForm.availability_hours_per_week || 0}h
                    </div>
                    <div className="text-sm text-gray-500">par semaine</div>
                  </div>
                )}
              </div>
            </EmeresCardContent>
          </EmeresCard>

          {/* Modes de communication */}
          <EmeresCard>
            <EmeresCardHeader>
              <EmeresCardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Communication
              </EmeresCardTitle>
            </EmeresCardHeader>
            <EmeresCardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Modes préférés
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    {communicationOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profileForm.preferred_communication.includes(option.value)}
                            onChange={(e) => handleArrayChange('preferred_communication', option.value, e.target.checked)}
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                          <Icon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {profileForm.preferred_communication.length > 0 ? (
                      profileForm.preferred_communication.map((comm, index) => {
                        const option = communicationOptions.find(o => o.value === comm);
                        const Icon = option?.icon || MessageSquare;
                        return (
                          <div key={index} className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-teal-600" />
                            <span className="text-sm text-gray-700">{option?.label || comm}</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-gray-500 text-sm italic">
                        Aucune préférence renseignée
                      </div>
                    )}
                  </div>
                )}
              </div>
            </EmeresCardContent>
          </EmeresCard>

          {/* Contacts */}
          <EmeresCard>
            <EmeresCardHeader>
              <EmeresCardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-orange-600" />
                Coordonnées
              </EmeresCardTitle>
            </EmeresCardHeader>
            <EmeresCardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                {isEditing ? (
                  <EmeresInput
                    value={profileForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    type="tel"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {profileForm.phone || 'Non renseigné'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                {isEditing ? (
                  <EmeresInput
                    value={profileForm.linkedin_url}
                    onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    type="url"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg">
                    {profileForm.linkedin_url ? (
                      <a 
                        href={profileForm.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        Voir le profil LinkedIn
                      </a>
                    ) : (
                      <span className="text-gray-500">Non renseigné</span>
                    )}
                  </div>
                )}
              </div>
            </EmeresCardContent>
          </EmeresCard>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;