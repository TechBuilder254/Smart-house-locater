import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Debug: Log environment variables
console.log('🔍 Debug: Environment Variables:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
  VITE_API_URL: import.meta.env.VITE_API_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE
});

function App() {
  console.log('🔍 Debug: App component rendering');
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-800 flex flex-col">
        {/* Simple Header */}
        <header className="bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">🏠 Smart House Locator</h1>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-800"
              >
                ☰ Menu
              </button>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl font-bold mb-4">🔍 Debug: Static App Working!</h1>
            <p className="text-xl">If you see this, the frontend is rendering correctly!</p>
          </div>
          
          {/* Static Content */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Add House Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">+</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Add New House</h2>
                <p className="text-gray-600">Record property details and location</p>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    House Name/Address
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter house name or address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter agent name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea 
                    placeholder="Additional notes"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Save House
                </button>
              </form>
            </div>
            
            {/* Saved Houses Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🏠</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Saved Houses</h2>
                <p className="text-gray-600">Manage your property locations</p>
              </div>
              
              {/* Search Bar */}
              <div className="mb-4">
                <input 
                  type="text" 
                  placeholder="Search houses by name or agent..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              {/* Sample House */}
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-800">Sample House</h3>
                <p className="text-gray-600">Agent: Sample Agent</p>
                <p className="text-gray-600">Location: Nairobi, Kenya</p>
                <p className="text-gray-600">Notes: This is a sample house for testing</p>
                <button className="text-red-600 hover:text-red-800 text-sm mt-2">
                  🗑️ Delete
                </button>
              </div>
              
              <p className="text-center text-gray-500 text-sm">
                Static version - no backend connection
              </p>
            </div>
          </div>
        </main>
        
        {/* Simple Footer */}
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 Smart House Locator - Static Version</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App

