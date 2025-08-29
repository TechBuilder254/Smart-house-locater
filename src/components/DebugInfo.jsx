import React from 'react';

function DebugInfo() {
  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    NODE_ENV: import.meta.env.NODE_ENV,
    MODE: import.meta.env.MODE
  };

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-2">🔍 Debug Information</h3>
      <div className="text-sm space-y-1">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-mono">{key}:</span>
            <span className={`font-mono ${value ? 'text-green-600' : 'text-red-600'}`}>
              {value ? '✅ Set' : '❌ Missing'}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-600">
        <p>If any variables show "❌ Missing", the app will show a white screen.</p>
        <p>Make sure you have the env.local file in your project root.</p>
      </div>
    </div>
  );
}

export default DebugInfo;
