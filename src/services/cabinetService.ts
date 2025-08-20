import { Cabinet, CabinetOrDepartment } from '../types'
import { departmentService } from './departmentService'

/**
 * Serviço para gerenciamento de gabinetes
 */
class CabinetService {
  private baseUrl = '/api/cabinets'
  private storageKey = 'registered_cabinets'

  /**
   * Busca todos os gabinetes cadastrados
   */
  async getCabinets(): Promise<Cabinet[]> {
    try {
      // Primeiro tenta buscar da API
      const response = await fetch(this.baseUrl)
      if (!response.ok) {
        throw new Error('Erro ao buscar gabinetes')
      }
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar gabinetes da API, usando dados locais:', error)
      // Se falhar, busca do localStorage
      return this.getRegisteredCabinets()
    }
  }

  /**
   * Busca gabinetes registrados do localStorage
   */
  private getRegisteredCabinets(): Cabinet[] {
    try {
      const stored = localStorage.getItem(this.storageKey)
      let cabinets = []
      
      if (stored) {
        cabinets = JSON.parse(stored)
        // Converter strings de data de volta para objetos Date
        cabinets = cabinets.map((cabinet: Omit<Cabinet, 'registrationDate' | 'createdAt' | 'updatedAt'> & { registrationDate: string; createdAt: string; updatedAt: string }) => ({
          ...cabinet,
          registrationDate: new Date(cabinet.registrationDate),
          createdAt: new Date(cabinet.createdAt),
          updatedAt: new Date(cabinet.updatedAt)
        }))
      }
      
      // Se não há gabinetes salvos, retorna dados de exemplo para demonstração
      if (cabinets.length === 0) {
        cabinets = this.getMockCabinets()
      }
      
      return cabinets
    } catch (error) {
      console.error('Erro ao recuperar gabinetes do localStorage:', error)
      // Em caso de erro, retorna dados de exemplo
      return this.getMockCabinets()
    }
  }

  /**
   * Retorna dados de exemplo para demonstração
   */
  private getMockCabinets(): Cabinet[] {
    return [
      {
        id: 'cabinet_demo_1',
        name: 'Gabinete do Vereador João Silva',
        institutionalEmail: 'gabinete.joao@camara.sp.gov.br',
        adminName: 'Maria Santos',
        adminEmail: 'maria.santos@gabinete.com',
        councilMemberName: 'João Silva',
        municipality: 'São Paulo',
        city: 'São Paulo',
        status: 'ativo' as const,
        registrationDate: new Date('2024-01-15'),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'cabinet_demo_2',
        name: 'Gabinete da Vereadora Ana Costa',
        institutionalEmail: 'gabinete.ana@camara.rj.gov.br',
        adminName: 'Carlos Oliveira',
        adminEmail: 'carlos.oliveira@gabinete.com',
        councilMemberName: 'Ana Costa',
        municipality: 'Rio de Janeiro',
        city: 'Rio de Janeiro',
        status: 'pendente' as const,
        registrationDate: new Date('2024-01-20'),
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      }
    ]
  }

  /**
   * Salva um gabinete no localStorage
   */
  saveRegisteredCabinet(cabinet: Cabinet): void {
    try {
      const existingCabinets = this.getRegisteredCabinets()
      const updatedCabinets = [...existingCabinets, cabinet]
      localStorage.setItem(this.storageKey, JSON.stringify(updatedCabinets))
    } catch (error) {
      console.error('Erro ao salvar gabinete no localStorage:', error)
    }
  }

  /**
   * Busca um gabinete específico por ID
   */
  async getCabinetById(id: string): Promise<Cabinet | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`)
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error('Erro ao buscar gabinete')
      }
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar gabinete:', error)
      return null
    }
  }

  /**
   * Atualiza o status de um gabinete
   */
  async updateCabinetStatus(
    cabinetId: string, 
    status: 'ativo' | 'pendente' | 'inativo',
    comment?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${cabinetId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, comment })
      })
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar status do gabinete')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      throw error
    }
  }

  /**
   * Deleta um gabinete
   */
  async deleteCabinet(cabinetId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${cabinetId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Erro ao deletar gabinete')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Erro ao deletar gabinete:', error)
      throw error
    }
  }

  /**
   * Busca gabinetes com filtros
   */
  async searchCabinets(params: {
    search?: string
    status?: string
    municipality?: string
    page?: number
    limit?: number
  }): Promise<{
    cabinets: Cabinet[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      const searchParams = new URLSearchParams()
      
      if (params.search) searchParams.append('search', params.search)
      if (params.status) searchParams.append('status', params.status)
      if (params.municipality) searchParams.append('municipality', params.municipality)
      if (params.page) searchParams.append('page', params.page.toString())
      if (params.limit) searchParams.append('limit', params.limit.toString())
      
      const response = await fetch(`${this.baseUrl}/search?${searchParams}`)
      if (!response.ok) {
        throw new Error('Erro ao buscar gabinetes')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Erro na busca de gabinetes:', error)
      // Retorna resultado vazio em caso de erro
      return {
        cabinets: [],
        total: 0,
        page: 1,
        totalPages: 0
      }
    }
  }

  /**
   * Exporta dados dos gabinetes
   */
  async exportCabinets(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/export?format=${format}`)
      if (!response.ok) {
        throw new Error('Erro ao exportar dados')
      }
      return await response.blob()
    } catch (error) {
      console.error('Erro ao exportar gabinetes:', error)
      throw error
    }
  }

  /**
   * Retorna todos os gabinetes e departamentos registrados
   */
  getAllCabinetsAndDepartments(): CabinetOrDepartment[] {
    const cabinets = this.getRegisteredCabinets()
    const departments = departmentService.getRegisteredDepartments()
    
    // Combinar gabinetes e departamentos em uma única lista
    return [...cabinets, ...departments]
  }

  /**
   * Busca em gabinetes e departamentos por critérios
   */
  async searchAllCabinetsAndDepartments(query: string): Promise<CabinetOrDepartment[]> {
    const cabinetResult = await this.searchCabinets({ search: query })
    const departments = departmentService.searchDepartments(query)
    
    return [...cabinetResult.cabinets, ...departments]
  }
}

export const cabinetService = new CabinetService()