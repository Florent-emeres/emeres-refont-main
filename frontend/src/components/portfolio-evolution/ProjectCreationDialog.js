import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CheckCircle, FileText, Lightbulb, Target } from 'lucide-react';
import { projectTemplates, getProjectTemplate } from './ProjectTemplates';
import FileUploadZone from './FileUploadZone';

const ProjectCreationDialog = ({ 
  open, 
  onClose, 
  newProject, 
  setNewProject, 
  selectedTemplate, 
  onSelectTemplate, 
  onCreate, 
  fieldOfStudy 
}) => {
  const [currentStep, setCurrentStep] = useState('template');

  const handleInputChange = (field, value) => {
    setNewProject(prev => ({ ...prev, [field]: value }));
  };

  const addTechnology = (tech) => {
    if (tech && !newProject.technologies.includes(tech)) {
      handleInputChange('technologies', [...newProject.technologies, tech]);
    }
  };

  const removeTechnology = (tech) => {
    handleInputChange('technologies', newProject.technologies.filter(t => t !== tech));
  };

  const addLink = (url, type = 'other') => {
    if (url) {
      const link = {
        id: Date.now().toString(),
        url,
        type,
        label: type === 'github' ? 'GitHub' : type === 'demo' ? 'Démo' : 'Lien'
      };
      handleInputChange('links', [...newProject.links, link]);
    }
  };

  const templateOptions = Object.entries(projectTemplates).filter(([key]) => 
    !fieldOfStudy || key === fieldOfStudy || key === 'other'
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouveau projet</DialogTitle>
          <DialogDescription>
            Utilisez nos modèles pour créer un projet professionnel et crédible
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="template">Modèle</TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedTemplate}>Détails</TabsTrigger>
            <TabsTrigger value="proofs" disabled={!selectedTemplate}>Preuves</TabsTrigger>
            <TabsTrigger value="review" disabled={!selectedTemplate}>Révision</TabsTrigger>
          </TabsList>

          {/* Étape 1: Sélection du modèle */}
          <TabsContent value="template" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templateOptions.map(([key, template]) => (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate?.name === template.name ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                  }`}
                  onClick={() => {
                    onSelectTemplate(key);
                    setCurrentStep('details');
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-500">Technologies suggérées:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.suggestedTechnologies.slice(0, 4).map((tech, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{tech}</Badge>
                          ))}
                          {template.suggestedTechnologies.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.suggestedTechnologies.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Étape 2: Détails du projet */}
          <TabsContent value="details" className="space-y-6">
            {selectedTemplate && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Modèle: {selectedTemplate.name}</h4>
                  <p className="text-sm text-blue-800">{selectedTemplate.description}</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-title">Titre du projet *</Label>
                    <Input
                      id="project-title"
                      value={newProject.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Mon projet innovant"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-description">Description détaillée *</Label>
                    <Textarea
                      id="project-description"
                      value={newProject.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Décrivez votre projet, les objectifs, les défis relevés..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Technologies utilisées</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newProject.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <span>{tech}</span>
                          <button
                            onClick={() => removeTechnology(tech)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedTemplate.suggestedTechnologies
                        .filter(tech => !newProject.technologies.includes(tech))
                        .map((tech, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => addTechnology(tech)}
                            className="text-xs"
                          >
                            + {tech}
                          </Button>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setCurrentStep('proofs')}>
                    Suivant: Preuves
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Étape 3: Preuves */}
          <TabsContent value="proofs" className="space-y-6">
            <div className="space-y-4">
              <div className="bg-gray-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Preuves requises pour ce type de projet</h4>
                    <ul className="text-sm text-amber-700 mt-1 space-y-1">
                      {selectedTemplate?.deliverables.map((deliverable, index) => (
                        <li key={index}>• {deliverable}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <FileUploadZone
                files={newProject.proofs}
                onFilesChange={(files) => handleInputChange('proofs', files)}
                required={true}
                label="Fichiers de preuve"
              />

              <div className="space-y-4">
                <Label>Liens externes (optionnel)</Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="URL GitHub, démo, documentation..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value) {
                          addLink(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      onClick={(e) => {
                        const input = e.target.parentElement.querySelector('input');
                        if (input.value) {
                          addLink(input.value);
                          input.value = '';
                        }
                      }}
                    >
                      Ajouter
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {newProject.links.map(link => (
                      <div key={link.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">{link.url}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInputChange('links', newProject.links.filter(l => l.id !== link.id))}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('details')}>
                  Précédent
                </Button>
                <Button onClick={() => setCurrentStep('review')}>
                  Suivant: Révision
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Étape 4: Révision */}
          <TabsContent value="review" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Révision du projet</h3>
              
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div><strong>Titre:</strong> {newProject.title}</div>
                  <div><strong>Description:</strong> {newProject.description}</div>
                  <div>
                    <strong>Technologies:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {newProject.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                  <div><strong>Preuves:</strong> {newProject.proofs.length} fichier(s)</div>
                  <div><strong>Liens:</strong> {newProject.links.length} lien(s)</div>
                </CardContent>
              </Card>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Checklist de qualité</h4>
                    <ul className="text-sm text-green-700 mt-1 space-y-1">
                      {selectedTemplate?.checklist.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('proofs')}>
                  Précédent
                </Button>
                <Button onClick={onCreate} className="bg-green-600 hover:bg-green-700">
                  Créer le projet
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCreationDialog;