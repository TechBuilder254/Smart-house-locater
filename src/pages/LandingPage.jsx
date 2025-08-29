import React from 'react'
import { Home, MapPin, Shield, Users, TrendingUp, ArrowRight, CheckCircle, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Enhanced Header */}
      <header className="relative overflow-hidden">
        {/* Background with gradient and curved edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-b-2xl"></div>
        
        {/* Fading corner effects */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-green-400/30 to-transparent rounded-br-full"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-400/30 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-emerald-400/20 to-transparent rounded-tr-full"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-green-400/20 to-transparent rounded-tl-full"></div>
        
        {/* Main header content */}
        <div className="relative z-10 bg-white/10 backdrop-blur-sm border-b border-white/20 rounded-b-2xl">
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

              {/* Navigation */}
              <nav className="hidden md:flex space-x-6">
                <a href="#features" className="text-white/90 hover:text-white transition-colors">Features</a>
                <a href="#benefits" className="text-white/90 hover:text-white transition-colors">Benefits</a>
                <a href="#about" className="text-white/90 hover:text-white transition-colors">About</a>
              </nav>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white/90 hover:text-white transition-colors text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-white/25 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/35 transition-all duration-200 border border-white/40 shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Smart Property
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600"> Management</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your property management with our intelligent location-based system. 
              Track, organize, and manage your properties with precision and ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:border-green-600 hover:text-green-600 transition-all duration-300 flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Property Management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your properties efficiently and securely
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Precise Location Tracking</h3>
              <p className="text-gray-600">
                High-accuracy GPS location capture with precision down to 10 meters. 
                Never lose track of your properties again.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure & Private</h3>
              <p className="text-gray-600">
                Enterprise-grade security with password-protected actions and 
                encrypted data storage. Your information stays private.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-teal-50 to-green-50 p-8 rounded-2xl border border-teal-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Caretaker Management</h3>
              <p className="text-gray-600">
                Track caretakers and their contact information for each property. 
                Maintain clear communication channels.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Visual Network Map</h3>
              <p className="text-gray-600">
                Interactive map view showing all your properties in one place. 
                Visualize your property network at a glance.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Navigation</h3>
              <p className="text-gray-600">
                One-click navigation to any property with Google Maps integration. 
                Get directions instantly to any location.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-teal-50 to-green-50 p-8 rounded-2xl border border-teal-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Simple & Intuitive</h3>
              <p className="text-gray-600">
                Clean, modern interface designed for ease of use. 
                Manage properties without the complexity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Smart House Locator?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of property managers who trust our platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Time & Effort</h3>
                    <p className="text-gray-600">
                      Streamline your property management workflow with our intuitive tools. 
                      No more manual tracking or lost information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Security</h3>
                    <p className="text-gray-600">
                      Password-protected actions and secure data storage ensure your 
                      property information remains confidential and safe.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Dashboard</h3>
                    <p className="text-gray-600">
                      Beautiful, modern interface designed for professionals. 
                      Manage your properties with style and efficiency.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
                    <p className="text-gray-600">
                      Access your property data from anywhere. 
                      Responsive design works perfectly on all devices.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of property managers who have already transformed their workflow
                </p>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 inline-flex items-center gap-2"
                >
                  Create Free Account
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center mr-3">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold">Smart House Locator</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Professional property management made simple. Track, organize, and manage your properties with precision and ease.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#benefits" className="hover:text-white transition-colors">Benefits</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Smart House Locator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
