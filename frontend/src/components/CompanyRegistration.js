import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Building, User, Mail, Lock, FileText, Check, X, AlertCircle, Shield, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from './hooks/use-toast';

const CompanyRegistration = ({ onRegistrationSuccess }) => {
  const { toast } = useToast();
  
  // États du formulaire
  const [formData, setFormData] = useState({
    // Informations utilisateur
    first_name: '',
    last_name: '',
    job_title: '',
    email: '',
    email_confirmation: '',
    password: '',
    password_confirmation: '',
    
    // Informations entreprise
    company_name: '',
    sector: '',
    siret_siren: '',
    vat_number: '',
    
    // Consentements RGPD
    accepts_terms: false,
    authorized_to_create: false,
    accepts_partner_communications: false
  });
  
  // États de validation en temps réel
  const [verifications, setVerifications] = useState({
    siret: { status: 'idle', data: null }, // idle, checking, valid, invalid
    vat: { status: 'idle', data: null },
    email: { status: 'idle', data: null }
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Infos personnelles, 2: Entreprise, 3: Consentements
  
  // Secteurs d'activité
  const sectors = [
    'Informatique & Digital',
    'Commerce & Vente',
    'Industrie & Manufacturing',
    'Santé & Pharmaceutique',
    'Finance & Banque',
    'BTP & Construction',
    'Transport & Logistique',
    'Éducation & Formation',
    'Tourisme & Hôtellerie',
    'Média & Communication',
    'Énergie & Environnement',
    'Conseil & Services',
    'Agriculture & Agroalimentaire',
    'Autre'
  ];
  
  // Gestion des changements de formulaire
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Nettoyer les erreurs du champ modifié
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Vérification SIRET/SIREN en temps réel
  const verifySiret = async (siret_siren) => {
    if (!siret_siren || siret_siren.length < 9) {
      setVerifications(prev => ({ ...prev, siret: { status: 'idle', data: null } }));
      return;
    }
    
    setVerifications(prev => ({ ...prev, siret: { status: 'checking', data: null } }));
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/company/verify-siret`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siret_siren })
      });
      
      const result = await response.json();
      
      setVerifications(prev => ({
        ...prev,
        siret: {
          status: result.valid ? 'valid' : 'invalid',
          data: result
        }
      }));
      
      // Auto-remplir le nom d'entreprise si trouvé
      if (result.valid && result.company_name && !formData.company_name) {
        handleInputChange('company_name', result.company_name);
      }
      
    } catch (error) {
      setVerifications(prev => ({
        ...prev,
        siret: { status: 'invalid', data: { error: 'Erreur de vérification' } }
      }));
    }
  };
  
  // Vérification TVA
  const verifyVat = async (vat_number) => {
    if (!vat_number) {
      setVerifications(prev => ({ ...prev, vat: { status: 'idle', data: null } }));
      return;
    }
    
    setVerifications(prev => ({ ...prev, vat: { status: 'checking', data: null } }));
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/company/verify-vat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vat_number })
      });
      
      const result = await response.json();
      
      setVerifications(prev => ({
        ...prev,
        vat: {
          status: result.valid ? 'valid' : 'invalid',
          data: result
        }
      }));
      
    } catch (error) {
      setVerifications(prev => ({
        ...prev,
        vat: { status: 'invalid', data: { error: 'Erreur de vérification' } }
      }));
    }
  };
  
  // Vérification email professionnel
  const verifyEmail = async (email, company_name) => {
    if (!email || !email.includes('@')) {
      setVerifications(prev => ({ ...prev, email: { status: 'idle', data: null } }));
      return;
    }
    
    setVerifications(prev => ({ ...prev, email: { status: 'checking', data: null } }));
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/company/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company_name })
      });
      
      const result = await response.json();
      
      setVerifications(prev => ({
        ...prev,
        email: {
          status: result.valid ? 'valid' : 'invalid',
          data: result
        }
      }));
      
    } catch (error) {
      setVerifications(prev => ({
        ...prev,
        email: { status: 'invalid', data: { error: 'Erreur de vérification' } }
      }));
    }
  };
  
  // Effets pour vérifications en temps réel (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.siret_siren) {
        verifySiret(formData.siret_siren);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData.siret_siren]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.vat_number) {
        verifyVat(formData.vat_number);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData.vat_number]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.email && formData.company_name) {
        verifyEmail(formData.email, formData.company_name);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData.email, formData.company_name]);
  
  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Étape 1 : Informations personnelles
    if (!formData.first_name.trim()) newErrors.first_name = 'Prénom requis';
    if (!formData.last_name.trim()) newErrors.last_name = 'Nom requis';
    if (!formData.email.trim()) newErrors.email = 'Email requis';
    if (!formData.email_confirmation.trim()) newErrors.email_confirmation = 'Confirmation email requise';
    if (formData.email !== formData.email_confirmation) newErrors.email_confirmation = 'Les emails ne correspondent pas';
    if (!formData.password) newErrors.password = 'Mot de passe requis';
    if (formData.password.length < 8) newErrors.password = 'Mot de passe trop court (8 caractères minimum)';
    if (!formData.password_confirmation) newErrors.password_confirmation = 'Confirmation mot de passe requise';
    if (formData.password !== formData.password_confirmation) newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
    
    // Étape 2 : Informations entreprise
    if (!formData.company_name.trim()) newErrors.company_name = 'Nom d\'entreprise requis';
    if (!formData.sector) newErrors.sector = 'Secteur d\'activité requis';
    if (!formData.siret_siren.trim()) newErrors.siret_siren = 'SIRET/SIREN requis';
    
    // Étape 3 : Consentements obligatoires
    if (!formData.accepts_terms) newErrors.accepts_terms = 'Acceptation des CGU requise';
    if (!formData.authorized_to_create) newErrors.authorized_to_create = 'Autorisation requise';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/company/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de l\'inscription');
      }
      
      const result = await response.json();
      
      toast.success('Inscription réussie ! Bienvenue sur ÉMÉRÉS 🎉');
      
      // Callback avec résultat d'inscription
      if (onRegistrationSuccess) {
        onRegistrationSuccess(result);
      }
      
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };
  
  // Composant badge de vérification
  const VerificationBadge = ({ status, data, type }) => {
    if (status === 'idle') return null;
    
    if (status === 'checking') {
      return (
        <div className="flex items-center space-x-1 text-blue-600 text-xs">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Vérification...</span>
        </div>
      );
    }
    
    if (status === 'valid') {
      return (
        <div className="flex items-center space-x-1 text-green-600 text-xs">
          <Check className="h-3 w-3" />
          <span>
            {type === 'siret' && data?.source === 'insee_api' && 'Vérifié INSEE'}
            {type === 'siret' && data?.source === 'mock' && 'Validé (test)'}
            {type === 'vat' && 'TVA valide'}
            {type === 'email' && (data?.professional ? 'Email professionnel' : 'Email valide')}
          </span>
        </div>
      );
    }
    
    if (status === 'invalid') {
      return (
        <div className="flex items-center space-x-1 text-red-600 text-xs">
          <X className="h-3 w-3" />
          <span>{data?.error || 'Invalide'}</span>
        </div>
      );
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-gray-50 relative overflow-hidden">
      {/* Background décoratif avec palette ÉMÉRÉS */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200 rounded-full opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-amber-200 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10 max-w-2xl mx-auto p-6">
        <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-2xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 via-emerald-600 to-blue-700 text-white -m-6 mb-6 p-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Building className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">Inscription Entreprise</CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Rejoignez ÉMÉRÉS et accédez aux meilleurs talents étudiants
            </CardDescription>
            
            {/* Indicateur d'étapes stylisé */}
            <div className="flex justify-center space-x-4 mt-8">
              {[1, 2, 3].map(stepNum => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step >= stepNum 
                      ? 'bg-white text-blue-600 shadow-lg transform scale-110' 
                      : 'bg-white/30 text-white/70 backdrop-blur-sm'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-16 h-1 mx-3 rounded-full transition-all duration-300 ${
                      step > stepNum ? 'bg-white' : 'bg-white/30'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-white/90 mt-4 font-medium">
              {step === 1 && '📋 Informations personnelles'}
              {step === 2 && '🏢 Informations entreprise'}
              {step === 3 && '✅ Consentements et validation'}
            </div>
          </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 p-2">
            
            {/* ÉTAPE 1: Informations personnelles */}
            {step === 1 && (
              <>
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div className="flex items-center space-x-2 mb-4">
                    <User className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-medium">Vos informations</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first_name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        Prénom *
                      </Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="Votre prénom"
                      />
                      {errors.first_name && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.first_name}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last_name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        Nom *
                      </Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="Votre nom"
                      />
                      {errors.last_name && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.last_name}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="job_title">Fonction (optionnel)</Label>
                    <Input
                      id="job_title"
                      placeholder="Ex: Directeur RH, Responsable recrutement..."
                      value={formData.job_title}
                      onChange={(e) => handleInputChange('job_title', e.target.value)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-medium">Email professionnel</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email professionnel *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre.nom@entreprise.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                      <VerificationBadge 
                        status={verifications.email.status} 
                        data={verifications.email.data} 
                        type="email" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email_confirmation">Confirmation email *</Label>
                      <Input
                        id="email_confirmation"
                        type="email"
                        value={formData.email_confirmation}
                        onChange={(e) => handleInputChange('email_confirmation', e.target.value)}
                        className={errors.email_confirmation ? 'border-red-500' : ''}
                      />
                      {errors.email_confirmation && <p className="text-red-500 text-xs">{errors.email_confirmation}</p>}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Lock className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-medium">Mot de passe</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="8 caractères minimum"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={errors.password ? 'border-red-500' : ''}
                      />
                      {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password_confirmation">Confirmation *</Label>
                      <Input
                        id="password_confirmation"
                        type="password"
                        value={formData.password_confirmation}
                        onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                        className={errors.password_confirmation ? 'border-red-500' : ''}
                      />
                      {errors.password_confirmation && <p className="text-red-500 text-xs">{errors.password_confirmation}</p>}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setStep(2)}
                    disabled={!formData.first_name || !formData.last_name || !formData.email || !formData.email_confirmation || !formData.password || !formData.password_confirmation}
                  >
                    Suivant
                  </Button>
                </div>
              </>
            )}
            
            {/* ÉTAPE 2: Informations entreprise */}
            {step === 2 && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Building className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-medium">Votre entreprise</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Nom de l'entreprise (raison sociale) *</Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                        className={errors.company_name ? 'border-red-500' : ''}
                      />
                      {errors.company_name && <p className="text-red-500 text-xs">{errors.company_name}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sector">Secteur d'activité *</Label>
                      <Select value={formData.sector} onValueChange={(value) => handleInputChange('sector', value)}>
                        <SelectTrigger className={errors.sector ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Sélectionnez votre secteur" />
                        </SelectTrigger>
                        <SelectContent>
                          {sectors.map(sector => (
                            <SelectItem key={sector} value={sector}>
                              {sector}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.sector && <p className="text-red-500 text-xs">{errors.sector}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="siret_siren">Numéro SIRET/SIREN *</Label>
                      <Input
                        id="siret_siren"
                        placeholder="Ex: 12345678901234"
                        value={formData.siret_siren}
                        onChange={(e) => handleInputChange('siret_siren', e.target.value.replace(/\s/g, ''))}
                        className={errors.siret_siren ? 'border-red-500' : ''}
                      />
                      {errors.siret_siren && <p className="text-red-500 text-xs">{errors.siret_siren}</p>}
                      <VerificationBadge 
                        status={verifications.siret.status} 
                        data={verifications.siret.data} 
                        type="siret" 
                      />
                      {verifications.siret.status === 'valid' && verifications.siret.data?.company_name && (
                        <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                          <p className="font-medium text-green-800">Entreprise trouvée :</p>
                          <p className="text-green-700">{verifications.siret.data.company_name}</p>
                          {verifications.siret.data.activity && (
                            <p className="text-green-600 text-xs mt-1">{verifications.siret.data.activity}</p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vat_number">Numéro TVA intracommunautaire (optionnel)</Label>
                      <Input
                        id="vat_number"
                        placeholder="Ex: FR12345678901"
                        value={formData.vat_number}
                        onChange={(e) => handleInputChange('vat_number', e.target.value.toUpperCase())}
                      />
                      <p className="text-xs text-gray-500">
                        Uniquement pour les entreprises de l'Union Européenne
                      </p>
                      <VerificationBadge 
                        status={verifications.vat.status} 
                        data={verifications.vat.data} 
                        type="vat" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Précédent
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setStep(3)}
                    disabled={!formData.company_name || !formData.sector || !formData.siret_siren}
                  >
                    Suivant
                  </Button>
                </div>
              </>
            )}
            
            {/* ÉTAPE 3: Consentements RGPD */}
            {step === 3 && (
              <>
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-medium">Consentements RGPD</h3>
                  </div>
                  
                  {/* Consentements obligatoires */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <Checkbox
                        id="accepts_terms"
                        checked={formData.accepts_terms}
                        onCheckedChange={(checked) => handleInputChange('accepts_terms', checked)}
                        className={errors.accepts_terms ? 'border-red-500' : ''}
                      />
                      <div className="flex-1">
                        <Label htmlFor="accepts_terms" className="text-sm font-medium cursor-pointer">
                          ✅ J'accepte les Conditions Générales d'Utilisation et la Politique de Confidentialité *
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Obligatoire pour créer votre compte entreprise sur ÉMÉRÉS
                        </p>
                        {errors.accepts_terms && <p className="text-red-500 text-xs mt-1">{errors.accepts_terms}</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <Checkbox
                        id="authorized_to_create"
                        checked={formData.authorized_to_create}
                        onCheckedChange={(checked) => handleInputChange('authorized_to_create', checked)}
                        className={errors.authorized_to_create ? 'border-red-500' : ''}
                      />
                      <div className="flex-1">
                        <Label htmlFor="authorized_to_create" className="text-sm font-medium cursor-pointer">
                          ✅ Je suis autorisé(e) à créer un compte au nom de l'entreprise *
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Je confirme avoir l'autorisation de mon employeur pour créer ce compte professionnel
                        </p>
                        {errors.authorized_to_create && <p className="text-red-500 text-xs mt-1">{errors.authorized_to_create}</p>}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Consentement optionnel */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <Checkbox
                        id="accepts_partner_communications"
                        checked={formData.accepts_partner_communications}
                        onCheckedChange={(checked) => handleInputChange('accepts_partner_communications', checked)}
                      />
                      <div className="flex-1">
                        <Label htmlFor="accepts_partner_communications" className="text-sm font-medium cursor-pointer">
                          ☑️ J'accepte de recevoir des communications de partenaires ÉMÉRÉS (optionnel)
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Événements, webinaires, et opportunités de nos partenaires écoles et plateformes RH
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Informations RGPD */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <h4 className="text-sm font-medium">Vos droits RGPD</h4>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>• Vous pouvez à tout moment accéder, modifier ou supprimer vos données</p>
                      <p>• Vos données ne seront jamais vendues à des tiers</p>
                      <p>• Nous utilisons vos données uniquement pour le service ÉMÉRÉS</p>
                      <p>• Contact data protection : privacy@emeres.com</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Précédent
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading || !formData.accepts_terms || !formData.authorized_to_create}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 via-emerald-600 to-blue-700 hover:from-blue-700 hover:via-emerald-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Inscription en cours...
                      </>
                    ) : (
                      <>
                        <Building className="h-4 w-4" />
                        Créer mon compte entreprise
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default CompanyRegistration;