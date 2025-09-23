/**
 * Modal pour créer une nouvelle conversation
 * Sélection contexte + participants + titre personnalisé
 */

import React, { useState, useCallback } from 'react';
import { 
  X, 
  Plus, 
  Building, 
  User, 
  GraduationCap, 
  Users, 
  HeadphonesIcon,
  Briefcase,
  Search,
  Check
} from 'lucide-react';
import EmeresButton from '../ui/EmeresButton';
import EmeresInput from '../ui/EmeresInput';
import EmeresBadge from '../ui/EmeresBadge';
import { ThreadContext } from '../../types/messaging';
import { cn } from '../../lib/utils';

const contextConfig = {
  candidature: { 
    label: 'Candidature', 
    icon: Building, 
    color: 'bg-purple-100 text-purple-600',
    description: 'Discussion avec une entreprise pour un poste/stage'
  },
  mentorat: { 
    label: 'Mentorat', 
    icon: User, 
    color: 'bg-emerald-100 text-emerald-600',
    description: 'Échange avec votre mentor ou mentoré'
  },
  scolaire: { 
    label: 'École', 
    icon: GraduationCap, 
    color: 'bg-blue-100 text-blue-600',
    description: 'Communication avec votre établissement'
  },
  partenariat: { 
    label: 'Partenariat', 
    icon: Users, 
    color: 'bg-orange-100 text-orange-600',
    description: 'Collaboration institutionnelle'
  },
  stage: { 
    label: 'Stage', 
    icon: Briefcase, 
    color: 'bg-indigo-100 text-indigo-600',
    description: 'Suivi de stage multi-acteurs'
  },
  support: { 
    label: 'Support', 
    icon: HeadphonesIcon, 
    color: 'bg-red-100 text-red-600',
    description: 'Aide technique ou assistance'
  }
};

const NewConversationModal = ({ 
  isOpen, 
  onClose, 
  onCreateConversation,
  userRole = 'student',
  availableUsers = [],
  loading = false 
}) => {
  const [selectedContext, setSelectedContext] = useState('');
  const [title, setTitle] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [searchUsers, setSearchUsers] = useState('');
  const [step, setStep] = useState(1); // 1: context, 2: participants, 3: détails

  // Contextes disponibles selon le rôle
  const getAvailableContexts = () => {
    const contextsByRole = {
      student: ['candidature', 'mentorat', 'scolaire', 'support'],
      mentor: ['mentorat', 'support'],
      company: ['candidature', 'partenariat', 'stage', 'support'],
      school: ['scolaire', 'partenariat', 'stage', 'support'],
      institution: ['scolaire', 'partenariat', 'support']
    };
    
    return contextsByRole[userRole] || ['support'];
  };

  // Reset du modal
  const resetModal = useCallback(() => {
    setSelectedContext('');
    setTitle('');
    setSelectedParticipants([]);
    setSearchUsers('');
    setStep(1);
  }, []);

  // Fermeture avec reset
  const handleClose = useCallback(() => {
    resetModal();
    onClose();
  }, [resetModal, onClose]);

  // Sélection contexte
  const handleContextSelect = (context) => {
    setSelectedContext(context);
    setStep(2);
  };

  // Toggle participant
  const toggleParticipant = (user) => {
    setSelectedParticipants(prev => {
      const isSelected = prev.find(p => p.userId === user.userId);
      if (isSelected) {
        return prev.filter(p => p.userId !== user.userId);
      } else {
        return [...prev, user];
      }
    });
  };

  // Création de la conversation
  const handleCreate = async () => {
    if (!selectedContext || selectedParticipants.length === 0) return;

    const conversationData = {
      contextType: selectedContext,
      contextId: `manual-${Date.now()}`,
      title: title.trim() || `${contextConfig[selectedContext].label} - ${new Date().toLocaleDateString()}`,
      participants: selectedParticipants,
      priority: 'normal'
    };

    try {
      await onCreateConversation(conversationData);
      handleClose();
    } catch (error) {
      console.error('Erreur création conversation:', error);
      // L'erreur sera gérée par le composant parent
    }
  };

  // Utilisateurs filtrés
  const filteredUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchUsers.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Nouvelle conversation
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Étape 1: Sélection du contexte */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Choisissez le type de conversation
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Sélectionnez le contexte qui correspond le mieux à votre besoin
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getAvailableContexts().map((context) => {
                  const config = contextConfig[context];
                  const Icon = config.icon;

                  return (
                    <button
                      key={context}
                      onClick={() => handleContextSelect(context)}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("p-2 rounded-lg", config.color)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-teal-900">
                            {config.label}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {config.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Étape 2: Sélection des participants */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => setStep(1)}
                    className="text-teal-600 hover:text-teal-700"
                  >
                    ← Retour
                  </button>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ajouter des participants
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <EmeresBadge variant="secondary" className={contextConfig[selectedContext].color}>
                    {contextConfig[selectedContext].label}
                  </EmeresBadge>
                </div>
              </div>

              {/* Recherche participants */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <EmeresInput
                  placeholder="Rechercher par nom ou email..."
                  value={searchUsers}
                  onChange={(e) => setSearchUsers(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Participants sélectionnés */}
              {selectedParticipants.length > 0 && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Participants sélectionnés ({selectedParticipants.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedParticipants.map((participant) => (
                      <div
                        key={participant.userId}
                        className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border"
                      >
                        <span className="text-sm">{participant.name}</span>
                        <button
                          onClick={() => toggleParticipant(participant)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Liste des utilisateurs */}
              <div className="border rounded-lg max-h-64 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Aucun utilisateur trouvé
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => {
                      const isSelected = selectedParticipants.find(p => p.userId === user.userId);
                      
                      return (
                        <button
                          key={user.userId}
                          onClick={() => toggleParticipant(user)}
                          className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 text-left"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.role}</div>
                            {user.email && (
                              <div className="text-xs text-gray-500">{user.email}</div>
                            )}
                          </div>
                          
                          {isSelected && (
                            <Check className="h-5 w-5 text-teal-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Titre personnalisé */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de la conversation (optionnel)
                </label>
                <EmeresInput
                  placeholder={`${contextConfig[selectedContext].label} - ${new Date().toLocaleDateString()}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {step === 1 && "Étape 1/2 : Sélectionnez le contexte"}
            {step === 2 && `Étape 2/2 : ${selectedParticipants.length} participant(s) sélectionné(s)`}
          </div>

          <div className="flex items-center gap-3">
            <EmeresButton variant="outline" onClick={handleClose}>
              Annuler
            </EmeresButton>
            
            {step === 2 && (
              <EmeresButton
                variant="primary"
                onClick={handleCreate}
                disabled={selectedParticipants.length === 0 || loading}
              >
                {loading ? 'Création...' : 'Créer la conversation'}
              </EmeresButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewConversationModal;