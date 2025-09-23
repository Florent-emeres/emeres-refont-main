import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, Mail, Key } from 'lucide-react';

const EmailChangeConfirmation = ({ isOpen, oldEmail, newEmail, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 border-b">
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <AlertTriangle className="h-6 w-6" />
            <span>Confirmation changement d'email</span>
          </CardTitle>
          <CardDescription className="text-orange-700">
            Vous êtes sur le point de modifier votre identifiant de connexion
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 p-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <Key className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Impact important</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Votre email sert d'identifiant de connexion sur ÉMÉRÉS. 
                  En le modifiant, vous devrez utiliser le nouvel email pour vous connecter.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Email actuel (identifiant actuel) :</p>
                <p className="font-medium text-gray-800">{oldEmail}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Nouvel email (nouvel identifiant) :</p>
                <p className="font-medium text-blue-800">{newEmail}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">À retenir</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Votre nouvel identifiant sera : <strong>{newEmail}</strong></li>
              <li>• Vous devrez vous reconnecter avec ce nouvel email</li>
              <li>• L'ancien email ne fonctionnera plus pour la connexion</li>
              <li>• Assurez-vous d'avoir accès à cette nouvelle adresse</li>
            </ul>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Annuler
            </Button>
            
            <Button
              onClick={onConfirm}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Key className="h-4 w-4 mr-2" />
              Confirmer le changement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailChangeConfirmation;