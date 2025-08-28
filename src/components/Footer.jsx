import React from 'react'
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-black/20 to-transparent border-t border-white/10 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white mb-4">Smart House Locator</h3>
            <p className="text-white/70 text-sm mb-4">
              Professional property management solution for real estate agents. 
              Navigate to properties with precision and ease.
            </p>
            <div className="flex justify-center md:justify-start gap-3">
              <a href="#" className="text-white/60 hover:text-white transition-colors duration-200">
                <Globe className="w-5 h-5" />
              </a>
              <a href="https://github.com/techbuilder254" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-200">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-white/70 hover:text-white transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/saved-houses" className="text-white/70 hover:text-white transition-colors duration-200">
                  Saved Houses
                </a>
              </li>
              <li>
                <a href="/add-house" className="text-white/70 hover:text-white transition-colors duration-200">
                  Add Property
                </a>
              </li>
              <li>
                <a href="/help" className="text-white/70 hover:text-white transition-colors duration-200">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Developer */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white mb-4">Contact & Support</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center md:justify-start gap-2 text-white/70">
                <Mail className="w-4 h-4" />
                <span>techbuilder254@gmail.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-white/70">
                <Phone className="w-4 h-4" />
                <span>+254 700 021 601</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-white/70">
                <MapPin className="w-4 h-4" />
                <span>Real Estate Solutions</span>
              </div>
            </div>
            
            {/* Developer Info */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs text-white/50 flex items-center justify-center md:justify-start gap-1">
                Made with <Heart className="w-3 h-3 text-red-400" /> by 
                                 <a href="mailto:techbuilder254@gmail.com" className="text-green-300 hover:text-green-200 transition-colors duration-200">
                   TechBuilder254
                 </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-xs text-white/50">
            © 2024 Smart House Locator. All rights reserved. | 
            <a href="/privacy" className="text-green-300 hover:text-green-200 transition-colors duration-200 ml-1">
              Privacy Policy
            </a> | 
            <a href="/terms" className="text-green-300 hover:text-green-200 transition-colors duration-200 ml-1">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
