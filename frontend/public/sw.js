// ÉMÉRÉS Service Worker pour Push Notifications
const CACHE_NAME = 'emeres-notifications-v1';

// Install event
self.addEventListener('install', event => {
  console.log('📱 ÉMÉRÉS Service Worker installé');
  self.skipWaiting();
});

// Activate event  
self.addEventListener('activate', event => {
  console.log('📱 ÉMÉRÉS Service Worker activé');
  event.waitUntil(self.clients.claim());
});

// Push event - Handle incoming push notifications
self.addEventListener('push', event => {
  console.log('📱 Push notification reçue:', event);
  
  let notificationData = {
    title: 'ÉMÉRÉS',
    body: 'Nouvelle notification',
    icon: '/emeres-logo.png',
    badge: '/emeres-logo.png',
    tag: 'emeres-notification',
    data: {
      url: '/'
    }
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = {
        title: payload.title || 'ÉMÉRÉS',
        body: payload.body || 'Nouvelle notification',
        icon: payload.icon || '/emeres-logo.png',
        badge: '/emeres-logo.png',
        tag: payload.tag || 'emeres-notification',
        data: {
          url: payload.url || '/',
          notificationId: payload.notificationId,
          userId: payload.userId,
          type: payload.type
        },
        actions: payload.actions || [
          {
            action: 'view',
            title: 'Voir',
            icon: '/emeres-logo.png'
          },
          {
            action: 'dismiss', 
            title: 'Ignorer'
          }
        ]
      };
    } catch (error) {
      console.error('❌ Erreur parsing notification payload:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: notificationData.actions,
      requireInteraction: false,
      vibrate: [200, 100, 200],
      sound: 'default'
    })
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  console.log('📱 Notification cliquée:', event);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  const action = event.action;
  
  if (action === 'dismiss') {
    return;
  }
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      // Si une fenêtre ÉMÉRÉS est déjà ouverte
      for (const client of clientList) {
        if (client.url.includes('emeres') || client.url.includes('localhost:3000')) {
          return client.focus().then(() => {
            return client.navigate(urlToOpen);
          });
        }
      }
      
      // Sinon ouvrir une nouvelle fenêtre
      return clients.openWindow(urlToOpen);
    })
  );
});

// Background sync for offline notifications
self.addEventListener('sync', event => {
  if (event.tag === 'emeres-notification-sync') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  try {
    console.log('🔄 Synchronisation des notifications...');
    
    // Cette fonction pourrait synchroniser les notifications offline
    // avec le serveur quand la connexion est rétablie
    
  } catch (error) {
    console.error('❌ Erreur sync notifications:', error);
  }
}