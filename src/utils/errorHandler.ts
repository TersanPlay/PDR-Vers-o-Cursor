/**
 * Utilitários centralizados para tratamento de erros
 * Elimina duplicação de código de tratamento de erro com toast e logger
 */

import { toast } from '@/components/ui/use-toast'
import { logger } from './logger'

/**
 * Trata erro com toast e log
 * @param message Mensagem de erro para o usuário
 * @param error Erro original
 * @param context Contexto adicional para o log
 */
export const handleError = async (
  message: string,
  error: unknown,
  context?: Record<string, unknown>
): Promise<void> => {
  // Mostrar erro para o usuário
  toast.error(message)
  
  // Registrar no log
  const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
  await logger.error(message, {
    error: errorMessage,
    ...context
  })
}

/**
 * Trata erro apenas com log (sem toast)
 * @param message Mensagem de erro
 * @param error Erro original
 * @param context Contexto adicional para o log
 */
export const logError = async (
  message: string,
  error: unknown,
  context?: Record<string, unknown>
): Promise<void> => {
  const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
  await logger.error(message, {
    error: errorMessage,
    ...context
  })
}

/**
 * Trata sucesso com toast e log
 * @param message Mensagem de sucesso
 * @param context Contexto adicional para o log
 */
export const handleSuccess = async (
  message: string,
  context?: Record<string, unknown>
): Promise<void> => {
  toast.success(message)
  await logger.info(message, context)
}

/**
 * Wrapper para executar operações com tratamento de erro padronizado
 * @param operation Operação a ser executada
 * @param errorMessage Mensagem de erro para o usuário
 * @param successMessage Mensagem de sucesso (opcional)
 * @param context Contexto adicional para logs
 */
export const executeWithErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorMessage: string,
  successMessage?: string,
  context?: Record<string, unknown>
): Promise<T | null> => {
  try {
    const result = await operation()
    
    if (successMessage) {
      await handleSuccess(successMessage, context)
    }
    
    return result
  } catch (error) {
    await handleError(errorMessage, error, context)
    return null
  }
}