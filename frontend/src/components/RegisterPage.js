import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';


import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, UserPlus, ArrowLeft, Mail, Lock, User, Building, School, UserCheck, Database, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../App';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [consents, setConsents] = useState({
    terms: false,
    privacy: false,
    marketing: false
  });
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const roles = [
    { value: 'student', label: 'Étudiant', icon: User, description: 'Recherche de stages et alternances' },
    { value: 'company', label: 'Entreprise', icon: Building, description: 'Recrutement et gestion des offres' },
    { value: 'school', label: 'École', icon: School, description: 'Gestion des étudiants et partenariats' },
    { value: 'mentor', label: 'Mentor', icon: UserCheck, description: 'Accompagnement et guidance d\'étudiants' },
    { value: 'institution', label: 'Institution', icon: Database, description: 'Pilotage stratégique et business intelligence' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConsentChange = (type, checked) => {
    setConsents(prev => ({
      ...prev,
      [type]: checked
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!consents.terms || !consents.privacy) {
      setError('Vous devez accepter les conditions générales et la politique de confidentialité');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const registrationData = {
        ...formData,
        consents: {
          terms_accepted: consents.terms,
          privacy_accepted: consents.privacy,
          marketing_accepted: consents.marketing
        }
      };

      const result = await register(registrationData);
      
      if (result.success) {
        // Registration successful, navigate to login
        navigate('/login');
      } else {
        setError(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roles.find(role => role.value === formData.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image subtile avec contraste élevé */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-6"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      {/* Overlay pour maintenir le contraste */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50/90 via-gray-100/90 to-gray-50/90" />
      
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <img 
                src="/emeres-logo.png" 
                alt="ÉMÉRÉS" 
                className="h-16 w-16 object-contain drop-shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div 
                className="h-16 w-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg hidden"
              >
                <span className="text-2xl font-bold text-white">É</span>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-blue-600 mb-2">ÉMÉRÉS</h1>
          <p className="text-gray-600">Créez votre compte et rejoignez notre communauté</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Inscription
            </CardTitle>
            <CardDescription>
              Choisissez votre type de compte pour commencer
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Type de compte *
                </label>
                <select 
                  value={formData.role} 
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full h-12 px-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                  required
                >
                  <option value="" disabled>Sélectionnez votre profil</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="text-sm font-medium text-gray-700 mb-2 block">
                    Prénom *
                  </label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="Votre prénom"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div>
                  <label htmlFor="last_name" className="text-sm font-medium text-gray-700 mb-2 block">
                    Nom *
                  </label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Votre nom"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                  Adresse e-mail *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                  Mot de passe *
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Créez un mot de passe sécurisé"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    className="h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 caractères avec majuscules, minuscules et chiffres
                </p>
              </div>

              {/* Role-specific information preview */}
              {selectedRole && (
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-4 border border-teal-200">
                  <div className="flex items-center gap-3 mb-2">
                    <selectedRole.icon className="h-5 w-5 text-teal-600" />
                    <span className="font-medium text-teal-900">Compte {selectedRole.label}</span>
                  </div>
                  <p className="text-sm text-teal-700">{selectedRole.description}</p>
                </div>
              )}

              {/* Consents */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={consents.terms}
                    onChange={(e) => handleConsentChange('terms', e.target.checked)}
                    className="mt-1 h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                    J'accepte les{' '}
                    <button
                      type="button"
                      className="text-teal-600 hover:text-teal-700 underline"
                      onClick={() => alert('Conditions générales à venir')}
                    >
                      conditions générales d'utilisation
                    </button>
                    {' '}*
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={consents.privacy}
                    onChange={(e) => handleConsentChange('privacy', e.target.checked)}
                    className="mt-1 h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    required
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-700 cursor-pointer">
                    J'accepte la{' '}
                    <button
                      type="button"
                      className="text-teal-600 hover:text-teal-700 underline"
                      onClick={() => alert('Politique de confidentialité à venir')}
                    >
                      politique de confidentialité
                    </button>
                    {' '}*
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="marketing"
                    checked={consents.marketing}
                    onChange={(e) => handleConsentChange('marketing', e.target.checked)}
                    className="mt-1 h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="marketing" className="text-sm text-gray-700 cursor-pointer">
                    J'accepte de recevoir des communications marketing personnalisées
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={loading || !consents.terms || !consents.privacy}
                  className="w-full h-12 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 font-semibold"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Création du compte...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Créer mon compte
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                  onClick={() => navigate('/login')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à la connexion
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© 2024 ÉMÉRÉS. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;