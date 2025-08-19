import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter, Grid3X3, List, Plus } from 'lucide-react'

type ViewMode = 'table' | 'cards'
type TableDensity = 'compact' | 'normal' | 'spacious'

interface CabinetFiltersProps {
  searchTerm: string
  statusFilter: string
  viewMode: ViewMode
  tableDensity: TableDensity
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onViewModeChange: (mode: ViewMode) => void
  onTableDensityChange: (density: TableDensity) => void
  onNewCabinet?: () => void
  canCreate?: boolean
}

/**
 * Componente para filtros e controles da página de gerenciamento de gabinetes
 */
export const CabinetFilters: React.FC<CabinetFiltersProps> = ({
  searchTerm,
  statusFilter,
  viewMode,
  tableDensity,
  onSearchChange,
  onStatusFilterChange,
  onViewModeChange,
  onTableDensityChange,
  onNewCabinet,
  canCreate = false
}) => {
  return (
    <div className="space-y-4">
      {/* Cabeçalho com título e botão de novo gabinete */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Gabinetes</h1>
          <p className="text-gray-600 mt-1">Gerencie gabinetes, credenciais e comunicações</p>
        </div>
        {canCreate && onNewCabinet && (
          <Button onClick={onNewCabinet} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Gabinete
          </Button>
        )}
      </div>

      {/* Filtros e controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Busca */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, vereador, município..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro de Status */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Controles de Visualização */}
        <div className="flex items-center gap-2">
          {/* Modo de Visualização */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('table')}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('cards')}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Densidade da Tabela (apenas no modo tabela) */}
          {viewMode === 'table' && (
            <Select value={tableDensity} onValueChange={(value: TableDensity) => onTableDensityChange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compacto</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="spacious">Espaçoso</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  )
}

export type { ViewMode, TableDensity }