import React, { useState } from 'react';
import { Download, Search, Filter, FileText, Image, Archive, Star } from 'lucide-react';
import EmeresCard from '../ui/EmeresCard';
import EmeresButton from '../ui/EmeresButton';
import EmeresInput from '../ui/EmeresInput';
import ProtectedResource from '../ProtectedResource';

const TelechargementPage = () => {
  return (
    <ProtectedResource resourceType="page de téléchargements" resourceTitle="nos ressources téléchargeables">
      <TelechargementContent />
    </ProtectedResource>
  );
};

const TelechargementContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const categories = ['Tous', 'CV Templates', 'Lettres Types', 'Outils Excel', 'Présentations', 'Checklists'];

  const downloads = [
    {
      id: 1,
      title: 'Pack Complet CV Modernes',
      description: '10 templates de CV professionnels au format Word et PowerPoint',
      category: 'CV Templates',
      type: 'ZIP',
      size: '15 MB',
      downloads: 3200,
      rating: 4.9,
      featured: true
    },
    {
      id: 2,
      title: 'Lettres de Motivation Sectorielles',
      description: 'Modèles de lettres adaptés à chaque secteur d\'activité',
      category: 'Lettres Types',
      type: 'PDF',
      size: '2.5 MB',
      downloads: 2800,
      rating: 4.7
    },
    {
      id: 3,
      title: 'Calculateur de Salaire Excel',
      description: 'Outil Excel pour évaluer votre rémunération selon le marché',
      category: 'Outils Excel',
      type: 'XLSX',
      size: '1.2 MB',
      downloads: 1900,
      rating: 4.8
    },
    {
      id: 4,
      title: 'Checklist Entretien d\'Embauche',
      description: 'Liste complète pour préparer parfaitement vos entretiens',
      category: 'Checklists',
      type: 'PDF',
      size: '0.8 MB',
      downloads: 2400,
      rating: 4.6
    },
    {
      id: 5,
      title: 'Présentation Pitch Personnel',
      description: 'Template PowerPoint pour présenter votre profil en entretien',
      category: 'Présentations',
      type: 'PPTX',
      size: '5.2 MB',
      downloads: 1650,
      rating: 4.5
    },
    {
      id: 6,
      title: 'Kit Complet Recherche d\'Emploi',
      description: 'Tous les outils essentiels dans un seul pack',
      category: 'CV Templates',
      type: 'ZIP',
      size: '25 MB',
      downloads: 4100,
      rating: 4.9,
      featured: true
    }
  ];

  const filteredDownloads = downloads.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
      case 'XLSX': return <FileText className="w-5 h-5 text-green-500" />;
      case 'PPTX': return <Image className="w-5 h-5 text-orange-500" />;
      case 'ZIP': return <Archive className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Image globale pour téléchargements */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20 relative overflow-hidden">
        {/* Background Image pour hero avec contraste élevé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        {/* Overlay pour maintenir le contraste */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/85 via-purple-600/85 to-pink-600/85" />
        
        <div className="container-emeres relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Download className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Téléchargements
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Templates, outils et documents prêts à utiliser pour optimiser votre recherche d'emploi.
            </p>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">75+</div>
                <div className="text-indigo-200 text-sm">Fichiers Disponibles</div>
              </div>
              <div>
                <div className="text-3xl font-bold">25K+</div>
                <div className="text-indigo-200 text-sm">Téléchargements</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4.7/5</div>
                <div className="text-indigo-200 text-sm">Note Moyenne</div>
              </div>
              <div>
                <div className="text-3xl font-bold">100%</div>
                <div className="text-indigo-200 text-sm">Gratuit</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b relative z-10">
        <div className="container-emeres">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <EmeresInput
                placeholder="Rechercher un fichier..."
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
                        ? 'bg-indigo-600 text-white'
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

      {/* Downloads Grid */}
      <section className="py-12 relative z-10">
        <div className="container-emeres">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDownloads.map((item) => (
              <EmeresCard key={item.id} className="p-6 hover-lift group cursor-pointer overflow-hidden relative">
                {/* Image de fond pour téléchargements */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 group-hover:opacity-8 transition-opacity duration-300"
                  style={{
                    backgroundImage: item.type === 'PDF' ?
                      `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')` :
                      item.type === 'XLSX' ?
                      `url('https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')` :
                      item.type === 'PPTX' ?
                      `url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')` :
                      `url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`
                  }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(item.type)}
                      <div>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {item.type}
                        </span>
                      </div>
                    </div>
                    {item.featured && (
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                        Populaire
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{item.category}</span>
                    <span>{item.size}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-blue-400 fill-current mr-1" />
                      {item.rating}
                    </div>
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      {item.downloads}
                    </div>
                  </div>
                  
                  <EmeresButton size="sm" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </EmeresButton>
                </div>
              </EmeresCard>
            ))}
          </div>
          
          {filteredDownloads.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Aucun fichier trouvé.</p>
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

export default TelechargementPage;