import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Heart, Zap, MapPin, Clock, Euro, ArrowRight, Coffee, Laptop, Plane, Sparkles, Crown, Star, Rocket, Brain, Palette } from 'lucide-react';
import EmeresCard from '../ui/EmeresCard';
import EmeresButton from '../ui/EmeresButton';

const CarrieresPage = () => {
  const positions = [
    {
      title: 'Senior Full-Stack Developer',
      department: 'Engineering',
      location: 'Paris / Remote',
      type: 'CDI',
      experience: '5+ ans',
      salary: '65-85K€',
      description: 'Rejoignez notre équipe technique pour développer les fonctionnalités qui révolutionnent le recrutement.',
      skills: ['React', 'Node.js', 'Python', 'MongoDB', 'AWS'],
      benefits: ['Remote first', 'Stock options', 'Formation continue'],
      urgent: true
    },
    {
      title: 'Data Scientist IA',
      department: 'Data & IA',
      location: 'Lyon / Hybrid',
      type: 'CDI',
      experience: '3+ ans',
      salary: '55-75K€',
      description: 'Développez nos algorithmes de matching et d\'intelligence artificielle pour optimiser les connexions.',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'MLOps'],
      benefits: ['Innovation time 20%', 'Conférences IA', 'GPU workstation'],
      urgent: false
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Paris / Hybrid',
      type: 'CDI',
      experience: '4+ ans',
      salary: '60-80K€',
      description: 'Pilotez la vision produit et coordonnez les équipes pour créer des expériences utilisateur exceptionnelles.',
      skills: ['Product Strategy', 'Analytics', 'UX Design', 'Agile', 'Figma'],
      benefits: ['Ownership produit', 'Budget innovation', 'Mentoring CEO'],
      urgent: true
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'CDI',
      experience: '4+ ans',
      salary: '58-78K€',
      description: 'Optimisez notre infrastructure cloud et automatisez nos processus de déploiement.',
      skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Monitoring'],
      benefits: ['100% remote', 'Budget formation', 'Matériel premium'],
      urgent: false
    },
    {
      title: 'UX/UI Designer Senior',
      department: 'Design',
      location: 'Bordeaux / Remote',
      type: 'CDI',
      experience: '5+ ans',
      salary: '50-70K€',
      description: 'Concevez des interfaces intuitives qui transforment l\'expérience de nos 50K+ utilisateurs.',
      skills: ['Figma', 'Design System', 'User Research', 'Prototyping', 'A/B Testing'],
      benefits: ['Creative freedom', 'Design tools budget', 'Portfolio support'],
      urgent: false
    },
    {
      title: 'Business Developer',
      department: 'Sales & Partnerships',
      location: 'Paris',
      type: 'CDI',
      experience: '3+ ans',
      salary: '45-65K€ + variable',
      description: 'Développez notre écosystème de partenaires entreprises et établissements d\'enseignement.',
      skills: ['Sales', 'Negotiation', 'CRM', 'Partnerships', 'EdTech'],
      benefits: ['Commission attractive', 'Car allowance', 'Team incentives'],
      urgent: true
    }
  ];

  const benefits = [
    {
      icon: Rocket,
      title: 'Remote First',
      description: 'Travaillez d\'où vous voulez, quand vous voulez. Notre culture privilégie les résultats.'
    },
    {
      icon: Heart,
      title: 'Work-Life Balance',
      description: 'Semaine de 4.5 jours, horaires flexibles et droit à la déconnexion respecté.'
    },
    {
      icon: Sparkles,
      title: 'Innovation Time',
      description: '20% de votre temps dédié à vos projets personnels et à l\'expérimentation.'
    },
    {
      icon: Crown,
      title: 'Équipe Exceptionnelle',
      description: 'Collaborez avec des experts passionnés venus des meilleures entreprises tech.'
    },
    {
      icon: Star,
      title: 'Package Compétitif',
      description: 'Salaire équitable, stock options, prime de performance et avantages premium.'
    },
    {
      icon: Brain,
      title: 'Budget Formation',
      description: '3000€/an pour conférences, formations et certifications de votre choix.'
    }
  ];

  const culture = [
    {
      title: 'Autonomie & Responsabilité',
      description: 'Prenez des décisions, expérimentez et apprenez de vos succès comme de vos échecs.'
    },
    {
      title: 'Impact Social',
      description: 'Chaque ligne de code, chaque design contribue à transformer des milliers de vies.'
    },
    {
      title: 'Excellence Technique',
      description: 'Nous investissons dans les meilleures technologies et pratiques pour rester à la pointe.'
    },
    {
      title: 'Diversité & Inclusion',
      description: 'Une équipe de 15 nationalités où chaque voix compte et chaque différence enrichit.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Image globale pour carrières */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20 relative overflow-hidden">
        {/* Background Image pour hero avec contraste élevé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        {/* Overlay pour maintenir le contraste */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/85 via-purple-600/85 to-pink-600/85" />
        
        <div className="container-emeres relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Briefcase className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Rejoignez-nous
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Construisez l'avenir de l'emploi avec une équipe exceptionnelle dans une startup qui révolutionne le monde du travail.
            </p>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-purple-200 text-sm">Talents Exceptionnels</div>
              </div>
              <div>
                <div className="text-3xl font-bold">12</div>
                <div className="text-purple-200 text-sm">Postes Ouverts</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4.9/5</div>
                <div className="text-purple-200 text-sm">Satisfaction Équipe</div>
              </div>
              <div>
                <div className="text-3xl font-bold">95%</div>
                <div className="text-purple-200 text-sm">Rétention Employés</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 relative z-10">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Postes Ouverts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les opportunités exceptionnelles qui vous attendent chez ÉMÉRÉS.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {positions.map((position, index) => (
              <EmeresCard key={index} className="p-6 hover-lift group overflow-hidden relative">
                {/* Image de fond pour chaque poste */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 group-hover:opacity-8 transition-opacity duration-300"
                  style={{
                    backgroundImage: position.department === 'Engineering' ? 
                      `url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')` :
                      position.department === 'Data & IA' ?
                      `url('https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')` :
                      position.department === 'Product' ?
                      `url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')` :
                      position.department === 'Design' ?
                      `url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')` :
                      `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`
                  }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                        {position.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                          {position.department}
                        </span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {position.location}
                        </div>
                      </div>
                    </div>
                    {position.urgent && (
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                        Urgent
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {position.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{position.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{position.experience}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Euro className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{position.salary}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Compétences requises :</h4>
                    <div className="flex flex-wrap gap-2">
                      {position.skills.map((skill, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Avantages :</h4>
                    <div className="flex flex-wrap gap-2">
                      {position.benefits.map((benefit, idx) => (
                        <span key={idx} className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <EmeresButton 
                    variant="primary" 
                    className="w-full group-hover:shadow-lg transition-all duration-200"
                  >
                    Postuler Maintenant
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </EmeresButton>
                </div>
              </EmeresCard>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Vous ne trouvez pas le poste idéal ?
              </h3>
              <p className="text-gray-600 mb-6">
                Envoyez-nous votre candidature spontanée ! Nous sommes toujours à la recherche de talents exceptionnels.
              </p>
              <EmeresButton variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                Candidature Spontanée
              </EmeresButton>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white relative z-10">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi Nous Rejoindre ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bien plus qu'un job, découvrez un environnement où vous pourrez vous épanouir et avoir un impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 bg-gray-50 relative z-10">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Culture
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les valeurs qui façonnent notre quotidien et créent un environnement de travail exceptionnel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {culture.map((item, index) => (
              <EmeresCard key={index} className="p-6 hover-lift overflow-hidden relative">
                {/* Image de fond pour culture */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`
                  }}
                />
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </EmeresCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white relative z-10">
        <div className="container-emeres text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à Transformer l'Avenir ?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Rejoignez une équipe exceptionnelle et participez à la révolution de l'emploi et de la formation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EmeresButton size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4">
              <Heart className="mr-2 h-5 w-5" />
              Postuler Maintenant
            </EmeresButton>
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

export default CarrieresPage;