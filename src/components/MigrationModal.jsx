import React, { useState } from 'react'
import { Database, Upload, CheckCircle, AlertCircle, X } from 'lucide-react'
import apiService from '../services/api'

const MigrationModal = ({ isOpen, onClose, onMigrationComplete }) => {
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationStatus, setMigrationStatus] = useState(null)
  const [localData, setLocalData] = useState([])

  // Check for existing localStorage data
  React.useEffect(() => {
    if (isOpen) {
      const savedHouses = localStorage.getItem('houses')
      if (savedHouses) {
        try {
          const parsedData = JSON.parse(savedHouses)
          setLocalData(parsedData)
        } catch (error) {
          console.error('Error parsing localStorage data:', error)
          setLocalData([])
        }
      }
    }
  }, [isOpen])

  const handleMigration = async () => {
    if (localData.length === 0) {
      setMigrationStatus({
        type: 'error',
        message: 'No data found in localStorage to migrate'
      })
      return
    }

    setIsMigrating(true)
    setMigrationStatus(null)

    try {
      const result = await apiService.migrateFromLocalStorage(localData)
      
      if (result.success) {
        setMigrationStatus({
          type: 'success',
          message: result.message,
          details: result.results
        })
        
        // Clear localStorage after successful migration
        localStorage.removeItem('houses')
        
        // Notify parent component
        if (onMigrationComplete) {
          onMigrationComplete()
        }
      } else {
        throw new Error(result.message || 'Migration failed')
      }
    } catch (error) {
      console.error('Migration error:', error)
      setMigrationStatus({
        type: 'error',
        message: error.message
      })
    } finally {
      setIsMigrating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Migrate to Cloud Database</h2>
              <p className="text-gray-600">Move your data from local storage to MongoDB</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Migration Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Why migrate to cloud?</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Access your data from any device</li>
              <li>• Never lose your property data</li>
              <li>• Automatic backups and security</li>
              <li>• Better performance and reliability</li>
            </ul>
          </div>

          {/* Local Data Summary */}
          {localData.length > 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Data Found</span>
              </div>
              <p className="text-green-700 text-sm">
                Found {localData.length} house{localData.length !== 1 ? 's' : ''} in your local storage ready to migrate.
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-800">No Local Data</span>
              </div>
              <p className="text-gray-700 text-sm">
                No houses found in local storage. You can start adding houses directly to the cloud database.
              </p>
            </div>
          )}

          {/* Migration Status */}
          {migrationStatus && (
            <div className={`border rounded-xl p-4 ${
              migrationStatus.type === 'success' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {migrationStatus.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-semibold ${
                  migrationStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {migrationStatus.type === 'success' ? 'Migration Successful' : 'Migration Failed'}
                </span>
              </div>
              <p className={`text-sm ${
                migrationStatus.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {migrationStatus.message}
              </p>
              
              {/* Migration Details */}
              {migrationStatus.details && (
                <div className="mt-3">
                  <details className="text-sm">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                      View migration details
                    </summary>
                    <div className="mt-2 space-y-1">
                      {migrationStatus.details.map((result, index) => (
                        <div key={index} className={`text-xs p-2 rounded ${
                          result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.success ? '✓' : '✗'} {result.originalId}: {result.success ? 'Migrated' : result.error}
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 btn btn-secondary"
              disabled={isMigrating}
            >
              Cancel
            </button>
            
            {localData.length > 0 && (
              <button
                onClick={handleMigration}
                disabled={isMigrating}
                className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMigrating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Migrating...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Migrate to Cloud
                  </>
                )}
              </button>
            )}
          </div>

          {/* Migration Progress */}
          {isMigrating && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-semibold text-blue-800">Migrating your data...</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
              <p className="text-blue-700 text-sm mt-2">
                Please wait while we transfer your {localData.length} house{localData.length !== 1 ? 's' : ''} to the cloud database.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MigrationModal
