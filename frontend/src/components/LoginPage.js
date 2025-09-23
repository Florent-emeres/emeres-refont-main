import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import EmeresButton from './ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from './ui/EmeresCard';
import EmeresInput from './ui/EmeresInput';
import { Eye, EyeOff, LogIn, UserPlus, ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../App';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // AuthContext handles redirection via the Dashboard component
        navigate('/dashboard');
      } else {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image subtile avec contraste élevé */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-8"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1606248896999-387b3a9f621c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      {/* Overlay pour maintenir le contraste */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50/80 via-gray-100/80 to-gray-50/80" />
      
      <div className="w-full max-w-md relative z-10">
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
          <p className="text-gray-600">Connectez-vous à votre espace</p>
        </div>

        <EmeresCard variant="elevated" className="backdrop-blur-sm bg-white/90">
          <EmeresCardHeader className="text-center">
            <EmeresCardTitle className="text-2xl font-bold text-gray-900">
              Connexion
            </EmeresCardTitle>
            <EmeresCardDescription>
              Accédez à votre tableau de bord personnalisé
            </EmeresCardDescription>
          </EmeresCardHeader>
          
          <EmeresCardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                    Adresse e-mail
                  </Label>
                  <EmeresInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail className="h-4 w-4 text-gray-400" />}
                    required
                    className="h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <EmeresInput
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
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
                </div>
              </div>

              <div className="space-y-4">
                <EmeresButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  loadingtext="Connexion..."
                  fullWidth
                  className="h-12 font-semibold"
                  icon={<LogIn />}
                >
                  Se connecter
                </EmeresButton>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">ou</span>
                  </div>
                </div>

                <EmeresButton
                  type="button"
                  variant="secondary"
                  size="lg"
                  fullWidth
                  className="h-12"
                  icon={<UserPlus />}
                  onClick={() => navigate('/register')}
                >
                  Créer un compte
                </EmeresButton>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-teal-600 hover:text-teal-700 transition-colors font-medium"
                  onClick={() => alert('Fonctionnalité bientôt disponible')}
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </form>
          </EmeresCardContent>
        </EmeresCard>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Première fois sur ÉMÉRÉS ?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-teal-600 hover:text-teal-700 font-medium transition-colors inline-flex items-center gap-1"
            >
              Découvrir la plateforme
              <ArrowRight className="h-3 w-3" />
            </button>
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© 2024 ÉMÉRÉS. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;