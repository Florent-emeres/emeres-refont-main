import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Trophy, Star, Medal, Shield, Calendar, ExternalLink, Crown, Gem, Zap, Sparkles } from 'lucide-react';
import EmeresCard from '../ui/EmeresCard';
import EmeresButton from '../ui/EmeresButton';

const RecompensesPage = () => {
  const awards = [
    {
      year: '2024',
      title: 'Prix Innovation RH France',
      organization: 'HR Tech Awards',
      category: 'Meilleure solution IA pour le recrutement',
      description: 'Reconnaissance de notre algorithme de matching révolutionnaire qui transforme le recrutement.',
      icon: Crown,
      color: 'from-amber-500 to-gray-500',
      status: 'Lauréat',
      impact: '+40% efficacité de matching'
    },
    {
      year: '2024',
      title: 'European Tech Rising Star',
      organization: 'TechCrunch Europe',
      category: 'Startup B2B de l\'année',
      description: 'Sélectionnés parmi les 50 startups européennes les plus prometteuses dans le secteur EdTech.',
      icon: Sparkles,
      color: 'from-blue-500 to-cyan-500',
      status: 'Top 10',
      impact: '2M€ levée de fonds'
    },
    {
      year: '2023',
      title: 'Forbes 30 Under 30',
      organization: 'Forbes France',
      category: 'Technologie & Innovation',
      description: 'Notre CEO Sarah Chen reconnue parmi les jeunes leaders technologiques les plus influents.',
      icon: Gem,
      color: 'from-purple-500 to-pink-500',
      status: 'Lauréate',
      impact: 'Visibilité internationale'
    },
    {
      year: '2023',
      title: 'French Tech Next 120',
      organization: 'La French Tech',
      category: 'Startup à fort potentiel',
      description: 'Intégration dans le programme d\'accompagnement des startups françaises d\'excellence.',
      icon: Zap,
      color: 'from-red-500 to-pink-500',
      status: 'Sélectionné',
      impact: 'Accès écosystème'
    },
    {
      year: '2023',
      title: 'Data Protection Excellence',
      organization: 'CNIL & EU Privacy Board',
      category: 'Conformité RGPD exemplaire',
      description: 'Certification pour notre approche exemplaire de la protection des données personnelles.',
      icon: Shield,
      color: 'from-green-500 to-teal-500',
      status: 'Certifié',
      impact: '100% conformité RGPD'
    },
    {
      year: '2022',
      title: 'Prix Jeune Entreprise Innovante',
      organization: 'BPI France',
      category: 'Innovation technologique',
      description: 'Reconnaissance de notre contribution à l\'innovation dans l\'écosystème formation-emploi.',
      icon: Trophy,
      color: 'from-indigo-500 to-purple-500',
      status: 'Lauréat',
      impact: '500K€ financement'
    }
  ];

  const certifications = [
    {
      name: 'ISO 27001',
      description: 'Sécurité des systèmes d\'information',
      year: '2023',
      expires: '2026',
      icon: Shield
    },
    {
      name: 'SOC 2 Type II',
      description: 'Contrôles de sécurité et disponibilité',
      year: '2023',
      expires: '2024',
      icon: Award
    },
    {
      name: 'RGPD Compliance',
      description: 'Protection des données personnelles',
      year: '2023',
      expires: 'Permanent',
      icon: Shield
    },
    {
      name: 'B Corp Certified',
      description: 'Impact social et environnemental',
      year: '2024',
      expires: '2027',
      icon: Star
    }
  ];

  const recognitions = [
    {
      title: 'Top 50 EdTech Europe',
      source: 'TechCrunch',
      year: '2024'
    },
    {
      title: 'Rising Star HR Tech',
      source: 'VentureBeat',
      year: '2024'
    },
    {
      title: 'Innovation Leader France',
      source: 'Les Échos',
      year: '2023'
    },
    {
      title: 'Future of Work Pioneer',
      source: 'Wired Magazine',
      year: '2023'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Image globale pour récompenses */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-500 via-blue-500 to-indigo-500 text-white py-20 relative overflow-hidden">
        {/* Background Image pour hero avec contraste élevé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        {/* Overlay pour maintenir le contraste */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/85 via-blue-500/85 to-indigo-500/85" />
        
        <div className="container-emeres relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Award className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nos Récompenses
            </h1>
            
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Les reconnaissances qui valident notre expertise et notre impact dans l'écosystème formation-emploi.
            </p>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">15+</div>
                <div className="text-orange-200 text-sm">Prix & Distinctions</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4</div>
                <div className="text-orange-200 text-sm">Certifications Majeures</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-orange-200 text-sm">Mentions Presse</div>
              </div>
              <div>
                <div className="text-3xl font-bold">3</div>
                <div className="text-orange-200 text-sm">Années Consécutives</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Timeline */}
      <section className="py-20 relative z-10">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Prix & Distinctions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un parcours d'excellence reconnu par les acteurs les plus prestigieux de l'écosystème tech.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {awards.map((award, index) => {
                const Icon = award.icon;
                return (
                  <EmeresCard key={index} className="p-6 hover-lift group overflow-hidden relative">
                    {/* Image de fond pour awards */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 group-hover:opacity-8 transition-opacity duration-300"
                      style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`
                      }}
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${award.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-500">{award.year}</div>
                          <span className="inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                            {award.status}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {award.title}
                      </h3>
                      
                      <div className="text-purple-600 font-medium text-sm mb-2">
                        {award.organization} • {award.category}
                      </div>
                      
                      <p className="text-gray-600 mb-4 text-sm">
                        {award.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          Impact: {award.impact}
                        </span>
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </EmeresCard>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white relative z-10">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Certifications & Conformité
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre engagement pour la sécurité, la qualité et l'impact social validé par les standards internationaux.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <EmeresCard key={index} className="p-6 text-center hover-lift overflow-hidden relative">
                  {/* Image de fond pour certifications */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`
                    }}
                  />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {cert.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      {cert.description}
                    </p>
                    
                    <div className="text-xs text-gray-500">
                      <div>Obtenu: {cert.year}</div>
                      <div>Expire: {cert.expires}</div>
                    </div>
                  </div>
                </EmeresCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Media Recognition */}
      <section className="py-20 bg-gray-50 relative z-10">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Reconnaissance Médiatique
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ÉMÉRÉS dans les médias : une visibilité qui témoigne de notre impact sur l'écosystème.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recognitions.map((recognition, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center hover-lift overflow-hidden relative group">
                {/* Image de fond pour reconnaissance média */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 group-hover:opacity-8 transition-opacity duration-300"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`
                  }}
                />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ExternalLink className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {recognition.title}
                  </h3>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {recognition.source}
                  </div>
                  
                  <div className="text-xs text-purple-600 font-medium">
                    {recognition.year}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Retrouvez toutes nos apparitions médiatiques et témoignages d'experts
            </p>
            <EmeresButton variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
              Voir Nos Apparitions Presse
              <ExternalLink className="ml-2 h-4 w-4" />
            </EmeresButton>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white relative z-10">
        <div className="container-emeres text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Excellence Reconnue, Innovation Continue
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Ces récompenses nous motivent à poursuivre notre mission : révolutionner l'avenir de l'emploi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <EmeresButton size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-4">
                <Star className="mr-2 h-5 w-5" />
                Rejoindre l'Excellence
              </EmeresButton>
            </Link>
            <Link to="/a-propos/equipe">
              <EmeresButton 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4"
              >
                Rencontrer l'Équipe
              </EmeresButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecompensesPage;