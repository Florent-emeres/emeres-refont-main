import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { GraduationCap, Calendar } from 'lucide-react';

const AcademicInfoSection = ({ 
  profileForm, 
  setProfileForm, 
  currentYearOptions, 
  searchTypeOptions, 
  workRhythmOptions, 
  desiredDurationOptions,
  fieldOfStudyOptions 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5" />
          <span>Informations académiques</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current_year">Année d'étude *</Label>
            <Select 
              value={profileForm.current_year} 
              onValueChange={(value) => setProfileForm({...profileForm, current_year: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre année" />
              </SelectTrigger>
              <SelectContent>
                {currentYearOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="field_of_study">Domaine d'études *</Label>
            <Select 
              value={profileForm.field_of_study} 
              onValueChange={(value) => setProfileForm({...profileForm, field_of_study: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre domaine" />
              </SelectTrigger>
              <SelectContent>
                {fieldOfStudyOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search_type">Type de recherche *</Label>
            <Select 
              value={profileForm.search_type} 
              onValueChange={(value) => setProfileForm({...profileForm, search_type: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Que recherchez-vous ?" />
              </SelectTrigger>
              <SelectContent>
                {searchTypeOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="work_rhythm">Rythme souhaité</Label>
            <Select 
              value={profileForm.work_rhythm} 
              onValueChange={(value) => setProfileForm({...profileForm, work_rhythm: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le rythme" />
              </SelectTrigger>
              <SelectContent>
                {workRhythmOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="availability_start">Disponible dès le *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="availability_start"
                type="date"
                value={profileForm.availability_start}
                onChange={(e) => setProfileForm({...profileForm, availability_start: e.target.value})}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="availability_end">Jusqu'au (optionnel)</Label>
            <Input
              id="availability_end"
              type="date"
              value={profileForm.availability_end}
              onChange={(e) => setProfileForm({...profileForm, availability_end: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="desired_duration">Durée souhaitée</Label>
            <Select 
              value={profileForm.desired_duration} 
              onValueChange={(value) => setProfileForm({...profileForm, desired_duration: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Durée" />
              </SelectTrigger>
              <SelectContent>
                {desiredDurationOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AcademicInfoSection;