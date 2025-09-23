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
  FileText, 
  Plus, 
  Upload, 
  Download,
  Edit,
  Trash2,
  Eye,
  Share2,
  Folder,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Save,
  X,
  Shield,
  Copy,
  Scale
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const DocumentManagement = ({ user, companyProfile }) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('documents');

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'convention',
    file: null,
    access_level: 'company',
    expiry_date: ''
  });

  const [templateForm, setTemplateForm] = useState({
    name: '',
    content: '',
    type: 'convention_stage',
    variables: [],
    category: 'legal'
  });

  const documentCategories = [
    { id: 'convention', label: 'Conventions de stage', icon: FileText },
    { id: 'charter', label: 'Chartes internes', icon: AlertCircle },
    { id: 'onboarding', label: 'Guides onboarding', icon: User },
    { id: 'policy', label: 'Politiques RH', icon: Shield },
    { id: 'template', label: 'Modèles de documents', icon: Copy },
    { id: 'legal', label: 'Documents légaux', icon: Scale }
  ];

  const templateTypes = [
    { id: 'convention_stage', label: 'Convention de stage' },
    { id: 'convention_alternance', label: 'Convention d\'alternance' },
    { id: 'contrat_travail', label: 'Contrat de travail' },
    { id: 'fiche_poste', label: 'Fiche de poste' },
    { id: 'evaluation', label: 'Grille d\'évaluation' },
    { id: 'attestation', label: 'Attestation de stage' }
  ];

  useEffect(() => {
    loadDocuments();
    loadTemplates();
  }, []);

  const loadDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      } else {
        // Données simulées pour la démo
        setDocuments([
          {
            id: '1',
            title: 'Convention de stage type 2024',
            description: 'Modèle de convention actualisé selon la nouvelle réglementation',
            category: 'convention',
            file_url: '/docs/convention-stage-2024.pdf',
            file_size: 245678,
            file_type: 'application/pdf',
            access_level: 'company',
            created_by: user.first_name + ' ' + user.last_name,
            created_at: '2024-01-15',
            updated_at: '2024-01-15',
            downloads: 23,
            status: 'active'
          },
          {
            id: '2',
            title: 'Charte informatique',
            description: 'Règles d\'utilisation des outils informatiques',
            category: 'charter',
            file_url: '/docs/charte-informatique.pdf',
            file_size: 156789,
            file_type: 'application/pdf',
            access_level: 'public',
            created_by: user.first_name + ' ' + user.last_name,
            created_at: '2024-01-10',
            updated_at: '2024-01-12',
            downloads: 45,
            status: 'active'
          },
          {
            id: '3',
            title: 'Guide d\'accueil nouveaux stagiaires',
            description: 'Processus d\'intégration et premières étapes',
            category: 'onboarding',
            file_url: '/docs/guide-accueil-stagiaires.pdf',
            file_size: 1234567,
            file_type: 'application/pdf',
            access_level: 'hr_only',
            created_by: user.first_name + ' ' + user.last_name,
            created_at: '2024-01-08',
            updated_at: '2024-01-14',
            downloads: 67,
            status: 'active'
          }
        ]);
      }
    } catch (error) {
      console.error('Erreur chargement documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/templates`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      } else {
        // Données simulées pour la démo
        setTemplates([
          {
            id: 't1',
            name: 'Convention de stage informatique',
            type: 'convention_stage',
            category: 'legal',
            content: `CONVENTION DE STAGE

Entre les soussignés :

L'ENTREPRISE : {{company_name}}
Adresse : {{company_address}}
Représentée par : {{manager_name}}

L'ÉTUDIANT : {{student_name}}
Établissement : {{school_name}}
Formation : {{formation}}

ARTICLE 1 - OBJET
Le présent stage a pour objectif de permettre à l'étudiant d'acquérir une expérience professionnelle en {{domain}}.

ARTICLE 2 - DURÉE
Durée : {{duration}}
Période : du {{start_date}} au {{end_date}}
Horaires : {{schedule}}

ARTICLE 3 - GRATIFICATION
Montant : {{gratification}} euros par mois

[...]`,
            variables: [
              'company_name', 'company_address', 'manager_name',
              'student_name', 'school_name', 'formation', 'domain',
              'duration', 'start_date', 'end_date', 'schedule', 'gratification'
            ],
            created_by: user.first_name + ' ' + user.last_name,
            created_at: '2024-01-15',
            updated_at: '2024-01-15',
            status: 'active',
            usage_count: 12
          }
        ]);
      }
    } catch (error) {
      console.error('Erreur chargement templates:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadForm.title || !uploadForm.file) {
      toast.error('Titre et fichier sont obligatoires');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('category', uploadForm.category);
      formData.append('access_level', uploadForm.access_level);
      formData.append('expiry_date', uploadForm.expiry_date);

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Document uploadé avec succès');
        setShowUploadModal(false);
        resetUploadForm();
        loadDocuments();
      } else {
        throw new Error('Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Erreur upload document:', error);
      toast.error('Erreur lors de l\'upload du document');
    }
  };

  const handleTemplateSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/templates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(templateForm)
      });

      if (response.ok) {
        toast.success('Template créé avec succès');
        setShowTemplateModal(false);
        resetTemplateForm();
        loadTemplates();
      } else {
        throw new Error('Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur création template:', error);
      toast.error('Erreur lors de la création du template');
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      title: '',
      description: '',
      category: 'convention',
      file: null,
      access_level: 'company',
      expiry_date: ''
    });
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      content: '',
      type: 'convention_stage',
      variables: [],
      category: 'legal'
    });
  };

  const getCategoryBadge = (category) => {
    const categoryInfo = documentCategories.find(cat => cat.id === category);
    if (!categoryInfo) return <Badge variant="outline">Autre</Badge>;
    
    const Icon = categoryInfo.icon;
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {categoryInfo.label}
      </Badge>
    );
  };

  const getAccessBadge = (accessLevel) => {
    const badges = {
      'public': { color: 'bg-green-100 text-green-800', text: 'Public' },
      'company': { color: 'bg-blue-100 text-blue-800', text: 'Entreprise' },
      'hr_only': { color: 'bg-purple-100 text-purple-800', text: 'RH uniquement' },
      'admin': { color: 'bg-red-100 text-red-800', text: 'Admin' }
    };
    const badge = badges[accessLevel] || badges['company'];
    return <Badge className={badge.color}>{badge.text}</Badge>;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || doc.category === filterCategory;
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
          <h2 className="text-2xl font-bold text-gray-900">Gestion documentaire</h2>
          <p className="text-gray-600">Stockez et partagez vos documents RH</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="sharing">Partage</TabsTrigger>
        </TabsList>

        {/* Onglet Documents */}
        <TabsContent value="documents" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">Toutes catégories</option>
                {documentCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
              <DialogTrigger asChild>
                <Button onClick={resetUploadForm}>
                  <Upload className="h-4 w-4 mr-2" />
                  Uploader document
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredDocuments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document</h3>
                  <p className="text-gray-500 mb-4">Commencez par uploader vos premiers documents</p>
                  <Button onClick={() => { resetUploadForm(); setShowUploadModal(true); }}>
                    <Upload className="h-4 w-4 mr-2" />
                    Uploader le premier document
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                            {getCategoryBadge(doc.category)}
                            {getAccessBadge(doc.access_level)}
                          </div>
                          
                          <p className="text-gray-600 mb-3">{doc.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {doc.created_by}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(doc.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              {doc.downloads} téléchargements
                            </div>
                            <span>{formatFileSize(doc.file_size)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4" />
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

        {/* Onglet Templates */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
              <DialogTrigger asChild>
                <Button onClick={resetTemplateForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau template
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <Badge variant="outline">
                          {templateTypes.find(t => t.id === template.type)?.label}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <p><strong>Variables :</strong> {template.variables.join(', ')}</p>
                        <p><strong>Utilisations :</strong> {template.usage_count}</p>
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
            ))}
          </div>
        </TabsContent>

        {/* Onglet Partage */}
        <TabsContent value="sharing" className="space-y-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Partage de documents</h3>
              <p className="text-gray-500 mb-4">Fonctionnalité en cours de développement</p>
              <p className="text-sm text-gray-400">Bientôt : partage avec liens temporaires, permissions granulaires</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Upload Document */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Uploader un document</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau document à votre bibliothèque
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Convention de stage 2024"
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <select
                  id="category"
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {documentCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du document..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="access_level">Niveau d'accès</Label>
                <select
                  id="access_level"
                  value={uploadForm.access_level}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, access_level: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="public">Public</option>
                  <option value="company">Entreprise</option>
                  <option value="hr_only">RH uniquement</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <Label htmlFor="expiry_date">Date d'expiration (optionnel)</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={uploadForm.expiry_date}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, expiry_date: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="file">Fichier *</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setUploadForm(prev => ({ ...prev, file: e.target.files[0] }))}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formats acceptés : PDF, Word, Excel, PowerPoint (max 10MB)
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleFileUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Uploader
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Template */}
      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un template</DialogTitle>
            <DialogDescription>
              Créez un modèle de document réutilisable avec variables
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom du template *</Label>
                <Input
                  id="name"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Convention de stage informatique"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={templateForm.type}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {templateTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="content">Contenu du template *</Label>
              <Textarea
                id="content"
                value={templateForm.content}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Utilisez {{variable}} pour les variables dynamiques..."
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Utilisez {'{{nom_variable}}'} pour insérer des variables dynamiques
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowTemplateModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleTemplateSubmit}>
                <Save className="h-4 w-4 mr-2" />
                Créer le template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentManagement;