import React, { useState, useEffect } from 'react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import EmeresInput from '../ui/EmeresInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  Upload,
  Save,
  Users,
  Target,
  Award,
  Plus,
  X,
  Camera,
  Edit3,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

// Listes prédéfinies
const SECTORS_LIST = [
  "Informatique & Digital",
  "Industrie & Manufacturing", 
  "Commerce & Distribution",
  "Santé & Pharmaceutique",
  "Finance & Assurance",
  "BTP & Construction",
  "Automobile & Transport",
  "Énergie & Environnement",
  "Agroalimentaire",
  "Conseil & Services",
  "Média & Communication",
  "Tourisme & Hôtellerie",
  "Éducation & Formation",
  "Recherche & Développement",
  "Mode & Luxe",
  "Autre"
];

const COMPANY_SIZES = [
  "1-10 employés",
  "11-50 employés",
  "51-200 employés", 
  "201-500 employés",
  "501-1000 employés",
  "1000+ employés"
];

const COMPANY_VALUES = [
  "Innovation", "Excellence", "Intégrité", "Collaboration", "Respect",
  "Responsabilité", "Transparence", "Agilité", "Qualité", "Durabilité",
  "Diversité", "Inclusion", "Éthique", "Performance", "Créativité"
];

const OptimizedCompanyProfile = ({ user, companyProfile, onProfileUpdate }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [errors, setErrors] = useState({});

  // État du formulaire
  const [formData, setFormData] = useState({
    // Informations générales
    company_name: '',
    short_description: '',
    long_description: '',
    company_size: '',
    sector: '',
    website: '',
    
    // Localisation
    headquarters_address: '',
    headquarters_city: '',
    headquarters_postal_code: '',
    headquarters_country: 'France',
    
    // Contact
    hr_phone: '',
    hr_email: '',
    
    // Réseaux sociaux
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    
    // Valeurs et engagements
    company_values: [],
    
    // Logo
    logo: null
  });

  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    if (companyProfile) {
      setFormData({
        company_name: companyProfile.company_name || '',
        short_description: companyProfile.short_description || '',
        long_description: companyProfile.long_description || '',
        company_size: companyProfile.company_size || '',
        sector: companyProfile.sector || '',
        website: companyProfile.website || '',
        headquarters_address: companyProfile.headquarters_address || '',
        headquarters_city: companyProfile.headquarters_city || '',
        headquarters_postal_code: companyProfile.headquarters_postal_code || '',
        headquarters_country: companyProfile.headquarters_country || 'France',
        hr_phone: companyProfile.hr_phone || '',
        hr_email: companyProfile.hr_email || '',
        linkedin: companyProfile.linkedin || '',
        twitter: companyProfile.twitter || '',
        facebook: companyProfile.facebook || '',
        instagram: companyProfile.instagram || '',
        company_values: companyProfile.company_values || [],
        logo: companyProfile.logo || null
      });
    }
  }, [companyProfile]);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Champs obligatoires
    if (!formData.company_name?.trim()) {
      newErrors.company_name = 'Le nom de l\'entreprise est obligatoire';
    }
    
    if (!formData.short_description?.trim()) {
      newErrors.short_description = 'Une description courte est requise';
    } else if (formData.short_description.length < 20) {
      newErrors.short_description = 'La description doit faire au moins 20 caractères';
    } else if (formData.short_description.length > 200) {
      newErrors.short_description = 'La description ne peut pas dépasser 200 caractères';
    }
    
    if (!formData.sector) {
      newErrors.sector = 'Veuillez sélectionner un secteur d\'activité';
    }
    
    if (!formData.company_size) {
      newErrors.company_size = 'Veuillez indiquer la taille de votre entreprise';
    }
    
    if (!formData.headquarters_city?.trim()) {
      newErrors.headquarters_city = 'La ville du siège est obligatoire';
    }
    
    // Validation email
    if (formData.hr_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.hr_email)) {
      newErrors.hr_email = 'Format d\'email invalide';
    }
    
    // Validation website
    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'L\'URL doit commencer par http:// ou https://';
    }
    
    // Validation téléphone
    if (formData.hr_phone && !/^[\d\s\-\+\(\)]{10,}$/.test(formData.hr_phone)) {
      newErrors.hr_phone = 'Format de téléphone invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculer le pourcentage de complétion
  const calculateCompletionPercentage = () => {
    const requiredFields = ['company_name', 'short_description', 'sector', 'company_size', 'headquarters_city'];
    const optionalFields = ['long_description', 'website', 'hr_email', 'hr_phone', 'headquarters_address', 'linkedin'];
    
    let score = 0;
    const maxScore = requiredFields.length * 2 + optionalFields.length + 2; // +2 pour logo et valeurs
    
    requiredFields.forEach(field => {
      if (formData[field]?.toString().trim()) score += 2;
    });
    
    optionalFields.forEach(field => {
      if (formData[field]?.toString().trim()) score += 1;
    });
    
    if (formData.logo) score += 1;
    if (formData.company_values?.length > 0) score += 1;
    
    return Math.round((score / maxScore) * 100);
  };

  // Gestion des changements
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    setUnsavedChanges(true);
    
    // Supprimer l'erreur pour ce champ si elle existe
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Validation en temps réel pour certains champs
    if (field === 'hr_email' && value) {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!emailValid) {
        setErrors(prev => ({ ...prev, hr_email: 'Format d\'email invalide' }));
      }
    }
    
    if (field === 'website' && value && !value.match(/^https?:\/\/.+/)) {
      setErrors(prev => ({ ...prev, website: 'L\'URL doit commencer par http:// ou https://' }));
    }
  };

  // Ajouter une valeur
  const handleAddValue = (value) => {
    if (value.trim() && !formData.company_values.includes(value.trim())) {
      handleInputChange('company_values', [...formData.company_values, value.trim()]);
    }
  };

  // Supprimer une valeur
  const handleRemoveValue = (index) => {
    const newValues = [...formData.company_values];
    newValues.splice(index, 1);
    handleInputChange('company_values', newValues);
  };

  // Upload du logo
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        toast.error('Le fichier ne peut pas dépasser 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('logo', {
          url: e.target.result,
          filename: file.name,
          size: file.size
        });
        toast.success('Logo uploadé avec succès');
      };
      reader.readAsDataURL(file);
    }
  };

  // Sauvegarde optimisée
  const handleSave = async () => {
    // Validation avant sauvegarde
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs avant de sauvegarder');
      return;
    }
    
    // Vérifier s'il y a des changements
    if (!unsavedChanges) {
      toast.info('Aucune modification à sauvegarder');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const profileData = {
        ...formData,
        completion_percentage: calculateCompletionPercentage(),
        updated_at: new Date().toISOString()
      };
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/profile/company`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setUnsavedChanges(false);
        toast.success('Profil entreprise mis à jour avec succès !');
        
        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur sauvegarde profil:', error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const completionPercentage = calculateCompletionPercentage();

  return (
    <div className="space-y-6">
      {/* Header avec statut de complétion */}
      <EmeresCard variant="gradient" className="bg-gradient-emeres-subtle">
        <EmeresCardContent padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Configuration de votre profil entreprise
              </h2>
              <p className="text-gray-600">
                Complétez votre profil pour améliorer votre visibilité auprès des candidats
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative w-20 h-20 mb-2">
                <svg className="transform -rotate-90 w-full h-full">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-teal-500"
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    strokeDashoffset={`${2 * Math.PI * 35 * (1 - completionPercentage / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">{completionPercentage}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Complété</p>
            </div>
          </div>
          
          {/* Actions principales */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              {unsavedChanges && (
                <EmeresBadge variant="warning" className="animate-pulse">
                  Modifications non sauvegardées
                </EmeresBadge>
              )}
              {Object.keys(errors).length > 0 && (
                <EmeresBadge variant="error">
                  {Object.keys(errors).length} erreur(s) à corriger
                </EmeresBadge>
              )}
            </div>
            
            <EmeresButton
              variant="primary"
              onClick={handleSave}
              disabled={loading || Object.keys(errors).length > 0}
              icon={loading ? <Loader2 className="animate-spin" /> : <Save />}
            >
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </EmeresButton>
          </div>
        </EmeresCardContent>
      </EmeresCard>

      {/* Formulaire par onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Aperçu
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Détails
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Localisation
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact
          </TabsTrigger>
        </TabsList>

        {/* Onglet Aperçu */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo */}
            <EmeresCard>
              <EmeresCardHeader>
                <EmeresCardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Logo de l'entreprise
                </EmeresCardTitle>
                <EmeresCardDescription>
                  Ajoutez le logo de votre entreprise (max 5MB)
                </EmeresCardDescription>
              </EmeresCardHeader>
              <EmeresCardContent>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    {formData.logo ? (
                      <img 
                        src={formData.logo.url} 
                        alt="Logo" 
                        className="h-20 w-20 object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Cliquez pour uploader</span>
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </label>
                </div>
              </EmeresCardContent>
            </EmeresCard>

            {/* Informations générales */}
            <EmeresCard>
              <EmeresCardHeader>
                <EmeresCardTitle>Informations générales</EmeresCardTitle>
              </EmeresCardHeader>
              <EmeresCardContent className="space-y-4">
                <EmeresInput
                  label="Nom de l'entreprise *"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  error={errors.company_name}
                  placeholder="Ex: ÉMÉRÉS Solutions"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secteur d'activité *
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) => handleInputChange('sector', e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 ${errors.sector ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Sélectionnez un secteur</option>
                    {SECTORS_LIST.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                  {errors.sector && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.sector}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille de l'entreprise *
                  </label>
                  <select
                    value={formData.company_size}
                    onChange={(e) => handleInputChange('company_size', e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 ${errors.company_size ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Sélectionnez la taille</option>
                    {COMPANY_SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  {errors.company_size && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.company_size}
                    </p>
                  )}
                </div>
              </EmeresCardContent>
            </EmeresCard>
          </div>

          {/* Description */}
          <EmeresCard>
            <EmeresCardHeader>
              <EmeresCardTitle>Description de l'entreprise</EmeresCardTitle>
              <EmeresCardDescription>
                Présentez votre entreprise aux futurs candidats
              </EmeresCardDescription>
            </EmeresCardHeader>
            <EmeresCardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description courte * (20-200 caractères)
                </label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 resize-none ${errors.short_description ? 'border-red-500' : 'border-gray-300'}`}
                  rows={3}
                  placeholder="Décrivez votre entreprise en quelques mots..."
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.short_description ? (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.short_description}
                    </p>
                  ) : (
                    <div />
                  )}
                  <span className="text-sm text-gray-500">
                    {formData.short_description.length}/200
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description détaillée (optionnel)
                </label>
                <textarea
                  value={formData.long_description}
                  onChange={(e) => handleInputChange('long_description', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 resize-none"
                  rows={6}
                  placeholder="Décrivez votre culture d'entreprise, vos projets, vos ambitions..."
                />
              </div>
            </EmeresCardContent>
          </EmeresCard>
        </TabsContent>

        {/* Onglet Détails */}
        <TabsContent value="details" className="space-y-6">
          <EmeresCard>
            <EmeresCardHeader>
              <EmeresCardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Valeurs de l'entreprise
              </EmeresCardTitle>
              <EmeresCardDescription>
                Sélectionnez les valeurs qui représentent votre entreprise
              </EmeresCardDescription>
            </EmeresCardHeader>
            <EmeresCardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {COMPANY_VALUES.map(value => (
                  <button
                    key={value}
                    onClick={() => {
                      if (formData.company_values.includes(value)) {
                        handleRemoveValue(formData.company_values.indexOf(value));
                      } else {
                        handleAddValue(value);
                      }
                    }}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      formData.company_values.includes(value)
                        ? 'bg-teal-100 border-teal-300 text-teal-800'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {value}
                    {formData.company_values.includes(value) && (
                      <CheckCircle className="h-4 w-4 inline ml-1" />
                    )}
                  </button>
                ))}
              </div>

              {/* Valeurs sélectionnées */}
              {formData.company_values.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Valeurs sélectionnées:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.company_values.map((value, index) => (
                      <EmeresBadge
                        key={index}
                        variant="secondary"
                        removable
                        onRemove={() => handleRemoveValue(index)}
                      >
                        {value}
                      </EmeresBadge>
                    ))}
                  </div>
                </div>
              )}
            </EmeresCardContent>
          </EmeresCard>
        </TabsContent>

        {/* Onglet Localisation */}
        <TabsContent value="location" className="space-y-6">
          <EmeresCard>
            <EmeresCardHeader>
              <EmeresCardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Adresse du siège social
              </EmeresCardTitle>
            </EmeresCardHeader>
            <EmeresCardContent className="space-y-4">
              <EmeresInput
                label="Adresse complète"
                value={formData.headquarters_address}
                onChange={(e) => handleInputChange('headquarters_address', e.target.value)}
                placeholder="123 rue de la République"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EmeresInput
                  label="Ville *"
                  value={formData.headquarters_city}
                  onChange={(e) => handleInputChange('headquarters_city', e.target.value)}
                  error={errors.headquarters_city}
                  placeholder="Paris"
                />

                <EmeresInput
                  label="Code postal"
                  value={formData.headquarters_postal_code}
                  onChange={(e) => handleInputChange('headquarters_postal_code', e.target.value)}
                  placeholder="75001"
                />
              </div>

              <EmeresInput
                label="Pays"
                value={formData.headquarters_country}
                onChange={(e) => handleInputChange('headquarters_country', e.target.value)}
                placeholder="France"
              />
            </EmeresCardContent>
          </EmeresCard>
        </TabsContent>

        {/* Onglet Contact */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmeresCard>
              <EmeresCardHeader>
                <EmeresCardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact RH
                </EmeresCardTitle>
              </EmeresCardHeader>
              <EmeresCardContent className="space-y-4">
                <EmeresInput
                  label="Email RH"
                  type="email"
                  value={formData.hr_email}
                  onChange={(e) => handleInputChange('hr_email', e.target.value)}
                  error={errors.hr_email}
                  placeholder="rh@entreprise.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                />

                <EmeresInput
                  label="Téléphone RH"
                  value={formData.hr_phone}
                  onChange={(e) => handleInputChange('hr_phone', e.target.value)}
                  error={errors.hr_phone}
                  placeholder="+33 1 23 45 67 89"
                  leftIcon={<Phone className="h-4 w-4" />}
                />
              </EmeresCardContent>
            </EmeresCard>

            <EmeresCard>
              <EmeresCardHeader>
                <EmeresCardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Présence en ligne
                </EmeresCardTitle>
              </EmeresCardHeader>
              <EmeresCardContent className="space-y-4">
                <EmeresInput
                  label="Site web"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  error={errors.website}
                  placeholder="https://www.entreprise.com"
                  leftIcon={<Globe className="h-4 w-4" />}
                />

                <EmeresInput
                  label="LinkedIn"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/entreprise"
                />
              </EmeresCardContent>
            </EmeresCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptimizedCompanyProfile;