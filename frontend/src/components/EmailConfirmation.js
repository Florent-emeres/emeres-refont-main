import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';
import EmeresButton from './ui/EmeresButton';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  
  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Token de confirmation manquant');
        return;
      }
      
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/confirm-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email confirmé avec succès !');
          setUserInfo(data.user);
          
          // Store token for automatic login
          if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          
          // Redirect after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.detail || 'Erreur lors de la confirmation');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Erreur de connexion au serveur');
      }
    };
    
    confirmEmail();
  }, [searchParams, navigate]);
  
  const getRoleLabel = (role) => {
    const labels = {
      'student': 'Étudiant',
      'mentor': 'Mentor',
      'company': 'Entreprise', 
      'school': 'École',
      'institution': 'Institution'
    };
    return labels[role] || 'Utilisateur';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
        </div>

        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              {status === 'loading' && <Loader2 className="h-6 w-6 animate-spin text-blue-600" />}
              {status === 'success' && <CheckCircle className="h-6 w-6 text-green-600" />}
              {status === 'error' && <XCircle className="h-6 w-6 text-red-600" />}
              
              {status === 'loading' && 'Confirmation en cours...'}
              {status === 'success' && 'Email confirmé !'}
              {status === 'error' && 'Erreur de confirmation'}
            </CardTitle>
            <CardDescription>
              {status === 'loading' && 'Vérification de votre token de confirmation'}
              {status === 'success' && 'Votre compte a été activé avec succès'}
              {status === 'error' && 'Impossible de confirmer votre email'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {status === 'loading' && (
              <div className="text-center py-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Mail className="h-8 w-8 text-blue-600" />
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
                <p className="text-gray-600">
                  Nous vérifions votre token de confirmation...
                </p>
              </div>
            )}
            
            {status === 'success' && (
              <>
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {message}
                  </AlertDescription>
                </Alert>
                
                {userInfo && (
                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-4 border border-teal-200">
                    <div className="text-center">
                      <h3 className="font-semibold text-teal-900 mb-2">
                        Bienvenue {userInfo.first_name} {userInfo.last_name} !
                      </h3>
                      <p className="text-sm text-teal-700 mb-3">
                        Votre compte <strong>{getRoleLabel(userInfo.role)}</strong> est maintenant actif.
                      </p>
                      <div className="text-xs text-teal-600">
                        Redirection automatique dans 3 secondes...
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <EmeresButton
                    onClick={() => navigate('/login')}
                    className="w-full h-12 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                  >
                    <div className="flex items-center gap-2">
                      <span>Se connecter maintenant</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </EmeresButton>
                  
                  <EmeresButton
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="w-full h-12"
                  >
                    Retour à l'accueil
                  </EmeresButton>
                </div>
              </>
            )}
            
            {status === 'error' && (
              <>
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <EmeresButton
                    onClick={() => navigate('/register')}
                    className="w-full h-12 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                  >
                    Créer un nouveau compte
                  </EmeresButton>
                  
                  <EmeresButton
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="w-full h-12"
                  >
                    Retour à la connexion
                  </EmeresButton>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© 2024 ÉMÉRÉS. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;