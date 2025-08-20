import { auditService } from './auditService'

// Tipos para sistema de mensagens
export type MessageAttachment = {
  id: string
  name: string
  type: 'file' | 'audio'
  url: string
  size: number
  duration?: number // para áudios em segundos
}

export type Message = {
  id: string
  cabinetId: string
  content: string
  attachments: MessageAttachment[]
  userId: string
  userName: string
  timestamp: Date
  isStatusRelated: boolean
  statusChange?: {
    from: string
    to: string
  }
}

/**
 * Serviço para gerenciamento de mensagens dos gabinetes
 */
class MessageService {
  private baseUrl = '/api/messages'

  /**
   * Busca mensagens de um gabinete específico
   */
  async getMessagesByCabinet(cabinetId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${this.baseUrl}/cabinet/${cabinetId}`)
      if (!response.ok) {
        throw new Error('Erro ao buscar mensagens')
      }
      const messages = await response.json()
      return messages.map((msg: Omit<Message, 'timestamp'> & { timestamp: string }) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
      return []
    }
  }

  /**
   * Envia uma nova mensagem
   */
  async sendMessage(messageData: {
    cabinetId: string
    content: string
    attachments?: File[]
    isStatusRelated?: boolean
    statusChange?: {
      from: string
      to: string
    }
  }): Promise<{ success: boolean; message: Message }> {
    try {
      const formData = new FormData()
      formData.append('cabinetId', messageData.cabinetId)
      formData.append('content', messageData.content)
      formData.append('isStatusRelated', String(messageData.isStatusRelated || false))
      
      if (messageData.statusChange) {
        formData.append('statusChange', JSON.stringify(messageData.statusChange))
      }
      
      if (messageData.attachments) {
        messageData.attachments.forEach((file, index) => {
          formData.append(`attachment_${index}`, file)
        })
      }
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem')
      }
      
      const result = await response.json()
      
      // Registrar log de auditoria
      await auditService.log({
        userId: result.message.userId,
        action: 'create',
        resourceType: 'cabinet',
        resourceId: messageData.cabinetId,
        details: `Mensagem enviada: ${messageData.content.substring(0, 50)}${messageData.content.length > 50 ? '...' : ''}`
      })
      
      return {
        success: true,
        message: {
          ...result.message,
          timestamp: new Date(result.message.timestamp)
        }
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      throw error
    }
  }

  /**
   * Deleta uma mensagem
   */
  async deleteMessage(messageId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${messageId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Erro ao deletar mensagem')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error)
      throw error
    }
  }

  /**
   * Faz upload de anexo
   */
  async uploadAttachment(file: File): Promise<MessageAttachment> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch(`${this.baseUrl}/attachments`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Erro ao fazer upload do anexo')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Erro no upload:', error)
      throw error
    }
  }

  /**
   * Busca todas as mensagens (para administradores)
   */
  async getAllMessages(params?: {
    search?: string
    cabinetId?: string
    startDate?: Date
    endDate?: Date
    page?: number
    limit?: number
  }): Promise<{
    messages: Message[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      const searchParams = new URLSearchParams()
      
      if (params?.search) searchParams.append('search', params.search)
      if (params?.cabinetId) searchParams.append('cabinetId', params.cabinetId)
      if (params?.startDate) searchParams.append('startDate', params.startDate.toISOString())
      if (params?.endDate) searchParams.append('endDate', params.endDate.toISOString())
      if (params?.page) searchParams.append('page', params.page.toString())
      if (params?.limit) searchParams.append('limit', params.limit.toString())
      
      const response = await fetch(`${this.baseUrl}?${searchParams}`)
      if (!response.ok) {
        throw new Error('Erro ao buscar mensagens')
      }
      
      const result = await response.json()
      return {
        ...result,
        messages: result.messages.map((msg: Omit<Message, 'timestamp'> & { timestamp: string }) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
      return {
        messages: [],
        total: 0,
        page: 1,
        totalPages: 0
      }
    }
  }
}

export const messageService = new MessageService()