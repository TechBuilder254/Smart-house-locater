import React from 'react'
import { Home, MapPin, Navigation, Menu, X, Plus, List, User, LogOut, ArrowLeft } from 'lucide-react'
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

  return (
    <div className="relative overflow-hidden">
      {/* Header with curved corners and better colors */}
      <header className="py-3 md:py-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="absolute top-2 left-2 md:top-4 md:left-4 w-8 h-8 md:w-12 md:h-12 bg-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-4 right-2 md:top-6 md:right-4 w-10 h-10 md:w-16 md:h-16 bg-blue-500/20 rounded-full blur-xl"></div>
        
        <div className="relative z-40">
          {/* Glass morphism card with curved corners */}
          <div className="relative mx-3 md:mx-6">
            {/* Card background with enhanced glass effect */}
            <div className="relative bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-indigo-600/90 backdrop-blur-xl border border-white/30 rounded-3xl md:rounded-3xl shadow-2xl overflow-hidden">
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent"></div>
              
              {/* Content */}
              <div className="relative px-6 py-4 md:px-8 md:py-6">
                {/* Top row with back button and menu */}
                <div className="flex items-center justify-between mb-4">
                  {/* Back button */}
                  {showBackButton && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-2 hover:bg-white/30 transition-all duration-200 hover:scale-105"
                    >
                      <ArrowLeft className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">Back</span>
                    </button>
                  )}
                  
                  {/* Menu Button - Always visible */}
                  <button
                    onClick={toggleMenu}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-2 hover:bg-white/30 transition-all duration-200 hover:scale-105"
                  >
                    {isMenuOpen ? (
                      <X className="w-5 h-5 text-white" />
                    ) : (
                      <Menu className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>

                {/* Title Section */}
                <div className="flex items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-lg opacity-60"></div>
                    <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl shadow-xl border border-white/40">
                      <Home className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                    {title}
                  </h1>
                </div>
                
                {/* Tagline */}
                <div className="text-center mb-4 md:mb-6">
                  <p className="text-sm md:text-lg text-blue-200 font-light">
                    Navigate to properties with ease and precision
                  </p>
                </div>
                
                {/* Feature highlights */}
                <div className="flex justify-center items-center gap-4 md:gap-8">
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-blue-200">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm font-medium">GPS</span>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-blue-200">
                    <Navigation className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm font-medium">Maps</span>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-blue-200">
                    <Home className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm font-medium">Properties</span>
                  </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center justify-center gap-4 mt-4">
                  <a href="/dashboard" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 hover:scale-105">
                    <Home className="w-4 h-4" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </a>
                  <a href="/saved-houses" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 hover:scale-105">
                    <List className="w-4 h-4" />
                    <span className="text-sm font-medium">Saved Houses</span>
                  </a>
                  <a href="/add-house" className="flex items-center gap-2 bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white hover:bg-white/30 transition-all duration-200 hover:scale-105">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Property</span>
                  </a>
                  
                  {/* Auth Section */}
                  {user ? (
                    <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/30">
                      <div className="text-white text-sm">
                        <span className="font-medium">{user.user_metadata?.name || user.email}</span>
                      </div>
                      <button
                        onClick={() => {
                          supabase.auth.signOut()
                          window.location.reload()
                        }}
                        className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                        title="Sign Out"
                      >
                        <LogOut className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={onAuthClick}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white ml-4"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Sign In</span>
                    </button>
                  )}
                </nav>

                {/* Mobile Menu Dropdown */}
                <div className={`md:hidden mt-4 transition-all duration-300 ease-in-out overflow-hidden ${
                  isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 space-y-3">
                    <a href="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-white text-base hover:text-blue-200 transition-colors duration-200 hover:scale-105 p-3 rounded-xl hover:bg-white/10">
                      <Home className="w-5 h-5" />
                      <span className="font-medium">Dashboard</span>
                    </a>
                    <a href="/saved-houses" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-white text-base hover:text-blue-200 transition-colors duration-200 hover:scale-105 p-3 rounded-xl hover:bg-white/10">
                      <List className="w-5 h-5" />
                      <span className="font-medium">Saved Houses</span>
                    </a>
                    <a href="/add-house" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white hover:bg-white/30 transition-all duration-200 hover:scale-105">
                      <Plus className="w-5 h-5" />
                      <span className="font-medium">Add Property</span>
                    </a>
                    
                    {/* Mobile Auth Section */}
                    {user ? (
                      <>
                        <div className="border-t border-white/20 pt-3 mt-3">
                          <div className="flex items-center justify-between text-white text-sm mb-2">
                            <span className="font-medium">{user.user_metadata?.name || user.email}</span>
                          </div>
                          <button
                            onClick={() => {
                              supabase.auth.signOut()
                              window.location.reload()
                            }}
                            className="flex items-center gap-3 text-white text-base hover:text-red-200 transition-colors duration-200 hover:scale-105 p-3 rounded-xl hover:bg-white/10 w-full"
                          >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          onAuthClick()
                          setIsMenuOpen(false)
                        }}
                        className="flex items-center gap-3 text-white text-base hover:text-blue-200 transition-colors duration-200 hover:scale-105 p-3 rounded-xl hover:bg-white/10 w-full"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Sign In</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header

