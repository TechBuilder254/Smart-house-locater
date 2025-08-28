import React from 'react'
import { CheckCircle } from 'lucide-react'

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content text-center" onClick={(e) => e.stopPropagation()}>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-secondary-800 mb-2">
          House Added Successfully!
        </h3>
        
        <p className="text-secondary-600 mb-6">
          {message}
        </p>
        
        <button
          onClick={onClose}
          className="btn btn-primary"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default SuccessModal

