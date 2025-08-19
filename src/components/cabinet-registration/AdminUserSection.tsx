import React from 'react'
import { User, Eye, EyeOff } from 'lucide-react'
import { CabinetRegistrationData } from '../../types'

interface AdminUserSectionProps {
  formData: CabinetRegistrationData
  showPassword: boolean
  showConfirmPassword: boolean
  passwordStrength: 'weak' | 'medium' | 'strong' | null
  onInputChange: (field: string, value: string) => void
  onTogglePassword: () => void
  onToggleConfirmPassword: () => void
  onPasswordChange: (value: string) => void
}

/**
 * Componente para a seção de dados do usuário administrador
 */
export const AdminUserSection: React.FC<AdminUserSectionProps> = ({
  formData,
  showPassword,
  showConfirmPassword,
  passwordStrength,
  onInputChange,
  onTogglePassword,
  onToggleConfirmPassword,
  onPasswordChange
}) => {
  return (
    <div className="space-y-6 border-t pt-8">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <User className="h-5 w-5 text-blue-600" />
        Dados do Usuário Administrador
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            value={formData.adminName}
            onChange={(e) => onInputChange('adminName', e.target.value)}
            placeholder="Nome completo do administrador"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            value={formData.adminPhone || ''}
            onChange={(e) => onInputChange('adminPhone', e.target.value)}
            placeholder="(11) 99999-9999"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-mail (será usado para login) *
          </label>
          <input
            type="email"
            value={formData.adminEmail}
            onChange={(e) => onInputChange('adminEmail', e.target.value)}
            placeholder="admin@gabinete.gov.br"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Senha *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {passwordStrength && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength === 'weak' ? 'w-1/3 bg-red-500' :
                      passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' :
                      'w-full bg-green-500'
                    }`}
                  />
                </div>
                <span className={`text-sm font-medium ${
                  passwordStrength === 'weak' ? 'text-red-600' :
                  passwordStrength === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {passwordStrength === 'weak' ? 'Fraca' :
                   passwordStrength === 'medium' ? 'Média' : 'Forte'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Senha *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => onInputChange('confirmPassword', e.target.value)}
              placeholder="Digite a senha novamente"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={onToggleConfirmPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}