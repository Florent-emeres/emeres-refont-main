import React, { useState } from 'react';
import { Video, Calendar, Clock, Users, Play } from 'lucide-react';
import EmeresCard from '../ui/EmeresCard';
import EmeresButton from '../ui/EmeresButton';
import ProtectedResource from '../ProtectedResource';

const WebinairesPage = () => {
  return (
    <ProtectedResource resourceType="page des webinaires" resourceTitle="nos webinaires interactifs">
      <WebinairesContent />
    </ProtectedResource>
  );
};

const WebinairesContent = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingWebinars = [
    {
      id: 1,
      title: 'Décrocher un stage dans la tech en 2024',
      description: 'Les stratégies gagnantes pour intégrer les meilleures entreprises tech.',
      speaker: 'Sarah Chen, Head of Talent chez Google',
      date: '15 Sep 2024',
      time: '14:00 - 15:30',
      attendees: 245,
      image: '/api/placeholder/400/250'
    },
    {
      id: 2,
      title: 'L\'art de la négociation salariale',
      description: 'Comment négocier votre salaire et vos avantages comme un pro.',
      speaker: 'Marc Dupont, Coach en négociation',
      date: '20 Sep 2024',
      time: '18:00 - 19:00',
      attendees: 189,
      image: '/api/placeholder/400/250'
    }
  ];

  const pastWebinars = [
    {
      id: 3,
      title: 'CV et IA : optimiser son profil en 2024',
      description: 'Comment adapter son CV aux nouvelles technologies de recrutement.',
      speaker: 'Julie Martin, RH Expert',
      date: '08 Sep 2024',
      duration: '1h 15min',
      views: 1240,
      image: '/api/placeholder/400/250'
    },
    {
      id: 4,
      title: 'Réussir son entretien vidéo',
      description: 'Toutes les astuces pour exceller lors des entretiens à distance.',
      speaker: 'Pierre Leroy, Career Coach',
      date: '01 Sep 2024',
      duration: '45min',
      views: 980,
      image: '/api/placeholder/400/250'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Image globale pour webinaires */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1606248896999-387b3a9f621c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white py-20 relative overflow-hidden">
        {/* Background Image pour hero avec contraste élevé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        {/* Overlay pour maintenir le contraste */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/85 via-red-600/85 to-pink-600/85" />
        
        <div className="container-emeres relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Video className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Webinaires ÉMÉRÉS
            </h1>
            
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Formations en ligne avec nos experts pour booster votre carrière et vos compétences.
            </p>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">30+</div>
                <div className="text-orange-200 text-sm">Webinaires Disponibles</div>
              </div>
              <div>
                <div className="text-3xl font-bold">5K+</div>
                <div className="text-orange-200 text-sm">Participants</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4.8/5</div>
                <div className="text-orange-200 text-sm">Satisfaction Moyenne</div>
              </div>
              <div>
                <div className="text-3xl font-bold">Gratuit</div>
                <div className="text-orange-200 text-sm">Accès Libre</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 bg-white border-b relative z-10">
        <div className="container-emeres">
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                  activeTab === 'upcoming'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                À venir
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                  activeTab === 'past'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Replays
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Webinars Content */}
      <section className="py-12 relative z-10">
        <div className="container-emeres">
          {activeTab === 'upcoming' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Prochains Webinaires
                </h2>
                <p className="text-gray-600">
                  Inscrivez-vous gratuitement aux prochaines sessions.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {upcomingWebinars.map((webinar) => (
                  <EmeresCard key={webinar.id} className="overflow-hidden hover-lift group">
                    <div className="relative">
                      <img 
                        src={webinar.image} 
                        alt={webinar.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Image de fond pour overlay */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
                        style={{
                          backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`
                        }}
                      />
                      
                      <div className="absolute top-4 right-4">
                        <span className="text-xs font-medium text-white bg-orange-600 px-2 py-1 rounded-full">
                          À venir
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {webinar.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4">
                        {webinar.description}
                      </p>
                      
                      <div className="space-y-2 mb-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {webinar.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {webinar.time}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {webinar.attendees} inscrits
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700">
                          Animé par {webinar.speaker}
                        </p>
                      </div>
                      
                      <EmeresButton className="w-full">
                        S'inscrire Gratuitement
                      </EmeresButton>
                    </div>
                  </EmeresCard>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'past' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Replays Disponibles
                </h2>
                <p className="text-gray-600">
                  Rattrapez les sessions que vous avez manquées.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {pastWebinars.map((webinar) => (
                  <EmeresCard key={webinar.id} className="overflow-hidden hover-lift group cursor-pointer">
                    <div className="relative">
                      <img 
                        src={webinar.image} 
                        alt={webinar.title}
                        className="w-full h-48 object-cover"
                      />
                      
                      {/* Image de fond pour overlay */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
                        style={{
                          backgroundImage: `url('https://images.unsplash.com/photo-1606248896999-387b3a9f621c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-orange-600 ml-1" />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="text-xs font-medium text-white bg-gray-600 px-2 py-1 rounded-full">
                          Replay
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200">
                        {webinar.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4">
                        {webinar.description}
                      </p>
                      
                      <div className="space-y-2 mb-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {webinar.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {webinar.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {webinar.views} vues
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700">
                          Animé par {webinar.speaker}
                        </p>
                      </div>
                      
                      <EmeresButton className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Regarder le Replay
                      </EmeresButton>
                    </div>
                  </EmeresCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WebinairesPage;