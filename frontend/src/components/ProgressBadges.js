import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { 
  Award, 
  Star, 
  Trophy, 
  Target, 
  CheckCircle,
  Lock,
  User,
  Briefcase,
  BookOpen,
  Brain,
  Users,
  TrendingUp,
  Sparkles,
  Crown,
  Medal,
  Zap,
  Heart,
  Coffee
} from 'lucide-react';

const ProgressBadges = ({ profile, applications, projects = [] }) => {
  const [userBadges, setUserBadges] = useState([]);
  const [progressStats, setProgressStats] = useState({});

  const badgeDefinitions = [
    {
      id: 'profile_complete',
      name: 'Profil Complet',
      description: 'Profil 100% complété',
      icon: User,
      color: 'bg-green-100 text-green-800',
      criteria: (profile) => getProfileCompletion(profile) >= 100,
      points: 50
    },
    {
      id: 'first_application',
      name: 'Premier Pas',
      description: 'Première candidature envoyée',
      icon: Target,
      color: 'bg-blue-100 text-blue-800',
      criteria: (profile, applications) => applications?.length > 0,
      points: 25
    },
    {
      id: 'active_candidate',
      name: 'Candidat Actif',
      description: '5 candidatures envoyées',
      icon: Briefcase,
      color: 'bg-purple-100 text-purple-800',
      criteria: (profile, applications) => applications?.length >= 5,
      points: 75
    },
    {
      id: 'portfolio_creator',
      name: 'Créateur Portfolio',
      description: '3 projets ajoutés au portfolio',
      icon: BookOpen,
      color: 'bg-blue-100 text-amber-800',
      criteria: (profile, applications, projects) => projects?.length >= 3,
      points: 100
    },
    {
      id: 'skill_master',
      name: 'Maître des Compétences',
      description: '10 compétences ajoutées',
      icon: Brain,
      color: 'bg-indigo-100 text-indigo-800',
      criteria: (profile) => profile?.skills?.length >= 10,
      points: 60
    },
    {
      id: 'networking_pro',
      name: 'Pro du Réseau',
      description: 'LinkedIn et portfolio complétés',
      icon: Users,
      color: 'bg-pink-100 text-pink-800',
      criteria: (profile) => profile?.linkedin_url && profile?.portfolio_url,
      points: 40
    },
    {
      id: 'persistent',
      name: 'Persévérant',
      description: '10 candidatures envoyées',
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-800',
      criteria: (profile, applications) => applications?.length >= 10,
      points: 150
    },
    {
      id: 'early_adopter',
      name: 'Pionnier IA',
      description: 'Utilise les recommandations IA',
      icon: Sparkles,
      color: 'bg-cyan-100 text-cyan-800',
      criteria: () => true, // Activated when using AI recommendations
      points: 30
    },
    {
      id: 'champion',
      name: 'Champion',
      description: 'Plus de 500 points de progression',
      icon: Crown,
      color: 'bg-blue-100 text-amber-800',
      criteria: (profile) => getTotalPoints(profile) >= 500,
      points: 200
    },
    {
      id: 'legend',
      name: 'Légende',
      description: 'Plus de 1000 points de progression',
      icon: Trophy,
      color: 'bg-gold-100 text-gold-800',
      criteria: (profile) => getTotalPoints(profile) >= 1000,
      points: 500
    }
  ];

  const achievements = [
    {
      id: 'streak_7',
      name: 'Série de 7',
      description: '7 jours consécutifs de connexion',
      icon: Zap,
      rarity: 'common'
    },
    {
      id: 'perfectionist',
      name: 'Perfectionniste',
      description: 'Profil 100% complété en moins de 24h',
      icon: Medal,
      rarity: 'rare'
    },
    {
      id: 'social_butterfly',
      name: 'Papillon Social',
      description: 'Plus de 20 connexions réseau',
      icon: Heart,
      rarity: 'epic'
    }
  ];

  const getProfileCompletion = (profile) => {
    if (!profile) return 0;
    
    const fields = [
      profile.first_name,
      profile.last_name,
      profile.phone,
      profile.education_level,
      profile.field_of_study,
      profile.school_name,
      profile.bio,
      profile.skills?.length > 0,
      profile.interests?.length > 0,
      profile.experience_level,
      profile.linkedin_url,
      profile.portfolio_url
    ];
    
    const completed = fields.filter(field => field).length;
    return Math.round((completed / fields.length) * 100);
  };

  const getTotalPoints = (profile) => {
    return userBadges.reduce((total, badge) => total + badge.points, 0);
  };

  const getLevelFromPoints = (points) => {
    if (points >= 1000) return { level: 10, name: 'Légende', color: 'text-amber-600', icon: Crown };
    if (points >= 800) return { level: 9, name: 'Maître', color: 'text-purple-600', icon: Trophy };
    if (points >= 600) return { level: 8, name: 'Expert', color: 'text-blue-600', icon: Star };
    if (points >= 400) return { level: 7, name: 'Avancé', color: 'text-green-600', icon: Award };
    if (points >= 300) return { level: 6, name: 'Confirmé', color: 'text-indigo-600', icon: Medal };
    if (points >= 200) return { level: 5, name: 'Intermédiaire', color: 'text-orange-600', icon: Target };
    if (points >= 120) return { level: 4, name: 'Progressant', color: 'text-pink-600', icon: TrendingUp };
    if (points >= 80) return { level: 3, name: 'Motivé', color: 'text-cyan-600', icon: Zap };
    if (points >= 40) return { level: 2, name: 'Débutant', color: 'text-gray-600', icon: User };
    return { level: 1, name: 'Novice', color: 'text-gray-500', icon: Coffee };
  };

  useEffect(() => {
    // Calculate earned badges
    const earnedBadges = badgeDefinitions.filter(badge => 
      badge.criteria(profile, applications, projects)
    );
    setUserBadges(earnedBadges);

    // Calculate progress stats
    const stats = {
      profileCompletion: getProfileCompletion(profile),
      totalApplications: applications?.length || 0,
      totalProjects: projects?.length || 0,
      totalSkills: profile?.skills?.length || 0,
      totalPoints: earnedBadges.reduce((total, badge) => total + badge.points, 0)
    };
    setProgressStats(stats);
  }, [profile, applications, projects]);

  const currentLevel = getLevelFromPoints(progressStats.totalPoints);
  const nextLevel = getLevelFromPoints(progressStats.totalPoints + 100);
  const pointsToNextLevel = (nextLevel.level * 100) - progressStats.totalPoints;

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg bg-white shadow-sm`}>
              <currentLevel.icon className={`h-6 w-6 ${currentLevel.color}`} />
            </div>
            <div>
              <span className="text-2xl font-bold">Niveau {currentLevel.level}</span>
              <p className={`text-lg ${currentLevel.color} font-medium`}>
                {currentLevel.name}
              </p>
            </div>
          </CardTitle>
          <CardDescription>
            {progressStats.totalPoints} points • {pointsToNextLevel} points jusqu'au niveau suivant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression vers {nextLevel.name}</span>
              <span>{Math.min(100, Math.round((progressStats.totalPoints % 100) * 1))}%</span>
            </div>
            <Progress 
              value={Math.min(100, (progressStats.totalPoints % 100) * 1)} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {progressStats.profileCompletion}%
                </p>
                <p className="text-sm text-gray-600">Profil</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {progressStats.totalApplications}
                </p>
                <p className="text-sm text-gray-600">Candidatures</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {progressStats.totalProjects}
                </p>
                <p className="text-sm text-gray-600">Projets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {progressStats.totalSkills}
                </p>
                <p className="text-sm text-gray-600">Compétences</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges Earned */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-amber-600" />
            <span>Badges Obtenus ({userBadges.length})</span>
          </CardTitle>
          <CardDescription>
            Vos accomplissements et réalisations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userBadges.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Aucun badge obtenu pour le moment</p>
              <p className="text-sm text-gray-500">Complétez votre profil pour débloquer vos premiers badges !</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userBadges.map((badge) => {
                const BadgeIcon = badge.icon;
                return (
                  <div
                    key={badge.id}
                    className="p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-300 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="text-center space-y-2">
                      <div className={`inline-flex p-3 rounded-full ${badge.color} group-hover:scale-110 transition-transform`}>
                        <BadgeIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 text-sm">{badge.name}</h3>
                        <p className="text-xs text-gray-600">{badge.description}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          +{badge.points} pts
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-gray-500" />
            <span>Badges à Débloquer</span>
          </CardTitle>
          <CardDescription>
            Objectifs à atteindre pour gagner plus de points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badgeDefinitions
              .filter(badge => !userBadges.find(earned => earned.id === badge.id))
              .map((badge) => {
                const BadgeIcon = badge.icon;
                return (
                  <div
                    key={badge.id}
                    className="p-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 opacity-60 hover:opacity-80 transition-opacity"
                  >
                    <div className="text-center space-y-2">
                      <div className="inline-flex p-3 rounded-full bg-gray-200">
                        <BadgeIcon className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-600 text-sm">{badge.name}</h3>
                        <p className="text-xs text-gray-500">{badge.description}</p>
                        <Badge variant="outline" className="mt-1 text-xs bg-gray-100">
                          +{badge.points} pts
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Next Milestones */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Prochains Objectifs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {progressStats.profileCompletion < 100 && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Compléter le profil</p>
                    <p className="text-sm text-gray-600">
                      {progressStats.profileCompletion}% complété
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">+50 pts</Badge>
              </div>
            )}
            
            {progressStats.totalApplications === 0 && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Première candidature</p>
                    <p className="text-sm text-gray-600">
                      Postulez à votre première offre
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">+25 pts</Badge>
              </div>
            )}

            {progressStats.totalProjects < 3 && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Créer un portfolio</p>
                    <p className="text-sm text-gray-600">
                      {progressStats.totalProjects}/3 projets ajoutés
                    </p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-800">+100 pts</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressBadges;