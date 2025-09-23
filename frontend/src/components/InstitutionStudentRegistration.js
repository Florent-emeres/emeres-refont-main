import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { 
  UserPlus, 
  ArrowLeft, 
  Mail, 
  User, 
  GraduationCap, 
  BookOpen, 
  MapPin, 
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const InstitutionStudentRegistration = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    student_id: '',
    institution_name: '',
    field_of_study: '',
    education_level: '',
    graduation_year: '',
    campus_location: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const educationLevels = [
    'Bac+1 - Première année post-bac',
    'Bac+2 - BTS/DUT/Licence 2',
    'Bac+3 - Licence/Bachelor',
    'Bac+4 - Master 1/Maîtrise',
    'Bac+5 - Master 2/Ingénieur',
    'Bac+6 et plus - Doctorat/MBA'
  ];

  const fieldsOfStudy = [
    'Commerce/Gestion/Management',
    'Informatique/Numérique',
    'Ingénierie/Sciences',
    'Marketing/Communication',
    'Finance/Comptabilité',
    'Ressources Humaines',
    'Droit/Juridique',
    'Santé/Médical',
    'Arts/Design/Créatif',
    'Éducation/Formation',
    'Langues/International',
    'Autre'
  ];

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 8 }, (_, i) => currentYear + i);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register/student/institution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: 'student',
          registration_type: 'institution'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success('Pré-inscription réussie ! Votre établissement validera votre compte.');
      } else {
        setError(data.detail || 'Erreur lors de la pré-inscription');
        toast.error(data.detail || 'Erreur lors de la pré-inscription');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Erreur de connexion au serveur');
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
            <CardContent className="text-center py-12">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Pré-inscription envoyée !
                </h2>
                <p className="text-gray-600">
                  Votre demande a été transmise à votre établissement pour validation.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-blue-900 mb-2">Prochaines étapes :</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Votre établissement va vérifier vos informations</li>
                  <li>• Vous recevrez un email de confirmation</li>
                  <li>• Vous pourrez alors vous connecter avec vos identifiants</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full"
                  variant="default"
                >
                  Retour à la connexion
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full"
                >
                  Retour à l'accueil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
          <p className="text-gray-600">Inscription étudiant via établissement</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Pré-inscription étudiant
            </CardTitle>
            <CardDescription>
              Créez votre profil étudiant avec validation de votre établissement
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">Prénom *</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="last_name">Nom *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email étudiant *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="prenom.nom@ecole.fr"
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Utilisez votre adresse email institutionnelle
                  </p>
                </div>

                <div>
                  <Label htmlFor="student_id">Numéro étudiant</Label>
                  <Input
                    id="student_id"
                    value={formData.student_id}
                    onChange={(e) => handleInputChange('student_id', e.target.value)}
                    placeholder="Ex: 20241234"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Informations académiques */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Informations académiques
                </h3>

                <div>
                  <Label htmlFor="institution_name">Établissement *</Label>
                  <Input
                    id="institution_name"
                    value={formData.institution_name}
                    onChange={(e) => handleInputChange('institution_name', e.target.value)}
                    placeholder="Nom de votre école/université"
                    required
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="field_of_study">Domaine d'études *</Label>
                    <Select value={formData.field_of_study} onValueChange={(value) => handleInputChange('field_of_study', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionnez votre domaine" />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldsOfStudy.map((field) => (
                          <SelectItem key={field} value={field}>
                            {field}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="education_level">Niveau d'études *</Label>
                    <Select value={formData.education_level} onValueChange={(value) => handleInputChange('education_level', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionnez votre niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="graduation_year">Année de diplôme *</Label>
                    <Select value={formData.graduation_year} onValueChange={(value) => handleInputChange('graduation_year', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Année de fin d'études" />
                      </SelectTrigger>
                      <SelectContent>
                        {graduationYears.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="campus_location">Campus/Localisation</Label>
                    <Input
                      id="campus_location"
                      value={formData.campus_location}
                      onChange={(e) => handleInputChange('campus_location', e.target.value)}
                      placeholder="Ex: Paris, Lyon, Lille..."
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">
                      Validation par votre établissement
                    </h4>
                    <p className="text-sm text-blue-800">
                      Votre inscription sera vérifiée par votre établissement avant activation. 
                      Assurez-vous d'utiliser votre email institutionnel officiel.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 font-semibold"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Envoi en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Envoyer ma pré-inscription
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12"
                  onClick={() => navigate('/register')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux options d'inscription
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

export default InstitutionStudentRegistration;