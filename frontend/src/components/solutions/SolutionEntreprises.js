import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, BarChart, MessageCircle, CheckCircle, ArrowRight, Star, Building, Zap, TrendingUp } from 'lucide-react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard from '../ui/EmeresCard';

const SolutionEntreprises = () => {
  const features = [
    {
      icon: Target,
      title: "Matching Précis",
      description: "Notre IA analyse les profils étudiants pour vous proposer les candidats les plus adaptés à vos besoins.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BarChart,
      title: "Analytics RH",
      description: "Suivez vos recrutements avec des tableaux de bord détaillés et des métriques avancées.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: MessageCircle,
      title: "Communication Intégrée",
      description: "Échangez directement avec les candidats via notre plateforme de messagerie sécurisée.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Building,
      title: "Gestion Complète",
      description: "De la publication d'offre au suivi post-embauche, gérez tout votre processus RH.",
      color: "from-orange-500 to-red-500"
    }
  ];

  const benefits = [
    {
      title: "Réduction des Coûts",
      description: "Diminuez vos coûts de recrutement de 60% en moyenne",
      stat: "60%"
    },
    {
      title: "Gain de Temps",
      description: "Accélérez vos processus de recrutement",
      stat: "75%"
    },
    {
      title: "Meilleure Rétention",
      description: "Nos candidats restent plus longtemps dans l'entreprise",
      stat: "90%"
    },
    {
      title: "Satisfaction RH",
      description: "Nos clients recommandent notre solution",
      stat: "95%"
    }
  ];

  const testimonials = [
    {
      name: "Entreprise Tech",
      role: "Secteur Technologie",
      company: "Startup en croissance",
      content: "Une solution qui nous a permis d'optimiser notre processus de recrutement et d'identifier les bons profils rapidement.",
      rating: 5
    },
    {
      name: "Groupe Industriel",
      role: "Secteur Industrie",
      company: "PME en développement",
      content: "Un outil innovant qui facilite la rencontre avec les talents dont nous avons besoin pour nos projets.",
      rating: 5
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "299€",
      period: "par mois",
      features: [
        "Jusqu'à 5 offres actives",
        "50 candidatures par mois",
        "Support email",
        "Analytics de base"
      ],
      popular: false
    },
    {
      name: "Business",
      price: "599€",
      period: "par mois",
      features: [
        "Offres illimitées",
        "200 candidatures par mois",
        "Support prioritaire",
        "Analytics avancés",
        "Manager dédié"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Sur mesure",
      period: "nous contacter",
      features: [
        "Solution personnalisée",
        "Intégration API",
        "Formation équipe",
        "Support 24/7",
        "SLA garanti"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Image globale pour solution entreprises */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Hero Section */}
      <section className="hero-gradient-emeres text-white py-20 relative overflow-hidden text-white py-20 relative overflow-hidden">
        {/* Background Image pour hero avec contraste élevé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1755541516524-66c617307a99?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
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
              Recrutez Vos Futurs
              <span className="block text-hero-accent font-semibold">
                Champions
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Accédez aux meilleurs talents de demain grâce à notre plateforme IA et construisez les équipes qui feront votre succès.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/company/register">
                <EmeresButton size="lg" className="btn-hero-primary px-8 py-4">
                  Commencer Maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </EmeresButton>
              </Link>
              <EmeresButton 
                variant="outline" 
                size="lg" 
                className="btn-hero-outline px-8 py-4"
              >
                Demander une Démo
              </EmeresButton>
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">2K+</div>
                <div className="text-blue-200 text-sm">Entreprises Clientes</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-blue-200 text-sm">Candidatures Traitées</div>
              </div>
              <div>
                <div className="text-3xl font-bold">85%</div>
                <div className="text-blue-200 text-sm">Taux de Conversion</div>
              </div>
              <div>
                <div className="text-3xl font-bold">48h</div>
                <div className="text-blue-200 text-sm">Délai Moyen de Matching</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Une Solution RH Complète
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              De la publication d'offre au suivi post-embauche, notre plateforme couvre tous vos besoins RH.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <EmeresCard key={index} className="text-center p-6 hover-lift">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </EmeresCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Des Résultats Mesurables
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nos clients obtiennent des résultats concrets et durables.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                  {benefit.stat}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ils Nous Font Confiance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez pourquoi les plus grandes entreprises choisissent ÉMÉRÉS.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <EmeresCard key={index} className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-blue-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                  <div className="text-sm font-medium text-blue-600">
                    {testimonial.company}
                  </div>
                </div>
              </EmeresCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tarifs Transparents
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez la formule qui correspond à vos besoins. Pas de frais cachés.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <EmeresCard key={index} className={`p-6 relative ${plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Populaire
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <EmeresButton 
                    size="lg" 
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full"
                  >
                    {plan.name === "Enterprise" ? "Nous Contacter" : "Commencer"}
                  </EmeresButton>
                </div>
              </EmeresCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container-emeres relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à Recruter les Talents de Demain ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez les 2000+ entreprises qui transforment leur recrutement avec ÉMÉRÉS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/company/register">
              <EmeresButton size="lg" className="btn-hero-primary px-8 py-4">
                <TrendingUp className="mr-2 h-5 w-5" />
                Démarrer Maintenant
              </EmeresButton>
            </Link>
            <Link to="/contact">
              <EmeresButton 
                variant="outline" 
                size="lg" 
                className="btn-hero-outline px-8 py-4"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Demander une Démo
              </EmeresButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolutionEntreprises;

