import React, { useState, useEffect } from 'react';
import EmeresButton from '../ui/EmeresButton';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import { 
  BookOpen, 
  RotateCcw, 
  Check, 
  X, 
  Plus,
  TrendingUp,
  Brain,
  Timer,
  Target,
  Eye,
  Edit,
  Trash2,
  Star,
  Calendar
} from 'lucide-react';

const CartesMemoires = ({ user }) => {
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState('review'); // 'review', 'learn', 'test'

  const decks = [
    {
      id: 'javascript-basics',
      title: 'JavaScript Fundamentals',
      description: 'Concepts de base en JavaScript',
      cards: 45,
      dueCards: 12,
      newCards: 8,
      category: 'Programmation',
      difficulty: 'Intermédiaire',
      lastStudied: '2024-01-15',
      retention: 87,
      color: 'yellow'
    },
    {
      id: 'histoire-france',
      title: 'Histoire de France',
      description: 'Dates et événements clés',
      cards: 120,
      dueCards: 25,
      newCards: 15,
      category: 'Histoire',
      difficulty: 'Avancé',
      lastStudied: '2024-01-14',
      retention: 92,
      color: 'blue'
    },
    {
      id: 'anglais-vocabulaire',
      title: 'Vocabulaire Anglais TOEIC',
      description: 'Mots essentiels pour le TOEIC',
      cards: 200,
      dueCards: 5,
      newCards: 20,
      category: 'Langues',
      difficulty: 'Débutant',
      lastStudied: '2024-01-16',
      retention: 78,
      color: 'green'
    }
  ];

  const sampleCards = [
    {
      id: 1,
      question: "Qu'est-ce qu'une closure en JavaScript ?",
      answer: "Une closure est une fonction qui a accès à des variables de sa portée externe même après que la fonction externe ait terminé son exécution. C'est un concept fondamental qui permet l'encapsulation et la création de fonctions factory.",
      difficulty: 'hard',
      nextReview: '2024-01-17',
      interval: 7,
      ease: 2.1
    },
    {
      id: 2,
      question: "Quelle est la différence entre let, const et var ?",
      answer: "- var: portée de fonction, hissée, peut être redéclarée\n- let: portée de bloc, non hissée, peut être réassignée\n- const: portée de bloc, non hissée, ne peut pas être réassignée",
      difficulty: 'medium',
      nextReview: '2024-01-18',
      interval: 3,
      ease: 2.5
    }
  ];

  const selectDeck = (deck) => {
    setSelectedDeck(deck);
    setCurrentCard(sampleCards[0]);
    setShowAnswer(false);
  };

  const flipCard = () => {
    setShowAnswer(!showAnswer);
  };

  const answerCard = (difficulty) => {
    // Simuler l'algorithme de spaced repetition
    console.log(`Carte répondue avec difficulté: ${difficulty}`);
    
    // Passer à la carte suivante
    const currentIndex = sampleCards.findIndex(card => card.id === currentCard.id);
    const nextIndex = (currentIndex + 1) % sampleCards.length;
    setCurrentCard(sampleCards[nextIndex]);
    setShowAnswer(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-700';
      case 'Intermédiaire': return 'bg-blue-100 text-amber-700';
      case 'Avancé': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRetentionColor = (retention) => {
    if (retention >= 90) return 'text-green-600';
    if (retention >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Image globale pour cartes mémoires */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-8"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1677442135703-1787eea5ce01?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHw0fHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzU4NDM1NjE0fDA&ixlib=rb-4.1.0&q=85')`
        }}
      />
      {/* Overlay pour maintenir le contraste */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/90 via-purple-50/90 to-pink-50/90" />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cartes Mémoires Pro</h1>
              <p className="text-gray-600">Système de révision par cartes mémoire avec répétition espacée</p>
            </div>
            <EmeresBadge variant="primary" className="ml-auto">
              <Star className="w-4 h-4 mr-1" />
              Premium
            </EmeresBadge>
          </div>
        </div>

        {!selectedDeck ? (
          // Vue des decks disponibles
          <div className="space-y-6">
            
            {/* Statistiques générales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <EmeresCard>
                <EmeresCardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">365</div>
                  <div className="text-sm text-gray-600">Cartes totales</div>
                </EmeresCardContent>
              </EmeresCard>
              
              <EmeresCard>
                <EmeresCardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">42</div>
                  <div className="text-sm text-gray-600">À réviser</div>
                </EmeresCardContent>
              </EmeresCard>
              
              <EmeresCard>
                <EmeresCardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">85%</div>
                  <div className="text-sm text-gray-600">Rétention moyenne</div>
                </EmeresCardContent>
              </EmeresCard>
              
              <EmeresCard>
                <EmeresCardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">12j</div>
                  <div className="text-sm text-gray-600">Streak actuel</div>
                </EmeresCardContent>
              </EmeresCard>
            </div>

            {/* Liste des decks */}
            <EmeresCard className="overflow-hidden relative">
              {/* Image de fond pour la liste des decks */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxkaWdpdGFsJTIwbGVhcm5pbmd8ZW58MHx8fHwxNzU4NDU5MDYwfDA&ixlib=rb-4.1.0&q=85')`
                }}
              />
              
              <EmeresCardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <EmeresCardTitle>Mes Paquets de Cartes</EmeresCardTitle>
                    <EmeresCardDescription>
                      Sélectionnez un paquet pour commencer l'étude
                    </EmeresCardDescription>
                  </div>
                  <EmeresButton variant="primary" icon={<Plus />}>
                    Nouveau Paquet
                  </EmeresButton>
                </div>
              </EmeresCardHeader>
              <EmeresCardContent className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {decks.map((deck) => (
                    <div 
                      key={deck.id}
                      className="p-4 border rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer hover:border-indigo-300 overflow-hidden relative group"
                      onClick={() => selectDeck(deck)}
                    >
                      {/* Mini background pour chaque deck */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 group-hover:opacity-8 transition-opacity duration-300"
                        style={{
                          backgroundImage: deck.color === 'yellow' ?
                            `url('https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzU4NDM1NjE0fDA&ixlib=rb-4.1.0&q=85')` :
                            deck.color === 'blue' ?
                            `url('https://images.unsplash.com/photo-1716436329475-4c55d05383bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwzfHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzU4NDM1NjE0fDA&ixlib=rb-4.1.0&q=85')` :
                            `url('https://images.unsplash.com/photo-1568992687947-868a62a9f521?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxjb2xsYWJvcmF0aXZlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc1ODQ1OTA0OXww&ixlib=rb-4.1.0&q=85')`
                        }}
                      />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{deck.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{deck.description}</p>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <EmeresBadge size="sm" variant="secondary">
                                {deck.category}
                              </EmeresBadge>
                              <EmeresBadge size="sm" className={getDifficultyColor(deck.difficulty)}>
                                {deck.difficulty}
                              </EmeresBadge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total: {deck.cards} cartes</span>
                            <span className={`font-medium ${getRetentionColor(deck.retention)}`}>
                              {deck.retention}% rétention
                            </span>
                          </div>
                          
                          <div className="flex gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span>{deck.dueCards} à réviser</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>{deck.newCards} nouvelles</span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Dernière étude: {new Date(deck.lastStudied).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </EmeresCardContent>
            </EmeresCard>
          </div>
        ) : (
          // Vue d'étude des cartes
          <div className="space-y-6">
            
            {/* Header de session */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <EmeresButton 
                  variant="ghost" 
                  onClick={() => setSelectedDeck(null)}
                  icon={<RotateCcw />}
                >
                  Retour aux paquets
                </EmeresButton>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedDeck.title}</h2>
                  <p className="text-sm text-gray-600">
                    Carte {sampleCards.indexOf(currentCard) + 1} sur {sampleCards.length}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <EmeresBadge variant="secondary">
                  {selectedDeck.dueCards} restantes
                </EmeresBadge>
                <div className="flex gap-1">
                  <EmeresButton variant="outline" size="sm" icon={<Target />}>
                    Mode Test
                  </EmeresButton>
                  <EmeresButton variant="outline" size="sm" icon={<Eye />}>
                    Statistiques
                  </EmeresButton>
                </div>
              </div>
            </div>

            {/* Carte principale */}
            <div className="max-w-4xl mx-auto">
              <EmeresCard className="min-h-96 overflow-hidden relative">
                {/* Image de fond pour la carte d'étude */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxkaWdpdGFsJTIwbGVhcm5pbmd8ZW58MHx8fHwxNzU4NDU5MDYwfDA&ixlib=rb-4.1.0&q=85')`
                  }}
                />
                
                <EmeresCardContent className="p-8 relative z-10">
                  <div className="text-center">
                    
                    {/* Face de la carte */}
                    <div className="mb-8">
                      {!showAnswer ? (
                        <div>
                          <div className="text-sm text-gray-500 mb-4">Question</div>
                          <div className="text-xl text-gray-900 mb-6 leading-relaxed">
                            {currentCard?.question}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm text-gray-500 mb-4">Réponse</div>
                          <div className="text-lg text-gray-900 mb-6 leading-relaxed whitespace-pre-line text-left bg-gray-50 p-4 rounded-lg">
                            {currentCard?.answer}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    {!showAnswer ? (
                      <EmeresButton 
                        onClick={flipCard}
                        size="lg"
                        className="px-8"
                      >
                        Révéler la réponse
                      </EmeresButton>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600 mb-4">
                          Comment avez-vous trouvé cette carte ?
                        </div>
                        
                        <div className="flex justify-center gap-4">
                          <EmeresButton 
                            variant="destructive"
                            onClick={() => answerCard('hard')}
                            className="flex-1 max-w-32"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Difficile
                          </EmeresButton>
                          
                          <EmeresButton 
                            variant="outline"
                            onClick={() => answerCard('medium')}
                            className="flex-1 max-w-32"
                          >
                            <Timer className="w-4 h-4 mr-2" />
                            Moyen
                          </EmeresButton>
                          
                          <EmeresButton 
                            variant="primary"
                            onClick={() => answerCard('easy')}
                            className="flex-1 max-w-32"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Facile
                          </EmeresButton>
                        </div>
                        
                        <div className="text-xs text-gray-500 mt-4">
                          Prochaine révision: {new Date(currentCard?.nextReview).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    )}
                  </div>
                </EmeresCardContent>
              </EmeresCard>
            </div>

            {/* Statistiques de session */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <EmeresCard>
                <EmeresCardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-green-600 mb-1">8</div>
                  <div className="text-sm text-gray-600">Cartes réussies</div>
                </EmeresCardContent>
              </EmeresCard>
              
              <EmeresCard>
                <EmeresCardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-orange-600 mb-1">3</div>
                  <div className="text-sm text-gray-600">Cartes moyennes</div>
                </EmeresCardContent>
              </EmeresCard>
              
              <EmeresCard>
                <EmeresCardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-red-600 mb-1">1</div>
                  <div className="text-sm text-gray-600">Cartes difficiles</div>
                </EmeresCardContent>
              </EmeresCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartesMemoires;