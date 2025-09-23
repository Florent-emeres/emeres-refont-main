import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Users, 
  Plus, 
  Edit,
  Eye,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Target,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Star,
  FileText,
  Phone,
  Mail,
  MapPin,
  Save,
  X,
  Search,
  Filter
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const InternshipTracking = ({ user, companyProfile }) => {
  const { toast } = useToast();
  const [activeInterns, setActiveInterns] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInternModal, setShowInternModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('active');

  const [internForm, setInternForm] = useState({
    student_name: '',
    student_email: '',
    position: '',
    department: '',
    start_date: '',
    end_date: '',
    supervisor_name: '',
    supervisor_email: '',
    tutor_name: '',
    tutor_email: '',
    objectives: [],
    weekly_schedule: '',
    gratification: '',
    status: 'active'
  });

  const [evaluationForm, setEvaluationForm] = useState({
    intern_id: '',
    evaluation_date: '',
    period: 'mid_term',
    technical_skills: 5,
    soft_skills: 5,
    autonomy: 5,
    integration: 5,
    objectives_achievement: 5,
    overall_rating: 5,
    strengths: '',
    improvements: '',
    next_objectives: '',
    supervisor_comments: '',
    intern_feedback: ''
  });

  const internshipStatuses = [
    { id: 'active', label: 'En cours', color: 'bg-green-100 text-green-800' },
    { id: 'starting', label: 'Début imminent', color: 'bg-blue-100 text-blue-800' },
    { id: 'ending', label: 'Fin proche', color: 'bg-orange-100 text-orange-800' },
    { id: 'completed', label: 'Terminé', color: 'bg-gray-100 text-gray-800' },
    { id: 'interrupted', label: 'Interrompu', color: 'bg-red-100 text-red-800' }
  ];

  const evaluationPeriods = [
    { id: 'first_week', label: 'Première semaine' },
    { id: 'mid_term', label: 'Mi-parcours' },
    { id: 'final', label: 'Bilan final' },
    { id: 'monthly', label: 'Mensuel' }
  ];

  useEffect(() => {
    loadActiveInterns();
    loadEvaluations();
  }, []);

  const loadActiveInterns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/interns/active`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setActiveInterns(data);
      } else {
        // Données simulées pour la démo
        setActiveInterns([
          {
            id: '1',
            student_name: 'Alice Martin',
            student_email: 'alice.martin@student.com',
            position: 'Développeuse Frontend',
            department: 'IT',
            start_date: '2024-02-01',
            end_date: '2024-07-31',
            supervisor_name: 'Jean Dupont',
            supervisor_email: 'jean.dupont@company.com',
            tutor_name: 'Marie Dubois',
            tutor_email: 'marie.dubois@company.com',
            status: 'active',
            gratification: 1200,
            objectives: [
              'Maîtriser React et TypeScript',
              'Développer 3 fonctionnalités client',
              'Participer aux code reviews'
            ],
            weekly_schedule: '35h/semaine (9h-17h)',
            progress: 65,
            last_evaluation_date: '2024-01-15',
            next_evaluation_date: '2024-02-15',
            created_at: '2024-01-15'
          },
          {
            id: '2',
            student_name: 'Thomas Laurent',
            student_email: 'thomas.laurent@student.com',
            position: 'Data Analyst',
            department: 'Data',
            start_date: '2024-01-15',
            end_date: '2024-06-15',
            supervisor_name: 'Sophie Martin',
            supervisor_email: 'sophie.martin@company.com',
            tutor_name: 'Pierre Moreau',
            tutor_email: 'pierre.moreau@company.com',
            status: 'active',
            gratification: 1000,
            objectives: [
              'Analyser les données clients',
              'Créer des dashboards BI',
              'Automatiser les rapports'
            ],
            weekly_schedule: '35h/semaine (8h30-16h30)',
            progress: 40,
            last_evaluation_date: '2024-01-10',
            next_evaluation_date: '2024-02-10',
            created_at: '2024-01-10'
          }
        ]);
      }
    } catch (error) {
      console.error('Erreur chargement stagiaires:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEvaluations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/evaluations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvaluations(data);
      } else {
        // Données simulées pour la démo
        setEvaluations([
          {
            id: 'e1',
            intern_id: '1',
            intern_name: 'Alice Martin',
            evaluation_date: '2024-01-15',
            period: 'first_week',
            technical_skills: 4,
            soft_skills: 5,
            autonomy: 3,
            integration: 5,
            objectives_achievement: 4,
            overall_rating: 4,
            strengths: 'Très motivée, apprend rapidement, bonne communication',
            improvements: 'Gagner en autonomie sur les tâches complexes',
            supervisor_comments: 'Excellente première impression, potentiel confirmé',
            created_by: user.first_name + ' ' + user.last_name,
            created_at: '2024-01-15'
          }
        ]);
      }
    } catch (error) {
      console.error('Erreur chargement évaluations:', error);
    }  
  };

  const handleInternSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/interns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(internForm)
      });

      if (response.ok) {
        toast.success('Stagiaire ajouté avec succès');
        setShowInternModal(false);
        resetInternForm();
        loadActiveInterns();
      } else {
        throw new Error('Erreur lors de l\'ajout');
      }
    } catch (error) {
      console.error('Erreur ajout stagiaire:', error);
      toast.error('Erreur lors de l\'ajout du stagiaire');
    }
  };

  const handleEvaluationSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/evaluations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...evaluationForm,
          created_by: user.id
        })
      });

      if (response.ok) {
        toast.success('Évaluation enregistrée avec succès');
        setShowEvaluationModal(false);
        resetEvaluationForm();
        loadEvaluations();
      } else {
        throw new Error('Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Erreur enregistrement évaluation:', error);
      toast.error('Erreur lors de l\'enregistrement de l\'évaluation');
    }
  };

  const resetInternForm = () => {
    setInternForm({
      student_name: '',
      student_email: '',
      position: '',
      department: '',
      start_date: '',
      end_date: '',
      supervisor_name: '',
      supervisor_email: '',
      tutor_name: '',
      tutor_email: '',
      objectives: [],
      weekly_schedule: '',
      gratification: '',
      status: 'active'
    });
  };

  const resetEvaluationForm = () => {
    setEvaluationForm({
      intern_id: '',
      evaluation_date: '',
      period: 'mid_term',
      technical_skills: 5,
      soft_skills: 5,
      autonomy: 5,
      integration: 5,
      objectives_achievement: 5,
      overall_rating: 5,
      strengths: '',
      improvements: '',
      next_objectives: '',
      supervisor_comments: '',
      intern_feedback: ''
    });
  };

  const getStatusBadge = (status) => {
    const statusInfo = internshipStatuses.find(s => s.id === status);
    if (!statusInfo) return <Badge variant="outline">Inconnu</Badge>;
    
    return <Badge className={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-blue-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const filteredInterns = activeInterns.filter(intern => {
    const matchesSearch = intern.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intern.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || intern.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Stagiaires actifs</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        {/* Onglet Stagiaires actifs */}
        <TabsContent value="active" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un stagiaire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">Tous statuts</option>
                {internshipStatuses.map(status => (
                  <option key={status.id} value={status.id}>{status.label}</option>
                ))}
              </select>
            </div>

            <Dialog open={showInternModal} onOpenChange={setShowInternModal}>
              <DialogTrigger asChild>
                <Button onClick={resetInternForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter stagiaire
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredInterns.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun stagiaire actif</h3>
                  <p className="text-gray-500 mb-4">Ajoutez vos premiers stagiaires pour commencer le suivi</p>
                  <Button onClick={() => { resetInternForm(); setShowInternModal(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter le premier stagiaire
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredInterns.map((intern) => {
                const daysRemaining = calculateDaysRemaining(intern.end_date);
                
                return (
                  <Card key={intern.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{intern.student_name}</h3>
                              {getStatusBadge(intern.status)}
                              {daysRemaining <= 30 && daysRemaining > 0 && (
                                <Badge variant="outline" className="text-orange-600">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {daysRemaining}j restants
                                </Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                              <div>
                                <p className="text-sm font-medium text-gray-700">Poste</p>
                                <p className="text-sm text-gray-600">{intern.position}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Département</p>
                                <p className="text-sm text-gray-600">{intern.department}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Période</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(intern.start_date).toLocaleDateString()} - {new Date(intern.end_date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm font-medium text-gray-700">Superviseur</p>
                                <p className="text-sm text-gray-600">{intern.supervisor_name}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Tuteur</p>
                                <p className="text-sm text-gray-600">{intern.tutor_name}</p>
                              </div>
                            </div>

                            {/* Objectifs */}
                            {intern.objectives && intern.objectives.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-medium text-gray-700 mb-2">Objectifs</p>
                                <div className="flex flex-wrap gap-1">
                                  {intern.objectives.slice(0, 3).map((objective, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {objective}
                                    </Badge>
                                  ))}
                                  {intern.objectives.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{intern.objectives.length - 3} autres
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Barre de progression */}
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Progression</span>
                                <span className="text-gray-600">{intern.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${intern.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedIntern(intern);
                              setEvaluationForm(prev => ({ ...prev, intern_id: intern.id }));
                              setShowEvaluationModal(true);
                            }}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Évaluer
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Footer avec dernière éval */}
                      <div className="flex justify-between items-center pt-4 border-t text-sm text-gray-500">
                        <div>
                          Dernière évaluation : {intern.last_evaluation_date ? new Date(intern.last_evaluation_date).toLocaleDateString() : 'Aucune'}
                        </div>
                        <div>
                          Prochaine évaluation : {intern.next_evaluation_date ? new Date(intern.next_evaluation_date).toLocaleDateString() : 'Non planifiée'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Onglet Évaluations */}
        <TabsContent value="evaluations" className="space-y-6">
          <div className="grid gap-4">
            {evaluations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune évaluation</h3>
                  <p className="text-gray-500">Les évaluations de vos stagiaires apparaîtront ici</p>
                </CardContent>
              </Card>
            ) : (
              evaluations.map((evaluation) => (
                <Card key={evaluation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{evaluation.intern_name}</h3>
                          <Badge variant="outline">
                            {evaluationPeriods.find(p => p.id === evaluation.period)?.label}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Technique</p>
                            <div className="flex justify-center mt-1">
                              {getRatingStars(evaluation.technical_skills)}
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Relationnel</p>
                            <div className="flex justify-center mt-1">
                              {getRatingStars(evaluation.soft_skills)}
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Autonomie</p>
                            <div className="flex justify-center mt-1">
                              {getRatingStars(evaluation.autonomy)}
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Intégration</p>
                            <div className="flex justify-center mt-1">
                              {getRatingStars(evaluation.integration)}
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Global</p>
                            <div className="flex justify-center mt-1">
                              {getRatingStars(evaluation.overall_rating)}
                            </div>
                          </div>
                        </div>

                        {evaluation.strengths && (
                          <div className="mb-2">
                            <p className="text-sm font-medium text-green-700">Points forts</p>
                            <p className="text-sm text-gray-600">{evaluation.strengths}</p>
                          </div>
                        )}

                        {evaluation.improvements && (
                          <div className="mb-2">
                            <p className="text-sm font-medium text-orange-700">Axes d'amélioration</p>
                            <p className="text-sm text-gray-600">{evaluation.improvements}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(evaluation.evaluation_date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          par {evaluation.created_by}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Onglet Planning */}
        <TabsContent value="planning" className="space-y-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Planning des stages</h3>
              <p className="text-gray-500 mb-4">Fonctionnalité en cours de développement</p>
              <p className="text-sm text-gray-400">Bientôt : calendrier partagé, planning des évaluations, suivi des absences</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Ajout Stagiaire */}
      <Dialog open={showInternModal} onOpenChange={setShowInternModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un stagiaire</DialogTitle>
            <DialogDescription>
              Enregistrez un nouveau stagiaire pour commencer le suivi
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student">Étudiant</TabsTrigger>
                <TabsTrigger value="internship">Stage</TabsTrigger>
                <TabsTrigger value="supervision">Encadrement</TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="student_name">Nom complet *</Label>
                    <Input
                      id="student_name"
                      value={internForm.student_name}
                      onChange={(e) => setInternForm(prev => ({ ...prev, student_name: e.target.value }))}
                      placeholder="Prénom Nom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="student_email">Email étudiant *</Label>
                    <Input
                      id="student_email"
                      type="email"
                      value={internForm.student_email}
                      onChange={(e) => setInternForm(prev => ({ ...prev, student_email: e.target.value }))}
                      placeholder="etudiant@school.com"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="internship" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="position">Poste *</Label>
                    <Input
                      id="position"
                      value={internForm.position}
                      onChange={(e) => setInternForm(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="Développeur Frontend"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Département</Label>
                    <Input
                      id="department"
                      value={internForm.department}
                      onChange={(e) => setInternForm(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="IT"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Date de début *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={internForm.start_date}
                      onChange={(e) => setInternForm(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">Date de fin *</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={internForm.end_date}
                      onChange={(e) => setInternForm(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weekly_schedule">Horaires</Label>
                    <Input
                      id="weekly_schedule"
                      value={internForm.weekly_schedule}
                      onChange={(e) => setInternForm(prev => ({ ...prev, weekly_schedule: e.target.value }))}
                      placeholder="35h/semaine (9h-17h)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gratification">Gratification (€/mois)</Label>
                    <Input
                      id="gratification"
                      type="number"
                      value={internForm.gratification}
                      onChange={(e) => setInternForm(prev => ({ ...prev, gratification: e.target.value }))}
                      placeholder="1200"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="supervision" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="supervisor_name">Superviseur *</Label>
                    <Input
                      id="supervisor_name"
                      value={internForm.supervisor_name}
                      onChange={(e) => setInternForm(prev => ({ ...prev, supervisor_name: e.target.value }))}
                      placeholder="Nom du superviseur"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supervisor_email">Email superviseur</Label>
                    <Input
                      id="supervisor_email"
                      type="email"
                      value={internForm.supervisor_email}
                      onChange={(e) => setInternForm(prev => ({ ...prev, supervisor_email: e.target.value }))}
                      placeholder="superviseur@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tutor_name">Tuteur</Label>
                    <Input
                      id="tutor_name"
                      value={internForm.tutor_name}
                      onChange={(e) => setInternForm(prev => ({ ...prev, tutor_name: e.target.value }))}
                      placeholder="Nom du tuteur"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tutor_email">Email tuteur</Label>
                    <Input
                      id="tutor_email"
                      type="email"
                      value={internForm.tutor_email}
                      onChange={(e) => setInternForm(prev => ({ ...prev, tutor_email: e.target.value }))}
                      placeholder="tuteur@company.com"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowInternModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleInternSubmit}>
                <Save className="h-4 w-4 mr-2" />
                Ajouter le stagiaire
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Évaluation */}
      <Dialog open={showEvaluationModal} onOpenChange={setShowEvaluationModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Évaluation de {selectedIntern?.student_name}
            </DialogTitle>
            <DialogDescription>
              Évaluez les performances et l'évolution du stagiaire
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="evaluation_date">Date d'évaluation *</Label>
                <Input
                  id="evaluation_date"
                  type="date"
                  value={evaluationForm.evaluation_date}
                  onChange={(e) => setEvaluationForm(prev => ({ ...prev, evaluation_date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="period">Période</Label>
                <select
                  id="period"
                  value={evaluationForm.period}
                  onChange={(e) => setEvaluationForm(prev => ({ ...prev, period: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {evaluationPeriods.map(period => (
                    <option key={period.id} value={period.id}>{period.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grille d'évaluation */}
            <div className="space-y-4">
              <h4 className="font-medium">Évaluation des compétences (1-5 étoiles)</h4>
              
              {[
                { key: 'technical_skills', label: 'Compétences techniques' },
                { key: 'soft_skills', label: 'Compétences relationnelles' },
                { key: 'autonomy', label: 'Autonomie' },
                { key: 'integration', label: 'Intégration équipe' },
                { key: 'objectives_achievement', label: 'Atteinte des objectifs' },
                { key: 'overall_rating', label: 'Évaluation globale' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setEvaluationForm(prev => ({ ...prev, [key]: rating }))}
                        className="p-1"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            rating <= evaluationForm[key]
                              ? 'text-blue-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="strengths">Points forts</Label>
                <Textarea
                  id="strengths"
                  value={evaluationForm.strengths}
                  onChange={(e) => setEvaluationForm(prev => ({ ...prev, strengths: e.target.value }))}
                  placeholder="Décrivez les points forts du stagiaire..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="improvements">Axes d'amélioration</Label>
                <Textarea
                  id="improvements"
                  value={evaluationForm.improvements}
                  onChange={(e) => setEvaluationForm(prev => ({ ...prev, improvements: e.target.value }))}
                  placeholder="Quels sont les points à améliorer..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="supervisor_comments">Commentaires superviseur</Label>
                <Textarea
                  id="supervisor_comments"
                  value={evaluationForm.supervisor_comments}
                  onChange={(e) => setEvaluationForm(prev => ({ ...prev, supervisor_comments: e.target.value }))}
                  placeholder="Commentaires généraux..."
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowEvaluationModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleEvaluationSubmit}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer l'évaluation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InternshipTracking;