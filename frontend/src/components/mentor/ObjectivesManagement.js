import React, { useState, useEffect } from 'react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import EmeresInput from '../ui/EmeresInput';
import { 
  Target, 
  Plus,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Flag,
  TrendingUp,
  Eye,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Filter,
  Search,
  BookOpen,
  Lightbulb,
  Zap,
  Activity
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ObjectivesManagement = ({ selectedStudent, objectives, setObjectives }) => {
  const [showObjectiveForm, setShowObjectiveForm] = useState(false);
  const [editingObjective, setEditingObjective] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Formulaire pour nouvel objectif
  const [objectiveForm, setObjectiveForm] = useState({
    title: '',
    description: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    time_bound: '',
    due_date: '',
    priority: 'medium'
  });

  useEffect(() => {
    if (selectedStudent) {
      loadObjectives();
    }
  }, [selectedStudent]);

  const loadObjectives = async () => {
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/students/${selectedStudent.relation.student_id}/objectives`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setObjectives(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des objectifs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateObjective = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/students/${selectedStudent.relation.student_id}/objectives`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(objectiveForm)
      });

      if (response.ok) {
        const newObjective = await response.json();
        setObjectives([newObjective, ...objectives]);
        setShowObjectiveForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'objectif:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateObjective = async (objectiveId, updateData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/objectives/${objectiveId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        await loadObjectives(); // Recharger la liste
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'objectif:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setObjectiveForm({
      title: '',
      description: '',
      specific: '',
      measurable: '',
      achievable: '',
      relevant: '',
      time_bound: '',
      due_date: '',
      priority: 'medium'
    });
    setEditingObjective(null);
  };

  const filteredObjectives = objectives.filter(objective => {
    const matchesSearch = searchTerm === '' || 
      objective.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      objective.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || objective.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || objective.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { variant: 'primary', label: 'Actif', icon: Clock },
      'in_progress': { variant: 'secondary', label: 'En cours', icon: Activity },
      'completed': { variant: 'success', label: 'Terminé', icon: CheckCircle },
      'cancelled': { variant: 'error', label: 'Annulé', icon: X }
    };
    return statusConfig[status] || { variant: 'secondary', label: status, icon: Clock };
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'low': { variant: 'secondary', label: 'Faible', color: 'text-gray-600' },
      'medium': { variant: 'primary', label: 'Moyenne', color: 'text-blue-600' },
      'high': { variant: 'error', label: 'Haute', color: 'text-red-600' }
    };
    return priorityConfig[priority] || { variant: 'secondary', label: priority, color: 'text-gray-600' };
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (!selectedStudent) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Sélectionnez un étudiant
          </h3>
          <p className="text-gray-600">
            Choisissez un étudiant pour gérer ses objectifs SMART
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Objectifs SMART
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Gestion des objectifs pour {selectedStudent.student.first_name} {selectedStudent.student.last_name}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <EmeresButton
            variant="secondary"
            icon={<Filter />}
            size="sm"
          >
            Filtrer
          </EmeresButton>
          <EmeresButton
            variant="primary"
            icon={<Plus />}
            onClick={() => setShowObjectiveForm(true)}
          >
            Nouvel Objectif
          </EmeresButton>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <EmeresInput
            placeholder="Rechercher un objectif..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Filtres de statut */}
          {['all', 'active', 'in_progress', 'completed'].map((status) => (
            <EmeresButton
              key={status}
              variant={filterStatus === status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'Tous' : 
               status === 'active' ? 'Actifs' :
               status === 'in_progress' ? 'En cours' : 'Terminés'}
            </EmeresButton>
          ))}
          
          {/* Filtres de priorité */}
          {['all', 'high', 'medium', 'low'].map((priority) => (
            <EmeresButton
              key={priority}
              variant={filterPriority === priority ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterPriority(priority)}
            >
              {priority === 'all' ? 'Toutes' : 
               priority === 'high' ? 'Haute' :
               priority === 'medium' ? 'Moyenne' : 'Faible'}
            </EmeresButton>
          ))}
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <EmeresCard>
          <EmeresCardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{objectives.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </EmeresCardContent>
        </EmeresCard>
        <EmeresCard>
          <EmeresCardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {objectives.filter(obj => obj.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Terminés</div>
          </EmeresCardContent>
        </EmeresCard>
        <EmeresCard>
          <EmeresCardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {objectives.filter(obj => obj.status === 'in_progress').length}
            </div>
            <div className="text-sm text-gray-600">En cours</div>
          </EmeresCardContent>
        </EmeresCard>
        <EmeresCard>
          <EmeresCardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {objectives.filter(obj => isOverdue(obj.due_date) && obj.status !== 'completed').length}
            </div>
            <div className="text-sm text-gray-600">En retard</div>
          </EmeresCardContent>
        </EmeresCard>
      </div>

      {/* Liste des objectifs */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des objectifs...</p>
          </div>
        ) : filteredObjectives.length > 0 ? (
          filteredObjectives.map((objective) => (
            <ObjectiveCard
              key={objective.id}
              objective={objective}
              onUpdate={handleUpdateObjective}
              onEdit={setEditingObjective}
            />
          ))
        ) : (
          <EmeresCard>
            <EmeresCardContent className="text-center py-12">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Aucun objectif trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                Créez le premier objectif SMART pour cet étudiant
              </p>
              <EmeresButton
                variant="primary"
                icon={<Plus />}
                onClick={() => setShowObjectiveForm(true)}
              >
                Créer un Objectif
              </EmeresButton>
            </EmeresCardContent>
          </EmeresCard>
        )}
      </div>

      {/* Modal de création/édition d'objectif */}
      {showObjectiveForm && (
        <ObjectiveFormModal
          objective={editingObjective}
          objectiveForm={objectiveForm}
          setObjectiveForm={setObjectiveForm}
          onSubmit={handleCreateObjective}
          onClose={() => {
            setShowObjectiveForm(false);
            resetForm();
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

// Composant pour une carte d'objectif
const ObjectiveCard = ({ objective, onUpdate, onEdit }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [progressUpdate, setProgressUpdate] = useState(objective.progress_percentage);
  
  const statusBadge = {
    'active': { variant: 'primary', label: 'Actif', icon: Clock },
    'in_progress': { variant: 'secondary', label: 'En cours', icon: Activity },
    'completed': { variant: 'success', label: 'Terminé', icon: CheckCircle },
    'cancelled': { variant: 'error', label: 'Annulé', icon: X }
  }[objective.status] || { variant: 'secondary', label: objective.status, icon: Clock };

  const priorityBadge = {
    'low': { variant: 'secondary', label: 'Faible', color: 'text-gray-600' },
    'medium': { variant: 'primary', label: 'Moyenne', color: 'text-blue-600' },
    'high': { variant: 'error', label: 'Haute', color: 'text-red-600' }
  }[objective.priority] || { variant: 'secondary', label: objective.priority, color: 'text-gray-600' };

  const StatusIcon = statusBadge.icon;
  const isOverdue = new Date(objective.due_date) < new Date() && objective.status !== 'completed';
  const daysUntilDue = Math.ceil((new Date(objective.due_date) - new Date()) / (1000 * 60 * 60 * 24));

  const handleProgressUpdate = () => {
    onUpdate(objective.id, { 
      progress_percentage: progressUpdate,
      status: progressUpdate === 100 ? 'completed' : 'in_progress'
    });
  };

  const handleStatusChange = (newStatus) => {
    onUpdate(objective.id, { 
      status: newStatus,
      ...(newStatus === 'completed' && { progress_percentage: 100 })
    });
  };

  return (
    <EmeresCard className={`${isOverdue ? 'ring-2 ring-red-200' : ''}`}>
      <EmeresCardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{objective.title}</h3>
              {isOverdue && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>En retard</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 mb-3">{objective.description}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className={isOverdue ? 'text-red-600' : 'text-gray-600'}>
                  Échéance: {new Date(objective.due_date).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Flag className={`h-4 w-4 ${priorityBadge.color}`} />
                <span className={priorityBadge.color}>
                  Priorité {priorityBadge.label}
                </span>
              </div>
              {!isOverdue && daysUntilDue > 0 && (
                <span className="text-gray-500">
                  Dans {daysUntilDue} jour{daysUntilDue > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <EmeresBadge variant={statusBadge.variant} size="sm">
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusBadge.label}
            </EmeresBadge>
            <EmeresButton
              variant="ghost"
              size="sm"
              icon={<Eye />}
              onClick={() => setShowDetails(!showDetails)}
            />
            <EmeresButton
              variant="ghost"
              size="sm"
              icon={<Edit />}
              onClick={() => onEdit(objective)}
            />
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progression</span>
            <span className="text-sm text-gray-600">{objective.progress_percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                objective.status === 'completed' ? 'bg-green-500' : 'bg-teal-500'
              }`}
              style={{ width: `${objective.progress_percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={progressUpdate}
              onChange={(e) => setProgressUpdate(parseInt(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-gray-600">{progressUpdate}%</span>
            <EmeresButton
              variant="outline"
              size="sm"
              onClick={handleProgressUpdate}
              disabled={progressUpdate === objective.progress_percentage}
            >
              Mettre à jour
            </EmeresButton>
          </div>
          
          <div className="flex items-center gap-1">
            {objective.status !== 'completed' && (
              <EmeresButton
                variant="success"
                size="sm"
                icon={<CheckCircle />}
                onClick={() => handleStatusChange('completed')}
              >
                Terminer
              </EmeresButton>
            )}
            {objective.status === 'completed' && (
              <EmeresButton
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('active')}
              >
                Rouvrir
              </EmeresButton>
            )}
          </div>
        </div>

        {/* Détails SMART (expandable) */}
        {showDetails && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Détails SMART</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-700 mb-1">Spécifique</div>
                <p className="text-gray-600">{objective.specific}</p>
              </div>
              <div>
                <div className="font-medium text-gray-700 mb-1">Mesurable</div>
                <p className="text-gray-600">{objective.measurable}</p>
              </div>
              <div>
                <div className="font-medium text-gray-700 mb-1">Atteignable</div>
                <p className="text-gray-600">{objective.achievable}</p>
              </div>
              <div>
                <div className="font-medium text-gray-700 mb-1">Pertinent</div>
                <p className="text-gray-600">{objective.relevant}</p>
              </div>
              <div className="lg:col-span-2">
                <div className="font-medium text-gray-700 mb-1">Temporellement défini</div>
                <p className="text-gray-600">{objective.time_bound}</p>
              </div>
            </div>
          </div>
        )}
      </EmeresCardContent>
    </EmeresCard>
  );
};

// Modal de formulaire pour créer/éditer un objectif
const ObjectiveFormModal = ({ objective, objectiveForm, setObjectiveForm, onSubmit, onClose, loading }) => {
  const isEditing = !!objective;

  const handleInputChange = (field, value) => {
    setObjectiveForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Modifier l\'objectif' : 'Nouvel Objectif SMART'}
            </h2>
            <EmeresButton variant="ghost" size="sm" icon={<X />} onClick={onClose} />
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Target className="h-5 w-5 text-teal-600" />
              Informations Générales
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'objectif *
                </label>
                <EmeresInput
                  value={objectiveForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Maîtriser React.js"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priorité
                  </label>
                  <select
                    value={objectiveForm.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Échéance *
                  </label>
                  <input
                    type="date"
                    value={objectiveForm.due_date}
                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={objectiveForm.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Description détaillée de l'objectif..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Critères SMART */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-600" />
              Critères SMART
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">S</span>
                    Spécifique *
                  </span>
                </label>
                <textarea
                  value={objectiveForm.specific}
                  onChange={(e) => handleInputChange('specific', e.target.value)}
                  placeholder="Que voulez-vous accomplir exactement ?"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">M</span>
                    Mesurable *
                  </span>
                </label>
                <textarea
                  value={objectiveForm.measurable}
                  onChange={(e) => handleInputChange('measurable', e.target.value)}
                  placeholder="Comment mesurerez-vous les progrès ?"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">A</span>
                    Atteignable *
                  </span>
                </label>
                <textarea
                  value={objectiveForm.achievable}
                  onChange={(e) => handleInputChange('achievable', e.target.value)}
                  placeholder="Est-ce réaliste avec les ressources disponibles ?"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">R</span>
                    Pertinent *
                  </span>
                </label>
                <textarea
                  value={objectiveForm.relevant}
                  onChange={(e) => handleInputChange('relevant', e.target.value)}
                  placeholder="Pourquoi cet objectif est-il important ?"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">T</span>
                  Temporellement défini *
                </span>
              </label>
              <textarea
                value={objectiveForm.time_bound}
                onChange={(e) => handleInputChange('time_bound', e.target.value)}
                placeholder="Quand cet objectif sera-t-il terminé ?"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <EmeresButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </EmeresButton>
            <EmeresButton
              type="submit"
              variant="primary"
              icon={<Save />}
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : (isEditing ? 'Modifier' : 'Créer l\'objectif')}
            </EmeresButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ObjectivesManagement;