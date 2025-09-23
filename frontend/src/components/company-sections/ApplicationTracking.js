import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Users, 
  Search, 
  Filter, 
  Eye,
  CheckCircle,
  X,
  Clock,
  Calendar,
  Mail,
  Phone,
  FileText,
  Download,
  MessageCircle,
  Star,
  MapPin,
  Briefcase,
  User,
  Send,
  Archive,
  ChevronDown,
  SortAsc
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const ApplicationTracking = ({ user, companyProfile }) => {
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/applications/company`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Erreur chargement candidatures:', error);
      toast.error('Erreur lors du chargement des candidatures');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          feedback: feedback || undefined
        })
      });

      if (response.ok) {
        toast.success('Statut mis à jour avec succès');
        loadApplications();
        setShowApplicationModal(false);
        setFeedback('');
      } else {
        throw new Error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'received': { 
        color: 'bg-blue-100 text-blue-800', 
        text: 'Reçue',
        icon: <FileText className="h-3 w-3" />
      },
      'reviewing': { 
        color: 'bg-blue-100 text-amber-800', 
        text: 'En cours',
        icon: <Eye className="h-3 w-3" />
      },
      'interview': { 
        color: 'bg-purple-100 text-purple-800', 
        text: 'Entretien',
        icon: <Calendar className="h-3 w-3" />
      },
      'accepted': { 
        color: 'bg-green-100 text-green-800', 
        text: 'Acceptée',
        icon: <CheckCircle className="h-3 w-3" />
      },
      'rejected': { 
        color: 'bg-red-100 text-red-800', 
        text: 'Refusée',
        icon: <X className="h-3 w-3" />
      }
    };
    const badge = badges[status] || badges['received'];
    return (
      <Badge className={`${badge.color} flex items-center gap-1`}>
        {badge.icon}
        {badge.text}
      </Badge>
    );
  };

  const getStatusCount = (status) => {
    return applications.filter(app => app.status === status).length;
  };

  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      application.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.student_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || application.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setNewStatus(application.status);
    setFeedback(application.company_feedback || '');
    setShowApplicationModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{getStatusCount('received')}</div>
            <div className="text-sm text-gray-500">Reçues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{getStatusCount('reviewing')}</div>
            <div className="text-sm text-gray-500">En cours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{getStatusCount('interview')}</div>
            <div className="text-sm text-gray-500">Entretiens</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{getStatusCount('accepted')}</div>
            <div className="text-sm text-gray-500">Acceptées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{getStatusCount('rejected')}</div>
            <div className="text-sm text-gray-500">Refusées</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, email, poste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">Tous les statuts</option>
                <option value="received">Reçues</option>
                <option value="reviewing">En cours</option>
                <option value="interview">Entretiens</option>
                <option value="accepted">Acceptées</option>
                <option value="rejected">Refusées</option>
              </select>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Trier
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des candidatures */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {applications.length === 0 ? 'Aucune candidature reçue' : 'Aucune candidature trouvée'}
              </h3>
              <p className="text-gray-500">
                {applications.length === 0 
                  ? 'Les candidatures à vos offres apparaîtront ici'
                  : 'Essayez de modifier vos filtres de recherche'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {application.student_name || 'Candidat anonyme'}
                        </h3>
                        <p className="text-sm text-gray-500">{application.student_email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="h-4 w-4" />
                        <span>{application.job_title || 'Poste non spécifié'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Postulé le {new Date(application.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(application.status)}
                      </div>
                    </div>

                    {application.cover_letter && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          <strong>Lettre de motivation:</strong> {application.cover_letter}
                        </p>
                      </div>
                    )}

                    {application.matching_score && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">
                            Score de compatibilité: {Math.round(application.matching_score * 100)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewApplication(application)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de détail candidature */}
      <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Candidature de {selectedApplication?.student_name || 'Candidat'}
            </DialogTitle>
            <DialogDescription>
              Postulé le {selectedApplication && new Date(selectedApplication.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Informations candidat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedApplication.student_email}</p>
                </div>
                <div>
                  <Label>Poste</Label>
                  <p className="text-sm">{selectedApplication.job_title}</p>
                </div>
              </div>

              {/* Lettre de motivation */}
              {selectedApplication.cover_letter && (
                <div>
                  <Label>Lettre de motivation</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                  </div>
                </div>
              )}

              {/* CV et documents */}
              {selectedApplication.cv_document && (
                <div>
                  <Label>CV et documents</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">CV - {selectedApplication.cv_document.filename}</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Score de matching */}
              {selectedApplication.matching_score && (
                <div>
                  <Label>Analyse de compatibilité</Label>
                  <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">
                        Score: {Math.round(selectedApplication.matching_score * 100)}%
                      </span>
                    </div>
                    {selectedApplication.matching_reasons && (
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedApplication.matching_reasons.map((reason, index) => (
                          <li key={index}>• {reason}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Changement de statut */}
              <div>
                <Label htmlFor="status">Statut de la candidature</Label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full mt-2 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="received">Reçue</option>
                  <option value="reviewing">En cours d'examen</option>
                  <option value="interview">Entretien programmé</option>
                  <option value="accepted">Acceptée</option>
                  <option value="rejected">Refusée</option>
                </select>
              </div>

              {/* Feedback */}
              <div>
                <Label htmlFor="feedback">Commentaires (optionnel)</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Ajoutez vos commentaires sur cette candidature..."
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowApplicationModal(false)}>
                  Fermer
                </Button>
                <Button onClick={() => handleStatusUpdate(selectedApplication.id, newStatus)}>
                  <Send className="h-4 w-4 mr-2" />
                  Mettre à jour
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationTracking;