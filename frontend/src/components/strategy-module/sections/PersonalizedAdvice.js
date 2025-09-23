import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { 
  Lightbulb, 
  Star,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Eye,
  EyeOff,
  Filter,
  Zap,
  Target,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const PersonalizedAdvice = ({ advice = [], config, onUpdate, userRole }) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');
  const [showRead, setShowRead] = useState(false);

  const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };

  const filteredAdvice = advice
    .filter(item => {
      if (!showRead && item.is_read) return false;
      if (filter === 'all') return true;
      return item.type === filter || item.priority === filter;
    })
    .sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));

  const markAsRead = (adviceId) => {
    const updatedAdvice = advice.map(item =>
      item.id === adviceId ? { ...item, is_read: true } : item
    );
    onUpdate(updatedAdvice);
  };

  const markAsUnread = (adviceId) => {
    const updatedAdvice = advice.map(item =>
      item.id === adviceId ? { ...item, is_read: false } : item
    );
    onUpdate(updatedAdvice);
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      'critical': { color: 'bg-red-500 text-white', icon: AlertTriangle, text: 'Critique' },
      'high': { color: 'bg-orange-500 text-white', icon: Zap, text: 'Haute' },
      'medium': { color: 'bg-blue-500 text-white', icon: Target, text: 'Moyenne' },
      'low': { color: 'bg-gray-500 text-white', icon: Clock, text: 'Basse' }
    };
    const badge = badges[priority] || badges.medium;
    const Icon = badge.icon;
    return (
      <Badge className={`${badge.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {badge.text}
      </Badge>
    );
  };

  const getTypeIcon = (type) => {
    const icons = {
      'cv_optimization': Target,
      'cover_letter': MessageSquare,
      'skill_gap': TrendingUp,
      'mentoring': Star,
      'offer_optimization': Lightbulb,
      'response_time': Clock,
      'talent_pool': Star,
      'school_partnerships': CheckCircle,
      'sector_difficulty': AlertTriangle,
      'workshop_training': Star,
      'company_relations': CheckCircle,
      'feedback_quality': MessageSquare,
      'mini_challenges': Target,
      'platform_tools': Zap
    };
    return icons[type] || Lightbulb;
  };

  const getTypeLabel = (type) => {
    const labels = {
      'cv_optimization': 'Optimisation CV',
      'cover_letter': 'Lettre de motivation',
      'skill_gap': 'Compétences',
      'mentoring': 'Mentorat',
      'offer_optimization': 'Annonces',
      'response_time': 'Réactivité',
      'talent_pool': 'Vivier talents',
      'school_partnerships': 'Partenariats',
      'sector_difficulty': 'Difficultés secteur',
      'workshop_training': 'Formation',
      'company_relations': 'Relations',
      'feedback_quality': 'Feedback',
      'mini_challenges': 'Défis',
      'platform_tools': 'Outils'
    };
    return labels[type] || 'Conseil';
  };

  const unreadCount = advice.filter(item => !item.is_read).length;
  const actionableCount = advice.filter(item => item.actionable && !item.is_read).length;

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Conseils personnalisés</h3>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-sm text-gray-600">
              {unreadCount} nouveau(x) conseil(s)
            </p>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Zap className="h-3 w-3 mr-1" />
              {actionableCount} actionnable(s)
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">Tous les conseils</option>
            <option value="critical">Critiques</option>
            <option value="high">Haute priorité</option>
            <option value="actionable">Actionnables</option>
          </select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRead(!showRead)}
            className={showRead ? 'bg-blue-50' : ''}
          >
            {showRead ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showRead ? 'Masquer lus' : 'Afficher lus'}
          </Button>
        </div>
      </div>

      {/* Vue d'ensemble des conseils */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Critiques</p>
                <p className="text-2xl font-bold text-orange-900">
                  {advice.filter(a => a.priority === 'critical' && !a.is_read).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Haute priorité</p>
                <p className="text-2xl font-bold text-blue-900">
                  {advice.filter(a => a.priority === 'high' && !a.is_read).length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Actionnables</p>
                <p className="text-2xl font-bold text-green-900">
                  {actionableCount}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Total</p>
                <p className="text-2xl font-bold text-purple-900">
                  {advice.length}
                </p>
              </div>
              <Lightbulb className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des conseils */}
      <div className="space-y-4">
        {filteredAdvice.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'Aucun conseil disponible' : 'Aucun conseil dans cette catégorie'}
              </h3>
              <p className="text-gray-500">
                {unreadCount === 0 
                  ? 'Tous vos conseils ont été consultés !' 
                  : 'Changez les filtres pour voir plus de conseils'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAdvice.map((adviceItem) => {
            const TypeIcon = getTypeIcon(adviceItem.type);
            const isNew = !adviceItem.is_read;
            
            return (
              <Card 
                key={adviceItem.id} 
                className={`transition-all hover:shadow-md ${
                  isNew ? 'border-blue-200 bg-blue-50/30' : ''
                } ${adviceItem.priority === 'critical' ? 'border-red-200' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-3 rounded-lg ${
                        adviceItem.priority === 'critical' ? 'bg-red-100' :
                        adviceItem.priority === 'high' ? 'bg-orange-100' :
                        'bg-blue-100'
                      }`}>
                        <TypeIcon className={`h-6 w-6 ${
                          adviceItem.priority === 'critical' ? 'text-red-600' :
                          adviceItem.priority === 'high' ? 'text-orange-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{adviceItem.title}</h4>
                          {isNew && (
                            <Badge className="bg-blue-500 text-white">Nouveau</Badge>
                          )}
                          {getPriorityBadge(adviceItem.priority)}
                          <Badge variant="outline">
                            {getTypeLabel(adviceItem.type)}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{adviceItem.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(adviceItem.created_at).toLocaleDateString()}
                          </div>
                          {adviceItem.actionable && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              <ArrowRight className="h-3 w-3 mr-1" />
                              Action recommandée
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {adviceItem.actionable && (
                        <Button size="sm" className="whitespace-nowrap">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Agir maintenant
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => isNew ? markAsRead(adviceItem.id) : markAsUnread(adviceItem.id)}
                      >
                        {isNew ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marquer lu
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Non lu
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Conseil automatique */}
      {config.autoGenerate && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-900">Conseil intelligent</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-green-800 mb-3">
              Basé sur votre activité récente, nous vous recommandons de vous concentrer sur l'amélioration de vos {userRole === 'student' ? 'candidatures' : userRole === 'company' ? 'annonces' : 'processus'}.
            </p>
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
              <Lightbulb className="h-4 w-4 mr-2" />
              Voir les recommandations détaillées
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalizedAdvice;