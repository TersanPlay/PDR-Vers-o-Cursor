/**
 * Sistema de logging centralizado para o PDR
 * Substitui console.error por logging adequado para produção
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogEntry {
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  timestamp: Date
  userId?: string
  sessionId?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private sessionId = this.generateSessionId()

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
    const sanitized = { ...context }
    
    // Remover campos sensíveis dos logs
    const sensitiveFields = ['password', 'confirmPassword', 'token', 'secret', 'key', 'authorization']
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]'
      }
    }
    
    // Sanitizar objetos aninhados
    for (const [key, value] of Object.entries(sanitized)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeContext(value as Record<string, unknown>)
      }
    }
    
    return sanitized
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      context: context ? this.sanitizeContext(context) : undefined,
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId: this.getCurrentUserId()
    }
  }

  private getCurrentUserId(): string | undefined {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        // Em produção, decodificar o token JWT para obter o userId
        // Por enquanto, extrair do mock token
        const parts = token.split('-')
        return parts.length > 2 ? parts[2] : undefined
      }
    } catch {
      // Ignorar erros ao obter userId
    }
    return undefined
  }

  private logToDevelopment(entry: LogEntry): void {
    const { level, message, context } = entry
    const prefix = `[${entry.timestamp.toISOString()}] [${level.toUpperCase()}]`
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(`${prefix} ${message}`, context || '')
        break
      case LogLevel.WARN:
        console.warn(`${prefix} ${message}`, context || '')
        break
      case LogLevel.INFO:
        console.info(`${prefix} ${message}`, context || '')
        break
      case LogLevel.DEBUG:
        console.debug(`${prefix} ${message}`, context || '')
        break
    }
  }

  private async logToProduction(entry: LogEntry): Promise<void> {
    try {
      // Em produção, enviar logs para serviço de monitoramento
      // Exemplos: Sentry, LogRocket, DataDog, etc.
      
      // Por enquanto, armazenar localmente para não perder logs
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]')
      logs.push(entry)
      
      // Manter apenas os últimos 500 logs
      if (logs.length > 500) {
        logs.splice(0, logs.length - 500)
      }
      
      localStorage.setItem('app_logs', JSON.stringify(logs))
      
      // TODO: Implementar envio para serviço de logging em produção
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // })
    } catch {
      // Falha silenciosa para não quebrar a aplicação
    }
  }

  private async log(level: LogLevel, message: string, context?: Record<string, unknown>): Promise<void> {
    const entry = this.createLogEntry(level, message, context)
    
    if (this.isDevelopment) {
      this.logToDevelopment(entry)
    } else {
      await this.logToProduction(entry)
    }
  }

  /**
   * Registra um erro
   */
  async error(message: string, context?: Record<string, unknown>): Promise<void> {
    await this.log(LogLevel.ERROR, message, context)
  }

  /**
   * Registra um aviso
   */
  async warn(message: string, context?: Record<string, unknown>): Promise<void> {
    await this.log(LogLevel.WARN, message, context)
  }

  /**
   * Registra uma informação
   */
  async info(message: string, context?: Record<string, unknown>): Promise<void> {
    await this.log(LogLevel.INFO, message, context)
  }

  /**
   * Registra informação de debug (apenas em desenvolvimento)
   */
  async debug(message: string, context?: Record<string, unknown>): Promise<void> {
    if (this.isDevelopment) {
      await this.log(LogLevel.DEBUG, message, context)
    }
  }

  /**
   * Obtém logs armazenados localmente
   */
  getLogs(): LogEntry[] {
    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]')
      return logs.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }))
    } catch {
      return []
    }
  }

  /**
   * Limpa logs armazenados localmente
   */
  clearLogs(): void {
    localStorage.removeItem('app_logs')
  }
}

// Instância singleton do logger
export const logger = new Logger()

// Funções de conveniência para compatibilidade
export const logError = (message: string, context?: Record<string, unknown>) => 
  logger.error(message, context)

export const logWarn = (message: string, context?: Record<string, unknown>) => 
  logger.warn(message, context)

export const logInfo = (message: string, context?: Record<string, unknown>) => 
  logger.info(message, context)

export const logDebug = (message: string, context?: Record<string, unknown>) => 
  logger.debug(message, context)