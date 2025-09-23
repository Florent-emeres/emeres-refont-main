// Utilitaires pour la gestion des pages de maintenance

// Fonction pour vérifier si un module est en développement
export const isModuleUnderDevelopment = (moduleName) => {
  const MODULES_UNDER_DEV = process.env.REACT_APP_MODULES_UNDER_DEV === 'true';
  
  // Si le mode développement global est activé, tous les modules sont en développement
  if (MODULES_UNDER_DEV) {
    return true;
  }
  
  // Vérifier des modules spécifiques via des variables d'environnement
  const moduleVar = `REACT_APP_${moduleName.toUpperCase()}_UNDER_DEV`;
  return process.env[moduleVar] === 'true';
};

// Fonction pour obtenir les variables de maintenance
export const getMaintenanceStatus = () => {
  return {
    maintenanceMode: process.env.REACT_APP_MAINTENANCE_MODE === 'true',
    authMaintenance: process.env.REACT_APP_AUTH_MAINTENANCE === 'true',
    modulesUnderDev: process.env.REACT_APP_MODULES_UNDER_DEV === 'true'
  };
};

// Hook React pour vérifier l'état de maintenance
export const useMaintenanceStatus = () => {
  return getMaintenanceStatus();
};

// Fonction pour rediriger vers une page de maintenance spécifique
export const redirectToMaintenance = (type = 'general') => {
  const routes = {
    general: '/maintenance',
    auth: '/auth-maintenance',
    development: '/under-development'
  };
  
  window.location.href = routes[type] || routes.general;
};