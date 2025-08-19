import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'

interface FormCardProps {
  /** Título do card */
  title: string
  /** Descrição opcional */
  description?: string
  /** Ícone do cabeçalho */
  icon?: LucideIcon
  /** Conteúdo do card */
  children: React.ReactNode
  /** Variante da cor da borda */
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  /** Classes CSS adicionais */
  className?: string
  /** Classes CSS adicionais para o cabeçalho */
  headerClassName?: string
  /** Classes CSS adicionais para o conteúdo */
  contentClassName?: string
}

const borderVariants = {
  blue: 'border-l-blue-500',
  green: 'border-l-green-500',
  purple: 'border-l-purple-500',
  orange: 'border-l-orange-500',
  red: 'border-l-red-500'
}

const headerGradientVariants = {
  blue: 'from-blue-50 to-blue-100 border-blue-200',
  green: 'from-green-50 to-green-100 border-green-200',
  purple: 'from-purple-50 to-purple-100 border-purple-200',
  orange: 'from-orange-50 to-orange-100 border-orange-200',
  red: 'from-red-50 to-red-100 border-red-200'
}

const iconVariants = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
  red: 'text-red-600'
}

const titleVariants = {
  blue: 'text-blue-800',
  green: 'text-green-800',
  purple: 'text-purple-800',
  orange: 'text-orange-800',
  red: 'text-red-800'
}

const descriptionVariants = {
  blue: 'text-blue-700/70',
  green: 'text-green-700/70',
  purple: 'text-purple-700/70',
  orange: 'text-orange-700/70',
  red: 'text-red-700/70'
}

/**
 * Componente de card para formulários com borda lateral colorida
 * Elimina duplicação de cards com estilos similares em toda a aplicação
 */
export const FormCard: React.FC<FormCardProps> = ({
  title,
  description,
  icon: Icon,
  children,
  variant = 'blue',
  className,
  headerClassName,
  contentClassName
}) => {
  return (
    <Card className={cn(
      'border-l-4 shadow-sm hover:shadow-md transition-shadow',
      borderVariants[variant],
      className
    )}>
      <CardHeader className={cn(
        'bg-gradient-to-r border-b',
        headerGradientVariants[variant],
        headerClassName
      )}>
        <div className="flex items-center gap-3">
          {Icon && <Icon className={cn('h-6 w-6', iconVariants[variant])} />}
          <div>
            <CardTitle className={titleVariants[variant]}>{title}</CardTitle>
            {description && (
              <CardDescription className={descriptionVariants[variant]}>
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn('p-6', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}

/**
 * Variante simples do FormCard sem cabeçalho com gradiente
 */
export const SimpleFormCard: React.FC<Omit<FormCardProps, 'headerClassName'>> = ({
  title,
  description,
  icon: Icon,
  children,
  variant = 'blue',
  className,
  contentClassName
}) => {
  return (
    <Card className={cn(
      'border-l-4 shadow-sm hover:shadow-md transition-shadow',
      borderVariants[variant],
      className
    )}>
      <CardHeader>
        <div className="flex items-center gap-3">
          {Icon && <Icon className={cn('h-6 w-6', iconVariants[variant])} />}
          <div>
            <CardTitle className={titleVariants[variant]}>{title}</CardTitle>
            {description && (
              <CardDescription className={descriptionVariants[variant]}>
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn('p-6', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}

/**
 * Card compacto para uso em seções menores
 */
export const CompactFormCard: React.FC<FormCardProps> = ({
  title,
  description,
  icon: Icon,
  children,
  variant = 'blue',
  className,
  contentClassName
}) => {
  return (
    <Card className={cn(
      'border-l-4 shadow-sm',
      borderVariants[variant],
      className
    )}>
      <CardContent className={cn('p-4', contentClassName)}>
        <div className="flex items-center gap-3 mb-4">
          {Icon && <Icon className={cn('h-5 w-5', iconVariants[variant])} />}
          <div>
            <h3 className={cn('font-semibold', titleVariants[variant])}>{title}</h3>
            {description && (
              <p className={cn('text-sm', descriptionVariants[variant])}>
                {description}
              </p>
            )}
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}