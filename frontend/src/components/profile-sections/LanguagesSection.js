import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Globe, Plus, Trash2 } from 'lucide-react';

const LanguagesSection = ({ 
  profileForm, 
  addLanguage, 
  removeLanguage, 
  languagesOptions, 
  languageLevelsOptions 
}) => {
  const [newLanguage, setNewLanguage] = useState('');
  const [newLevel, setNewLevel] = useState('');

  const handleAddLanguage = () => {
    if (newLanguage && newLevel) {
      addLanguage(newLanguage, newLevel);
      setNewLanguage('');
      setNewLevel('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>Langues</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Select value={newLanguage} onValueChange={setNewLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Langue" />
            </SelectTrigger>
            <SelectContent>
              {languagesOptions
                .filter(lang => !profileForm.languages.some(l => l.language === lang))
                .map(language => (
                  <SelectItem key={language} value={language}>{language}</SelectItem>
                ))}
            </SelectContent>
          </Select>
          
          <Select value={newLevel} onValueChange={setNewLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Niveau CECRL" />
            </SelectTrigger>
            <SelectContent>
              {languageLevelsOptions.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={handleAddLanguage} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {profileForm.languages.map((lang) => (
            <Badge key={lang.id} variant="outline" className="flex items-center space-x-2 px-3 py-1 border-green-200 text-green-700">
              <Globe className="h-3 w-3" />
              <span>{lang.language} - {lang.level}</span>
              <button
                onClick={() => removeLanguage(lang.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>

        {profileForm.languages.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            Aucune langue ajoutée. Ajoutez vos compétences linguistiques avec les niveaux CECRL.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LanguagesSection;