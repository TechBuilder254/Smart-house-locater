import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import SavedHouses from './pages/SavedHouses'
import AddHousePage from './pages/AddHousePage'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Footer from './components/Footer'
import LoginModal from './components/Auth/LoginModal'
import SignupModal from './components/Auth/SignupModal'
import { supabase } from './services/supabase'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAuthClick = () => {
    setShowLoginModal(true)
  }

  const switchToSignup = () => {
    setShowLoginModal(false)
    setShowSignupModal(true)
  }

  const switchToLogin = () => {
    setShowSignupModal(false)
    setShowLoginModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Loading...</h3>
          <p className="text-white/80">Initializing Smart House Locator</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex flex-col">
        <Header 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen}
          user={user}
          onAuthClick={handleAuthClick}
        />
        
        {/* Blur overlay when menu is open - positioned below header */}
        {isMenuOpen && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-sm z-30 pt-32" onClick={() => setIsMenuOpen(false)}></div>
        )}
        
        <main className={`flex-grow transition-all duration-300 ${isMenuOpen ? 'blur-sm' : ''}`}>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/saved-houses" element={<SavedHouses user={user} />} />
            <Route path="/add-house" element={<AddHousePage user={user} />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </main>

        <Footer />

        {/* Auth Modals */}
        {showLoginModal && (
          <LoginModal 
            onClose={() => setShowLoginModal(false)}
            onSwitchToSignup={switchToSignup}
          />
        )}
        
        {showSignupModal && (
          <SignupModal 
            onClose={() => setShowSignupModal(false)}
            onSwitchToLogin={switchToLogin}
          />
        )}
      </div>
    </Router>
  )
}

export default App

