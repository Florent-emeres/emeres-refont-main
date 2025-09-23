import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import creditsService from '../services/creditsService';

const CreditsWidget = ({ size = 'normal', showActions = true }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalance();
    
    // S'abonner aux changements de crédits
    const handleCreditsChange = (data) => {
      if (data.type === 'balance_updated') {
        setBalance(data.balance);
      } else if (data.type === 'points_awarded' || data.type === 'credits_spent') {
        // Recharger le solde après attribution ou dépense
        loadBalance();
      }
    };

    creditsService.addListener(handleCreditsChange);

    return () => {
      creditsService.removeListener(handleCreditsChange);
    };
  }, []);

  const loadBalance = async () => {
    setLoading(true);
    const userBalance = await creditsService.getUserBalance();
    setBalance(userBalance);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${
        size === 'compact' ? 'p-3' : 'p-4'
      }`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!balance) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${
        size === 'compact' ? 'p-3' : 'p-4'
      }`}>
        <div className="text-center text-gray-500 text-sm">
          Crédits non disponibles
        </div>
      </div>
    );
  }

  const nextCredits = Math.floor(balance.points_balance / 5);
  const pointsToNextCredit = 5 - (balance.points_balance % 5);

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg shadow-sm border border-blue-200 ${
      size === 'compact' ? 'p-2' : 'p-3'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Coins className="h-3 w-3 text-white" />
          </div>
          <div className={`font-semibold text-gray-900 ${
            size === 'compact' ? 'text-xs' : 'text-sm'
          }`}>
            Mes Crédits
          </div>
        </div>
        {showActions && (
          <button
            onClick={() => window.location.href = '/credits'}
            className="text-orange-600 hover:text-orange-700 transition-colors"
          >
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Soldes */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-white rounded-md p-2 text-center">
          <div className={`font-bold text-gray-900 ${
            size === 'compact' ? 'text-sm' : 'text-base'
          }`}>
            {balance.points_balance}
          </div>
          <div className="text-xs text-gray-600">Points</div>
        </div>
        
        <div className="bg-white rounded-md p-2 text-center">
          <div className={`font-bold text-orange-600 ${
            size === 'compact' ? 'text-sm' : 'text-base'
          }`}>
            {balance.credits_balance_euros?.toFixed(1) || '0.0'}€
          </div>
          <div className="text-xs text-gray-600">Crédits</div>
        </div>
      </div>

      {/* Progression vers le prochain crédit */}
      {balance.points_balance > 0 && balance.points_balance < 50 && (
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Prochain crédit</span>
            <span className="text-xs text-orange-600 font-medium">
              +{pointsToNextCredit} pts
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((balance.points_balance % 5) / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      {showActions && size !== 'compact' && (
        <div className="flex space-x-2 mb-2">
          <button
            onClick={() => window.location.href = '/credits'}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 text-xs py-1.5 px-2 rounded-md transition-colors flex items-center justify-center space-x-1"
          >
            <TrendingUp className="h-3 w-3" />
            <span>Gagner</span>
          </button>
          <button
            onClick={() => window.location.href = '/premium'}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs py-1.5 px-2 rounded-md transition-colors flex items-center justify-center space-x-1"
          >
            <Zap className="h-3 w-3" />
            <span>Utiliser</span>
          </button>
        </div>
      )}

      {/* Statistiques compactes */}
      {size !== 'compact' && (
        <div className="pt-2 border-t border-blue-200">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Total: {balance.total_points_earned}</span>
            <span>Dépensé: {(balance.total_credits_spent / 100)?.toFixed(1) || '0.0'}€</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditsWidget;