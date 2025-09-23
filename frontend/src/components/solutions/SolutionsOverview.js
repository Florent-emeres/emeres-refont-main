import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Building, BrainCircuit, BookOpen, Users, ArrowRight } from 'lucide-react';
import EmeresCard from '../ui/EmeresCard';
import EmeresButton from '../ui/EmeresButton';

const SolutionsOverview = () => {
  const solutions = [
    {
      name: 'Étudiants',
      href: '/solutions/etudiants',
      icon: GraduationCap,
      description: 'Trouvez votre stage ou alternance idéale grâce à notre IA et nos mentors',
      features: ['Matching IA', 'Mentorat personnalisé', 'Suivi performance', 'Réseau professionnel'],
      color: 'from-teal-500 to-cyan-500',
      stats: { users: '10K+', satisfaction: '95%' }
    },
    {
      name: 'Entreprises',
      href: '/solutions/entreprises',
      icon: Users,
      description: 'Recrutez vos futurs talents avec notre plateforme de matching intelligent',
      features: ['Matching précis', 'Analytics RH', 'Communication intégrée', 'Gestion complète'],
      color: 'from-blue-500 to-indigo-500',
      stats: { users: '2K+', satisfaction: '90%' }
    },
    {
      name: 'Établissements',
      href: '/solutions/etablissements',
      icon: BookOpen,
      description: 'Connectez vos étudiants au monde professionnel et maximisez leur employabilité',
      features: ['Placement étudiant', 'Suivi analytics', 'Relation entreprises', 'Accompagnement'],
      color: 'from-green-500 to-teal-500',
      stats: { users: '500+', satisfaction: '92%' }
    },
    {
      name: 'Mentors',
      href: '/solutions/mentors',
      icon: BrainCircuit,
      description: 'Accompagnez la nouvelle génération et valorisez votre expertise',
      features: ['Accompagnement personnalisé', 'Communication intégrée', 'Reconnaissance', 'Suivi progrès'],
      color: 'from-purple-500 to-pink-500',
      stats: { users: '1K+', satisfaction: '4.9/5' }
    },
    {
      name: 'Institutions',
      href: '/solutions/institutions',
      icon: Building,
      description: 'Pilotez votre écosystème formation avec des outils de gouvernance avancés',
      features: ['Business Intelligence', 'Écosystème connecté', 'Gouvernance', 'Pilotage stratégique'],
      color: 'from-indigo-500 to-purple-500',
      stats: { users: '50+', satisfaction: '88%' }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-gradient-emeres text-white py-20 relative overflow-hidden text-white py-20 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1597733336794-12d05021d510?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        
        <div className="container-emeres relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nos Solutions
              <span className="block text-hero-accent font-semibold">
                Pour Chaque Profil
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Découvrez comment ÉMÉRÉS révolutionne l'écosystème formation-emploi pour tous les acteurs.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20">
        <div className="container-emeres">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              
              // Images spécifiques pour chaque solution
              const solutionImages = [
                'https://images.unsplash.com/photo-1541178735493-479c1a27ed24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Étudiants - Student with laptop
                'https://images.unsplash.com/photo-1755541516524-66c617307a99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Entreprises - Professional working
                'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Établissements - Graduation
                'https://images.unsplash.com/photo-1606248896999-387b3a9f621c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Mentors - MacBook interface
                'https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'  // Institutions - Network diagram
              ];
              
              return (
                <EmeresCard key={index} className="hover-lift group cursor-pointer overflow-hidden">
                  <Link to={solution.href} className="block">
                    {/* Image d'illustration pour chaque solution */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={solutionImages[index]} 
                        alt={solution.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    
                    <div className="p-6">
                      {/* Icône repositionnée avec le titre */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${solution.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-200">
                          {solution.name}
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 mb-4">
                        {solution.description}
                      </p>
                      
                      <ul className="space-y-2 mb-6">
                        {solution.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-500 flex items-center">
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                        <span>{solution.stats.users} utilisateurs</span>
                        <span>{solution.stats.satisfaction} satisfaction</span>
                      </div>
                      
                      <div className="mt-4 flex items-center text-teal-600 font-medium group-hover:text-teal-700">
                        En savoir plus
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

      {/* CTA Section */}
      <section className="py-20 text-white overflow-hidden cta-gradient-emeres">
        <div className="container-emeres relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à Rejoindre l'Écosystème ÉMÉRÉS ?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Quelle que soit votre situation, nous avons la solution adaptée à vos besoins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <EmeresButton size="lg" className="btn-hero-primary px-8 py-4">
                Commencer Maintenant
              </EmeresButton>
            </Link>
            <Link to="/contact">
              <EmeresButton 
                variant="outline" 
                size="lg" 
                className="btn-hero-outline px-8 py-4"
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

export default SolutionsOverview;

