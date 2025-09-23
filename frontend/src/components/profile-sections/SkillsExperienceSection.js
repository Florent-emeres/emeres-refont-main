import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Plus, X, Code, Briefcase, Globe, Award, Save, RefreshCw } from 'lucide-react';

const SkillsExperienceSection = ({ profileForm, setProfileForm, errors = {}, onSave, loading = false }) => {
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState({ language: '', level: '' });
  const [newExperience, setNewExperience] = useState({
    position: '', company: '', duration: '', missions: ''
  });
  const [newPortfolioLink, setNewPortfolioLink] = useState({ title: '', url: '', type: '' });

  const handleInputChange = (field, value) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Suggestions de compétences par domaine
  const skillSuggestions = {
    'Informatique & Développement': [
      'JavaScript', 'Python', 'React', 'Node.js', 'PHP', 'Java', 'C++', 'SQL', 'MongoDB', 'Git',
      'Docker', 'AWS', 'Azure', 'HTML/CSS', 'TypeScript', 'Vue.js', 'Angular', 'Spring Boot'
    ],
    'Data Science & IA': [
      'Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 
      'Pandas', 'NumPy', 'Tableau', 'Power BI', 'Jupyter', 'Statistics', 'Data Visualization'
    ],
    'Marketing & Communication': [
      'SEO/SEA', 'Google Analytics', 'Adobe Creative Suite', 'Canva', 'WordPress', 'Email Marketing',
      'Social Media Marketing', 'Content Marketing', 'PPC/AdWords', 'Facebook Ads', 'Hootsuite'
    ],
    'Design & Création': [
      'Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Sketch', 'UI/UX Design', 'Prototypage',
      'After Effects', 'Premiere Pro', 'Blender', 'AutoCAD', 'SolidWorks'
    ]
  };

  const languageLevels = [
    { value: 'A1', label: 'A1 (Débutant)' },
    { value: 'A2', label: 'A2 (Élémentaire)' },
    { value: 'B1', label: 'B1 (Intermédiaire)' },
    { value: 'B2', label: 'B2 (Intermédiaire avancé)' },
    { value: 'C1', label: 'C1 (Avancé)' },
    { value: 'C2', label: 'C2 (Maîtrise)' },
    { value: 'Natif', label: 'Natif' }
  ];

  const portfolioTypes = [
    'GitHub', 'Behance', 'Dribbble', 'LinkedIn', 'Portfolio personnel', 
    'Notion', 'GitLab', 'CodePen', 'YouTube', 'Autre'
  ];

  // Gestion des compétences
  const addSkill = (type = 'hard_skills') => {
    if (newSkill.trim()) {
      if (type === 'hard_skills' && !profileForm.main_skills.includes(newSkill.trim())) {
        handleInputChange('main_skills', [...profileForm.main_skills, newSkill.trim()]);
        setNewSkill('');
      } else if (type === 'soft_skills' && !(profileForm.soft_skills || []).includes(newSkill.trim())) {
        handleInputChange('soft_skills', [...(profileForm.soft_skills || []), newSkill.trim()]);
        setNewSkill('');
      }
    }
  };

  const removeSkill = (skillToRemove, type = 'hard_skills') => {
    if (type === 'hard_skills') {
      handleInputChange('main_skills', profileForm.main_skills.filter(skill => skill !== skillToRemove));
    } else if (type === 'soft_skills') {
      handleInputChange('soft_skills', (profileForm.soft_skills || []).filter(skill => skill !== skillToRemove));
    }
  };

  const addSuggestedSkill = (skill, type = 'hard_skills') => {
    if (type === 'hard_skills' && !profileForm.main_skills.includes(skill)) {
      handleInputChange('main_skills', [...profileForm.main_skills, skill]);
    } else if (type === 'soft_skills' && !(profileForm.soft_skills || []).includes(skill)) {
      handleInputChange('soft_skills', [...(profileForm.soft_skills || []), skill]);
    }
  };

  // Gestion des langues
  const addLanguage = () => {
    if (newLanguage.language && newLanguage.level) {
      const existingLanguage = profileForm.languages.find(lang => lang.language === newLanguage.language);
      if (!existingLanguage) {
        handleInputChange('languages', [...profileForm.languages, { ...newLanguage }]);
        setNewLanguage({ language: '', level: '' });
      }
    }
  };

  const removeLanguage = (languageToRemove) => {
    handleInputChange('languages', profileForm.languages.filter(lang => lang.language !== languageToRemove.language));
  };

  // Gestion des expériences
  const addExperience = () => {
    if (newExperience.position && newExperience.company) {
      handleInputChange('past_experiences', [...profileForm.past_experiences, { ...newExperience }]);
      setNewExperience({ position: '', company: '', duration: '', missions: '' });
    }
  };

  const removeExperience = (index) => {
    const updatedExperiences = profileForm.past_experiences.filter((_, i) => i !== index);
    handleInputChange('past_experiences', updatedExperiences);
  };

  // Gestion du portfolio
  const addPortfolioLink = () => {
    if (newPortfolioLink.title && newPortfolioLink.url) {
      handleInputChange('portfolio_projects', [...profileForm.portfolio_projects, { ...newPortfolioLink }]);
      setNewPortfolioLink({ title: '', url: '', type: '' });
    }
  };

  const removePortfolioLink = (index) => {
    const updatedLinks = profileForm.portfolio_projects.filter((_, i) => i !== index);
    handleInputChange('portfolio_projects', updatedLinks);
  };

  const getSuggestedSkills = () => {
    return skillSuggestions[profileForm.field_of_study] || [];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="h-5 w-5" />
          <span>Compétences & Expérience</span>
        </CardTitle>
        <CardDescription>
          Vos compétences, langues, expériences et projets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Compétences Techniques (Hard Skills) */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <Label className="text-sm font-medium">Compétences techniques (Hard Skills)</Label>
          </div>
          
          {/* Suggestions basées sur le domaine d'étude */}
          {profileForm.field_of_study && getSuggestedSkills().length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Suggestions techniques pour {profileForm.field_of_study} :
              </p>
              <div className="flex flex-wrap gap-2">
                {getSuggestedSkills().slice(0, 12).map(skill => (
                  <Button
                    key={skill}
                    variant="outline"
                    size="sm"
                    onClick={() => addSuggestedSkill(skill, 'hard_skills')}
                    disabled={profileForm.main_skills.includes(skill)}
                    className="h-7 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {skill}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Ajout manuel de compétences techniques */}
          <div className="flex space-x-2">
            <Input
              placeholder="Ajouter une compétence technique..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill('hard_skills')}
            />
            <Button onClick={() => addSkill('hard_skills')} disabled={!newSkill.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Liste des compétences techniques */}
          <div className="flex flex-wrap gap-2">
            {profileForm.main_skills.map((skill, index) => (
              <Badge key={index} variant="default" className="flex items-center space-x-1 bg-blue-100 text-blue-800">
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(skill, 'hard_skills')}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Compétences Comportementales (Soft Skills) */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <Label className="text-sm font-medium">Compétences comportementales (Soft Skills)</Label>
          </div>
          
          {/* Suggestions de soft skills universelles */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Sélectionnez vos principales qualités personnelles :
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'Communication', 'Leadership', 'Travail en équipe', 'Adaptabilité', 'Créativité',
                'Résolution de problèmes', 'Pensée critique', 'Gestion du temps', 'Organisation',
                'Initiative', 'Autonomie', 'Écoute active', 'Empathie', 'Persévérance'
              ].map(skill => (
                <Button
                  key={skill}
                  variant="outline"
                  size="sm"
                  onClick={() => addSuggestedSkill(skill, 'soft_skills')}
                  disabled={(profileForm.soft_skills || []).includes(skill)}
                  className="h-7 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {skill}
                </Button>
              ))}
            </div>
          </div>

          {/* Liste des soft skills */}
          <div className="flex flex-wrap gap-2">
            {(profileForm.soft_skills || []).map((skill, index) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1 bg-green-100 text-green-800">
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(skill, 'soft_skills')}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Langues parlées */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <Label className="text-sm font-medium">Langues parlées</Label>
          </div>

          {/* Ajout de langue */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Langue"
              value={newLanguage.language}
              onChange={(e) => setNewLanguage(prev => ({ ...prev, language: e.target.value }))}
            />
            <Select 
              value={newLanguage.level} 
              onValueChange={(value) => setNewLanguage(prev => ({ ...prev, level: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                {languageLevels.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addLanguage} disabled={!newLanguage.language || !newLanguage.level}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>

          {/* Liste des langues */}
          <div className="space-y-2">
            {profileForm.languages.map((lang, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <span className="font-medium">{lang.language}</span>
                  <span className="text-sm text-gray-600 ml-2">({lang.level})</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLanguage(lang)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Expériences passées */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4" />
            <Label className="text-sm font-medium">Expériences passées</Label>
          </div>
          <p className="text-sm text-gray-600">
            Stages, jobs étudiants, projets professionnels...
          </p>

          {/* Ajout d'expérience */}
          <div className="space-y-3 border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Poste occupé"
                value={newExperience.position}
                onChange={(e) => setNewExperience(prev => ({ ...prev, position: e.target.value }))}
              />
              <Input
                placeholder="Entreprise/Organisation"
                value={newExperience.company}
                onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
              />
            </div>
            <Input
              placeholder="Durée (Ex: 3 mois, Juin 2023 - Août 2023)"
              value={newExperience.duration}
              onChange={(e) => setNewExperience(prev => ({ ...prev, duration: e.target.value }))}
            />
            <Textarea
              placeholder="Missions et réalisations..."
              value={newExperience.missions}
              onChange={(e) => setNewExperience(prev => ({ ...prev, missions: e.target.value }))}
              rows={3}
            />
            <Button 
              onClick={addExperience} 
              disabled={!newExperience.position || !newExperience.company}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter l'expérience
            </Button>
          </div>

          {/* Liste des expériences */}
          <div className="space-y-3">
            {profileForm.past_experiences.map((exp, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{exp.position}</h4>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    {exp.duration && (
                      <p className="text-sm text-gray-500">{exp.duration}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {exp.missions && (
                  <p className="text-sm mt-2">{exp.missions}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Portfolio / Projets */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Portfolio / Projets</Label>
          <p className="text-sm text-gray-600">
            Liens externes : GitHub, Behance, Notion, PDF, vidéos...
          </p>

          {/* Ajout de lien portfolio */}
          <div className="space-y-3 border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Titre du projet"
                value={newPortfolioLink.title}
                onChange={(e) => setNewPortfolioLink(prev => ({ ...prev, title: e.target.value }))}
              />
              <Input
                placeholder="URL du lien"
                value={newPortfolioLink.url}
                onChange={(e) => setNewPortfolioLink(prev => ({ ...prev, url: e.target.value }))}
              />
              <Select 
                value={newPortfolioLink.type} 
                onValueChange={(value) => setNewPortfolioLink(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {portfolioTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={addPortfolioLink} 
              disabled={!newPortfolioLink.title || !newPortfolioLink.url}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter le lien
            </Button>
          </div>

          {/* Liste des liens portfolio */}
          <div className="space-y-2">
            {profileForm.portfolio_projects.map((link, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{link.title}</span>
                    {link.type && (
                      <Badge variant="outline" className="text-xs">
                        {link.type}
                      </Badge>
                    )}
                  </div>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 break-all"
                  >
                    {link.url}
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePortfolioLink(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
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

export default SkillsExperienceSection;