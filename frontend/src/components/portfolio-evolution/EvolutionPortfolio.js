import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { 
  Plus, 
  ExternalLink, 
  Github, 
  Globe, 
  Eye,
  Calendar,
  Award,
  FileText,
  Users,
  Target,
  Lightbulb,
  TrendingUp,
  Shield
} from 'lucide-react';

// Import des nouveaux composants
import { projectTemplates, getProjectTemplate } from './ProjectTemplates';
import { ValidationBadges, ValidationLevels } from './ValidationBadges';
import FileUploadZone from './FileUploadZone';
import ProjectTracker from './ProjectTracker';
import ProjectCreationDialog from './ProjectCreationDialog';
import ProjectDetailView from './ProjectDetailView';

const EvolutionPortfolio = ({ profile, updateProfile, skillSuggestionsByField }) => {
  const [projects, setProjects] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // État pour le nouveau projet
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    field_of_study: profile?.field_of_study || '',
    template: null,
    status: 'in-progress',
    validation_status: ValidationLevels.SELF_DECLARED,
    technologies: [],
    links: [],
    proofs: [], // fichiers de preuve
    tasks: [],
    collaborators: [],
    created_at: '',
    updated_at: ''
  });

  useEffect(() => {
    // Charger les projets depuis le profil
    const savedProjects = profile?.portfolio_projects || [];
    setProjects(savedProjects);
  }, [profile]);

  const saveProjects = async (updatedProjects) => {
    try {
      if (updateProfile) {
        await updateProfile({ ...profile, portfolio_projects: updatedProjects });
      }
      setProjects(updatedProjects);
      toast.success('Portfolio mis à jour avec succès !');
    } catch (error) {
      console.error('Error saving projects:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const startProjectCreation = () => {
    setNewProject({
      ...newProject,
      field_of_study: profile?.field_of_study || '',
      created_at: new Date().toISOString()
    });
    setSelectedTemplate(null);
    setShowCreateDialog(true);
  };

  const selectTemplate = (templateKey) => {
    const template = getProjectTemplate(templateKey);
    setSelectedTemplate(template);
    setNewProject({
      ...newProject,
      template: templateKey,
      title: template.name,
      description: template.description,
      technologies: [...template.suggestedTechnologies.slice(0, 5)], // Pré-remplir avec suggestions
      tasks: template.checklist.map((item, index) => ({
        id: `template-${index}`,
        title: item,
        status: 'todo',
        createdAt: new Date().toISOString()
      }))
    });
  };

  const createProject = async () => {
    if (!newProject.title || !newProject.description) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    // Vérifier les preuves obligatoires selon le template
    if (selectedTemplate && selectedTemplate.requiredFields.length > 0 && newProject.proofs.length === 0) {
      toast.error('Au moins une preuve est requise pour ce type de projet');
      return;
    }

    const project = {
      ...newProject,
      id: Date.now().toString(),
      updated_at: new Date().toISOString()
    };

    const updatedProjects = [...projects, project];
    await saveProjects(updatedProjects);
    
    // Reset
    setNewProject({
      title: '',
      description: '',
      field_of_study: profile?.field_of_study || '',
      template: null,
      status: 'in-progress',
      validation_status: ValidationLevels.SELF_DECLARED,
      technologies: [],
      links: [],
      proofs: [],
      tasks: [],
      collaborators: [],
      created_at: '',
      updated_at: ''
    });
    setSelectedTemplate(null);
    setShowCreateDialog(false);
  };

  const updateProject = async (updatedProject) => {
    const updatedProjects = projects.map(p => 
      p.id === updatedProject.id 
        ? { ...updatedProject, updated_at: new Date().toISOString() }
        : p
    );
    await saveProjects(updatedProjects);
  };

  const deleteProject = async (projectId) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    await saveProjects(updatedProjects);
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
  };

  const requestValidation = async (projectId, validationType) => {
    // Simuler une demande de validation
    const updatedProject = projects.find(p => p.id === projectId);
    if (updatedProject) {
      updatedProject.validation_status = ValidationLevels.PENDING;
      await updateProject(updatedProject);
      toast.success(`Demande de validation ${validationType} envoyée`);
    }
  };

  // Calcul des statistiques
  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    validated: projects.filter(p => p.validation_status !== ValidationLevels.SELF_DECLARED).length,
    technologies: [...new Set(projects.flatMap(p => p.technologies || []))].length
  };

  const ProjectCard = ({ project }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentProject(project)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              <ValidationBadges validationStatus={project.validation_status} size="small" />
              <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                {project.status === 'completed' ? 'Terminé' : 'En cours'}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-gray-700 text-sm line-clamp-2">{project.description}</p>
        
        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 4).map((tech, index) => (
              <Badge key={index} variant="outline" className="text-xs">{tech}</Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="outline" className="text-xs">+{project.technologies.length - 4}</Badge>
            )}
          </div>
        )}

        {/* Preuves */}
        {project.proofs && project.proofs.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <Shield className="h-4 w-4" />
            <span>{project.proofs.length} preuve(s) fournie(s)</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Award className="h-6 w-6 mr-2 text-purple-600" />
            Portfolio Évolutif
          </h2>
          <p className="text-gray-600">Projets vérifiés avec preuves et suivi</p>
        </div>
        
        <Button onClick={startProjectCreation} className="bg-gradient-to-r from-purple-500 to-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau projet
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Projets total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Terminés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.validated}</div>
            <div className="text-sm text-gray-600">Validés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.technologies}</div>
            <div className="text-sm text-gray-600">Technologies</div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal */}
      {currentProject ? (
        // Vue détaillée du projet
        <ProjectDetailView 
          project={currentProject}
          onBack={() => setCurrentProject(null)}
          onUpdate={updateProject}
          onDelete={deleteProject}
          onRequestValidation={requestValidation}
        />
      ) : (
        // Vue liste des projets
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          
          {projects.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Créez votre premier projet vérifié
                </h3>
                <p className="text-gray-600 mb-4">
                  Utilisez nos modèles adaptés à votre domaine d'études
                </p>
                <Button onClick={startProjectCreation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Commencer
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Dialog de création */}
      <ProjectCreationDialog 
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        newProject={newProject}
        setNewProject={setNewProject}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={selectTemplate}
        onCreate={createProject}
        fieldOfStudy={profile?.field_of_study}
      />
    </div>
  );
};

export default EvolutionPortfolio;