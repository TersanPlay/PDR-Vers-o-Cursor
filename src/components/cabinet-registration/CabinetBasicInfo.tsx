import React from 'react'
import { Building2 } from 'lucide-react'
import { CabinetRegistrationData } from '@/types'

interface CabinetBasicInfoProps {
  formData: CabinetRegistrationData
  onInputChange: (field: string, value: string) => void
}

/**
 * Componente para os campos básicos do gabinete
 */
export const CabinetBasicInfo: React.FC<CabinetBasicInfoProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-blue-600" />
        Dados do Gabinete
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Gabinete *
        </label>
        <input
          type="text"
          value={formData.cabinetName}
          onChange={(e) => onInputChange('cabinetName', e.target.value)}
          placeholder="Ex: Gabinete do Vereador João Silva"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
    </div>
  )
}