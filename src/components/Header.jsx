import React from 'react'
import { Home, MapPin, Navigation, Menu, X, Plus, List } from 'lucide-react'

const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Header - Compact and edge-to-edge */}
      <header className="py-2 md:py-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="absolute top-2 left-2 md:top-4 md:left-4 w-8 h-8 md:w-12 md:h-12 bg-green-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-4 right-2 md:top-6 md:right-4 w-10 h-10 md:w-16 md:h-16 bg-emerald-500/20 rounded-full blur-xl"></div>
        
        <div className="relative z-40">

          {/* Glass morphism card that extends almost to edges */}
          <div className="relative mx-2 md:mx-4">
            {/* Card background with glass effect */}
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
              {/* Gradient overlay that fades at ends */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent"></div>
              
              {/* Content - Title, tagline, and features all in one card */}
              <div className="relative px-6 py-4 md:px-12 md:py-6">
                {/* Title Section */}
                <div className="flex items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl md:rounded-2xl blur-lg opacity-60"></div>
                    <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-2 md:p-3 rounded-xl md:rounded-2xl shadow-xl border border-white/30">
                      <Home className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                  <h1 className="text-xl md:text-3xl font-bold text-white drop-shadow-lg">
                    Smart House Locator
                  </h1>
                </div>
                
                {/* Tagline */}
                <div className="text-center mb-4 md:mb-6">
                  <p className="text-sm md:text-lg text-green-300 font-light">
                    Navigate to properties with ease and precision
                  </p>
                </div>
                
                {/* Feature highlights with menu button */}
                <div className="flex justify-center items-center gap-4 md:gap-8 relative">
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-green-300">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm font-medium">GPS</span>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-green-300">
                    <Navigation className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm font-medium">Maps</span>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-green-300">
                    <Home className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm font-medium">Properties</span>
                  </div>
                  
                  {/* Menu Button - Positioned near Properties icon */}
                  <button
                    onClick={toggleMenu}
                    className="md:hidden bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 hover:bg-white/20 transition-all duration-200 hover:scale-105 ml-2"
                  >
                    {isMenuOpen ? (
                      <X className="w-4 h-4 text-white" />
                    ) : (
                      <Menu className="w-4 h-4 text-white" />
                    )}
                  </button>
                  
                  {/* Desktop Navigation - Positioned near Properties icon */}
                  <nav className="hidden md:flex items-center gap-4 ml-4">
                    <a href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 hover:scale-105">
                      <Home className="w-4 h-4" />
                      <span className="text-sm font-medium">Home</span>
                    </a>
                    <a href="/saved-houses" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 hover:scale-105">
                      <List className="w-4 h-4" />
                      <span className="text-sm font-medium">Saved Houses</span>
                    </a>
                    <a href="/add-house" className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-lg px-3 py-2 text-green-300 hover:bg-green-500/30 transition-all duration-200 hover:scale-105">
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">Add Property</span>
                    </a>
                  </nav>
                </div>

                {/* Mobile Menu Dropdown - Contained within the header card */}
                <div className={`md:hidden mt-4 transition-all duration-300 ease-in-out overflow-hidden ${
                  isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-3">
                    <a href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-white text-base hover:text-green-200 transition-colors duration-200 hover:scale-105 p-2 rounded-lg hover:bg-white/10">
                      <Home className="w-4 h-4" />
                      <span className="font-medium">Home</span>
                    </a>
                    <a href="/saved-houses" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-white text-base hover:text-green-200 transition-colors duration-200 hover:scale-105 p-2 rounded-lg hover:bg-white/10">
                      <List className="w-4 h-4" />
                      <span className="font-medium">Saved Houses</span>
                    </a>
                    <a href="/add-house" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 bg-green-500/20 border border-green-400/30 rounded-lg px-3 py-2 text-green-300 hover:bg-green-500/30 transition-all duration-200 hover:scale-105">
                      <Plus className="w-4 h-4" />
                      <span className="font-medium">Add Property</span>
                    </a>
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

