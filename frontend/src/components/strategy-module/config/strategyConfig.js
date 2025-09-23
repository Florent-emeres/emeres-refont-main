/**
 * Configuration stratégique par rôle - ÉMÉRÉS Platform
 * Structure universelle adaptée dynamiquement selon le type d'utilisateur
 */

// Configuration de base universelle
const baseConfig = {
  sections: {
    'objectives': 'Objectifs stratégiques',
    'kpis': 'Indicateurs clés (KPIs)',
    'advice': 'Conseils personnalisés',
    'tools': 'Outils de pilotage'
  }
};

// Configurations spécialisées par rôle
const roleConfigs = {
  // 🎓 Configuration Étudiant
  student: {
    ...baseConfig,
    roleName: 'Étudiant',
    roleDescription: 'Pilotez votre recherche de stage et développement de compétences',
    
    defaultObjectives: [
      {
        title: 'Trouver un stage/alternance',
        description: 'Décrocher un stage dans mon domaine d\'études',
        target: 1,
        priority: 'high',
        deadline_weeks: 12
      },
      {
        title: 'Candidatures hebdomadaires',
        description: 'Envoyer des candidatures qualifiées chaque semaine',
        target: 5,
        priority: 'high',
        deadline_weeks: 8
      },
      {
        title: 'Développer 3 compétences clés',
        description: 'Maîtriser Python, travail en équipe, anglais professionnel',
        target: 3,
        priority: 'medium',
        deadline_weeks: 16
      }
    ],

    keyIndicators: [
      { key: 'applications_sent', name: 'Candidatures envoyées', unit: '', target: 50 },
      { key: 'applications_accepted', name: 'Candidatures acceptées', unit: '', target: 5 },
      { key: 'offers_viewed', name: 'Offres consultées', unit: '', target: 100 },
      { key: 'skills_progress', name: 'Progression compétences', unit: '%', target: 80 },
      { key: 'evaluation_score', name: 'Score moyen évaluations', unit: '/5', target: 4 }
    ],

    adviceTypes: [
      {
        type: 'cv_optimization',
        title: 'Optimiser votre CV',
        description: 'Améliorez votre CV pour plus de réponses positives',
        priority: 'high',
        actionable: true
      },
      {
        type: 'cover_letter',
        title: 'Lettre de motivation adaptée',
        description: 'Personnalisez vos lettres selon le poste visé',
        priority: 'medium',
        actionable: true
      },
      {
        type: 'skill_gap',
        title: 'Formation recommandée',
        description: 'Micro-modules pour combler vos lacunes identifiées',
        priority: 'medium',
        actionable: true
      },
      {
        type: 'mentoring',
        title: 'Mentorat suggéré',
        description: 'Connectez-vous avec des mentors de votre secteur',
        priority: 'low',
        actionable: true
      }
    ],

    objectivesConfig: {
      allowCustom: true,
      maxObjectives: 5,
      priorityLevels: ['high', 'medium', 'low'],
      categories: ['stage', 'competences', 'reseau', 'formation']
    },

    kpisConfig: {
      chartTypes: ['line', 'bar', 'progress'],
      autoRefresh: true,
      refreshInterval: 'daily',
      alertThresholds: true
    },

    adviceConfig: {
      personalizedLevel: 'high',
      autoGenerate: true,
      categories: ['cv', 'recherche', 'competences', 'entretien'],
      maxActive: 10
    },

    toolsConfig: {
      features: ['timeline', 'alerts', 'export_pdf', 'progress_tracking'],
      exportFormats: ['pdf'],
      alertTypes: ['weekly_goals', 'application_reminder', 'skill_update'],
      defaultWidgets: ['timeline', 'progress_chart', 'weekly_goals']
    }
  },

  // 🏢 Configuration Entreprise
  company: {
    ...baseConfig,
    roleName: 'Entreprise',
    roleDescription: 'Optimisez vos recrutements et gestion des stagiaires',
    
    defaultObjectives: [
      {
        title: 'Recruter des stagiaires qualifiés',
        description: 'Recruter 10 stagiaires d\'ici fin d\'année',
        target: 10,
        priority: 'high',
        deadline_weeks: 20
      },
      {
        title: 'Diversifier les recrutements',
        description: 'Plus de profils variés (écoles A/B, différentes filières)',
        target: 5,
        priority: 'medium',
        deadline_weeks: 24
      },
      {
        title: 'Améliorer la fidélisation',
        description: 'Augmenter le taux de satisfaction des stagiaires',
        target: 85,
        priority: 'high',
        deadline_weeks: 12
      }
    ],

    keyIndicators: [
      { key: 'offers_published', name: 'Offres publiées', unit: '', target: 20 },
      { key: 'offers_expired', name: 'Offres expirées', unit: '', target: 0 },
      { key: 'applications_received', name: 'Candidatures reçues', unit: '', target: 100 },
      { key: 'applications_responded', name: 'Candidatures traitées', unit: '%', target: 90 },
      { key: 'response_time', name: 'Temps de réponse moyen', unit: 'jours', target: 3 },
      { key: 'intern_satisfaction', name: 'Satisfaction stagiaires', unit: '/5', target: 4 }
    ],

    adviceTypes: [
      {
        type: 'offer_optimization',
        title: 'Améliorer vos annonces',
        description: 'Optimisez titre, détails et avantages pour plus d\'attractivité',
        priority: 'high',
        actionable: true
      },
      {
        type: 'response_time',
        title: 'Réduire les délais',
        description: 'Répondez plus vite pour attirer les meilleurs candidats',
        priority: 'high',
        actionable: true
      },
      {
        type: 'talent_pool',
        title: 'Développer votre vivier',
        description: 'Utilisez favoris et suivis pour constituer une base de talents',
        priority: 'medium',
        actionable: true
      },
      {
        type: 'school_partnerships',
        title: 'Partenariats écoles',
        description: 'Suggestions d\'écoles selon votre secteur d\'activité',
        priority: 'medium',
        actionable: true
      }
    ],

    objectivesConfig: {
      allowCustom: true,
      maxObjectives: 8,
      priorityLevels: ['critical', 'high', 'medium', 'low'],
      categories: ['recrutement', 'qualite', 'diversite', 'fidélisation', 'partenariats']
    },

    kpisConfig: {
      chartTypes: ['line', 'bar', 'pie', 'funnel'],
      autoRefresh: true,
      refreshInterval: 'hourly',
      alertThresholds: true,
      benchmarking: true
    },

    adviceConfig: {
      personalizedLevel: 'high',
      autoGenerate: true,
      categories: ['recrutement', 'annonces', 'candidats', 'fidélisation'],
      maxActive: 15,
      priorityFiltering: true
    },

    toolsConfig: {
      features: ['recruitment_matrix', 'alerts', 'export_excel', 'export_pdf', 'benchmarking'],
      exportFormats: ['excel', 'pdf', 'csv'],
      alertTypes: ['offer_expiring', 'low_applications', 'response_delay', 'satisfaction_drop'],
      defaultWidgets: ['recruitment_funnel', 'kpi_dashboard', 'alerts_panel']
    }
  },

  // 🏫 Configuration École
  school: {
    ...baseConfig,
    roleName: 'École',
    roleDescription: 'Assurez le placement et suivi pédagogique de vos étudiants',
    
    defaultObjectives: [
      {
        title: '100% de placement en stage',
        description: 'Tous les étudiants trouvent un stage dans leur filière',
        target: 100,
        priority: 'critical',
        deadline_weeks: 16
      },
      {
        title: 'Nouveaux partenariats entreprises',
        description: 'Développer le réseau d\'entreprises partenaires',
        target: 20,
        priority: 'high',
        deadline_weeks: 24
      },
      {
        title: 'Suivi pédagogique harmonisé',
        description: 'Tous les tuteurs actifs dans le suivi des étudiants',
        target: 95,
        priority: 'high',
        deadline_weeks: 8
      }
    ],

    keyIndicators: [
      { key: 'placement_rate_global', name: 'Taux de placement global', unit: '%', target: 100 },
      { key: 'placement_rate_by_sector', name: 'Placement par filière', unit: '%', target: 95 },
      { key: 'conventions_validated', name: 'Conventions validées', unit: '', target: 200 },
      { key: 'student_feedback', name: 'Feedback étudiants', unit: '/5', target: 4 },
      { key: 'company_feedback', name: 'Feedback entreprises', unit: '/5', target: 4 },
      { key: 'active_missions', name: 'Missions actives suivies', unit: '', target: 150 }
    ],

    adviceTypes: [
      {
        type: 'sector_difficulty',
        title: 'Filières en difficulté',
        description: 'Alerte: peu de stages disponibles en logistique',
        priority: 'critical',
        actionable: true
      },
      {
        type: 'workshop_training',
        title: 'Ateliers d\'entraînement',
        description: 'Organisez des simulations d\'entretien pour vos étudiants',
        priority: 'medium',
        actionable: true
      },
      {
        type: 'company_relations',
        title: 'Relations entreprises',
        description: 'Recommandations pour équilibrer partenariats école-entreprise',
        priority: 'medium',
        actionable: true
      }
    ],

    objectivesConfig: {
      allowCustom: true,
      maxObjectives: 10,
      priorityLevels: ['critical', 'high', 'medium', 'low'],
      categories: ['placement', 'partenariats', 'suivi', 'qualite', 'innovation']
    },

    kpisConfig: {
      chartTypes: ['line', 'bar', 'pie', 'matrix'],
      autoRefresh: true,
      refreshInterval: 'daily',
      alertThresholds: true,
      segmentation: ['filiere', 'promotion', 'entreprise']
    },

    adviceConfig: {
      personalizedLevel: 'high',
      autoGenerate: true,
      categories: ['placement', 'pedagogie', 'partenariats', 'qualite'],
      maxActive: 20,
      urgencyLevels: true
    },

    toolsConfig: {
      features: ['cross_tables', 'ministerial_export', 'quality_alerts', 'sector_analysis'],
      exportFormats: ['excel', 'pdf', 'xml'],
      alertTypes: ['placement_risk', 'quality_issue', 'partnership_opportunity'],
      defaultWidgets: ['placement_matrix', 'sector_dashboard', 'quality_monitor']
    }
  },

  // 👨‍🏫 Configuration Mentor
  mentor: {
    ...baseConfig,
    roleName: 'Mentor',
    roleDescription: 'Accompagnez efficacement vos étudiants vers la réussite',
    
    defaultObjectives: [
      {
        title: 'Accompagner mes étudiants',
        description: 'Suivre 8 étudiants sur la période',
        target: 8,
        priority: 'high',
        deadline_weeks: 16
      },
      {
        title: 'Développer compétences spécifiques',
        description: 'Focus sur gestion de projet et communication',
        target: 2,
        priority: 'medium',
        deadline_weeks: 12
      },
      {
        title: 'Satisfaction étudiants',
        description: 'Maintenir un taux de satisfaction > 80%',
        target: 80,
        priority: 'high',
        deadline_weeks: 20
      }
    ],

    keyIndicators: [
      { key: 'students_mentored', name: 'Étudiants accompagnés', unit: '', target: 8 },
      { key: 'feedback_received', name: 'Feedback reçus', unit: '', target: 30 },
      { key: 'student_progress', name: 'Progression étudiants', unit: '%', target: 75 },
      { key: 'satisfaction_rate', name: 'Taux de satisfaction', unit: '%', target: 85 },
      { key: 'session_frequency', name: 'Fréquence des sessions', unit: '/semaine', target: 3 }
    ],

    adviceTypes: [
      {
        type: 'feedback_quality',
        title: 'Améliorer vos retours',
        description: 'Partagez plus de retours constructifs et spécifiques',
        priority: 'medium',
        actionable: true
      },
      {
        type: 'mini_challenges',
        title: 'Proposer des défis',
        description: 'Créez des mini-challenges adaptés à chaque étudiant',
        priority: 'medium',
        actionable: true
      },
      {
        type: 'platform_tools',
        title: 'Utiliser les outils ÉMÉRÉS',
        description: 'Maximisez l\'usage du chat et des checklists',
        priority: 'low',
        actionable: true
      }
    ],

    objectivesConfig: {
      allowCustom: true,
      maxObjectives: 6,
      priorityLevels: ['high', 'medium', 'low'],
      categories: ['accompagnement', 'competences', 'satisfaction', 'innovation']
    },

    kpisConfig: {
      chartTypes: ['line', 'bar', 'progress'],
      autoRefresh: true,
      refreshInterval: 'daily',
      alertThresholds: true
    },

    adviceConfig: {
      personalizedLevel: 'medium',
      autoGenerate: true,
      categories: ['accompagnement', 'pedagogie', 'communication'],
      maxActive: 8
    },

    toolsConfig: {
      features: ['mentoring_journal', 'quick_evaluations', 'student_alerts'],
      exportFormats: ['pdf'],
      alertTypes: ['student_inactive', 'progress_stagnant', 'feedback_due'],
      defaultWidgets: ['student_progress', 'session_calendar', 'quick_actions']
    }
  },

  // 🏛️ Configuration Institution
  institution: {
    ...baseConfig,
    roleName: 'Institution',
    roleDescription: 'Pilotez l\'écosystème des stages à l\'échelle territoriale',
    
    defaultObjectives: [
      {
        title: 'Augmenter offre secteur prioritaire',
        description: 'Plus d\'offres dans le secteur numérique',
        target: 30,
        priority: 'high',
        deadline_weeks: 24
      },
      {
        title: 'Diversité géographique',
        description: 'Équilibrer les offres sur tout le territoire',
        target: 80,
        priority: 'medium',
        deadline_weeks: 20
      },
      {
        title: 'Réduire échec conventions',
        description: 'Diminuer le taux d\'abandon de stages',
        target: 5,
        priority: 'high',
        deadline_weeks: 16
      }
    ],

    keyIndicators: [
      { key: 'sector_distribution', name: 'Répartition par secteur', unit: '%', target: 100 },
      { key: 'geographic_coverage', name: 'Couverture géographique', unit: '%', target: 90 },
      { key: 'global_placement_rate', name: 'Taux de placement global', unit: '%', target: 95 },
      { key: 'active_partners', name: 'Entreprises partenaires actives', unit: '', target: 500 },
      { key: 'convention_success', name: 'Taux de réussite conventions', unit: '%', target: 95 }
    ],

    adviceTypes: [
      {
        type: 'sector_campaigns',
        title: 'Campagnes ciblées',
        description: 'Communication sur secteurs en pénurie',
        priority: 'high',
        actionable: true
      },
      {
        type: 'local_partnerships',
        title: 'Partenariats locaux',
        description: 'Subventions/accords pour entreprises locales',
        priority: 'medium',
        actionable: true
      },
      {
        type: 'inter_institutional',
        title: 'Coopération inter-établissements',
        description: 'Mise en relation écoles-entreprises optimisée',
        priority: 'medium',
        actionable: true
      }
    ],

    objectivesConfig: {
      allowCustom: true,
      maxObjectives: 12,
      priorityLevels: ['strategic', 'high', 'medium', 'low'],
      categories: ['territorial', 'sectoriel', 'qualite', 'partenariats', 'innovation']
    },

    kpisConfig: {
      chartTypes: ['map', 'line', 'bar', 'pie', 'matrix'],
      autoRefresh: true,
      refreshInterval: 'daily',
      alertThresholds: true,
      territorialView: true
    },

    adviceConfig: {
      personalizedLevel: 'high',
      autoGenerate: true,
      categories: ['territorial', 'sectoriel', 'partenariats', 'politique'],
      maxActive: 25
    },

    toolsConfig: {
      features: ['dynamic_mapping', 'annual_reports', 'policy_alerts', 'benchmarking'],
      exportFormats: ['excel', 'pdf', 'xml', 'json'],
      alertTypes: ['sector_shortage', 'territorial_imbalance', 'quality_issue'],
      defaultWidgets: ['territorial_map', 'sector_matrix', 'policy_dashboard']
    }
  },

  // ⚙️ Configuration Admin ÉMÉRÉS
  admin: {
    ...baseConfig,
    roleName: 'Admin ÉMÉRÉS',
    roleDescription: 'Pilotez la croissance et qualité de la plateforme',
    
    defaultObjectives: [
      {
        title: 'Croissance utilisateurs',
        description: 'Atteindre +500 nouveaux utilisateurs/mois',
        target: 500,
        priority: 'critical',
        deadline_weeks: 4
      },
      {
        title: 'Équilibre offre/demande',
        description: 'Maintenir ratio optimal offres/candidats',
        target: 80,
        priority: 'high',
        deadline_weeks: 8
      },
      {
        title: 'Qualité relations',
        description: 'Satisfaction globale > 85%',
        target: 85,
        priority: 'high',
        deadline_weeks: 12
      }
    ],

    keyIndicators: [
      { key: 'active_registrations', name: 'Inscriptions actives', unit: '', target: 10000 },
      { key: 'user_engagement', name: 'Engagement utilisateurs', unit: '%', target: 70 },
      { key: 'connection_rate', name: 'Taux de connexion', unit: '%', target: 60 },
      { key: 'global_satisfaction', name: 'Satisfaction globale', unit: '/5', target: 4.5 },
      { key: 'platform_performance', name: 'Performance plateforme', unit: '%', target: 99 }
    ],

    adviceTypes: [
      {
        type: 'growth_campaigns',
        title: 'Campagnes de croissance',
        description: 'Lancer mailings et événements ciblés',
        priority: 'high',
        actionable: true
      },
      {
        type: 'feature_optimization',
        title: 'Optimiser fonctionnalités',
        description: 'Ajustements selon feedbacks utilisateurs',
        priority: 'medium',
        actionable: true
      },
      {
        type: 'bottleneck_analysis',
        title: 'Analyser les goulots',
        description: 'Identifier et résoudre les blocages système',
        priority: 'high',
        actionable: true
      }
    ],

    objectivesConfig: {
      allowCustom: true,
      maxObjectives: 15,
      priorityLevels: ['critical', 'strategic', 'high', 'medium', 'low'],
      categories: ['croissance', 'qualite', 'technique', 'business', 'innovation']
    },

    kpisConfig: {
      chartTypes: ['line', 'bar', 'pie', 'funnel', 'cohort'],
      autoRefresh: true,
      refreshInterval: 'realtime',
      alertThresholds: true,
      multiTenant: true
    },

    adviceConfig: {
      personalizedLevel: 'expert',
      autoGenerate: true,
      categories: ['croissance', 'produit', 'technique', 'business'],
      maxActive: 30
    },

    toolsConfig: {
      features: ['super_dashboard', 'multi_profile_reports', 'critical_alerts', 'analytics'],
      exportFormats: ['excel', 'pdf', 'json', 'api'],
      alertTypes: ['security_issue', 'performance_drop', 'user_churn', 'business_critical'],
      defaultWidgets: ['growth_metrics', 'platform_health', 'user_analytics', 'business_kpis']
    }
  }
};

/**
 * Fonction principale pour récupérer la configuration selon le rôle
 * @param {string} userRole - Le rôle de l'utilisateur
 * @returns {object} Configuration complète pour le rôle
 */
export const getStrategyConfig = (userRole) => {
  const config = roleConfigs[userRole];
  if (!config) {
    console.warn(`Configuration non trouvée pour le rôle: ${userRole}, utilisation du rôle 'student'`);
    return roleConfigs.student;
  }
  return config;
};

/**
 * Fonction pour obtenir la liste des rôles disponibles
 * @returns {array} Liste des rôles avec leurs métadonnées
 */
export const getAvailableRoles = () => {
  return Object.keys(roleConfigs).map(roleKey => ({
    key: roleKey,
    name: roleConfigs[roleKey].roleName,
    description: roleConfigs[roleKey].roleDescription
  }));
};

/**
 * Fonction pour valider si un rôle existe
 * @param {string} userRole - Le rôle à valider
 * @returns {boolean} True si le rôle existe
 */
export const isValidRole = (userRole) => {
  return Object.keys(roleConfigs).includes(userRole);
};

export default getStrategyConfig;