import React from 'react'
import { Home, MapPin, Navigation, Menu, X, Plus, List, User, LogOut, Settings, BarChart3, Search } from 'lucide-react'
import { supabase } from '../services/supabase'
import { useNavigate, useLocation } from 'react-router-dom'

const Header = ({ isMenuOpen, setIsMenuOpen, user, onAuthClick, showBackButton = false, title = "Smart House Locator", onProfileClick }) => {
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
      <header className="sticky top-0 z-50">
        {/* Background with gradient and curved edges */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-b-3xl"></div>
          
          {/* Fading corner effects */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-green-400/30 to-transparent rounded-br-full"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-400/30 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-400/20 to-transparent rounded-tr-full"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-green-400/20 to-transparent rounded-tl-full"></div>
          
          {/* Main header content */}
          <div className="relative z-10 bg-white/10 backdrop-blur-sm border-b border-white/20 rounded-b-3xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo and Brand */}
                <div className="flex items-center flex-shrink-0">
                  <div className="w-8 h-8 bg-white/25 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 border border-white/40 shadow-lg">
                    <Home className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="text-lg font-bold text-white drop-shadow-lg hidden sm:block">Smart House Locator</h1>
                  <h1 className="text-base font-bold text-white drop-shadow-lg sm:hidden">SHL</h1>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-3">
                  {navItems.map((item) => (
                    <a
                      key={item.path}
                      href={item.path}
                      className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        item.active
                          ? 'bg-white/25 text-white border border-white/40 shadow-lg backdrop-blur-sm'
                          : 'text-white/90 hover:text-white hover:bg-white/15 rounded-xl'
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-1" />
                      {item.label}
                    </a>
                  ))}
                </nav>

                {/* Right side - Search, User, Menu */}
                <div className="flex items-center space-x-3">
                  {/* Search */}
                  <div className="hidden lg:flex items-center">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
                      <input
                        type="text"
                        placeholder="Search properties..."
                        className="pl-9 pr-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 text-sm text-white placeholder-white/70 w-48"
                      />
                    </div>
                  </div>

                  {/* User Menu */}
                  {user ? (
                    <div className="flex items-center space-x-2">
                      <div className="hidden lg:block">
                        <p className="text-xs font-medium text-white truncate max-w-24">{user.user_metadata?.name || user.email}</p>
                        <p className="text-xs text-white/70">Property Manager</p>
                      </div>
                      <button
                        onClick={onProfileClick}
                        className="w-8 h-8 bg-white/25 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/40 shadow-lg hover:bg-white/35 transition-all duration-200 cursor-pointer"
                        title="Profile Menu"
                      >
                        <User className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/15 rounded-xl transition-all duration-200"
                        title="Sign Out"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={onAuthClick}
                      className="bg-white/25 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/35 transition-all duration-200 border border-white/40 shadow-lg"
                    >
                      Sign In
                    </button>
                  )}

                  {/* Mobile menu button */}
                  <button
                    onClick={toggleMenu}
                    className="md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/15 transition-all duration-200"
                  >
                    {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-b border-gray-200 rounded-b-3xl shadow-lg">
          <div className="px-3 pt-3 pb-4 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  item.active
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
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
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Mobile User Info */}
            {user && (
              <div className="px-3 py-3 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.user_metadata?.name || user.email}</p>
                    <p className="text-xs text-gray-500">Property Manager</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
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
        <div className="bg-gray-50 border-b border-gray-200 rounded-b-3xl">
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
              <h2 className="ml-3 text-lg font-semibold text-gray-900">{title}</h2>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header

