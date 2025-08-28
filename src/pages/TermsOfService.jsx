import React from 'react'
import { ArrowLeft, Shield, FileText, Users, MapPin, Smartphone } from 'lucide-react'

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur-lg opacity-60"></div>
              <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl shadow-xl border border-white/30">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Terms of Service
            </h1>
          </div>
          <p className="text-lg text-white/70">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-8">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </a>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="prose prose-invert max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-400" />
                1. Acceptance of Terms
              </h2>
              <p className="text-white/80 leading-relaxed">
                By accessing and using Smart House Locator ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-green-400" />
                2. Use License
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Permission is granted to temporarily use Smart House Locator for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained in the application</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-green-400" />
                3. Location Services
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Smart House Locator uses GPS and location services to provide accurate property location data. By using this service, you:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                <li>Consent to the collection and use of your location data</li>
                <li>Understand that location accuracy depends on your device's GPS capabilities</li>
                <li>Agree to use location data responsibly and in compliance with local laws</li>
                <li>Accept that location services may not be available in all areas</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-green-400" />
                4. User Responsibilities
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                As a user of Smart House Locator, you are responsible for:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                <li>Providing accurate and truthful information about properties</li>
                <li>Respecting privacy and property rights of others</li>
                <li>Using the service in compliance with applicable laws and regulations</li>
                <li>Maintaining the security of your account and device</li>
                <li>Not using the service for any illegal or unauthorized purpose</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Storage and Privacy</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Property data is stored locally on your device using browser localStorage. We do not:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                <li>Collect or store your data on our servers</li>
                <li>Share your property information with third parties</li>
                <li>Track your usage patterns or personal information</li>
                <li>Use cookies or tracking technologies</li>
              </ul>
              <p className="text-white/80 leading-relaxed mt-4">
                However, you are responsible for backing up your data and understanding that data stored locally may be lost if you clear your browser data or use a different device.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Disclaimer</h2>
              <p className="text-white/80 leading-relaxed">
                The materials on Smart House Locator are provided on an 'as is' basis. Smart House Locator makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Limitations</h2>
              <p className="text-white/80 leading-relaxed">
                In no event shall Smart House Locator or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Smart House Locator, even if Smart House Locator or a Smart House Locator authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Accuracy of Materials</h2>
              <p className="text-white/80 leading-relaxed">
                The materials appearing on Smart House Locator could include technical, typographical, or photographic errors. Smart House Locator does not warrant that any of the materials on its website are accurate, complete, or current. Smart House Locator may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Links</h2>
              <p className="text-white/80 leading-relaxed">
                Smart House Locator has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Smart House Locator of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. Modifications</h2>
              <p className="text-white/80 leading-relaxed">
                Smart House Locator may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law</h2>
              <p className="text-white/80 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
              <p className="text-white/80 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-white/5 rounded-lg p-4 mt-4">
                <p className="text-white/90">
                  <strong>Email:</strong> techbuilder254@gmail.com<br />
                                     <strong>Phone:</strong> +254 700 021 601<br />
                  <strong>GitHub:</strong> techbuilder254<br />
                  <strong>Developer:</strong> TechBuilder254
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
