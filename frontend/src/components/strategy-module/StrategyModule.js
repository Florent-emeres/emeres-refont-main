import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Target, 
  TrendingUp, 
  Lightbulb, 
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Plus,
  Edit,
  Eye,
  Calendar,
  Users,
  Building,
  GraduationCap,
  UserCheck,
  Shield
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

// Composants spécialisés
import StrategicObjectives from './sections/StrategicObjectives';
import KeyIndicators from './sections/KeyIndicators';
import PersonalizedAdvice from './sections/PersonalizedAdvice';
import ManagementTools from './sections/ManagementTools';

// Configuration par rôle
import { getStrategyConfig } from './config/strategyConfig';

const StrategyModule = ({ user, userProfile, userRole = 'student' }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('objectives');
  const [strategyData, setStrategyData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Configuration dynamique basée sur le rôle
  const config = useMemo(() => getStrategyConfig(userRole), [userRole]);

  // État des données du module stratégie
  const [moduleData, setModuleData] = useState({
    objectives: [],
    kpis: {},
    advice: [],
    tools_config: {},
    last_sync: null
  });

  // Icône du rôle pour l'interface
  const getRoleIcon = (role) => {
    const icons = {
      'student': GraduationCap,
      'company': Building,
      'school': Users,
      'mentor': UserCheck,
      'institution': Shield,
      'admin': Settings
    };
    return icons[role] || Target;
  };

  const RoleIcon = getRoleIcon(userRole);

  useEffect(() => {
    loadStrategyData();
  }, [userRole]);

  const loadStrategyData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/strategy/${userRole}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setModuleData(data);
        setLastUpdated(new Date(data.last_sync || Date.now()));
      } else {
        // Données simulées basées sur la configuration du rôle
        const mockData = generateMockData(config);
        setModuleData(mockData);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Erreur chargement données stratégie:', error);
      // Fallback avec données simulées
      const mockData = generateMockData(config);
      setModuleData(mockData);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (config) => {
    return {
      objectives: config.defaultObjectives.map((obj, index) => ({
        id: `obj_${index}`,
        title: obj.title,
        description: obj.description,
        target_value: obj.target,
        current_value: Math.floor(obj.target * (0.3 + Math.random() * 0.5)),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: ['active', 'completed', 'pending'][Math.floor(Math.random() * 3)],
        priority: obj.priority || 'medium',
        created_at: new Date().toISOString()
      })),
      kpis: Object.fromEntries(
        config.keyIndicators.map((kpi, index) => [
          kpi.key,
          {
            id: kpi.key,
            name: kpi.name,
            current_value: Math.floor(Math.random() * 100),
            target_value: kpi.target || 100,
            unit: kpi.unit || '',
            trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
            history: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
              value: Math.floor(Math.random() * 100)
            }))
          }
        ])
      ),
      advice: config.adviceTypes.map((advice, index) => ({
        id: `advice_${index}`,
        type: advice.type,
        title: advice.title,
        description: advice.description,
        priority: advice.priority,
        actionable: advice.actionable,
        is_read: Math.random() > 0.5,
        created_at: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString()
      })),
      tools_config: {
        alerts_enabled: true,
        export_format: 'pdf',
        sync_frequency: 'daily',
        dashboard_widgets: config.toolsConfig.defaultWidgets || []
      },
      last_sync: new Date().toISOString()
    };
  };

  const handleDataUpdate = async (section, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/strategy/${userRole}/${section}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        setModuleData(prev => ({
          ...prev,
          [section]: updatedData,
          last_sync: new Date().toISOString()
        }));
        setLastUpdated(new Date());
        toast.success(`${config.sections[section]} mis à jour avec succès`);
      } else {
        // Mode simulation - mise à jour locale uniquement
        setModuleData(prev => ({
          ...prev,
          [section]: updatedData,
          last_sync: new Date().toISOString()
        }));
        setLastUpdated(new Date());
        toast.success(`${config.sections[section]} mis à jour (mode démo)`);
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getTabIcon = (tabKey) => {
    const icons = {
      'objectives': Target,
      'kpis': TrendingUp,
      'advice': Lightbulb,
      'tools': Settings
    };
    return icons[tabKey] || Target;
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
      {/* Header avec contexte du rôle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <RoleIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Stratégie & Conseil</h2>
            <p className="text-gray-600">{config.roleDescription}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            {config.roleName}
          </Badge>
          {lastUpdated && (
            <Badge variant="outline" className="text-gray-600">
              <Clock className="h-3 w-3 mr-1" />
              Mis à jour {lastUpdated.toLocaleDateString()}
            </Badge>
          )}
        </div>
      </div>

      {/* Métriques rapides en en-tête */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Objectifs actifs</p>
                <p className="text-2xl font-bold text-blue-900">
                  {moduleData.objectives.filter(obj => obj.status === 'active').length}
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">KPIs suivis</p>
                <p className="text-2xl font-bold text-green-900">
                  {Object.keys(moduleData.kpis).length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Conseils actifs</p>
                <p className="text-2xl font-bold text-orange-900">
                  {moduleData.advice.filter(advice => !advice.is_read).length}
                </p>
              </div>
              <Lightbulb className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Score global</p>
                <p className="text-2xl font-bold text-purple-900">
                  {Math.floor(
                    (moduleData.objectives.filter(obj => obj.status === 'completed').length / 
                     Math.max(moduleData.objectives.length, 1)) * 100
                  )}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation des sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {Object.entries(config.sections).map(([key, label]) => {
            const IconComponent = getTabIcon(key);
            return (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Section Objectifs stratégiques */}
        <TabsContent value="objectives" className="space-y-6">
          <StrategicObjectives
            objectives={moduleData.objectives}
            config={config.objectivesConfig}
            onUpdate={(data) => handleDataUpdate('objectives', data)}
            userRole={userRole}
          />
        </TabsContent>

        {/* Section Indicateurs clés (KPIs) */}
        <TabsContent value="kpis" className="space-y-6">
          <KeyIndicators
            kpis={moduleData.kpis}
            config={config.kpisConfig}
            onUpdate={(data) => handleDataUpdate('kpis', data)}
            userRole={userRole}
          />
        </TabsContent>

        {/* Section Conseils personnalisés */}
        <TabsContent value="advice" className="space-y-6">
          <PersonalizedAdvice
            advice={moduleData.advice}
            config={config.adviceConfig}
            onUpdate={(data) => handleDataUpdate('advice', data)}
            userRole={userRole}
          />
        </TabsContent>

        {/* Section Outils de pilotage */}
        <TabsContent value="tools" className="space-y-6">
          <ManagementTools
            toolsConfig={moduleData.tools_config}
            config={config.toolsConfig}
            onUpdate={(data) => handleDataUpdate('tools_config', data)}
            moduleData={moduleData}
            userRole={userRole}
            onExport={() => toast.success('Export généré avec succès')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategyModule;