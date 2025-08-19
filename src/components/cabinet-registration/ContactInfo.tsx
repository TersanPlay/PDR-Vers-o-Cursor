import React from 'react'
import { Phone, Mail } from 'lucide-react'
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Phone className="h-4 w-4 text-blue-600" />
          Telefone Institucional
        </label>
        <input
          type="tel"
          value={formData.institutionalPhone || ''}
          onChange={(e) => onInputChange('institutionalPhone', e.target.value)}
          placeholder="(11) 99999-9999"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Mail className="h-4 w-4 text-blue-600" />
          E-mail Institucional
        </label>
        <input
          type="email"
          value={formData.institutionalEmail || ''}
          onChange={(e) => onInputChange('institutionalEmail', e.target.value)}
          placeholder="contato@gabinete.gov.br"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  )
}