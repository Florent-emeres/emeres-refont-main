import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { 
  Plus, 
  ExternalLink, 
  Github, 
  Globe, 
  Image, 
  Video, 
  FileText,
  Trash2,
  Edit,
  Eye,
  Calendar,
  Tag,
  Link as LinkIcon,
  Upload,
  Star,
  Award,
  Code,
  Palette,
  Smartphone,
  Monitor
} from 'lucide-react';

// Composant ProjectForm défini en dehors pour éviter les re-renders
const ProjectForm = ({ project, setProject, onSave, onCancel, isEditing = false }) => {
  const [newTech, setNewTech] = useState('');
  const [newLink, setNewLink] = useState({ type: '', url: '', label: '' });
  const [newHighlight, setNewHighlight] = useState('');
  
  // Refs pour maintenir le focus
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleInputChange = (field, value) => {
    setProject(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fonctions stables pour éviter les re-renders avec sauvegarde de la position du curseur
  const handleTitleChange = (e) => {
    const cursorPosition = e.target.selectionStart;
    handleInputChange('title', e.target.value);
    // Restaurer la position du curseur après le re-render
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };
  
  const handleDescriptionChange = (e) => {
    const cursorPosition = e.target.selectionStart;
    handleInputChange('description', e.target.value);
    // Restaurer la position du curseur après le re-render
    setTimeout(() => {
      if (descriptionRef.current) {
        descriptionRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  const categories = [
    { value: 'web', label: 'Développement Web', icon: Monitor, color: 'bg-blue-100 text-blue-800' },
    { value: 'mobile', label: 'Application Mobile', icon: Smartphone, color: 'bg-green-100 text-green-800' },
    { value: 'design', label: 'Design UI/UX', icon: Palette, color: 'bg-purple-100 text-purple-800' },
    { value: 'ai', label: 'Intelligence Artificielle', icon: Star, color: 'bg-blue-100 text-amber-800' },
    { value: 'data', label: 'Data Science', icon: FileText, color: 'bg-indigo-100 text-indigo-800' },
    { value: 'other', label: 'Autre', icon: Code, color: 'bg-gray-100 text-gray-800' }
  ];

  const linkTypes = [
    { value: 'github', label: 'GitHub', icon: Github },
    { value: 'demo', label: 'Démo Live', icon: Globe },
    { value: 'video', label: 'Vidéo', icon: Video },
    { value: 'document', label: 'Documentation', icon: FileText },
    { value: 'other', label: 'Autre', icon: LinkIcon }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="project-title">Titre du projet *</Label>
          <Input
            ref={titleRef}
            id="project-title"
            value={project.title || ''}
            onChange={handleTitleChange}
            placeholder="Mon super projet"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="project-category">Catégorie *</Label>
          <Select 
            value={project.category || ''} 
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  <div className="flex items-center space-x-2">
                    <category.icon className="h-4 w-4" />
                    <span>{category.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description">Description *</Label>
        <Textarea
          ref={descriptionRef}
          id="project-description"
          value={project.description || ''}
          onChange={handleDescriptionChange}
          placeholder="Décrivez votre projet, les défis relevés, les solutions apportées..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="project-status">Statut</Label>
          <Select 
            value={project.status || 'completed'} 
            onValueChange={(value) => handleInputChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="planned">Planifié</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="project-start-date">Date de début</Label>
          <Input
            id="project-start-date"
            type="date"
            value={project.startDate || ''}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="project-end-date">Date de fin</Label>
          <Input
            id="project-end-date"
            type="date"
            value={project.endDate || ''}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
          />
        </div>
      </div>

      {/* Technologies */}
      <div className="space-y-3">
        <Label>Technologies utilisées</Label>
        <div className="flex space-x-2">
          <Input
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            placeholder="React, Node.js, Python..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (newTech.trim()) {
                  setProject(prev => ({
                    ...prev,
                    technologies: [...(prev.technologies || []), newTech.trim()]
                  }));
                  setNewTech('');
                }
              }
            }}
          />
          <Button 
            type="button" 
            onClick={() => {
              if (newTech.trim()) {
                setProject(prev => ({
                  ...prev,
                  technologies: [...(prev.technologies || []), newTech.trim()]
                }));
                setNewTech('');
              }
            }}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(project.technologies || []).map((tech, index) => (
            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
              <span>{tech}</span>
              <button
                type="button"
                onClick={() => {
                  setProject(prev => ({
                    ...prev,
                    technologies: prev.technologies.filter((_, i) => i !== index)
                  }));
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="space-y-3">
        <Label>Liens du projet</Label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Select 
            value={newLink.type} 
            onValueChange={(value) => setNewLink({ ...newLink, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {linkTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center space-x-2">
                    <type.icon className="h-4 w-4" />
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            placeholder="https://..."
          />
          <Input
            value={newLink.label}
            onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
            placeholder="Libellé (optionnel)"
          />
          <Button 
            type="button" 
            onClick={() => {
              if (newLink.type && newLink.url) {
                const linkToAdd = { ...newLink, id: Date.now().toString() };
                setProject(prev => ({
                  ...prev,
                  links: [...(prev.links || []), linkToAdd]
                }));
                setNewLink({ type: '', url: '', label: '' });
              }
            }}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {(project.links || []).map((link) => {
            const linkType = linkTypes.find(type => type.value === link.type);
            const LinkIcon = linkType?.icon || LinkIcon;
            
            return (
              <div key={link.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <LinkIcon className="h-4 w-4" />
                  <span className="text-sm">{link.label || linkType?.label}</span>
                  <span className="text-xs text-gray-500">{link.url}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setProject(prev => ({
                      ...prev,
                      links: prev.links.filter(l => l.id !== link.id)
                    }));
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlights */}
      <div className="space-y-3">
        <Label>Points forts & réalisations</Label>
        <div className="flex space-x-2">
          <Input
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            placeholder="Amélioration des performances de 50%..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (newHighlight.trim()) {
                  setProject(prev => ({ 
                    ...prev, 
                    highlights: [...(prev.highlights || []), newHighlight.trim()] 
                  }));
                  setNewHighlight('');
                }
              }
            }}
          />
          <Button 
            type="button" 
            onClick={() => {
              if (newHighlight.trim()) {
                setProject(prev => ({ 
                  ...prev, 
                  highlights: [...(prev.highlights || []), newHighlight.trim()] 
                }));
                setNewHighlight('');
              }
            }}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1">
          {(project.highlights || []).map((highlight, index) => (
            <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded">
              <span className="text-sm flex items-start">
                <Award className="h-3 w-3 text-green-500 mr-2 mt-0.5" />
                {highlight}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setProject(prev => ({
                    ...prev,
                    highlights: prev.highlights.filter((_, i) => i !== index)
                  }));
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="button" onClick={onSave}>
          {isEditing ? 'Mettre à jour' : 'Ajouter le projet'}
        </Button>
      </div>
    </div>
  );
};

const Portfolio = ({ profile, updateProfile }) => {
  const [projects, setProjects] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: '',
    technologies: [],
    links: [],
    images: [],
    status: 'completed',
    startDate: '',
    endDate: '',
    highlights: []
  });

  const categories = [
    { value: 'web', label: 'Développement Web', icon: Monitor, color: 'bg-blue-100 text-blue-800' },
    { value: 'mobile', label: 'Application Mobile', icon: Smartphone, color: 'bg-green-100 text-green-800' },
    { value: 'design', label: 'Design UI/UX', icon: Palette, color: 'bg-purple-100 text-purple-800' },
    { value: 'ai', label: 'Intelligence Artificielle', icon: Star, color: 'bg-blue-100 text-amber-800' },
    { value: 'data', label: 'Data Science', icon: FileText, color: 'bg-indigo-100 text-indigo-800' },
    { value: 'other', label: 'Autre', icon: Code, color: 'bg-gray-100 text-gray-800' }
  ];

  const linkTypes = [
    { value: 'github', label: 'GitHub', icon: Github },
    { value: 'demo', label: 'Démo Live', icon: Globe },
    { value: 'video', label: 'Vidéo', icon: Video },
    { value: 'document', label: 'Documentation', icon: FileText },
    { value: 'other', label: 'Autre', icon: LinkIcon }
  ];

  useEffect(() => {
    // Load projects from profile or localStorage
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

  const addProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const project = {
      id: Date.now().toString(),
      ...newProject,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedProjects = [...projects, project];
    await saveProjects(updatedProjects);
    
    setNewProject({
      title: '',
      description: '',
      category: '',
      technologies: [],
      links: [],
      images: [],
      status: 'completed',
      startDate: '',
      endDate: '',
      highlights: []
    });
    setShowAddDialog(false);
  };

  const updateProject = async () => {
    if (!editingProject.title || !editingProject.description || !editingProject.category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const updatedProjects = projects.map(p => 
      p.id === editingProject.id 
        ? { ...editingProject, updatedAt: new Date().toISOString() }
        : p
    );
    
    await saveProjects(updatedProjects);
    setEditingProject(null);
  };

  const deleteProject = async (projectId) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    await saveProjects(updatedProjects);
  };

  const addTechnology = (technologies, setTechnologies, newTech) => {
    if (newTech && !technologies.includes(newTech)) {
      setTechnologies([...technologies, newTech]);
    }
  };

  const removeTechnology = (technologies, setTechnologies, techToRemove) => {
    setTechnologies(technologies.filter(tech => tech !== techToRemove));
  };

  const addLink = (links, setLinks, newLink) => {
    if (newLink.url && newLink.type) {
      setLinks([...links, { ...newLink, id: Date.now().toString() }]);
    }
  };

  const removeLink = (links, setLinks, linkId) => {
    setLinks(links.filter(link => link.id !== linkId));
  };

  const getCategoryInfo = (categoryValue) => {
    return categories.find(cat => cat.value === categoryValue) || categories[categories.length - 1];
  };

  const ProjectCard = ({ project }) => {
    const categoryInfo = getCategoryInfo(project.category);
    const CategoryIcon = categoryInfo.icon;

    return (
      <Card className="card-hover transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2 group-hover:text-blue-600 transition-colors">
                {project.title}
              </CardTitle>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={categoryInfo.color}>
                  <CategoryIcon className="h-3 w-3 mr-1" />
                  {categoryInfo.label}
                </Badge>
                <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                  {project.status === 'completed' ? 'Terminé' : 'En cours'}
                </Badge>
              </div>
              {project.startDate && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(project.startDate).toLocaleDateString('fr-FR')}
                  {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString('fr-FR')}`}
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingProject(project)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteProject(project.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-700 text-sm line-clamp-3">
            {project.description}
          </p>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-1">
                {project.technologies.slice(0, 5).map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.technologies.length - 5}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                <Award className="h-3 w-3 mr-1" />
                Points forts
              </h5>
              <ul className="text-xs text-gray-600 space-y-1">
                {project.highlights.slice(0, 3).map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-1">•</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.links.map((link) => {
                const linkType = linkTypes.find(type => type.value === link.type);
                const LinkIcon = linkType?.icon || LinkIcon;
                
                return (
                  <Button
                    key={link.id}
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(link.url, '_blank')}
                    className="text-xs"
                  >
                    <LinkIcon className="h-3 w-3 mr-1" />
                    {link.label || linkType?.label}
                  </Button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Award className="h-6 w-6 mr-2 text-purple-600" />
            Portfolio de Projets
          </h2>
          <p className="text-gray-600">Présentez vos réalisations et projets</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau projet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau projet</DialogTitle>
              <DialogDescription>
                Créez une vitrine de votre projet avec tous les détails
              </DialogDescription>
            </DialogHeader>
            <ProjectForm
              project={newProject}
              setProject={setNewProject}
              onSave={addProject}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Code className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{projects.length}</p>
                <p className="text-sm text-gray-600">Projets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {projects.filter(p => p.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">Terminés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Tag className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {[...new Set(projects.flatMap(p => p.technologies))].length}
                </p>
                <p className="text-sm text-gray-600">Technologies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ExternalLink className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {projects.reduce((total, p) => total + (p.links?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Liens</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Aucun projet dans votre portfolio
            </h3>
            <p className="text-gray-600 mb-4">
              Ajoutez vos premiers projets pour créer un portfolio impressionnant
            </p>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer mon premier projet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le projet</DialogTitle>
              <DialogDescription>
                Mettez à jour les informations de votre projet
              </DialogDescription>
            </DialogHeader>
            <ProjectForm
              project={editingProject}
              setProject={setEditingProject}
              onSave={updateProject}
              onCancel={() => setEditingProject(null)}
              isEditing={true}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Portfolio;