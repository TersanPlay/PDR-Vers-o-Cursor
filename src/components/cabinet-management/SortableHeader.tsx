import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

type SortField = 'name' | 'councilor' | 'status' | 'createdAt'
type SortDirection = 'asc' | 'desc'

interface SortableHeaderProps {
  field: SortField
  children: React.ReactNode
  sortField: SortField | null
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}

/**
 * Componente para cabeçalho ordenável da tabela
 * @param field - Campo a ser ordenado
 * @param children - Conteúdo do cabeçalho
 * @param sortField - Campo atualmente ordenado
 * @param sortDirection - Direção da ordenação
 * @param onSort - Função para lidar com ordenação
 */
export const SortableHeader: React.FC<SortableHeaderProps> = ({
  field,
  children,
  sortField,
  sortDirection,
  onSort
}) => {
  const getSortIcon = () => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-blue-600" />
      : <ArrowDown className="h-4 w-4 text-blue-600" />
  }

  return (
    <Button
      variant="ghost"
      className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent"
      onClick={() => onSort(field)}
    >
      <span className="flex items-center gap-2">
        {children}
        {getSortIcon()}
      </span>
    </Button>
  )
}

export type { SortField, SortDirection }