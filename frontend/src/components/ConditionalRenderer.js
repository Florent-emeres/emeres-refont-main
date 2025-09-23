import React from 'react';
import { isModuleUnderDevelopment } from '../utils/maintenanceUtils';
import UnderDevelopmentPage from './UnderDevelopmentPage';

/**
 * Composant pour gérer l'affichage conditionnel des modules
 * Utilise les variables d'environnement pour décider d'afficher le module ou la page de développement
 */
const ConditionalRenderer = ({ 
  moduleName, 
  children, 
  fallbackComponent = UnderDevelopmentPage,
  showDevMessage = true 
}) => {
  
  // Vérifier si le module est en développement
  const underDevelopment = isModuleUnderDevelopment(moduleName);
  
  if (underDevelopment) {
    // Si on a un composant de fallback personnalisé
    if (fallbackComponent && fallbackComponent !== UnderDevelopmentPage) {
      const FallbackComponent = fallbackComponent;
      return <FallbackComponent />;
    }
    
    // Sinon, afficher la page de développement standard
    return <UnderDevelopmentPage />;
  }
  
  // Le module n'est pas en développement, afficher le contenu normal
  return (
    <div>
      {showDevMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-green-700 text-sm">
            ✅ Module <strong>{moduleName}</strong> disponible
          </p>
        </div>
      )}
      {children}
    </div>
  );
};

/**
 * Exemple d'utilisation :
 * 
 * <ConditionalRenderer moduleName="calendar">
 *   <CalendarComponent />
 * </ConditionalRenderer>
 * 
 * Ou avec un message personnalisé :
 * 
 * <ConditionalRenderer 
 *   moduleName="messaging" 
 *   showDevMessage={false}
 *   fallbackComponent={CustomMaintenancePage}
 * >
 *   <MessagingHub />
 * </ConditionalRenderer>
 */

export default ConditionalRenderer;