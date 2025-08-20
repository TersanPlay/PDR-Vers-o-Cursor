import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { validatePasswordStrength, validateEmail } from '../utils/validation'
import { CabinetRegistrationData } from '../types'
import {
  CabinetFormHeader,
  FormMessages,
  CabinetBasicInfo,
  ContactInfo,
  AdminUserSection,
  FormActions
} from '../components/cabinet-registration'

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
    institutionalEmail: '',
    // Dados do usuário administrador
    adminName: '',
    adminEmail: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => {
        const parentValue = prev[parent as keyof CabinetRegistrationData]
        return {
          ...prev,
          [parent]: {
            ...(typeof parentValue === 'object' && parentValue !== null ? parentValue : {}),
            [child]: value
          }
        }
      })
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }



  const handlePasswordChange = (value: string) => {
    handleInputChange('password', value)
    if (value) {
      const validation = validatePasswordStrength(value)
      setPasswordStrength(validation.strength)
    } else {
      setPasswordStrength(null)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
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
    if (!formData.institutionalEmail.trim()) {
      setError('E-mail institucional é obrigatório')
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

    // Validação de e-mails usando função utilitária
    if (!validateEmail(formData.adminEmail)) {
      setError('E-mail do administrador inválido')
      return false
    }

    if (!validateEmail(formData.institutionalEmail)) {
      setError('E-mail institucional inválido')
      return false
    }

    // Validações de URLs removidas - campos não existem mais

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
        <CabinetFormHeader />

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <FormMessages error={error} success={success} />

          <CabinetBasicInfo 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <ContactInfo 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <AdminUserSection
            formData={formData}
            onInputChange={handleInputChange}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            passwordStrength={passwordStrength}
            onPasswordChange={handlePasswordChange}
            onTogglePassword={togglePasswordVisibility}
            onToggleConfirmPassword={toggleConfirmPasswordVisibility}
          />

          <FormActions isLoading={isLoading} />
        </form>
      </div>
    </div>
  )
}