import { Address } from '../types'

/**
 * Interface para resposta da API ViaCEP
 */
interface ViaCEPResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}

/**
 * Serviço para consulta de CEP
 */
class CEPService {
  private readonly VIACEP_URL = 'https://viacep.com.br/ws'
  private readonly TIMEOUT = 5000 // 5 segundos

  /**
   * Busca endereço por CEP
   * @param cep CEP para consulta (com ou sem formatação)
   * @returns Dados do endereço
   */
  async getAddressByCEP(cep: string): Promise<Partial<Address>> {
    try {
      // Limpar e validar CEP
      const cleanCEP = this.cleanCEP(cep)
      
      if (!this.isValidCEP(cleanCEP)) {
        throw new Error('CEP inválido')
      }

      // Fazer requisição para ViaCEP
      const response = await this.fetchWithTimeout(
        `${this.VIACEP_URL}/${cleanCEP}/json/`,
        this.TIMEOUT
      )

      if (!response.ok) {
        throw new Error('Erro na consulta do CEP')
      }

      const data: ViaCEPResponse = await response.json()

      // Verificar se CEP foi encontrado
      if (data.erro) {
        throw new Error('CEP não encontrado')
      }

      // Converter para formato interno
      return this.convertViaCEPToAddress(data)
    } catch (error) {
      console.error('Erro ao consultar CEP:', error)
      
      if (error instanceof Error) {
        throw error
      }
      
      throw new Error('Erro ao consultar CEP')
    }
  }

  /**
   * Busca CEPs por endereço
   * @param uf Estado (UF)
   * @param city Cidade
   * @param street Logradouro
   * @returns Lista de endereços encontrados
   */
  async searchCEPByAddress(
    uf: string,
    city: string,
    street: string
  ): Promise<Partial<Address>[]> {
    try {
      // Validar parâmetros
      if (!uf || !city || !street) {
        throw new Error('UF, cidade e logradouro são obrigatórios')
      }

      if (uf.length !== 2) {
        throw new Error('UF deve ter 2 caracteres')
      }

      if (street.length < 3) {
        throw new Error('Logradouro deve ter pelo menos 3 caracteres')
      }

      // Fazer requisição para ViaCEP
      const response = await this.fetchWithTimeout(
        `${this.VIACEP_URL}/${uf}/${encodeURIComponent(city)}/${encodeURIComponent(street)}/json/`,
        this.TIMEOUT
      )

      if (!response.ok) {
        throw new Error('Erro na busca de endereços')
      }

      const data: ViaCEPResponse[] = await response.json()

      // Verificar se encontrou resultados
      if (!Array.isArray(data) || data.length === 0) {
        return []
      }

      // Converter para formato interno
      return data.map(item => this.convertViaCEPToAddress(item))
    } catch (error) {
      console.error('Erro ao buscar endereços:', error)
      
      if (error instanceof Error) {
        throw error
      }
      
      throw new Error('Erro ao buscar endereços')
    }
  }

  /**
   * Valida formato do CEP
   * @param cep CEP para validar
   * @returns True se válido
   */
  isValidCEP(cep: string): boolean {
    const cleanCEP = this.cleanCEP(cep)
    return /^\d{8}$/.test(cleanCEP)
  }

  /**
   * Remove formatação do CEP
   * @param cep CEP com ou sem formatação
   * @returns CEP apenas com números
   */
  cleanCEP(cep: string): string {
    return cep.replace(/\D/g, '')
  }

  /**
   * Formata CEP para exibição
   * @param cep CEP sem formatação
   * @returns CEP formatado (00000-000)
   */
  formatCEP(cep: string): string {
    const cleanCEP = this.cleanCEP(cep)
    
    if (cleanCEP.length !== 8) {
      return cep
    }
    
    return `${cleanCEP.slice(0, 5)}-${cleanCEP.slice(5)}`
  }

  /**
   * Fetch com timeout
   * @param url URL para requisição
   * @param timeout Timeout em milissegundos
   * @returns Response da requisição
   */
  private async fetchWithTimeout(url: string, timeout: number): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Timeout na consulta do CEP')
      }
      
      throw error
    }
  }

  /**
   * Converte resposta do ViaCEP para formato interno
   * @param data Dados do ViaCEP
   * @returns Endereço no formato interno
   */
  private convertViaCEPToAddress(data: ViaCEPResponse): Partial<Address> {
    return {
      cep: this.formatCEP(data.cep),
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      complement: data.complemento || undefined
    }
  }
}

export const cepService = new CEPService()