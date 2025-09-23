import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Progress } from '../../ui/progress';
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  TrendingUp,
  Save,
  X
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const StrategicObjectives = ({ objectives = [], config, onUpdate, userRole }) => {
  const { toast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingObjective, setEditingObjective] = useState(null);
  
  const [objectiveForm, setObjectiveForm] = useState({
    title: '',
    description: '',
    target_value: 1,
    deadline: '',
    priority: 'medium',
    category: config.categories?.[0] || 'general'
  });

  const resetForm = () => {
    setObjectiveForm({
      title: '',
      description: '',
      target_value: 1,
      deadline: '',
      priority: 'medium',
      category: config.categories?.[0] || 'general'
    });
  };

  const handleSubmit = () => {
    if (!objectiveForm.title.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }

    const newObjective = {
      id: editingObjective?.id || `obj_${Date.now()}`,
      ...objectiveForm,
      current_value: editingObjective?.current_value || 0,
      status: editingObjective?.status || 'active',
      created_at: editingObjective?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let updatedObjectives;
    if (editingObjective) {
      updatedObjectives = objectives.map(obj => 
        obj.id === editingObjective.id ? newObjective : obj
      );
    } else {
      if (objectives.length >= (config.maxObjectives || 10)) {
        toast.error(`Maximum ${config.maxObjectives || 10} objectifs autorisés`);
        return;
      }
      updatedObjectives = [...objectives, newObjective];
    }

    onUpdate(updatedObjectives);
    setShowCreateModal(false);
    setEditingObjective(null);
    resetForm();
    toast.success(editingObjective ? 'Objectif modifié' : 'Objectif créé');
  };

  const handleEdit = (objective) => {
    setEditingObjective(objective);
    setObjectiveForm({
      title: objective.title,
      description: objective.description,
      target_value: objective.target_value,
      deadline: objective.deadline?.split('T')[0] || '',
      priority: objective.priority,
      category: objective.category || config.categories?.[0] || 'general'
    });
    setShowCreateModal(true);
  };

  const handleDelete = (objectiveId) => {
    const updatedObjectives = objectives.filter(obj => obj.id !== objectiveId);
    onUpdate(updatedObjectives);
    toast.success('Objectif supprimé');
  };

  const updateProgress = (objectiveId, newValue) => {
    const updatedObjectives = objectives.map(obj => 
      obj.id === objectiveId ? { ...obj, current_value: newValue } : obj
    );
    onUpdate(updatedObjectives);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'active': { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'En cours' },
      'completed': { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Terminé' },
      'pending': { color: 'bg-blue-100 text-amber-800', icon: AlertTriangle, text: 'En attente' },
      'overdue': { color: 'bg-red-100 text-red-800', icon: AlertTriangle, text: 'En retard' }
    };
    const badge = badges[status] || badges.active;
    const Icon = badge.icon;
    return (
      <Badge className={`${badge.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {badge.text}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      'critical': 'bg-red-500 text-white',
      'high': 'bg-orange-500 text-white',
      'medium': 'bg-blue-500 text-white',
      'low': 'bg-gray-500 text-white'
    };
    return (
      <Badge className={colors[priority] || colors.medium}>
        {priority === 'critical' ? 'Critique' : 
         priority === 'high' ? 'Haute' :
         priority === 'medium' ? 'Moyenne' : 'Basse'}
      </Badge>
    );
  };

  const calculateProgress = (objective) => {
    if (objective.target_value === 0) return 0;
    return Math.min(100, Math.round((objective.current_value / objective.target_value) * 100));
  };

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Objectifs stratégiques</h3>
          <p className="text-sm text-gray-600">
            {objectives.length}/{config.maxObjectives || 10} objectifs définis
          </p>
        </div>
        
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm();
                setEditingObjective(null);
              }}
              disabled={objectives.length >= (config.maxObjectives || 10)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvel objectif
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Liste des objectifs */}
      <div className="space-y-4">
        {objectives.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun objectif défini</h3>
              <p className="text-gray-500 mb-4">Commencez par définir vos objectifs stratégiques</p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer le premier objectif
              </Button>
            </CardContent>
          </Card>
        ) : (
          objectives.map((objective) => {
            const progress = calculateProgress(objective);
            const overdue = isOverdue(objective.deadline);
            
            return (
              <Card key={objective.id} className={`transition-shadow hover:shadow-md ${overdue ? 'border-red-200 bg-red-50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{objective.title}</h4>
                        {getStatusBadge(objective.status)}
                        {getPriorityBadge(objective.priority)}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{objective.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Progression</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={progress} className="flex-1" />
                            <span className="text-sm font-medium">{progress}%</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {objective.current_value} / {objective.target_value}
                          </p>
                        </div>
                        
                        {objective.deadline && (
                          <div>
                            <p className="text-sm text-gray-500">Échéance</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className={`text-sm ${overdue ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                                {new Date(objective.deadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm text-gray-500">Catégorie</p>
                          <Badge variant="outline" className="mt-1">
                            {objective.category}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Mise à jour rapide de la progression */}
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Valeur actuelle:</Label>
                        <Input
                          type="number"
                          value={objective.current_value}
                          onChange={(e) => updateProgress(objective.id, parseInt(e.target.value) || 0)}
                          className="w-20 h-8"
                          min="0"
                          max={objective.target_value}
                        />
                        <span className="text-sm text-gray-500">/ {objective.target_value}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(objective)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(objective.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal de création/édition */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingObjective ? 'Modifier l\'objectif' : 'Nouvel objectif stratégique'}
            </DialogTitle>
            <DialogDescription>
              Définissez un objectif mesurable avec échéance et priorité
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Titre de l'objectif *</Label>
              <Input
                id="title"
                value={objectiveForm.title}
                onChange={(e) => setObjectiveForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Trouver un stage en développement web"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={objectiveForm.description}
                onChange={(e) => setObjectiveForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez votre objectif en détail..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target_value">Valeur cible *</Label>
                <Input
                  id="target_value"
                  type="number"
                  value={objectiveForm.target_value}
                  onChange={(e) => setObjectiveForm(prev => ({ ...prev, target_value: parseInt(e.target.value) || 1 }))}
                  min="1"
                />
              </div>
              
              <div>
                <Label htmlFor="deadline">Échéance</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={objectiveForm.deadline}
                  onChange={(e) => setObjectiveForm(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priorité</Label>
                <select
                  id="priority"
                  value={objectiveForm.priority}
                  onChange={(e) => setObjectiveForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {(config.priorityLevels || ['high', 'medium', 'low']).map(level => (
                    <option key={level} value={level}>
                      {level === 'critical' ? 'Critique' :
                       level === 'high' ? 'Haute' :
                       level === 'medium' ? 'Moyenne' : 'Basse'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <select
                  id="category"
                  value={objectiveForm.category}
                  onChange={(e) => setObjectiveForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {(config.categories || ['general']).map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button onClick={handleSubmit}>
                <Save className="h-4 w-4 mr-2" />
                {editingObjective ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StrategicObjectives;