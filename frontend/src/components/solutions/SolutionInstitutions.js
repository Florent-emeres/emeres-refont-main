import React from 'react';
import { Link } from 'react-router-dom';
import { Building, BarChart, Network, Shield, CheckCircle, ArrowRight, Star, Target, TrendingUp } from 'lucide-react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard from '../ui/EmeresCard';

const SolutionInstitutions = () => {
  const features = [
    {
      icon: BarChart,
      title: "Business Intelligence",
      description: "Analysez les tendances du marché de l'emploi et pilotez vos stratégies formation.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Network,
      title: "Écosystème Connecté",
      description: "Gérez et optimisez les relations entre établissements, entreprises et étudiants.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Gouvernance et Conformité",
      description: "Assurez la conformité réglementaire et la gouvernance de votre écosystème.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Target,
      title: "Pilotage Stratégique",
      description: "Tableaux de bord exécutifs pour prendre les bonnes décisions stratégiques.",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Image globale pour solution institutions */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Hero Section */}
      <section className="hero-gradient-emeres text-white py-20 relative overflow-hidden text-white py-20 relative overflow-hidden">
        {/* Background Image pour hero avec contraste élevé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        {/* Overlay pour maintenir le contraste */}
        <div className="absolute inset-0 absolute inset-0 hero-overlay-emeres" />
        
        <div className="container-emeres relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Building className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Pilotez Votre
              <span className="block text-hero-accent font-semibold">
                Écosystème Formation
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Une vision stratégique complète pour optimiser l'adéquation formation-emploi sur votre territoire.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/institution/register">
                <EmeresButton size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8 py-4">
                  Découvrir la Solution
                  <ArrowRight className="ml-2 h-5 w-5" />
                </EmeresButton>
              </Link>
              <EmeresButton 
                variant="outline" 
                size="lg" 
                className="btn-hero-outline px-8 py-4"
              >
                Demander une Présentation
              </EmeresButton>
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-indigo-200 text-sm">Institutions Clientes</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500K+</div>
                <div className="text-indigo-200 text-sm">Étudiants Suivis</div>
              </div>
              <div>
                <div className="text-3xl font-bold">15%</div>
                <div className="text-indigo-200 text-sm">Amélioration Placement</div>
              </div>
              <div>
                <div className="text-3xl font-bold">Real-time</div>
                <div className="text-indigo-200 text-sm">Analytics</div>
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
              Une Solution de Pilotage Stratégique
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Optimisez la performance de votre écosystème formation avec nos outils d'analyse et de pilotage avancés.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              
              // Images spécifiques pour les fonctionnalités institutions
              const featureImages = [
                'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // BI - Data viz
                'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Écosystème - Network
                'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Gouvernance - Code/Security
                'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'  // Pilotage - Goals
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
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative z-10">
        <div className="container-emeres relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Optimisez Votre Stratégie Formation
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Prenez les bonnes décisions grâce à notre plateforme d'intelligence stratégique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/institution/register">
              <EmeresButton size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8 py-4">
                <TrendingUp className="mr-2 h-5 w-5" />
                Commencer l'Analyse
              </EmeresButton>
            </Link>
            <Link to="/contact">
              <EmeresButton 
                variant="outline" 
                size="lg" 
                className="btn-hero-outline px-8 py-4"
              >
                Demander une Démo
              </EmeresButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolutionInstitutions;

