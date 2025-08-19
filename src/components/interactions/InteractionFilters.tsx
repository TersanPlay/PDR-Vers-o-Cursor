import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  Search,
  Filter,
} from 'lucide-react'
import { InteractionType, InteractionStatus } from '../../types'

interface InteractionFiltersProps {
  searchTerm: string
  statusFilter: InteractionStatus | 'todas'
  typeFilter: InteractionType | 'todos'
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: InteractionStatus | 'todas') => void
  onTypeFilterChange: (value: InteractionType | 'todos') => void
}

const InteractionFilters: React.FC<InteractionFiltersProps> = ({
  searchTerm,
  statusFilter,
  typeFilter,
  onSearchChange,
  onStatusFilterChange,
  onTypeFilterChange
}) => {
  return (
    <Card className="border-l-4 border-l-indigo-500 shadow-sm">
      <CardHeader className="bg-indigo-50">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Filter className="h-5 w-5 text-indigo-500" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, pessoa ou descrição..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todos os Status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em_andamento">Em Andamento</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Tipos</SelectItem>
              <SelectItem value="atendimento">Atendimento</SelectItem>
              <SelectItem value="ligacao">Ligação</SelectItem>
              <SelectItem value="email">E-mail</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="reuniao">Reunião</SelectItem>
              <SelectItem value="visita">Visita</SelectItem>
              <SelectItem value="evento">Evento</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

export default InteractionFilters