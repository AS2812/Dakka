// Data fetching test script
// This script will help you test your data fetching functionality

import apiService from '../src/services/api.js';

// Test function to check if backend is responding
export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    
    // Test basic connection
    const response = await fetch('http://localhost:5000/api/auth/me', {
      credentials: 'include'
    });
    
    if (response.status === 401) {
      console.log('✅ Backend is running - authentication required (expected)');
      return true;
    } else if (response.ok) {
      console.log('✅ Backend is running - user authenticated');
      return true;
    } else {
      console.log('❌ Backend responded with status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Backend connection failed:', error.message);
    return false;
  }
};

// Test function to check if data fetching works
export const testDataFetching = async () => {
  try {
    console.log('Testing data fetching...');
    
    // Test various endpoints
    const tests = [
      { name: 'Session Status', fn: () => apiService.getSessionStatus() },
      { name: 'Chat Stats', fn: () => apiService.getChatStats() },
      { name: 'Met Users', fn: () => apiService.getMetUsers() },
      { name: 'Reconnect Requests', fn: () => apiService.getReconnectRequests() }
    ];
    
    for (const test of tests) {
      try {
        await test.fn();
        console.log(`✅ ${test.name} - Success`);
      } catch (error) {
        if (error.message.includes('401')) {
          console.log(`⚠️ ${test.name} - Authentication required (expected)`);
        } else {
          console.log(`❌ ${test.name} - Error:`, error.message);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.log('❌ Data fetching test failed:', error.message);
    return false;
  }
};

// Run tests when this script is imported
if (typeof window !== 'undefined') {
  window.testDataFetching = {
    testBackendConnection,
    testDataFetching,
    runAllTests: async () => {
      console.log('🚀 Starting data fetching tests...');
      await testBackendConnection();
      await testDataFetching();
      console.log('✅ All tests completed!');
    }
  };
}
