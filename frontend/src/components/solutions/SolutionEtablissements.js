import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, BarChart, MessageCircle, CheckCircle, ArrowRight, Star, Target, TrendingUp } from 'lucide-react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard from '../ui/EmeresCard';

const SolutionEtablissements = () => {
  const features = [
    {
      icon: Users,
      title: "Placement Étudiant",
      description: "Maximisez le taux de placement de vos étudiants avec notre réseau d'entreprises partenaires.",
      color: "from-[#0f766e] to-[#22c55e]"
    },
    {
      icon: BarChart,
      title: "Suivi et Analytics",
      description: "Analysez les performances de placement et optimisez vos programmes de formation.",
      color: "from-[#2563eb] to-[#0ea5e9]"
    },
    {
      icon: MessageCircle,
      title: "Relation Entreprises",
      description: "Développez et gérez vos partenariats avec les entreprises de votre secteur.",
      color: "from-[#312e81] to-[#7c3aed]"
    },
    {
      icon: Target,
      title: "Accompagnement",
      description: "Outils d'accompagnement personnalisés pour chaque étudiant et filière.",
      color: "from-[#b8761a] to-[#8a5216]"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Image globale pour solution établissements */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Hero Section */}
      <section className="hero-gradient-emeres text-white py-20 relative overflow-hidden">
        {/* Background Image pour hero avec contraste élevé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        {/* Overlay pour maintenir le contraste */}
        <div className="absolute inset-0 hero-overlay-emeres" />
        
        <div className="container-emeres relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connectez Vos Étudiants
              <span className="block text-hero-accent font-semibold">
                Au Monde Professionnel
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Maximisez l'employabilité de vos étudiants grâce à notre écosystème connecté d'entreprises et de mentors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/school/register">
                <EmeresButton size="lg" className="btn-hero-primary px-8 py-4">
                  Rejoindre le Réseau
                  <ArrowRight className="ml-2 h-5 w-5" />
                </EmeresButton>
              </Link>
              <EmeresButton 
                variant="outline" 
                size="lg" 
                className="btn-hero-outline px-8 py-4"
              >
                Découvrir les Avantages
              </EmeresButton>
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-white/80 text-sm">Établissements Partenaires</div>
              </div>
              <div>
                <div className="text-3xl font-bold">1500+</div>
                <div className="text-white/80 text-sm">Entreprises Connectées</div>
              </div>
              <div>
                <div className="text-3xl font-bold">92%</div>
                <div className="text-white/80 text-sm">Taux de Placement</div>
              </div>
              <div>
                <div className="text-3xl font-bold">6 mois</div>
                <div className="text-white/80 text-sm">Délai Moyen d'Embauche</div>
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
              Une Plateforme Dédiée aux Établissements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tous les outils nécessaires pour optimiser l'employabilité de vos étudiants et renforcer vos partenariats entreprises.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              
              // Images spécifiques pour les fonctionnalités établissements
              const featureImages = [
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Placement - Team
                'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Analytics - Data viz
                'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Relations - Network
                'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'  // Accompagnement - Goals
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
      <section className="py-20 bg-gradient-to-r from-[#2563eb] to-[#0f766e] text-white relative z-10">
        <div className="container-emeres relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rejoignez le Réseau ÉMÉRÉS
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Offrez à vos étudiants les meilleures opportunités professionnelles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/school/register">
              <EmeresButton size="lg" className="btn-hero-primary px-8 py-4">
                <TrendingUp className="mr-2 h-5 w-5" />
                Commencer Maintenant
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

export default SolutionEtablissements;


