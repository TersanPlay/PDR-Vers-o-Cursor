import React from 'react'
import { MapPin } from 'lucide-react'
import { CabinetRegistrationData } from '@/types'

interface AddressSectionProps {
  formData: CabinetRegistrationData
  onInputChange: (field: string, value: string) => void
}

/**
 * Componente para a seção de endereço institucional
 */
export const AddressSection: React.FC<AddressSectionProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-blue-600" />
        Endereço Institucional (Opcional)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            value={formData.address?.zipCode || ''}
            onChange={(e) => onInputChange('address.zipCode', e.target.value)}
            placeholder="CEP"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <input
            type="text"
            value={formData.address?.street || ''}
            onChange={(e) => onInputChange('address.street', e.target.value)}
            placeholder="Rua/Avenida"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            value={formData.address?.number || ''}
            onChange={(e) => onInputChange('address.number', e.target.value)}
            placeholder="Número"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <input
            type="text"
            value={formData.address?.complement || ''}
            onChange={(e) => onInputChange('address.complement', e.target.value)}
            placeholder="Complemento"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <input
            type="text"
            value={formData.address?.neighborhood || ''}
            onChange={(e) => onInputChange('address.neighborhood', e.target.value)}
            placeholder="Bairro"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}