import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { 
  Brain, 
  Star, 
  MapPin, 
  Clock, 
  Building, 
  Lightbulb,
  Target,
  Sparkles,
  TrendingUp
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AIMatchingResults = ({ onApply }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState({});

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/matching/recommendations`);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Erreur lors du chargement des recommandations IA');
    } finally {
      setLoading(false);
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-blue-500';
    if (score >= 0.4) return 'bg-blue-500';
    return 'bg-red-500';
  };

  const getMatchScoreLabel = (score) => {
    if (score >= 0.8) return 'Excellent match';
    if (score >= 0.6) return 'Bon match';
    if (score >= 0.4) return 'Match correct';
    return 'Match faible';
  };

  const handleApply = async (offerId) => {
    setAnalyzing(prev => ({ ...prev, [offerId]: true }));
    try {
      await onApply(offerId);
      // Refresh recommendations after applying
      setTimeout(() => {
        fetchRecommendations();
      }, 1000);
    } finally {
      setAnalyzing(prev => ({ ...prev, [offerId]: false }));
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-blue-500 animate-pulse" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                Analyse IA en cours...
              </h3>
              <p className="text-gray-600">
                Recherche des meilleures opportunités pour vous
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Aucune recommandation disponible
          </h3>
          <p className="text-gray-600">
            Complétez votre profil pour obtenir des recommandations personnalisées
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Recommandations IA personnalisées
          </h2>
          <p className="text-gray-600">
            Stages sélectionnés spécialement pour votre profil
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {recommendations.map((recommendation, index) => {
          const { offer, match_score, reasoning, compatibility_factors } = recommendation;
          const matchPercentage = Math.round(match_score * 100);
          
          return (
            <Card key={offer.id} className="card-hover relative overflow-hidden">
              {/* AI Badge */}
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                  <Brain className="h-3 w-3 mr-1" />
                  IA Match {matchPercentage}%
                </Badge>
              </div>

              {/* Ranking Badge */}
              {index < 3 && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant={index === 0 ? "default" : "secondary"}>
                    <Star className="h-3 w-3 mr-1" />
                    #{index + 1}
                  </Badge>
                </div>
              )}

              <CardHeader className="pt-16 pb-4">
                <CardTitle className="text-xl mb-2">{offer.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span>Entreprise</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{offer.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{offer.duration}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Match Score Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Score de compatibilité
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {matchPercentage}%
                    </span>
                  </div>
                  <Progress 
                    value={matchPercentage} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-600">
                    {getMatchScoreLabel(match_score)}
                  </p>
                </div>

                {/* Offer Description */}
                <div>
                  <p className="text-gray-700 line-clamp-2 mb-3">
                    {offer.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{offer.sector}</Badge>
                    <Badge variant={offer.level === 'beginner' ? 'secondary' : 
                                  offer.level === 'intermediate' ? 'default' : 'destructive'}>
                      {offer.level === 'beginner' ? 'Débutant' : 
                       offer.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                    </Badge>
                    {offer.is_remote && (
                      <Badge variant="outline">Télétravail</Badge>
                    )}
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Pourquoi cette recommandation ?
                      </h4>
                      <p className="text-sm text-gray-700 mb-3">
                        {reasoning}
                      </p>
                      
                      {/* Compatibility Factors */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Points de compatibilité
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {compatibility_factors.map((factor, idx) => (
                            <div key={idx} className="flex items-center space-x-1 bg-white px-2 py-1 rounded-full border border-blue-200">
                              <Lightbulb className="h-3 w-3 text-blue-500" />
                              <span className="text-xs text-gray-700">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Match */}
                {offer.skills_required && offer.skills_required.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                      Compétences recherchées
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {offer.skills_required.slice(0, 5).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {offer.skills_required.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{offer.skills_required.length - 5} autres
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => handleApply(offer.id)}
                    disabled={analyzing[offer.id]}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                  >
                    {analyzing[offer.id] ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Candidature...</span>
                      </div>
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-2" />
                        Postuler maintenant
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Refresh Button */}
      <div className="text-center pt-6">
        <Button
          onClick={fetchRecommendations}
          variant="outline"
          disabled={loading}
          className="border-purple-300 text-purple-600 hover:bg-purple-50"
        >
          <Brain className="h-4 w-4 mr-2" />
          Actualiser les recommandations IA
        </Button>
      </div>
    </div>
  );
};

export default AIMatchingResults;