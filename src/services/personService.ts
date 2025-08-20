import { Person, PersonFormData, SearchFilters, SearchResult, Interaction } from '../types'
import { auditService } from './auditService'
import { encryptData, decryptData, maskSensitiveData } from '../utils/lgpd'

/**
 * Serviço para gerenciamento de pessoas
 */
class PersonService {
  private readonly STORAGE_KEY = 'persons_data'

  /**
   * Cria uma nova pessoa
   * @param personData Dados da pessoa
   * @param userId ID do usuário que está criando
   * @returns Pessoa criada
   */
  async createPerson(personData: PersonFormData, userId: string): Promise<Person> {
    try {
      // Validar dados obrigatórios
      this.validatePersonData(personData)



      // Criar pessoa
      const person: Person = {
        id: `person-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...personData,
        birthDate: personData.birthDate ? new Date(personData.birthDate) : new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        updatedBy: userId,
        interactions: []
      }

      // Salvar pessoa (com dados criptografados)
      await this.savePerson(person)

      // Registrar auditoria
      await auditService.log({
        userId,
        action: 'create',
        resourceType: 'person',
        resourceId: person.id,
        details: `Pessoa criada: ${person.name}`
      })

      return person
    } catch (error) {
      console.error('Erro ao criar pessoa:', error)
      throw error
    }
  }

  /**
   * Atualiza uma pessoa existente
   * @param id ID da pessoa
   * @param personData Dados atualizados
   * @param userId ID do usuário que está atualizando
   * @returns Pessoa atualizada
   */
  async updatePerson(id: string, personData: Partial<PersonFormData>, userId: string): Promise<Person> {
    try {
      // Buscar pessoa existente
      const existingPerson = await this.getPersonById(id)
      if (!existingPerson) {
        throw new Error('Pessoa não encontrada')
      }



      // Atualizar pessoa
      const updatedPerson: Person = {
        ...existingPerson,
        ...personData,
        birthDate: personData.birthDate ? new Date(personData.birthDate) : existingPerson.birthDate,
        updatedAt: new Date()
      }

      // Salvar pessoa atualizada
      await this.savePerson(updatedPerson)

      // Registrar auditoria
      await auditService.log({
        userId,
        action: 'update',
        resourceType: 'person',
        resourceId: id,
        details: `Pessoa atualizada: ${updatedPerson.name}`
      })

      return updatedPerson
    } catch (error) {
      console.error('Erro ao atualizar pessoa:', error)
      throw error
    }
  }

  /**
   * Busca pessoa por ID
   * @param id ID da pessoa
   * @returns Pessoa encontrada ou null
   */
  async getPersonById(id: string): Promise<Person | null> {
    try {
      const persons = await this.getAllPersons()
      return persons.find(person => person.id === id) || null
    } catch (error) {
      console.error('Erro ao buscar pessoa por ID:', error)
      return null
    }
  }



  /**
   * Pesquisa pessoas com filtros
   * @param filters Filtros de pesquisa
   * @param userId ID do usuário que está pesquisando
   * @returns Resultado da pesquisa
   */
  async searchPersons(filters: SearchFilters, userId: string): Promise<SearchResult> {
    try {
      const persons = await this.getAllPersons()
      let filteredPersons = [...persons]

      // Aplicar filtros
      if (filters.name) {
        const nameFilter = filters.name.toLowerCase()
        filteredPersons = filteredPersons.filter(person =>
          person.name.toLowerCase().includes(nameFilter)
        )
      }



      if (filters.email) {
        const emailFilter = filters.email.toLowerCase()
        filteredPersons = filteredPersons.filter(person =>
          person.email?.toLowerCase().includes(emailFilter)
        )
      }

      if (filters.phone) {
        filteredPersons = filteredPersons.filter(person =>
          person.phone?.includes(filters.phone!)
        )
      }

      if (filters.city) {
        const cityFilter = filters.city.toLowerCase()
        filteredPersons = filteredPersons.filter(person =>
          person.address?.city?.toLowerCase().includes(cityFilter)
        )
      }

      if (filters.state) {
        filteredPersons = filteredPersons.filter(person =>
          person.address?.state === filters.state
        )
      }

      if (filters.relationshipType) {
        filteredPersons = filteredPersons.filter(person =>
          person.relationshipType === filters.relationshipType
        )
      }

      if (filters.dateRange) {
        const { start, end } = filters.dateRange
        filteredPersons = filteredPersons.filter(person => {
          const createdAt = person.createdAt
          return createdAt >= start && createdAt <= end
        })
      }

      // Ordenação
      if (filters.sortBy) {
        filteredPersons.sort((a, b) => {
          const aValue = this.getFieldValue(a, filters.sortBy!)
          const bValue = this.getFieldValue(b, filters.sortBy!)
          
          const comparison = aValue.localeCompare(bValue)
          return filters.sortOrder === 'desc' ? -comparison : comparison
        })
      }

      // Paginação
      const limit = filters.limit || 20
      const offset = filters.offset || 0
      const paginatedPersons = filteredPersons.slice(offset, offset + limit)

      // Registrar auditoria da pesquisa
      await auditService.log({
        userId,
        action: 'read',
        resourceType: 'person',
        details: `Pesquisa realizada: ${filteredPersons.length} resultados`
      })

      return {
        people: paginatedPersons,
        total: filteredPersons.length,
        page: Math.floor(offset / limit) + 1,
        limit
      }
    } catch (error) {
      console.error('Erro ao pesquisar pessoas:', error)
      throw new Error('Erro ao pesquisar pessoas')
    }
  }

  /**
   * Adiciona interação a uma pessoa
   * @param personId ID da pessoa
   * @param interaction Dados da interação
   * @param userId ID do usuário
   */
  async addInteraction(personId: string, interaction: Omit<Interaction, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<void> {
    try {
      const person = await this.getPersonById(personId)
      if (!person) {
        throw new Error('Pessoa nao encontrada')
      }

      const newInteraction: Interaction = {
        ...interaction,
        id: `interaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      if (!person.interactions) {
        person.interactions = []
      }
      person.interactions.push(newInteraction)
      person.updatedAt = new Date()

      await this.savePerson(person)

      // Registrar auditoria
      await auditService.log({
        userId,
        action: 'create',
        resourceType: 'interaction',
        resourceId: newInteraction.id,
        details: `Interação adicionada para ${person.name}: ${interaction.type}`
      })
    } catch (error) {
      console.error('Erro ao adicionar interação:', error)
      throw error
    }
  }

  /**
   * Remove uma pessoa (soft delete)
   * @param id ID da pessoa
   * @param userId ID do usuário
   */
  async deletePerson(id: string, userId: string): Promise<void> {
    try {
      const person = await this.getPersonById(id)
      if (!person) {
        throw new Error('Pessoa nao encontrada')
      }

      // Soft delete - marcar como deletada
      const updatedPerson = {
        ...person,
        deletedAt: new Date(),
        updatedAt: new Date()
      }

      await this.savePerson(updatedPerson)

      // Registrar auditoria
      await auditService.log({
        userId,
        action: 'delete',
        resourceType: 'person',
        resourceId: id,
        details: `Pessoa removida: ${person.name}`
      })
    } catch (error) {
      console.error('Erro ao remover pessoa:', error)
      throw error
    }
  }

  /**
   * Exporta dados de pessoas (com mascaramento LGPD)
   * @param filters Filtros para exportação
   * @param format Formato de exportação
   * @param userId ID do usuário
   * @returns Dados exportados
   */
  async exportPersons(
    filters: SearchFilters,
    format: 'csv' | 'json',
    userId: string
  ): Promise<string> {
    try {
      const { people } = await this.searchPersons(filters, userId)
      
      // Mascarar dados sensíveis
      const maskedPersons = people.map((person: Person) => ({
        ...person,
        ...maskSensitiveData(person)
      }))

      // Registrar auditoria
      await auditService.log({
        userId,
        action: 'export',
        resourceType: 'person',
        details: `Exportação de ${people.length} pessoas em formato ${format}`
      })

      if (format === 'csv') {
        return this.convertToCSV(maskedPersons)
      } else {
        return JSON.stringify(maskedPersons, null, 2)
      }
    } catch (error) {
      console.error('Erro ao exportar pessoas:', error)
      throw new Error('Erro ao exportar dados')
    }
  }

  // Métodos privados

  private validatePersonData(data: PersonFormData): void {
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Nome é obrigatório e deve ter pelo menos 2 caracteres')
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error('Email inválido')
    }

    if (data.birthDate && new Date(data.birthDate) > new Date()) {
      throw new Error('Data de nascimento não pode ser futura')
    }
  }

  private async getAllPersons(): Promise<Person[]> {
    try {
      // Em produção, fazer requisição para API
      const encryptedData = localStorage.getItem(this.STORAGE_KEY)
      if (!encryptedData) {
        return []
      }

      const decryptedData = decryptData(encryptedData)
      const persons: Person[] = JSON.parse(decryptedData).map((person: any) => ({
        ...person,
        createdAt: new Date(person.createdAt),
        updatedAt: new Date(person.updatedAt),
        deletedAt: person.deletedAt ? new Date(person.deletedAt) : undefined,
        birthDate: person.birthDate ? new Date(person.birthDate) : undefined,
        interactions: person.interactions.map((interaction: any) => ({
          ...interaction,
          createdAt: new Date(interaction.createdAt),
          updatedAt: new Date(interaction.updatedAt)
        }))
      }))

      // Filtrar pessoas não deletadas
      return persons.filter(person => !person.deletedAt)
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error)
      return []
    }
  }

  private async savePerson(person: Person): Promise<void> {
    try {
      const persons = await this.getAllPersons()
      const index = persons.findIndex(p => p.id === person.id)
      
      if (index >= 0) {
        persons[index] = person
      } else {
        persons.push(person)
      }

      // Criptografar dados antes de salvar
      const encryptedData = encryptData(JSON.stringify(persons))
      localStorage.setItem(this.STORAGE_KEY, encryptedData)
    } catch (error) {
      console.error('Erro ao salvar pessoa:', error)
      throw new Error('Erro ao salvar dados')
    }
  }

  private getFieldValue(person: Person, field: string): string {
    switch (field) {
      case 'name':
        return person.name
      case 'email':
        return person.email || ''
      case 'createdAt':
        return person.createdAt.toISOString()
      case 'city':
        return person.address?.city || ''
      default:
        return ''
    }
  }

  private convertToCSV(persons: Person[]): string {
    if (persons.length === 0) return ''

    const headers = [
      'Nome',
      'Email',
      'Telefone',
      'Data Nascimento',
      'Tipo Relacionamento',
      'Cidade',
      'Estado',
      'Data Cadastro'
    ]

    const csvRows = [
      headers.join(','),
      ...persons.map(person => [
        `"${person.name}"`,
        person.email || '',
        person.phone || '',
        person.birthDate ? person.birthDate.toLocaleDateString('pt-BR') : '',
        person.relationshipType || '',
        person.address?.city || '',
        person.address?.state || '',
        person.createdAt.toLocaleDateString('pt-BR')
      ].join(','))
    ]

    return csvRows.join('\n')
  }
}

export const personService = new PersonService()