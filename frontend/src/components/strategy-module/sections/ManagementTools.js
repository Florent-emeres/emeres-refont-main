import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { 
  Settings, 
  Download,
  Calendar,
  Bell,
  BarChart3,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Target,
  Zap,
  Mail,
  RefreshCw,
  Share2,
  Filter,
  Search,
  Upload
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const ManagementTools = ({ toolsConfig, config, onUpdate, moduleData, userRole, onExport }) => {
  const { toast } = useToast();
  const [activeWidget, setActiveWidget] = useState('timeline');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [alertSettings, setAlertSettings] = useState({
    email: true,
    push: true,
    frequency: 'daily',
    threshold: 80
  });

  const handleConfigUpdate = (key, value) => {
    const updated = { ...toolsConfig, [key]: value };
    onUpdate(updated);
    toast.success('Configuration mise à jour');
  };

  const generateReport = () => {
    // Simulation de génération de rapport
    const reportData = {
      objectives: moduleData.objectives?.length || 0,
      completed_objectives: moduleData.objectives?.filter(obj => obj.status === 'completed').length || 0,
      kpis_tracked: Object.keys(moduleData.kpis || {}).length,
      advice_read: moduleData.advice?.filter(adv => adv.is_read).length || 0,
      generated_at: new Date().toISOString()
    };
    
    console.log('Rapport généré:', reportData);
    onExport();
  };

  const getWidgetPreview = (widgetType) => {
    switch (widgetType) {
      case 'timeline':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Objectif créé: Trouver un stage</span>
              <span className="text-gray-500">il y a 2j</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>KPI mis à jour: +15 candidatures</span>
              <span className="text-gray-500">il y a 1j</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Conseil: Optimiser votre CV</span>
              <span className="text-gray-500">il y a 3h</span>
            </div>
          </div>
        );
      
      case 'progress_chart':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Objectifs</span>
              <span className="text-sm font-medium">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">KPIs</span>
              <span className="text-sm font-medium">60%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        );
      
      case 'weekly_goals':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Candidatures cette semaine</span>
              <Badge variant="outline">3/5</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Évaluations de compétences</span>
              <Badge className="bg-green-100 text-green-800">✓</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Mise à jour portfolio</span>
              <Badge variant="outline">En attente</Badge>
            </div>
          </div>
        );
      
      default:
        return <div className="text-gray-500 text-sm">Aperçu du widget</div>;
    }
  };

  const availableWidgets = [
    { id: 'timeline', name: 'Timeline', icon: Clock, description: 'Historique des actions' },
    { id: 'progress_chart', name: 'Graphique de progression', icon: TrendingUp, description: 'Visualisation des progrès' },
    { id: 'weekly_goals', name: 'Objectifs hebdomadaires', icon: Target, description: 'Suivi des objectifs court terme' },
    { id: 'kpi_dashboard', name: 'Dashboard KPIs', icon: BarChart3, description: 'Vue d\'ensemble des indicateurs' },
    { id: 'alerts_panel', name: 'Panneau d\'alertes', icon: Bell, description: 'Notifications importantes' },
    { id: 'quick_actions', name: 'Actions rapides', icon: Zap, description: 'Raccourcis vers les actions fréquentes' }
  ];

  const activeWidgets = toolsConfig.dashboard_widgets || config.defaultWidgets || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Outils de pilotage</h3>
          <p className="text-sm text-gray-600">Configurez vos outils de suivi et d'export</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Export rapport
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Synchroniser
          </Button>
        </div>
      </div>

      {/* Configuration des widgets de tableau de bord */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Widgets du tableau de bord
          </CardTitle>
          <CardDescription>
            Personnalisez l'affichage de votre tableau de bord stratégique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableWidgets.map((widget) => {
              const Icon = widget.icon;
              const isActive = activeWidgets.includes(widget.id);
              
              return (
                <div
                  key={widget.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    const updatedWidgets = isActive 
                      ? activeWidgets.filter(w => w !== widget.id)
                      : [...activeWidgets, widget.id];
                    handleConfigUpdate('dashboard_widgets', updatedWidgets);
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{widget.name}</h4>
                      <p className="text-xs text-gray-500">{widget.description}</p>
                    </div>
                    {isActive && (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  
                  {/* Aperçu du widget */}
                  <div className="border-t pt-3">
                    {getWidgetPreview(widget.id)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration des alertes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alertes et notifications
            </CardTitle>
            <CardDescription>
              Configurez vos notifications pour rester informé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-alerts">Alertes par email</Label>
                  <p className="text-sm text-gray-500">Recevoir les notifications importantes</p>
                </div>
                <Switch
                  id="email-alerts"
                  checked={alertSettings.email}
                  onCheckedChange={(checked) => 
                    setAlertSettings(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Notifications push</Label>
                  <p className="text-sm text-gray-500">Notifications temps réel sur la plateforme</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={alertSettings.push}
                  onCheckedChange={(checked) => 
                    setAlertSettings(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>

              <div>
                <Label>Fréquence des résumés</Label>
                <select
                  value={alertSettings.frequency}
                  onChange={(e) => setAlertSettings(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="realtime">Temps réel</option>
                  <option value="daily">Quotidien</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuel</option>
                </select>
              </div>
            </div>

            {/* Types d'alertes disponibles */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Types d'alertes actives</h4>
              <div className="space-y-2">
                {(config.alertTypes || []).map((alertType, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">
                        {alertType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration des exports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exports et rapports
            </CardTitle>
            <CardDescription>
              Générez des rapports personnalisés pour le suivi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Format d'export par défaut</Label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {(config.exportFormats || ['pdf']).map(format => (
                  <option key={format} value={format}>
                    {format.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Rapports disponibles</h4>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={generateReport}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Rapport de progression complet
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analyse des KPIs
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Suivi des objectifs
                </Button>
                
                {userRole === 'company' && (
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Export pour reporting RH
                  </Button>
                )}
                
                {userRole === 'school' && (
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="h-4 w-4 mr-2" />
                    Rapport pour ministères
                  </Button>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Dernier export</span>
                <span className="font-medium">Il y a 2 jours</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600">Prochaine synchronisation</span>
                <span className="font-medium">Dans 6 heures</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planning et timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Planning stratégique
          </CardTitle>
          <CardDescription>
            Vue chronologique de vos objectifs et jalons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Timeline simulée */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {moduleData.objectives?.slice(0, 3).map((objective, index) => (
                <div key={objective.id} className="relative flex items-start gap-4 pb-6">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{objective.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{objective.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">
                        {objective.deadline ? new Date(objective.deadline).toLocaleDateString() : 'Pas d\'échéance'}
                      </Badge>
                      <Badge className={
                        objective.status === 'completed' ? 'bg-green-100 text-green-800' :
                        objective.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {objective.status === 'completed' ? 'Terminé' :
                         objective.status === 'active' ? 'En cours' : 'En attente'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Voir le planning complet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagementTools;