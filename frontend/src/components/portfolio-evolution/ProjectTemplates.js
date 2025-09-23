// Modèles de projets par domaine d'études
export const projectTemplates = {
  'développement-web': {
    name: 'Projet de Développement Web',
    description: 'Application web ou site internet avec fonctionnalités complètes',
    requiredFields: ['demo_url', 'github_url'],
    suggestedTechnologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Git'],
    checklist: [
      'Interface utilisateur responsive',
      'Fonctionnalités principales implémentées',
      'Base de données configurée',
      'Tests réalisés',
      'Déployement effectué',
      'Documentation rédigée'
    ],
    deliverables: [
      'Code source sur GitHub',
      'Site déployé et accessible',
      'Captures d\'écran de l\'interface',
      'Documentation technique'
    ]
  },
  'data-ia': {
    name: 'Projet Data Science / IA',
    description: 'Analyse de données, machine learning ou intelligence artificielle',
    requiredFields: ['github_url', 'report_file'],
    suggestedTechnologies: ['Python', 'pandas', 'NumPy', 'scikit-learn', 'Tableau', 'Jupyter', 'SQL', 'TensorFlow'],
    checklist: [
      'Dataset collecté et nettoyé',
      'Analyse exploratoire réalisée',
      'Modèle entraîné et validé',
      'Visualisations créées',
      'Résultats interprétés',
      'Rapport final rédigé'
    ],
    deliverables: [
      'Notebook Jupyter complet',
      'Dataset utilisé',
      'Visualisations et graphiques',
      'Rapport d\'analyse détaillé'
    ]
  },
  'marketing-communication': {
    name: 'Campagne Marketing',
    description: 'Stratégie marketing, campagne publicitaire ou étude de marché',
    requiredFields: ['presentation_file', 'results_file'],
    suggestedTechnologies: ['Google Analytics', 'Canva', 'Google Ads', 'Facebook Ads', 'HubSpot', 'Mailchimp'],
    checklist: [
      'Analyse du marché cible',
      'Stratégie définie',
      'Contenus créés',
      'Campagne lancée',
      'Performances mesurées',
      'ROI calculé'
    ],
    deliverables: [
      'Présentation de la stratégie',
      'Créations visuelles',
      'Rapport de performance',
      'Recommandations futures'
    ]
  },
  'commerce-vente': {
    name: 'Projet Commercial',
    description: 'Plan de prospection, étude concurrentielle ou stratégie commerciale',
    requiredFields: ['presentation_file', 'analysis_file'],
    suggestedTechnologies: ['CRM (Salesforce)', 'Excel', 'PowerPoint', 'LinkedIn Sales Navigator'],
    checklist: [
      'Marché analysé',
      'Concurrence étudiée',
      'Stratégie élaborée',
      'Outils de vente créés',
      'Plan d\'action défini',
      'Résultats projetés'
    ],
    deliverables: [
      'Étude de marché',
      'Plan de prospection',
      'Outils commerciaux',
      'Prévisions de vente'
    ]
  },
  'ressources-humaines': {
    name: 'Projet RH',
    description: 'Recrutement, formation, gestion des talents ou amélioration des processus RH',
    requiredFields: ['presentation_file', 'process_file'],
    suggestedTechnologies: ['Excel', 'PowerPoint', 'ATS', 'SIRH', 'LinkedIn Recruiter'],
    checklist: [
      'Besoin RH identifié',
      'Processus analysé',
      'Solution proposée',
      'Outils développés',
      'Tests effectués',
      'Recommandations finales'
    ],
    deliverables: [
      'Analyse des besoins',
      'Processus optimisé',
      'Outils RH créés',
      'Guide d\'implémentation'
    ]
  },
  'design-création': {
    name: 'Projet Créatif',
    description: 'Design graphique, UX/UI, motion design ou création visuelle',
    requiredFields: ['portfolio_images', 'behance_url'],
    suggestedTechnologies: ['Photoshop', 'Illustrator', 'Figma', 'After Effects', 'Sketch', 'Adobe XD'],
    checklist: [
      'Brief créatif défini',
      'Recherches visuelles menées',
      'Concepts développés',
      'Créations finalisées',
      'Tests utilisateurs réalisés',
      'Portfolio mis à jour'
    ],
    deliverables: [
      'Créations visuelles finales',
      'Process book',
      'Maquettes et prototypes',
      'Guidelines créatives'
    ]
  }
};

export const getProjectTemplate = (fieldOfStudy) => {
  return projectTemplates[fieldOfStudy] || {
    name: 'Projet Personnalisé',
    description: 'Projet adapté à votre domaine d\'études',
    requiredFields: ['demo_file'],
    suggestedTechnologies: [],
    checklist: [
      'Objectifs définis',
      'Planification réalisée',
      'Exécution menée',
      'Résultats obtenus',
      'Documentation créée'
    ],
    deliverables: [
      'Livrable principal',
      'Documentation',
      'Présentation des résultats'
    ]
  };
};