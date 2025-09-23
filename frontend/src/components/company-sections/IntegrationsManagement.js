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
  Settings, 
  Plus, 
  Upload,
  Download,
  FileText,
  Signature,
  Link,
  CheckCircle,
  AlertCircle,
  Zap,
  Mail,
  Database,
  Cloud,
  Shield,
  Save,
  X,
  Eye,
  Edit,
  Trash2,
  Copy,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const IntegrationsManagement = ({ user, companyProfile }) => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState([]);
  const [csvImports, setCsvImports] = useState([]);
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [activeTab, setActiveTab] = useState('signature');

  const [configForm, setConfigForm] = useState({
    integration_name: '',
    api_key: '',
    webhook_url: '',
    settings: {}
  });

  const [importForm, setImportForm] = useState({
    import_type: 'offers',
    file: null,
    options: {
      update_existing: false,
      send_notifications: true,
      validate_data: true
    }
  });

  const availableIntegrations = [
    {
      id: 'docusign',
      name: 'DocuSign',
      category: 'signature',
      description: 'Signature électronique de documents',
      icon: Signature,
      status: 'available',
      features: ['Signature électronique', 'Suivi des documents', 'Templates'],
      setup_required: ['API Key', 'Webhook URL']
    },
    {
      id: 'yousign',
      name: 'Yousign',
      category: 'signature',
      description: 'Solution française de signature électronique',
      icon: Signature,
      status: 'available',
      features: ['Signature légale', 'Interface française', 'Support client FR'],
      setup_required: ['API Key', 'Organisation ID']
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Talent',
      category: 'sourcing',
      description: 'Publication automatique d\'offres sur LinkedIn',
      icon: Link,
      status: 'available',
      features: ['Publication offres', 'Sourcing candidats', 'Analytics'],
      setup_required: ['LinkedIn API Key', 'Company Page ID']
    },
    {
      id: 'indeed',
      name: 'Indeed',
      category: 'sourcing',
      description: 'Diffusion sur Indeed',
      icon: Database,
      status: 'available',
      features: ['Publication offres', 'Réception candidatures', 'Statistiques'],
      setup_required: ['Indeed API Key', 'Company ID']
    },
    {
      id: 'pole_emploi',
      name: 'Pôle Emploi',
      category: 'sourcing',
      description: 'API Pôle Emploi pour la diffusion d\'offres',
      icon: Shield,
      status: 'available',
      features: ['Publication offres', 'Base de données CV', 'Conformité légale'],
      setup_required: ['Client ID', 'Client Secret', 'Scope']
    },
    {
      id: 'google_workspace',
      name: 'Google Workspace',
      category: 'productivity',
      description: 'Intégration avec Gmail, Drive, Calendar',
      icon: Mail,
      status: 'available',
      features: ['Sync calendrier', 'Stockage Drive', 'Email Gmail'],
      setup_required: ['Service Account', 'Domain Verification']
    },
    {
      id: 'microsoft_365',
      name: 'Microsoft 365',
      category: 'productivity',
      description: 'Intégration avec Outlook, OneDrive, Teams',
      icon: Cloud,
      status: 'available',
      features: ['Sync Outlook', 'Stockage OneDrive', 'Réunions Teams'],
      setup_required: ['App Registration', 'Tenant ID', 'Client Secret']
    },
    {
      id: 'zapier',
      name: 'Zapier',
      category: 'automation',
      description: 'Automatisation avec 5000+ applications',
      icon: Zap,
      status: 'available',
      features: ['Workflows automatisés', '5000+ intégrations', 'Triggers personnalisés'],
      setup_required: ['Zapier API Key', 'Webhook Configuration']
    }
  ];

  const importExportOptions = [
    {
      id: 'offers',
      name: 'Offres d\'emploi',
      import: true,
      export: true,
      formats: ['CSV', 'Excel', 'JSON'],
      template_url: '/templates/offers-template.csv'
    },
    {
      id: 'applications',
      name: 'Candidatures',
      import: false,
      export: true,
      formats: ['CSV', 'Excel', 'PDF'],
      template_url: null
    },
    {
      id: 'candidates',
      name: 'Base candidats',
      import: true,
      export: true,
      formats: ['CSV', 'Excel'],
      template_url: '/templates/candidates-template.csv'
    },
    {
      id: 'evaluations',
      name: 'Évaluations',
      import: false,
      export: true,
      formats: ['CSV', 'Excel', 'PDF'],
      template_url: null
    }
  ];

  useEffect(() => {
    loadIntegrations();
    loadImportHistory();
    loadExportHistory();
  }, []);

  const loadIntegrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/integrations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIntegrations(data);
      } else {
        // Données simulées pour la démo
        setIntegrations([
          {
            id: 'int1',
            integration_name: 'docusign',
            name: 'DocuSign',
            status: 'connected',
            configured_at: '2024-01-15',
            last_sync: '2024-01-20',
            documents_signed: 12,
            pending_signatures: 3
          }
        ]);
      }
    } catch (error) {
      console.error('Erreur chargement intégrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadImportHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/imports`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCsvImports(data);
      } else {
        // Données simulées
        setCsvImports([
          {
            id: 'imp1',
            import_type: 'offers',
            filename: 'offres-janvier-2024.csv',
            status: 'completed',
            records_imported: 15,
            records_errors: 1,
            created_at: '2024-01-18',
            created_by: user.first_name + ' ' + user.last_name
          }
        ]);
      }
    } catch (error) {
      console.error('Erreur chargement imports:', error);
    }
  };

  const loadExportHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/exports`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setExports(data);
      } else {
        // Données simulées
        setExports([
          {
            id: 'exp1',
            export_type: 'applications',
            filename: 'candidatures-janvier-2024.xlsx',
            status: 'completed',
            records_count: 45,
            file_url: '/exports/candidatures-janvier-2024.xlsx',
            created_at: '2024-01-19',
            created_by: user.first_name + ' ' + user.last_name
          }
        ]);
      }
    } catch (error) {
      console.error('Erreur chargement exports:', error);
    }
  };

  const handleIntegrationConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/integrations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(configForm)
      });

      if (response.ok) {
        toast.success('Intégration configurée avec succès');
        setShowConfigModal(false);
        resetConfigForm();
        loadIntegrations();
      } else {
        throw new Error('Erreur lors de la configuration');
      }
    } catch (error) {
      console.error('Erreur configuration intégration:', error);
      toast.error('Erreur lors de la configuration');
    }
  };

  const handleCsvImport = async () => {
    if (!importForm.file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', importForm.file);
      formData.append('import_type', importForm.import_type);
      formData.append('options', JSON.stringify(importForm.options));

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/import-csv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Import en cours de traitement');
        setShowImportModal(false);
        resetImportForm();
        loadImportHistory();
      } else {
        throw new Error('Erreur lors de l\'import');
      }
    } catch (error) {
      console.error('Erreur import CSV:', error);
      toast.error('Erreur lors de l\'import CSV');
    }
  };

  const handleExport = async (exportType, format) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/company/export`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          export_type: exportType,
          format: format
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${exportType}-${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast.success(`Export ${format} généré avec succès`);
        loadExportHistory();
      } else {
        throw new Error('Erreur lors de l\'export');
      }
    } catch (error) {
      console.error('Erreur export:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  const resetConfigForm = () => {
    setConfigForm({
      integration_name: '',
      api_key: '',
      webhook_url: '',
      settings: {}
    });
    setSelectedIntegration(null);
  };

  const resetImportForm = () => {
    setImportForm({
      import_type: 'offers',
      file: null,
      options: {
        update_existing: false,
        send_notifications: true,
        validate_data: true
      }
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      'connected': { color: 'bg-green-100 text-green-800', text: 'Connecté', icon: CheckCircle },
      'disconnected': { color: 'bg-red-100 text-red-800', text: 'Déconnecté', icon: AlertCircle },
      'error': { color: 'bg-red-100 text-red-800', text: 'Erreur', icon: AlertCircle },
      'pending': { color: 'bg-blue-100 text-amber-800', text: 'En attente', icon: Clock }
    };
    const badge = badges[status] || badges['disconnected'];
    const Icon = badge.icon;
    return (
      <Badge className={`${badge.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {badge.text}
      </Badge>
    );
  };

  const getImportStatusBadge = (status) => {
    const badges = {
      'completed': { color: 'bg-green-100 text-green-800', text: 'Terminé' },
      'processing': { color: 'bg-blue-100 text-blue-800', text: 'En cours' },
      'error': { color: 'bg-red-100 text-red-800', text: 'Erreur' },
      'pending': { color: 'bg-blue-100 text-amber-800', text: 'En attente' }
    };
    const badge = badges[status] || badges['pending'];
    return <Badge className={badge.color}>{badge.text}</Badge>;
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Intégrations</h2>
          <p className="text-gray-600">Connectez vos outils et automatisez vos processus RH</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="signature">Signature</TabsTrigger>
          <TabsTrigger value="sourcing">Diffusion</TabsTrigger>
          <TabsTrigger value="import_export">Import/Export</TabsTrigger>
          <TabsTrigger value="automation">Automatisation</TabsTrigger>
        </TabsList>

        {/* Onglet Signature électronique */}
        <TabsContent value="signature" className="space-y-6">
          <div className="grid gap-4">
            {availableIntegrations
              .filter(integration => integration.category === 'signature')
              .map((integration) => {
                const connectedIntegration = integrations.find(int => int.integration_name === integration.id);
                const Icon = integration.icon;
                
                return (
                  <Card key={integration.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Icon className="h-6 w-6 text-blue-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                              {connectedIntegration ? 
                                getStatusBadge(connectedIntegration.status) :
                                <Badge variant="outline">Non configuré</Badge>
                              }
                            </div>
                            
                            <p className="text-gray-600 mb-3">{integration.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {integration.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>

                            {connectedIntegration && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Configuré le:</span><br />
                                  {new Date(connectedIntegration.configured_at).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-medium">Dernière sync:</span><br />
                                  {new Date(connectedIntegration.last_sync).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-medium">Documents signés:</span><br />
                                  {connectedIntegration.documents_signed}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {connectedIntegration ? (
                            <>
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedIntegration(integration);
                                setConfigForm(prev => ({ ...prev, integration_name: integration.id }));
                                setShowConfigModal(true);
                              }}
                            >
                              Configurer
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        {/* Onglet Diffusion offres */}
        <TabsContent value="sourcing" className="space-y-6">
          <div className="grid gap-4">
            {availableIntegrations
              .filter(integration => integration.category === 'sourcing')
              .map((integration) => {
                const Icon = integration.icon;
                
                return (
                  <Card key={integration.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <Icon className="h-6 w-6 text-green-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                              <Badge variant="outline">Non configuré</Badge>
                            </div>
                            
                            <p className="text-gray-600 mb-3">{integration.description}</p>
                            
                            <div className="flex flex-wrap gap-2">
                              {integration.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedIntegration(integration);
                              setConfigForm(prev => ({ ...prev, integration_name: integration.id }));
                              setShowConfigModal(true);
                            }}
                          >
                            Configurer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        {/* Onglet Import/Export */}
        <TabsContent value="import_export" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section Import */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Import CSV/Excel
                </CardTitle>
                <CardDescription>
                  Importez vos données en masse
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {importExportOptions
                  .filter(option => option.import)
                  .map((option) => (
                    <div key={option.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{option.name}</h4>
                        <p className="text-sm text-gray-500">
                          Formats: {option.formats.join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {option.template_url && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Template
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => {
                            setImportForm(prev => ({ ...prev, import_type: option.id }));
                            setShowImportModal(true);
                          }}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Importer
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Section Export */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export données
                </CardTitle>
                <CardDescription>
                  Exportez vos données dans différents formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {importExportOptions
                  .filter(option => option.export)
                  .map((option) => (
                    <div key={option.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{option.name}</h4>
                        <p className="text-sm text-gray-500">
                          Formats: {option.formats.join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {option.formats.map((format) => (
                          <Button
                            key={format}
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport(option.id, format)}
                          >
                            {format}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>

          {/* Historique */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Historique imports */}
            <Card>
              <CardHeader>
                <CardTitle>Historique imports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {csvImports.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Aucun import effectué</p>
                  ) : (
                    csvImports.map((imp) => (
                      <div key={imp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{imp.filename}</span>
                            {getImportStatusBadge(imp.status)}
                          </div>
                          <p className="text-sm text-gray-600">
                            {imp.records_imported} importés, {imp.records_errors} erreurs
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(imp.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Historique exports */}
            <Card>
              <CardHeader>
                <CardTitle>Historique exports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exports.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Aucun export généré</p>
                  ) : (
                    exports.map((exp) => (
                      <div key={exp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{exp.filename}</span>
                            {getImportStatusBadge(exp.status)}
                          </div>
                          <p className="text-sm text-gray-600">
                            {exp.records_count} enregistrements
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <span className="text-xs text-gray-500">
                            {new Date(exp.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Automatisation */}
        <TabsContent value="automation" className="space-y-6">
          <div className="grid gap-4">
            {availableIntegrations
              .filter(integration => ['productivity', 'automation'].includes(integration.category))
              .map((integration) => {
                const Icon = integration.icon;
                
                return (
                  <Card key={integration.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="p-3 bg-purple-100 rounded-lg">
                            <Icon className="h-6 w-6 text-purple-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                              <Badge variant="outline">Non configuré</Badge>
                            </div>
                            
                            <p className="text-gray-600 mb-3">{integration.description}</p>
                            
                            <div className="flex flex-wrap gap-2">
                              {integration.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedIntegration(integration);
                              setConfigForm(prev => ({ ...prev, integration_name: integration.id }));
                              setShowConfigModal(true);
                            }}
                          >
                            Configurer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Configuration intégration */}
      <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Configurer {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription>
              Configurez l'intégration avec {selectedIntegration?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {selectedIntegration?.setup_required.map((field, index) => (
              <div key={index}>
                <Label htmlFor={field}>{field} *</Label>
                <Input
                  id={field}
                  type={field.toLowerCase().includes('key') || field.toLowerCase().includes('secret') ? 'password' : 'text'}
                  value={configForm.api_key}
                  onChange={(e) => setConfigForm(prev => ({ ...prev, api_key: e.target.value }))}
                  placeholder={`Entrez votre ${field}`}
                />
              </div>
            ))}

            <div>
              <Label htmlFor="webhook_url">Webhook URL (optionnel)</Label>
              <Input
                id="webhook_url"
                type="url"
                value={configForm.webhook_url}
                onChange={(e) => setConfigForm(prev => ({ ...prev, webhook_url: e.target.value }))}
                placeholder="https://votre-site.com/webhook"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowConfigModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleIntegrationConfig}>
                <Save className="h-4 w-4 mr-2" />
                Configurer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Import CSV */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import CSV/Excel</DialogTitle>
            <DialogDescription>
              Importez vos données en masse depuis un fichier
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label htmlFor="import_type">Type de données</Label>
              <select
                id="import_type"
                value={importForm.import_type}
                onChange={(e) => setImportForm(prev => ({ ...prev, import_type: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {importExportOptions
                  .filter(option => option.import)
                  .map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
              </select>
            </div>

            <div>
              <Label htmlFor="file">Fichier *</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setImportForm(prev => ({ ...prev, file: e.target.files[0] }))}
                accept=".csv,.xlsx,.xls"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formats acceptés : CSV, Excel (.xlsx, .xls)
              </p>
            </div>

            <div className="space-y-3">
              <Label>Options d'import</Label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={importForm.options.update_existing}
                  onChange={(e) => setImportForm(prev => ({
                    ...prev,
                    options: { ...prev.options, update_existing: e.target.checked }
                  }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Mettre à jour les enregistrements existants</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={importForm.options.send_notifications}
                  onChange={(e) => setImportForm(prev => ({
                    ...prev,
                    options: { ...prev.options, send_notifications: e.target.checked }
                  }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Envoyer des notifications</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={importForm.options.validate_data}
                  onChange={(e) => setImportForm(prev => ({
                    ...prev,
                    options: { ...prev.options, validate_data: e.target.checked }
                  }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Valider les données avant import</span>
              </label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowImportModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleCsvImport}>
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegrationsManagement;