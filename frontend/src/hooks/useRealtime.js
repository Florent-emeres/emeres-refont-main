/**
 * Hook useRealtime - WebSocket/Realtime pour messagerie
 * Subscribe à thread:{id} → pousse nouveaux messages et "non lus"
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// Configuration WebSocket
const WS_URL = process.env.REACT_APP_WS_URL || process.env.REACT_APP_BACKEND_URL?.replace('http', 'ws') || '';
const RECONNECT_INTERVAL = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;
const HEARTBEAT_INTERVAL = 30000;

export const useRealtime = (options = {}) => {
  const {
    threadId,
    userId,
    onMessage,
    onThreadUpdate,
    onUnreadUpdate,
    enabled = true
  } = options;

  const [state, setState] = useState({
    connected: false,
    error: null,
    lastMessage: null
  });

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const subscribedThreadsRef = useRef(new Set());

  // Obtenir le token d'authentification
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  // Envoyer un message WebSocket
  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  // S'abonner à un thread
  const subscribeToThread = useCallback((targetThreadId) => {
    if (!enabled || subscribedThreadsRef.current.has(targetThreadId)) return;

    sendMessage({
      type: 'subscribe',
      channel: `thread:${targetThreadId}`,
      userId: userId
    });

    subscribedThreadsRef.current.add(targetThreadId);
  }, [enabled, sendMessage, userId]);

  // Se désabonner d'un thread
  const unsubscribeFromThread = useCallback((targetThreadId) => {
    if (!subscribedThreadsRef.current.has(targetThreadId)) return;

    sendMessage({
      type: 'unsubscribe',
      channel: `thread:${targetThreadId}`
    });

    subscribedThreadsRef.current.delete(targetThreadId);
  }, [sendMessage]);

  // Gérer les messages reçus
  const handleMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      
      setState(prev => ({
        ...prev,
        lastMessage: data
      }));

      switch (data.type) {
        case 'message_sent':
          if (onMessage && data.data) {
            onMessage(data.data);
          }
          break;

        case 'thread_updated':
          if (onThreadUpdate) {
            onThreadUpdate(data.threadId, data.data);
          }
          break;

        case 'message_read':
          if (onUnreadUpdate) {
            onUnreadUpdate(data.threadId, data.data?.unreadCount || 0);
          }
          break;

        case 'participant_joined':
          if (onThreadUpdate) {
            onThreadUpdate(data.threadId, { 
              participants: data.data?.participants 
            });
          }
          break;

        default:
          console.log('Message WebSocket non géré:', data.type);
      }
    } catch (error) {
      console.error('Erreur parsing message WebSocket:', error);
    }
  }, [onMessage, onThreadUpdate, onUnreadUpdate]);

  // Heartbeat pour maintenir la connexion
  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        sendMessage({ type: 'ping' });
      }
    }, HEARTBEAT_INTERVAL);
  }, [sendMessage]);

  // Arrêter le heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // Connecter WebSocket
  const connect = useCallback(() => {
    if (!enabled || wsRef.current?.readyState === WebSocket.CONNECTING) return;

    const token = getAuthToken();
    if (!token) {
      setState(prev => ({
        ...prev,
        error: 'Token d\'authentification manquant'
      }));
      return;
    }

    try {
      // URL WebSocket avec token
      const wsUrl = `${WS_URL}/ws?token=${encodeURIComponent(token)}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setState(prev => ({
          ...prev,
          connected: true,
          error: null
        }));

        reconnectAttemptsRef.current = 0;
        startHeartbeat();

        // Re-s'abonner aux threads précédents
        subscribedThreadsRef.current.forEach(threadId => {
          sendMessage({
            type: 'subscribe',
            channel: `thread:${threadId}`,
            userId: userId
          });
        });
      };

      wsRef.current.onmessage = handleMessage;

      wsRef.current.onclose = (event) => {
        setState(prev => ({
          ...prev,
          connected: false,
          error: event.wasClean ? null : 'Connexion fermée inopinément'
        }));

        stopHeartbeat();

        // Tentative de reconnexion si ce n'est pas volontaire
        if (!event.wasClean && enabled && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, RECONNECT_INTERVAL * reconnectAttemptsRef.current);
        }
      };

      wsRef.current.onerror = (error) => {
        setState(prev => ({
          ...prev,
          connected: false,
          error: 'Erreur WebSocket'
        }));
      };

    } catch (error) {
      setState(prev => ({
        ...prev,
        connected: false,
        error: 'Impossible de se connecter au WebSocket'
      }));
    }
  }, [enabled, getAuthToken, handleMessage, startHeartbeat, stopHeartbeat, sendMessage, userId]);

  // Déconnecter WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    stopHeartbeat();
    subscribedThreadsRef.current.clear();

    if (wsRef.current) {
      wsRef.current.close(1000, 'Disconnection volontaire');
      wsRef.current = null;
    }

    setState(prev => ({
      ...prev,
      connected: false,
      error: null
    }));
  }, [stopHeartbeat]);

  // Reconnecter manuellement
  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(connect, 100);
  }, [disconnect, connect]);

  // S'abonner au thread actuel
  useEffect(() => {
    if (threadId && state.connected) {
      subscribeToThread(threadId);
    }

    return () => {
      if (threadId && state.connected) {
        unsubscribeFromThread(threadId);
      }
    };
  }, [threadId, state.connected, subscribeToThread, unsubscribeFromThread]);

  // Connexion initiale et gestion du enabled
  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled]); // Ne pas inclure connect/disconnect pour éviter loops

  // Cleanup complet
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    // État
    connected: state.connected,
    error: state.error,
    lastMessage: state.lastMessage,
    
    // Actions
    connect,
    disconnect,
    reconnect,
    subscribeToThread,
    unsubscribeFromThread,
    
    // Utilitaires
    isEnabled: enabled,
    reconnectAttempts: reconnectAttemptsRef.current,
  };
};

// Hook simplifié pour un thread unique
export const useThreadRealtime = (
  threadId, 
  callbacks
) => {
  return useRealtime({
    threadId,
    enabled: !!threadId,
    ...callbacks
  });
};