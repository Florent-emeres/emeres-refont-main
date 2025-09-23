import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search, MessageCircle } from 'lucide-react';
import EmeresCard from '../ui/EmeresCard';
import EmeresInput from '../ui/EmeresInput';
import EmeresButton from '../ui/EmeresButton';

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [openFAQ, setOpenFAQ] = useState(null);

  const categories = ['Tous', 'Compte', 'Candidatures', 'Entreprises', 'Technique', 'Facturation'];

  const faqs = [
    {
      id: 1,
      category: 'Compte',
      question: 'Comment créer mon profil étudiant ?',
      answer: 'Pour créer votre profil, cliquez sur "S\'inscrire" puis sélectionnez "Étudiant". Remplissez vos informations personnelles, formations et compétences. Plus votre profil est complet, meilleures sont vos chances de matching !'
    },
    {
      id: 2,
      category: 'Candidatures',
      question: 'Comment postuler à une offre de stage ?',
      answer: 'Parcourez les offres dans votre dashboard, cliquez sur celles qui vous intéressent et utilisez le bouton "Postuler". Vous pouvez personnaliser votre candidature avec nos outils IA intégrés.'
    },
    {
      id: 3,
      category: 'Technique',
      question: 'Pourquoi mon CV ne se télécharge pas ?',
      answer: 'Vérifiez que votre fichier fait moins de 5MB et est au format PDF, DOC ou DOCX. Si le problème persiste, videz votre cache navigateur ou contactez notre support.'
    },
    {
      id: 4,
      category: 'Entreprises',
      question: 'Comment publier une offre de stage ?',
      answer: 'Connectez-vous à votre espace entreprise, allez dans "Mes Offres" puis "Nouvelle Offre". Complétez tous les champs requis et notre équipe validera votre annonce sous 24h.'
    },
    {
      id: 5,
      category: 'Candidatures',
      question: 'Comment suivre mes candidatures ?',
      answer: 'Dans votre dashboard, la section "Mes Candidatures" affiche le statut de toutes vos postulations : en attente, vue par l\'entreprise, entretien programmé, acceptée ou refusée.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Image globale pour FAQ */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-teal-600 to-cyan-600 text-white py-20 relative overflow-hidden">
        {/* Background Image pour hero avec contraste élevé */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        {/* Overlay pour maintenir le contraste */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/85 via-teal-600/85 to-cyan-600/85" />
        
        <div className="container-emeres relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <HelpCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Questions Fréquentes
            </h1>
            
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Trouvez rapidement les réponses à vos questions les plus courantes.
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
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-4 w-4 text-gray-400" />}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12">
        <div className="container-emeres max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <EmeresCard key={faq.id} className="overflow-hidden">
                <button
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      openFAQ === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openFAQ === faq.id && (
                  <div className="px-6 pb-6 text-gray-600 animate-scale-in">
                    <div className="border-t pt-4">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </EmeresCard>
            ))}
          </div>
          
          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Aucune question trouvée.</p>
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

      {/* Contact Support */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="container-emeres text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Notre équipe support est là pour vous aider 24h/24, 7j/7.
          </p>
          <EmeresButton size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-4">
            <MessageCircle className="mr-2 h-5 w-5" />
            Contacter le Support
          </EmeresButton>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;