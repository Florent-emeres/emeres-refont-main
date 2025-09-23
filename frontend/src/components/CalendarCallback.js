import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, Loader2, Calendar, ArrowRight } from 'lucide-react';
import EmeresButton from './ui/EmeresButton';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CalendarCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('');
  const [provider, setProvider] = useState('');
  
  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      
      // Detect provider from URL or state
      const urlProvider = window.location.pathname.includes('google') ? 'google' : 'outlook';
      setProvider(urlProvider);
      
      if (error) {
        setStatus('error');
        setMessage(`Erreur d'autorisation: ${error}`);
        return;
      }
      
      if (!code) {
        setStatus('error');
        setMessage('Code d\'autorisation manquant');
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        const redirectUri = `${window.location.origin}/calendar/callback`;
        
        const response = await fetch(`${BACKEND_URL}/api/calendar/auth/${urlProvider}/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            provider: urlProvider,
            code: code,
            redirect_uri: redirectUri
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setStatus('success');
          setMessage(data.message || `${urlProvider} Calendar connecté avec succès !`);
          
          // Redirect after 3 seconds
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.detail || 'Erreur lors de la connexion du calendrier');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Erreur de connexion au serveur');
        console.error('Calendar callback error:', error);
      }
    };
    
    processCallback();
  }, [searchParams, navigate]);
  
  const getProviderName = (provider) => {
    switch (provider) {
      case 'google':
        return 'Google Calendar';
      case 'outlook':
        return 'Outlook Calendar';
      default:
        return 'Calendar';
    }
  };
  
  const getProviderColor = (provider) => {
    switch (provider) {
      case 'google':
        return 'from-red-500 to-orange-500';
      case 'outlook':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
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
              {status === 'processing' && <Loader2 className="h-6 w-6 animate-spin text-blue-600" />}
              {status === 'success' && <CheckCircle className="h-6 w-6 text-green-600" />}
              {status === 'error' && <XCircle className="h-6 w-6 text-red-600" />}
              
              {status === 'processing' && 'Connexion en cours...'}
              {status === 'success' && 'Calendrier connecté !'}
              {status === 'error' && 'Erreur de connexion'}
            </CardTitle>
            <CardDescription>
              {status === 'processing' && `Connexion à ${getProviderName(provider)} en cours`}
              {status === 'success' && `${getProviderName(provider)} est maintenant synchronisé`}
              {status === 'error' && 'Impossible de connecter votre calendrier'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {status === 'processing' && (
              <div className="text-center py-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div className={`w-8 h-8 bg-gradient-to-r ${getProviderColor(provider)} rounded-lg flex items-center justify-center`}>
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
                <p className="text-gray-600">
                  Finalisation de la connexion avec {getProviderName(provider)}...
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
                
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-4 border border-teal-200">
                  <div className="text-center">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getProviderColor(provider)} rounded-xl mx-auto mb-3 flex items-center justify-center`}>
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-teal-900 mb-2">
                      {getProviderName(provider)} connecté !
                    </h3>
                    <p className="text-sm text-teal-700 mb-3">
                      Vos événements seront maintenant synchronisés automatiquement.
                    </p>
                    <div className="text-xs text-teal-600">
                      Redirection automatique dans 3 secondes...
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <EmeresButton
                    onClick={() => navigate('/dashboard')}
                    className="w-full h-12 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                  >
                    <div className="flex items-center gap-2">
                      <span>Aller au dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
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
                    onClick={() => navigate('/dashboard')}
                    className="w-full h-12 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                  >
                    Retour au dashboard
                  </EmeresButton>
                  
                  <EmeresButton
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="w-full h-12"
                  >
                    Réessayer
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

export default CalendarCallback;