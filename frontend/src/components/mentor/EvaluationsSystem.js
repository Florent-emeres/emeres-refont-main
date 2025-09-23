import React, { useState, useEffect } from 'react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import EmeresInput from '../ui/EmeresInput';
import { 
  Award, 
  Plus,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Save,
  X,
  Filter,
  Calendar,
  User,
  Activity,
  MessageSquare,
  FileText,
  Download,
  Upload,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Zap,
  Clock,
  Flag,
  ArrowUp,
  ArrowDown,
  Minus,
  Info
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EvaluationsSystem = ({ selectedStudent, evaluations, setEvaluations }) => {
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // list, charts, history

  // Formulaire d'évaluation
  const [evaluationForm, setEvaluationForm] = useState({
    evaluation_period: 'monthly',
    period_start: '',
    period_end: '',
    autonomy_score: 3,
    communication_score: 3,
    quality_score: 3,
    progression_score: 3,
    strengths: [],
    improvement_areas: [],
    qualitative_feedback: '',
    milestones_achieved: [],
    badges_earned: []
  });

  // Prédéfinis pour les forces et axes d'amélioration
  const predefinedStrengths = [
    'Ponctualité', 'Motivation', 'Curiosité', 'Autonomie', 'Créativité',
    'Communication claire', 'Travail en équipe', 'Résolution de problèmes',
    'Adaptation', 'Initiative', 'Organisation', 'Persévérance'
  ];

  const predefinedImprovements = [
    'Gestion du temps', 'Prise d\'initiative', 'Communication écrite',
    'Confiance en soi', 'Présentation orale', 'Organisation du travail',
    'Gestion du stress', 'Esprit critique', 'Planification', 'Suivi des objectifs'
  ];

  const availableBadges = [
    { id: 'first_objective', name: 'Premier Objectif', icon: '🎯', description: 'Premier objectif complété' },
    { id: 'consistent', name: 'Régularité', icon: '📈', description: '4 semaines consécutives d\'activité' },
    { id: 'communicator', name: 'Communicateur', icon: '💬', description: 'Excellente communication' },
    { id: 'problem_solver', name: 'Résoluteur', icon: '🧩', description: 'Excellent en résolution de problèmes' },
    { id: 'leader', name: 'Leader', icon: '👑', description: 'Qualités de leadership démontrées' },
    { id: 'creative', name: 'Créatif', icon: '🎨', description: 'Solutions créatives trouvées' },
    { id: 'mentor', name: 'Aide les autres', icon: '🤝', description: 'Aide ses pairs' },
    { id: 'perfectionist', name: 'Perfectionniste', icon: '⭐', description: 'Travail de haute qualité constant' }
  ];

  useEffect(() => {
    if (selectedStudent) {
      loadEvaluations();
    }
  }, [selectedStudent]);

  const loadEvaluations = async () => {
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/students/${selectedStudent.relation.student_id}/evaluations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvaluations(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des évaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvaluation = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/students/${selectedStudent.relation.student_id}/evaluations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(evaluationForm)
      });

      if (response.ok) {
        const newEvaluation = await response.json();
        setEvaluations([newEvaluation, ...evaluations]);
        setShowEvaluationForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'évaluation:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEvaluationForm({
      evaluation_period: 'monthly',
      period_start: '',
      period_end: '',
      autonomy_score: 3,
      communication_score: 3,
      quality_score: 3,
      progression_score: 3,
      strengths: [],
      improvement_areas: [],
      qualitative_feedback: '',
      milestones_achieved: [],
      badges_earned: []
    });
    setEditingEvaluation(null);
  };

  const handleInputChange = (field, value) => {
    setEvaluationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value, isChecked) => {
    setEvaluationForm(prev => ({
      ...prev,
      [field]: isChecked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const calculateOverallScore = () => {
    const { autonomy_score, communication_score, quality_score, progression_score } = evaluationForm;
    return ((autonomy_score + communication_score + quality_score + progression_score) / 4).toFixed(1);
  };

  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-blue-600';
    if (score >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 3.5) return 'Bien';
    if (score >= 2.5) return 'Satisfaisant';
    return 'À améliorer';
  };

  const getTrendIcon = (current, previous) => {
    if (current > previous) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (current < previous) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const filteredEvaluations = evaluations.filter(evaluation => {
    if (filterPeriod === 'all') return true;
    return evaluation.evaluation_period === filterPeriod;
  });

  const getAverageScores = () => {
    if (evaluations.length === 0) return null;
    
    const totals = evaluations.reduce((acc, evaluation) => ({
      autonomy: acc.autonomy + evaluation.autonomy_score,
      communication: acc.communication + evaluation.communication_score,
      quality: acc.quality + evaluation.quality_score,
      progression: acc.progression + evaluation.progression_score,
      overall: acc.overall + evaluation.overall_score
    }), { autonomy: 0, communication: 0, quality: 0, progression: 0, overall: 0 });

    const count = evaluations.length;
    return {
      autonomy: (totals.autonomy / count).toFixed(1),
      communication: (totals.communication / count).toFixed(1),
      quality: (totals.quality / count).toFixed(1),
      progression: (totals.progression / count).toFixed(1),
      overall: (totals.overall / count).toFixed(1)
    };
  };

  if (!selectedStudent) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Sélectionnez un étudiant
          </h3>
          <p className="text-gray-600">
            Choisissez un étudiant pour gérer ses évaluations
          </p>
        </div>
      </div>
    );
  }

  const averageScores = getAverageScores();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Évaluations & Feedback
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Suivi des performances de {selectedStudent.student.first_name} {selectedStudent.student.last_name}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <EmeresButton
            variant="secondary"
            icon={<Download />}
            size="sm"
          >
            Exporter
          </EmeresButton>
          <EmeresButton
            variant="primary"
            icon={<Plus />}
            onClick={() => setShowEvaluationForm(true)}
          >
            Nouvelle Évaluation
          </EmeresButton>
        </div>
      </div>

      {/* Modes d'affichage et filtres */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-2">
          {['list', 'charts', 'history'].map((mode) => (
            <EmeresButton
              key={mode}
              variant={viewMode === mode ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode(mode)}
            >
              {mode === 'list' ? 'Liste' : mode === 'charts' ? 'Graphiques' : 'Historique'}
            </EmeresButton>
          ))}
        </div>

        <div className="flex gap-2">
          {['all', 'weekly', 'monthly', 'session', 'milestone'].map((period) => (
            <EmeresButton
              key={period}
              variant={filterPeriod === period ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterPeriod(period)}
            >
              {period === 'all' ? 'Toutes' : 
               period === 'weekly' ? 'Hebdo' :
               period === 'monthly' ? 'Mensuelles' :
               period === 'session' ? 'Sessions' : 'Jalons'}
            </EmeresButton>
          ))}
        </div>
      </div>

      {/* Vue selon le mode sélectionné */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Scores moyens */}
          {averageScores && (
            <EmeresCard>
              <EmeresCardHeader>
                <EmeresCardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-teal-600" />
                  Performances Moyennes
                </EmeresCardTitle>
              </EmeresCardHeader>
              <EmeresCardContent>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <ScoreCard 
                    title="Autonomie"
                    score={averageScores.autonomy}
                    icon={User}
                  />
                  <ScoreCard 
                    title="Communication"
                    score={averageScores.communication}
                    icon={MessageSquare}
                  />
                  <ScoreCard 
                    title="Qualité"
                    score={averageScores.quality}
                    icon={Star}
                  />
                  <ScoreCard 
                    title="Progression"
                    score={averageScores.progression}
                    icon={TrendingUp}
                  />
                  <ScoreCard 
                    title="Score Global"
                    score={averageScores.overall}
                    icon={Award}
                    isOverall={true}
                  />
                </div>
              </EmeresCardContent>
            </EmeresCard>
          )}

          {/* Liste des évaluations */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des évaluations...</p>
              </div>
            ) : filteredEvaluations.length > 0 ? (
              filteredEvaluations.map((evaluation, index) => (
                <EvaluationCard
                  key={evaluation.id}
                  evaluation={evaluation}
                  previousEvaluation={evaluations[index + 1]}
                  onEdit={setEditingEvaluation}
                />
              ))
            ) : (
              <EmeresCard>
                <EmeresCardContent className="text-center py-12">
                  <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Aucune évaluation trouvée
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Créez la première évaluation pour cet étudiant
                  </p>
                  <EmeresButton
                    variant="primary"
                    icon={<Plus />}
                    onClick={() => setShowEvaluationForm(true)}
                  >
                    Créer une Évaluation
                  </EmeresButton>
                </EmeresCardContent>
              </EmeresCard>
            )}
          </div>
        </div>
      )}

      {viewMode === 'charts' && (
        <ChartsView evaluations={evaluations} />
      )}

      {viewMode === 'history' && (
        <HistoryView evaluations={evaluations} />
      )}

      {/* Modal de création/édition d'évaluation */}
      {showEvaluationForm && (
        <EvaluationFormModal
          evaluation={editingEvaluation}
          evaluationForm={evaluationForm}
          setEvaluationForm={setEvaluationForm}
          onSubmit={createEvaluation}
          onClose={() => {
            setShowEvaluationForm(false);
            resetForm();
          }}
          onInputChange={handleInputChange}
          onArrayChange={handleArrayChange}
          calculateOverallScore={calculateOverallScore}
          predefinedStrengths={predefinedStrengths}
          predefinedImprovements={predefinedImprovements}
          availableBadges={availableBadges}
          loading={loading}
        />
      )}
    </div>
  );
};

// Composant de carte de score
const ScoreCard = ({ title, score, icon: Icon, isOverall = false }) => {
  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-blue-600';
    if (score >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressColor = (score) => {
    if (score >= 4.5) return 'bg-green-500';
    if (score >= 3.5) return 'bg-blue-500';
    if (score >= 2.5) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={`text-center p-4 rounded-lg ${isOverall ? 'bg-teal-50 border-2 border-teal-200' : 'bg-gray-50'}`}>
      <Icon className={`h-6 w-6 mx-auto mb-2 ${isOverall ? 'text-teal-600' : 'text-gray-600'}`} />
      <div className={`text-2xl font-bold mb-1 ${getScoreColor(score)}`}>
        {score}
      </div>
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(score)}`}
          style={{ width: `${(score / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

// Composant de carte d'évaluation
const EvaluationCard = ({ evaluation, previousEvaluation, onEdit }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getTrendIcon = (current, previous) => {
    if (!previous) return null;
    if (current > previous) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (current < previous) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-blue-600';
    if (score >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <EmeresCard>
      <EmeresCardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Évaluation {evaluation.evaluation_period}
              </h3>
              <EmeresBadge variant="outline" size="sm">
                {evaluation.evaluation_period}
              </EmeresBadge>
            </div>
            <p className="text-gray-600">
              {new Date(evaluation.period_start).toLocaleDateString('fr-FR')} - {new Date(evaluation.period_end).toLocaleDateString('fr-FR')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(evaluation.overall_score)}`}>
                {evaluation.overall_score.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">/ 5</div>
            </div>
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
              onClick={() => onEdit(evaluation)}
            />
          </div>
        </div>

        {/* Scores détaillés */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <User className="h-4 w-4 text-blue-600" />
              {previousEvaluation && getTrendIcon(evaluation.autonomy_score, previousEvaluation.autonomy_score)}
            </div>
            <div className="text-lg font-bold text-blue-600">{evaluation.autonomy_score}</div>
            <div className="text-xs text-gray-600">Autonomie</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MessageSquare className="h-4 w-4 text-green-600" />
              {previousEvaluation && getTrendIcon(evaluation.communication_score, previousEvaluation.communication_score)}
            </div>
            <div className="text-lg font-bold text-green-600">{evaluation.communication_score}</div>
            <div className="text-xs text-gray-600">Communication</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-4 w-4 text-purple-600" />
              {previousEvaluation && getTrendIcon(evaluation.quality_score, previousEvaluation.quality_score)}
            </div>
            <div className="text-lg font-bold text-purple-600">{evaluation.quality_score}</div>
            <div className="text-xs text-gray-600">Qualité</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              {previousEvaluation && getTrendIcon(evaluation.progression_score, previousEvaluation.progression_score)}
            </div>
            <div className="text-lg font-bold text-orange-600">{evaluation.progression_score}</div>
            <div className="text-xs text-gray-600">Progression</div>
          </div>
        </div>

        {/* Points forts et axes d'amélioration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-green-600" />
              Points forts
            </h4>
            <div className="flex flex-wrap gap-1">
              {evaluation.strengths.map((strength, index) => (
                <EmeresBadge key={index} variant="success" size="sm">
                  {strength}
                </EmeresBadge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-600" />
              Axes d'amélioration
            </h4>
            <div className="flex flex-wrap gap-1">
              {evaluation.improvement_areas.map((area, index) => (
                <EmeresBadge key={index} variant="secondary" size="sm">
                  {area}
                </EmeresBadge>
              ))}
            </div>
          </div>
        </div>

        {/* Badges obtenus */}
        {evaluation.badges_earned && evaluation.badges_earned.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-600" />
              Badges obtenus
            </h4>
            <div className="flex flex-wrap gap-2">
              {evaluation.badges_earned.map((badge, index) => (
                <div key={index} className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                  <span className="text-sm">{badge.icon || '🏆'}</span>
                  <span className="text-sm font-medium text-amber-800">{badge.name || badge}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Commentaire détaillé (expandable) */}
        {showDetails && evaluation.qualitative_feedback && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-600" />
              Commentaires détaillés
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 text-sm">{evaluation.qualitative_feedback}</p>
            </div>
          </div>
        )}
      </EmeresCardContent>
    </EmeresCard>
  );
};

// Vue graphiques (placeholder)
const ChartsView = ({ evaluations }) => (
  <div className="space-y-6">
    <EmeresCard>
      <EmeresCardHeader>
        <EmeresCardTitle>Évolution des Performances</EmeresCardTitle>
      </EmeresCardHeader>
      <EmeresCardContent className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Graphiques en cours de développement...</p>
      </EmeresCardContent>
    </EmeresCard>
  </div>
);

// Vue historique (placeholder)
const HistoryView = ({ evaluations }) => (
  <div className="space-y-6">
    <EmeresCard>
      <EmeresCardHeader>
        <EmeresCardTitle>Historique Complet</EmeresCardTitle>
      </EmeresCardHeader>
      <EmeresCardContent className="text-center py-12">
        <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Vue historique en cours de développement...</p>
      </EmeresCardContent>
    </EmeresCard>
  </div>
);

// Modal de formulaire d'évaluation
const EvaluationFormModal = ({ 
  evaluation, 
  evaluationForm, 
  setEvaluationForm, 
  onSubmit, 
  onClose, 
  onInputChange,
  onArrayChange,
  calculateOverallScore,
  predefinedStrengths,
  predefinedImprovements,
  availableBadges,
  loading 
}) => {
  const isEditing = !!evaluation;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Modifier l\'évaluation' : 'Nouvelle Évaluation'}
            </h2>
            <EmeresButton variant="ghost" size="sm" icon={<X />} onClick={onClose} />
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-600" />
              Période d'Évaluation
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de période
                </label>
                <select
                  value={evaluationForm.evaluation_period}
                  onChange={(e) => onInputChange('evaluation_period', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuelle</option>
                  <option value="session">Par session</option>
                  <option value="milestone">Jalon</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Début de période *
                </label>
                <input
                  type="date"
                  value={evaluationForm.period_start}
                  onChange={(e) => onInputChange('period_start', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fin de période *
                </label>
                <input
                  type="date"
                  value={evaluationForm.period_end}
                  onChange={(e) => onInputChange('period_end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Scores des 4 critères */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-600" />
              Évaluation (4 Critères)
              <EmeresBadge variant="primary" size="sm">
                Score global: {calculateOverallScore()}/5
              </EmeresBadge>
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScoreSlider
                title="Autonomie"
                description="Capacité à travailler de manière indépendante"
                icon={User}
                value={evaluationForm.autonomy_score}
                onChange={(value) => onInputChange('autonomy_score', value)}
              />
              
              <ScoreSlider
                title="Communication"
                description="Clarté et efficacité de la communication"
                icon={MessageSquare}
                value={evaluationForm.communication_score}
                onChange={(value) => onInputChange('communication_score', value)}
              />
              
              <ScoreSlider
                title="Qualité du Travail"
                description="Standard et excellence du travail produit"
                icon={Star}
                value={evaluationForm.quality_score}
                onChange={(value) => onInputChange('quality_score', value)}
              />
              
              <ScoreSlider
                title="Progression"
                description="Amélioration et développement des compétences"
                icon={TrendingUp}
                value={evaluationForm.progression_score}
                onChange={(value) => onInputChange('progression_score', value)}
              />
            </div>
          </div>

          {/* Points forts et axes d'amélioration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-green-600" />
                Points Forts
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {predefinedStrengths.map((strength) => (
                  <label key={strength} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={evaluationForm.strengths.includes(strength)}
                      onChange={(e) => onArrayChange('strengths', strength, e.target.checked)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">{strength}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Axes d'Amélioration
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {predefinedImprovements.map((improvement) => (
                  <label key={improvement} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={evaluationForm.improvement_areas.includes(improvement)}
                      onChange={(e) => onArrayChange('improvement_areas', improvement, e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{improvement}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Badges disponibles */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-600" />
              Badges à Attribuer
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {availableBadges.map((badge) => (
                <label key={badge.id} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={evaluationForm.badges_earned.some(b => (typeof b === 'string' ? b : b.id) === badge.id)}
                    onChange={(e) => onArrayChange('badges_earned', badge, e.target.checked)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="flex items-center gap-1 font-medium text-sm">
                      <span>{badge.icon}</span>
                      <span>{badge.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">{badge.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Commentaire qualitatif */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commentaires Détaillés
            </label>
            <textarea
              value={evaluationForm.qualitative_feedback}
              onChange={(e) => onInputChange('qualitative_feedback', e.target.value)}
              placeholder="Commentaires détaillés sur les performances, recommandations, observations..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
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
              {loading ? 'Enregistrement...' : (isEditing ? 'Modifier' : 'Créer l\'évaluation')}
            </EmeresButton>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant slider de score
const ScoreSlider = ({ title, description, icon: Icon, value, onChange }) => {
  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-blue-600';
    if (score >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 3.5) return 'Bien';
    if (score >= 2.5) return 'Satisfaisant';
    return 'À améliorer';
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="h-5 w-5 text-gray-600" />
        <div>
          <div className="font-medium text-gray-900">{title}</div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Score:</span>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${getScoreColor(value)}`}>
              {value}
            </span>
            <span className="text-sm text-gray-500">/ 5</span>
            <EmeresBadge variant="outline" size="xs">
              {getScoreLabel(value)}
            </EmeresBadge>
          </div>
        </div>
        
        <input
          type="range"
          min="1"
          max="5"
          step="0.5"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>1 - Insuffisant</span>
          <span>3 - Satisfaisant</span>
          <span>5 - Excellent</span>
        </div>
      </div>
    </div>
  );
};

export default EvaluationsSystem;