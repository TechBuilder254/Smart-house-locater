import React from 'react'
import { Home, MapPin, Navigation, Menu, X, Plus, List, User, LogOut, Settings, BarChart3, Search } from 'lucide-react'
import { supabase } from '../services/supabase'
import { useNavigate, useLocation } from 'react-router-dom'

const Header = ({ isMenuOpen, setIsMenuOpen, user, onAuthClick, showBackButton = false, title = "Smart House Locator" }) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      // Redirect to landing page immediately
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
      // Still redirect even if there's an error
      window.location.href = '/'
    }
  }

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', active: location.pathname === '/dashboard' },
    { path: '/saved-houses', icon: List, label: 'Properties', active: location.pathname === '/saved-houses' },
    { path: '/add-house', icon: Plus, label: 'Add Property', active: location.pathname === '/add-house' },
  ]

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Smart House Locator</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right side - Search, User, Menu */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{user.user_metadata?.name || user.email}</p>
                    <p className="text-xs text-gray-500">Property Manager</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  item.active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </a>
            ))}
            
            {/* Mobile Search */}
            <div className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Mobile User Info */}
            {user && (
              <div className="px-3 py-2 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.user_metadata?.name || user.email}</p>
                    <p className="text-xs text-gray-500">Property Manager</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Page Header (if needed) */}
      {showBackButton && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <h2 className="ml-4 text-lg font-medium text-gray-900">{title}</h2>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header

