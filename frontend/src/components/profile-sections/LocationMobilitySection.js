import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MapPin, Globe } from 'lucide-react';

const LocationMobilitySection = ({ 
  profileForm, 
  setProfileForm, 
  geographicMobilityOptions, 
  remoteWorkOptions 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Localisation & Mobilité</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current_city">Ville actuelle *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="current_city"
                value={profileForm.current_city}
                onChange={(e) => setProfileForm({...profileForm, current_city: e.target.value})}
                className="pl-10"
                placeholder="Paris, Lyon, Marseille..."
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="geographic_mobility">Mobilité géographique</Label>
            <Select 
              value={profileForm.geographic_mobility} 
              onValueChange={(value) => setProfileForm({...profileForm, geographic_mobility: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Votre mobilité" />
              </SelectTrigger>
              <SelectContent>
                {geographicMobilityOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="remote_work">Télétravail</Label>
          <Select 
            value={profileForm.remote_work} 
            onValueChange={(value) => setProfileForm({...profileForm, remote_work: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Votre position sur le télétravail" />
            </SelectTrigger>
            <SelectContent>
              {remoteWorkOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationMobilitySection;