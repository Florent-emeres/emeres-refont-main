import React, { useState, useEffect } from 'react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import EmeresInput from '../ui/EmeresInput';
import { 
  Briefcase, 
  Plus,
  Search,
  Filter,
  Eye,
  Send,
  ExternalLink,
  Building,
  MapPin,
  Clock,
  Star,
  Target,
  TrendingUp,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Calendar,
  Users,
  Award,
  Lightbulb,
  Zap,
  Activity,
  Flag,
  AlertCircle,
  Info,
  ArrowRight,
  FileText,
  MessageSquare,
  Download,
  Upload,
  Heart,
  ThumbsUp,
  Bookmark,
  Share
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OpportunitiesRecommendations = ({ selectedStudent, students }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showOpportunityForm, setShowOpportunityForm] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations');

  // Formulaire pour nouvel opportunité
  const [opportunityForm, setOpportunityForm] = useState({
    opportunity_type: 'job_offer',
    title: '',
    description: '',
    company_name: '',
    skills_required: [],
    skills_match_percentage: 0,
    recommendation_reason: '',
    url: '',
    application_deadline: ''
  });

  // Formulaire pour suivi candidature
  const [applicationForm, setApplicationForm] = useState({
    application_type: 'stage',
    company_name: '',
    position_title: '',
    application_date: '',
    status: 'applied',
    documents_prepared: [],
    mentor_comments: ''
  });

  useEffect(() => {
    if (selectedStudent) {
      loadOpportunities();
      loadApplications();
    }
  }, [selectedStudent]);

  const loadOpportunities = async () => {
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/students/${selectedStudent.relation.student_id}/opportunities`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des opportunités:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    if (!selectedStudent) return;
    
    try {
      const token = localStorage.getItem('token');
      // API fictive pour les candidatures - à implémenter
      const mockApplications = [
        {
          id: '1',
          application_type: 'stage',
          company_name: 'TechCorp',
          position_title: 'Développeur Frontend',
          application_date: '2024-01-15',
          status: 'interview',
          documents_prepared: ['cv', 'cover_letter'],
          mentor_comments: [
            { comment: 'Bonne préparation pour l\'entretien', date: '2024-01-16', mentor_id: 'mentor1' }
          ]
        },
        {
          id: '2',
          application_type: 'alternance',
          company_name: 'StartupX',
          position_title: 'Designer UX/UI',
          application_date: '2024-01-10',
          status: 'applied',
          documents_prepared: ['cv', 'portfolio'],
          mentor_comments: []
        }
      ];
      setApplications(mockApplications);
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures:', error);
    }
  };

  const createOpportunity = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/students/${selectedStudent.relation.student_id}/opportunities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(opportunityForm)
      });

      if (response.ok) {
        const newOpportunity = await response.json();
        setOpportunities([newOpportunity, ...opportunities]);
        setShowOpportunityForm(false);
        resetOpportunityForm();
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'opportunité:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetOpportunityForm = () => {
    setOpportunityForm({
      opportunity_type: 'job_offer',
      title: '',
      description: '',
      company_name: '',
      skills_required: [],
      skills_match_percentage: 0,
      recommendation_reason: '',
      url: '',
      application_deadline: ''
    });
  };

  const resetApplicationForm = () => {
    setApplicationForm({
      application_type: 'stage',
      company_name: '',
      position_title: '',
      application_date: '',
      status: 'applied',
      documents_prepared: [],
      mentor_comments: ''
    });
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = searchTerm === '' || 
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || opp.opportunity_type === filterType;
    const matchesStatus = filterStatus === 'all' || opp.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === '' || 
      app.position_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || app.application_type === filterType;
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'recommended': { variant: 'primary', label: 'Recommandé', icon: Lightbulb },
      'interested': { variant: 'secondary', label: 'Intéressé', icon: Heart },
      'applied': { variant: 'primary', label: 'Candidature envoyée', icon: Send },
      'phone_screen': { variant: 'secondary', label: 'Pré-entretien', icon: Users },
      'interview': { variant: 'secondary', label: 'Entretien', icon: MessageSquare },
      'offer': { variant: 'success', label: 'Offre reçue', icon: Award },
      'rejected': { variant: 'error', label: 'Refusé', icon: X },
      'accepted': { variant: 'success', label: 'Accepté', icon: CheckCircle }
    };
    return statusConfig[status] || { variant: 'secondary', label: status, icon: Info };
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (!selectedStudent) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Sélectionnez un étudiant
          </h3>
          <p className="text-gray-600">
            Choisissez un étudiant pour gérer ses opportunités et candidatures
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'recommendations', label: 'Recommandations', icon: Lightbulb, count: opportunities.length },
    { id: 'applications', label: 'Candidatures', icon: FileText, count: applications.length },
    { id: 'preparation', label: 'Préparation', icon: Target, count: 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Opportunités & Candidatures
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Suivi des opportunités pour {selectedStudent.student.first_name} {selectedStudent.student.last_name}
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
            onClick={() => setShowOpportunityForm(true)}
          >
            Nouvelle Opportunité
          </EmeresButton>
        </div>
      </div>

      {/* Tabs */}
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
              {tab.count > 0 && (
                <EmeresBadge variant="outline" size="xs">
                  {tab.count}
                </EmeresBadge>
              )}
            </button>
          );
        })}
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <EmeresInput
            placeholder="Rechercher une opportunité, entreprise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Filtres de type */}
          {['all', 'job_offer', 'internship', 'training', 'event'].map((type) => (
            <EmeresButton
              key={type}
              variant={filterType === type ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType(type)}
            >
              {type === 'all' ? 'Tous' : 
               type === 'job_offer' ? 'Emplois' :
               type === 'internship' ? 'Stages' :
               type === 'training' ? 'Formations' : 'Événements'}
            </EmeresButton>
          ))}
        </div>
      </div>

      {/* Contenu selon l'onglet */}
      {activeTab === 'recommendations' && (
        <RecommendationsTab 
          opportunities={filteredOpportunities}
          onEdit={() => {}}
          getStatusBadge={getStatusBadge}
          getMatchColor={getMatchColor}
          loading={loading}
        />
      )}

      {activeTab === 'applications' && (
        <ApplicationsTab 
          applications={filteredApplications}
          onEdit={() => {}}
          onAddComment={() => {}}
          getStatusBadge={getStatusBadge}
          selectedStudent={selectedStudent}
        />
      )}

      {activeTab === 'preparation' && (
        <PreparationTab selectedStudent={selectedStudent} />
      )}

      {/* Modals */}
      {showOpportunityForm && (
        <OpportunityFormModal
          opportunityForm={opportunityForm}
          setOpportunityForm={setOpportunityForm}
          onSubmit={createOpportunity}
          onClose={() => {
            setShowOpportunityForm(false);
            resetOpportunityForm();
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

// Onglet Recommandations
const RecommendationsTab = ({ opportunities, onEdit, getStatusBadge, getMatchColor, loading }) => (
  <div className="space-y-4">
    {loading ? (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des opportunités...</p>
      </div>
    ) : opportunities.length > 0 ? (
      opportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          opportunity={opportunity}
          onEdit={onEdit}
          getStatusBadge={getStatusBadge}
          getMatchColor={getMatchColor}
        />
      ))
    ) : (
      <EmeresCard>
        <EmeresCardContent className="text-center py-12">
          <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Aucune opportunité trouvée
          </h3>
          <p className="text-gray-600">
            Créez des recommandations personnalisées pour cet étudiant
          </p>
        </EmeresCardContent>
      </EmeresCard>
    )}
  </div>
);

// Onglet Candidatures
const ApplicationsTab = ({ applications, onEdit, onAddComment, getStatusBadge, selectedStudent }) => (
  <div className="space-y-4">
    {applications.length > 0 ? (
      applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          onEdit={onEdit}
          onAddComment={onAddComment}
          getStatusBadge={getStatusBadge}
        />
      ))
    ) : (
      <EmeresCard>
        <EmeresCardContent className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Aucune candidature en cours
          </h3>
          <p className="text-gray-600">
            Les candidatures de l'étudiant apparaîtront ici
          </p>
        </EmeresCardContent>
      </EmeresCard>
    )}
  </div>
);

// Onglet Préparation
const PreparationTab = ({ selectedStudent }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <EmeresCard>
      <EmeresCardHeader>
        <EmeresCardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-orange-600" />
          Checklist Candidature
        </EmeresCardTitle>
      </EmeresCardHeader>
      <EmeresCardContent className="space-y-3">
        {[
          { task: 'CV à jour', completed: true },
          { task: 'Lettre de motivation type', completed: true },
          { task: 'Portfolio en ligne', completed: false },
          { task: 'Profil LinkedIn optimisé', completed: false },
          { task: 'Préparation entretien', completed: false }
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={item.completed}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              readOnly
            />
            <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
              {item.task}
            </span>
            {item.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
          </div>
        ))}
      </EmeresCardContent>
    </EmeresCard>

    <EmeresCard>
      <EmeresCardHeader>
        <EmeresCardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-600" />
          Ressources Utiles
        </EmeresCardTitle>
      </EmeresCardHeader>
      <EmeresCardContent className="space-y-3">
        {[
          { title: 'Guide entretien technique', type: 'PDF', url: '#' },
          { title: 'Template CV moderne', type: 'DOCX', url: '#' },
          { title: 'Questions fréquentes RH', type: 'PDF', url: '#' },
          { title: 'Négociation salaire', type: 'Article', url: '#' }
        ].map((resource, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <div className="text-sm font-medium text-gray-900">{resource.title}</div>
              <div className="text-xs text-gray-500">{resource.type}</div>
            </div>
            <EmeresButton variant="ghost" size="sm" icon={<Download />} />
          </div>
        ))}
      </EmeresCardContent>
    </EmeresCard>
  </div>
);

// Carte d'opportunité
const OpportunityCard = ({ opportunity, onEdit, getStatusBadge, getMatchColor }) => {
  const statusBadge = getStatusBadge(opportunity.status);
  const StatusIcon = statusBadge.icon;

  return (
    <EmeresCard>
      <EmeresCardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{opportunity.title}</h3>
              <EmeresBadge variant={statusBadge.variant} size="sm">
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusBadge.label}
              </EmeresBadge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                {opportunity.company_name}
              </div>
              {opportunity.application_deadline && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Échéance: {new Date(opportunity.application_deadline).toLocaleDateString('fr-FR')}
                </div>
              )}
            </div>
            
            <p className="text-gray-700 mb-4">{opportunity.description}</p>
            
            {/* Match des compétences */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Correspondance des compétences</span>
                <span className={`text-sm font-bold ${getMatchColor(opportunity.skills_match_percentage)}`}>
                  {opportunity.skills_match_percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    opportunity.skills_match_percentage >= 80 ? 'bg-green-500' :
                    opportunity.skills_match_percentage >= 60 ? 'bg-blue-500' :
                    opportunity.skills_match_percentage >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${opportunity.skills_match_percentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* Compétences requises */}
            {opportunity.skills_required && opportunity.skills_required.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Compétences requises</div>
                <div className="flex flex-wrap gap-1">
                  {opportunity.skills_required.map((skill, index) => (
                    <EmeresBadge key={index} variant="outline" size="sm">
                      {skill}
                    </EmeresBadge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Raison de la recommandation */}
            <div className="bg-teal-50 p-3 rounded-lg mb-4">
              <div className="text-sm font-medium text-teal-800 mb-1">Pourquoi cette opportunité ?</div>
              <p className="text-sm text-teal-700">{opportunity.recommendation_reason}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EmeresButton
              variant="primary"
              size="sm"
              icon={<Send />}
            >
              Recommander à l'étudiant
            </EmeresButton>
            <EmeresButton
              variant="outline"
              size="sm"
              icon={<Bookmark />}
            >
              Sauvegarder
            </EmeresButton>
          </div>
          
          <div className="flex items-center gap-2">
            {opportunity.url && (
              <EmeresButton
                variant="ghost"
                size="sm"
                icon={<ExternalLink />}
                onClick={() => window.open(opportunity.url, '_blank')}
              />
            )}
            <EmeresButton
              variant="ghost"
              size="sm"
              icon={<Edit />}
              onClick={() => onEdit(opportunity)}
            />
          </div>
        </div>
      </EmeresCardContent>
    </EmeresCard>
  );
};

// Carte de candidature
const ApplicationCard = ({ application, onEdit, onAddComment, getStatusBadge }) => {
  const statusBadge = getStatusBadge(application.status);
  const StatusIcon = statusBadge.icon;

  return (
    <EmeresCard>
      <EmeresCardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{application.position_title}</h3>
              <EmeresBadge variant={statusBadge.variant} size="sm">
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusBadge.label}
              </EmeresBadge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                {application.company_name}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Candidature: {new Date(application.application_date).toLocaleDateString('fr-FR')}
              </div>
              <EmeresBadge variant="outline" size="sm">
                {application.application_type}
              </EmeresBadge>
            </div>
            
            {/* Documents préparés */}
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Documents fournis</div>
              <div className="flex flex-wrap gap-1">
                {application.documents_prepared.map((doc, index) => (
                  <EmeresBadge key={index} variant="success" size="sm">
                    {doc === 'cv' ? 'CV' :
                     doc === 'cover_letter' ? 'Lettre motivation' :
                     doc === 'portfolio' ? 'Portfolio' : doc}
                  </EmeresBadge>
                ))}
              </div>
            </div>
            
            {/* Commentaires du mentor */}
            {application.mentor_comments && application.mentor_comments.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-2">Commentaires mentor</div>
                {application.mentor_comments.map((comment, index) => (
                  <div key={index} className="text-sm text-blue-700 mb-1">
                    {comment.comment}
                    <span className="text-xs text-blue-600 ml-2">
                      {new Date(comment.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <EmeresButton
            variant="outline"
            size="sm"
            icon={<MessageSquare />}
            onClick={() => onAddComment(application)}
          >
            Ajouter un commentaire
          </EmeresButton>
          <EmeresButton
            variant="ghost"
            size="sm"
            icon={<Edit />}
            onClick={() => onEdit(application)}
          />
        </div>
      </EmeresCardContent>
    </EmeresCard>
  );
};

// Modal de formulaire d'opportunité
const OpportunityFormModal = ({ opportunityForm, setOpportunityForm, onSubmit, onClose, loading }) => {
  const handleInputChange = (field, value) => {
    setOpportunityForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Nouvelle Opportunité</h2>
            <EmeresButton variant="ghost" size="sm" icon={<X />} onClick={onClose} />
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'opportunité *
              </label>
              <select
                value={opportunityForm.opportunity_type}
                onChange={(e) => handleInputChange('opportunity_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="job_offer">Offre d'emploi</option>
                <option value="internship">Stage</option>
                <option value="training">Formation</option>
                <option value="event">Événement</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entreprise *
              </label>
              <EmeresInput
                value={opportunityForm.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Nom de l'entreprise"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de l'opportunité *
            </label>
            <EmeresInput
              value={opportunityForm.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: Développeur Frontend React"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={opportunityForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description de l'opportunité..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pourquoi recommander cette opportunité ? *
            </label>
            <textarea
              value={opportunityForm.recommendation_reason}
              onChange={(e) => handleInputChange('recommendation_reason', e.target.value)}
              placeholder="Expliquez pourquoi cette opportunité correspond à l'étudiant..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL (optionnel)
              </label>
              <EmeresInput
                value={opportunityForm.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Échéance de candidature
              </label>
              <input
                type="date"
                value={opportunityForm.application_deadline}
                onChange={(e) => handleInputChange('application_deadline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

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
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer l\'opportunité'}
            </EmeresButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpportunitiesRecommendations;