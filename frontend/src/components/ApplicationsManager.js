import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare,
  Download,
  Star,
  MapPin,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  BarChart3,
  FileText,
  User,
  Award,
  Target
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ApplicationsManager = () => {
  const [applications, setApplications] = useState([]);
  const [offers, setOffers] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState('tous');
  const [selectedStatus, setSelectedStatus] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedback, setFeedback] = useState('');

  const statusOptions = [
    { value: 'tous', label: 'Tous les statuts', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'En attente', color: 'bg-blue-100 text-amber-800' },
    { value: 'reviewed', label: 'En cours de révision', color: 'bg-blue-100 text-blue-800' },
    { value: 'interview', label: 'Entretien', color: 'bg-purple-100 text-purple-800' },
    { value: 'accepted', label: 'Accepté', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Refusé', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, selectedOffer, selectedStatus, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [applicationsRes, offersRes] = await Promise.all([
        axios.get(`${API}/applications/company`),
        axios.get(`${API}/offers/my`)
      ]);

      // Enrichir les candidatures avec les données des étudiants et offres
      const enrichedApplications = await Promise.all(
        applicationsRes.data.map(async (app) => {
          try {
            const studentRes = await axios.get(`${API}/students/${app.student_id}/profile`);
            const offer = offersRes.data.find(o => o.id === app.offer_id);
            
            return {
              ...app,
              student_profile: studentRes.data,
              offer: offer
            };
          } catch (error) {
            console.error('Error fetching student profile:', error);
            return {
              ...app,
              student_profile: { first_name: 'N/A', last_name: 'N/A' },
              offer: offersRes.data.find(o => o.id === app.offer_id)
            };
          }
        })
      );

      setApplications(enrichedApplications);
      setOffers(offersRes.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      
      // Données de démonstration si l'API n'est pas encore implémentée
      const mockApplications = [
        {
          id: '1',
          student_id: 'student1',
          offer_id: 'offer1',
          status: 'pending',
          match_score: 0.85,
          created_at: new Date().toISOString(),
          cover_letter: 'Je suis très motivé pour rejoindre votre équipe...',
          student_profile: {
            first_name: 'Marie',
            last_name: 'Dupont',
            education_level: 'Master 2',
            field_of_study: 'Informatique',
            school_name: 'École Supérieure d\'Informatique',
            skills: ['React', 'Node.js', 'Python'],
            email: 'marie.dupont@student.com',
            phone: '06 12 34 56 78'
          },
          offer: {
            id: 'offer1',
            title: 'Stage Développeur Full-Stack',
            sector: 'Technologie'
          }
        },
        {
          id: '2',
          student_id: 'student2',
          offer_id: 'offer2',
          status: 'interview',
          match_score: 0.92,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          cover_letter: 'Passionné par le marketing digital...',
          student_profile: {
            first_name: 'Thomas',
            last_name: 'Martin',
            education_level: 'Master 1',
            field_of_study: 'Marketing',
            school_name: 'ESSEC Business School',
            skills: ['Marketing Digital', 'Analytics', 'SEO'],
            email: 'thomas.martin@student.com',
            phone: '06 98 76 54 32'
          },
          offer: {
            id: 'offer2',
            title: 'Stage Marketing Digital',
            sector: 'Marketing'
          }
        }
      ];
      
      setApplications(mockApplications);
      toast.info('Données de démonstration chargées');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (selectedOffer !== 'tous') {
      filtered = filtered.filter(app => app.offer_id === selectedOffer);
    }

    if (selectedStatus !== 'tous') {
      filtered = filtered.filter(app => app.status === selectedStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.student_profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.student_profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.student_profile?.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.offer?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (applicationId, newStatus, feedbackText = '') => {
    try {
      await axios.put(`${API}/applications/${applicationId}/status`, {
        status: newStatus,
        feedback: feedbackText
      });

      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus, feedback: feedbackText }
          : app
      ));

      toast.success('Statut mis à jour avec succès !');
      setShowFeedbackDialog(false);
      setFeedback('');
      
    } catch (error) {
      console.error('Error updating application status:', error);
      
      // Simulation de mise à jour en local
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus, feedback: feedbackText }
          : app
      ));
      
      toast.success('Statut mis à jour (demo) !');
      setShowFeedbackDialog(false);
      setFeedback('');
    }
  };

  const getStatusBadge = (status) => {
    const statusInfo = statusOptions.find(s => s.value === status) || statusOptions[0];
    return (
      <Badge className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getMatchScoreColor = (score) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-blue-600';
    if (score >= 0.4) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatistics = () => {
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      inProgress: applications.filter(app => ['reviewed', 'interview'].includes(app.status)).length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      avgMatchScore: applications.length > 0 
        ? Math.round(applications.reduce((sum, app) => sum + (app.match_score || 0), 0) / applications.length * 100)
        : 0
    };
    return stats;
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            Gestion des Candidatures
          </h2>
          <p className="text-gray-600 text-lg">
            Système ATS - Gérez vos candidatures et talents
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.inProgress}</p>
                <p className="text-sm text-gray-600">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.accepted}</p>
                <p className="text-sm text-gray-600">Acceptés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
                <p className="text-sm text-gray-600">Refusés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Target className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.avgMatchScore}%</p>
                <p className="text-sm text-gray-600">Match moy.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtres et recherche</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nom, école, poste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Offre</label>
              <Select value={selectedOffer} onValueChange={setSelectedOffer}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Toutes les offres</SelectItem>
                  {offers.map(offer => (
                    <SelectItem key={offer.id} value={offer.id}>
                      {offer.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSelectedOffer('tous');
                  setSelectedStatus('tous');
                  setSearchTerm('');
                }}
                variant="outline"
                className="w-full"
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Candidatures ({filteredApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Aucune candidature trouvée
              </h3>
              <p className="text-gray-600">
                Modifiez vos filtres ou attendez de nouvelles candidatures
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {application.student_profile?.first_name?.[0]}{application.student_profile?.last_name?.[0]}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-medium text-gray-800">
                              {application.student_profile?.first_name} {application.student_profile?.last_name}
                            </h3>
                            {getStatusBadge(application.status)}
                            {application.match_score && (
                              <Badge variant="outline" className={getMatchScoreColor(application.match_score)}>
                                <Star className="h-3 w-3 mr-1" />
                                Match {Math.round(application.match_score * 100)}%
                              </Badge>
                            )}
                          </div>
                          
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <GraduationCap className="h-4 w-4" />
                              <span>{application.student_profile?.education_level} - {application.student_profile?.field_of_study}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Briefcase className="h-4 w-4" />
                              <span>{application.offer?.title}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(application.created_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>

                          {application.student_profile?.skills && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {application.student_profile.skills.slice(0, 4).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {application.student_profile.skills.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{application.student_profile.skills.length - 4}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>

                      {application.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateApplicationStatus(application.id, 'reviewed')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Examiner
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowFeedbackDialog(true);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Refuser
                          </Button>
                        </>
                      )}

                      {application.status === 'reviewed' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateApplicationStatus(application.id, 'interview')}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Entretien
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateApplicationStatus(application.id, 'accepted')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Accepter
                          </Button>
                        </>
                      )}

                      {application.status === 'interview' && (
                        <Button
                          size="sm"
                          onClick={() => updateApplicationStatus(application.id, 'accepted')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accepter
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      {selectedApplication && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>
                  {selectedApplication.student_profile?.first_name} {selectedApplication.student_profile?.last_name}
                </span>
              </DialogTitle>
              <DialogDescription>
                Candidature pour {selectedApplication.offer?.title}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Student Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-800">Informations personnelles</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{selectedApplication.student_profile?.email}</span>
                    </div>
                    {selectedApplication.student_profile?.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedApplication.student_profile.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4 text-gray-500" />
                      <span>{selectedApplication.student_profile?.school_name}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-800">Formation</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Niveau :</strong> {selectedApplication.student_profile?.education_level}</p>
                    <p><strong>Domaine :</strong> {selectedApplication.student_profile?.field_of_study}</p>
                    {selectedApplication.match_score && (
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">
                          Score de compatibilité : {Math.round(selectedApplication.match_score * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills */}
              {selectedApplication.student_profile?.skills && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Compétences</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.student_profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              {selectedApplication.cover_letter && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Lettre de motivation</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {selectedApplication.cover_letter}
                    </p>
                  </div>
                </div>
              )}

              {/* Status and Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium">Statut actuel :</span>
                  {getStatusBadge(selectedApplication.status)}
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Télécharger CV
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Contacter
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Feedback Dialog */}
      {selectedApplication && (
        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Refuser la candidature</DialogTitle>
              <DialogDescription>
                Donner un feedback constructif à {selectedApplication.student_profile?.first_name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Expliquez les raisons du refus et donnez des conseils constructifs..."
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
                Annuler
              </Button>
              <Button
                onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected', feedback)}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirmer le refus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ApplicationsManager;