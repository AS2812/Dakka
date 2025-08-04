import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api.js';

// Custom hook for fetching and managing all data in your website
export const useDataFetcher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    user: null,
    metUsers: [],
    reconnectRequests: [],
    chatStats: null,
    messages: [],
    sessionStatus: null,
    systemSettings: null,
    reports: [],
    users: []
  });

  // Generic fetch function with error handling
  const fetchData = useCallback(async (fetchFunction, dataKey, showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      const result = await fetchFunction();
      
      setData(prevData => ({
        ...prevData,
        [dataKey]: result
      }));
      
      return result;
    } catch (err) {
      console.error(`Error fetching ${dataKey}:`, err);
      setError(err.message);
      throw err;
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // User data fetching functions
  const fetchCurrentUser = useCallback(async () => {
    return fetchData(() => apiService.getCurrentUser(), 'user');
  }, [fetchData]);

  const fetchMetUsers = useCallback(async () => {
    return fetchData(() => apiService.getMetUsers(), 'metUsers');
  }, [fetchData]);

  const fetchReconnectRequests = useCallback(async () => {
    return fetchData(() => apiService.getReconnectRequests(), 'reconnectRequests');
  }, [fetchData]);

  // Chat data fetching functions
  const fetchChatStats = useCallback(async () => {
    return fetchData(() => apiService.getChatStats(), 'chatStats');
  }, [fetchData]);

  const fetchMessages = useCallback(async () => {
    return fetchData(() => apiService.getMessages(), 'messages');
  }, [fetchData]);

  const fetchSessionStatus = useCallback(async () => {
    return fetchData(() => apiService.getSessionStatus(), 'sessionStatus');
  }, [fetchData]);

  // Admin data fetching functions (if user has admin privileges)
  const fetchUsers = useCallback(async (params = {}) => {
    return fetchData(() => apiService.getUsers(params), 'users');
  }, [fetchData]);

  const fetchReports = useCallback(async (params = {}) => {
    return fetchData(() => apiService.getReports(params), 'reports');
  }, [fetchData]);

  const fetchSystemSettings = useCallback(async () => {
    return fetchData(() => apiService.getSystemSettings(), 'systemSettings');
  }, [fetchData]);

  // Function to fetch all essential data at once
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch essential user data first
      await fetchCurrentUser();
      
      // Fetch other data in parallel
      await Promise.allSettled([
        fetchMetUsers(),
        fetchReconnectRequests(),
        fetchChatStats(),
        fetchSessionStatus()
      ]);
    } catch (err) {
      console.error('Error fetching all data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchCurrentUser, fetchMetUsers, fetchReconnectRequests, fetchChatStats, fetchSessionStatus]);

  // Function to refresh specific data
  const refreshData = useCallback(async (dataKeys = []) => {
    const refreshFunctions = {
      user: fetchCurrentUser,
      metUsers: fetchMetUsers,
      reconnectRequests: fetchReconnectRequests,
      chatStats: fetchChatStats,
      messages: fetchMessages,
      sessionStatus: fetchSessionStatus,
      users: fetchUsers,
      reports: fetchReports,
      systemSettings: fetchSystemSettings
    };

    if (dataKeys.length === 0) {
      // Refresh all data
      await fetchAllData();
    } else {
      // Refresh specific data
      const promises = dataKeys.map(key => {
        const refreshFn = refreshFunctions[key];
        return refreshFn ? refreshFn() : Promise.resolve();
      });
      
      await Promise.allSettled(promises);
    }
  }, [
    fetchCurrentUser, fetchMetUsers, fetchReconnectRequests, 
    fetchChatStats, fetchMessages, fetchSessionStatus, 
    fetchUsers, fetchReports, fetchSystemSettings, fetchAllData
  ]);

  // Auto-refresh data at intervals (optional)
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  useEffect(() => {
    let interval;
    
    if (autoRefresh && data.user) {
      interval = setInterval(() => {
        refreshData(['sessionStatus', 'messages', 'reconnectRequests']);
      }, refreshInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, data.user, refreshData]);

  // Update functions for real-time data
  const updateUserData = useCallback((userData) => {
    setData(prevData => ({
      ...prevData,
      user: userData
    }));
  }, []);

  const addMessage = useCallback((message) => {
    setData(prevData => ({
      ...prevData,
      messages: [...prevData.messages, message]
    }));
  }, []);

  const updateSessionStatus = useCallback((status) => {
    setData(prevData => ({
      ...prevData,
      sessionStatus: status
    }));
  }, []);

  const addReconnectRequest = useCallback((request) => {
    setData(prevData => ({
      ...prevData,
      reconnectRequests: [...prevData.reconnectRequests, request]
    }));
  }, []);

  const removeReconnectRequest = useCallback((requestId) => {
    setData(prevData => ({
      ...prevData,
      reconnectRequests: prevData.reconnectRequests.filter(req => req.id !== requestId)
    }));
  }, []);

  return {
    // Data
    data,
    loading,
    error,
    
    // Fetch functions
    fetchCurrentUser,
    fetchMetUsers,
    fetchReconnectRequests,
    fetchChatStats,
    fetchMessages,
    fetchSessionStatus,
    fetchUsers,
    fetchReports,
    fetchSystemSettings,
    fetchAllData,
    refreshData,
    
    // Update functions
    updateUserData,
    addMessage,
    updateSessionStatus,
    addReconnectRequest,
    removeReconnectRequest,
    
    // Auto-refresh controls
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
    
    // Utility functions
    clearError: () => setError(null),
    clearData: () => setData({
      user: null,
      metUsers: [],
      reconnectRequests: [],
      chatStats: null,
      messages: [],
      sessionStatus: null,
      systemSettings: null,
      reports: [],
      users: []
    })
  };
};

export default useDataFetcher;
