import { useState, useEffect, useCallback } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// VAPID public key - should be stored in environment variables
const VAPID_PUBLIC_KEY = process.env.REACT_APP_VAPID_PUBLIC_KEY || 'BP5v4eTJCPhxPATd7XUvEm9Q2qKrAd1i0FrNn5UT6g7b3r_8pE9v1T2WKR4N9Hq1xC';

const useNotifications = (user) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [permission, setPermission] = useState('default');
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Check notification support
  useEffect(() => {
    const checkSupport = () => {
      const isNotificationSupported = 'Notification' in window;
      const isServiceWorkerSupported = 'serviceWorker' in navigator;
      const isPushSupported = 'PushManager' in window;
      
      const supported = isNotificationSupported && isServiceWorkerSupported && isPushSupported;
      setIsSupported(supported);
      
      if (supported) {
        setPermission(Notification.permission);
      }
    };
    
    checkSupport();
  }, []);

  // Initialize service worker
  useEffect(() => {
    if (!isSupported) return;

    const initServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker enregistré:', registration);
        
        // Check for existing subscription
        const existingSubscription = await registration.pushManager.getSubscription();
        setSubscription(existingSubscription);
        setIsSubscribed(!!existingSubscription);
        
      } catch (error) {
        console.error('❌ Erreur Service Worker:', error);
        setError('Impossible d\'initialiser les notifications push');
      }
    };

    initServiceWorker();
  }, [isSupported]);

  // Load notifications from API
  const loadNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (error) {
      console.error('❌ Erreur chargement notifications:', error);
    }
  }, [user]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      setError('Les notifications ne sont pas supportées');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        return true;
      } else {
        setError('Permission refusée pour les notifications');
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur demande permission:', error);
      setError('Impossible de demander la permission');
      return false;
    }
  }, [isSupported]);

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!isSupported || permission !== 'granted') {
      const hasPermission = await requestPermission();
      if (!hasPermission) return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Convert VAPID key
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });

      setSubscription(pushSubscription);
      setIsSubscribed(true);

      // Send subscription to server
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subscription: pushSubscription.toJSON(),
          user_id: user?.id
        })
      });

      if (!response.ok) {
        throw new Error('Impossible d\'enregistrer l\'abonnement');
      }

      console.log('✅ Abonnement push notifications créé');
      return true;
      
    } catch (error) {
      console.error('❌ Erreur abonnement push:', error);
      setError('Impossible de s\'abonner aux notifications push');
      return false;
    }
  }, [isSupported, permission, user, requestPermission]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        
        // Remove subscription from server
        const token = localStorage.getItem('token');
        await fetch(`${API}/notifications/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            user_id: user?.id
          })
        });
      }
      
      setSubscription(null);
      setIsSubscribed(false);
      console.log('✅ Désabonnement push notifications');
      return true;
      
    } catch (error) {
      console.error('❌ Erreur désabonnement push:', error);
      setError('Impossible de se désabonner');
      return false;
    }
  }, [subscription, user]);

  // Send test notification
  const sendTestNotification = useCallback(async () => {
    if (!isSubscribed) return false;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/notifications/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user?.id,
          title: 'Test ÉMÉRÉS',
          message: 'Notification push fonctionnelle ! 🎉'
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('❌ Erreur test notification:', error);
      return false;
    }
  }, [isSubscribed, user]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: true }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('❌ Erreur marquer comme lu:', error);
    }
  }, []);

  // Show browser notification (fallback)
  const showBrowserNotification = useCallback((title, options = {}) => {
    if (permission === 'granted') {
      new Notification(title, {
        icon: '/emeres-logo.png',
        badge: '/emeres-logo.png',
        ...options
      });
    }
  }, [permission]);

  // Load notifications on user change
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    isSupported,
    isSubscribed,
    permission,
    error,
    notifications,
    unreadCount,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
    markAsRead,
    showBrowserNotification,
    loadNotifications
  };
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default useNotifications;