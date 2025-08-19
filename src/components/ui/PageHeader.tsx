import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface PageHeaderProps {
  /** Título da página */
  title: string
  /** Descrição opcional */
  description?: string
  /** Ícone do cabeçalho */
  icon?: LucideIcon
  /** Botão de ação opcional */
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  /** Variante do gradiente */
  variant?: 'blue' | 'green' | 'purple' | 'indigo'
  /** Classes CSS adicionais */
  className?: string
}

const gradientVariants = {
  blue: 'from-blue-50 to-indigo-50 border-blue-200',
  green: 'from-green-50 to-green-100 border-green-200', 
  purple: 'from-purple-50 to-purple-100 border-purple-200',
  indigo: 'from-indigo-50 to-indigo-100 border-indigo-200'
}

const textVariants = {
  blue: 'from-blue-600 to-indigo-600',
  green: 'from-green-600 to-green-700',
  purple: 'from-purple-600 to-purple-700', 
  indigo: 'from-indigo-600 to-indigo-700'
}

const iconVariants = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  indigo: 'text-indigo-600'
}

const descriptionVariants = {
  blue: 'text-blue-700/70',
  green: 'text-green-700/70',
  purple: 'text-purple-700/70',
  indigo: 'text-indigo-700/70'
}

/**
 * Componente de cabeçalho de página reutilizável
 * Elimina duplicação de cabeçalhos com gradiente em toda a aplicação
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  action,
  variant = 'blue',
  className
}) => {
  return (
    <div className={cn('flex justify-between items-center', className)}>
      <div className={cn(
        'bg-gradient-to-r border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow',
        gradientVariants[variant]
      )}>
        <div className="flex items-center gap-3 mb-2">
          {Icon && <Icon className={cn('h-8 w-8', iconVariants[variant])} />}
          <h1 className={cn(
            'text-3xl font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent',
            textVariants[variant]
          )}>
            {title}
          </h1>
        </div>
        {description && (
          <p className={cn(descriptionVariants[variant])}>
            {description}
          </p>
        )}
      </div>
      
      {action && (
        <Button onClick={action.onClick}>
          {action.icon && <action.icon className="h-4 w-4 mr-2" />}
          {action.label}
        </Button>
      )}
    </div>
  )
}

/**
 * Variante compacta do cabeçalho para uso em modais ou seções menores
 */
export const CompactPageHeader: React.FC<Omit<PageHeaderProps, 'action'>> = ({
  title,
  description,
  icon: Icon,
  variant = 'blue',
  className
}) => {
  return (
    <div className={cn(
      'bg-gradient-to-r rounded-lg p-4 border-l-4',
      variant === 'blue' && 'from-blue-50 to-indigo-50 border-l-blue-500',
      variant === 'green' && 'from-green-50 to-green-100 border-l-green-500',
      variant === 'purple' && 'from-purple-50 to-purple-100 border-l-purple-500',
      variant === 'indigo' && 'from-indigo-50 to-indigo-100 border-l-indigo-500',
      className
    )}>
      <div className="flex items-center gap-3">
        {Icon && <Icon className={cn('h-6 w-6', iconVariants[variant])} />}
        <div>
          <h2 className={cn(
            'text-xl font-semibold bg-gradient-to-r bg-clip-text text-transparent',
            textVariants[variant]
          )}>
            {title}
          </h2>
          {description && (
            <p className={cn('text-sm mt-1', descriptionVariants[variant])}>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}