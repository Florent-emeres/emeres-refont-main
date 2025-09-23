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
  MessageSquare, 
  Plus, 
  Send,
  Users,
  Bell,
  Mail,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Settings,
  Save,
  X,
  Eye,
  Edit,
  Trash2,
  FileText,
  Workflow,
  Zap,
  Target,
  Phone,
  Video
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const AdvancedCommunication = ({ user, companyProfile }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('messages');

  const [messageForm, setMessageForm] = useState({
    subject: '',
    content: '',
    recipients: [],
    type: 'email',
    priority: 'normal',
    scheduled_date: '',
    template_id: ''
  });

  const [workflowForm, setWorkflowForm] = useState({
    name: '',
    trigger: 'application_received',
    actions: [],
    conditions: [],
    active: true
  });

  const messageTypes = [
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'sms', label: 'SMS', icon: Phone },
    { id: 'notification', label: 'Notification', icon: Bell },
    { id: 'meeting', label: 'Invitation réunion', icon: Video }
  ];

  const workflowTriggers = [
    { id: 'application_received', label: 'Candidature reçue' },
    { id: 'interview_scheduled', label: 'Entretien programmé' },
    { id: 'offer_accepted', label: 'Offre acceptée' },
    { id: 'internship_started', label: 'Stage commencé' },
    { id: 'evaluation_due', label: 'Évaluation due' },
    { id: 'contract_expiring', label: 'Contrat expirant' }
  ];

  const workflowActions = [
    { id: 'send_email', label: 'Envoyer email', icon: Mail },
    { id: 'send_notification', label: 'Envoyer notification', icon: Bell },
    { id: 'create_task', label: 'Créer tâche', icon: Target },
    { id: 'schedule_meeting', label: 'Programmer réunion', icon: Calendar },
    { id: 'update_status', label: 'Mettre à jour statut', icon: CheckCircle },
    { id: 'assign_user', label: 'Assigner utilisateur', icon: User }
  ];

  const priorityLevels = [
    { id: 'low', label: 'Basse', color: 'bg-gray-100 text-gray-800' },
    { id: 'normal', label: 'Normale', color: 'bg-blue-100 text-blue-800' },
    { id: 'high', label: 'Haute', color: 'bg-orange-100 text-orange-800' },
    { id: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    loadMessages();
    loadWorkflows();
    loadNotifications();
  }, []);

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        // Données simulées pour la démo
        setMessages([
          {
            id: 'm1',
            subject: 'Confirmation entretien - Alice Martin',
            content: 'Bonjour Alice, nous confirmons votre entretien pour le poste de Développeuse Frontend...',
            type: 'email',
            recipients: ['alice.martin@student.com'],
            priority: 'normal',
            status: 'sent',
            sent_at: '2024-01-20T10:30:00',
            created_by: user.first_name + ' ' + user.last_name,
            created_at: '2024-01-20T10:25:00'
          },
          {
            id: 'm2',
            subject: 'Rappel évaluation stagiaire',
            content: 'N\'oubliez pas l\'évaluation mi-parcours de Thomas Laurent prévue cette semaine.',
            type: 'notification',
            recipients: ['jean.dupont@company.com'],
            priority: 'high',
            status: 'scheduled',
            scheduled_date: '2024-01-25T09:00:00',
            created_by: 'System',
            created_at: '2024-01-20T08:00:00'
          }
        ]);
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkflows = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/workflows`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWorkflows(data);
      } else {
        // Données simulées
        setWorkflows([
          {
            id: 'w1',
            name: 'Accueil nouveau candidat',
            trigger: 'application_received',
            actions: [
              { type: 'send_email', template: 'welcome_candidate', delay: 0 },
              { type: 'create_task', title: 'Examiner candidature', assignee: 'hr_team', delay: 60 }
            ],
            conditions: [
              { field: 'application_status', operator: 'equals', value: 'new' }
            ],
            active: true,
            executions: 15,
            created_at: '2024-01-10'
          },
          {
            id: 'w2',
            name: 'Rappel évaluation stagiaire',
            trigger: 'evaluation_due',
            actions: [
              { type: 'send_notification', message: 'Évaluation stagiaire à effectuer', delay: 0 },
              { type: 'send_email', template: 'evaluation_reminder', delay: 86400 }
            ],
            conditions: [],
            active: true,
            executions: 8,
            created_at: '2024-01-08'
          }
        ]);
      }
    } catch (error) {
      console.error('Erreur chargement workflows:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        // Données simulées
        setNotifications([
          {
            id: 'n1',
            title: 'Nouvelle candidature reçue',
            message: 'Une candidature pour le poste Développeur Frontend a été reçue',
            type: 'application',
            priority: 'normal',
            read: false,
            created_at: '2024-01-21T14:30:00'
          },
          {
            id: 'n2',
            title: 'Évaluation stagiaire à effectuer',
            message: 'L\'évaluation mi-parcours de Alice Martin est due dans 2 jours',
            type: 'evaluation',
            priority: 'high',
            read: false,
            created_at: '2024-01-21T09:15:00'
          }
        ]);
      }
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    }
  };

  const handleMessageSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...messageForm,
          created_by: user.id
        })
      });

      if (response.ok) {
        toast.success('Message envoyé avec succès');
        setShowMessageModal(false);
        resetMessageForm();
        loadMessages();
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const handleWorkflowSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/workflows`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(workflowForm)
      });

      if (response.ok) {
        toast.success('Workflow créé avec succès');
        setShowWorkflowModal(false);
        resetWorkflowForm();
        loadWorkflows();
      } else {
        throw new Error('Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur création workflow:', error);
      toast.error('Erreur lors de la création du workflow');
    }
  };

  const resetMessageForm = () => {
    setMessageForm({
      subject: '',
      content: '',
      recipients: [],
      type: 'email',
      priority: 'normal',
      scheduled_date: '',
      template_id: ''
    });
  };

  const resetWorkflowForm = () => {
    setWorkflowForm({
      name: '',
      trigger: 'application_received',
      actions: [],
      conditions: [],
      active: true
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      'sent': { color: 'bg-green-100 text-green-800', text: 'Envoyé', icon: CheckCircle },
      'scheduled': { color: 'bg-blue-100 text-blue-800', text: 'Programmé', icon: Clock },
      'draft': { color: 'bg-gray-100 text-gray-800', text: 'Brouillon', icon: FileText },
      'failed': { color: 'bg-red-100 text-red-800', text: 'Échec', icon: AlertCircle }
    };
    const badge = badges[status] || badges['draft'];
    const Icon = badge.icon;
    return (
      <Badge className={`${badge.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {badge.text}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityInfo = priorityLevels.find(p => p.id === priority);
    if (!priorityInfo) return <Badge variant="outline">Normal</Badge>;
    return <Badge className={priorityInfo.color}>{priorityInfo.label}</Badge>;
  };

  const getTypeIcon = (type) => {
    const typeInfo = messageTypes.find(t => t.id === type);
    if (!typeInfo) return <MessageSquare className="h-4 w-4" />;
    const Icon = typeInfo.icon;
    return <Icon className="h-4 w-4" />;
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || message.status === filterStatus;
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Communication avancée</h2>
          <p className="text-gray-600">Gérez vos communications et automatisez vos workflows</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Onglet Messages */}
        <TabsContent value="messages" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un message..."
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
                <option value="sent">Envoyés</option>
                <option value="scheduled">Programmés</option>
                <option value="draft">Brouillons</option>
                <option value="failed">Échecs</option>
              </select>
            </div>

            <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
              <DialogTrigger asChild>
                <Button onClick={resetMessageForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau message
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredMessages.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
                  <p className="text-gray-500 mb-4">Commencez par créer votre premier message</p>
                  <Button onClick={() => { resetMessageForm(); setShowMessageModal(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer le premier message
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredMessages.map((message) => (
                <Card key={message.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getTypeIcon(message.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{message.subject}</h3>
                            {getStatusBadge(message.status)}
                            {getPriorityBadge(message.priority)}
                          </div>
                          
                          <p className="text-gray-600 mb-3 line-clamp-2">{message.content}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {message.created_by}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(message.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {message.recipients.length} destinataire(s)
                            </div>
                            {message.scheduled_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Programmé: {new Date(message.scheduled_date).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Onglet Workflows */}
        <TabsContent value="workflows" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={showWorkflowModal} onOpenChange={setShowWorkflowModal}>
              <DialogTrigger asChild>
                <Button onClick={resetWorkflowForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau workflow
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {workflows.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun workflow</h3>
                  <p className="text-gray-500 mb-4">Automatisez vos processus avec des workflows</p>
                  <Button onClick={() => { resetWorkflowForm(); setShowWorkflowModal(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer le premier workflow
                  </Button>
                </CardContent>
              </Card>
            ) : (
              workflows.map((workflow) => (
                <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                          <Badge variant={workflow.active ? "default" : "secondary"}>
                            {workflow.active ? 'Actif' : 'Inactif'}
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">
                            <strong>Déclencheur :</strong> {workflowTriggers.find(t => t.id === workflow.trigger)?.label}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Actions :</strong> {workflow.actions.length} action(s) configurée(s)
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Exécutions :</strong> {workflow.executions} fois
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {workflow.actions.slice(0, 3).map((action, index) => {
                            const actionInfo = workflowActions.find(a => a.id === action.type);
                            return (
                              <Badge key={index} variant="outline" className="text-xs">
                                {actionInfo?.label || action.type}
                              </Badge>
                            );
                          })}
                          {workflow.actions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{workflow.actions.length - 3} autres
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="grid gap-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
                  <p className="text-gray-500">Vos notifications apparaîtront ici</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card key={notification.id} className={`hover:shadow-md transition-shadow ${!notification.read ? 'border-blue-200 bg-blue-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-2 rounded-lg ${notification.priority === 'high' ? 'bg-red-100' : 'bg-blue-100'}`}>
                          <Bell className={`h-5 w-5 ${notification.priority === 'high' ? 'text-red-600' : 'text-blue-600'}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            {!notification.read && (
                              <Badge className="bg-blue-100 text-blue-800">Non lu</Badge>
                            )}
                            {getPriorityBadge(notification.priority)}
                          </div>
                          
                          <p className="text-gray-600 mb-2">{notification.message}</p>
                          
                          <p className="text-xs text-gray-500">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button variant="outline" size="sm">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Onglet Templates */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Templates de communication</h3>
              <p className="text-gray-500 mb-4">Fonctionnalité en cours de développement</p>
              <p className="text-sm text-gray-400">Bientôt : templates d'emails, SMS, et notifications personnalisables</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Nouveau Message */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau message</DialogTitle>
            <DialogDescription>
              Créez et envoyez un message à vos candidats ou collaborateurs
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type de message</Label>
                <select
                  id="type"
                  value={messageForm.type}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {messageTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="priority">Priorité</Label>
                <select
                  id="priority"
                  value={messageForm.priority}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {priorityLevels.map(priority => (
                    <option key={priority.id} value={priority.id}>{priority.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Sujet *</Label>
              <Input
                id="subject"
                value={messageForm.subject}
                onChange={(e) => setMessageForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Sujet du message"
              />
            </div>

            <div>
              <Label htmlFor="content">Contenu *</Label>
              <Textarea
                id="content"
                value={messageForm.content}
                onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Contenu du message..."
                rows={6}
              />
            </div>

            <div>
              <Label htmlFor="scheduled_date">Programmation (optionnel)</Label>
              <Input
                id="scheduled_date"
                type="datetime-local"
                value={messageForm.scheduled_date}
                onChange={(e) => setMessageForm(prev => ({ ...prev, scheduled_date: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowMessageModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleMessageSubmit}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Nouveau Workflow */}
      <Dialog open={showWorkflowModal} onOpenChange={setShowWorkflowModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau workflow</DialogTitle>
            <DialogDescription>
              Créez un workflow automatisé pour vos processus RH
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label htmlFor="workflow_name">Nom du workflow *</Label>
              <Input
                id="workflow_name"
                value={workflowForm.name}
                onChange={(e) => setWorkflowForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom du workflow"
              />
            </div>

            <div>
              <Label htmlFor="trigger">Déclencheur *</Label>
              <select
                id="trigger"
                value={workflowForm.trigger}
                onChange={(e) => setWorkflowForm(prev => ({ ...prev, trigger: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {workflowTriggers.map(trigger => (
                  <option key={trigger.id} value={trigger.id}>{trigger.label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Actions disponibles</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {workflowActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => {
                        const newAction = { type: action.id, delay: 0 };
                        setWorkflowForm(prev => ({
                          ...prev,
                          actions: [...prev.actions, newAction]
                        }));
                      }}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {workflowForm.actions.length > 0 && (
              <div>
                <Label>Actions configurées</Label>
                <div className="space-y-2 mt-2">
                  {workflowForm.actions.map((action, index) => {
                    const actionInfo = workflowActions.find(a => a.id === action.type);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{index + 1}</Badge>
                          <span>{actionInfo?.label}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setWorkflowForm(prev => ({
                              ...prev,
                              actions: prev.actions.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowWorkflowModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleWorkflowSubmit}>
                <Save className="h-4 w-4 mr-2" />
                Créer le workflow
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvancedCommunication;