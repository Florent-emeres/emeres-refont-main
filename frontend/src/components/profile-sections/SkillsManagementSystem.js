import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Code, Heart, Zap, Target, Plus, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

// Système complet des domaines d'études et compétences
const DOMAINS_AND_SKILLS = {
  'informatique-developpement': {
    label: 'Informatique & Développement',
    hardSkills: [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'Git', 'HTML/CSS',
      'Docker', 'MongoDB', 'Express', 'Vue.js', 'Angular', 'TypeScript', 'PHP',
      'C++', 'Linux', 'AWS', 'API REST', 'Firebase'
    ]
  },
  'data-science-ia': {
    label: 'Data Science & IA',
    hardSkills: [
      'Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
      'pandas', 'NumPy', 'Matplotlib', 'Tableau', 'Power BI', 'Jupyter', 'scikit-learn',
      'Statistics', 'Excel avancé', 'Big Data', 'Apache Spark', 'Hadoop', 'NoSQL'
    ]
  },
  'marketing-communication': {
    label: 'Marketing & Communication',
    hardSkills: [
      'Google Analytics', 'SEO/SEA', 'Google Ads', 'Facebook Ads', 'Instagram Ads',
      'Content Marketing', 'Email Marketing', 'Canva', 'Adobe Creative Suite',
      'WordPress', 'Hootsuite', 'HubSpot', 'Mailchimp', 'Copywriting', 'A/B Testing',
      'Social Media Marketing', 'Influencer Marketing', 'CRM', 'Brand Management', 'PR'
    ]
  },
  'commerce-vente': {
    label: 'Commerce & Vente',
    hardSkills: [
      'CRM (Salesforce)', 'CRM (HubSpot)', 'Prospection', 'Négociation', 'Cold Calling',
      'LinkedIn Sales Navigator', 'Pipedrive', 'Account Management', 'Lead Generation',
      'Sales Analytics', 'E-commerce', 'Cross-selling', 'Up-selling', 'Customer Success',
      'B2B Sales', 'B2C Sales', 'Retail', 'Key Account Management', 'Sales Forecasting', 'Closing'
    ]
  },
  'finance-comptabilite': {
    label: 'Finance & Comptabilité',
    hardSkills: [
      'Excel avancé', 'SAP', 'QuickBooks', 'Sage', 'Comptabilité générale', 'Analyse financière',
      'Modélisation financière', 'Bloomberg', 'VBA', 'Power BI', 'Audit', 'Contrôle de gestion',
      'Fiscalité', 'Paie', 'Budget prévisionnel', 'Risk Management', 'Compliance', 'IFRS', 'Trésorerie', 'Investment'
    ]
  },
  'ressources-humaines': {
    label: 'Ressources Humaines',
    hardSkills: [
      'Recrutement', 'SIRH', 'Paie', 'Droit du travail', 'Formation', 'GPEC',
      'Assessment', 'Entretiens', 'LinkedIn Recruiter', 'ATS', 'Performance Management',
      'Talent Management', 'Employee Engagement', 'HR Analytics', 'Compensation', 'Benefits',
      'Change Management', 'Diversity & Inclusion', 'Labor Relations', 'HR Compliance'
    ]
  },
  'design-creation': {
    label: 'Design & Création',
    hardSkills: [
      'Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Sketch', 'Adobe XD', 'After Effects',
      'Premiere Pro', 'UI/UX Design', 'Prototyping', 'Wireframing', 'Typography', 'Color Theory',
      'Branding', 'Logo Design', 'Web Design', 'Graphic Design', 'Motion Design', 'Blender', 'Cinema 4D'
    ]
  },
  'ingenierie-technique': {
    label: 'Ingénierie & Technique',
    hardSkills: [
      'AutoCAD', 'SolidWorks', 'CATIA', 'MATLAB', 'Python', 'C++', 'Simulation', 'CAO/DAO',
      'Project Management', 'Quality Control', 'Lean Manufacturing', 'Six Sigma', 'ISO 9001',
      'PLC Programming', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Robotics', 'IoT'
    ]
  },
  'sante-medical': {
    label: 'Santé & Médical',
    hardSkills: [
      'Anatomie', 'Physiologie', 'Pharmacologie', 'Diagnostic médical', 'Soins infirmiers',
      'Premiers secours', 'Hygiène hospitalière', 'Dossier patient électronique', 'Radiologie',
      'Échographie', 'Laboratoire médical', 'Chirurgie', 'Anesthésie', 'Médecine d\'urgence',
      'Gériatrie', 'Pédiatrie', 'Psychiatrie', 'Réanimation', 'Infectiologie', 'Cardiologie'
    ]
  },
  'education-formation': {
    label: 'Éducation & Formation',
    hardSkills: [
      'Pédagogie', 'Didactique', 'Gestion de classe', 'Évaluation', 'TICE', 'Moodle',
      'E-learning', 'Formation d\'adultes', 'Ingénierie pédagogique', 'Différenciation pédagogique',
      'Psychologie de l\'apprentissage', 'Méthodologie', 'Accompagnement scolaire', 'Tutorat',
      'Formation professionnelle', 'Certification', 'Learning Management System', 'Gamification', 'Microlearning', 'Blended Learning'
    ]
  },
  'juridique-droit': {
    label: 'Juridique & Droit',
    hardSkills: [
      'Droit des contrats', 'Droit du travail', 'Droit commercial', 'Droit pénal', 'Droit civil',
      'Recherche juridique', 'Rédaction juridique', 'Procédure civile', 'Procédure pénale',
      'Compliance', 'Due diligence', 'Contentieux', 'Médiation', 'Arbitrage', 'Droit international',
      'Droit fiscal', 'Propriété intellectuelle', 'RGPD', 'Droit de la famille', 'Droit immobilier'
    ]
  },
  'logistique-transport': {
    label: 'Logistique & Transport',
    hardSkills: [
      'Gestion des stocks', 'Supply Chain', 'WMS', 'ERP (SAP)', 'Transport', 'Douane',
      'Lean Logistics', 'Planification', 'Procurement', 'Inventory Management', 'Distribution',
      'E-commerce Logistics', 'International Trade', 'Freight Forwarding', 'Warehouse Management',
      'RFID', 'Forecasting', 'Vendor Management', 'Quality Assurance', 'Cost Management'
    ]
  }
};

// 20 Soft Skills générales
const GENERAL_SOFT_SKILLS = [
  'Communication', 'Travail en équipe', 'Leadership', 'Résolution de problèmes', 'Adaptabilité',
  'Créativité', 'Esprit critique', 'Gestion du temps', 'Organisation', 'Autonomie',
  'Empathie', 'Persévérance', 'Curiosité', 'Innovation', 'Collaboration',
  'Négociation', 'Présentation orale', 'Écoute active', 'Gestion du stress', 'Proactivité'
];

const SkillsManagementSystem = ({ profileForm, setProfileForm }) => {
  const [selectedDomain, setSelectedDomain] = useState(profileForm.field_of_study || '');
  const [selectedHardSkills, setSelectedHardSkills] = useState(profileForm.hard_skills || []);
  const [selectedSoftSkills, setSelectedSoftSkills] = useState(profileForm.soft_skills || []);
  const [showHardSkills, setShowHardSkills] = useState(false);
  const [showSoftSkills, setShowSoftSkills] = useState(false);

  // Sync avec le profil parent
  useEffect(() => {
    setProfileForm(prev => ({
      ...prev,
      field_of_study: selectedDomain,
      hard_skills: selectedHardSkills,
      soft_skills: selectedSoftSkills
    }));
  }, [selectedDomain, selectedHardSkills, selectedSoftSkills, setProfileForm]);

  const handleDomainChange = (domain) => {
    setSelectedDomain(domain);
    // Reset des hard skills si changement de domaine
    if (selectedHardSkills.length > 0) {
      setSelectedHardSkills([]);
      toast.info('Compétences techniques réinitialisées suite au changement de domaine');
    }
  };

  const toggleHardSkill = (skill) => {
    if (selectedHardSkills.includes(skill)) {
      setSelectedHardSkills(prev => prev.filter(s => s !== skill));
    } else if (selectedHardSkills.length < 10) {
      setSelectedHardSkills(prev => [...prev, skill]);
    } else {
      toast.warning('Vous pouvez sélectionner maximum 10 compétences techniques');
    }
  };

  const toggleSoftSkill = (skill) => {
    if (selectedSoftSkills.includes(skill)) {
      setSelectedSoftSkills(prev => prev.filter(s => s !== skill));
    } else if (selectedSoftSkills.length < 5) {
      setSelectedSoftSkills(prev => [...prev, skill]);
    } else {
      toast.warning('Vous pouvez sélectionner maximum 5 compétences comportementales');
    }
  };

  const getAvailableHardSkills = () => {
    return selectedDomain && DOMAINS_AND_SKILLS[selectedDomain] 
      ? DOMAINS_AND_SKILLS[selectedDomain].hardSkills 
      : [];
  };

  const completionPercentage = () => {
    const domainSelected = selectedDomain ? 1 : 0;
    const hardSkillsSelected = Math.min(selectedHardSkills.length / 5, 1); // 5 minimum recommandé
    const softSkillsSelected = Math.min(selectedSoftSkills.length / 3, 1); // 3 minimum recommandé
    return Math.round(((domainSelected + hardSkillsSelected + softSkillsSelected) / 3) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Complétion des compétences</span>
            <span className="text-sm font-bold text-blue-600">{completionPercentage()}%</span>
          </div>
          <Progress value={completionPercentage()} className="h-2" />
          <p className="text-xs text-gray-600 mt-1">
            Sélectionnez votre domaine et vos compétences pour un profil complet
          </p>
        </CardContent>
      </Card>

      {/* Sélection du domaine d'études */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Domaine d'études</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Sélectionnez votre domaine principal *</Label>
            <Select value={selectedDomain} onValueChange={handleDomainChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez votre domaine d'études" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DOMAINS_AND_SKILLS).map(([key, domain]) => (
                  <SelectItem key={key} value={key}>{domain.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Hard Skills */}
      {selectedDomain && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-green-600" />
                <span>Compétences techniques</span>
                <Badge variant="outline" className="text-xs">
                  {selectedHardSkills.length}/10
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHardSkills(!showHardSkills)}
              >
                {showHardSkills ? 'Masquer' : 'Sélectionner'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Skills sélectionnées */}
            {selectedHardSkills.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Vos compétences techniques sélectionnées :
                </Label>
                <div className="flex flex-wrap gap-2">
                  {selectedHardSkills.map((skill, index) => (
                    <Badge key={index} variant="default" className="bg-green-100 text-green-700 border-green-300">
                      <Code className="h-3 w-3 mr-1" />
                      {skill}
                      <button
                        onClick={() => toggleHardSkill(skill)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Liste de sélection */}
            {showHardSkills && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Compétences disponibles pour {DOMAINS_AND_SKILLS[selectedDomain].label} :
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {getAvailableHardSkills().map((skill, index) => {
                    const isSelected = selectedHardSkills.includes(skill);
                    return (
                      <Button
                        key={index}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleHardSkill(skill)}
                        className={`justify-start text-xs ${
                          isSelected 
                            ? 'bg-green-600 text-white' 
                            : 'hover:bg-green-50 hover:border-green-300'
                        }`}
                        disabled={!isSelected && selectedHardSkills.length >= 10}
                      >
                        {isSelected ? <CheckCircle className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
                        {skill}
                      </Button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Sélectionnez jusqu'à 10 compétences techniques
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Soft Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-pink-600" />
              <span>Compétences comportementales</span>
              <Badge variant="outline" className="text-xs">
                {selectedSoftSkills.length}/5
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSoftSkills(!showSoftSkills)}
            >
              {showSoftSkills ? 'Masquer' : 'Sélectionner'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Skills sélectionnées */}
          {selectedSoftSkills.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Vos compétences comportementales sélectionnées :
              </Label>
              <div className="flex flex-wrap gap-2">
                {selectedSoftSkills.map((skill, index) => (
                  <Badge key={index} variant="default" className="bg-pink-100 text-pink-700 border-pink-300">
                    <Heart className="h-3 w-3 mr-1" />
                    {skill}
                    <button
                      onClick={() => toggleSoftSkill(skill)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Liste de sélection */}
          {showSoftSkills && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Compétences comportementales générales :
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {GENERAL_SOFT_SKILLS.map((skill, index) => {
                  const isSelected = selectedSoftSkills.includes(skill);
                  return (
                    <Button
                      key={index}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSoftSkill(skill)}
                      className={`justify-start text-xs ${
                        isSelected 
                          ? 'bg-pink-600 text-white' 
                          : 'hover:bg-pink-50 hover:border-pink-300'
                      }`}
                      disabled={!isSelected && selectedSoftSkills.length >= 5}
                    >
                      {isSelected ? <CheckCircle className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
                      {skill}
                    </Button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Sélectionnez jusqu'à 5 compétences comportementales
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résumé */}
      {(selectedHardSkills.length > 0 || selectedSoftSkills.length > 0) && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Résumé de vos compétences</span>
            </div>
            <div className="text-sm text-green-700">
              <p><strong>Domaine :</strong> {selectedDomain ? DOMAINS_AND_SKILLS[selectedDomain].label : 'Non sélectionné'}</p>
              <p><strong>Compétences techniques :</strong> {selectedHardSkills.length}/10 sélectionnées</p>
              <p><strong>Compétences comportementales :</strong> {selectedSoftSkills.length}/5 sélectionnées</p>
            </div>
            <p className="text-xs text-green-600 mt-2">
              ✅ Ces compétences seront automatiquement intégrées dans votre CV et vos candidatures
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SkillsManagementSystem;