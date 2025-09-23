import React from 'react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Settings, Bell, Shield, Users, Mail, Smartphone, Save, RefreshCw } from 'lucide-react';

const SettingsSection = ({ profileForm, setProfileForm, errors = {}, onSave, loading = false }) => {
  const handleCheckboxChange = (field, checked) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const requiredConsents = ['gdpr_consent', 'terms_accepted', 'profile_sharing_consent'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Paramètres complémentaires</span>
        </CardTitle>
        <CardDescription>
          Préférences de notifications et consentements obligatoires
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Notifications souhaitées */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <Label className="text-sm font-medium">Notifications souhaitées</Label>
          </div>
          <p className="text-sm text-gray-600">
            Choisissez comment vous souhaitez être informé des opportunités et actualités
          </p>
          
          <div className="space-y-4">
            {/* Notifications email */}
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="email_notifications"
                checked={profileForm.email_notifications}
                onCheckedChange={(checked) => handleCheckboxChange('email_notifications', checked)}
              />
              <div className="flex-1">
                <Label htmlFor="email_notifications" className="flex items-center space-x-2 cursor-pointer">
                  <Mail className="h-4 w-4" />
                  <span>Notifications par email</span>
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Offres d'emploi, messages des mentors, actualités ÉMÉRÉS
                </p>
              </div>
            </div>
            
            {/* Notifications SMS */}
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="sms_notifications"
                checked={profileForm.sms_notifications}
                onCheckedChange={(checked) => handleCheckboxChange('sms_notifications', checked)}
              />
              <div className="flex-1">
                <Label htmlFor="sms_notifications" className="flex items-center space-x-2 cursor-pointer">
                  <Smartphone className="h-4 w-4" />
                  <span>Notifications par SMS</span>
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Alertes urgentes uniquement (entretiens, réponses importantes)
                </p>
              </div>
            </div>
            
            {/* Notifications app */}
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="app_notifications"
                checked={profileForm.app_notifications}
                onCheckedChange={(checked) => handleCheckboxChange('app_notifications', checked)}
              />
              <div className="flex-1">
                <Label htmlFor="app_notifications" className="flex items-center space-x-2 cursor-pointer">
                  <Bell className="h-4 w-4" />
                  <span>Notifications dans l'application</span>
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Notifications push et alertes en temps réel sur la plateforme
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Note sur les consentements - Affichage conditionnel selon le type de compte */}
        {profileForm.created_by_institution ? (
          // Pour comptes créés par établissement
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <Label className="text-sm font-medium text-blue-800">Consentements RGPD</Label>
            </div>
            <p className="text-sm text-blue-700">
              Vos consentements RGPD, conditions générales et autorisation de partage de profil 
              ont été validés lors de l'activation de votre compte créé par votre établissement.
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Pour modifier ces consentements, contactez le support ÉMÉRÉS.
            </p>
          </div>
        ) : (
          // Pour comptes créés par inscription directe - Note discrète
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600">
              💡 Vos consentements RGPD ont été validés lors de votre inscription sur ÉMÉRÉS. 
              Pour les modifier, contactez le support.
            </p>
          </div>
        )}

        {/* Informations importantes */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-amber-800 mb-2">ℹ️ Informations importantes</h4>
          <div className="text-sm text-amber-700 space-y-1">
            <p>• Vous pouvez modifier vos préférences de notifications à tout moment</p>
            <p>• Les consentements marqués d'un * sont obligatoires pour utiliser ÉMÉRÉS</p>
            <p>• Vos données sont protégées et ne seront jamais vendues à des tiers</p>
            <p>• Vous pouvez demander l'accès, la modification ou la suppression de vos données</p>
          </div>
        </div>

        {/* Bouton de sauvegarde de la section */}
        {onSave && (
          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={onSave}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Sauvegarder la section</span>
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SettingsSection;