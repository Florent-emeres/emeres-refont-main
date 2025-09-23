import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { Lock, UserPlus, LogIn, Star, Shield, Users, BookOpen } from 'lucide-react';
import EmeresCard from './ui/EmeresCard';
import EmeresButton from './ui/EmeresButton';

const ProtectedResource = ({ children, resourceType = "ressource", resourceTitle = "cette ressource" }) => {
  const { user } = useAuth();

  // Si l'utilisateur est connecté, afficher le contenu
  if (user) {
    return children;
  }

  // Sinon, afficher la page de protection
  const benefits = [
    {
      icon: BookOpen,
      title: 'Ressources Étudiants',
      description: 'Guides CV, préparation entretiens, conseils stage et alternance'
    },
    {
      icon: Users,
      title: 'Outils Mentors',
      description: 'Templates de suivi, méthodes d\'accompagnement, formation continue'
    },
    {
      icon: Shield,
      title: 'Solutions Entreprises',
      description: 'Guides recrutement, templates offres, analytics de performance'
    },
    {
      icon: Star,
      title: 'Contenus Institutions',
      description: 'Rapports employabilité, outils pédagogiques, statistiques sectorielles'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white py-20">
        <div className="container-emeres">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Lock className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Ressources Personnalisées
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Ces ressources seront disponibles dans votre espace personnel selon votre profil utilisateur.
              <br />
              <span className="text-white font-semibold">Chaque type d'utilisateur accède à ses propres outils !</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <EmeresButton size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Créer un Compte Gratuit
                </EmeresButton>
              </Link>
              <Link to="/login">
                <EmeresButton 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Se Connecter
                </EmeresButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ressources Adaptées à Votre Profil
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chaque utilisateur accède à des contenus spécialement conçus pour ses besoins et objectifs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <EmeresCard key={index} className="text-center hover-lift">
                  <div className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </EmeresCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 bg-white">
        <div className="container-emeres">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ressources Personnalisées Selon Votre Profil
            </h2>
            
            <div className="bg-gray-100 rounded-2xl p-8 mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 flex items-center justify-center">
                <div className="text-center text-white">
                  <Lock className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">Accès via votre Compte</h3>
                  <p className="text-lg opacity-90">Connectez-vous pour accéder à vos ressources personnalisées</p>
                </div>
              </div>
              
              {/* Blurred preview content */}
              <div className="filter blur-sm opacity-50">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-8">
              Rejoignez plus de <strong>50 000 membres</strong> qui accèdent chaque jour à leurs ressources personnalisées selon leur profil.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <EmeresButton size="lg" className="bg-purple-600 hover:bg-purple-700 font-semibold px-8 py-4">
                  <UserPlus className="mr-2 h-5 w-5" />
                  S'inscrire Gratuitement
                </EmeresButton>
              </Link>
              <Link to="/tarifs">
                <EmeresButton 
                  variant="outline" 
                  size="lg" 
                  className="border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold px-8 py-4"
                >
                  Voir les Tarifs
                </EmeresButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-emeres">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ce Que Disent Nos Membres
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <EmeresCard className="hover-lift">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                    M
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900">Marie L.</h4>
                    <p className="text-sm text-gray-600">Étudiante en Marketing</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Les guides d'ÉMÉRÉS m'ont aidée à décrocher mon stage de rêve chez L'Oréal. Le contenu est très pratique !"
                </p>
                <div className="flex mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-blue-500 fill-current" />
                  ))}
                </div>
              </div>
            </EmeresCard>

            <EmeresCard className="hover-lift">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900">Alex R.</h4>
                    <p className="text-sm text-gray-600">Étudiant en Informatique</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Les webinaires tech sont exceptionnels. J'ai appris plus en 3 mois qu'en 1 an de cours !"
                </p>
                <div className="flex mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-blue-500 fill-current" />
                  ))}
                </div>
              </div>
            </EmeresCard>

            <EmeresCard className="hover-lift">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    S
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900">Sophie M.</h4>
                    <p className="text-sm text-gray-600">Étudiante en Finance</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Les templates de CV et lettres de motivation sont parfaits. Gain de temps énorme !"
                </p>
                <div className="flex mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-blue-500 fill-current" />
                  ))}
                </div>
              </div>
            </EmeresCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProtectedResource;