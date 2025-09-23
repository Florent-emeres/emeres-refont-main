import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Globe, Github, Linkedin, Palette, User } from 'lucide-react';

const SocialLinksSection = ({ profileForm, setProfileForm }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>Réseaux & Liens externes</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn</Label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="linkedin_url"
                value={profileForm.linkedin_url}
                onChange={(e) => setProfileForm({...profileForm, linkedin_url: e.target.value})}
                className="pl-10"
                placeholder="https://linkedin.com/in/votre-profil"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub</Label>
            <div className="relative">
              <Github className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="github_url"
                value={profileForm.github_url}
                onChange={(e) => setProfileForm({...profileForm, github_url: e.target.value})}
                className="pl-10"
                placeholder="https://github.com/votre-username"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="behance_url">Behance</Label>
            <div className="relative">
              <Palette className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="behance_url"
                value={profileForm.behance_url}
                onChange={(e) => setProfileForm({...profileForm, behance_url: e.target.value})}
                className="pl-10"
                placeholder="https://behance.net/votre-profil"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="personal_website_url">Site personnel</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="personal_website_url"
                value={profileForm.personal_website_url}
                onChange={(e) => setProfileForm({...profileForm, personal_website_url: e.target.value})}
                className="pl-10"
                placeholder="https://votre-site.com"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolio_url">Portfolio externe</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="portfolio_url"
              value={profileForm.portfolio_url}
              onChange={(e) => setProfileForm({...profileForm, portfolio_url: e.target.value})}
              className="pl-10"
              placeholder="https://mon-portfolio.com"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialLinksSection;