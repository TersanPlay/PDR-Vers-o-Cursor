import { 
  CabinetCredentials, 
  CabinetCredentialsUpdateData, 
  CredentialsAuditLog, 
  PasswordValidationResult, 
  PasswordValidationRules 
} from '../types'
import { auditService } from './auditService'

// Regras de validação de senha
const PASSWORD_RULES: PasswordValidationRules = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  forbiddenPatterns: [
    '123456',
    'password',
    'admin',
    'gabinete',
    'qwerty'
  ]
}

class CredentialsService {
  private baseUrl = '/api/credentials'

  // Validação de senha
  validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = []
    let strength: 'weak' | 'medium' | 'strong' = 'weak'

    // Verificar comprimento mínimo
    if (password.length < PASSWORD_RULES.minLength) {
      errors.push(`A senha deve ter pelo menos ${PASSWORD_RULES.minLength} caracteres`)
    }

    // Verificar maiúsculas
    if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra maiúscula')
    }

    // Verificar minúsculas
    if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra minúscula')
    }

    // Verificar números
    if (PASSWORD_RULES.requireNumbers && !/\d/.test(password)) {
      errors.push('A senha deve conter pelo menos um número')
    }

    // Verificar caracteres especiais
    if (PASSWORD_RULES.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('A senha deve conter pelo menos um caractere especial')
    }

    // Verificar padrões proibidos
    const lowerPassword = password.toLowerCase()
    for (const pattern of PASSWORD_RULES.forbiddenPatterns) {
      if (lowerPassword.includes(pattern)) {
        errors.push(`A senha não pode conter o padrão: ${pattern}`)
      }
    }

    // Calcular força da senha
    if (errors.length === 0) {
      let score = 0
      if (password.length >= 12) score += 2
      else if (password.length >= 10) score += 1
      
      if (/[A-Z]/.test(password)) score += 1
      if (/[a-z]/.test(password)) score += 1
      if (/\d/.test(password)) score += 1
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
      if (/[^\w\s]/.test(password)) score += 1

      if (score >= 6) strength = 'strong'
      else if (score >= 4) strength = 'medium'
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength
    }
  }

  // Buscar credenciais de um gabinete
  async getCabinetCredentials(cabinetId: string): Promise<CabinetCredentials | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${cabinetId}`)
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error('Erro ao buscar credenciais')
      }
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar credenciais:', error)
      throw error
    }
  }

  // Atualizar credenciais de um gabinete
  async updateCabinetCredentials(
    cabinetId: string, 
    data: CabinetCredentialsUpdateData,
    performedBy: string
  ): Promise<CabinetCredentials> {
    try {
      // Validar senha se fornecida
      if (data.password) {
        const validation = this.validatePassword(data.password)
        if (!validation.isValid) {
          throw new Error(`Senha inválida: ${validation.errors.join(', ')}`)
        }

        // Verificar se as senhas coincidem
        if (data.password !== data.confirmPassword) {
          throw new Error('As senhas não coincidem')
        }
      }

      const response = await fetch(`${this.baseUrl}/${cabinetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          confirmPassword: undefined // Não enviar confirmPassword para o backend
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao atualizar credenciais')
      }

      const updatedCredentials = await response.json()

      // Registrar auditoria
      await this.logCredentialsAudit({
        cabinetId,
        action: data.password ? 'password_change' : 
                data.username ? 'username_change' : 'email_change',
        performedBy,
        oldValue: data.username ? 'username_anterior' : data.email ? 'email_anterior' : undefined,
        newValue: data.username || data.email || undefined
      })

      return updatedCredentials
    } catch (error) {
      console.error('Erro ao atualizar credenciais:', error)
      throw error
    }
  }

  // Registrar log de auditoria para credenciais
  private async logCredentialsAudit(data: {
    cabinetId: string
    action: 'username_change' | 'email_change' | 'password_change' | 'credentials_view'
    performedBy: string
    oldValue?: string
    newValue?: string
  }): Promise<void> {
    try {
      await auditService.log({
        userId: data.performedBy,
        action: data.action === 'username_change' ? 'username_change' :
                data.action === 'email_change' ? 'credentials_update' :
                data.action === 'password_change' ? 'password_change' : 'read',
        resourceType: 'credentials',
        resourceId: data.cabinetId,
        details: `${data.action}: ${data.oldValue ? `${data.oldValue} -> ` : ''}${data.newValue || 'senha alterada'}`
      })
    } catch (error) {
      console.error('Erro ao registrar auditoria de credenciais:', error)
    }
  }

  // Buscar logs de auditoria de credenciais
  async getCredentialsAuditLogs(cabinetId?: string): Promise<CredentialsAuditLog[]> {
    try {
      const url = cabinetId 
        ? `${this.baseUrl}/audit/${cabinetId}`
        : `${this.baseUrl}/audit`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Erro ao buscar logs de auditoria')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar logs de auditoria:', error)
      throw error
    }
  }

  // Gerar senha segura
  generateSecurePassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    let password = ''
    
    // Garantir pelo menos um caractere de cada tipo
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]
    
    // Preencher o restante
    const allChars = uppercase + lowercase + numbers + symbols
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }
    
    // Embaralhar a senha
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }
}

export const credentialsService = new CredentialsService()