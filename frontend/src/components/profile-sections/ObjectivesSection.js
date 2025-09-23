import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Target, Trash2 } from 'lucide-react';

const ObjectivesSection = ({ 
  profileForm, 
  setProfileForm,
  addToMultiSelect, 
  removeFromMultiSelect, 
  sectorsOptions,
  missionTypesOptions,
  companySizeOptions,
  contractTypeOptions
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Objectifs & Préférences</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="professional_objective">Objectif professionnel *</Label>
          <Input
            id="professional_objective"
            value={profileForm.professional_objective}
            onChange={(e) => setProfileForm({...profileForm, professional_objective: e.target.value})}
            placeholder="Ex: Devenir Data Analyst junior, Assistant RH, Développeur web..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="personal_presentation">Présentation personnelle</Label>
          <Textarea
            id="personal_presentation"
            value={profileForm.personal_presentation}
            onChange={(e) => setProfileForm({...profileForm, personal_presentation: e.target.value})}
            placeholder="Présentez-vous en quelques lignes..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Secteurs visés */}
          <div className="space-y-3">
            <Label>Secteurs visés</Label>
            <Select onValueChange={(value) => addToMultiSelect('preferred_sectors', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Ajouter un secteur" />
              </SelectTrigger>
              <SelectContent>
                {sectorsOptions
                  .filter(sector => !profileForm.preferred_sectors.includes(sector))
                  .map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2">
              {profileForm.preferred_sectors.map((sector, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{sector}</span>
                  <button
                    onClick={() => removeFromMultiSelect('preferred_sectors', sector)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Types de missions */}
          <div className="space-y-3">
            <Label>Types de missions souhaitées</Label>
            <Select onValueChange={(value) => addToMultiSelect('preferred_mission_types', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Ajouter un type de mission" />
              </SelectTrigger>
              <SelectContent>
                {missionTypesOptions
                  .filter(mission => !profileForm.preferred_mission_types.includes(mission))
                  .map(mission => (
                    <SelectItem key={mission} value={mission}>{mission}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2">
              {profileForm.preferred_mission_types.map((mission, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{mission}</span>
                  <button
                    onClick={() => removeFromMultiSelect('preferred_mission_types', mission)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salary_expectations">Attentes salariales (optionnel)</Label>
            <Input
              id="salary_expectations"
              value={profileForm.salary_expectations}
              onChange={(e) => setProfileForm({...profileForm, salary_expectations: e.target.value})}
              placeholder="Ex: 35-40k€, 600€/mois, À négocier..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjectivesSection;