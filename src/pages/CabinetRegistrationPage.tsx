import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { validatePasswordStrength, validateEmail, validatePhone, validateURL } from '../utils/validation'
import { CabinetRegistrationData } from '../types'
import {
  CabinetFormHeader,
  FormMessages,
  CabinetBasicInfo,
  AddressSection,
  ContactInfo,
  PhotoUpload,
  SocialMediaSection,
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
  const [dragActive, setDragActive] = useState(false)

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
    // Upload de brasão ou foto do vereador
    councilMemberPhoto: null,
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

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      councilMemberPhoto: file
    }))
  }

  const validateImageFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      setError('Formato de arquivo não suportado. Use JPG, PNG ou WebP.')
      return false
    }
    
    if (file.size > maxSize) {
      setError('Arquivo muito grande. O tamanho máximo é 5MB.')
      return false
    }
    
    return true
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (validateImageFile(file)) {
        handleFileChange(file)
      }
    }
  }

  const openFileDialog = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpeg,image/jpg,image/png,image/webp'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file && validateImageFile(file)) {
        handleFileChange(file)
      }
    }
    input.click()
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
        <CabinetFormHeader />

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <FormMessages error={error} success={success} />

          <CabinetBasicInfo 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <AddressSection 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <ContactInfo 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <PhotoUpload
            formData={formData}
            onFileChange={handleFileChange}
            isDragOver={dragActive}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onOpenFileDialog={openFileDialog}
          />

          <SocialMediaSection 
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