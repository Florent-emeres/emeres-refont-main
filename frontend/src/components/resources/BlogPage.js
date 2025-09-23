import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, User, ArrowRight, Search, Filter, TrendingUp } from 'lucide-react';
import EmeresCard from '../ui/EmeresCard';
import EmeresButton from '../ui/EmeresButton';
import EmeresInput from '../ui/EmeresInput';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const categories = ['Tous', 'Carrière', 'Recrutement', 'Formation', 'Tendances', 'Conseils'];

  const articles = [
    {
      id: 1,
      title: 'Les métiers qui recrutent en 2024 : où sont les opportunités ?',
      excerpt: 'Découvrez les secteurs porteurs et les compétences les plus recherchées par les recruteurs cette année...',
      category: 'Tendances',
      author: 'Sophie Martin',
      date: '12 Sep 2024',
      readTime: '5 min',
      image: '/api/placeholder/400/250',
      featured: true
    },
    {
      id: 2,
      title: 'Comment réussir son entretien vidéo : le guide complet',
      excerpt: 'Avec la généralisation du télétravail, les entretiens vidéo sont devenus incontournables. Nos conseils...',
      category: 'Conseils',
      author: 'Marc Dubois',
      date: '10 Sep 2024',
      readTime: '8 min',
      image: '/api/placeholder/400/250'
    },
    {
      id: 3,
      title: 'L\'intelligence artificielle transforme le recrutement',
      excerpt: 'Comment les entreprises utilisent l\'IA pour optimiser leurs processus de recrutement et ce que cela signifie...',
      category: 'Recrutement',
      author: 'Julie Leroy',
      date: '08 Sep 2024',
      readTime: '6 min',
      image: '/api/placeholder/400/250'
    },
    {
      id: 4,
      title: 'Soft skills vs Hard skills : l\'équilibre parfait en 2024',
      excerpt: 'Les compétences techniques ne suffisent plus. Découvrez comment développer vos soft skills...',
      category: 'Formation',
      author: 'Pierre Lambert',
      date: '05 Sep 2024',
      readTime: '7 min',
      image: '/api/placeholder/400/250'
    },
    {
      id: 5,
      title: 'Stage vs Alternance : quel choix pour votre carrière ?',
      excerpt: 'Comparatif détaillé pour vous aider à choisir la voie qui correspond le mieux à vos objectifs...',
      category: 'Carrière',
      author: 'Emma Moreau',
      date: '03 Sep 2024',
      readTime: '10 min',
      image: '/api/placeholder/400/250'
    },
    {
      id: 6,
      title: 'Négocier son salaire de stage : stratégies gagnantes',
      excerpt: 'Oui, il est possible de négocier son salaire de stage ! Voici comment procéder efficacement...',
      category: 'Conseils',
      author: 'Thomas Rousseau',
      date: '01 Sep 2024',
      readTime: '4 min',
      image: '/api/placeholder/400/250'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = articles.find(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Image globale pour blog */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 text-white py-20 relative overflow-hidden">
        {/* Background Image pour hero avec contraste élevé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        {/* Overlay pour maintenir le contraste */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/85 via-cyan-600/85 to-teal-600/85" />
        
        <div className="container-emeres relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <FileText className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Blog ÉMÉRÉS
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Actualités, conseils d'experts et tendances du marché de l'emploi pour booster votre carrière.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container-emeres">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <EmeresInput
                placeholder="Rechercher un article..."
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
                        ? 'bg-blue-600 text-white'
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

      {/* Featured Article */}
      {featuredArticle && selectedCategory === 'Tous' && !searchTerm && (
        <section className="py-12 bg-white">
          <div className="container-emeres">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Article en vedette</span>
              </div>
            </div>
            
            <EmeresCard className="overflow-hidden hover-lift">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={featuredArticle.image} 
                    alt={featuredArticle.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {featuredArticle.category}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {featuredArticle.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      {featuredArticle.author}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {featuredArticle.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-6">
                    {featuredArticle.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{featuredArticle.readTime} de lecture</span>
                    <EmeresButton>
                      Lire l'article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </EmeresButton>
                  </div>
                </div>
              </div>
            </EmeresCard>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-12">
        <div className="container-emeres">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {searchTerm || selectedCategory !== 'Tous' 
                ? `Résultats (${filteredArticles.length})` 
                : 'Derniers Articles'
              }
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <EmeresCard key={article.id} className="overflow-hidden hover-lift group cursor-pointer">
                <div className="relative">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {article.date}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {article.author}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{article.readTime} de lecture</span>
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                      Lire
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </EmeresCard>
            ))}
          </div>
          
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Aucun article trouvé pour votre recherche.</p>
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

export default BlogPage;