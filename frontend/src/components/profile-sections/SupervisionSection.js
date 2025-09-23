import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Users, UserCheck, Building2, Search, Plus, Save, RefreshCw } from 'lucide-react';

const SupervisionSection = ({ profileForm, setProfileForm, errors = {}, onSave, loading = false }) => {
  const [searchMentor, setSearchMentor] = useState('');
  const [searchTutor, setSearchTutor] = useState('');

  const handleInputChange = (field, value) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Données d'exemple pour les mentors (en production, viendraient d'une API)
  const availableMentors = [
    { id: 1, name: 'Marie Dubois', speciality: 'Développement Web', company: 'Tech Corp' },
    { id: 2, name: 'Jean Martin', speciality: 'Data Science', company: 'Analytics Pro' },
    { id: 3, name: 'Sophie Laurent', speciality: 'Marketing Digital', company: 'Creative Agency' },
    { id: 4, name: 'Pierre Moreau', speciality: 'Design UX/UI', company: 'Design Studio' }
  ];

  const filteredMentors = availableMentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchMentor.toLowerCase()) ||
    mentor.speciality.toLowerCase().includes(searchMentor.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Encadrement & Suivi</span>
        </CardTitle>
        <CardDescription>
          Personnes référentes pour votre accompagnement professionnel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Mentor attitré */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-4 w-4" />
            <Label className="text-sm font-medium">Mentor attitré</Label>
          </div>
          <p className="text-sm text-gray-600">
            Si vous avez déjà un mentor assigné ou si vous souhaitez en chercher un
          </p>
          
          {/* Recherche de mentor */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un mentor par nom ou spécialité..."
                value={searchMentor}
                onChange={(e) => setSearchMentor(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Résultats de recherche mentor */}
            {searchMentor && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredMentors.length > 0 ? (
                  filteredMentors.map(mentor => (
                    <div 
                      key={mentor.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        handleInputChange('assigned_mentor', `${mentor.name} - ${mentor.speciality} (${mentor.company})`);
                        setSearchMentor('');
                      }}
                    >
                      <div>
                        <p className="font-medium">{mentor.name}</p>
                        <p className="text-sm text-gray-600">{mentor.speciality} • {mentor.company}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Sélectionner
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 p-3">Aucun mentor trouvé</p>
                )}
              </div>
            )}
          </div>
          
          {/* Mentor sélectionné ou champ libre */}
          {profileForm.assigned_mentor ? (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Mentor assigné :</p>
                  <p className="text-sm text-green-700">{profileForm.assigned_mentor}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange('assigned_mentor', '')}
                  className="text-red-600 hover:text-red-800"
                >
                  Retirer
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                placeholder="Ou saisissez manuellement le nom de votre mentor..."
                value={profileForm.assigned_mentor}
                onChange={(e) => handleInputChange('assigned_mentor', e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Laissez vide si vous n'avez pas encore de mentor
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Tuteur pédagogique */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <Label className="text-sm font-medium">Tuteur pédagogique</Label>
          </div>
          <p className="text-sm text-gray-600">
            Enseignant référent ou responsable pédagogique de votre établissement
          </p>
          
          <div className="space-y-3">
            <Input
              placeholder="Nom et prénom du tuteur pédagogique"
              value={profileForm.pedagogical_tutor}
              onChange={(e) => handleInputChange('pedagogical_tutor', e.target.value)}
            />
            
            {/* Informations complémentaires */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Email (optionnel)"
                type="email"
              />
              <Input
                placeholder="Matière/Département (optionnel)"
              />
            </div>
            
            <p className="text-xs text-gray-500">
              Cette personne sera votre contact principal côté établissement
            </p>
          </div>
        </div>

        <Separator />

        {/* Référent entreprise */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <Label className="text-sm font-medium">Référent entreprise</Label>
          </div>
          <p className="text-sm text-gray-600">
            Personne de contact dans l'entreprise où vous effectuez ou souhaitez effectuer votre stage/alternance
          </p>
          
          <div className="space-y-3">
            <Input
              placeholder="Nom et prénom du référent"
              value={profileForm.company_referent}
              onChange={(e) => handleInputChange('company_referent', e.target.value)}
            />
            
            {/* Informations complémentaires entreprise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Entreprise (optionnel)"
              />
              <Input
                placeholder="Poste/Fonction (optionnel)"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Email (optionnel)"
                type="email"
              />
              <Input
                placeholder="Téléphone (optionnel)"
                type="tel"
              />
            </div>
            
            <p className="text-xs text-gray-500">
              Laissez vide si vous n'avez pas encore identifié d'entreprise
            </p>
          </div>
        </div>

        {/* Aide et suggestions */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">💡 Besoin d'aide ?</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Vous pouvez demander à votre établissement de vous assigner un tuteur pédagogique</p>
            <p>• Pour trouver un mentor, consultez notre réseau de professionnels ÉMÉRÉS</p>
            <p>• Le référent entreprise sera généralement votre maître de stage</p>
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

export default SupervisionSection;