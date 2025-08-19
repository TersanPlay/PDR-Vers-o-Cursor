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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Vereador *
          </label>
          <input
            type="text"
            value={formData.councilMemberName}
            onChange={(e) => onInputChange('councilMemberName', e.target.value)}
            placeholder="Nome completo do vereador"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Município *
          </label>
          <input
            type="text"
            value={formData.municipality}
            onChange={(e) => onInputChange('municipality', e.target.value)}
            placeholder="Nome do município"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cidade *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => onInputChange('city', e.target.value)}
            placeholder="Nome da cidade"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>
    </div>
  )
}