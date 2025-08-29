import React, { useState, useEffect } from 'react'
import { Settings, Bell, Shield, Download, Trash2, ArrowLeft, Save, Eye, EyeOff, Globe, Lock, Mail, Smartphone } from 'lucide-react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

const AccountSettings = ({ user }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showPassword, setShowPassword] = useState(false)
  
  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      propertyUpdates: true,
      newProperties: true,
      weeklyReport: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowMessages: true,
      dataSharing: false
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      theme: 'light'
    }
  })

  // Two-factor authentication state
  const [twoFactorData, setTwoFactorData] = useState({
    enabled: false,
    method: 'app',
    backupCodes: []
  })

  useEffect(() => {
    if (user) {
      // Load user settings from metadata
      const userSettings = user.user_metadata?.settings || {}
      setAccountSettings(prev => ({
        ...prev,
        ...userSettings
      }))
    }
  }, [user])

  const handleSettingsUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          settings: accountSettings
        }
      })

      if (error) {
        throw error
      }

      setMessage({ type: 'success', text: 'Account settings updated successfully!' })
    } catch (error) {
      console.error('Error updating account settings:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationToggle = (category, setting) => {
    setAccountSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: !prev.notifications[setting]
      }
    }))
  }

  const handlePrivacyToggle = (category, setting) => {
    setAccountSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [setting]: !prev.privacy[setting]
      }
    }))
  }

  const handlePreferenceChange = (category, setting, value) => {
    setAccountSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [setting]: value
      }
    }))
  }

  const handleDataExport = async () => {
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Get user's properties
      const { data: properties, error } = await supabase
        .from('houses')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      // Create export data
      const exportData = {
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name,
          created_at: user.created_at
        },
        properties: properties,
        export_date: new Date().toISOString()
      }

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `smart-house-locator-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setMessage({ type: 'success', text: 'Data exported successfully!' })
    } catch (error) {
      console.error('Error exporting data:', error)
      setMessage({ type: 'error', text: 'Failed to export data' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccountDeletion = async () => {
    if (!confirm('Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete all your data.')) {
      return
    }

    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Delete all user's properties first
      const { error: deleteError } = await supabase
        .from('houses')
        .delete()
        .eq('user_id', user.id)

      if (deleteError) {
        throw deleteError
      }

      // Delete the user account
      const { error } = await supabase.auth.admin.deleteUser(user.id)

      if (error) {
        throw error
      }

      // Sign out and redirect
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error deleting account:', error)
      setMessage({ type: 'error', text: 'Failed to delete account. Please contact support.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Account Settings</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Preferences
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Communication Channels</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700">Email Notifications</span>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle('notifications', 'email')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        accountSettings.notifications.email ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        accountSettings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Smartphone className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700">Push Notifications</span>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle('notifications', 'push')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        accountSettings.notifications.push ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        accountSettings.notifications.push ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Smartphone className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700">SMS Notifications</span>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle('notifications', 'sms')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        accountSettings.notifications.sms ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        accountSettings.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Notification Types</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Property Updates</span>
                    <button
                      onClick={() => handleNotificationToggle('notifications', 'propertyUpdates')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        accountSettings.notifications.propertyUpdates ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        accountSettings.notifications.propertyUpdates ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">New Properties</span>
                    <button
                      onClick={() => handleNotificationToggle('notifications', 'newProperties')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        accountSettings.notifications.newProperties ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        accountSettings.notifications.newProperties ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Weekly Reports</span>
                    <button
                      onClick={() => handleNotificationToggle('notifications', 'weeklyReport')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        accountSettings.notifications.weeklyReport ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        accountSettings.notifications.weeklyReport ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Privacy Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Profile Visibility</h3>
                  <p className="text-sm text-gray-600">Control who can see your profile information</p>
                </div>
                <select
                  value={accountSettings.privacy.profileVisibility}
                  onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">Show Email Address</span>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('privacy', 'showEmail')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      accountSettings.privacy.showEmail ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      accountSettings.privacy.showEmail ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Smartphone className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">Show Phone Number</span>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('privacy', 'showPhone')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      accountSettings.privacy.showPhone ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      accountSettings.privacy.showPhone ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">Allow Messages</span>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('privacy', 'allowMessages')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      accountSettings.privacy.allowMessages ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      accountSettings.privacy.allowMessages ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">Data Sharing</span>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('privacy', 'dataSharing')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      accountSettings.privacy.dataSharing ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      accountSettings.privacy.dataSharing ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Preferences
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    value={accountSettings.preferences.language}
                    onChange={(e) => handlePreferenceChange('preferences', 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    value={accountSettings.preferences.timezone}
                    onChange={(e) => handlePreferenceChange('preferences', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Format
                  </label>
                  <select
                    value={accountSettings.preferences.dateFormat}
                    onChange={(e) => handlePreferenceChange('preferences', 'dateFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={accountSettings.preferences.currency}
                    onChange={(e) => handlePreferenceChange('preferences', 'currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="KES">KES (KSh)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Data Management
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Export Your Data</h3>
                  <p className="text-sm text-gray-600">Download all your property data as a JSON file</p>
                </div>
                <button
                  onClick={handleDataExport}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isLoading ? 'Exporting...' : 'Export Data'}
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-red-900">Delete Account</h3>
                  <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
                </div>
                <button
                  onClick={handleAccountDeletion}
                  disabled={isLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSettingsUpdate}
              disabled={isLoading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save All Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings
