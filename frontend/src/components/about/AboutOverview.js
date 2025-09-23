import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Globe, Target, Award, Briefcase, ArrowRight, Heart, Zap, Shield, TrendingUp, Sparkles, Crown, Star, Rocket } from 'lucide-react';
import EmeresCard from '../ui/EmeresCard';
import EmeresButton from '../ui/EmeresButton';

const AboutOverview = () => {
  const sections = [
    {
      name: 'Notre Équipe',
      href: '/a-propos/equipe',
      icon: Users,
      description: 'Rencontrez les experts passionnés qui créent l\'avenir de l\'emploi',
      stats: { team: '50+ experts', experience: '15+ ans d\'exp.' }
    },
    {
      name: 'Écosystème',
      href: '/a-propos/ecosysteme',
      icon: Globe,
      description: 'Découvrez notre réseau de partenaires et acteurs de l\'écosystème',
      stats: { partners: '2000+ partenaires', countries: '5 pays' }
    },
    {
      name: 'Mission & Vision',
      href: '/a-propos/mission',
      icon: Target,
      description: 'Nos valeurs, notre mission et notre vision pour transformer l\'emploi',
      stats: { mission: 'Connecter talents', vision: 'Future of work' }
    },
    {
      name: 'Nos Récompenses',
      href: '/a-propos/recompenses',
      icon: Award,
      description: 'Les reconnaissances et certifications qui valident notre expertise',
      stats: { awards: '15+ prix', certifications: 'ISO 27001' }
    },
    {
      name: 'Rejoignez-nous',
      href: '/a-propos/carrieres',
      icon: Briefcase,
      description: 'Opportunités de carrière exceptionnelles dans une équipe dynamique',
      stats: { positions: '12+ postes', growth: '+40% croissance' }
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'Nous sommes passionnés par l\'idée de connecter les talents aux opportunités.'
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'Nous utilisons les dernières technologies pour révolutionner le recrutement.'
    },
    {
      icon: Shield,
      title: 'Confiance',
      description: 'La confiance de nos utilisateurs est au cœur de tout ce que nous faisons.'
    },
    {
      icon: Crown,
      title: 'Excellence',
      description: 'Nous visons l\'excellence dans chaque interaction et chaque fonctionnalité.'
    }
  ];

  const timeline = [
    {
      year: '2020',
      title: 'Fondation d\'ÉMÉRÉS',
      description: 'Création de la startup avec une vision révolutionnaire du recrutement.'
    },
    {
      year: '2021',
      title: 'Première levée de fonds',
      description: 'Financement de 2M€ pour développer notre plateforme IA.'
    },
    {
      year: '2022',
      title: 'Expansion nationale',
      description: 'Déploiement dans 5 grandes villes françaises.'
    },
    {
      year: '2023',
      title: '10 000+ utilisateurs',
      description: 'Franchissement du cap des 10 000 utilisateurs actifs.'
    },
    {
      year: '2024',
      title: 'International',
      description: 'Lancement en Europe avec nos premiers partenaires internationaux.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white py-20 relative overflow-hidden">
        {/* Background Image avec contraste élevé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        {/* Overlay pour améliorer le contraste */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-indigo-600/80 to-blue-600/80" />
        
        <div className="container-emeres relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              À Propos
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                d'ÉMÉRÉS
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Nous révolutionnons l'écosystème formation-emploi grâce à l'intelligence artificielle et l'accompagnement humain.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EmeresButton size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4">
                Découvrir Notre Histoire
                <ArrowRight className="ml-2 h-5 w-5" />
              </EmeresButton>
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">4 ans</div>
                <div className="text-purple-200 text-sm">d'Innovation</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-purple-200 text-sm">Experts Passionnés</div>
              </div>
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-purple-200 text-sm">Vies Transformées</div>
              </div>
              <div>
                <div className="text-3xl font-bold">15+</div>
                <div className="text-purple-200 text-sm">Prix & Reconnaissances</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections Grid */}
      <section className="py-20">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Découvrez ÉMÉRÉS
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plongez dans l'univers d'ÉMÉRÉS : notre équipe, nos valeurs, notre écosystème et nos ambitions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              // Images spécifiques pour chaque section About
              const sectionImages = [
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Équipe - Team collaboration
                'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Écosystème - Network/partnership
                'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Mission - Target/goal
                'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Récompenses - Awards/recognition
                'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'  // Carrières - Professional growth
              ];
              
              return (
                <EmeresCard key={index} className="hover-lift group cursor-pointer overflow-hidden">
                  <Link to={section.href} className="block">
                    {/* Image d'illustration avec overlay pour contraste */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={sectionImages[index]} 
                        alt={section.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Double overlay pour améliorer le contraste */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-indigo-600/30" />
                      
                      <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-200">
                        {section.name}
                      </h3>
                      
                      <p className="text-gray-600 mb-6">
                        {section.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                        <span>{Object.values(section.stats)[0]}</span>
                        <span>{Object.values(section.stats)[1]}</span>
                      </div>
                      
                      <div className="mt-4 flex items-center text-purple-600 font-medium group-hover:text-purple-700">
                        Découvrir
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </Link>
                </EmeresCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les principes qui guident chacune de nos actions et décisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Histoire
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              De startup innovante à leader du recrutement intelligent.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-purple-200"></div>
              
              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-start mb-12 last:mb-0">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mr-8">
                    <span className="text-white font-bold text-sm">{item.year}</span>
                  </div>
                  <div className="flex-1 min-w-0 pt-3">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container-emeres text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rejoignez l'Aventure ÉMÉRÉS
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Que vous soyez étudiant, entreprise, établissement ou mentor, il y a une place pour vous dans notre écosystème.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <EmeresButton size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4">
                <Heart className="mr-2 h-5 w-5" />
                Nous Rejoindre
              </EmeresButton>
            </Link>
            <Link to="/contact">
              <EmeresButton 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4"
              >
                Nous Contacter
              </EmeresButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutOverview;