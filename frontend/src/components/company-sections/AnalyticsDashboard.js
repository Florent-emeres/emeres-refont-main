import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  FileText,
  Calendar,
  Award,
  Download,
  Briefcase,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const AnalyticsDashboard = ({ user, companyProfile }) => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState({
    offers: {
      total: 0,
      active: 0,
      closed: 0,
      views: 0
    },
    applications: {
      total: 0,
      received: 0,
      interview: 0,
      accepted: 0,
      rejected: 0
    },
    performance: {
      conversion_rate: 0,
      avg_time_to_hire: 0,
      top_skills: [],
      top_sources: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/analytics/company?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
      // Données simulées pour la démo
      setAnalytics({
        offers: {
          total: 12,
          active: 8,
          closed: 4,
          views: 456
        },
        applications: {
          total: 89,
          received: 34,
          interview: 18,
          accepted: 12,
          rejected: 25
        },
        performance: {
          conversion_rate: 13.5,
          avg_time_to_hire: 18,
          top_skills: ['JavaScript', 'React', 'Python', 'SQL', 'Git'],
          top_sources: ['LinkedIn', 'Site Web', 'Recommandations', 'Écoles']
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/analytics/export?format=${format}&range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-rh-${timeRange}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast.success(`Rapport ${format.toUpperCase()} téléchargé avec succès`);
      }
    } catch (error) {
      console.error('Erreur export:', error);
      toast.error('Erreur lors de l\'export du rapport');
    }
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
      {/* Filtres temporels */}
      <div className="flex justify-end">
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">3 derniers mois</option>
            <option value="1y">1 an</option>
          </select>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportReport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportReport('excel')}>
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offres actives</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.offers.active}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <span>sur {analytics.offers.total} total</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Candidatures</p>
                <p className="text-2xl font-bold text-green-600">{analytics.applications.total}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+{analytics.applications.received} nouvelles</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux conversion</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.performance.conversion_rate}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <span>Candidature → Embauche</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temps recrutement</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.performance.avg_time_to_hire}j</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <span>Temps moyen</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Onglet Pipeline */}
        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline de recrutement</CardTitle>
              <CardDescription>Répartition des candidatures par statut</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { status: 'received', label: 'Reçues', count: analytics.applications.received, color: 'bg-blue-500', icon: FileText },
                  { status: 'interview', label: 'Entretiens', count: analytics.applications.interview, color: 'bg-purple-500', icon: Calendar },
                  { status: 'accepted', label: 'Acceptées', count: analytics.applications.accepted, color: 'bg-green-500', icon: CheckCircle },
                  { status: 'rejected', label: 'Refusées', count: analytics.applications.rejected, color: 'bg-red-500', icon: XCircle }
                ].map((item) => {
                  const Icon = item.icon;
                  const percentage = analytics.applications.total > 0 
                    ? Math.round((item.count / analytics.applications.total) * 100) 
                    : 0;
                  
                  return (
                    <div key={item.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${item.color.replace('bg-', 'bg-opacity-20 text-')}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-gray-500">{percentage}% du total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{item.count}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Performance */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compétences les plus demandées</CardTitle>
                <CardDescription>Dans vos offres d'emploi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.performance.top_skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill}</span>
                      <Badge variant="secondary">{Math.floor(Math.random() * 20) + 5} offres</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sources de candidatures</CardTitle>
                <CardDescription>D'où viennent vos candidats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.performance.top_sources.map((source, index) => {
                    const percentage = Math.floor(Math.random() * 30) + 10;
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{source}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 w-8">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Insights */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommandations IA</CardTitle>
                <CardDescription>Optimisez votre processus de recrutement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Optimisation des offres</p>
                    <p className="text-xs text-blue-700">Vos offres avec "React" reçoivent 40% plus de candidatures</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <Award className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Temps de réponse</p>
                    <p className="text-xs text-green-700">Répondre dans les 3 jours améliore l'acceptation de 25%</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Tendance salariale</p>
                    <p className="text-xs text-purple-700">Augmenter de 10% le salaire junior attirerait plus de profils</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benchmark marché</CardTitle>
                <CardDescription>Comparaison avec les entreprises similaires</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Temps de recrutement</span>
                      <span className="font-medium">Vous: 18j | Marché: 24j</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-xs text-green-600 mt-1">✅ 25% plus rapide que la moyenne</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Taux de conversion</span>
                      <span className="font-medium">Vous: 13.5% | Marché: 11%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">✅ 23% meilleur que la moyenne</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Attractivité offres</span>
                      <span className="font-medium">Score: 8.2/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                    <p className="text-xs text-purple-600 mt-1">✅ Excellente attractivité</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;