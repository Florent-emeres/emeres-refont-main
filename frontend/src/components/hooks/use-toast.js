import { useState, useCallback } from 'react';

// Hook de notification toast simple pour ÉMÉRÉS
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback({
    success: (message) => {
      console.log('✅ SUCCESS:', message);
      // Pour l'instant, utilisation simple avec console.log
      // Peut être étendu avec un système de toast UI plus tard
      
      // Vous pouvez ajouter une notification visuelle ici si besoin
      if (window.alert) {
        // Utilisation temporaire d'alert pour les messages importants
        // À remplacer par un vrai système de toast
      }
    },

    error: (message) => {
      console.error('❌ ERROR:', message);
      // Pour l'instant, utilisation simple avec console.error
      
      // Notification d'erreur visible pour l'utilisateur
      if (window.alert) {
        window.alert(`Erreur: ${message}`);
      }
    },

    info: (message) => {
      console.log('ℹ️ INFO:', message);
    },

    warning: (message) => {
      console.warn('⚠️ WARNING:', message);
    }
  }, []);

  return { toast };
};

export default useToast;