import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  /** Tamanho do spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Cor do spinner */
  variant?: 'primary' | 'white' | 'blue' | 'green'
  /** Texto a ser exibido abaixo do spinner */
  text?: string
  /** Classes CSS adicionais */
  className?: string
  /** Se deve centralizar o spinner */
  centered?: boolean
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6', 
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
}

const variantClasses = {
  primary: 'border-primary',
  white: 'border-white',
  blue: 'border-blue-600',
  green: 'border-green-600'
}

/**
 * Componente de loading spinner reutilizável
 * Elimina duplicação de código de loading em toda a aplicação
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  text,
  className,
  centered = false
}) => {
  const spinnerContent = (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-current',
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  )

  if (centered) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        {spinnerContent}
      </div>
    )
  }

  return spinnerContent
}

/**
 * Componente de loading para páginas inteiras
 */
export const PageLoadingSpinner: React.FC<{ text?: string }> = ({ text = 'Carregando...' }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  </div>
)

/**
 * Componente de loading inline para botões
 */
export const ButtonLoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSpinner 
    size="sm" 
    variant="white" 
    className={cn('mr-2', className)} 
  />
)