import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import SavedHouses from './pages/SavedHouses'
import AddHousePage from './pages/AddHousePage'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Footer from './components/Footer'

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
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex flex-col">
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        
        {/* Blur overlay when menu is open - positioned below header */}
        {isMenuOpen && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-sm z-30 pt-32" onClick={() => setIsMenuOpen(false)}></div>
        )}
        
        <main className={`flex-grow transition-all duration-300 ${isMenuOpen ? 'blur-sm' : ''}`}>
          <div className="p-4 text-white">
            <h1 className="text-2xl font-bold mb-4">🔍 Debug: App is loading...</h1>
            <p>If you see this, the App component is working!</p>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/saved-houses" element={<SavedHouses />} />
            <Route path="/add-house" element={<AddHousePage />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App

