import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

const CreditsNotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fonction globale pour afficher les notifications crédits
    window.showCreditsNotification = (notification) => {
      const id = Date.now() + Math.random();
      const newNotification = {
        id,
        ...notification,
        timestamp: Date.now()
      };
      
      setNotifications(prev => [...prev, newNotification]);
      
      // Auto-remove après la durée spécifiée
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, notification.duration || 4000);
    };

    return () => {
      delete window.showCreditsNotification;
    };
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return TrendingUp;
      case 'info': return Coins;
      case 'warning': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success': 
        return 'bg-green-500 border-green-600 text-white';
      case 'info': 
        return 'bg-blue-500 border-blue-600 text-white';
      case 'warning': 
        return 'bg-blue-500 border-amber-600 text-white';
      default: 
        return 'bg-teal-500 border-teal-600 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        const IconComponent = getIcon(notification.type);
        
        return (
          <div
            key={notification.id}
            className={`
              max-w-sm p-4 rounded-lg shadow-lg border-l-4 
              transform transition-all duration-300 ease-in-out
              animate-slide-in-right
              ${getColors(notification.type)}
            `}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <IconComponent className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">
                  {notification.title}
                </div>
                <div className="text-sm opacity-90 mt-1">
                  {notification.message}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreditsNotificationSystem;