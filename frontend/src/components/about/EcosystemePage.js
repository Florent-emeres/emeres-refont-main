import React from 'react';
import { Globe, Users, Building, GraduationCap, BrainCircuit, ArrowRight, Sparkles, Crown, Star, Rocket } from 'lucide-react';
import EmeresCard from '../ui/EmeresCard';
import EmeresButton from '../ui/EmeresButton';

const EcosystemePage = () => {
  const ecosystem = [
    {
      type: 'Universités & Écoles',
      count: '500+',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-500',
      partners: ['Sorbonne', 'HEC Paris', 'ESCP', 'Sciences Po', 'Polytechnique']
    },
    {
      type: 'Entreprises',
      count: '2000+',
      icon: Rocket,
      color: 'from-blue-500 to-cyan-500',
      partners: ['Google', 'Microsoft', 'L\'Oréal', 'BNP Paribas', 'Airbus']
    },
    {
      type: 'Mentors Experts',
      count: '1000+',
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      partners: ['Ex-Google', 'Ex-McKinsey', 'Entrepreneurs', 'C-Level', 'Experts Tech']
    },
    {
      type: 'Institutions',
      count: '50+',
      icon: Star,
      color: 'from-orange-500 to-red-500',
      partners: ['Pôle Emploi', 'Régions', 'CCI', 'OPCO', 'Ministères']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Image globale pour écosystème */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-green-600 to-emerald-600 text-white py-20 relative overflow-hidden">
        {/* Background Image pour hero avec contraste élevé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        {/* Overlay pour maintenir le contraste */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/85 via-green-600/85 to-emerald-600/85" />
        
        <div className="container-emeres relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Globe className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Notre Écosystème
            </h1>
            
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Un réseau puissant de partenaires qui transforment ensemble l'avenir de l'emploi et de la formation.
            </p>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">3500+</div>
                <div className="text-green-200 text-sm">Partenaires Actifs</div>
              </div>
              <div>
                <div className="text-3xl font-bold">12</div>
                <div className="text-green-200 text-sm">Pays Couverts</div>
              </div>
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-green-200 text-sm">Satisfaction Partenaires</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-green-200 text-sm">Support Dédié</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Grid */}
      <section className="py-20 relative z-10">
        <div className="container-emeres">
          <div className="grid md:grid-cols-2 gap-8">
            {ecosystem.map((actor, index) => {
              const Icon = actor.icon;
              
              // Images spécifiques pour chaque type d'acteur de l'écosystème
              const actorImages = [
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Universités - Education
                'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Entreprises - Business
                'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Mentors - Professional
                'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'  // Institutions - Goals
              ];
              
              return (
                <EmeresCard key={index} className="p-8 hover-lift group overflow-hidden relative">
                  {/* Image de fond pour chaque type d'acteur */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 group-hover:opacity-8 transition-opacity duration-300"
                    style={{
                      backgroundImage: `url('${actorImages[index]}')`
                    }}
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${actor.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">{actor.count}</div>
                        <div className="text-sm text-gray-500">partenaires</div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {actor.type}
                    </h3>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Partenaires emblématiques :</h4>
                      <div className="flex flex-wrap gap-2">
                        {actor.partners.map((partner, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                            {partner}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </EmeresCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-green-600 text-white relative z-10">
        <div className="container-emeres text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rejoignez Notre Écosystème
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Ensemble, créons l'avenir de l'emploi et de la formation.
          </p>
          <EmeresButton size="lg" className="bg-white text-teal-600 hover:bg-gray-100 font-semibold px-8 py-4">
            Devenir Partenaire
            <ArrowRight className="ml-2 h-5 w-5" />
          </EmeresButton>
        </div>
      </section>
    </div>
  );
};

export default EcosystemePage;