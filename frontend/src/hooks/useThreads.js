/**
 * Hook useThreads - Gestion de l'état des threads
 * Charge la liste + expose isLoading, refetch, setFilters, pagination
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { messagingApi, handleApiError } from '../api/messaging';
import { useToast } from './use-toast';

export const useThreads = (options = {}) => {
  const { initialFilters = {}, autoRefresh = false, refreshInterval = 30000 } = options;
  const { toast } = useToast();
  
  const [state, setState] = useState({
    threads: [],
    loading: true,
    error: null,
    hasMore: false,
    totalUnread: 0
  });

  const [filters, setFilters] = useState(initialFilters);
  const refreshIntervalRef = useRef(null);
  const lastFetchRef = useRef('');

  // Charger les threads
  const fetchThreads = useCallback(async (newFilters, showLoading = true) => {
    const currentFilters = newFilters || filters;
    const filterKey = JSON.stringify(currentFilters);
    
    // Éviter les requêtes en double
    if (lastFetchRef.current === filterKey && !showLoading) {
      return;
    }
    lastFetchRef.current = filterKey;

    if (showLoading) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }

    try {
      const result = await messagingApi.getThreads(currentFilters);
      
      setState(prev => ({
        ...prev,
        threads: result.items,
        hasMore: result.hasMore,
        totalUnread: result.items.reduce((sum, thread) => sum + thread.unreadCount, 0),
        loading: false,
        error: null
      }));
    } catch (error) {
      const apiError = handleApiError(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }));

      // Toast d'erreur seulement si ce n'est pas un refresh silencieux
      if (showLoading) {
        toast({
          title: "Erreur de chargement",
          description: apiError.message,
          variant: "destructive"
        });
      }
    }
  }, [filters, toast]);

  // Mettre à jour les filtres
  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchThreads(updatedFilters, true);
  }, [filters, fetchThreads]);

  // Recherche avec debounce
  const searchDebounceRef = useRef();
  const setSearch = useCallback((searchQuery) => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      updateFilters({ search: searchQuery || undefined });
    }, 300);
  }, [updateFilters]);

  // Filtrer par contexte
  const setContext = useCallback((context) => {
    updateFilters({ context });
  }, [updateFilters]);

  // Refresh manuel
  const refetch = useCallback(() => {
    fetchThreads(filters, true);
  }, [fetchThreads, filters]);

  // Refresh silencieux
  const silentRefresh = useCallback(() => {
    fetchThreads(filters, false);
  }, [fetchThreads, filters]);

  // Marquer un thread comme lu et mettre à jour l'état local
  const markThreadAsRead = useCallback(async (threadId) => {
    try {
      await messagingApi.markThreadAsRead(threadId);
      
      // Mettre à jour l'état local
      setState(prev => ({
        ...prev,
        threads: prev.threads.map(thread => 
          thread.id === threadId 
            ? { ...thread, unreadCount: 0 }
            : thread
        ),
        totalUnread: Math.max(0, prev.totalUnread - (prev.threads.find(t => t.id === threadId)?.unreadCount || 0))
      }));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  }, []);

  // Ajouter un nouveau thread à la liste (pour temps réel)
  const addThread = useCallback((thread) => {
    setState(prev => ({
      ...prev,
      threads: [thread, ...prev.threads.filter(t => t.id !== thread.id)],
      totalUnread: prev.totalUnread + thread.unreadCount
    }));
  }, []);

  // Mettre à jour un thread existant (pour temps réel)
  const updateThread = useCallback((threadId, updates) => {
    setState(prev => ({
      ...prev,
      threads: prev.threads.map(thread => 
        thread.id === threadId 
          ? { ...thread, ...updates }
          : thread
      )
    }));
  }, []);

  // Incrémenter le compteur non-lus d'un thread (nouveau message reçu)
  const incrementUnread = useCallback((threadId, increment = 1) => {
    setState(prev => ({
      ...prev,
      threads: prev.threads.map(thread => 
        thread.id === threadId 
          ? { ...thread, unreadCount: thread.unreadCount + increment }
          : thread
      ),
      totalUnread: prev.totalUnread + increment
    }));
  }, []);

  // Effet pour charger les threads initiaux
  useEffect(() => {
    fetchThreads(filters, true);
  }, []); // Seulement au mount

  // Effet pour auto-refresh
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(silentRefresh, refreshInterval);
      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, silentRefresh]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      messagingApi.abortRequest('get-threads');
    };
  }, []);

  return {
    // État
    threads: state.threads,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    totalUnread: state.totalUnread,
    
    // Filtres actuels
    filters,
    
    // Actions
    refetch,
    silentRefresh,
    setSearch,
    setContext,
    updateFilters,
    markThreadAsRead,
    
    // Pour le temps réel
    addThread,
    updateThread,
    incrementUnread,
  };
};