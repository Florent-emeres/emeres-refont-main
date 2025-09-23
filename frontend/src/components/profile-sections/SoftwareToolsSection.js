import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Zap, Trash2 } from 'lucide-react';

const SoftwareToolsSection = ({ 
  profileForm, 
  addToMultiSelect, 
  removeFromMultiSelect, 
  softwareToolsOptions 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Outils logiciels</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Rechercher et ajouter des outils</Label>
          <Select onValueChange={(value) => addToMultiSelect('software_tools', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un outil logiciel" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {softwareToolsOptions
                .filter(tool => !profileForm.software_tools.includes(tool))
                .map(tool => (
                  <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          {profileForm.software_tools.map((tool, index) => (
            <Badge key={index} variant="outline" className="flex items-center space-x-2 px-3 py-1 border-orange-200 text-orange-700">
              <Zap className="h-3 w-3" />
              <span>{tool}</span>
              <button
                onClick={() => removeFromMultiSelect('software_tools', tool)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>

        {profileForm.software_tools.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            Aucun outil logiciel ajouté. Ajoutez les outils que vous maîtrisez.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SoftwareToolsSection;