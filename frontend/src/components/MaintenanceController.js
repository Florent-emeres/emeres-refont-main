import React from 'react';
import { useMaintenanceStatus, redirectToMaintenance } from '../utils/maintenanceUtils';

/**
 * Composant pour contrôler et afficher l'état de maintenance
 * Peut être utilisé dans les dashboards admin pour gérer les maintenances
 */
const MaintenanceController = ({ onStatusChange }) => {
  const { maintenanceMode, authMaintenance, modulesUnderDev } = useMaintenanceStatus();

  const handleRedirectTest = (type) => {
    redirectToMaintenance(type);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
        <span>🛠️</span>
        <span>Contrôle des Pages de Maintenance</span>
      </h3>
      
      {/* État actuel */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">État actuel :</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${maintenanceMode ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span className="text-gray-700">Maintenance générale : </span>
            <span className={`font-semibold ${maintenanceMode ? 'text-red-600' : 'text-green-600'}`}>
              {maintenanceMode ? 'ACTIVÉE' : 'Désactivée'}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${authMaintenance ? 'bg-orange-500' : 'bg-green-500'}`}></div>
            <span className="text-gray-700">Maintenance auth : </span>
            <span className={`font-semibold ${authMaintenance ? 'text-orange-600' : 'text-green-600'}`}>
              {authMaintenance ? 'ACTIVÉE' : 'Désactivée'}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${modulesUnderDev ? 'bg-blue-500' : 'bg-green-500'}`}></div>
            <span className="text-gray-700">Modules en développement : </span>
            <span className={`font-semibold ${modulesUnderDev ? 'text-blue-600' : 'text-green-600'}`}>
              {modulesUnderDev ? 'ACTIVÉ' : 'Désactivé'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions de test */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">Tester les pages :</h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleRedirectTest('general')}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <span>🚨</span>
            <span>Maintenance générale</span>
          </button>
          
          <button
            onClick={() => handleRedirectTest('auth')}
            className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <span>🔒</span>
            <span>Maintenance auth</span>
          </button>
          
          <button
            onClick={() => handleRedirectTest('development')}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <span>🚀</span>
            <span>Module développement</span>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">💡 Instructions :</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Modifiez les variables dans <code className="bg-gray-200 px-1 rounded">.env</code> pour activer/désactiver</li>
          <li>• Redémarrez le frontend après modification : <code className="bg-gray-200 px-1 rounded">sudo supervisorctl restart frontend</code></li>
          <li>• Les boutons ci-dessus permettent de tester les pages sans activer les modes</li>
        </ul>
      </div>
    </div>
  );
};

export default MaintenanceController;