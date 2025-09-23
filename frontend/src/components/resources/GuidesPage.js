import React, { useState } from 'react';
import { BookMarked, Download, Search, Filter, Eye, Star } from 'lucide-react';
import EmeresCard from '../ui/EmeresCard';
import EmeresButton from '../ui/EmeresButton';
import EmeresInput from '../ui/EmeresInput';
import ProtectedResource from '../ProtectedResource';

const GuidesPage = () => {
  return (
    <ProtectedResource resourceType="page des guides" resourceTitle="nos guides pratiques">
      <GuidesContent />
    </ProtectedResource>
  );
};

const GuidesContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const categories = ['Tous', 'CV & Lettres', 'Entretiens', 'Recherche', 'Négociation', 'Networking'];

  const guides = [
    {
      id: 1,
      title: 'Guide Complet du CV Parfait',
      description: 'Apprenez à créer un CV qui se démarque et attire l\'attention des recruteurs.',
      category: 'CV & Lettres',
      pages: 25,
      downloads: 2150,
      rating: 4.8,
      image: '/api/placeholder/300/200',
      featured: true
    },
    {
      id: 2,
      title: 'Réussir son Entretien d\'Embauche',
      description: 'Toutes les techniques pour briller lors de vos entretiens et décrocher le poste.',
      category: 'Entretiens',
      pages: 18,
      downloads: 1890,
      rating: 4.9,
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'Stratégies de Recherche d\'Emploi',
      description: 'Optimisez votre recherche avec des méthodes éprouvées et des outils modernes.',
      category: 'Recherche',
      pages: 32,
      downloads: 1650,
      rating: 4.7,
      image: '/api/placeholder/300/200'
    },
    {
      id: 4,
      title: 'Négocier son Salaire comme un Pro',
      description: 'Les techniques de négociation pour obtenir la rémunération que vous méritez.',
      category: 'Négociation',
      pages: 15,
      downloads: 1420,
      rating: 4.6,
      image: '/api/placeholder/300/200'
    },
    {
      id: 5,
      title: 'Développer son Réseau Professionnel',
      description: 'Comment créer et entretenir un réseau qui boostera votre carrière.',
      category: 'Networking',
      pages: 22,
      downloads: 1280,
      rating: 4.5,
      image: '/api/placeholder/300/200'
    },
    {
      id: 6,
      title: 'Lettre de Motivation Efficace',
      description: 'Rédigez des lettres qui complètent parfaitement votre CV.',
      category: 'CV & Lettres',
      pages: 12,
      downloads: 1890,
      rating: 4.7,
      image: '/api/placeholder/300/200'
    }
  ];

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Image globale pour guides */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 text-white py-20 relative overflow-hidden">
        {/* Background Image pour hero avec contraste élevé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        {/* Overlay pour maintenir le contraste */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/85 via-pink-600/85 to-rose-600/85" />
        
        <div className="container-emeres relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <BookMarked className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Guides Pratiques
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Des guides complets et pratiques pour maîtriser chaque étape de votre parcours professionnel.
            </p>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-purple-200 text-sm">Guides Disponibles</div>
              </div>
              <div>
                <div className="text-3xl font-bold">15K+</div>
                <div className="text-purple-200 text-sm">Téléchargements</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4.7/5</div>
                <div className="text-purple-200 text-sm">Note Moyenne</div>
              </div>
              <div>
                <div className="text-3xl font-bold">Gratuit</div>
                <div className="text-purple-200 text-sm">100% Gratuit</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container-emeres">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <EmeresInput
                placeholder="Rechercher un guide..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-4 w-4 text-gray-400" />}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedCategory === category
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-12">
        <div className="container-emeres">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide) => (
              <EmeresCard key={guide.id} className="overflow-hidden hover-lift group cursor-pointer">
                <div className="relative">
                  <img 
                    src={guide.image} 
                    alt={guide.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {guide.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-medium text-white bg-purple-600 px-2 py-1 rounded-full">
                        Populaire
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      {guide.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-200">
                    {guide.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {guide.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span>{guide.pages} pages</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-blue-400 fill-current mr-1" />
                        {guide.rating}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      {guide.downloads}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <EmeresButton size="sm" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </EmeresButton>
                    <EmeresButton variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </EmeresButton>
                  </div>
                </div>
              </EmeresCard>
            ))}
          </div>
          
          {filteredGuides.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Aucun guide trouvé.</p>
              <EmeresButton 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Tous');
                }}
              >
                Réinitialiser les filtres
              </EmeresButton>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GuidesPage;