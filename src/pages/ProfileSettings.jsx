import React, { useState, useEffect } from 'react'
import { User, Camera, Save, ArrowLeft, Eye, EyeOff, Shield, Mail, Phone, MapPin, Calendar } from 'lucide-react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

const ProfileSettings = ({ user }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showPassword, setShowPassword] = useState(false)
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar_url: ''
  })

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.user_metadata?.name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        location: user.user_metadata?.location || '',
        bio: user.user_metadata?.bio || '',
        avatar_url: user.user_metadata?.avatar_url || ''
      })
    }
  }, [user])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: profileData.name,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url
        }
      })

      if (error) {
        throw error
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      
      // Update local user state
      const { data: { user: updatedUser } } = await supabase.auth.getUser()
      if (updatedUser) {
        // Force a page refresh to update the user context
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      setIsLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' })
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) {
        throw error
      }

      setMessage({ type: 'success', text: 'Password updated successfully!' })
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Error updating password:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage({ type: 'error', text: 'File size must be less than 5MB' })
      return
    }

    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setProfileData(prev => ({ ...prev, avatar_url: publicUrl }))
      setMessage({ type: 'success', text: 'Avatar uploaded successfully!' })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setMessage({ type: 'error', text: 'Failed to upload avatar' })
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
              <h1 className="text-xl font-semibold text-gray-900">Profile Settings</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Avatar Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Picture
              </h2>
              
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profileData.avatar_url ? (
                      <img 
                        src={profileData.avatar_url} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Update Profile Picture</h3>
                  <p className="text-sm text-gray-600">Upload a new profile picture (max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      placeholder="Email address"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Security Settings */}
          <div className="space-y-6">
            {/* Password Change */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Change Password
              </h2>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Account Information
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">{user?.email}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">
                    Joined {new Date(user?.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Shield className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">
                    {user?.email_confirmed_at ? 'Email Verified' : 'Email Not Verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
              <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      // Handle account deletion
                      console.log('Account deletion requested')
                    }
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings
