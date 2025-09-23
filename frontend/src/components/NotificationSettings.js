import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Bell, 
  BellOff, 
  Smartphone, 
  Monitor, 
  Mail, 
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TestTube,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import EmeresButton from './ui/EmeresButton';
import EmeresBadge from './ui/EmeresBadge';
import useNotifications from '../hooks/useNotifications';
import { useAuth } from '../App';

const NotificationSettings = () => {
  const { user } = useAuth();
  const {
    isSupported,
    isSubscribed,
    permission,
    error,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification
  } = useNotifications(user);

  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleSubscribe = async () => {
    const success = await subscribe();
    if (success) {
      setTestResult({ type: 'success', message: 'Notifications push activées avec succès !' });
    }
  };

  const handleUnsubscribe = async () => {
    const success = await unsubscribe();
    if (success) {
      setTestResult({ type: 'success', message: 'Notifications push désactivées' });
    }
  };

  const handleTest = async () => {
    setTestLoading(true);
    setTestResult(null);
    
    const success = await sendTestNotification();
    
    setTestLoading(false);
    setTestResult({
      type: success ? 'success' : 'error',
      message: success 
        ? 'Notification test envoyée ! Vérifiez vos notifications.' 
        : 'Erreur lors de l\'envoi du test'
    });
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { icon: CheckCircle, color: 'text-green-600', text: 'Autorisées', badge: 'success' };
      case 'denied':
        return { icon: XCircle, color: 'text-red-600', text: 'Refusées', badge: 'destructive' };
      default:
        return { icon: AlertTriangle, color: 'text-amber-600', text: 'En attente', badge: 'warning' };
    }
  };

  const permissionStatus = getPermissionStatus();
  const PermissionIcon = permissionStatus.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
          <Bell className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications Push</h2>
          <p className="text-gray-600">Gérez vos préférences de notifications</p>
        </div>
      </div>

      {/* Support Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Compatibilité
          </CardTitle>
          <CardDescription>
            État du support des notifications push sur votre appareil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Support navigateur</span>
              </div>
              <EmeresBadge variant={isSupported ? 'success' : 'destructive'}>
                {isSupported ? 'Supporté' : 'Non supporté'}
              </EmeresBadge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <PermissionIcon className={`h-5 w-5 ${permissionStatus.color}`} />
                <span className="font-medium">Permissions</span>
              </div>
              <EmeresBadge variant={permissionStatus.badge}>
                {permissionStatus.text}
              </EmeresBadge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Abonnement</span>
              </div>
              <EmeresBadge variant={isSubscribed ? 'success' : 'secondary'}>
                {isSubscribed ? 'Actif' : 'Inactif'}
              </EmeresBadge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Test Result */}
      {testResult && (
        <Alert variant={testResult.type === 'success' ? 'default' : 'destructive'}>
          {testResult.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertDescription>{testResult.message}</AlertDescription>
        </Alert>
      )}

      {/* Main Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration
          </CardTitle>
          <CardDescription>
            Activez ou désactivez les notifications push
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isSupported ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Votre navigateur ne supporte pas les notifications push. 
                  Veuillez utiliser un navigateur moderne comme Chrome, Firefox ou Safari.
                </AlertDescription>
              </Alert>
            ) : permission === 'denied' ? (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Les notifications ont été refusées. Vous devez autoriser les notifications 
                  dans les paramètres de votre navigateur pour recevoir les notifications push.
                </AlertDescription>
              </Alert>
            ) : !isSubscribed ? (
              <div className="space-y-4">
                <Alert>
                  <Bell className="h-4 w-4" />
                  <AlertDescription>
                    Activez les notifications push pour recevoir des alertes instantanées 
                    sur vos candidatures, messages de mentors, et autres événements importants.
                  </AlertDescription>
                </Alert>
                
                <EmeresButton
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Activer les notifications push
                </EmeresButton>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Les notifications push sont activées ! Vous recevrez des alertes 
                    instantanées pour vos activités importantes sur ÉMÉRÉS.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <EmeresButton
                    onClick={handleTest}
                    variant="outline"
                    disabled={testLoading}
                    className="flex items-center gap-2"
                  >
                    <TestTube className="h-4 w-4" />
                    {testLoading ? 'Test en cours...' : 'Tester les notifications'}
                  </EmeresButton>
                  
                  <EmeresButton
                    onClick={handleUnsubscribe}
                    variant="outline"
                    className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <BellOff className="h-4 w-4" />
                    Désactiver
                  </EmeresButton>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Types de notifications
          </CardTitle>
          <CardDescription>
            Types de notifications que vous recevrez
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-900">Messages de mentorat</div>
                <div className="text-sm text-blue-700">Nouveaux messages de vos mentors</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-green-900">Réponses aux candidatures</div>
                <div className="text-sm text-green-700">Statut de vos candidatures mis à jour</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Mail className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium text-purple-900">Nouvelles offres</div>
                <div className="text-sm text-purple-700">Offres correspondant à votre profil</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;