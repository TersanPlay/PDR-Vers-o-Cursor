import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, User, Mail, Phone, MapPin, Globe, Facebook, Instagram, Music, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { authService } from '../services/authService'
import { validatePasswordStrength, validateEmail, validatePhone, validateURL, sanitizeInput } from '../utils/validation'
import { CabinetRegistrationData } from '../types'

export default function CabinetRegistrationPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null)

  const [formData, setFormData] = useState<CabinetRegistrationData>({
    // Dados do gabinete
    cabinetName: '',
    councilMemberName: '',
    municipality: '',
    city: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      zipCode: ''
    },
    institutionalPhone: '',
    institutionalEmail: '',
    website: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      tiktok: ''
    },
    // Dados do usuário administrador
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CabinetRegistrationData],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const validateForm = (): boolean => {
    // Campos obrigatórios
    if (!formData.cabinetName.trim()) {
      setError('Nome do gabinete é obrigatório')
      return false
    }
    if (!formData.councilMemberName.trim()) {
      setError('Nome do vereador é obrigatório')
      return false
    }
    if (!formData.municipality.trim()) {
      setError('Município é obrigatório')
      return false
    }
    if (!formData.city.trim()) {
      setError('Cidade é obrigatória')
      return false
    }
    if (!formData.adminName.trim()) {
      setError('Nome do administrador é obrigatório')
      return false
    }
    if (!formData.adminEmail.trim()) {
      setError('E-mail do administrador é obrigatório')
      return false
    }
    if (!formData.password) {
      setError('Senha é obrigatória')
      return false
    }
    if (!formData.confirmPassword) {
      setError('Confirmação de senha é obrigatória')
      return false
    }

    // Validação de e-mail usando função utilitária
    if (!validateEmail(formData.adminEmail)) {
      setError('E-mail inválido')
      return false
    }

    // Validação de e-mail institucional se fornecido
    if (formData.institutionalEmail && !validateEmail(formData.institutionalEmail)) {
      setError('E-mail institucional inválido')
      return false
    }

    // Validação de telefones se fornecidos
    if (formData.institutionalPhone && !validatePhone(formData.institutionalPhone)) {
      setError('Telefone institucional inválido')
      return false
    }

    if (formData.adminPhone && !validatePhone(formData.adminPhone)) {
      setError('Telefone do administrador inválido')
      return false
    }

    // Validação de URLs se fornecidas
    if (formData.website && !validateURL(formData.website)) {
      setError('Website inválido')
      return false
    }

    if (formData.socialMedia?.facebook && !validateURL(formData.socialMedia.facebook)) {
      setError('URL do Facebook inválida')
      return false
    }

    if (formData.socialMedia?.instagram && !validateURL(formData.socialMedia.instagram)) {
      setError('URL do Instagram inválida')
      return false
    }

    if (formData.socialMedia?.tiktok && !validateURL(formData.socialMedia.tiktok)) {
      setError('URL do TikTok inválida')
      return false
    }

    // Validação de força da senha
    const passwordValidation = validatePasswordStrength(formData.password)
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0])
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Senhas não coincidem')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await authService.registerCabinet(formData)
      
      if (result.success) {
        setSuccess(result.message)
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao cadastrar gabinete')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-t-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Cadastro de Gabinete</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Registre seu gabinete no sistema e comece a gerenciar seus contatos e interações
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Mensagens */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span>{success}</span>
            </div>
          )}

          {/* Dados do Gabinete */}
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
                  onChange={(e) => handleInputChange('cabinetName', e.target.value)}
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
                  onChange={(e) => handleInputChange('councilMemberName', e.target.value)}
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
                  onChange={(e) => handleInputChange('municipality', e.target.value)}
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
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Nome da cidade"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Endereço */}
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
                    onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                    placeholder="CEP"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={formData.address?.street || ''}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
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
                    onChange={(e) => handleInputChange('address.number', e.target.value)}
                    placeholder="Número"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.address?.complement || ''}
                    onChange={(e) => handleInputChange('address.complement', e.target.value)}
                    placeholder="Complemento"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.address?.neighborhood || ''}
                    onChange={(e) => handleInputChange('address.neighborhood', e.target.value)}
                    placeholder="Bairro"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Contatos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  Telefone Institucional
                </label>
                <input
                  type="tel"
                  value={formData.institutionalPhone || ''}
                  onChange={(e) => handleInputChange('institutionalPhone', e.target.value)}
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
                  onChange={(e) => handleInputChange('institutionalEmail', e.target.value)}
                  placeholder="contato@gabinete.gov.br"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Website e Redes Sociais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Website e Redes Sociais (Opcional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://www.gabinete.gov.br"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={formData.socialMedia?.facebook || ''}
                    onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                    placeholder="https://facebook.com/gabinete"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-blue-600" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.socialMedia?.instagram || ''}
                    onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                    placeholder="https://instagram.com/gabinete"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Music className="h-4 w-4 text-blue-600" />
                    TikTok
                  </label>
                  <input
                    type="url"
                    value={formData.socialMedia?.tiktok || ''}
                    onChange={(e) => handleInputChange('socialMedia.tiktok', e.target.value)}
                    placeholder="https://tiktok.com/@gabinete"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dados do Administrador */}
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
                  onChange={(e) => handleInputChange('adminName', e.target.value)}
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
                  onChange={(e) => handleInputChange('adminPhone', e.target.value)}
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
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
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
                    onChange={(e) => {
                      const value = e.target.value
                      handleInputChange('password', value)
                      if (value) {
                        const validation = validatePasswordStrength(value)
                        setPasswordStrength(validation.strength)
                      } else {
                        setPasswordStrength(null)
                      }
                    }}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Digite a senha novamente"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar Gabinete'}
            </button>
            
            <Link
              to="/login"
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-center"
            >
              Já tenho conta
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}