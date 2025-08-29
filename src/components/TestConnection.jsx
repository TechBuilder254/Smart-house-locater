import React, { useState, useEffect } from 'react';
import supabaseService from '../services/supabase.js';

function TestConnection() {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const result = await supabaseService.healthCheck();
        setStatus(`✅ ${result.message}`);
      } catch (err) {
        setError(err.message);
        setStatus('❌ Connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Connection Test</h3>
      <p className="text-sm text-gray-600 mb-2">{status}</p>
      {error && (
        <div className="text-red-600 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}
      <div className="text-xs text-gray-500 mt-2">
        <p>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
        <p>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
      </div>
    </div>
  );
}

export default TestConnection;
