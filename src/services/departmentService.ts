import { Department } from '../types'

class DepartmentService {
  private readonly STORAGE_KEY = 'registered_departments'

  /**
   * Salva um departamento registrado no localStorage
   */
  saveRegisteredDepartment(department: Department): void {
    try {
      const existingDepartments = this.getRegisteredDepartments()
      const updatedDepartments = [...existingDepartments, department]
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedDepartments))
    } catch (error) {
      console.error('Erro ao salvar departamento:', error)
    }
  }

  /**
   * Recupera todos os departamentos registrados do localStorage
   */
  getRegisteredDepartments(): Department[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) {
        return []
      }
      const departments = JSON.parse(stored)
      return departments.map((dept: Omit<Department, 'registrationDate' | 'createdAt' | 'updatedAt'> & { registrationDate: string; createdAt: string; updatedAt: string }) => ({
        ...dept,
        registrationDate: new Date(dept.registrationDate),
        createdAt: new Date(dept.createdAt),
        updatedAt: new Date(dept.updatedAt)
      }))
    } catch (error) {
      console.error('Erro ao recuperar departamentos:', error)
      return []
    }
  }

  /**
   * Busca um departamento por ID
   */
  getDepartmentById(id: string): Department | null {
    const departments = this.getRegisteredDepartments()
    return departments.find(dept => dept.id === id) || null
  }

  /**
   * Atualiza o status de um departamento
   */
  updateDepartmentStatus(id: string, status: 'ativo' | 'pendente' | 'inativo'): boolean {
    try {
      const departments = this.getRegisteredDepartments()
      const departmentIndex = departments.findIndex(dept => dept.id === id)
      
      if (departmentIndex === -1) {
        return false
      }

      departments[departmentIndex].status = status
      departments[departmentIndex].updatedAt = new Date()
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(departments))
      return true
    } catch (error) {
      console.error('Erro ao atualizar status do departamento:', error)
      return false
    }
  }

  /**
   * Remove um departamento
   */
  deleteDepartment(id: string): boolean {
    try {
      const departments = this.getRegisteredDepartments()
      const filteredDepartments = departments.filter(dept => dept.id !== id)
      
      if (filteredDepartments.length === departments.length) {
        return false // Departamento não encontrado
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredDepartments))
      return true
    } catch (error) {
      console.error('Erro ao deletar departamento:', error)
      return false
    }
  }

  /**
   * Busca departamentos por critérios
   */
  searchDepartments(query: string): Department[] {
    const departments = this.getRegisteredDepartments()
    const lowerQuery = query.toLowerCase()
    
    return departments.filter(dept => 
      dept.name.toLowerCase().includes(lowerQuery) ||
      dept.councilMemberName.toLowerCase().includes(lowerQuery) ||
      dept.areaOfActivity.toLowerCase().includes(lowerQuery) ||
      dept.linkedOrganSector.toLowerCase().includes(lowerQuery) ||
      dept.adminName.toLowerCase().includes(lowerQuery) ||
      dept.adminEmail.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Exporta departamentos para CSV
   */
  exportDepartments(): string {
    const departments = this.getRegisteredDepartments()
    
    const headers = [
      'ID',
      'Nome',
      'Vereador',
      'Área de Atuação',
      'Cargo Responsável',
      'Setor Vinculado',
      'Localização',
      'Email',
      'Admin Nome',
      'Admin Email',
      'Status',
      'Data Registro'
    ]
    
    const csvContent = [
      headers.join(','),
      ...departments.map(dept => [
        dept.id,
        `"${dept.name}"`,
        `"${dept.councilMemberName}"`,
        `"${dept.areaOfActivity}"`,
        `"${dept.responsiblePosition || ''}"`,
        `"${dept.linkedOrganSector}"`,
        `"${dept.location}"`,
        `"${dept.institutionalEmail || ''}"`,
        `"${dept.adminName}"`,
        `"${dept.adminEmail}"`,
        dept.status,
        dept.registrationDate.toLocaleDateString('pt-BR')
      ].join(','))
    ].join('\n')
    
    return csvContent
  }
}

export const departmentService = new DepartmentService()
export default departmentService