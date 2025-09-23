import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Search, MessageCircle, BarChart, Users, CheckCircle, ArrowRight, Star, Target, Zap } from 'lucide-react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard from '../ui/EmeresCard';

const SolutionEtudiants = () => {
  const features = [
    {
      icon: Search,
      title: "Matching IA Intelligent",
      description: "Notre algorithme trouve les offres qui correspondent parfaitement à votre profil et vos aspirations.",
      color: "from-[#2563eb] to-[#0f766e]"
    },
    {
      icon: MessageCircle,
      title: "Mentorat Personnalisé",
      description: "Connectez-vous avec des mentors expérimentés dans votre domaine pour vous guider.",
      color: "from-[#0f766e] to-[#14b8a6]"
    },
    {
      icon: BarChart,
      title: "Suivi de Performance",
      description: "Analysez vos candidatures et optimisez votre recherche avec nos analytics avancés.",
      color: "from-[#312e81] to-[#7c3aed]"
    },
    {
      icon: Users,
      title: "Réseau Professionnel",
      description: "Développez votre réseau avec d'autres étudiants et professionnels de votre secteur.",
      color: "from-[#b8761a] to-[#8a5216]"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Créez votre profil",
      description: "Renseignez vos compétences, expériences et objectifs professionnels."
    },
    {
      number: "02", 
      title: "Laissez l'IA travailler",
      description: "Notre algorithme analyse le marché et vous propose les meilleures opportunités."
    },
    {
      number: "03",
      title: "Postulez intelligemment",
      description: "Utilisez nos outils IA pour optimiser CV et lettres de motivation."
    },
    {
      number: "04",
      title: "Décrochez votre stage",
      description: "Bénéficiez de notre accompagnement jusqu'à la signature de votre contrat."
    }
  ];

  const testimonials = [
    {
      name: "Étudiant Engineering",
      role: "Étudiant en École d'Ingénieur",
      content: "Une plateforme qui m'a permis de découvrir des opportunités que je n'aurais jamais trouvées ailleurs.",
      rating: 5,
      company: "Secteur Tech"
    },
    {
      name: "Étudiante Business",
      role: "Étudiante en École de Commerce",
      content: "L'accompagnement et les outils proposés sont excellents pour développer ses compétences professionnelles.",
      rating: 5,
      company: "Secteur Finance"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Image globale pour solution étudiants */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Hero Section */}
      <section className="hero-gradient-emeres text-white py-20 relative overflow-hidden">
        {/* Background Image pour hero avec contraste élevé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541178735493-479c1a27ed24?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        {/* Overlay pour maintenir le contraste */}
        <div className="absolute inset-0 hero-overlay-emeres" />
        
        <div className="container-emeres relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Votre Avenir Professionnel
              <span className="block text-hero-accent font-semibold">
                Commence Ici
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Trouvez le stage ou l'alternance parfaite grâce à notre IA et l'accompagnement de mentors experts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <EmeresButton size="lg" className="btn-hero-primary px-8 py-4">
                  Commencer Gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </EmeresButton>
              </Link>
              <EmeresButton 
                variant="outline" 
                size="lg" 
                className="btn-hero-outline px-8 py-4"
              >
                Voir la Démo
              </EmeresButton>
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-white/80 text-sm">Étudiants Connectés</div>
              </div>
              <div>
                <div className="text-3xl font-bold">2K+</div>
                <div className="text-white/80 text-sm">Entreprises Partenaires</div>
              </div>
              <div>
                <div className="text-3xl font-bold">95%</div>
                <div className="text-white/80 text-sm">Taux de Placement</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24h</div>
                <div className="text-white/80 text-sm">Délai Moyen de Réponse</div>
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
              Pourquoi Choisir ÉMÉRÉS ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une approche révolutionnaire qui combine intelligence artificielle et accompagnement humain pour maximiser vos chances de succès.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              
              // Images spécifiques pour les fonctionnalités étudiants
              const featureImages = [
                'https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Matching IA
                'https://images.unsplash.com/photo-1606248896999-387b3a9f621c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Mentorat
                'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Analytics
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'  // Réseau
              ];
              
              return (
                <EmeresCard key={index} className="text-center p-6 hover-lift overflow-hidden group">
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

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça Marche ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un processus simple en 4 étapes pour transformer votre recherche de stage.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center mb-12 last:mb-0">
                <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#2563eb] to-[#0f766e] rounded-2xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block ml-8">
                    <ArrowRight className="h-6 w-6 text-hero-accent" />
                  </div>
                )}
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
              Ils Ont Réussi avec ÉMÉRÉS
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les histoires de réussite de nos étudiants.
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
                  <div className="text-sm font-medium text-hero-accent">
                    {testimonial.company}
                  </div>
                </div>
              </EmeresCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 text-white overflow-hidden cta-gradient-emeres">
        <div className="absolute inset-0 cta-overlay-emeres" />
        <div className="container-emeres relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à Transformer Votre Avenir ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez les milliers d'étudiants qui ont déjà trouvé leur voie grâce à ÉMÉRÉS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <EmeresButton size="lg" className="btn-hero-primary px-8 py-4">
                <Target className="mr-2 h-5 w-5" />
                S'inscrire Maintenant
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

export default SolutionEtudiants;




