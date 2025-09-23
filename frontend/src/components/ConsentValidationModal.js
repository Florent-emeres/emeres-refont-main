import React, { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { Shield, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const ConsentValidationModal = ({ isOpen, onValidate, onClose, studentName = '' }) => {
  const [consents, setConsents] = useState({
    gdpr_consent: false,
    terms_accepted: false,
    profile_sharing_consent: false
  });
  const [loading, setLoading] = useState(false);

  const handleConsentChange = (field, checked) => {
    setConsents(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleValidate = async () => {
    // Vérification que tous les consentements sont accordés
    if (!consents.gdpr_consent || !consents.terms_accepted || !consents.profile_sharing_consent) {
      toast.error('Tous les consentements sont obligatoires pour utiliser ÉMÉRÉS');
      return;
    }

    setLoading(true);
    try {
      await onValidate(consents);
      toast.success('Consentements validés avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la validation des consentements');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 border-b">
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <AlertTriangle className="h-6 w-6" />
            <span>Validation des consentements obligatoires</span>
          </CardTitle>
          <CardDescription className="text-orange-700">
            {studentName && `Bonjour ${studentName}, `}
            Votre compte a été créé par votre établissement. Pour accéder à ÉMÉRÉS, 
            vous devez valider les consentements suivants.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6 overflow-y-auto flex-1">
          
          {/* Information importante */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Validation obligatoire</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Ces consentements sont requis par la réglementation RGPD et nécessaires 
                  pour utiliser les services ÉMÉRÉS. Vous devez les accepter pour continuer.
                </p>
              </div>
            </div>
          </div>

          {/* Consentements */}
          <div className="space-y-5">
            
            {/* Consentement RGPD */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="gdpr_consent"
                  checked={consents.gdpr_consent}
                  onCheckedChange={(checked) => handleConsentChange('gdpr_consent', checked)}
                />
                <div className="flex-1">
                  <Label htmlFor="gdpr_consent" className="cursor-pointer font-medium text-sm">
                    Consentement RGPD <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    J'accepte que mes données personnelles soient collectées et traitées conformément à la 
                    <a 
                      href="/privacy-policy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline mx-1"
                    >
                      politique de confidentialité
                    </a>
                    d'ÉMÉRÉS. Je peux retirer mon consentement à tout moment.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Conditions générales */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="terms_accepted"
                  checked={consents.terms_accepted}
                  onCheckedChange={(checked) => handleConsentChange('terms_accepted', checked)}
                />
                <div className="flex-1">
                  <Label htmlFor="terms_accepted" className="cursor-pointer font-medium text-sm">
                    Conditions générales d'utilisation <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    J'accepte les 
                    <a 
                      href="/terms-of-service" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline mx-1"
                    >
                      conditions générales d'utilisation
                    </a>
                    de la plateforme ÉMÉRÉS.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Autorisation partage profil */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="profile_sharing_consent"
                  checked={consents.profile_sharing_consent}
                  onCheckedChange={(checked) => handleConsentChange('profile_sharing_consent', checked)}
                />
                <div className="flex-1">
                  <Label htmlFor="profile_sharing_consent" className="cursor-pointer font-medium text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>Autorisation partage profil <span className="text-red-500">*</span></span>
                    </div>
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    J'autorise ÉMÉRÉS à partager mon profil avec des entreprises partenaires, 
                    mentors et établissements dans le cadre de ma recherche de stage/emploi. 
                    Cette autorisation est nécessaire pour bénéficier du service de matching et des opportunités.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Vos droits</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Vous pouvez retirer ces consentements à tout moment</li>
                  <li>• Vous avez le droit d'accéder à vos données personnelles</li>
                  <li>• Vous pouvez demander la rectification ou suppression de vos données</li>
                  <li>• Contactez-nous à privacy@emeres.fr pour exercer vos droits</li>
                </ul>
              </div>
            </div>
          </div>

        </CardContent>
        
        {/* Boutons d'action - Fixés en bas */}
        <div className="flex justify-between items-center p-6 pt-4 border-t bg-gray-50 flex-shrink-0">
          <p className="text-sm text-gray-500">
            Tous les consentements sont obligatoires
          </p>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Fermer
            </Button>
            
            <Button
              onClick={handleValidate}
              disabled={loading || !consents.gdpr_consent || !consents.terms_accepted || !consents.profile_sharing_consent}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Validation...</span>
                </div>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Valider les consentements
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConsentValidationModal;