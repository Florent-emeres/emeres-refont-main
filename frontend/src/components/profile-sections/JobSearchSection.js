import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Target, MapPin, Clock, FileText, Save, RefreshCw } from 'lucide-react';
import UniversalFileUpload from '../shared/UniversalFileUpload';

const JobSearchSection = ({ profileForm, setProfileForm, errors = {}, onSave, loading = false }) => {
  const handleInputChange = (field, value) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const searchObjectives = [
    'Stage',
    'Alternance',
    'Premier emploi',
    'Projet tutoré',
    'Job étudiant',
    'Mission courte',
    'Bénévolat'
  ];

  const contractTypes = [
    'Stage obligatoire',
    'Stage facultatif',
    'Alternance',
    'Freelance',
    'CDD',
    'CDI',
    'Temps partiel',
    'Mission ponctuelle'
  ];

  const durations = [
    '1-2 mois',
    '3-4 mois',
    '5-6 mois',
    '6-12 mois',
    '1-2 ans',
    'CDI',
    'À définir'
  ];

  const mobilityOptions = [
    'Ville actuelle uniquement',
    'Région (même région)',
    'National (France)',
    'Européen',
    'International',
    'Aucune mobilité'
  ];

  const availabilityOptions = [
    'Immédiatement',
    'Dans 1 mois',
    'Dans 2-3 mois',
    'À partir de septembre',
    'À partir de janvier',
    'Flexible'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Recherche de stage / emploi</span>
        </CardTitle>
        <CardDescription>
          Définissez vos critères de recherche professionnelle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Objectif et domaine */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Objectif</Label>
            <Select 
              value={profileForm.search_objective} 
              onValueChange={(value) => handleInputChange('search_objective', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Que recherchez-vous ?" />
              </SelectTrigger>
              <SelectContent>
                {searchObjectives.map(objective => (
                  <SelectItem key={objective} value={objective}>
                    {objective}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Domaine recherché</Label>
            <Input
              placeholder="Ex: Développement web, Marketing digital..."
              value={profileForm.search_domain}
              onChange={(e) => handleInputChange('search_domain', e.target.value)}
            />
            <p className="text-xs text-gray-500">
              En rapport avec vos études
            </p>
          </div>
        </div>

        <Separator />

        {/* Type de contrat et durée */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <Label className="text-sm font-medium">Modalités souhaitées</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type de contrat</Label>
              <Select 
                value={profileForm.contract_type} 
                onValueChange={(value) => handleInputChange('contract_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type de contrat souhaité" />
                </SelectTrigger>
                <SelectContent>
                  {contractTypes.map(contract => (
                    <SelectItem key={contract} value={contract}>
                      {contract}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Durée souhaitée</Label>
              <Select 
                value={profileForm.desired_duration} 
                onValueChange={(value) => handleInputChange('desired_duration', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Durée en semaines/mois" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map(duration => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Mobilité géographique */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <Label className="text-sm font-medium">Mobilité géographique</Label>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Zone de mobilité</Label>
              <Select 
                value={profileForm.geographic_mobility} 
                onValueChange={(value) => handleInputChange('geographic_mobility', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Jusqu'où êtes-vous prêt(e) à vous déplacer ?" />
                </SelectTrigger>
                <SelectContent>
                  {mobilityOptions.map(mobility => (
                    <SelectItem key={mobility} value={mobility}>
                      {mobility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remote_work"
                checked={profileForm.remote_work_accepted}
                onCheckedChange={(checked) => handleInputChange('remote_work_accepted', checked)}
              />
              <Label htmlFor="remote_work" className="text-sm">
                J'accepte le télétravail / travail à distance
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Disponibilités */}
        <div className="space-y-3">
          <Label>Disponibilités</Label>
          <Select 
            value={profileForm.availability_start} 
            onValueChange={(value) => handleInputChange('availability_start', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Quand êtes-vous disponible ?" />
            </SelectTrigger>
            <SelectContent>
              {availabilityOptions.map(availability => (
                <SelectItem key={availability} value={availability}>
                  {availability}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {profileForm.availability_start === 'Flexible' && (
            <Input
              placeholder="Précisez votre disponibilité..."
              className="mt-2"
            />
          )}
        </div>

        <Separator />

        {/* Documents */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <Label className="text-sm font-medium">Documents</Label>
          </div>
          
          {/* CV */}
          <UniversalFileUpload
            label="CV"
            description="Ajoutez votre CV au format PDF"
            acceptedTypes={['application/pdf']}
            maxSize={5 * 1024 * 1024} // 5MB
            value={profileForm.uploaded_cv}
            onChange={(file) => handleInputChange('uploaded_cv', file)}
            required={false}
          />
          
          {/* Lettre de motivation */}
          <div className="space-y-2">
            <Label>Lettre de motivation (facultatif)</Label>
            <Textarea
              placeholder="Rédigez une lettre de motivation générale ou laissez vide si vous préférez personnaliser pour chaque candidature..."
              value={profileForm.cover_letter}
              onChange={(e) => handleInputChange('cover_letter', e.target.value)}
              rows={6}
            />
            <p className="text-xs text-gray-500">
              Cette lettre peut être utilisée comme base pour vos candidatures
            </p>
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

export default JobSearchSection;