import React from 'react'
import { ArrowLeft, Shield, Eye, Lock, Database, Smartphone, MapPin } from 'lucide-react'

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur-lg opacity-60"></div>
              <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl shadow-xl border border-white/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Privacy Policy
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
                <Eye className="w-6 h-6 text-green-400" />
                1. Information We Collect
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Smart House Locator is designed with privacy in mind. We collect minimal information to provide our services:
              </p>
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Local Storage Only:</h3>
                <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                  <li>Property names and details you enter</li>
                  <li>GPS coordinates captured by your device</li>
                  <li>Agent information you provide</li>
                  <li>Property notes and descriptions</li>
                </ul>
              </div>
              <p className="text-white/80 leading-relaxed">
                <strong>Important:</strong> All data is stored locally on your device using browser localStorage. We do not collect, store, or transmit any of your data to our servers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-green-400" />
                2. Location Data
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Our application uses GPS and location services to provide accurate property location data:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                <li>Location data is captured only when you actively use the location capture feature</li>
                <li>GPS coordinates are stored locally on your device only</li>
                <li>We do not track your location continuously</li>
                <li>Location data is used solely for property location recording</li>
                <li>You can disable location services at any time through your device settings</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-green-400" />
                3. How We Use Your Information
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Since all data is stored locally, we do not process or use your information. However, your device uses the stored data to:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                <li>Display your saved properties in the application</li>
                <li>Enable navigation to saved properties via Google Maps</li>
                <li>Allow you to search and filter your saved properties</li>
                <li>Provide property management functionality</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-green-400" />
                4. Data Security
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                We prioritize the security of your information:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                <li>All data is stored locally on your device using secure browser localStorage</li>
                <li>No data is transmitted to external servers</li>
                <li>Your device's built-in security measures protect your data</li>
                <li>We do not have access to your stored information</li>
                <li>Data is only accessible through your device and browser</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Sharing</h2>
              <p className="text-white/80 leading-relaxed">
                We do not share, sell, or trade your personal information with third parties. The only external service we interact with is Google Maps for navigation purposes, and this interaction is initiated by you when you choose to navigate to a property.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Third-Party Services</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Our application may integrate with the following third-party services:
              </p>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Google Maps:</h3>
                <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                  <li>Used for navigation to saved properties</li>
                  <li>Opens in your default browser or Google Maps app</li>
                  <li>Subject to Google's privacy policy and terms of service</li>
                  <li>We do not share your data with Google</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Since your data is stored locally, you have complete control over your information:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                <li><strong>Access:</strong> View all your data directly in the application</li>
                <li><strong>Modify:</strong> Edit or update property information at any time</li>
                <li><strong>Delete:</strong> Remove individual properties or clear all data</li>
                <li><strong>Export:</strong> Access your data through browser developer tools</li>
                <li><strong>Control:</strong> Disable location services through device settings</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Data Retention</h2>
              <p className="text-white/80 leading-relaxed">
                Your data is stored locally on your device and will persist until you:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                <li>Manually delete properties through the application</li>
                <li>Clear your browser's localStorage data</li>
                <li>Use a different device or browser</li>
                <li>Uninstall or reset your browser</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
              <p className="text-white/80 leading-relaxed">
                Smart House Locator is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
              <p className="text-white/80 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date. You are advised to review this privacy policy periodically for any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">11. International Users</h2>
              <p className="text-white/80 leading-relaxed">
                Smart House Locator is designed to comply with privacy laws and regulations. Since all data is stored locally on your device, we do not transfer data internationally. However, you should be aware that your data is subject to the laws of your jurisdiction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>
                             <div className="bg-white/5 rounded-lg p-4">
                 <p className="text-white/90">
                   <strong>Email:</strong> techbuilder254@gmail.com<br />
                                       <strong>Phone:</strong> +254 700 021 601<br />
                   <strong>GitHub:</strong> techbuilder254<br />
                   <strong>Developer:</strong> TechBuilder254<br />
                   <strong>Response Time:</strong> We aim to respond to privacy inquiries within 48 hours
                 </p>
               </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">13. Your Consent</h2>
              <p className="text-white/80 leading-relaxed">
                By using Smart House Locator, you consent to this privacy policy. If you do not agree with this policy, please do not use our application. Your continued use of the application following the posting of changes to this policy will be deemed your acceptance of those changes.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
