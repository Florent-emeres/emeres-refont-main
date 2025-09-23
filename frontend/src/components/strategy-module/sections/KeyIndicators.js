import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

const KeyIndicators = ({ kpis = {}, config, onUpdate, userRole }) => {
  const [selectedChart, setSelectedChart] = useState('line');
  const [timeRange, setTimeRange] = useState('30d');

  const kpisList = useMemo(() => {
    return Object.values(kpis);
  }, [kpis]);

  const getTrendIcon = (trend) => {
    const icons = {
      'up': TrendingUp,
      'down': TrendingDown,
      'stable': Minus
    };
    return icons[trend] || Minus;
  };

  const getTrendColor = (trend) => {
    const colors = {
      'up': 'text-green-600',
      'down': 'text-red-600',
      'stable': 'text-gray-600'
    };
    return colors[trend] || 'text-gray-600';
  };

  const getPerformanceStatus = (kpi) => {
    if (!kpi.target_value) return 'neutral';
    const ratio = kpi.current_value / kpi.target_value;
    if (ratio >= 1) return 'excellent';
    if (ratio >= 0.8) return 'good';
    if (ratio >= 0.6) return 'warning';
    return 'critical';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'excellent': { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Excellent' },
      'good': { color: 'bg-blue-100 text-blue-800', icon: TrendingUp, text: 'Bon' },
      'warning': { color: 'bg-blue-100 text-amber-800', icon: AlertTriangle, text: 'Attention' },
      'critical': { color: 'bg-red-100 text-red-800', icon: AlertTriangle, text: 'Critique' },
      'neutral': { color: 'bg-gray-100 text-gray-800', icon: Activity, text: 'Suivi' }
    };
    const badge = badges[status] || badges.neutral;
    const Icon = badge.icon;
    return (
      <Badge className={`${badge.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {badge.text}
      </Badge>
    );
  };

  const calculateProgress = (kpi) => {
    if (!kpi.target_value) return 0;
    return Math.min(100, Math.round((kpi.current_value / kpi.target_value) * 100));
  };

  const generateMockChart = (kpi) => {
    // Simulation d'un mini graphique avec des points
    const points = kpi.history?.slice(-7) || Array.from({ length: 7 }, (_, i) => ({
      value: Math.floor(Math.random() * 100)
    }));
    
    return (
      <div className="flex items-end space-x-1 h-12">
        {points.map((point, index) => (
          <div
            key={index}
            className="bg-blue-500 rounded-t"
            style={{
              width: '8px',
              height: `${Math.max(10, (point.value / 100) * 48)}px`
            }}
          />
        ))}
      </div>
    );
  };

  const refreshKPI = (kpiId) => {
    // Simulation de mise à jour d'un KPI
    const updatedKpis = { ...kpis };
    if (updatedKpis[kpiId]) {
      updatedKpis[kpiId] = {
        ...updatedKpis[kpiId],
        current_value: Math.floor(Math.random() * updatedKpis[kpiId].target_value * 1.2),
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
        last_updated: new Date().toISOString()
      };
      onUpdate(updatedKpis);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Indicateurs clés (KPIs)</h3>
          <p className="text-sm text-gray-600">
            {kpisList.length} indicateurs suivis • Mise à jour automatique
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">3 derniers mois</option>
            <option value="1y">Dernière année</option>
          </select>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Vue d'ensemble des KPIs */}
      {kpisList.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun KPI configuré</h3>
            <p className="text-gray-500">Les indicateurs seront automatiquement configurés selon votre rôle</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpisList.map((kpi) => {
            const TrendIcon = getTrendIcon(kpi.trend);
            const trendColor = getTrendColor(kpi.trend);
            const status = getPerformanceStatus(kpi);
            const progress = calculateProgress(kpi);
            
            return (
              <Card key={kpi.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-700">
                      {kpi.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(status)}
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => refreshKPI(kpi.id)}
                        className="h-6 w-6 p-0"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Valeur principale */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {kpi.current_value}
                          </span>
                          <span className="text-sm text-gray-500">{kpi.unit}</span>
                        </div>
                        {kpi.target_value && (
                          <div className="text-xs text-gray-500">
                            Objectif: {kpi.target_value} {kpi.unit}
                          </div>
                        )}
                      </div>
                      
                      <div className={`flex items-center gap-1 ${trendColor}`}>
                        <TrendIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {kpi.trend === 'up' ? '+' : kpi.trend === 'down' ? '-' : ''}
                          {Math.floor(Math.random() * 15)}%
                        </span>
                      </div>
                    </div>

                    {/* Barre de progression vers l'objectif */}
                    {kpi.target_value && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Progression</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              status === 'excellent' ? 'bg-green-500' :
                              status === 'good' ? 'bg-blue-500' :
                              status === 'warning' ? 'bg-blue-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, progress)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Mini graphique */}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">Évolution ({timeRange})</span>
                        <div className="flex gap-1">
                          {['line', 'bar'].map((chartType) => (
                            <button
                              key={chartType}
                              onClick={() => setSelectedChart(chartType)}
                              className={`p-1 rounded ${
                                selectedChart === chartType 
                                  ? 'bg-blue-100 text-blue-600' 
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              {chartType === 'line' ? (
                                <LineChart className="h-3 w-3" />
                              ) : (
                                <BarChart3 className="h-3 w-3" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      {generateMockChart(kpi)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Alertes et recommandations sur les KPIs */}
      {kpisList.some(kpi => getPerformanceStatus(kpi) === 'critical') && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-900">Alertes sur les indicateurs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {kpisList
                .filter(kpi => getPerformanceStatus(kpi) === 'critical')
                .map(kpi => (
                  <div key={kpi.id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div>
                      <span className="font-medium text-gray-900">{kpi.name}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        est en dessous de l'objectif ({kpi.current_value}/{kpi.target_value})
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      Actions suggérées
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KeyIndicators;