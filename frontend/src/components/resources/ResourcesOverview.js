import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, HelpCircle, Video, Download, BookMarked, ArrowRight, TrendingUp, Users, Clock } from 'lucide-react';
import EmeresCard from '../ui/EmeresCard';
import EmeresButton from '../ui/EmeresButton';

const ResourcesOverview = () => {
  const resources = [
    {
      name: 'Blog',
      href: '/ressources/blog',
      icon: FileText,
      description: 'Actualités, conseils et tendances du marché de l\'emploi',
      features: ['Articles expertises', 'Actualités secteur', 'Conseils carrière', 'Témoignages'],
      color: 'from-blue-500 to-cyan-500',
      stats: { articles: '150+', lecteurs: '25K+' }
    },
    {
      name: 'FAQ',
      href: '/ressources/faq',
      icon: HelpCircle,
      description: 'Réponses aux questions les plus fréquemment posées',
      features: ['Questions courantes', 'Guides pas-à-pas', 'Solutions rapides', 'Support technique'],
      color: 'from-green-500 to-teal-500',
      stats: { questions: '100+', résolues: '95%' }
    },
    {
      name: 'Guides',
      href: '/ressources/guides',
      icon: BookMarked,
      description: 'Guides pratiques et méthodologies pour optimiser votre recherche',
      features: ['Guides complets', 'Templates', 'Checklists', 'Bonnes pratiques'],
      color: 'from-purple-500 to-pink-500',
      stats: { guides: '50+', téléchargements: '10K+' }
    },
    {
      name: 'Webinaires',
      href: '/ressources/webinaires',
      icon: Video,
      description: 'Sessions de formation en ligne avec nos experts',
      features: ['Sessions live', 'Replays disponibles', 'Certificats', 'Q&A interactif'],
      color: 'from-orange-500 to-red-500',
      stats: { webinaires: '30+', participants: '5K+' }
    },
    {
      name: 'Téléchargements',
      href: '/ressources/telechargements',
      icon: Download,
      description: 'Templates, documents et outils prêts à utiliser',
      features: ['CV templates', 'Lettres types', 'Outils Excel', 'Présentations'],
      color: 'from-indigo-500 to-purple-500',
      stats: { fichiers: '75+', téléchargements: '15K+' }
    }
  ];

  const latestUpdates = [
    {
      type: 'Blog',
      title: 'Les métiers qui recrutent en 2024',
      date: '12 Sep 2024',
      readTime: '5 min'
    },
    {
      type: 'Guide',
      title: 'Guide complet de l\'entretien vidéo',
      date: '10 Sep 2024',
      readTime: '12 min'
    },
    {
      type: 'Webinaire',
      title: 'Décrocher un stage dans la tech',
      date: '08 Sep 2024',
      readTime: '45 min'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white py-20">
        <div className="container-emeres">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <BookMarked className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Centre de
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
                Ressources
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Guides, conseils, outils et formations pour maximiser vos chances de réussite professionnelle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EmeresButton size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-4">
                Explorer les Ressources
                <ArrowRight className="ml-2 h-5 w-5" />
              </EmeresButton>
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">400+</div>
                <div className="text-orange-200 text-sm">Ressources Disponibles</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-orange-200 text-sm">Téléchargements</div>
              </div>
              <div>
                <div className="text-3xl font-bold">95%</div>
                <div className="text-orange-200 text-sm">Satisfaction Utilisateurs</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-orange-200 text-sm">Accès Libre</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-20">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explorez Nos Ressources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tout ce dont vous avez besoin pour réussir votre parcours professionnel, organisé et accessible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <EmeresCard key={index} className="p-6 hover-lift group cursor-pointer">
                  <Link to={resource.href} className="block">
                    <div className={`w-16 h-16 bg-gradient-to-r ${resource.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200">
                      {resource.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      {resource.description}
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      {resource.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-500 flex items-center">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                      <span>{Object.values(resource.stats)[0]}</span>
                      <span>{Object.values(resource.stats)[1]}</span>
                    </div>
                    
                    <div className="mt-4 flex items-center text-orange-600 font-medium group-hover:text-orange-700">
                      Découvrir
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </Link>
                </EmeresCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="py-20 bg-white">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dernières Mises à Jour
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les ressources les plus récentes pour rester à jour.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestUpdates.map((update, index) => (
              <EmeresCard key={index} className="p-6 hover-lift">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    {update.type}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {update.readTime}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {update.title}
                </h3>
                
                <p className="text-sm text-gray-500 mb-4">
                  {update.date}
                </p>
                
                <div className="flex items-center text-orange-600 font-medium hover:text-orange-700 cursor-pointer">
                  Lire la suite
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </EmeresCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container-emeres text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Besoin d'Aide Spécifique ?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Notre équipe d'experts est là pour vous accompagner dans votre réussite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <EmeresButton size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-4">
                <Users className="mr-2 h-5 w-5" />
                Contacter un Expert
              </EmeresButton>
            </Link>
            <Link to="/ressources/faq">
              <EmeresButton 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4"
              >
                <HelpCircle className="mr-2 h-5 w-5" />
                Consulter la FAQ
              </EmeresButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourcesOverview;