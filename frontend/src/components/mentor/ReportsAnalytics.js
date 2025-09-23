import React, { useState, useEffect } from 'react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import EmeresInput from '../ui/EmeresInput';
import { 
  BarChart3, 
  PieChart,
  TrendingUp,
  TrendingDown,
  Download,
  Upload,
  Calendar,
  Users,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  MessageSquare,
  Video,
  FileText,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  RefreshCw,
  Eye,
  Share,
  Printer,
  Mail,
  Zap,
  Lightbulb,
  Coffee,
  Heart,
  Sparkles,
  Flag,
  Info,
  Settings
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ReportsAnalytics = ({ analytics }) => {
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [selectedMetrics, setSelectedMetrics] = useState(['all']);
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [detailedAnalytics, setDetailedAnalytics] = useState(null);

  useEffect(() => {
    if (analytics) {
      setDetailedAnalytics(analytics);
    }
  }, [analytics]);

  const exportReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/reports/export?format=${exportFormat}&period=${reportPeriod}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Logique d'export - pour le moment on affiche juste un message
        console.log('Rapport exporté:', data);
        alert('Rapport exporté avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/mentor/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDetailedAnalytics(data);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setLoading(false);
    }
  };

  const kpis = detailedAnalytics?.kpis || {};
  const studentProgressions = detailedAnalytics?.student_progressions || [];

  // Calculs des tendances (mock)
  const trends = {
    students: { value: '+2', direction: 'up', percentage: 15 },
    sessions: { value: '+5', direction: 'up', percentage: 25 },
    satisfaction: { value: '+0.3', direction: 'up', percentage: 8 },
    completion: { value: '+12%', direction: 'up', percentage: 12 }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressLabel = (progress) => {
    if (progress >= 80) return 'Excellent';
    if (progress >= 60) return 'Bon';
    if (progress >= 40) return 'Moyen';
    return 'À améliorer';
  };

  const getTrendIcon = (direction) => {
    if (direction === 'up') return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (direction === 'down') return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Rapports & Analytics
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Analyse des performances et exports de données
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <EmeresButton
            variant="outline"
            icon={<RefreshCw />}
            onClick={refreshAnalytics}
            disabled={loading}
          >
            Actualiser
          </EmeresButton>
          <EmeresButton
            variant="secondary"
            icon={<Share />}
            size="sm"
          >
            Partager
          </EmeresButton>
          <EmeresButton
            variant="primary"
            icon={<Download />}
            onClick={exportReport}
            disabled={loading}
          >
            {loading ? 'Export...' : 'Exporter'}
          </EmeresButton>
        </div>
      </div>

      {/* Contrôles d'export */}
      <EmeresCard>
        <EmeresCardHeader>
          <EmeresCardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Configuration du Rapport
          </EmeresCardTitle>
        </EmeresCardHeader>
        <EmeresCardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période
              </label>
              <select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuel</option>
                <option value="quarterly">Trimestriel</option>
                <option value="yearly">Annuel</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format d'export
              </label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Métriques incluses
              </label>
              <select
                multiple
                value={selectedMetrics}
                onChange={(e) => setSelectedMetrics(Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">Toutes les métriques</option>
                <option value="kpis">KPIs principaux</option>
                <option value="progress">Progression étudiants</option>
                <option value="sessions">Sessions & calendrier</option>
                <option value="evaluations">Évaluations</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <EmeresButton
                variant="outline"
                fullWidth
                icon={<Eye />}
              >
                Prévisualisation
              </EmeresButton>
            </div>
          </div>
        </EmeresCardContent>
      </EmeresCard>

      {/* KPIs principaux avec tendances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard
          title="Étudiants Actifs"
          value={kpis.total_active_students || 0}
          subtitle="en mentorat"
          trend={trends.students}
          icon={Users}
          gradient="from-blue-500 to-blue-600"
        />
        <KPICard
          title="Sessions ce Mois"
          value={kpis.sessions_this_month || 0}
          subtitle="séances réalisées"
          trend={trends.sessions}
          icon={Calendar}
          gradient="from-green-500 to-green-600"
        />
        <KPICard
          title="Satisfaction Moyenne"
          value={`${kpis.average_satisfaction || 0}/5`}
          subtitle="évaluations"
          trend={trends.satisfaction}
          icon={Award}
          gradient="from-purple-500 to-purple-600"
        />
        <KPICard
          title="Taux d'Objectifs"
          value={`${Math.round((kpis.objectives_completed_this_month || 0) / Math.max(1, kpis.total_active_students || 1) * 100)}%`}
          subtitle="complétés ce mois"
          trend={trends.completion}
          icon={Target}
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progression par étudiant */}
        <EmeresCard>
          <EmeresCardHeader>
            <EmeresCardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              Progression par Étudiant
            </EmeresCardTitle>
            <EmeresCardDescription>
              Vue d'ensemble des performances individuelles
            </EmeresCardDescription>
          </EmeresCardHeader>
          <EmeresCardContent className="space-y-4">
            {studentProgressions.length > 0 ? (
              studentProgressions.map((student, index) => {
                const completionRate = student.objectives_total > 0 
                  ? Math.round((student.objectives_completed / student.objectives_total) * 100)
                  : 0;
                
                return (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{student.student_name}</h4>
                        <p className="text-sm text-gray-500">{student.program_type || 'Programme général'}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-teal-600">{completionRate}%</div>
                        <div className="text-xs text-gray-500">
                          {student.objectives_completed}/{student.objectives_total} obj.
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progression</span>
                        <EmeresBadge variant="outline" size="xs">
                          {getProgressLabel(completionRate)}
                        </EmeresBadge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(completionRate)}`}
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                      
                      {/* Scores récents */}
                      {student.recent_scores && student.recent_scores.length > 0 && (
                        <div className="flex items-center gap-2 pt-2">
                          <span className="text-xs text-gray-500">Scores récents:</span>
                          <div className="flex gap-1">
                            {student.recent_scores.slice(0, 3).map((score, scoreIndex) => (
                              <div
                                key={scoreIndex}
                                className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-medium"
                              >
                                {score.toFixed(1)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune donnée de progression disponible</p>
              </div>
            )}
          </EmeresCardContent>
        </EmeresCard>

        {/* Répartition des activités */}
        <EmeresCard>
          <EmeresCardHeader>
            <EmeresCardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              Répartition des Activités
            </EmeresCardTitle>
            <EmeresCardDescription>
              Temps passé par type d'activité ce mois
            </EmeresCardDescription>
          </EmeresCardHeader>
          <EmeresCardContent>
            <div className="space-y-4">
              {[
                { activity: 'Sessions individuelles', time: 45, color: 'bg-blue-500' },
                { activity: 'Suivi objectifs', time: 25, color: 'bg-green-500' },
                { activity: 'Évaluations', time: 15, color: 'bg-purple-500' },
                { activity: 'Communications', time: 10, color: 'bg-orange-500' },
                { activity: 'Préparation', time: 5, color: 'bg-gray-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${item.color}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{item.activity}</span>
                      <span className="text-sm font-medium text-gray-900">{item.time}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${item.color}`}
                        style={{ width: `${item.time}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </EmeresCardContent>
        </EmeresCard>
      </div>

      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions & Engagement */}
        <EmeresCard>
          <EmeresCardHeader>
            <EmeresCardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Sessions & Engagement
            </EmeresCardTitle>
          </EmeresCardHeader>
          <EmeresCardContent className="space-y-3">
            <MetricRow
              label="Sessions complétées"
              value={kpis.completed_sessions || 0}
              total={kpis.sessions_this_month || 0}
              showPercentage
            />
            <MetricRow
              label="Taux de présence"
              value={100 - (kpis.no_show_rate || 0)}
              suffix="%"
              trend="up"
            />
            <MetricRow
              label="Durée moyenne session"
              value="52"
              suffix=" min"
            />
            <MetricRow
              label="Sessions planifiées"
              value="8"
              suffix=" à venir"
            />
          </EmeresCardContent>
        </EmeresCard>

        {/* Objectifs & Résultats */}
        <EmeresCard>
          <EmeresCardHeader>
            <EmeresCardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Objectifs & Résultats
            </EmeresCardTitle>
          </EmeresCardHeader>
          <EmeresCardContent className="space-y-3">
            <MetricRow
              label="Objectifs complétés"
              value={kpis.objectives_completed_this_month || 0}
              suffix=" ce mois"
              trend="up"
            />
            <MetricRow
              label="Taux de réussite"
              value="78"
              suffix="%"
              trend="up"
            />
            <MetricRow
              label="Objectifs en cours"
              value="12"
              suffix=" actifs"
            />
            <MetricRow
              label="Temps moyen objectif"
              value="2.3"
              suffix=" semaines"
            />
          </EmeresCardContent>
        </EmeresCard>

        {/* Communications */}
        <EmeresCard>
          <EmeresCardHeader>
            <EmeresCardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Communications
            </EmeresCardTitle>
          </EmeresCardHeader>
          <EmeresCardContent className="space-y-3">
            <MetricRow
              label="Messages envoyés"
              value="24"
              suffix=" ce mois"
            />
            <MetricRow
              label="Temps de réponse moyen"
              value="2.5"
              suffix="h"
              trend="down"
            />
            <MetricRow
              label="Templates utilisés"
              value="8"
              suffix=" différents"
            />
            <MetricRow
              label="Satisfaction communication"
              value="4.6"
              suffix="/5"
              trend="up"
            />
          </EmeresCardContent>
        </EmeresCard>
      </div>

      {/* Actions rapides */}
      <EmeresCard>
        <EmeresCardHeader>
          <EmeresCardTitle>Actions Rapides</EmeresCardTitle>
        </EmeresCardHeader>
        <EmeresCardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <EmeresButton
              variant="outline"
              icon={<Mail />}
              className="h-20 flex-col"
            >
              <span className="text-sm">Envoyer rapport</span>
              <span className="text-xs text-gray-500">par email</span>
            </EmeresButton>
            
            <EmeresButton
              variant="outline"
              icon={<Printer />}
              className="h-20 flex-col"
            >
              <span className="text-sm">Imprimer</span>
              <span className="text-xs text-gray-500">rapport PDF</span>
            </EmeresButton>
            
            <EmeresButton
              variant="outline"
              icon={<Calendar />}
              className="h-20 flex-col"
            >
              <span className="text-sm">Planifier</span>
              <span className="text-xs text-gray-500">envoi auto</span>
            </EmeresButton>
            
            <EmeresButton
              variant="outline"
              icon={<Settings />}
              className="h-20 flex-col"
            >
              <span className="text-sm">Configurer</span>
              <span className="text-xs text-gray-500">métriques</span>
            </EmeresButton>
          </div>
        </EmeresCardContent>
      </EmeresCard>
    </div>
  );
};

// Composant KPI avec tendance
const KPICard = ({ title, value, subtitle, trend, icon: Icon, gradient }) => (
  <EmeresCard variant="default" interactive={true} className="group hover-lift cursor-pointer">
    <div className={`bg-gradient-to-r ${gradient} p-4 text-white relative overflow-hidden`}>
      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="h-5 w-5" />
            <h3 className="font-semibold text-sm">{title}</h3>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
    </div>
    
    <div className="p-4">
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {value}
          </div>
          <div className="text-xs text-gray-500">
            {subtitle}
          </div>
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center justify-between">
          <div className={`text-xs font-medium flex items-center gap-1 ${
            trend.direction === 'up' ? 'text-green-600' : 
            trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {getTrendIcon(trend.direction)}
            {trend.value}
          </div>
          <EmeresBadge 
            variant={trend.direction === 'up' ? 'success' : trend.direction === 'down' ? 'error' : 'secondary'} 
            size="xs"
          >
            {trend.percentage > 0 ? '+' : ''}{trend.percentage}%
          </EmeresBadge>
        </div>
      )}
    </div>
  </EmeresCard>
);

// Composant ligne de métrique
const MetricRow = ({ label, value, total, suffix = '', trend, showPercentage = false }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm text-gray-600">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-900">
        {value}
        {total && showPercentage && ` (${Math.round((value / total) * 100)}%)`}
        {suffix}
      </span>
      {trend && (
        <div className={`${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {getTrendIcon(trend)}
        </div>
      )}
    </div>
  </div>
);

// Fonction utilitaire pour les icônes de tendance
const getTrendIcon = (direction) => {
  if (direction === 'up') return <ArrowUp className="h-3 w-3" />;
  if (direction === 'down') return <ArrowDown className="h-3 w-3" />;
  return <Minus className="h-3 w-3" />;
};

export default ReportsAnalytics;