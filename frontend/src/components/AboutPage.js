import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmeresButton from './ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from './ui/EmeresCard';
import EmeresBadge from './ui/EmeresBadge';
import { 
  Users, 
  Building, 
  School, 
  UserCheck, 
  Handshake, 
  Globe, 
  Rocket, 
  Shield,
  GraduationCap,
  Target,
  Award,
  Eye,
  TrendingUp,
  Heart,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Lightbulb,
  Sparkles,
  Play,
  UserPlus
} from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Handshake,
      title: "Collaboration",
      description: "Créer des ponts entre étudiants, écoles, entreprises et mentors.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "Équité & accessibilité",
      description: "Garantir à tous les profils (jeunes, adultes en reconversion, demandeurs d'emploi, seniors) une expérience inclusive.",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: Rocket,
      title: "Innovation",
      description: "Utiliser l'IA, la data et la VR/AR pour offrir des outils modernes et pertinents.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Confiance & sécurité",
      description: "Respect strict du RGPD, transparence et environnement fiable.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const benefits = [
    {
      icon: GraduationCap,
      title: "Pour les étudiants",
      description: "Moteur intelligent de recherche de stages, portfolio en ligne, accompagnement par des mentors.",
      features: ["Recherche IA", "Portfolio dynamique", "Mentorat personnalisé", "Suivi de candidatures"],
      gradient: "from-teal-500 to-teal-600",
      bgGradient: "from-teal-50 to-cyan-50"
    },
    {
      icon: Building,
      title: "Pour les entreprises",
      description: "Gestion simplifiée des offres, recrutement ciblé, outils RH et marque employeur renforcée.",
      features: ["ATS intégré", "Matching intelligent", "Analytics RH", "Marque employeur"],
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-indigo-50"
    },
    {
      icon: School,
      title: "Pour les écoles",
      description: "Supervision des étudiants, intégration avec leurs systèmes, suivi en temps réel.",
      features: ["Dashboard admin", "Suivi temps réel", "Intégrations API", "Reporting avancé"],
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      icon: UserCheck,
      title: "Pour les mentors",
      description: "Espace gratuit pour guider, transmettre et valoriser leur expertise.",
      features: ["Matching expertise", "Outils coaching", "Communauté", "Reconnaissance"],
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-teal-50"
    }
  ];

  const stats = [
    { number: "+10 000", label: "étudiants accompagnés", sublabel: "d'ici 3 ans", icon: Users },
    { number: "+1 000", label: "entreprises partenaires", sublabel: "actives", icon: Building },
    { number: "+500", label: "mentors actifs", sublabel: "experts", icon: UserCheck },
    { number: "Européenne", label: "communauté engagée", sublabel: "stages & apprentissage", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 via-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <img 
                  src="/emeres-logo.png" 
                  alt="ÉMÉRÉS" 
                  className="h-20 w-20 sm:h-24 sm:w-24 object-contain drop-shadow-xl animate-pulse"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div 
                  className="h-20 w-20 sm:h-24 sm:w-24 bg-gradient-to-br from-teal-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl hidden"
                >
                  <span className="text-3xl sm:text-4xl font-bold text-white">É</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-600 mb-6 leading-tight">
              À propos d'ÉMÉRÉS
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Une plateforme innovante qui connecte étudiants, entreprises, écoles et mentors 
              pour simplifier, sécuriser et enrichir l'expérience des stages et projets professionnels.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <EmeresButton
                variant="primary"
                size="lg"
                icon={<UserPlus />}
                onClick={() => navigate('/register')}
                className="text-lg px-8 py-4"
              >
                Rejoindre ÉMÉRÉS
              </EmeresButton>
              
              <EmeresButton
                variant="secondary"
                size="lg"
                icon={<Play />}
                className="text-lg px-8 py-4"
              >
                Découvrir en vidéo
              </EmeresButton>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmeresCard variant="elevated" className="bg-gradient-to-r from-white to-gray-50 border-0 shadow-emeres-xl">
            <EmeresCardContent className="p-8 lg:p-12 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-gradient-emeres-primary rounded-2xl">
                  <Target className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Notre Mission
              </h2>
              
              <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                Offrir à chaque étudiant une chance équitable de trouver un stage ou une mission adaptée, 
                tout en permettant aux entreprises, établissements scolaires et mentors de collaborer 
                facilement et efficacement.
              </p>
              
              <div className="mt-8 inline-block">
                <EmeresBadge variant="primary" size="lg" className="text-lg px-6 py-3">
                  <Heart className="h-5 w-5 mr-2" />
                  Nous croyons que la réussite passe par la synergie entre tous les acteurs
                </EmeresBadge>
              </div>
            </EmeresCardContent>
          </EmeresCard>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les principes qui guident notre action quotidienne et notre vision de l'avenir
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <EmeresCard 
                  key={index}
                  variant="default"
                  interactive={true}
                  className="group hover-lift transition-all duration-500"
                >
                  <EmeresCardContent className="p-6 text-center">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${value.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </EmeresCardContent>
                </EmeresCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ce que nous apportons
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des solutions sur mesure pour chaque acteur de l'écosystème éducatif et professionnel
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <EmeresCard 
                  key={index}
                  variant="elevated"
                  className={`group hover-lift bg-gradient-to-br ${benefit.bgGradient} border-0`}
                >
                  <EmeresCardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${benefit.gradient} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <EmeresCardTitle className="text-2xl">
                          {benefit.title}
                        </EmeresCardTitle>
                      </div>
                    </div>
                  </EmeresCardHeader>
                  
                  <EmeresCardContent>
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                      {benefit.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {benefit.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </EmeresCardContent>
                </EmeresCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-teal-600/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Innovation & Vision
                </h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  Avec nos modules <strong>Immersiv'Experience</strong>, ÉMÉRÉS permet de tester des métiers 
                  en VR/AR et de s'entraîner sur des projets réels.
                </p>
                
                <p className="text-xl text-gray-700 leading-relaxed">
                  Notre vision est claire : devenir une <strong>référence internationale</strong> en matière 
                  d'insertion professionnelle et d'éducation numérique.
                </p>
                
                <div className="flex flex-wrap gap-3 mt-8">
                  <EmeresBadge variant="primary" size="lg">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Intelligence Artificielle
                  </EmeresBadge>
                  <EmeresBadge variant="secondary" size="lg">
                    <Eye className="h-4 w-4 mr-2" />
                    Réalité Virtuelle/Augmentée
                  </EmeresBadge>
                  <EmeresBadge variant="outline" size="lg">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Data Analytics
                  </EmeresBadge>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <EmeresCard variant="elevated" className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-emeres-xl">
                <EmeresCardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Rocket className="h-12 w-12 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Immersiv'Experience
                  </h3>
                  
                  <p className="text-gray-700 mb-6">
                    Testez des métiers en réalité virtuelle et entraînez-vous sur des projets concrets 
                    avant même de commencer votre stage.
                  </p>
                  
                  <EmeresButton variant="primary" size="md" icon={<Play />}>
                    Découvrir la démo
                  </EmeresButton>
                </EmeresCardContent>
              </EmeresCard>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Nos Objectifs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des ambitions concrètes pour transformer l'écosystème de l'insertion professionnelle
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <EmeresCard 
                  key={index}
                  variant="default"
                  interactive={true}
                  className="group hover-lift text-center"
                >
                  <EmeresCardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-emeres-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                      {stat.number}
                    </div>
                    
                    <div className="text-lg font-semibold text-gray-900 mb-1">
                      {stat.label}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {stat.sublabel}
                    </div>
                  </EmeresCardContent>
                </EmeresCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Rejoignez ÉMÉRÉS dès aujourd'hui
            </h2>
            
            <p className="text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed">
              Que vous soyez étudiant, entreprise, école ou mentor, votre place est ici.
              <br />
              Ensemble, construisons l'avenir de l'insertion professionnelle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <EmeresButton
                variant="secondary"
                size="xl"
                icon={<UserPlus />}
                onClick={() => navigate('/register')}
                className="bg-white text-teal-600 hover:bg-gray-100 text-xl px-10 py-5 font-semibold"
              >
                Créer un compte
              </EmeresButton>
              
              <EmeresButton
                variant="outline"
                size="xl"
                icon={<ArrowRight />}
                className="border-white text-white hover:bg-white hover:text-teal-600 text-xl px-10 py-5 font-semibold"
              >
                Nous contacter
              </EmeresButton>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Inscription gratuite</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Support dédié</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Communauté active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 ÉMÉRÉS. Tous droits réservés. Une plateforme conçue avec ❤️ pour l'avenir professionnel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;