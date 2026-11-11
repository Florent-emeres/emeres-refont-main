import React from 'react';
import EmeresCard, { EmeresCardTitle, EmeresCardDescription } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import {
  Award,
  Users,
  Calendar,
  Target,
  Briefcase,
  Star,
  Lock,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const kpiCards = [
  {
    key: 'students_mentored',
    label: 'Étudiants accompagnés',
    icon: Users,
    gradient: 'from-teal-500 to-cyan-600',
    sub: (impact) => `${impact.active_relations || 0} relation(s) active(s)`
  },
  {
    key: 'sessions_completed',
    label: 'Sessions animées',
    icon: Calendar,
    gradient: 'from-indigo-500 to-indigo-600',
    sub: () => 'Sessions de mentorat terminées'
  },
  {
    key: 'objectives_completed',
    label: 'Objectifs atteints',
    icon: Target,
    gradient: 'from-green-500 to-green-600',
    sub: (impact) => `sur ${impact.objectives_total || 0} objectif(s) créé(s)`
  },
  {
    key: 'placed_students',
    label: 'Talents placés',
    icon: Briefcase,
    gradient: 'from-blue-500 to-blue-600',
    sub: () => 'Mentorés en stage ou en emploi'
  },
  {
    key: 'average_rating',
    label: 'Note moyenne',
    icon: Star,
    gradient: 'from-amber-500 to-orange-600',
    sub: (impact) => `${impact.evaluations_count || 0} évaluation(s)`
  },
  {
    key: 'completed_relations',
    label: 'Parcours terminés',
    icon: CheckCircle,
    gradient: 'from-emerald-500 to-emerald-600',
    sub: () => 'Mentorats menés à terme'
  }
];

const statusLabels = {
  active: { label: 'En cours', variant: 'primary' },
  completed: { label: 'Terminé', variant: 'success' },
  paused: { label: 'En pause', variant: 'secondary' },
  cancelled: { label: 'Annulé', variant: 'secondary' }
};

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const MentorValorization = ({ impact }) => {
  if (!impact) {
    return (
      <EmeresCard>
        <EmeresCardTitle>Votre impact en tant que mentor</EmeresCardTitle>
        <EmeresCardDescription>Chargement de vos statistiques d'impact…</EmeresCardDescription>
      </EmeresCard>
    );
  }

  const earnedBadges = impact.badges ? impact.badges.filter((badge) => badge.earned) : [];
  const lockedBadges = impact.badges ? impact.badges.filter((badge) => !badge.earned) : [];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-6 sm:p-8 text-white shadow-emeres-md">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Award className="h-6 w-6" />
              Votre impact en tant que mentor
            </h2>
            <p className="mt-2 text-teal-50/90 text-sm sm:text-base">
              Tout ce que vous avez transmis, mesuré sur des données réelles de la plateforme.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-bold">{impact.students_mentored || 0}</div>
              <div className="text-xs text-teal-50/80">étudiants accompagnés</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-right">
              <div className="text-3xl font-bold">{impact.earned_badges || 0}</div>
              <div className="text-xs text-teal-50/80">badges obtenus</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map(({ key, label, icon: Icon, gradient, sub }) => (
          <EmeresCard key={key} padding="none" className="overflow-hidden">
            <div className={`bg-gradient-to-r ${gradient} px-4 py-2.5 flex items-center gap-2 text-white`}>
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{label}</span>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-gray-900">{impact[key] || 0}</div>
              <div className="text-xs text-gray-500 mt-1">{sub(impact)}</div>
            </div>
          </EmeresCard>
        ))}
      </div>

      <EmeresCard>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Badges de reconnaissance
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Vos badges évoluent automatiquement avec votre activité de mentorat réelle.
            </p>
          </div>
          <EmeresBadge variant="warning" size="md">
            {impact.earned_badges || 0} / {(impact.badges || []).length}
          </EmeresBadge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {earnedBadges.map((badge) => (
            <div
              key={badge.id}
              className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <Award className="h-5 w-5 text-amber-500" />
                <EmeresBadge variant="success" size="xs">Obtenu</EmeresBadge>
              </div>
              <div className="font-medium text-sm text-gray-900">{badge.label}</div>
              <div className="text-xs text-gray-600">{badge.description}</div>
            </div>
          ))}
          {lockedBadges.map((badge) => (
            <div
              key={badge.id}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-2 opacity-60"
            >
              <div className="flex items-center justify-between">
                <Lock className="h-5 w-5 text-gray-400" />
                <EmeresBadge variant="secondary" size="xs">À débloquer</EmeresBadge>
              </div>
              <div className="font-medium text-sm text-gray-700">{badge.label}</div>
              <div className="text-xs text-gray-500">{badge.description}</div>
            </div>
          ))}
        </div>
      </EmeresCard>

      <EmeresCard>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-teal-600" />
          Vos mentorés
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Les étudiants que vous accompagnez ou avez accompagnés.
        </p>

        {(!impact.mentees || impact.mentees.length === 0) ? (
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <Users className="h-8 w-8 text-gray-400 mx-auto" />
            <p className="mt-2 text-sm text-gray-600">
              Aucun mentoré pour le moment. Les étudiants peuvent vous découvrir depuis leur
              espace et vous envoyer une demande de mentorat.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {impact.mentees.map((mentee, index) => {
              const status = statusLabels[mentee.status] || statusLabels.active;
              const since = formatDate(mentee.since);
              return (
                <div
                  key={`${mentee.name}-${index}`}
                  className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-4 py-3 flex-wrap"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {mentee.name || 'Étudiant'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {mentee.program_type || 'Mentorat'}
                      {since ? ` · depuis le ${since}` : ''}
                    </div>
                  </div>
                  <EmeresBadge variant={status.variant} size="xs">{status.label}</EmeresBadge>
                </div>
              );
            })}
          </div>
        )}
      </EmeresCard>
    </div>
  );
};

export default MentorValorization;
