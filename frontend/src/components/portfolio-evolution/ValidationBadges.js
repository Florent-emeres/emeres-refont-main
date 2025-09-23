import React from 'react';
import { Badge } from '../ui/badge';
import { Lock, CheckCircle, GraduationCap, AlertCircle } from 'lucide-react';

export const ValidationBadges = ({ validationStatus, size = 'default' }) => {
  const badgeConfigs = {
    'self-declared': {
      icon: Lock,
      text: 'Auto-déclaré',
      className: 'bg-gray-100 text-gray-700 border-gray-300',
      description: 'Projet ajouté par l\'étudiant, non vérifié'
    },
    'mentor-validated': {
      icon: CheckCircle,
      text: 'Validé par mentor',
      className: 'bg-green-100 text-green-700 border-green-300',
      description: 'Projet crédibilisé par un professionnel'
    },
    'school-validated': {
      icon: GraduationCap,
      text: 'Validé par école',
      className: 'bg-blue-100 text-blue-700 border-blue-300',
      description: 'Projet certifié comme partie intégrante du parcours académique'
    },
    'pending': {
      icon: AlertCircle,
      text: 'En attente de validation',
      className: 'bg-blue-100 text-amber-700 border-blue-300',
      description: 'Validation en cours de traitement'
    }
  };

  const config = badgeConfigs[validationStatus] || badgeConfigs['self-declared'];
  const IconComponent = config.icon;
  
  const iconSize = size === 'small' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className="flex items-center space-x-1" title={config.description}>
      <Badge variant="outline" className={`${config.className} text-xs`}>
        <IconComponent className={`${iconSize} mr-1`} />
        {config.text}
      </Badge>
    </div>
  );
};

export const ValidationLevels = {
  SELF_DECLARED: 'self-declared',
  MENTOR_VALIDATED: 'mentor-validated',
  SCHOOL_VALIDATED: 'school-validated',
  PENDING: 'pending'
};