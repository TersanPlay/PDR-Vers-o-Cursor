import { toast as sonnerToast } from 'sonner'

type ToastProps = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export const toast = {
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message),
  info: (message: string) => sonnerToast.info(message),
  warning: (message: string) => sonnerToast.warning(message),
  // Método original para compatibilidade
  default: ({ title, description, variant = 'default' }: ToastProps) => {
    if (variant === 'destructive') {
      sonnerToast.error(title || description || 'Erro')
    } else {
      sonnerToast.success(title || description || 'Sucesso')
    }
  }
}

export const useToast = () => {
  return { toast }
}