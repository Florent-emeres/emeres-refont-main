import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  X, 
  Crown, 
  Star, 
  Rocket, 
  Sparkles, 
  Users, 
  Building, 
  GraduationCap, 
  BrainCircuit,
  ArrowRight,
  Heart,
  Shield,
  Zap,
  Target,
  Gift,
  Calculator,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckCircle,
  Phone,
  Mail,
  Coins,
  TrendingUp,
  RefreshCw,
  Award
} from 'lucide-react';
import EmeresCard from './ui/EmeresCard';
import EmeresButton from './ui/EmeresButton';
import EmeresBadge from './ui/EmeresBadge';

const TarifsPage = () => {
  const [billingType, setBillingType] = useState('monthly'); // 'monthly' or 'yearly'
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState('student'); // Type d'utilisateur sélectionné

  const userTypes = [
    {
      id: 'student',
      name: 'Étudiant',
      icon: GraduationCap,
      description: 'Je cherche un stage ou un emploi',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'mentor',
      name: 'Mentor',
      icon: Crown,
      description: 'J\'accompagne des étudiants',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'company',
      name: 'Entreprise',
      icon: Rocket,
      description: 'Je recrute des talents',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'institution',
      name: 'Institution',
      icon: Building,
      description: 'École, université ou organisme public',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const allPlans = [
    // Plans Étudiants
    {
      name: 'Étudiant Gratuit',
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-500',
      description: 'Accès de base à votre parcours carrière',
      monthlyPrice: 0,
      yearlyPrice: 0,
      popular: false,
      userType: 'student',
      features: [
        'Profil étudiant complet',
        'Accès aux offres de stage basiques',
        'Matching IA limité (5/mois)',
        'Candidatures manuelles',
        'Ressources carrière essentielles',
        'CV Builder avec 2 templates',
        'Support communautaire',
        '10 points ÉMÉRÉS offerts/mois'
      ],
      limitations: [
        'Matching IA limité',
        'Templates CV basiques',
        'Pas de suivi avancé'
      ],
      cta: 'Commencer gratuitement',
      badge: 'Gratuit',
      highlight: 'Parfait pour débuter'
    },
    {
      name: 'Étudiant Premium',
      icon: Star,
      color: 'from-blue-500 to-indigo-600',
      description: 'Accès complet avec avantages premium',
      monthlyPrice: 9.90,
      yearlyPrice: 99,
      popular: true,
      userType: 'student',
      features: [
        'Tout du plan Gratuit',
        'Accès à toutes les offres premium',
        'Matching IA illimité et prioritaire',
        'Candidatures automatisées',
        'Ressources carrière complètes',
        'CV Builder avec tous les templates',
        'Support prioritaire',
        '50 points ÉMÉRÉS offerts/mois',
        'Accès aux webinaires exclusifs',
        'Coaching carrière mensuel'
      ],
      limitations: [],
      cta: 'Choisir Premium',
      badge: 'Recommandé',
      highlight: 'Le plus populaire chez les étudiants'
    },
    
    // Plans Mentors
    {
      name: 'Mentor Bénévole',
      icon: Heart,
      color: 'from-green-500 to-emerald-500',
      description: 'Pour les mentors qui donnent de leur temps',
      monthlyPrice: 0,
      yearlyPrice: 0,
      popular: false,
      userType: 'mentor',
      features: [
        'Profil mentor vérifié',
        'Gestion jusqu\'à 3 étudiants',
        'Outils de suivi basiques',
        'Planning de sessions simple',
        'Ressources de mentorat essentielles',
        'Support communautaire',
        'Badge "Mentor Bénévole"',
        'Gagnez 20 points par session terminée'
      ],
      limitations: [],
      cta: 'Devenir Mentor Bénévole',
      badge: 'Gratuit',
      highlight: 'Idéal pour débuter dans le mentorat'
    },
    {
      name: 'Mentor Freelance',
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      description: 'Pour les mentors indépendants',
      monthlyPrice: 29,
      yearlyPrice: 290,
      popular: false,
      userType: 'mentor',
      features: [
        'Tout du plan Bénévole',
        'Gestion jusqu\'à 10 étudiants',
        'Outils de suivi avancés',
        'Planning de sessions intégré',
        'Ressources de mentorat exclusives',
        'Formation continue incluse',
        'Commission réduite sur les sessions',
        'Gagnez 50 points par session terminée',
        'Support prioritaire'
      ],
      limitations: [],
      cta: 'Devenir Mentor Freelance',
      badge: 'Populaire'
    },
    {
      name: 'Mentor Pro',
      icon: Star,
      color: 'from-indigo-500 to-purple-600',
      description: 'Pour les mentors expérimentés',
      monthlyPrice: 79,
      yearlyPrice: 790,
      popular: true,
      userType: 'mentor',
      features: [
        'Tout du plan Freelance',
        'Gestion illimitée d\'étudiants',
        'Analytics avancés et reporting',
        'API et intégrations tierces',
        'Branding personnalisé',
        'Sessions de groupe illimitées',
        'Priorité dans les recommandations',
        'Gagnez 100 points par session terminée',
        '500 points bonus offerts/mois',
        'Manager dédié'
      ],
      limitations: [],
      cta: 'Upgrade Pro',
      badge: 'Recommandé'
    },
    
    // Plans Entreprises
    {
      name: 'Entreprise Starter',
      icon: Rocket,
      color: 'from-blue-500 to-cyan-500',
      description: 'Pour les PME qui recrutent',
      monthlyPrice: 99,
      yearlyPrice: 990,
      popular: false,
      userType: 'company',
      features: [
        'Profil entreprise premium',
        'Publication de 10 offres/mois',
        'ATS intégré avec pipeline',
        'Matching IA avec scoring',
        'Multi-utilisateurs (jusqu\'à 3)',
        'Analytics RH basiques',
        'Support email',
        '500 points offerts/mois',
        'Templates de recrutement'
      ],
      limitations: [],
      cta: 'Essai gratuit 14 jours',
      badge: 'Starter'
    },
    {
      name: 'Entreprise Pro',
      icon: Building,
      color: 'from-indigo-600 to-blue-600',
      description: 'Solution complète pour entreprises',
      monthlyPrice: 299,
      yearlyPrice: 2990,
      popular: true,
      userType: 'company',
      features: [
        'Tout du plan Starter',
        'Offres illimitées',
        'Multi-utilisateurs (jusqu\'à 10)',
        'Analytics RH avancés',
        'Intégrations SIRH',
        'Branding personnalisé',
        'Support prioritaire',
        '1500 points offerts/mois',
        'Bonus rémunération stagiaires (500 points)',
        'Formation équipe incluse'
      ],
      limitations: [],
      cta: 'Choisir Pro',
      badge: 'Recommandé'
    },
    
    // Plans Institutions
    {
      name: 'Établissement',
      icon: GraduationCap,
      color: 'from-green-500 to-teal-600',
      description: 'Pour écoles et universités',
      monthlyPrice: 0,
      yearlyPrice: 0,
      isCustom: true,
      popular: false,
      userType: 'institution',
      features: [
        'Gestion multi-campus',
        'Tableau de bord institutionnel',
        'Suivi étudiants temps réel',
        'Partenariats entreprises',
        'Rapports d\'employabilité',
        'Intégration systèmes pédagogiques',
        'Formation équipes admin',
        'Budget points pour bourses étudiantes',
        'Système d\'aide financière intégré',
        'Support premium 24/7'
      ],
      limitations: [],
      cta: 'Demander un devis',
      badge: 'Sur mesure'
    },
    {
      name: 'Institution Publique',
      icon: Shield,
      color: 'from-purple-600 to-indigo-700',
      description: 'Pour organismes publics',
      monthlyPrice: 0,
      yearlyPrice: 0,
      isCustom: true,
      popular: false,
      userType: 'institution',
      features: [
        'Solutions conformes marchés publics',
        'Gestion territoires et bassins emploi',
        'Reporting institutionnel avancé',
        'Intégration services publics',
        'Tableaux de bord décisionnels',
        'Formation agents territoriaux',
        'Hébergement souverain',
        'Fonds points pour accompagnement social',
        'Programmes d\'aide personnalisés',
        'Conformité RGPD renforcée'
      ],
      limitations: [],
      cta: 'Demander un devis',
      badge: 'Secteur public'
    }
  ];

  // Fonction pour filtrer les plans selon le type d'utilisateur
  const getPlansForUserType = (userType) => {
    return allPlans.filter(plan => plan.userType === userType);
  };

  const enterprisePlans = [
    {
      name: 'Grande Entreprise',
      icon: Building,
      color: 'from-orange-500 to-red-500',
      description: 'Solutions sur-mesure pour grandes organisations',
      userType: 'enterprise',
      features: [
        'Tout des plans PME + fonctionnalités avancées',
        'Utilisateurs illimités',
        'API complète et webhooks',
        'SSO et intégrations entreprise',
        'Branding complet aux couleurs',
        'Analytics prédictifs IA',
        'Manager de compte dédié',
        'Formation équipes incluse',
        'SLA 99.9% garanti'
      ],
      customFeatures: [
        'Intégration SIRH existant',
        'Reporting exécutif personnalisé',
        'Conformité RGPD renforcée',
        'Support 24/7 multicanal'
      ]
    },
    {
      name: 'Établissement Scolaire',
      icon: GraduationCap,
      color: 'from-green-500 to-teal-600',
      description: 'Pour écoles, universités et organismes de formation',
      userType: 'school',
      features: [
        'Gestion multi-campus centralisée',
        'Tableau de bord institutionnel',
        'Suivi étudiants en temps réel',
        'Partenariats entreprises facilitées',
        'Rapports d\'employabilité détaillés',
        'Intégration systèmes pédagogiques',
        'Ressources pédagogiques exclusives',
        'Formation équipes administratives',
        'API éducation spécialisée'
      ],
      customFeatures: [
        'Connexion avec Parcoursup/APB',
        'Statistiques ministérielles',
        'Certification qualité formations',
        'Accompagnement transformation digitale'
      ]
    },
    {
      name: 'Institution Publique',
      icon: Shield,
      color: 'from-purple-600 to-indigo-700',
      description: 'Pour organismes publics et collectivités',
      userType: 'institution',
      features: [
        'Solutions conformes marchés publics',
        'Gestion territoires et bassins emploi',
        'Reporting institutionnel avancé',
        'Intégration Pôle Emploi/Mission Locale',
        'Tableaux de bord décisionnels',
        'Accompagnement politiques publiques',
        'Formation agents territoriaux',
        'Conformité RGPD niveau institution',
        'Hébergement souverain disponible'
      ],
      customFeatures: [
        'Adaptation réglementations locales',
        'Connexion systèmes d\'information publics',
        'Reporting pour ministères de tutelle',
        'Accompagnement transformation numérique'
      ]
    }
  ];

  const enterpriseFeatures = [
    {
      icon: Shield,
      title: 'Sécurité Enterprise',
      description: 'SSO, conformité RGPD, audit trails complets'
    },
    {
      icon: Zap,
      title: 'Performance garantie',
      description: 'SLA 99.9%, temps de réponse < 200ms'
    },
    {
      icon: Users,
      title: 'Support dédié',
      description: 'Customer Success Manager assigné'
    },
    {
      icon: Target,
      title: 'Personnalisation',
      description: 'Interface aux couleurs de votre marque'
    }
  ];

  const faq = [
    {
      question: 'Puis-je changer de plan à tout moment ?',
      answer: 'Oui, vous pouvez modifier votre abonnement à tout moment. Les changements prennent effet immédiatement et nous calculons automatiquement la différence.'
    },
    {
      question: 'Y a-t-il des frais d\'installation ?',
      answer: 'Non, il n\'y a aucun frais d\'installation ou de mise en place. Vous payez uniquement votre abonnement mensuel ou annuel.'
    },
    {
      question: 'Proposez-vous une période d\'essai ?',
      answer: 'Oui ! Nous offrons 14 jours d\'essai gratuit pour tous nos plans payants. Aucune carte bancaire n\'est requise.'
    },
    {
      question: 'Que se passe-t-il si j\'annule mon abonnement ?',
      answer: 'Vous conservez l\'accès à toutes les fonctionnalités jusqu\'à la fin de votre période de facturation. Vos données sont conservées pendant 90 jours.'
    },
    {
      question: 'Acceptez-vous les virements bancaires ?',
      answer: 'Oui, pour les plans Entreprise et Établissement, nous acceptons les virements bancaires avec facturation annuelle.'
    }
  ];

  const getPrice = (plan) => {
    return billingType === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan) => {
    if (billingType === 'yearly' && plan.monthlyPrice > 0) {
      const monthlyCost = plan.monthlyPrice * 12;
      const yearlyCost = plan.yearlyPrice;
      const savings = Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
      return savings;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background Image avec contraste optimisé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-8"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-blue-50/90 to-white/95"></div>
        
        <div className="relative container-emeres">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Choisissez votre plan
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Des solutions adaptées à chaque profil pour optimiser votre expérience sur ÉMÉRÉS
            </p>
            
            {/* User Type Selection */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Je suis :</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {userTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedUserType(type.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden ${
                        selectedUserType === type.id
                          ? 'border-indigo-600 bg-indigo-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                      }`}
                    >
                      {/* Image de fond subtile pour chaque type d'utilisateur */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                        style={{
                          backgroundImage: type.id === 'student' ? `url('https://images.unsplash.com/photo-1541178735493-479c1a27ed24?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')` :
                                         type.id === 'mentor' ? `url('https://images.unsplash.com/photo-1606248896999-387b3a9f621c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')` :
                                         type.id === 'company' ? `url('https://images.unsplash.com/photo-1755541516524-66c617307a99?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')` :
                                         `url('https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`
                        }}
                      />
                      
                      <div className="relative z-10">
                        <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h4 className={`font-semibold mb-1 ${
                          selectedUserType === type.id ? 'text-indigo-900' : 'text-gray-900'
                        }`}>
                          {type.name}
                        </h4>
                        <p className={`text-sm ${
                          selectedUserType === type.id ? 'text-indigo-700' : 'text-gray-600'
                        }`}>
                          {type.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Billing Toggle - seulement pour les plans payants */}
            {getPlansForUserType(selectedUserType).some(plan => plan.monthlyPrice > 0) && (
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={`text-lg font-medium ${billingType === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Mensuel
                </span>
                <button
                  onClick={() => setBillingType(billingType === 'monthly' ? 'yearly' : 'monthly')}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                    billingType === 'yearly' ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                    billingType === 'yearly' ? 'translate-x-7' : 'translate-x-0'
                  }`} />
                </button>
                <span className={`text-lg font-medium ${billingType === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Annuel
                </span>
                {billingType === 'yearly' && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium ml-2">
                    Économisez jusqu'à 17%
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards - Plans selon le profil */}
      <section className="py-16">
        <div className="container-emeres">
          {/* Titre dynamique selon le profil */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {selectedUserType === 'student' && 'Plans pour Étudiants'}
              {selectedUserType === 'mentor' && 'Plans pour Mentors'}
              {selectedUserType === 'company' && 'Plans pour Entreprises'}
              {selectedUserType === 'institution' && 'Plans pour Institutions'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {selectedUserType === 'student' && 'Commencez votre parcours professionnel dès maintenant'}
              {selectedUserType === 'mentor' && 'Accompagnez et formez la nouvelle génération de talents'}
              {selectedUserType === 'company' && 'Trouvez et recrutez les meilleurs talents pour votre équipe'}
              {selectedUserType === 'institution' && 'Solutions sur-mesure pour votre établissement'}
            </p>
          </div>

          <div className={`grid gap-6 lg:gap-8 ${
            getPlansForUserType(selectedUserType).length === 1 ? 'max-w-md mx-auto' :
            getPlansForUserType(selectedUserType).length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' :
            getPlansForUserType(selectedUserType).length === 3 ? 'md:grid-cols-3' :
            'md:grid-cols-2 lg:grid-cols-4'
          }`}>
            {getPlansForUserType(selectedUserType).map((plan, index) => {
              const Icon = plan.icon;
              const price = getPrice(plan);
              const savings = getSavings(plan);
              
              return (
                <div 
                  key={index} 
                  className={`relative bg-white rounded-2xl border-2 transition-all duration-200 hover:shadow-xl ${
                    plan.popular 
                      ? 'border-indigo-600 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  
                  <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      
                      <p className="text-gray-600 mb-6">
                        {plan.description}
                      </p>
                      
                      <div className="mb-6">
                        {plan.isCustom ? (
                          <div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">Sur devis</div>
                            <div className="text-sm text-gray-600">Tarification personnalisée</div>
                          </div>
                        ) : price === 0 ? (
                          <div className="text-5xl font-bold text-gray-900">Gratuit</div>
                        ) : (
                          <div className="flex items-baseline justify-center">
                            <span className="text-5xl font-bold text-gray-900">{price}€</span>
                            <span className="text-gray-500 ml-2">
                              /{billingType === 'monthly' ? 'mois' : 'an'}
                            </span>
                          </div>
                        )}
                        
                        {savings > 0 && (
                          <div className="text-green-600 text-sm font-medium mt-2">
                            Économisez {savings}%
                          </div>
                        )}
                        
                        {plan.highlight && (
                          <div className="text-emerald-600 text-sm font-medium mt-3 bg-emerald-50 px-4 py-2 rounded-lg">
                            {plan.highlight}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <div className="mb-8">
                      <EmeresButton
                        variant={plan.popular ? 'primary' : 'outline'}
                        fullWidth
                        size="lg"
                        className={plan.popular 
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                          : 'border-gray-300 text-gray-700 hover:border-indigo-600 hover:text-indigo-600'
                        }
                      >
                        {plan.cta}
                      </EmeresButton>
                    </div>
                    
                    {/* Features */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Ce qui est inclus :</h4>
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.limitations && plan.limitations.map((limitation, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-500 text-sm leading-relaxed">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Vous avez des questions ? Nous avons les réponses.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faq.map((item, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {item.question}
                  </h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {expandedFaq === index && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed pt-4">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÉMÉRÉS Credits Section Corrigée - CONFORMITÉ LÉGALE */}
      <section className="py-16 bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <Coins className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ÉMÉRÉS Crédits (CÉ)
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              L'économie interne d'ÉMÉRÉS : gagnez des points en agissant (profil, candidatures, VR, recommandations), 
              convertissez-les en Crédits ÉMÉRÉS (CÉ) et utilisez vos CÉ pour réduire le prix de services utiles 
              (VR, coaching, certifs, outils).
            </p>
            
            {/* Règles strictes - Conformité légale */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-12 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-red-800 mb-4">📋 Règles Importantes</h3>
              <div className="text-left max-w-3xl mx-auto">
                <p className="text-red-700 font-semibold mb-4">
                  1 CÉ = 1 € interne · 5 pts = 1 CÉ · max 30% du panier en CÉ · seuil 10 € · validité 12 mois · 
                  <span className="bg-red-100 px-2 py-1 rounded font-bold">pas de conversion en euros</span>
                </p>
              </div>
            </div>

            
            {/* Gagner des points (valeurs corrigées) */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-2xl border border-orange-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
                  Gagner (exemples, en points)
                </h3>
                
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Profil complété</span>
                    <span className="font-bold text-green-600">2 pts</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Candidature envoyée (cap/jour)</span>
                    <span className="font-bold text-green-600">1 pt</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Candidature acceptée</span>
                    <span className="font-bold text-green-600">5 pts</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Module VR terminé</span>
                    <span className="font-bold text-green-600">10 pts</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Recommandation mentor validée</span>
                    <span className="font-bold text-green-600">20 pts</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Stage finalisé + éval positive</span>
                    <span className="font-bold text-green-600">15 pts</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-100 rounded-lg text-center">
                  <p className="text-blue-800 font-semibold">Conversion automatique : 5 pts = 1 CÉ</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-orange-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Zap className="w-6 w-6 mr-2 text-purple-600" />
                  Dépenser (CÉ)
                </h3>
                
                <div className="space-y-3 text-left">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-800">Modules VR / simulations</div>
                    <div className="text-sm text-purple-600">Réduction appliquée sur vos formations immersives</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-800">Coaching mentor pro</div>
                    <div className="text-sm text-purple-600">Réduction appliquée sur vos sessions</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-800">Outils premium</div>
                    <div className="text-sm text-purple-600">Analyse CV/IA, boost visibilité, reporting perso</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-800">Badges, certifs, events</div>
                    <div className="text-sm text-purple-600">Certifications et événements exclusifs</div>
                  </div>
                </div>
              </div>
            </div>


            {/* Packs CÉ - Bonus limités conformité légale */}
            <div className="bg-white rounded-2xl border border-orange-200 p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Packs CÉ (optionnel)</h3>
              <p className="text-gray-600 text-center mb-8">
                Les bonus sont limités pour maintenir l'équilibre économique
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-gray-600 mb-2">Pack Standard</div>
                  <div className="text-xl font-semibold text-gray-900 mb-2">10 € → 10 CÉ</div>
                  <div className="text-sm text-gray-600">Parité simple 1:1</div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 text-center border-2 border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-2">Pack Flash</div>
                  <div className="text-xl font-semibold text-gray-900 mb-2">10 € → 10 CÉ +1 CÉ bonus</div>
                  <div className="text-sm text-green-600 font-semibold">+5% bonus (limité)</div>
                  <div className="text-xs text-gray-500 mt-1">Bonus plafonné pour équilibre</div>
                </div>
                
                <div className="bg-teal-50 rounded-lg p-6 text-center border-2 border-teal-200">
                  <div className="text-2xl font-bold text-amber-600 mb-2">Pack Gold</div>
                  <div className="text-xl font-semibold text-gray-900 mb-2">50 € → 50 CÉ +5 CÉ bonus</div>
                  <div className="text-sm text-green-600 font-semibold">+10% bonus (plafonné)</div>
                  <div className="text-xs text-gray-500 mt-1">Bonus limité pour durabilité</div>
                </div>
              </div>
            </div>
            
            {/* Transparence & Sécurité */}
            <div className="bg-white rounded-2xl border border-orange-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Transparence & Sécurité</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-red-700 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Règles Strictes
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      Pas de cash-out, pas de P2P libre en V1
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      Pas de conversion en euros (conformité légale)
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      Usage interne ÉMÉRÉS uniquement
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-green-700 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Garanties
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Historique complet des points/CÉ
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Anti-fraude, caps journaliers/mensuels
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Mentors pros rémunérés en euros par ÉMÉRÉS
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Écoles/entreprises : cagnottes sous contrôle admin
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            
            <div className="mt-8 bg-gradient-to-r from-teal-100 via-blue-100 to-indigo-100 rounded-2xl p-6">
              <h4 className="font-bold text-orange-900 mb-3 text-center text-xl">🎯 ÉMÉRÉS Credits : Légal, Équitable, Transparent</h4>
              <p className="text-orange-800 text-center max-w-5xl mx-auto text-lg">
                <strong>Règles claires :</strong> 1 CÉ = 1 € interne · 5 pts = 1 CÉ · max 30% par achat · seuil 10 € · expiration 12 mois · 
                <strong>usage interne uniquement</strong> · mentors payés en euros · anti-abus intégré.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-emeres">
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Prêt à Commencer ?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Essayez ÉMÉRÉS gratuitement pendant 14 jours. Aucune carte bancaire requise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <EmeresButton size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Commencer Gratuitement
                </EmeresButton>
              </Link>
              <Link to="/contact">
                <EmeresButton 
                  variant="outline" 
                  size="lg" 
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold px-8 py-4"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Nous Contacter
                </EmeresButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TarifsPage;