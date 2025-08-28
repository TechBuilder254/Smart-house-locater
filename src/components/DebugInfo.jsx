import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const DebugInfo = () => {
  const [debugInfo, setDebugInfo] = useState({
    apiUrl: process.env.REACT_APP_API_URL || '/api',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    healthCheck: null,
    housesCheck: null,
    error: null
  });

  useEffect(() => {
    const runDebugChecks = async () => {
      try {
        // Test health endpoint
        console.log('Testing health endpoint...');
        const healthResponse = await apiService.healthCheck();
        setDebugInfo(prev => ({ ...prev, healthCheck: healthResponse }));
        console.log('Health check successful:', healthResponse);
      } catch (error) {
        console.error('Health check failed:', error);
        setDebugInfo(prev => ({ ...prev, healthCheck: { error: error.message } }));
      }

      try {
        // Test houses endpoint
        console.log('Testing houses endpoint...');
        const housesResponse = await apiService.getHouses();
        setDebugInfo(prev => ({ ...prev, housesCheck: housesResponse }));
        console.log('Houses check successful:', housesResponse);
      } catch (error) {
        console.error('Houses check failed:', error);
        setDebugInfo(prev => ({ ...prev, housesCheck: { error: error.message } }));
      }
    };

    runDebugChecks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Debug Information</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Environment:</h3>
            <p>API URL: {debugInfo.apiUrl}</p>
            <p>NODE_ENV: {debugInfo.environment}</p>
            <p>Timestamp: {debugInfo.timestamp}</p>
          </div>

          <div>
            <h3 className="font-semibold">Health Check:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.healthCheck, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold">Houses Check:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.housesCheck, null, 2)}
            </pre>
          </div>

          {debugInfo.error && (
            <div>
              <h3 className="font-semibold text-red-600">Error:</h3>
              <p className="text-red-600">{debugInfo.error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugInfo;
