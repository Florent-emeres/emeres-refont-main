import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Building, 
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
  Edit3
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

const COMPANY_VALUES = [
  "Innovation",
  "Excellence",
  "Intégrité",
  "Respect",
  "Collaboration",
  "Diversité & Inclusion",
  "Responsabilité Sociale",
  "Développement Durable",
  "Qualité",
  "Transparence",
  "Agilité",
  "Créativité",
  "Solidarité",
  "Éthique",
  "Performance",
  "Bienveillance"
];

const COMPANY_COMMITMENTS = [
  "Égalité des chances",
  "Réduction empreinte carbone",
  "Formation continue des employés",
  "Parité hommes-femmes",
  "Inclusion des personnes handicapées",
  "Soutien aux communautés locales",
  "Éthique des affaires",
  "Protection des données",
  "Innovation responsable",
  "Commerce équitable",
  "Bien-être au travail",
  "Mécénat culturel",
  "Partenariats écoles",
  "Open Source",
  "Économie circulaire",
  "Transition numérique"
];

const COMPANY_SIZES = [
  "1-10 employés",
  "11-50 employés", 
  "51-200 employés",
  "201-500 employés",
  "501-1000 employés",
  "1000+ employés"
];

const EnhancedCompanyProfile = ({ user, companyProfile, onProfileUpdate }) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState(companyProfile || {});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // State pour les formulaires
  const [formData, setFormData] = useState({
    // Informations générales
    company_name: profile.company_name || '',
    short_description: profile.short_description || '',
    long_description: profile.long_description || '',
    company_size: profile.company_size || '',
    sector: profile.sector || '',
    website: profile.website || '',
    
    // Localisation
    headquarters_address: profile.headquarters_address || '',
    headquarters_city: profile.headquarters_city || '',
    headquarters_postal_code: profile.headquarters_postal_code || '',
    headquarters_country: profile.headquarters_country || 'France',
    
    // Contact
    hr_phone: profile.hr_phone || '',
    hr_email: profile.hr_email || '',
    
    // Réseaux sociaux
    linkedin: profile.linkedin || '',
    twitter: profile.twitter || '',
    facebook: profile.facebook || '',
    instagram: profile.instagram || '',
    
    // Équipe RH
    hr_managers: profile.hr_managers || [],
    
    // Valeurs et engagements
    company_values: profile.company_values || [],
    company_commitments: profile.company_commitments || [],
    
    // Logo et média
    logo: profile.logo || null,
    media_gallery: profile.media_gallery || []
  });

  // État pour les nouveaux éléments (gardé pour d'autres sections)
  // const [newValue, setNewValue] = useState('');
  // const [newCommitment, setNewCommitment] = useState('');
  
  // États pour l'auto-complétion localisation
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [suggestedCities, setSuggestedCities] = useState([]);

  useEffect(() => {
    if (companyProfile) {
      setProfile(companyProfile);
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
        hr_managers: companyProfile.hr_managers || [],
        company_values: companyProfile.company_values || [],
        company_commitments: companyProfile.company_commitments || [],
        logo: companyProfile.logo || null,
        media_gallery: companyProfile.media_gallery || []
      });
    }
  }, [companyProfile]);

  // États pour la validation et UX
  const [errors, setErrors] = useState({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [validationStatus, setValidationStatus] = useState({
    basicInfo: false,
    contact: false,
    location: false,
    complete: false
  });

  // Fonction de validation
  const validateForm = () => {
    const newErrors = {};
    
    // Validation informations de base
    if (!formData.company_name?.trim()) {
      newErrors.company_name = 'Le nom de l\'entreprise est obligatoire';
    }
    
    if (!formData.short_description?.trim()) {
      newErrors.short_description = 'Une description courte est requise';
    } else if (formData.short_description.length < 20) {
      newErrors.short_description = 'La description doit faire au moins 20 caractères';
    }
    
    if (!formData.sector) {
      newErrors.sector = 'Veuillez sélectionner un secteur d\'activité';
    }
    
    if (!formData.company_size) {
      newErrors.company_size = 'Veuillez indiquer la taille de votre entreprise';
    }
    
    // Validation contact
    if (formData.hr_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.hr_email)) {
      newErrors.hr_email = 'Format d\'email invalide';
    }
    
    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'L\'URL doit commencer par http:// ou https://';
    }
    
    // Validation localisation
    if (!formData.headquarters_city?.trim()) {
      newErrors.headquarters_city = 'La ville du siège est obligatoire';
    }
    
    if (!formData.headquarters_country?.trim()) {
      newErrors.headquarters_country = 'Le pays est obligatoire';
    }
    
    setErrors(newErrors);
    
    // Mettre à jour le statut de validation
    setValidationStatus({
      basicInfo: !newErrors.company_name && !newErrors.short_description && !newErrors.sector && !newErrors.company_size,
      contact: !newErrors.hr_email && !newErrors.website,
      location: !newErrors.headquarters_city && !newErrors.headquarters_country,
      complete: Object.keys(newErrors).length === 0
    });
    
    return Object.keys(newErrors).length === 0;
  };

  // Calculer le pourcentage de complétion du profil
  const calculateCompletionPercentage = () => {
    const requiredFields = [
      'company_name', 'short_description', 'sector', 'company_size',
      'headquarters_city', 'headquarters_country'
    ];
    
    const optionalFields = [
      'long_description', 'website', 'hr_email', 'hr_phone',
      'headquarters_address', 'linkedin'
    ];
    
    let completed = 0;
    const total = requiredFields.length + optionalFields.length;
    
    // Champs obligatoires (poids 2)
    requiredFields.forEach(field => {
      if (formData[field]?.toString().trim()) completed += 2;
    });
    
    // Champs optionnels (poids 1)
    optionalFields.forEach(field => {
      if (formData[field]?.toString().trim()) completed += 1;
    });
    
    // Logo et valeurs (bonus)
    if (formData.logo) completed += 1;
    if (formData.company_values?.length > 0) completed += 1;
    
    return Math.min(Math.round((completed / (total + 2)) * 100), 100);
  };

  // Gestion des changements avec détection de modification
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    setUnsavedChanges(true);
    
    // Validation en temps réel pour certains champs
    if (field === 'hr_email' && value) {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setErrors(prev => ({
        ...prev,
        hr_email: emailValid ? null : 'Format d\'email invalide'
      }));
    }
    
    if (field === 'website' && value && !value.startsWith('http')) {
      setErrors(prev => ({
        ...prev,
        website: 'L\'URL doit commencer par http:// ou https://'
      }));
    } else if (field === 'website') {
      setErrors(prev => ({
        ...prev,
        website: null
      }));
    }
  };

  const handleArrayAdd = (field, value, setter) => {
    if (value.trim()) {
      handleInputChange(field, [...formData[field], value.trim()]);
      setter('');
    }
  };

  const handleArrayRemove = (field, index) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    handleInputChange(field, newArray);
  };

  // États pour la validation et UX
  const [errors, setErrors] = useState({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [validationStatus, setValidationStatus] = useState({
    basicInfo: false,
    contact: false,
    location: false,
    complete: false
  });

  // Fonction de validation
  const validateForm = () => {
    const newErrors = {};
    
    // Validation informations de base
    if (!formData.company_name?.trim()) {
      newErrors.company_name = 'Le nom de l\'entreprise est obligatoire';
    }
    
    if (!formData.short_description?.trim()) {
      newErrors.short_description = 'Une description courte est requise';
    } else if (formData.short_description.length < 20) {
      newErrors.short_description = 'La description doit faire au moins 20 caractères';
    }
    
    if (!formData.sector) {
      newErrors.sector = 'Veuillez sélectionner un secteur d\'activité';
    }
    
    if (!formData.company_size) {
      newErrors.company_size = 'Veuillez indiquer la taille de votre entreprise';
    }
    
    // Validation contact
    if (formData.hr_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.hr_email)) {
      newErrors.hr_email = 'Format d\'email invalide';
    }
    
    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'L\'URL doit commencer par http:// ou https://';
    }
    
    // Validation localisation
    if (!formData.headquarters_city?.trim()) {
      newErrors.headquarters_city = 'La ville du siège est obligatoire';
    }
    
    if (!formData.headquarters_country?.trim()) {
      newErrors.headquarters_country = 'Le pays est obligatoire';
    }
    
    setErrors(newErrors);
    
    // Mettre à jour le statut de validation
    setValidationStatus({
      basicInfo: !newErrors.company_name && !newErrors.short_description && !newErrors.sector && !newErrors.company_size,
      contact: !newErrors.hr_email && !newErrors.website,
      location: !newErrors.headquarters_city && !newErrors.headquarters_country,
      complete: Object.keys(newErrors).length === 0
    });
    
    return Object.keys(newErrors).length === 0;
  };

  // Fonction de sauvegarde améliorée
  const handleSave = async () => {
    // Validation avant sauvegarde
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs avant de sauvegarder');
      return;
    }
    
    // Vérification des changements
    if (!unsavedChanges) {
      toast.info('Aucune modification à sauvegarder');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Préparer les données pour l'API
      const profileData = {
        ...profile,
        ...formData,
        updated_at: new Date().toISOString(),
        // Calculer le pourcentage de complétion
        completion_percentage: calculateCompletionPercentage()
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
        setProfile(updatedProfile);
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
      toast.error(`Erreur lors de la sauvegarde: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Calculer le pourcentage de complétion du profil
  const calculateCompletionPercentage = () => {
    const requiredFields = [
      'company_name', 'short_description', 'sector', 'company_size',
      'headquarters_city', 'headquarters_country'
    ];
    
    const optionalFields = [
      'long_description', 'website', 'hr_email', 'hr_phone',
      'headquarters_address', 'linkedin'
    ];
    
    let completed = 0;
    const total = requiredFields.length + optionalFields.length;
    
    // Champs obligatoires (poids 2)
    requiredFields.forEach(field => {
      if (formData[field]?.toString().trim()) completed += 2;
    });
    
    // Champs optionnels (poids 1)
    optionalFields.forEach(field => {
      if (formData[field]?.toString().trim()) completed += 1;
    });
    
    // Logo et valeurs (bonus)
    if (formData.logo) completed += 1;
    if (formData.company_values?.length > 0) completed += 1;
    
    return Math.min(Math.round((completed / (total + 2)) * 100), 100);
  };

  // Gestion des changements avec détection de modification
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    setUnsavedChanges(true);
    
    // Validation en temps réel pour certains champs
    if (field === 'hr_email' && value) {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setErrors(prev => ({
        ...prev,
        hr_email: emailValid ? null : 'Format d\'email invalide'
      }));
    }
    
    if (field === 'website' && value && !value.startsWith('http')) {
      setErrors(prev => ({
        ...prev,
        website: 'L\'URL doit commencer par http:// ou https://'
      }));
    } else if (field === 'website') {
      setErrors(prev => ({
        ...prev,
        website: null
      }));
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Ici on pourrait implémenter l'upload réel
      // Pour l'instant, on simule
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('logo', {
          url: e.target.result,
          filename: file.name,
          size: file.size
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Building className="h-4 w-4 mr-2" />
            Aperçu
          </TabsTrigger>
          <TabsTrigger value="details">
            <Edit3 className="h-4 w-4 mr-2" />
            Détails
          </TabsTrigger>
          <TabsTrigger value="location">
            <MapPin className="h-4 w-4 mr-2" />
            Localisation
          </TabsTrigger>
          <TabsTrigger value="media">
            <Camera className="h-4 w-4 mr-2" />
            Média
          </TabsTrigger>
        </TabsList>

        {/* Onglet Aperçu */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Informations principales de votre entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name">Nom de l'entreprise *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    placeholder="Nom de votre entreprise"
                  />
                </div>
                <div>
                  <Label htmlFor="sector">Secteur d'activité *</Label>
                  <select
                    id="sector"
                    value={formData.sector}
                    onChange={(e) => handleInputChange('sector', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionnez un secteur</option>
                    {SECTORS_LIST.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="short_description">Description courte</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  placeholder="Décrivez votre entreprise en quelques mots (150 caractères max)"
                  maxLength={150}
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.short_description?.length || 0}/150 caractères
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_size">Taille de l'entreprise</Label>
                  <select
                    id="company_size"
                    value={formData.company_size}
                    onChange={(e) => handleInputChange('company_size', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionnez la taille</option>
                    {COMPANY_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://www.votre-site.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact RH</CardTitle>
              <CardDescription>Informations de contact pour les candidats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hr_email">Email RH</Label>
                  <Input
                    id="hr_email"
                    type="email"
                    value={formData.hr_email}
                    onChange={(e) => handleInputChange('hr_email', e.target.value)}
                    placeholder="rh@votre-entreprise.com"
                  />
                </div>
                <div>
                  <Label htmlFor="hr_phone">Téléphone RH</Label>
                  <Input
                    id="hr_phone"
                    type="tel"
                    value={formData.hr_phone}
                    onChange={(e) => handleInputChange('hr_phone', e.target.value)}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>
            </CardContent>  
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Réseaux sociaux</CardTitle>
              <CardDescription>Liens vers vos profils sociaux</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/votre-entreprise"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter/X</Label>
                  <Input
                    id="twitter"
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/votre-entreprise"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    type="url"
                    value={formData.facebook}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/votre-entreprise"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/votre-entreprise"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Détails */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description détaillée</CardTitle>
              <CardDescription>Présentez votre entreprise en détail</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="long_description">Description complète</Label>
              <Textarea
                id="long_description"
                value={formData.long_description}
                onChange={(e) => handleInputChange('long_description', e.target.value)}
                placeholder="Décrivez votre entreprise, vos activités, votre histoire, vos projets..."
                rows={8}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Valeurs et engagements</CardTitle>
              <CardDescription>Les valeurs qui définissent votre entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Valeurs */}
              <div>
                <Label>Valeurs de l'entreprise</Label>
                <div className="mt-2 space-y-2">
                  <div className="max-h-40 overflow-y-auto border rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {COMPANY_VALUES.map((value) => (
                        <label key={value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.company_values.includes(value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange('company_values', [...formData.company_values, value]);
                              } else {
                                handleInputChange('company_values', formData.company_values.filter(v => v !== value));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{value}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.company_values.map((value, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {value}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleArrayRemove('company_values', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Engagements */}
              <div>
                <Label>Engagements</Label>
                <div className="mt-2 space-y-2">
                  <div className="max-h-40 overflow-y-auto border rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {COMPANY_COMMITMENTS.map((commitment) => (
                        <label key={commitment} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.company_commitments.includes(commitment)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange('company_commitments', [...formData.company_commitments, commitment]);
                              } else {
                                handleInputChange('company_commitments', formData.company_commitments.filter(c => c !== commitment));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{commitment}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.company_commitments.map((commitment, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {commitment}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleArrayRemove('company_commitments', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Localisation */}
        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Siège social</CardTitle>
              <CardDescription>Adresse principale de votre entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="headquarters_address">Adresse</Label>
                <Input
                  id="headquarters_address"
                  value={formData.headquarters_address}
                  onChange={(e) => handleInputChange('headquarters_address', e.target.value)}
                  placeholder="123 Avenue des Champs-Élysées"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Code postal avec auto-complétion */}
                <div className="relative">
                  <Label htmlFor="headquarters_postal_code">Code postal</Label>
                  <Input
                    id="headquarters_postal_code"
                    value={formData.headquarters_postal_code}
                    onChange={(e) => {
                      const postalCode = e.target.value;
                      handleInputChange('headquarters_postal_code', postalCode);
                      
                      // Système d'auto-complétion identique à l'espace étudiant
                      const cityMap = {
                        // Paris
                        '75001': 'Paris 1er', '75002': 'Paris 2e', '75003': 'Paris 3e', '75004': 'Paris 4e',
                        '75005': 'Paris 5e', '75006': 'Paris 6e', '75007': 'Paris 7e', '75008': 'Paris 8e',
                        '75009': 'Paris 9e', '75010': 'Paris 10e', '75011': 'Paris 11e', '75012': 'Paris 12e',
                        '75013': 'Paris 13e', '75014': 'Paris 14e', '75015': 'Paris 15e', '75016': 'Paris 16e',
                        '75017': 'Paris 17e', '75018': 'Paris 18e', '75019': 'Paris 19e', '75020': 'Paris 20e',
                        
                        // Lyon  
                        '69001': 'Lyon 1er', '69002': 'Lyon 2e', '69003': 'Lyon 3e', '69004': 'Lyon 4e',
                        '69005': 'Lyon 5e', '69006': 'Lyon 6e', '69007': 'Lyon 7e', '69008': 'Lyon 8e', 
                        '69009': 'Lyon 9e', '69100': 'Villeurbanne', '69200': 'Vénissieux', '69300': 'Caluire-et-Cuire',
                        
                        // Marseille
                        '13001': 'Marseille 1er', '13002': 'Marseille 2e', '13003': 'Marseille 3e', '13004': 'Marseille 4e',
                        '13005': 'Marseille 5e', '13006': 'Marseille 6e', '13007': 'Marseille 7e', '13008': 'Marseille 8e',
                        '13009': 'Marseille 9e', '13010': 'Marseille 10e', '13011': 'Marseille 11e', '13012': 'Marseille 12e',
                        '13013': 'Marseille 13e', '13014': 'Marseille 14e', '13015': 'Marseille 15e', '13016': 'Marseille 16e',
                        '13100': 'Aix-en-Provence', '13200': 'Arles', '13300': 'Salon-de-Provence',
                        
                        // Pas-de-Calais (62)
                        '62000': 'Arras', '62100': 'Calais', '62200': 'Boulogne-sur-Mer', '62230': 'Outreau',
                        '62300': 'Lens', '62400': 'Béthune', '62500': 'Saint-Venant', '62600': 'Berck',
                        '62700': 'Bruay-la-Buissière', '62800': 'Liévin', '62900': 'Anguères',
                        
                        // Grandes villes
                        '33000': 'Bordeaux', '33100': 'Arcachon', '33200': 'Bordeaux', '33300': 'Bordeaux',
                        '31000': 'Toulouse', '31100': 'Toulouse', '31200': 'Toulouse', '31300': 'Toulouse',
                        '59000': 'Lille', '59100': 'Roubaix', '59200': 'Tourcoing', '59300': 'Valenciennes',
                        '67000': 'Strasbourg', '67100': 'Strasbourg', '67200': 'Strasbourg',
                        '44000': 'Nantes', '44100': 'Nantes', '44200': 'Nantes', '44300': 'Nantes',
                        '34000': 'Montpellier', '34100': 'Montpellier', '34200': 'Sète', '34300': 'Agde',
                        '35000': 'Rennes', '35100': 'Rennes', '35200': 'Rennes', '35300': 'Fougères',
                        '06000': 'Nice', '06100': 'Nice', '06200': 'Nice', '06300': 'Nice', '06400': 'Cannes',
                        '54000': 'Nancy', '57000': 'Metz', '21000': 'Dijon', '87000': 'Limoges',
                        '51000': 'Reims', '76000': 'Rouen', '80000': 'Amiens', '25000': 'Besançon'
                      };
                      
                      // Auto-complétion automatique dès que le code postal exact est trouvé
                      if (cityMap[postalCode]) {
                        handleInputChange('headquarters_city', cityMap[postalCode]);
                      }
                      
                      // Suggestions pour codes partiels (2+ chiffres)
                      if (postalCode.length >= 2) {
                        const matchingCities = [];
                        Object.entries(cityMap).forEach(([code, city]) => {
                          if (code.startsWith(postalCode)) {
                            matchingCities.push({ code, city });
                          }
                        });
                        
                        setSuggestedCities(matchingCities.slice(0, 10));
                        setShowCitySuggestions(matchingCities.length > 0);
                      } else {
                        setShowCitySuggestions(false);
                        setSuggestedCities([]);
                        if (postalCode.length === 0) {
                          handleInputChange('headquarters_city', '');
                        }
                      }
                    }}
                    placeholder="75008"
                  />
                  
                  {/* Suggestions de villes */}
                  {showCitySuggestions && suggestedCities.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                      {suggestedCities.map(({ code, city }, index) => (
                        <button
                          key={index}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex justify-between items-center"
                          onClick={() => {
                            handleInputChange('headquarters_postal_code', code);
                            handleInputChange('headquarters_city', city);
                            setShowCitySuggestions(false);
                          }}
                        >
                          <span className="font-medium">{city}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="headquarters_city">Ville</Label>
                  <Input
                    id="headquarters_city"
                    value={formData.headquarters_city}
                    onChange={(e) => handleInputChange('headquarters_city', e.target.value)}
                    placeholder="Paris"
                  />
                </div>
                
                <div>
                  <Label htmlFor="headquarters_country">Pays</Label>
                  <Input
                    id="headquarters_country"
                    value={formData.headquarters_country}
                    onChange={(e) => handleInputChange('headquarters_country', e.target.value)}
                    placeholder="France"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Média */}
        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo de l'entreprise</CardTitle>
              <CardDescription>Ajoutez votre logo (recommandé : format carré, PNG/JPG)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                {formData.logo ? (
                  <div className="flex items-center space-x-4">
                    <img
                      src={formData.logo.url}
                      alt="Logo entreprise"
                      className="h-16 w-16 rounded-lg object-cover border"
                    />
                    <div>
                      <p className="text-sm font-medium">{formData.logo.filename}</p>
                      <p className="text-xs text-gray-500">
                        {(formData.logo.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('logo', null)}
                    >
                      Supprimer
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Cliquez pour ajouter un logo</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Galerie média</CardTitle>
              <CardDescription>Photos de vos locaux, équipes, événements... (bientôt disponible)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Galerie média en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bouton de sauvegarde fixe */}
      <div className="sticky bottom-4 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="shadow-lg"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder le profil
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EnhancedCompanyProfile;