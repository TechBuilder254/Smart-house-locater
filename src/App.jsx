import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import SavedHouses from './pages/SavedHouses'
import AddHousePage from './pages/AddHousePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProfileSettings from './pages/ProfileSettings'
import AccountSettings from './pages/AccountSettings'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import { supabase } from './services/supabase'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Loading...</h3>
          <p className="text-gray-500">Initializing Smart House Locator</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/saved-houses" element={<SavedHouses user={user} />} />
        <Route path="/add-house" element={<AddHousePage user={user} />} />
        <Route path="/profile-settings" element={<ProfileSettings user={user} />} />
        <Route path="/account-settings" element={<AccountSettings user={user} />} />

        {/* Redirect authenticated users to dashboard */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  )
}

export default App

