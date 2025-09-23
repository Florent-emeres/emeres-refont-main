import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { 
  BookOpen, 
  Target, 
  Calendar, 
  CheckCircle, 
  Clock, 
  User, 
  Building,
  Plus,
  Edit,
  Eye,
  Award,
  TrendingUp,
  FileText,
  MessageSquare,
  Star,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3
} from 'lucide-react';
import EmeresButton from './ui/EmeresButton';
import EmeresBadge from './ui/EmeresBadge';
import { useAuth } from '../App';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const InternshipJournal = () => {
  const { user } = useAuth();
  const [journals, setJournals] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [weeklyReports, setWeeklyReports] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [progress, setProgress] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showCreateJournal, setShowCreateJournal] = useState(false);
  const [showCreateObjective, setShowCreateObjective] = useState(false);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);

  // Form states
  const [journalForm, setJournalForm] = useState({
    internship_title: '',
    internship_description: '',
    start_date: '',
    end_date: '',
    company_id: '',
    school_tutor_id: '',
    company_tutor_id: '',
    mentor_id: ''
  });

  const [objectiveForm, setObjectiveForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    skills_developed: '',
    deliverables: ''
  });

  const [reportForm, setReportForm] = useState({
    week_number: 1,
    start_date: '',
    end_date: '',
    tasks_completed: '',
    difficulties_encountered: '',
    skills_learned: '',
    student_notes: '',
    time_spent_hours: 40
  });

  useEffect(() => {
    loadJournals();
  }, []);

  const loadJournals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/internship/journals/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setJournals(data.journals || []);
        
        // Load first journal if available
        if (data.journals && data.journals.length > 0) {
          loadJournalDetails(data.journals[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading journals:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadJournalDetails = async (journalId) => {
    try {
      const token = localStorage.getItem('token');
      
      // Load journal details
      const [journalRes, progressRes] = await Promise.all([
        fetch(`${API}/internship/journal/${journalId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API}/internship/journal/${journalId}/progress`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (journalRes.ok) {
        const journalData = await journalRes.json();
        setSelectedJournal(journalData.journal);
        setObjectives(journalData.objectives || []);
        setWeeklyReports(journalData.weekly_reports || []);
        setEvaluations(journalData.evaluations || []);
      }

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(progressData);
      }
    } catch (error) {
      console.error('Error loading journal details:', error);
    }
  };

  const createJournal = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/internship/journal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...journalForm,
          student_id: user.id
        })
      });

      if (response.ok) {
        setShowCreateJournal(false);
        setJournalForm({
          internship_title: '',
          internship_description: '',
          start_date: '',
          end_date: '',
          company_id: '',
          school_tutor_id: '',
          company_tutor_id: '',
          mentor_id: ''
        });
        loadJournals();
      }
    } catch (error) {
      console.error('Error creating journal:', error);
    }
  };

  const createObjective = async (e) => {
    e.preventDefault();
    if (!selectedJournal) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/internship/journal/${selectedJournal.id}/objectives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...objectiveForm,
          assigned_by: user.id,
          assigned_to: selectedJournal.student_id,
          skills_developed: objectiveForm.skills_developed.split(',').map(s => s.trim()),
          deliverables: objectiveForm.deliverables.split(',').map(s => s.trim())
        })
      });

      if (response.ok) {
        setShowCreateObjective(false);
        setObjectiveForm({
          title: '',
          description: '',
          priority: 'medium',
          due_date: '',
          skills_developed: '',
          deliverables: ''
        });
        loadJournalDetails(selectedJournal.id);
      }
    } catch (error) {
      console.error('Error creating objective:', error);
    }
  };

  const createWeeklyReport = async (e) => {
    e.preventDefault();
    if (!selectedJournal) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/internship/journal/${selectedJournal.id}/weekly-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...reportForm,
          internship_id: selectedJournal.id,
          tasks_completed: reportForm.tasks_completed.split('\n').filter(t => t.trim()),
          difficulties_encountered: reportForm.difficulties_encountered.split('\n').filter(t => t.trim()),
          skills_learned: reportForm.skills_learned.split('\n').filter(t => t.trim())
        })
      });

      if (response.ok) {
        setShowWeeklyReport(false);
        setReportForm({
          week_number: reportForm.week_number + 1,
          start_date: '',
          end_date: '',
          tasks_completed: '',
          difficulties_encountered: '',
          skills_learned: '',
          student_notes: '',
          time_spent_hours: 40
        });
        loadJournalDetails(selectedJournal.id);
      }
    } catch (error) {
      console.error('Error creating weekly report:', error);
    }
  };

  const updateObjectiveProgress = async (objectiveId, progress, note = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/internship/objectives/${objectiveId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          completion_percentage: progress,
          note: note,
          updated_by: user.id
        })
      });

      if (response.ok) {
        loadJournalDetails(selectedJournal.id);
      }
    } catch (error) {
      console.error('Error updating objective progress:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'blocked': return 'text-red-600 bg-red-100';
      case 'not_started': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-amber-600 bg-blue-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getRoleFeatures = () => {
    switch (user?.role) {
      case 'student':
        return {
          canCreateJournal: true,
          canCreateObjective: false,
          canUpdateProgress: true,
          canCreateReport: true,
          canValidate: false
        };
      case 'company':
      case 'school':
      case 'mentor':
        return {
          canCreateJournal: false,
          canCreateObjective: true,
          canUpdateProgress: false,
          canCreateReport: false,
          canValidate: true
        };
      default:
        return {
          canCreateJournal: false,
          canCreateObjective: false,
          canUpdateProgress: false,
          canCreateReport: false,
          canValidate: false
        };
    }
  };

  const roleFeatures = getRoleFeatures();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Clock className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2">Chargement du journal de bord...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Journal de Bord</h2>
            <p className="text-gray-600">Suivi structuré des stages et objectifs</p>
          </div>
        </div>

        {roleFeatures.canCreateJournal && (
          <EmeresButton onClick={() => setShowCreateJournal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Journal
          </EmeresButton>
        )}
      </div>

      {/* Journal Selection */}
      {journals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Mes Stages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {journals.map((journal) => (
                <div
                  key={journal.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedJournal?.id === journal.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => loadJournalDetails(journal.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{journal.internship_title}</h4>
                    <EmeresBadge variant={
                      journal.status === 'active' ? 'success' :
                      journal.status === 'completed' ? 'default' : 'secondary'
                    }>
                      {journal.status}
                    </EmeresBadge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {journal.internship_description}
                  </p>
                  <div className="text-xs text-gray-500">
                    {formatDate(journal.start_date)} - {formatDate(journal.end_date)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {selectedJournal ? (
        <>
          {/* Progress Overview */}
          {progress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Vue d'ensemble
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {progress.objectives?.completion_rate?.toFixed(0) || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Objectifs complétés</div>
                    <div className="text-xs text-gray-500">
                      {progress.objectives?.completed || 0}/{progress.objectives?.total || 0}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {progress.weekly_reports?.validation_rate?.toFixed(0) || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Rapports validés</div>
                    <div className="text-xs text-gray-500">
                      {progress.weekly_reports?.validated || 0}/{progress.weekly_reports?.total || 0}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {progress.evaluations?.average_score?.toFixed(0) || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Score moyen</div>
                    <div className="text-xs text-gray-500">
                      {progress.evaluations?.count || 0} évaluation{progress.evaluations?.count > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'objectives', label: 'Objectifs', icon: Target },
                { id: 'reports', label: 'Rapports', icon: FileText },
                { id: 'evaluations', label: 'Évaluations', icon: Award }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'objectives' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Objectifs du Stage</CardTitle>
                    <CardDescription>
                      Objectifs SMART et leur progression
                    </CardDescription>
                  </div>
                  {roleFeatures.canCreateObjective && (
                    <EmeresButton onClick={() => setShowCreateObjective(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvel Objectif
                    </EmeresButton>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {objectives.map((objective) => (
                      <div key={objective.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{objective.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{objective.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <EmeresBadge className={getPriorityColor(objective.priority)}>
                              {objective.priority}
                            </EmeresBadge>
                            <EmeresBadge className={getStatusColor(objective.status)}>
                              {objective.status}
                            </EmeresBadge>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Progression</span>
                            <span className="text-sm font-medium">{objective.completion_percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${objective.completion_percentage}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div>Échéance: {formatDate(objective.due_date)}</div>
                          {roleFeatures.canUpdateProgress && objective.status !== 'completed' && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateObjectiveProgress(objective.id, Math.min(100, objective.completion_percentage + 25))}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                +25%
                              </button>
                              <button
                                onClick={() => updateObjectiveProgress(objective.id, 100, 'Objectif complété')}
                                className="text-green-600 hover:text-green-800"
                              >
                                Terminer
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'reports' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Rapports Hebdomadaires</CardTitle>
                    <CardDescription>
                      Suivi hebdomadaire des activités et progrès
                    </CardDescription>
                  </div>
                  {roleFeatures.canCreateReport && (
                    <EmeresButton onClick={() => setShowWeeklyReport(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau Rapport
                    </EmeresButton>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyReports.map((report) => (
                      <div key={report.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Semaine {report.week_number}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(report.start_date)} - {formatDate(report.end_date)}
                            </p>
                          </div>
                          <EmeresBadge variant={report.validated_by_tutor ? 'success' : 'secondary'}>
                            {report.validated_by_tutor ? 'Validé' : 'En attente'}
                          </EmeresBadge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-1">Tâches réalisées:</h5>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                              {report.tasks_completed?.map((task, idx) => (
                                <li key={idx}>{task}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-gray-900 mb-1">Compétences développées:</h5>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                              {report.skills_learned?.map((skill, idx) => (
                                <li key={idx}>{skill}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {report.tutor_feedback && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <h5 className="font-medium text-blue-900 mb-1">Feedback Tuteur:</h5>
                            <p className="text-sm text-blue-800">{report.tutor_feedback}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'evaluations' && (
              <Card>
                <CardHeader>
                  <CardTitle>Évaluations</CardTitle>
                  <CardDescription>
                    Évaluations par les tuteurs et mentors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {evaluations.length > 0 ? (
                      evaluations.map((evaluation) => (
                        <div key={evaluation.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Évaluation {evaluation.evaluation_type}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Par {evaluation.evaluator_type} - {formatDate(evaluation.created_at)}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">
                                {evaluation.total_score?.toFixed(0) || 0}%
                              </div>
                              <div className="text-sm text-gray-600">Score global</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Points forts:</h5>
                              <ul className="list-disc list-inside text-green-600 space-y-1">
                                {evaluation.strengths?.map((strength, idx) => (
                                  <li key={idx}>{strength}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Axes d'amélioration:</h5>
                              <ul className="list-disc list-inside text-orange-600 space-y-1">
                                {evaluation.areas_for_improvement?.map((area, idx) => (
                                  <li key={idx}>{area}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {evaluation.detailed_feedback && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <h5 className="font-medium text-gray-900 mb-1">Feedback détaillé:</h5>
                              <p className="text-sm text-gray-700">{evaluation.detailed_feedback}</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Aucune évaluation disponible pour le moment</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : journals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun journal de bord
            </h3>
            <p className="text-gray-600 mb-6">
              {roleFeatures.canCreateJournal 
                ? "Créez votre premier journal de bord pour commencer le suivi de votre stage"
                : "Aucun journal de bord n'est encore disponible"}
            </p>
            {roleFeatures.canCreateJournal && (
              <EmeresButton onClick={() => setShowCreateJournal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer mon premier journal
              </EmeresButton>
            )}
          </CardContent>
        </Card>
      ) : null}

      {/* Create Journal Modal */}
      {showCreateJournal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Nouveau Journal de Bord</CardTitle>
              <CardDescription>
                Créez un nouveau journal pour votre stage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createJournal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre du stage</label>
                  <input
                    type="text"
                    value={journalForm.internship_title}
                    onChange={(e) => setJournalForm(prev => ({ ...prev, internship_title: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={journalForm.internship_description}
                    onChange={(e) => setJournalForm(prev => ({ ...prev, internship_description: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date de début</label>
                    <input
                      type="date"
                      value={journalForm.start_date}
                      onChange={(e) => setJournalForm(prev => ({ ...prev, start_date: e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Date de fin</label>
                    <input
                      type="date"
                      value={journalForm.end_date}
                      onChange={(e) => setJournalForm(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <EmeresButton type="submit" className="flex-1">
                    Créer le journal
                  </EmeresButton>
                  <EmeresButton
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateJournal(false)}
                  >
                    Annuler
                  </EmeresButton>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Objective Modal */}
      {showCreateObjective && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Nouvel Objectif</CardTitle>
              <CardDescription>
                Définir un objectif SMART pour ce stage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createObjective} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre de l'objectif</label>
                  <input
                    type="text"
                    value={objectiveForm.title}
                    onChange={(e) => setObjectiveForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={objectiveForm.description}
                    onChange={(e) => setObjectiveForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Priorité</label>
                    <select
                      value={objectiveForm.priority}
                      onChange={(e) => setObjectiveForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                      <option value="critical">Critique</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Échéance</label>
                    <input
                      type="date"
                      value={objectiveForm.due_date}
                      onChange={(e) => setObjectiveForm(prev => ({ ...prev, due_date: e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Compétences développées (séparées par des virgules)</label>
                  <input
                    type="text"
                    value={objectiveForm.skills_developed}
                    onChange={(e) => setObjectiveForm(prev => ({ ...prev, skills_developed: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    placeholder="JavaScript, Gestion de projet, Communication..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <EmeresButton type="submit" className="flex-1">
                    Créer l'objectif
                  </EmeresButton>
                  <EmeresButton
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateObjective(false)}
                  >
                    Annuler
                  </EmeresButton>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Weekly Report Modal */}
      {showWeeklyReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Rapport Hebdomadaire</CardTitle>
              <CardDescription>
                Semaine {reportForm.week_number} - Bilan de vos activités
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createWeeklyReport} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Début de semaine</label>
                    <input
                      type="date"
                      value={reportForm.start_date}
                      onChange={(e) => setReportForm(prev => ({ ...prev, start_date: e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Fin de semaine</label>
                    <input
                      type="date"
                      value={reportForm.end_date}
                      onChange={(e) => setReportForm(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tâches réalisées (une par ligne)</label>
                  <textarea
                    value={reportForm.tasks_completed}
                    onChange={(e) => setReportForm(prev => ({ ...prev, tasks_completed: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    rows="4"
                    placeholder="Développement d'une API REST&#10;Tests unitaires des fonctionnalités&#10;Réunion équipe et présentation"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Difficultés rencontrées (une par ligne)</label>
                  <textarea
                    value={reportForm.difficulties_encountered}
                    onChange={(e) => setReportForm(prev => ({ ...prev, difficulties_encountered: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                    placeholder="Problème de configuration Docker&#10;Complexité des tests d'intégration"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Compétences apprises (une par ligne)</label>
                  <textarea
                    value={reportForm.skills_learned}
                    onChange={(e) => setReportForm(prev => ({ ...prev, skills_learned: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                    placeholder="FastAPI et architecture REST&#10;Pytest pour les tests unitaires&#10;Docker et containerisation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notes personnelles</label>
                  <textarea
                    value={reportForm.student_notes}
                    onChange={(e) => setReportForm(prev => ({ ...prev, student_notes: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                    placeholder="Réflexions, apprentissages, objectifs pour la semaine suivante..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Temps passé (heures)</label>
                  <input
                    type="number"
                    min="0"
                    max="168"
                    value={reportForm.time_spent_hours}
                    onChange={(e) => setReportForm(prev => ({ ...prev, time_spent_hours: parseFloat(e.target.value) }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <EmeresButton type="submit" className="flex-1">
                    Créer le rapport
                  </EmeresButton>
                  <EmeresButton
                    type="button"
                    variant="outline"
                    onClick={() => setShowWeeklyReport(false)}
                  >
                    Annuler
                  </EmeresButton>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InternshipJournal;