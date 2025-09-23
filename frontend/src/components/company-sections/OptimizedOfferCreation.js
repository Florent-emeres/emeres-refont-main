import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  ChevronRight, 
  ChevronLeft,
  Check,
  Save,
  X,
  Plus,
  MapPin,
  Euro,
  Clock,
  Users,
  Briefcase,
  Target,
  Settings,
  Eye,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const OptimizedOfferCreation = ({ isOpen, onClose, editingOffer = null, onSuccess }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Formulaire optimisé avec progression
  const [offerForm, setOfferForm] = useState({
    // Étape 1: Informations essentielles
    title: '',
    offer_type: 'stage',
    description: '',
    location: '',
    
    // Étape 2: Missions et compétences  
    missions: [],
    requirements: [],
    skills_required: [],
    soft_skills: [],
    
    // Étape 3: Conditions
    duration: '',
    start_date: '',
    salary_min: '',
    salary_max: '',
    benefits: [],
    is_remote: false,
    remote_percentage: 0,
    
    // Étape 4: Finalisation
    target_level: 'bac+3',
    application_deadline: '',
    visibility: 'public'
  });

  // Workflow en 4 étapes optimisées
  const steps = [
    {
      id: 1,
      title: 'Informations essentielles',
      description: 'Titre, type et description du poste',
      icon: Briefcase,
      color: 'text-blue-600 bg-blue-50',
      fields: ['title', 'offer_type', 'description', 'location']
    },
    {
      id: 2,
      title: 'Missions & Compétences',
      description: 'Définissez le profil recherché',
      icon: Target,
      color: 'text-green-600 bg-green-50',
      fields: ['missions', 'requirements', 'skills_required']
    },
    {
      id: 3,
      title: 'Conditions & Avantages',
      description: 'Durée, salaire et modalités',
      icon: Euro,
      color: 'text-purple-600 bg-purple-50',
      fields: ['duration', 'start_date', 'salary_min', 'benefits']
    },
    {
      id: 4,
      title: 'Finalisation',
      description: 'Paramètres et publication',
      icon: Send,
      color: 'text-orange-600 bg-orange-50',
      fields: ['target_level', 'application_deadline', 'visibility']
    }
  ];

  // Listes prédéfinies
  const OFFER_TYPES = [
    { value: 'stage', label: 'Stage', icon: '🎓', description: 'Stage conventionné' },
    { value: 'alternance', label: 'Alternance', icon: '🔄', description: 'Contrat d\'apprentissage' },
    { value: 'emploi', label: 'Emploi', icon: '💼', description: 'CDI/CDD' },
    { value: 'mission', label: 'Mission', icon: '⚡', description: 'Mission freelance' }
  ];

  const DURATION_OPTIONS = [
    '2 mois', '3 mois', '4 mois', '5 mois', '6 mois', 
    '9 mois', '12 mois', '18 mois', '24 mois', 'CDI'
  ];

  const PREDEFINED_MISSIONS = [
    "Développer des applications web/mobile",
    "Analyser les besoins clients",
    "Participer aux réunions d'équipe", 
    "Rédiger de la documentation technique",
    "Effectuer des tests et débuggage",
    "Maintenir et optimiser le code existant",
    "Collaborer avec l'équipe de design",
    "Gérer les bases de données",
    "Assurer la veille technologique",
    "Former les utilisateurs finaux"
  ];

  const PREDEFINED_SKILLS = [
    "React", "JavaScript", "TypeScript", "Node.js", "Python", "Java",
    "HTML/CSS", "SQL", "Git", "AWS", "Docker", "MongoDB", "PostgreSQL",
    "Vue.js", "Angular", "PHP", "Laravel", "Symfony", "Spring Boot"
  ];

  const PREDEFINED_BENEFITS = [
    "Tickets restaurant", "Mutuelle", "Transport remboursé", "Télétravail", 
    "Formation", "13ème mois", "Congés supplémentaires", "CE", "Parking"
  ];

  // Initialiser le formulaire
  useEffect(() => {
    if (editingOffer) {
      setOfferForm({
        title: editingOffer.title || '',
        offer_type: editingOffer.offer_type || 'stage',
        description: editingOffer.description || '',
        location: editingOffer.location || '',
        missions: editingOffer.missions || [],
        requirements: editingOffer.requirements || [],
        skills_required: editingOffer.skills_required || [],
        soft_skills: editingOffer.soft_skills || [],
        duration: editingOffer.duration || '',
        start_date: editingOffer.start_date || '',
        salary_min: editingOffer.salary_min || '',
        salary_max: editingOffer.salary_max || '',
        benefits: editingOffer.benefits || [],
        is_remote: editingOffer.is_remote || false,
        remote_percentage: editingOffer.remote_percentage || 0,
        target_level: editingOffer.target_level || 'bac+3',
        application_deadline: editingOffer.application_deadline || '',
        visibility: editingOffer.visibility || 'public'
      });
    }
  }, [editingOffer]);

  // Validation en temps réel
  const validateStep = (stepNumber) => {
    const step = steps.find(s => s.id === stepNumber);
    const errors = {};
    
    step.fields.forEach(field => {
      if (field === 'title' && !offerForm.title.trim()) {
        errors.title = 'Le titre est obligatoire';
      }
      if (field === 'description' && !offerForm.description.trim()) {
        errors.description = 'La description est obligatoire';
      }
      if (field === 'location' && !offerForm.location.trim()) {
        errors.location = 'Le lieu est obligatoire';
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gestion des changements
  const handleInputChange = (field, value) => {
    setOfferForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Supprimer l'erreur pour ce champ
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleArrayAdd = (field, value) => {
    if (value.trim()) {
      setOfferForm(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const handleArrayRemove = (field, index) => {
    setOfferForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Navigation entre étapes
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Soumission
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const method = editingOffer ? 'PUT' : 'POST';
      const url = editingOffer 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/offers/${editingOffer.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/offers`;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(offerForm)
      });

      if (response.ok) {
        toast.success(editingOffer ? 'Offre mise à jour !' : 'Offre créée avec succès !');
        onSuccess?.();
        onClose();
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur sauvegarde offre:', error);
      toast.error('Erreur lors de la sauvegarde de l\'offre');
    } finally {
      setIsLoading(false);
    }
  };

  // Calcul du pourcentage de complétion
  const getCompletionPercentage = () => {
    const totalFields = steps.reduce((acc, step) => acc + step.fields.length, 0);
    const completedFields = steps.reduce((acc, step) => {
      return acc + step.fields.filter(field => {
        const value = offerForm[field];
        return Array.isArray(value) ? value.length > 0 : value && value.toString().trim();
      }).length;
    }, 0);
    return Math.round((completedFields / totalFields) * 100);
  };

  // Interface de l'étape actuelle
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Type d'offre avec cartes visuelles */}
            <div>
              <Label className="text-base font-semibold">Type d'offre *</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {OFFER_TYPES.map((type) => (
                  <div 
                    key={type.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      offerForm.offer_type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('offer_type', type.value)}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-gray-500">{type.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Titre */}
            <div>
              <Label htmlFor="title" className="text-base font-semibold">
                Titre de l'offre *
              </Label>
              <Input
                id="title"
                value={offerForm.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Développeur Frontend React - Stage 6 mois"
                className={`mt-2 ${validationErrors.title ? 'border-red-500' : ''}`}
              />
              {validationErrors.title && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.title}
                </p>
              )}
            </div>

            {/* Lieu */}
            <div>
              <Label htmlFor="location" className="text-base font-semibold">
                Lieu de travail *
              </Label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={offerForm.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Paris, Lyon, Télétravail, Hybride..."
                  className={`pl-10 ${validationErrors.location ? 'border-red-500' : ''}`}
                />
              </div>
              {validationErrors.location && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.location}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-base font-semibold">
                Description du poste *
              </Label>
              <Textarea
                id="description"
                value={offerForm.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez le poste, l'environnement de travail, les objectifs..."
                rows={6}
                className={`mt-2 ${validationErrors.description ? 'border-red-500' : ''}`}
              />
              <div className="flex justify-between items-center mt-1">
                {validationErrors.description ? (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {validationErrors.description}
                  </p>
                ) : (
                  <div />
                )}
                <span className="text-sm text-gray-500">
                  {offerForm.description.length}/500 caractères
                </span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Missions */}
            <div>
              <Label className="text-base font-semibold">Missions principales</Label>
              <p className="text-sm text-gray-600 mb-3">Sélectionnez ou ajoutez les missions</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {PREDEFINED_MISSIONS.map((mission) => (
                  <div
                    key={mission}
                    className={`p-2 text-sm rounded border cursor-pointer transition-all ${
                      offerForm.missions.includes(mission)
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      if (offerForm.missions.includes(mission)) {
                        handleArrayRemove('missions', offerForm.missions.indexOf(mission));
                      } else {
                        handleArrayAdd('missions', mission);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{mission}</span>
                      {offerForm.missions.includes(mission) && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Missions sélectionnées */}
              {offerForm.missions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {offerForm.missions.map((mission, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                      {mission}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => handleArrayRemove('missions', index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Compétences techniques */}
            <div>
              <Label className="text-base font-semibold">Compétences techniques</Label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-3">
                {PREDEFINED_SKILLS.map((skill) => (
                  <div
                    key={skill}
                    className={`p-2 text-center text-sm rounded border cursor-pointer transition-all ${
                      offerForm.skills_required.includes(skill)
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      if (offerForm.skills_required.includes(skill)) {
                        handleArrayRemove('skills_required', offerForm.skills_required.indexOf(skill));
                      } else {
                        handleArrayAdd('skills_required', skill);
                      }
                    }}
                  >
                    {skill}
                    {offerForm.skills_required.includes(skill) && (
                      <Check className="h-3 w-3 mx-auto mt-1 text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Compétences sélectionnées */}
              {offerForm.skills_required.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {offerForm.skills_required.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {skill}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => handleArrayRemove('skills_required', index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Durée et date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration" className="text-base font-semibold">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Durée
                </Label>
                <select
                  id="duration"
                  value={offerForm.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                >
                  <option value="">Sélectionnez la durée</option>
                  {DURATION_OPTIONS.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="start_date" className="text-base font-semibold">
                  Date de début
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={offerForm.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Rémunération */}
            <div>
              <Label className="text-base font-semibold">
                <Euro className="h-4 w-4 inline mr-2" />
                Rémunération mensuelle (€)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="salary_min" className="text-sm">Minimum</Label>
                  <Input
                    id="salary_min"
                    type="number"
                    value={offerForm.salary_min}
                    onChange={(e) => handleInputChange('salary_min', e.target.value)}
                    placeholder="600"
                  />
                </div>
                <div>
                  <Label htmlFor="salary_max" className="text-sm">Maximum</Label>
                  <Input
                    id="salary_max"
                    type="number"
                    value={offerForm.salary_max}
                    onChange={(e) => handleInputChange('salary_max', e.target.value)}
                    placeholder="1200"
                  />
                </div>
              </div>
            </div>

            {/* Avantages */}
            <div>
              <Label className="text-base font-semibold">Avantages</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                {PREDEFINED_BENEFITS.map((benefit) => (
                  <div
                    key={benefit}
                    className={`p-2 text-sm rounded border cursor-pointer transition-all ${
                      offerForm.benefits.includes(benefit)
                        ? 'border-purple-500 bg-purple-50 text-purple-800'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      if (offerForm.benefits.includes(benefit)) {
                        handleArrayRemove('benefits', offerForm.benefits.indexOf(benefit));
                      } else {
                        handleArrayAdd('benefits', benefit);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{benefit}</span>
                      {offerForm.benefits.includes(benefit) && (
                        <Check className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Avantages sélectionnés */}
              {offerForm.benefits.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {offerForm.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                      {benefit}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => handleArrayRemove('benefits', index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Télétravail */}
            <div>
              <Label className="text-base font-semibold">Modalités de travail</Label>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_remote"
                    checked={offerForm.is_remote}
                    onChange={(e) => handleInputChange('is_remote', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_remote" className="text-sm">Télétravail possible</Label>
                </div>
                
                {offerForm.is_remote && (
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="remote_percentage" className="text-sm">Pourcentage:</Label>
                    <Input
                      id="remote_percentage"
                      type="number"
                      value={offerForm.remote_percentage}
                      onChange={(e) => handleInputChange('remote_percentage', e.target.value)}
                      className="w-20"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm">%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Niveau ciblé */}
            <div>
              <Label htmlFor="target_level" className="text-base font-semibold">
                <Users className="h-4 w-4 inline mr-2" />
                Niveau d'études ciblé
              </Label>
              <select
                id="target_level"
                value={offerForm.target_level}
                onChange={(e) => handleInputChange('target_level', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
              >
                <option value="bac">Bac</option>
                <option value="bac+2">Bac+2</option>
                <option value="bac+3">Bac+3</option>
                <option value="bac+5">Bac+5</option>
                <option value="experience">Expérience requise</option>
              </select>
            </div>

            {/* Date limite */}
            <div>
              <Label htmlFor="application_deadline" className="text-base font-semibold">
                Date limite de candidature
              </Label>
              <Input
                id="application_deadline"
                type="date"
                value={offerForm.application_deadline}
                onChange={(e) => handleInputChange('application_deadline', e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Visibilité */}
            <div>
              <Label htmlFor="visibility" className="text-base font-semibold">
                <Eye className="h-4 w-4 inline mr-2" />
                Visibilité de l'offre
              </Label>
              <select
                id="visibility"
                value={offerForm.visibility}
                onChange={(e) => handleInputChange('visibility', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
              >
                <option value="public">🌐 Public - Visible par tous</option>
                <option value="schools_only">🎓 Écoles uniquement - Réservé aux partenaires éducatifs</option>
                <option value="partners_only">🤝 Partenaires uniquement - Accès restreint</option>
              </select>
            </div>

            {/* Récapitulatif */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Récapitulatif de votre offre
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Titre:</span>
                  <span>{offerForm.title || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <span>{OFFER_TYPES.find(t => t.value === offerForm.offer_type)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Lieu:</span>
                  <span>{offerForm.location || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Durée:</span>
                  <span>{offerForm.duration || 'Non renseignée'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Missions:</span>
                  <span>{offerForm.missions.length} définies</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Compétences:</span>
                  <span>{offerForm.skills_required.length} requises</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Complétion:</span>
                  <span className="font-bold text-green-600">{getCompletionPercentage()}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-blue-600" />
            {editingOffer ? 'Modifier l\'offre' : 'Créer une nouvelle offre'}
          </DialogTitle>
          <DialogDescription>
            Suivez les étapes pour créer une offre attractive et complète
          </DialogDescription>
        </DialogHeader>

        {/* Barre de progression */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                    ${isActive ? 'bg-blue-600 text-white' : 
                      isCompleted ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}
                  `}>
                    {isCompleted ? <Check className="h-6 w-6" /> : <StepIcon className="h-6 w-6" />}
                  </div>
                  <div className="text-center">
                    <div className={`font-medium text-sm ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`absolute h-0.5 w-full top-6 left-1/2 -z-10 ${
                      currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                    }`} style={{ transform: 'translateX(50%)' }} />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Barre de progression globale */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Contenu de l'étape actuelle */}
        <div className="overflow-y-auto flex-1 px-1">
          {renderCurrentStep()}
        </div>

        {/* Boutons de navigation */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Étape {currentStep} / {steps.length}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {getCompletionPercentage()}% complété
            </Badge>
          </div>
          
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>
            )}
            
            {currentStep < steps.length ? (
              <Button 
                onClick={nextStep}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {editingOffer ? 'Mettre à jour l\'offre' : 'Publier l\'offre'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OptimizedOfferCreation;