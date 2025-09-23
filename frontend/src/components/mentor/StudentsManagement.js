import React, { useState, useEffect } from 'react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import EmeresInput from '../ui/EmeresInput';
import { 
  Users, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  MessageSquare,
  Calendar,
  Award,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  Star,
  Activity,
  ArrowRight
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const StudentsManagement = ({ students, selectedStudent, setSelectedStudent, onStudentUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [studentObjectives, setStudentObjectives] = useState([]);
  const [studentSessions, setStudentSessions] = useState([]);
  const [studentEvaluations, setStudentEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les détails de l'étudiant sélectionné
  useEffect(() => {
    if (selectedStudent) {
      loadStudentDetails(selectedStudent.relation.student_id);
    }
  }, [selectedStudent]);

  const loadStudentDetails = async (studentId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Charger les objectifs
      const objectivesRes = await fetch(`${API}/mentor/students/${studentId}/objectives`, { headers });
      if (objectivesRes.ok) {
        const objectives = await objectivesRes.json();
        setStudentObjectives(objectives);
      }

      // Charger les évaluations
      const evaluationsRes = await fetch(`${API}/mentor/students/${studentId}/evaluations`, { headers });
      if (evaluationsRes.ok) {
        const evaluations = await evaluationsRes.json();
        setStudentEvaluations(evaluations);
      }

    } catch (error) {
      console.error('Erreur lors du chargement des détails étudiant:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(studentData => {
    const student = studentData.student;
    const relation = studentData.relation;
    
    const matchesSearch = searchTerm === '' || 
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.school_name && student.school_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || relation.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStudentStatusBadge = (status) => {
    const statusConfig = {
      'active': { variant: 'primary', label: 'Actif' },
      'paused': { variant: 'secondary', label: 'En pause' },
      'completed': { variant: 'success', label: 'Terminé' },
      'cancelled': { variant: 'error', label: 'Annulé' }
    };
    return statusConfig[status] || { variant: 'secondary', label: status };
  };

  const calculateProgress = (objectives) => {
    if (!objectives || objectives.length === 0) return 0;
    const completed = objectives.filter(obj => obj.status === 'completed').length;
    return Math.round((completed / objectives.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Mes Étudiants
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Gestion et suivi des étudiants mentorés ({students.length} étudiants)
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
            onClick={() => setShowAddStudent(true)}
          >
            Ajouter Étudiant
          </EmeresButton>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <EmeresInput
            placeholder="Rechercher un étudiant, école..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'paused', 'completed'].map((status) => (
            <EmeresButton
              key={status}
              variant={filterStatus === status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'Tous' : 
               status === 'active' ? 'Actifs' :
               status === 'paused' ? 'En pause' : 'Terminés'}
            </EmeresButton>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des étudiants */}
        <div className="lg:col-span-1">
          <EmeresCard>
            <EmeresCardHeader>
              <EmeresCardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Liste des Étudiants
              </EmeresCardTitle>
              <EmeresCardDescription>
                {filteredStudents.length} étudiant{filteredStudents.length > 1 ? 's' : ''} trouvé{filteredStudents.length > 1 ? 's' : ''}
              </EmeresCardDescription>
            </EmeresCardHeader>
            <EmeresCardContent className="space-y-2 max-h-96 overflow-y-auto">
              {filteredStudents.map((studentData, index) => {
                const student = studentData.student;
                const relation = studentData.relation;
                const isSelected = selectedStudent?.relation.id === relation.id;
                const statusBadge = getStudentStatusBadge(relation.status);
                const progress = calculateProgress(studentData.recent_objectives);

                return (
                  <div
                    key={relation.id}
                    onClick={() => setSelectedStudent(studentData)}
                    className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                      ${isSelected 
                        ? 'border-teal-500 bg-teal-50' 
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {student.first_name?.[0]}{student.last_name?.[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {student.first_name} {student.last_name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {student.school_name || 'École non renseignée'}
                          </p>
                        </div>
                      </div>
                      <EmeresBadge 
                        variant={statusBadge.variant} 
                        size="xs"
                      >
                        {statusBadge.label}
                      </EmeresBadge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Progression</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-teal-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {relation.objectives_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {relation.sessions_count || 0}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-1">
                            <EmeresButton variant="ghost" size="xs" icon={<MessageSquare />} />
                            <EmeresButton variant="ghost" size="xs" icon={<Calendar />} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredStudents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">Aucun étudiant trouvé</p>
                </div>
              )}
            </EmeresCardContent>
          </EmeresCard>
        </div>

        {/* Détails de l'étudiant sélectionné */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <StudentDetailView 
              studentData={selectedStudent}
              objectives={studentObjectives}
              evaluations={studentEvaluations}
              onUpdate={onStudentUpdate}
              loading={loading}
            />
          ) : (
            <EmeresCard>
              <EmeresCardContent className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Sélectionnez un étudiant
                </h3>
                <p className="text-gray-600">
                  Choisissez un étudiant dans la liste pour voir ses détails et son suivi
                </p>
              </EmeresCardContent>
            </EmeresCard>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant de détail d'un étudiant
const StudentDetailView = ({ studentData, objectives, evaluations, onUpdate, loading }) => {
  const student = studentData.student;
  const relation = studentData.relation;
  const [activeTab, setActiveTab] = useState('overview');

  const statusBadge = {
    'active': { variant: 'primary', label: 'Actif' },
    'paused': { variant: 'secondary', label: 'En pause' },
    'completed': { variant: 'success', label: 'Terminé' },
    'cancelled': { variant: 'error', label: 'Annulé' }
  }[relation.status] || { variant: 'secondary', label: relation.status };

  const progress = objectives.length > 0 
    ? Math.round((objectives.filter(obj => obj.status === 'completed').length / objectives.length) * 100)
    : 0;

  const averageScore = evaluations.length > 0
    ? evaluations.reduce((acc, evaluation) => acc + evaluation.overall_score, 0) / evaluations.length
    : 0;

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Eye },
    { id: 'objectives', label: 'Objectifs', icon: Target },
    { id: 'evaluations', label: 'Évaluations', icon: Award },
    { id: 'history', label: 'Historique', icon: Clock }
  ];

  if (loading) {
    return (
      <EmeresCard>
        <EmeresCardContent className="text-center py-12">
          <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des détails...</p>
        </EmeresCardContent>
      </EmeresCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header étudiant */}
      <EmeresCard>
        <EmeresCardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {student.first_name?.[0]}{student.last_name?.[0]}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {student.first_name} {student.last_name}
                </h2>
                <p className="text-gray-600">{student.school_name || 'École non renseignée'}</p>
                <div className="flex items-center gap-4 mt-2">
                  <EmeresBadge variant={statusBadge.variant} size="sm">
                    {statusBadge.label}
                  </EmeresBadge>
                  <span className="text-sm text-gray-500">
                    Depuis le {new Date(relation.start_date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <EmeresButton variant="outline" size="sm" icon={<MessageSquare />}>
                Message
              </EmeresButton>
              <EmeresButton variant="outline" size="sm" icon={<Calendar />}>
                Session
              </EmeresButton>
              <EmeresButton variant="outline" size="sm" icon={<Edit />}>
                Modifier
              </EmeresButton>
            </div>
          </div>

          {/* Métriques rapides */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{objectives.length}</div>
              <div className="text-sm text-gray-600">Objectifs</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{progress}%</div>
              <div className="text-sm text-gray-600">Progression</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{relation.sessions_count || 0}</div>
              <div className="text-sm text-gray-600">Sessions</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{averageScore.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Score moyen</div>
            </div>
          </div>
        </EmeresCardContent>
      </EmeresCard>

      {/* Onglets */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors
                ${activeTab === tab.id 
                  ? 'border-teal-500 text-teal-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <TabIcon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenu des onglets */}
      <div>
        {activeTab === 'overview' && (
          <StudentOverviewTab student={student} relation={relation} objectives={objectives} />
        )}
        {activeTab === 'objectives' && (
          <StudentObjectivesTab objectives={objectives} studentId={relation.student_id} />
        )}
        {activeTab === 'evaluations' && (
          <StudentEvaluationsTab evaluations={evaluations} studentId={relation.student_id} />
        )}
        {activeTab === 'history' && (
          <StudentHistoryTab studentId={relation.student_id} />
        )}
      </div>
    </div>
  );
};

// Onglets de détail
const StudentOverviewTab = ({ student, relation, objectives }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <EmeresCard>
      <EmeresCardHeader>
        <EmeresCardTitle>Informations Personnelles</EmeresCardTitle>
      </EmeresCardHeader>
      <EmeresCardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{student.email || 'Email non renseigné'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{student.phone || 'Téléphone non renseigné'}</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{student.current_program || 'Programme non renseigné'}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{student.city || 'Ville non renseignée'}</span>
        </div>
      </EmeresCardContent>
    </EmeresCard>

    <EmeresCard>
      <EmeresCardHeader>
        <EmeresCardTitle>Objectifs Récents</EmeresCardTitle>
      </EmeresCardHeader>
      <EmeresCardContent className="space-y-3">
        {objectives.slice(0, 3).map((objective) => (
          <div key={objective.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <div className="font-medium text-sm">{objective.title}</div>
              <div className="text-xs text-gray-500">{objective.priority}</div>
            </div>
            <EmeresBadge 
              variant={objective.status === 'completed' ? 'success' : 'primary'} 
              size="xs"
            >
              {objective.status}
            </EmeresBadge>
          </div>
        ))}
        {objectives.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">Aucun objectif défini</p>
        )}
      </EmeresCardContent>
    </EmeresCard>
  </div>
);

const StudentObjectivesTab = ({ objectives, studentId }) => (
  <div className="space-y-4">
    {objectives.map((objective) => (
      <EmeresCard key={objective.id}>
        <EmeresCardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-medium text-gray-900">{objective.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{objective.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <EmeresBadge 
                variant={objective.status === 'completed' ? 'success' : 'primary'} 
                size="sm"
              >
                {objective.status}
              </EmeresBadge>
              <EmeresButton variant="ghost" size="sm" icon={<Edit />} />
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div><strong>Échéance:</strong> {new Date(objective.due_date).toLocaleDateString('fr-FR')}</div>
            <div><strong>Priorité:</strong> {objective.priority}</div>
            <div className="flex items-center justify-between">
              <span><strong>Progression:</strong></span>
              <span>{objective.progress_percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-teal-500 h-2 rounded-full"
                style={{ width: `${objective.progress_percentage}%` }}
              ></div>
            </div>
          </div>
        </EmeresCardContent>
      </EmeresCard>
    ))}
  </div>
);

const StudentEvaluationsTab = ({ evaluations, studentId }) => (
  <div className="space-y-4">
    {evaluations.map((evaluation) => (
      <EmeresCard key={evaluation.id}>
        <EmeresCardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-gray-900">
                Évaluation {evaluation.evaluation_period}
              </h4>
              <p className="text-sm text-gray-600">
                {new Date(evaluation.period_start).toLocaleDateString('fr-FR')} - {new Date(evaluation.period_end).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-teal-600">{evaluation.overall_score.toFixed(1)}</div>
              <div className="text-sm text-gray-500">/ 5</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{evaluation.autonomy_score}</div>
              <div className="text-xs text-gray-600">Autonomie</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{evaluation.communication_score}</div>
              <div className="text-xs text-gray-600">Communication</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">{evaluation.quality_score}</div>
              <div className="text-xs text-gray-600">Qualité</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">{evaluation.progression_score}</div>
              <div className="text-xs text-gray-600">Progression</div>
            </div>
          </div>
          
          {evaluation.qualitative_feedback && (
            <div className="border-t pt-3">
              <h5 className="font-medium text-sm mb-2">Commentaires:</h5>
              <p className="text-sm text-gray-600">{evaluation.qualitative_feedback}</p>
            </div>
          )}
        </EmeresCardContent>
      </EmeresCard>
    ))}
  </div>
);

const StudentHistoryTab = ({ studentId }) => (
  <div className="space-y-4">
    <p className="text-gray-600">Historique des interactions (à implémenter)</p>
  </div>
);

export default StudentsManagement;