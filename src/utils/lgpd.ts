import CryptoJS from 'crypto-js'

// Chave de criptografia (em produção, deve vir de variável de ambiente)
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production'

/**
 * Utilitários para conformidade com LGPD
 */
export class LGPDUtils {
  /**
   * Mascara CPF para exibição
   * @param cpf CPF completo
   * @returns CPF mascarado (ex: 123.***.**-45)
   */
  static maskCPF(cpf: string): string {
    if (!cpf) return ''
    const cleanCPF = cpf.replace(/\D/g, '')
    if (cleanCPF.length !== 11) return cpf
    
    return `${cleanCPF.slice(0, 3)}.***.**-${cleanCPF.slice(-2)}`
  }

  /**
   * Mascara RG para exibição
   * @param rg RG completo
   * @returns RG mascarado
   */
  static maskRG(rg: string): string {
    if (!rg) return ''
    const cleanRG = rg.replace(/\D/g, '')
    if (cleanRG.length < 4) return rg
    
    return `***${cleanRG.slice(-4)}`
  }

  /**
   * Mascara telefone para exibição
   * @param phone Telefone completo
   * @returns Telefone mascarado
   */
  static maskPhone(phone: string): string {
    if (!phone) return ''
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length < 4) return phone
    
    return `****-${cleanPhone.slice(-4)}`
  }

  /**
   * Mascara email para exibição
   * @param email Email completo
   * @returns Email mascarado
   */
  static maskEmail(email: string): string {
    if (!email) return ''
    const [localPart, domain] = email.split('@')
    if (!localPart || !domain) return email
    
    const maskedLocal = localPart.length > 2 
      ? `${localPart[0]}***${localPart.slice(-1)}`
      : '***'
    
    return `${maskedLocal}@${domain}`
  }

  /**
   * Criptografa dados sensíveis
   * @param data Dados a serem criptografados
   * @returns Dados criptografados
   */
  static encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString()
    } catch (error) {
      console.error('Erro ao criptografar dados:', error)
      throw new Error('Falha na criptografia')
    }
  }

  /**
   * Descriptografa dados
   * @param encryptedData Dados criptografados
   * @returns Dados descriptografados
   */
  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
      return bytes.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error('Erro ao descriptografar dados:', error)
      throw new Error('Falha na descriptografia')
    }
  }

  /**
   * Anonimiza dados para exportação
   * @param data Dados originais
   * @returns Dados anonimizados
   */
  static anonymizeForExport(data: any): any {
    const anonymized = { ...data }
    
    // Remove ou mascara campos sensíveis
    if (anonymized.cpf) {
      anonymized.cpf = this.maskCPF(anonymized.cpf)
    }
    
    if (anonymized.rg) {
      anonymized.rg = this.maskRG(anonymized.rg)
    }
    
    if (anonymized.phone) {
      anonymized.phone = this.maskPhone(anonymized.phone)
    }
    
    if (anonymized.whatsapp) {
      anonymized.whatsapp = this.maskPhone(anonymized.whatsapp)
    }
    
    if (anonymized.email) {
      anonymized.email = this.maskEmail(anonymized.email)
    }
    
    // Remove campos completamente sensíveis
    delete anonymized.notes
    
    return anonymized
  }

  /**
   * Valida se o usuário tem consentimento para processamento de dados
   * @param personId ID da pessoa
   * @returns Promise<boolean>
   */
  static async hasConsent(_personId: string): Promise<boolean> {
    // Em uma implementação real, verificaria no banco de dados
    // Por enquanto, assume que há consentimento
    return true
  }

  /**
   * Registra consentimento do titular dos dados
   * @param personId ID da pessoa
   * @param consentType Tipo de consentimento
   * @param granted Se foi concedido ou revogado
   */
  static async recordConsent(
    personId: string, 
    consentType: string, 
    granted: boolean
  ): Promise<void> {
    // Em uma implementação real, salvaria no banco de dados
    console.log(`Consentimento registrado: ${personId} - ${consentType} - ${granted}`)
  }

  /**
   * Gera hash para verificação de integridade
   * @param data Dados para gerar hash
   * @returns Hash SHA-256
   */
  static generateHash(data: string): string {
    return CryptoJS.SHA256(data).toString()
  }

  /**
   * Verifica se os dados foram alterados
   * @param data Dados atuais
   * @param originalHash Hash original
   * @returns Se os dados foram alterados
   */
  static verifyIntegrity(data: string, originalHash: string): boolean {
    const currentHash = this.generateHash(data)
    return currentHash === originalHash
  }
}

/**
 * Hook para usar utilitários LGPD em componentes
 */
export function useLGPD() {
  return {
    maskCPF: LGPDUtils.maskCPF,
    maskRG: LGPDUtils.maskRG,
    maskPhone: LGPDUtils.maskPhone,
    maskEmail: LGPDUtils.maskEmail,
    anonymizeForExport: LGPDUtils.anonymizeForExport,
    hasConsent: LGPDUtils.hasConsent,
    recordConsent: LGPDUtils.recordConsent
  }
}

// Exportações diretas para compatibilidade
export const maskCPF = LGPDUtils.maskCPF;
export const maskRG = LGPDUtils.maskRG;
export const maskPhone = LGPDUtils.maskPhone;
export const maskEmail = LGPDUtils.maskEmail;
export const encryptData = LGPDUtils.encrypt;
export const decryptData = LGPDUtils.decrypt;
export const maskSensitiveData = LGPDUtils.anonymizeForExport;
export const generateHash = LGPDUtils.generateHash;
export const verifyIntegrity = LGPDUtils.verifyIntegrity;