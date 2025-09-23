import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Users, MessageCircle, Award, CheckCircle, ArrowRight, Star, Target, Heart } from 'lucide-react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard from '../ui/EmeresCard';

const SolutionMentors = () => {
  const features = [
    {
      icon: Users,
      title: "Accompagnement Personnalisé",
      description: "Guidez les étudiants dans leur parcours professionnel avec des outils adaptés.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: MessageCircle,
      title: "Plateforme de Communication",
      description: "Échangez facilement avec vos mentorés via notre messagerie intégrée.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Award,
      title: "Reconnaissance Professionnelle",
      description: "Valorisez votre expertise et développez votre réseau professionnel.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Target,
      title: "Suivi des Progrès",
      description: "Suivez l'évolution de vos mentorés avec des outils de mesure intégrés.",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Image globale pour solution mentors */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Hero Section */}
      <section className="hero-gradient-emeres text-white py-20 relative overflow-hidden text-white py-20 relative overflow-hidden">
        {/* Background Image pour hero avec contraste élevé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1606248896999-387b3a9f621c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        {/* Overlay pour maintenir le contraste */}
        <div className="absolute inset-0 absolute inset-0 hero-overlay-emeres" />
        
        <div className="container-emeres relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <BrainCircuit className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Accompagnez la
              <span className="block text-hero-accent font-semibold">
                Nouvelle Génération
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Partagez votre expertise et façonnez l'avenir professionnel des jeunes talents grâce à notre plateforme de mentorat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/mentor/register">
                <EmeresButton size="lg" className="btn-hero-primary px-8 py-4">
                  Devenir Mentor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </EmeresButton>
              </Link>
              <EmeresButton 
                variant="outline" 
                size="lg" 
                className="btn-hero-outline px-8 py-4"
              >
                En Savoir Plus
              </EmeresButton>
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">1K+</div>
                <div className="text-purple-200 text-sm">Mentors Actifs</div>
              </div>
              <div>
                <div className="text-3xl font-bold">5K+</div>
                <div className="text-purple-200 text-sm">Étudiants Accompagnés</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4.9/5</div>
                <div className="text-purple-200 text-sm">Satisfaction Mentors</div>
              </div>
              <div>
                <div className="text-3xl font-bold">88%</div>
                <div className="text-purple-200 text-sm">Réussite Mentorés</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Une Expérience de Mentorat Enrichissante
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tous les outils pour accompagner efficacement vos mentorés et créer un impact durable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              
              // Images spécifiques pour les fonctionnalités mentors
              const featureImages = [
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Accompagnement - Team
                'https://images.unsplash.com/photo-1606248896999-387b3a9f621c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Communication - Interface
                'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Reconnaissance - Awards
                'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'  // Suivi - Goals
              ];
              
              return (
                <EmeresCard key={index} className="text-center p-6 hover-lift overflow-hidden group relative">
                  {/* Image de fond pour chaque feature */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 group-hover:opacity-8 transition-opacity duration-300"
                    style={{
                      backgroundImage: `url('${featureImages[index]}')`
                    }}
                  />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </EmeresCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white overflow-hidden cta-gradient-emeres relative z-10">
        <div className="container-emeres relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à Faire la Différence ?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté de mentors et impactez positivement l'avenir professionnel des jeunes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/mentor/register">
              <EmeresButton size="lg" className="btn-hero-primary px-8 py-4">
                <Heart className="mr-2 h-5 w-5" />
                Rejoindre la Communauté
              </EmeresButton>
            </Link>
            <Link to="/contact">
              <EmeresButton 
                variant="outline" 
                size="lg" 
                className="btn-hero-outline px-8 py-4"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Nous Contacter
              </EmeresButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolutionMentors;

