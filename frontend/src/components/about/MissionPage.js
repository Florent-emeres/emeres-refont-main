import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Heart, Zap, Users, Globe, ArrowRight, Eye, Compass, Sparkles, Lightbulb, Star, Rocket, Crown } from 'lucide-react';
import EmeresCard from '../ui/EmeresCard';
import EmeresButton from '../ui/EmeresButton';

const MissionPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'Nous sommes animés par la passion de connecter les talents aux opportunités qui transforment leur avenir.',
      color: 'from-rose-500 to-pink-500'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Nous repoussons les limites technologiques pour révolutionner l\'écosystème formation-emploi.',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Bienveillance',
      description: 'Chaque interaction est guidée par l\'empathie et le respect mutuel dans notre communauté.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Star,
      title: 'Impact',
      description: 'Nous mesurons notre succès par l\'impact positif que nous créons sur les vies et les carrières.',
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  const pillars = [
    {
      icon: Rocket,
      title: 'Excellence Technologique',
      description: 'Développer les solutions IA les plus avancées pour optimiser le matching talents-opportunités.',
      metrics: ['95% précision matching', '< 2s temps de réponse', '99.9% disponibilité']
    },
    {
      icon: Heart,
      title: 'Accompagnement Humain',
      description: 'Offrir un support personnalisé et empathique à chaque étape du parcours professionnel.',
      metrics: ['24/7 support dédié', '4.8/5 satisfaction', '< 1h temps de réponse']
    },
    {
      icon: Crown,
      title: 'Innovation Continue',
      description: 'Anticiper les besoins du marché et créer les outils de demain dès aujourd\'hui.',
      metrics: ['30+ nouvelles features/an', 'R&D 25% budget', '15+ partenaires tech']
    }
  ];

  const impact = [
    {
      number: '50K+',
      label: 'Vies Transformées',
      description: 'Étudiants, mentors et professionnels accompagnés vers le succès'
    },
    {
      number: '2K+',
      label: 'Entreprises Partenaires',
      description: 'Organisations qui font confiance à notre expertise'
    },
    {
      number: '85%',
      label: 'Taux de Placement',
      description: 'Étudiants trouvant leur opportunité idéale via ÉMÉRÉS'
    },
    {
      number: '4.9/5',
      label: 'Satisfaction Globale',
      description: 'Note moyenne de nos utilisateurs sur toutes nos solutions'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Image globale pour mission */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white py-20 relative overflow-hidden">
        {/* Background Image pour hero avec contraste élevé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        {/* Overlay pour maintenir le contraste */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/85 via-indigo-600/85 to-blue-600/85" />
        
        <div className="container-emeres relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Target className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Mission & Vision
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Découvrez nos valeurs fondamentales, notre mission d'impact et notre vision pour l'avenir du travail.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-white relative z-10">
        <div className="container-emeres">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4">
                <Compass className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Notre Mission
            </h2>
            
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
              <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed">
                "Révolutionner l'écosystème formation-emploi en connectant intelligemment les talents aux opportunités, 
                grâce à l'alliance parfaite entre intelligence artificielle et accompagnement humain."
              </blockquote>
              <footer className="mt-6 text-lg text-purple-600 font-semibold">
                — L'équipe fondatrice d'ÉMÉRÉS
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 relative z-10">
        <div className="container-emeres">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-4">
                <Eye className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Notre Vision
            </h2>
            
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 md:p-12 border border-blue-100">
              <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed mb-6">
                "D'ici 2030, faire d'ÉMÉRÉS la référence européenne de l'accompagnement intelligent vers l'emploi, 
                où chaque talent trouve sa voie et chaque entreprise ses futurs leaders."
              </blockquote>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">2030</div>
                  <div className="text-sm text-gray-600">Horizon de référence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10M+</div>
                  <div className="text-sm text-gray-600">Vies impactées</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">25</div>
                  <div className="text-sm text-gray-600">Pays couverts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white relative z-10">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Valeurs Fondamentales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les principes qui guident chacune de nos décisions et façonnent notre culture d'entreprise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <EmeresCard key={index} className="p-6 text-center hover-lift group">
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </EmeresCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Strategic Pillars */}
      <section className="py-20 bg-gray-50 relative z-10">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Piliers Stratégiques
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les trois fondements sur lesquels nous construisons l'avenir d'ÉMÉRÉS.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <EmeresCard key={index} className="p-8 hover-lift">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {pillar.description}
                  </p>
                  
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Indicateurs clés :</h4>
                    <div className="space-y-2">
                      {pillar.metrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                </EmeresCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white relative z-10">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les résultats concrets de notre mission au service des talents et des entreprises.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impact.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                  {item.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.label}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white relative z-10">
        <div className="container-emeres text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Partagez Notre Vision
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Rejoignez-nous pour construire l'avenir de l'emploi et transformer des millions de vies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <EmeresButton size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4">
                <Heart className="mr-2 h-5 w-5" />
                Nous Rejoindre
              </EmeresButton>
            </Link>
            <Link to="/a-propos/carrieres">
              <EmeresButton 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4"
              >
                Voir Nos Offres
                <ArrowRight className="ml-2 h-5 w-5" />
              </EmeresButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MissionPage;