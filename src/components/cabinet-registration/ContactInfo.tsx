import React from 'react'
import { CabinetRegistrationData } from '@/types'

interface ContactInfoProps {
  formData: CabinetRegistrationData
  onInputChange: (field: string, value: string) => void
}

/**
 * Componente para os campos de contato institucional
 */
export const ContactInfo: React.FC<ContactInfoProps> = ({ formData, onInputChange }) => {
  return (
    <div>
      <label htmlFor="institutionalEmail" className="block text-sm font-medium text-gray-700 mb-2">
        E-mail Institucional *
      </label>
      <input
        type="email"
        id="institutionalEmail"
        value={formData.institutionalEmail || ''}
        onChange={(e) => onInputChange('institutionalEmail', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="contato@gabinete.gov.br"
        required
      />
    </div>
  )
}