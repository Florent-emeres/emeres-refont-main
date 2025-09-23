import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { CheckCircle, Circle, Plus, Clock, Target, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

const ProjectTracker = ({ project, onProjectUpdate }) => {
  const [newTask, setNewTask] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const statusConfig = {
    'todo': { label: 'À faire', color: 'bg-gray-100 text-gray-700', icon: Circle },
    'in-progress': { label: 'En cours', color: 'bg-blue-100 text-blue-700', icon: Clock },
    'completed': { label: 'Terminé', color: 'bg-green-100 text-green-700', icon: CheckCircle }
  };

  const tasks = project.tasks || [];
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const progressPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now().toString(),
      title: newTask.trim(),
      status: 'todo',
      createdAt: new Date().toISOString()
    };
    
    const updatedProject = {
      ...project,
      tasks: [...tasks, task]
    };
    
    onProjectUpdate(updatedProject);
    setNewTask('');
    setShowAddTask(false);
    toast.success('Tâche ajoutée');
  };

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } : task
    );
    
    const updatedProject = {
      ...project,
      tasks: updatedTasks
    };
    
    onProjectUpdate(updatedProject);
  };

  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    const updatedProject = {
      ...project,
      tasks: updatedTasks
    };
    
    onProjectUpdate(updatedProject);
    toast.success('Tâche supprimée');
  };

  // Conseils IA contextuels
  const getAIAdvice = () => {
    const advices = [];
    
    if (tasks.length === 0) {
      advices.push("Commencez par définir les tâches principales de votre projet");
    }
    
    if (!project.proofs || project.proofs.length === 0) {
      advices.push("Ajoutez des preuves pour crédibiliser votre projet");
    }
    
    if (!project.technologies || project.technologies.length === 0) {
      advices.push("Précisez les technologies utilisées pour un meilleur matching");
    }
    
    if (completedTasks === tasks.length && tasks.length > 0) {
      advices.push("Projet terminé ! Pensez à demander une validation par un mentor");
    }
    
    return advices;
  };

  const aiAdvices = getAIAdvice();

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Suivi du projet</span>
            </div>
            <Badge variant="outline">
              {completedTasks}/{tasks.length} tâches
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          {/* AI Advice */}
          {aiAdvices.length > 0 && (
            <div className="bg-gray-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800 mb-2">Conseils pour améliorer votre projet</h4>
                  <ul className="space-y-1">
                    {aiAdvices.map((advice, index) => (
                      <li key={index} className="text-sm text-amber-700">• {advice}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Board */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tableau de bord des tâches</span>
            <Button 
              size="sm" 
              onClick={() => setShowAddTask(!showAddTask)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter tâche
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Task Form */}
          {showAddTask && (
            <div className="flex space-x-2">
              <Input
                placeholder="Nouvelle tâche..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <Button onClick={addTask} size="sm">Ajouter</Button>
              <Button onClick={() => setShowAddTask(false)} variant="outline" size="sm">
                Annuler
              </Button>
            </div>
          )}

          {/* Task Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(statusConfig).map(([status, config]) => {
              const statusTasks = tasks.filter(task => task.status === status);
              const StatusIcon = config.icon;
              
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <StatusIcon className="h-4 w-4" />
                    <h4 className="font-medium text-sm">{config.label}</h4>
                    <Badge variant="outline" className="text-xs">
                      {statusTasks.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 min-h-[100px] p-2 bg-gray-50 rounded-lg">
                    {statusTasks.map(task => (
                      <div key={task.id} className="bg-white p-3 rounded border shadow-sm">
                        <p className="text-sm font-medium">{task.title}</p>
                        <div className="flex justify-between items-center mt-2">
                          <select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                            className="text-xs border rounded px-2 py-1"
                          >
                            <option value="todo">À faire</option>
                            <option value="in-progress">En cours</option>
                            <option value="completed">Terminé</option>
                          </select>
                          <button
                            onClick={() => removeTask(task.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectTracker;