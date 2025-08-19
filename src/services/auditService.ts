import { AuditLog, AuditAction } from '../types'

/**
 * Serviço de auditoria para conformidade com LGPD
 */
class AuditService {

  /**
   * Registra uma ação de auditoria
   * @param logData Dados do log de auditoria
   */
  async log(logData: {
    userId: string
    action: AuditAction
    resourceType: 'person' | 'interaction' | 'user' | 'report' | 'cabinet' | 'credentials'
    resourceId?: string
    details?: string
  }): Promise<void> {
    try {
      const auditLog: Omit<AuditLog, 'id' | 'createdAt'> = {
        ...logData,
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent
      }

      // Em produção, enviar para API real
      await this.mockSaveAuditLog(auditLog)
      
      console.log('Audit log registrado:', auditLog)
    } catch (error) {
      console.error('Erro ao registrar audit log:', error)
      // Não deve falhar a operação principal por erro de auditoria
    }
  }

  /**
   * Busca logs de auditoria
   * @param filters Filtros para busca
   * @returns Lista de logs de auditoria
   */
  async getLogs(filters?: {
    userId?: string
    action?: AuditAction
    resourceType?: string
    resourceId?: string
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
  }): Promise<{ logs: AuditLog[]; total: number }> {
    try {
      // Em produção, fazer requisição para API real
      return await this.mockGetAuditLogs(filters)
    } catch (error) {
      console.error('Erro ao buscar logs de auditoria:', error)
      throw new Error('Erro ao buscar logs de auditoria')
    }
  }

  /**
   * Exporta logs de auditoria
   * @param filters Filtros para exportação
   * @param format Formato de exportação
   * @returns Dados exportados
   */
  async exportLogs(
    filters?: {
      userId?: string
      action?: AuditAction
      resourceType?: string
      startDate?: Date
      endDate?: Date
    },
    format: 'csv' | 'json' = 'csv'
  ): Promise<string> {
    try {
      const { logs } = await this.getLogs(filters)
      
      if (format === 'csv') {
        return this.convertToCSV(logs)
      } else {
        return JSON.stringify(logs, null, 2)
      }
    } catch (error) {
      console.error('Erro ao exportar logs:', error)
      throw new Error('Erro ao exportar logs de auditoria')
    }
  }

  /**
   * Obtém IP do cliente
   * @returns IP do cliente
   */
  private async getClientIP(): Promise<string> {
    try {
      // Em produção, usar serviço real para obter IP
      return '127.0.0.1' // Mock
    } catch (error) {
      return 'unknown'
    }
  }

  /**
   * Converte logs para formato CSV
   * @param logs Lista de logs
   * @returns String CSV
   */
  private convertToCSV(logs: AuditLog[]): string {
    if (logs.length === 0) return ''

    const headers = [
      'ID',
      'Usuário',
      'Ação',
      'Tipo de Recurso',
      'ID do Recurso',
      'Detalhes',
      'IP',
      'User Agent',
      'Data/Hora'
    ]

    const csvRows = [
      headers.join(','),
      ...logs.map(log => [
        log.id,
        log.userId,
        log.action,
        log.resourceType,
        log.resourceId || '',
        `"${(log.details || '').replace(/"/g, '""')}"`,
        log.ipAddress,
        `"${log.userAgent.replace(/"/g, '""')}"`,
        log.createdAt.toISOString()
      ].join(','))
    ]

    return csvRows.join('\n')
  }

  // Métodos de simulação - remover em produção
  private async mockSaveAuditLog(logData: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 100))

    // Em produção, salvar no banco de dados
    const auditLog: AuditLog = {
      ...logData,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    }

    // Salvar no localStorage para simulação
    const existingLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]')
    existingLogs.push(auditLog)
    
    // Manter apenas os últimos 1000 logs
    if (existingLogs.length > 1000) {
      existingLogs.splice(0, existingLogs.length - 1000)
    }
    
    localStorage.setItem('audit_logs', JSON.stringify(existingLogs))
  }

  private async mockGetAuditLogs(filters?: {
    userId?: string
    action?: AuditAction
    resourceType?: string
    resourceId?: string
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
  }): Promise<{ logs: AuditLog[]; total: number }> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 300))

    // Recuperar logs do localStorage
    const allLogs: AuditLog[] = JSON.parse(localStorage.getItem('audit_logs') || '[]')
      .map((log: any) => ({
        ...log,
        createdAt: new Date(log.createdAt)
      }))

    // Aplicar filtros
    let filteredLogs = allLogs

    if (filters) {
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId)
      }
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filters.action)
      }
      if (filters.resourceType) {
        filteredLogs = filteredLogs.filter(log => log.resourceType === filters.resourceType)
      }
      if (filters.resourceId) {
        filteredLogs = filteredLogs.filter(log => log.resourceId === filters.resourceId)
      }
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => log.createdAt >= filters.startDate!)
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => log.createdAt <= filters.endDate!)
      }
    }

    // Ordenar por data (mais recente primeiro)
    filteredLogs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    // Aplicar paginação
    const limit = filters?.limit || 50
    const offset = filters?.offset || 0
    const paginatedLogs = filteredLogs.slice(offset, offset + limit)

    return {
      logs: paginatedLogs,
      total: filteredLogs.length
    }
  }
}

export const auditService = new AuditService()