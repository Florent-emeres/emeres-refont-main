import React from 'react';
import { Link } from 'react-router-dom';
import EmeresButton from './ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardHeader, EmeresCardTitle } from './ui/EmeresCard';
import { 
  Sparkles, 
  Users, 
  Building2, 
  GraduationCap,
  ArrowRight,
  CheckCircle,
  Target,
  BarChart3,
  Heart
} from 'lucide-react';

const Homepage = () => {
  const features = [
    {
      icon: Users,
      title: 'Matching IA Avancé',
      description: 'Notre intelligence artificielle analyse votre profil et vos préférences pour vous proposer les opportunités les plus pertinentes.',
      color: 'text-teal-600'
    },
    {
      icon: Target,
      title: 'Module Stratégie & Conseil',
      description: 'Recevez des conseils personnalisés et définissez vos objectifs de carrière avec notre module stratégique innovant.',
      color: 'text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Suivi en Temps Réel',
      description: 'Suivez l\'évolution de vos candidatures et analysez vos performances avec nos outils analytics avancés.',
      color: 'text-orange-600'
    }
  ];

  const testimonials = [
    {
      name: 'Sophie Martin',
      role: 'Étudiante en Marketing',
      content: 'Grâce à ÉMÉRÉS, j\'ai trouvé le stage de mes rêves en moins d\'une semaine !',
      avatar: '👩‍🎓'
    },
    {
      name: 'Thomas Dubois',
      role: 'RH chez TechCorp',
      content: 'La plateforme nous permet de trouver les meilleurs talents de façon très efficace.',
      avatar: '👨‍💼'
    },
    {
      name: 'Marie Leroy',
      role: 'Directrice École Commerce',
      content: 'Nos étudiants adorent utiliser ÉMÉRÉS pour leurs recherches de stages.',
      avatar: '👩‍🏫'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1555212697-194d092e3b8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        
        <div className="container-emeres text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Connectez votre 
              <span className="text-blue-600">
                Avenir Professionnel
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              ÉMÉRÉS révolutionne la rencontre entre talents et opportunités grâce à 
              l'intelligence artificielle et une approche personnalisée unique.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 px-4">
              <EmeresButton
                variant="primary"
                size="lg"
                icon={<Sparkles />}
                className="animate-scale-in w-full sm:w-auto"
              >
                <Link to="/register" className="flex items-center justify-center gap-2">
                  Commencer Gratuitement
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </EmeresButton>
              
              <EmeresButton
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link to="/about" className="flex items-center justify-center gap-2">
                  En savoir plus
                </Link>
              </EmeresButton>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="animate-slide-up">
                <div className="text-3xl font-bold text-blue-600">10k+</div>
                <div className="text-gray-600">Étudiants connectés</div>
              </div>
              <div className="animate-slide-up" style={{animationDelay: '100ms'}}>
                <div className="text-3xl font-bold text-emerald-700">500+</div>
                <div className="text-gray-600">Entreprises partenaires</div>
              </div>
              <div className="animate-slide-up" style={{animationDelay: '200ms'}}>
                <div className="text-3xl font-bold text-amber-600">95%</div>
                <div className="text-gray-600">Taux de satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration avec couleurs authentiques ÉMÉRÉS */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 bg-amber-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir ÉMÉRÉS ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez les fonctionnalités qui font de notre plateforme l'outil 
              idéal pour votre réussite professionnelle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              // Images spécifiques pour chaque feature
              const featureImages = [
                'https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // IA Matching - Network diagram
                'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Stratégie - Code/Tech
                'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'  // Analytics - AI visualization
              ];
              
              return (
                <EmeresCard 
                  key={index} 
                  variant="default"
                  interactive={true}
                  className="animate-slide-up overflow-hidden"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  {/* Image d'illustration pour la feature */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={featureImages[index]} 
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className={`absolute top-4 right-4 w-12 h-12 rounded-lg bg-white/90 flex items-center justify-center ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <EmeresCardHeader>
                    <EmeresCardTitle className="mt-4">{feature.title}</EmeresCardTitle>
                  </EmeresCardHeader>
                  <EmeresCardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </EmeresCardContent>
                </EmeresCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Une solution pour tous
            </h2>
            <p className="text-lg text-gray-600">
              Que vous soyez étudiant, entreprise ou établissement d'enseignement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Étudiants */}
            <EmeresCard variant="gradient" interactive={true} className="overflow-hidden">
              {/* Image d'illustration pour les étudiants */}
              <div className="relative h-40 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1484712401471-05c7215830eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Étudiants célébrant leur succès"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-4 right-4 w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <EmeresCardHeader>
                <EmeresCardTitle className="mt-4">Étudiants</EmeresCardTitle>
              </EmeresCardHeader>
              <EmeresCardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    Profil complet et portfolio
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    Matching IA personnalisé
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    Suivi de candidatures
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    Module stratégie carrière
                  </li>
                </ul>
                <EmeresButton variant="secondary" fullWidth className="mt-6">
                  <Link to="/register?role=student">
                    S'inscrire comme étudiant
                  </Link>
                </EmeresButton>
              </EmeresCardContent>
            </EmeresCard>

            {/* Entreprises */}
            <EmeresCard variant="gradient" interactive={true} className="overflow-hidden">
              {/* Image d'illustration pour les entreprises */}
              <div className="relative h-40 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1755541516524-66c617307a99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Professionnel travaillant sur ordinateur"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-4 right-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <EmeresCardHeader>
                <EmeresCardTitle className="mt-4">Entreprises</EmeresCardTitle>
              </EmeresCardHeader>
              <EmeresCardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Gestion d'offres simplifiée
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    ATS intégré et performant
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Analytics RH avancés
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Suivi des stagiaires
                  </li>
                </ul>
                <EmeresButton variant="secondary" fullWidth className="mt-6">
                  <Link to="/company/register">
                    S'inscrire comme entreprise
                  </Link>
                </EmeresButton>
              </EmeresCardContent>
            </EmeresCard>

            {/* Écoles */}
            <EmeresCard variant="gradient" interactive={true} className="overflow-hidden">
              {/* Image d'illustration pour les écoles */}
              <div className="relative h-40 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Remise de diplômes et réussite éducative"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-4 right-4 w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <EmeresCardHeader>
                <EmeresCardTitle className="mt-4">Écoles</EmeresCardTitle>
              </EmeresCardHeader>
              <EmeresCardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    Gestion des étudiants
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    Partenariats entreprises
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    Rapports de stage
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    Analytics institutionnels
                  </li>
                </ul>
                <EmeresButton variant="secondary" fullWidth className="mt-6">
                  <Link to="/register?role=school">
                    S'inscrire comme école
                  </Link>
                </EmeresButton>
              </EmeresCardContent>
            </EmeresCard>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez les témoignages de notre communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <EmeresCard key={index} variant="default" className="animate-slide-up" style={{animationDelay: `${index * 150}ms`}}>
                <EmeresCardContent padding="lg">
                  <div className="text-4xl mb-4">{testimonial.avatar}</div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </EmeresCardContent>
              </EmeresCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section avec palette authentique ÉMÉRÉS */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-emerald-600 to-blue-700 text-white">
        <div className="container-emeres text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à transformer votre avenir ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers d'utilisateurs qui ont déjà fait confiance à ÉMÉRÉS
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EmeresButton variant="secondary" size="lg">
              <Link to="/register" className="flex items-center gap-2">
                Commencer maintenant
                <ArrowRight className="w-4 h-4" />
              </Link>
            </EmeresButton>
            
            <EmeresButton variant="ghost" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
              <Link to="/solutions">
                Voir les solutions
              </Link>
            </EmeresButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;