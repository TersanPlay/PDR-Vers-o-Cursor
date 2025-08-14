/**
 * Utilitários para validação e formatação de dados
 */

/**
 * Valida CPF
 * @param cpf CPF para validar
 * @returns Se o CPF é válido
 */
export function validateCPF(cpf: string): boolean {
  if (!cpf) return false
  
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '')
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  
  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = 11 - (sum % 11)
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false
  
  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = 11 - (sum % 11)
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false
  
  return true
}

/**
 * Formata CPF
 * @param cpf CPF para formatar
 * @returns CPF formatado (xxx.xxx.xxx-xx)
 */
export function formatCPF(cpf: string): string {
  if (!cpf) return ''
  const cleanCPF = cpf.replace(/\D/g, '')
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Valida CEP
 * @param cep CEP para validar
 * @returns Se o CEP é válido
 */
export function validateCEP(cep: string): boolean {
  if (!cep) return false
  const cleanCEP = cep.replace(/\D/g, '')
  return cleanCEP.length === 8
}

/**
 * Formata CEP
 * @param cep CEP para formatar
 * @returns CEP formatado (xxxxx-xxx)
 */
export function formatCEP(cep: string): string {
  if (!cep) return ''
  const cleanCEP = cep.replace(/\D/g, '')
  return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2')
}

/**
 * Valida telefone
 * @param phone Telefone para validar
 * @returns Se o telefone é válido
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false
  const cleanPhone = phone.replace(/\D/g, '')
  return cleanPhone.length >= 10 && cleanPhone.length <= 11
}

/**
 * Formata telefone
 * @param phone Telefone para formatar
 * @returns Telefone formatado
 */
export function formatPhone(phone: string): string {
  if (!phone) return ''
  const cleanPhone = phone.replace(/\D/g, '')
  
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  } else if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  
  return phone
}

/**
 * Valida email
 * @param email Email para validar
 * @returns Se o email é válido
 */
export function validateEmail(email: string): boolean {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida data de nascimento
 * @param birthDate Data de nascimento
 * @returns Se a data é válida
 */
export function validateBirthDate(birthDate: string): boolean {
  if (!birthDate) return false
  
  const date = new Date(birthDate)
  const now = new Date()
  
  // Verifica se é uma data válida
  if (isNaN(date.getTime())) return false
  
  // Verifica se não é uma data futura
  if (date > now) return false
  
  // Verifica se a pessoa não tem mais de 120 anos
  const maxAge = new Date()
  maxAge.setFullYear(maxAge.getFullYear() - 120)
  if (date < maxAge) return false
  
  return true
}

/**
 * Formata data para exibição
 * @param date Data para formatar
 * @returns Data formatada (dd/mm/aaaa)
 */
export function formatDate(date: Date | string): string {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return ''
  
  return dateObj.toLocaleDateString('pt-BR')
}

/**
 * Formata data e hora para exibição
 * @param date Data para formatar
 * @returns Data e hora formatadas (dd/mm/aaaa hh:mm)
 */
export function formatDateTime(date: Date | string): string {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return ''
  
  return dateObj.toLocaleString('pt-BR')
}

/**
 * Remove caracteres especiais de uma string
 * @param str String para limpar
 * @returns String apenas com números
 */
export function onlyNumbers(str: string): string {
  return str.replace(/\D/g, '')
}

/**
 * Capitaliza primeira letra de cada palavra
 * @param str String para capitalizar
 * @returns String capitalizada
 */
export function capitalizeWords(str: string): string {
  if (!str) return ''
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Valida se uma string não está vazia
 * @param value Valor para validar
 * @returns Se o valor é válido
 */
export function validateRequired(value: string): boolean {
  return value != null && value.trim().length > 0
}

/**
 * Valida tamanho mínimo de string
 * @param value Valor para validar
 * @param minLength Tamanho mínimo
 * @returns Se o valor atende ao tamanho mínimo
 */
export function validateMinLength(value: string, minLength: number): boolean {
  return value != null && value.length >= minLength
}

/**
 * Valida tamanho máximo de string
 * @param value Valor para validar
 * @param maxLength Tamanho máximo
 * @returns Se o valor atende ao tamanho máximo
 */
export function validateMaxLength(value: string, maxLength: number): boolean {
  return value == null || value.length <= maxLength
}

/**
 * Valida a força de uma senha
 * @param password - Senha a ser validada
 * @returns Objeto com resultado da validação e mensagens
 */
export const validatePasswordStrength = (password: string) => {
  const errors: string[] = []
  
  // Verificações de força da senha
  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula')
  }
  
  if (!/\d/.test(password)) {
    errors.push('A senha deve conter pelo menos um número')
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('A senha deve conter pelo menos um caractere especial')
  }
  
  // Verificar sequências comuns
  const commonSequences = ['123456', 'abcdef', 'qwerty', 'password']
  const lowerPassword = password.toLowerCase()
  
  for (const sequence of commonSequences) {
    if (lowerPassword.includes(sequence)) {
      errors.push('A senha não deve conter sequências comuns')
      break
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: getPasswordStrength(password)
  }
}

/**
 * Calcula o nível de força da senha
 * @param password - Senha a ser avaliada
 * @returns Nível de força (weak, medium, strong)
 */
const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  let score = 0
  
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++
  if (password.length >= 16) score++
  
  if (score <= 3) return 'weak'
  if (score <= 5) return 'medium'
  return 'strong'
}

/**
 * Sanitiza string removendo caracteres perigosos
 * @param input - String a ser sanitizada
 * @returns String sanitizada
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove tags HTML
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
}

/**
 * Valida se uma string contém apenas caracteres alfanuméricos e alguns especiais permitidos
 * @param input - String a ser validada
 * @returns True se for válida
 */
export const validateSafeString = (input: string): boolean => {
  // Permite letras, números, espaços, hífens, pontos, vírgulas, parênteses e acentos
  const safeRegex = /^[a-zA-ZÀ-ÿ0-9\s\-.,()@]+$/
  return safeRegex.test(input)
}

/**
 * Valida URL
 * @param url - URL a ser validada
 * @returns True se a URL for válida
 */
export const validateURL = (url: string): boolean => {
  if (!url) return true // URL é opcional
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}