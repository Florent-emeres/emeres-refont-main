import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { Save, RefreshCw } from 'lucide-react';

// Import des nouvelles sections 7-sections
import PersonalInfoSection from './profile-sections/PersonalInfoSection';
import AcademicInstitutionSection from './profile-sections/AcademicInstitutionSection';
import SkillsExperienceSection from './profile-sections/SkillsExperienceSection';
import JobSearchSection from './profile-sections/JobSearchSection';
import SupervisionSection from './profile-sections/SupervisionSection';
import SettingsSection from './profile-sections/SettingsSection';
import ProfileCompletionSection from './profile-sections/ProfileCompletionSection';
import ConsentValidationModal from './ConsentValidationModal';

const EnhancedStudentProfile = ({ profile, updateProfile, user }) => {
  const [profileForm, setProfileForm] = useState({
    // 1. Informations personnelles
    last_name: '', // obligatoire
    first_name: '', // obligatoire
    gender: '', // M., Mme., Autre
    birth_date: '', // obligatoire
    nationality: '',
    address_street: '',
    postal_code: '',
    city: '',
    country: 'France',
    phone: '', // obligatoire
    email: '', // obligatoire, unique, servira d'identifiant
    profile_photo: '', // upload facultatif JPG/PNG
    
    // 2. Établissement actuel
    institution_name: '', // recherche ou création
    institution_city: '', // ville de l'établissement
    institution_type: '', // Lycée, Université, École, CFA
    field_of_study: '', // Informatique, Commerce, Santé
    degree_preparing: '', // CAP, Bac, BTS, BUT, Licence, Master, Doctorat, Autre
    study_year: '', // 1ère, 2e, 3e
    graduation_year: '', // Année prévue d'obtention
    student_certificate: '', // upload PDF relevé de notes / justificatif étudiant
    
    // 3. Compétences & expérience
    main_skills: [], // compétences principales - tags sélectionnables ou champ libre
    languages: [], // langues parlées + niveau A1 → C2
    past_experiences: [], // stages, jobs étudiants → poste, entreprise, durée, missions
    portfolio_projects: [], // liens externes GitHub, Behance, Notion, PDF, vidéo
    
    // 4. Recherche de stage/emploi
    search_objective: '', // Stage, Alternance, Premier emploi, Projet tutoré
    search_domain: '', // domaine recherché en rapport avec études
    contract_type: '', // Stage obligatoire, Stage facultatif, Alternance, Freelance
    desired_duration: '', // durée souhaitée en semaines ou mois
    geographic_mobility: '', // Ville / Région / Pays
    remote_work_accepted: false, // acceptation télétravail
    availability_start: '', // disponibilités - immédiates ou à partir de
    uploaded_cv: '', // upload PDF
    cover_letter: '', // lettre de motivation facultative
    
    // 5. Encadrement & suivi
    assigned_mentor: '', // mentor attitré (si déjà relié à un profil mentor)
    pedagogical_tutor: '', // tuteur pédagogique (enseignant référent)
    company_referent: '', // référent entreprise (si connu)
    
    // 6. Paramètres complémentaires
    email_notifications: true, // notifications email
    sms_notifications: false, // notifications SMS
    app_notifications: true, // notifications app
    gdpr_consent: false, // consentement RGPD (case obligatoire)
    terms_accepted: false, // conditions générales (case obligatoire)
    profile_sharing_consent: false // autorisation partage profil avec entreprises/mentors (case obligatoire)
  });

  const [loading, setLoading] = useState(false);
  const [sectionLoading, setSectionLoading] = useState({
    personal: false,
    academic: false,
    skills: false,
    job_search: false,
    supervision: false,
    settings: false
  });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('personal');
  const [showConsentModal, setShowConsentModal] = useState(false);

  // Fonction de validation des champs obligatoires
  const validateRequiredFields = () => {
    const newErrors = {};
    
    // Champs obligatoires par section
    const requiredFields = {
      'last_name': 'Le nom est obligatoire',
      'first_name': 'Le prénom est obligatoire', 
      'birth_date': 'La date de naissance est obligatoire',
      'phone': 'Le numéro de téléphone est obligatoire',
      'email': 'L\'email est obligatoire',
      'gdpr_consent': 'Le consentement RGPD est obligatoire',
      'terms_accepted': 'L\'acceptation des conditions générales est obligatoire',
      'profile_sharing_consent': 'L\'autorisation de partage de profil est obligatoire'
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      const value = profileForm[field];
      
      if (typeof value === 'boolean') {
        if (!value) newErrors[field] = message;
      } else {
        if (!value || value.toString().trim() === '') {
          newErrors[field] = message;
        }
      }
    });

    // Validation email
    if (profileForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    return newErrors;
  };

  // Fonctions de validation par section
  const validatePersonalSection = () => {
    const newErrors = {};
    const personalRequired = {
      'last_name': 'Le nom est obligatoire',
      'first_name': 'Le prénom est obligatoire', 
      'birth_date': 'La date de naissance est obligatoire',
      'phone': 'Le numéro de téléphone est obligatoire',
      'email': 'L\'email est obligatoire'
    };

    Object.entries(personalRequired).forEach(([field, message]) => {
      const value = profileForm[field];
      if (!value || value.toString().trim() === '') {
        newErrors[field] = message;
      }
    });

    // Validation email
    if (profileForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    return newErrors;
  };

  const validateSettingsSection = () => {
    const newErrors = {};
    const settingsRequired = {
      'gdpr_consent': 'Le consentement RGPD est obligatoire',
      'terms_accepted': 'L\'acceptation des conditions générales est obligatoire',
      'profile_sharing_consent': 'L\'autorisation de partage de profil est obligatoire'
    };

    Object.entries(settingsRequired).forEach(([field, message]) => {
      const value = profileForm[field];
      if (typeof value === 'boolean' && !value) {
        newErrors[field] = message;
      }
    });

    return newErrors;
  };

  // Sauvegarde par section
  const saveSectionData = async (sectionName, validationFn = null) => {
    setSectionLoading(prev => ({ ...prev, [sectionName]: true }));
    setErrors({});

    try {
      // Validation spécifique à la section si fournie
      if (validationFn) {
        const validationErrors = validationFn();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          toast.error('Veuillez corriger les erreurs avant de sauvegarder');
          return false;
        }
      }

      // Appel de la fonction de mise à jour parent
      await updateProfile(profileForm);
      toast.success(`Section ${getSectionDisplayName(sectionName)} sauvegardée avec succès !`);
      return true;
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      // Gestion des erreurs spécifiques email
      if (error.response?.data?.detail?.includes?.('email')) {
        setErrors({ email: 'Cette adresse email est déjà utilisée' });
        toast.error('Cette adresse email est déjà utilisée par un autre compte');
      } else {
        toast.error(`Erreur lors de la sauvegarde de la section ${getSectionDisplayName(sectionName)}`);
      }
      return false;
    } finally {
      setSectionLoading(prev => ({ ...prev, [sectionName]: false }));
    }
  };

  // Fonctions de sauvegarde spécifiques par section
  const savePersonalSection = () => saveSectionData('personal', validatePersonalSection);
  const saveAcademicSection = () => saveSectionData('academic');
  const saveSkillsSection = () => saveSectionData('skills');
  const saveJobSearchSection = () => saveSectionData('job_search');
  const saveSupervisionSection = () => saveSectionData('supervision');
  const saveSettingsSection = () => saveSectionData('settings', validateSettingsSection);

  // Helper pour les noms d'affichage des sections
  const getSectionDisplayName = (sectionName) => {
    const names = {
      personal: 'Informations personnelles',
      academic: 'Établissement actuel',
      skills: 'Compétences & expérience',
      job_search: 'Recherche de stage/emploi',
      supervision: 'Encadrement & suivi',
      settings: 'Paramètres'
    };
    return names[sectionName] || sectionName;
  };

  // Chargement des données existantes
  useEffect(() => {
    if (profile) {
      setProfileForm(prev => ({
        ...prev,
        ...profile
      }));
      
      // Modal de consentements uniquement pour les comptes créés par établissement
      // Pour l'instant, on désactive cette fonctionnalité pour les tests
      // Elle sera réactivée une fois la partie école implémentée
      
      // TODO: Réactiver quand la partie école sera prête
      // const needsConsentValidation = profile.created_by_institution === true && 
      //   (!profile.gdpr_consent || !profile.terms_accepted || !profile.profile_sharing_consent);
      // 
      // if (needsConsentValidation) {
      //   setShowConsentModal(true);
      // }
    }
    
    // S'assurer que l'email utilisateur est bien affiché
    if (user && user.email && !profileForm.email) {
      setProfileForm(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [profile, user]);

  // Sauvegarde du profil
  const handleSaveProfile = async () => {
    setLoading(true);
    setErrors({});

    try {
      // Validation des champs obligatoires
      const validationErrors = validateRequiredFields();
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast.error('Veuillez corriger les erreurs avant de sauvegarder');
        
        // Aller à la première section avec erreur
        if (validationErrors.last_name || validationErrors.first_name || validationErrors.birth_date || 
            validationErrors.phone || validationErrors.email) {
          setActiveTab('personal');
        } else if (validationErrors.gdpr_consent || validationErrors.terms_accepted || 
                   validationErrors.profile_sharing_consent) {
          setActiveTab('settings');
        }
        
        setLoading(false);
        return;
      }

      // Appel de la fonction de mise à jour parent
      await updateProfile(profileForm);
      toast.success('Profil sauvegardé avec succès !');
      
      // Si l'email a été modifié, informer l'utilisateur
      if (profile.email && profileForm.email !== profile.email) {
        toast.info('Nouvel identifiant de connexion : ' + profileForm.email, {
          duration: 5000
        });
      }
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      // Gestion des erreurs spécifiques email
      if (error.response?.data?.detail?.includes?.('email')) {
        setErrors({ email: 'Cette adresse email est déjà utilisée' });
        setActiveTab('personal');
        toast.error('Cette adresse email est déjà utilisée par un autre compte');
      } else {
        toast.error('Erreur lors de la sauvegarde du profil');
      }
    } finally {
      setLoading(false);
    }
  };

  // Réinitialisation du profil
  const handleResetProfile = () => {
    if (profile) {
      setProfileForm(prev => ({
        ...prev,
        ...profile
      }));
      setErrors({});
      toast.info('Profil réinitialisé');
    }
  };

  // Validation des consentements (pour comptes créés par établissement)
  const handleConsentValidation = async (consents) => {
    try {
      const updatedProfile = {
        ...profileForm,
        ...consents
      };
      
      await updateProfile(updatedProfile);
      setProfileForm(updatedProfile);
      setShowConsentModal(false);
      toast.success('Vos consentements ont été validés. Vous pouvez maintenant utiliser ÉMÉRÉS !');
    } catch (error) {
      throw error;
    }
  };

  const removeFromMultiSelect = (field, valueToRemove) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== valueToRemove)
    }));
  };

  // Gestion des langues avec niveaux
  const addLanguage = (language, level) => {
    if (language && level) {
      const languageEntry = { language, level, id: Date.now().toString() };
      setProfileForm(prev => ({
        ...prev,
        languages: [...prev.languages, languageEntry]
      }));
    }
  };

  const removeLanguage = (id) => {
    setProfileForm(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  // Gestion des projets académiques
  const addAcademicProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: [],
      duration: '',
      grade: '',
      context: '' // cours, projet libre, hackathon, etc.
    };
    setProfileForm(prev => ({
      ...prev,
      academic_projects: [...prev.academic_projects, newProject]
    }));
  };

  const updateAcademicProject = (id, field, value) => {
    setProfileForm(prev => ({
      ...prev,
      academic_projects: prev.academic_projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeAcademicProject = (id) => {
    setProfileForm(prev => ({
      ...prev,
      academic_projects: prev.academic_projects.filter(project => project.id !== id)
    }));
  };

  // Gestion des documents
  const addDocument = (type, name, url) => {
    if (type && name) {
      const document = { id: Date.now().toString(), type, name, url: url || '' };
      setProfileForm(prev => ({
        ...prev,
        other_documents: [...prev.other_documents, document]
      }));
    }
  };

  const removeDocument = (id) => {
    setProfileForm(prev => ({
      ...prev,
      other_documents: prev.other_documents.filter(doc => doc.id !== id)
    }));
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      description: '',
      current: false
    };
    setProfileForm(prev => ({
      ...prev,
      work_experiences: [...prev.work_experiences, newExp]
    }));
  };

  const updateExperience = (id, field, value) => {
    setProfileForm(prev => ({
      ...prev,
      work_experiences: prev.work_experiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id) => {
    setProfileForm(prev => ({
      ...prev,
      work_experiences: prev.work_experiences.filter(exp => exp.id !== id)
    }));
  };

  const calculateCompletionPercentage = () => {
    const requiredFields = [
      'first_name', 'last_name', 'phone', 'education_level', 'field_of_study', 
      'school_name', 'current_year', 'search_type', 'availability_start', 
      'current_city', 'bio', 'career_objectives', 'professional_objective'
    ];
    
    const arrayFields = [
      'hard_skills', 'soft_skills', 'preferred_sectors', 'preferred_mission_types',
      'languages', 'software_tools'
    ];

    let completed = 0;
    let total = requiredFields.length + arrayFields.length;

    // Check required string fields
    requiredFields.forEach(field => {
      if (profileForm[field] && profileForm[field].trim() !== '') {
        completed++;
      }
    });

    // Check array fields
    arrayFields.forEach(field => {
      if (profileForm[field] && profileForm[field].length > 0) {
        completed++;
      }
    });

    return Math.round((completed / total) * 100);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateProfile(profileForm);
      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const completionPercentage = calculateCompletionPercentage();

  return (
    <div className="space-y-6">
      {/* Barre de progression du profil */}
      <ProfileCompletionSection profileForm={profileForm} />

      {/* Navigation par onglets pour les 7 sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6">
          <TabsTrigger value="personal" className="text-xs">Personnel</TabsTrigger>
          <TabsTrigger value="academic" className="text-xs">Établissement</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs">Compétences</TabsTrigger>
          <TabsTrigger value="search" className="text-xs">Recherche</TabsTrigger>
          <TabsTrigger value="supervision" className="text-xs">Encadrement</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">Paramètres</TabsTrigger>
        </TabsList>

        {/* Section 1: Informations personnelles */}
        <TabsContent value="personal" className="space-y-6">
          <PersonalInfoSection 
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            errors={errors}
            onSave={savePersonalSection}
            loading={sectionLoading.personal}
          />
        </TabsContent>

        {/* Section 2: Établissement actuel */}
        <TabsContent value="academic" className="space-y-6">
          <AcademicInstitutionSection 
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            errors={errors}
            onSave={saveAcademicSection}
            loading={sectionLoading.academic}
          />
        </TabsContent>

        {/* Section 3: Compétences & expérience */}
        <TabsContent value="skills" className="space-y-6">
          <SkillsExperienceSection 
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            errors={errors}
            onSave={saveSkillsSection}
            loading={sectionLoading.skills}
          />
        </TabsContent>

        {/* Section 4: Recherche de stage/emploi */}
        <TabsContent value="search" className="space-y-6">
          <JobSearchSection 
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            errors={errors}
            onSave={saveJobSearchSection}
            loading={sectionLoading.job_search}
          />
        </TabsContent>

        {/* Section 5: Encadrement & suivi */}
        <TabsContent value="supervision" className="space-y-6">
          <SupervisionSection 
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            errors={errors}
            onSave={saveSupervisionSection}
            loading={sectionLoading.supervision}
          />
        </TabsContent>

        {/* Section 6: Paramètres complémentaires */}
        <TabsContent value="settings" className="space-y-6">
          <SettingsSection 
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            errors={errors}
            onSave={saveSettingsSection}
            loading={sectionLoading.settings}
          />
        </TabsContent>
      </Tabs>

      {/* Message informatif sur la sauvegarde par section */}
      <div className="flex justify-center items-center pt-6 border-t">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 max-w-2xl">
          <div className="flex items-center space-x-2 mb-2">
            <Save className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Sauvegarde par section</span>
          </div>
          <p className="text-sm text-blue-700">
            Chaque section peut maintenant être sauvegardée indépendamment. 
            Utilisez le bouton "Sauvegarder la section" en bas de chaque onglet.
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Plus besoin d'attendre d'avoir complété tout le profil pour sauvegarder !
          </p>
        </div>
      </div>

      {/* Modal de validation des consentements pour comptes créés par établissement */}
      <ConsentValidationModal
        isOpen={showConsentModal}
        onValidate={handleConsentValidation}
        onClose={() => {
          // L'utilisateur ne peut pas fermer sans valider
          toast.warning('Vous devez valider les consentements pour utiliser ÉMÉRÉS');
        }}
        studentName={`${profileForm.first_name} ${profileForm.last_name}`}
      />
    </div>
  );
};

export default EnhancedStudentProfile;