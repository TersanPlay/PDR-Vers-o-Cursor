import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Building2,
  Eye,
  Edit,
  Trash2,
  Mail,
  Calendar,
  MoreVertical,
  MessageSquare,
  History,
  Key
} from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { SortableHeader, SortField, SortDirection } from './SortableHeader'
import { Cabinet } from '@/types'
import { TableDensity } from './CabinetFilters'

interface CabinetTableProps {
  cabinets: Cabinet[]
  sortField: SortField | null
  sortDirection: SortDirection
  density: TableDensity
  densityClasses: string
  onSort: (field: SortField) => void
  onView: (cabinet: Cabinet) => void
  onEdit?: (cabinet: Cabinet) => void
  onDelete: (cabinetId: string) => void
  onStatusChange: (cabinet: Cabinet, status: string) => void
  onShowAudit?: (cabinet: Cabinet) => void
  onShowMessages?: (cabinet: Cabinet) => void
  onShowCredentials?: () => void
  onShowHistory?: () => void
  onManageCredentials?: (cabinet: Cabinet) => void
  canEdit?: boolean
  canDelete?: boolean
  canManageCredentials?: boolean
}

/**
 * Componente da tabela de gabinetes
 */
export const CabinetTable: React.FC<CabinetTableProps> = ({
  cabinets,
  sortField,
  sortDirection,
  densityClasses,
  onSort,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onShowAudit,
  onShowMessages,
  onManageCredentials,
  canEdit = false,
  canDelete = false,
  canManageCredentials = false
}) => {
  if (cabinets.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum gabinete encontrado</h3>
        <p className="text-gray-500">Tente ajustar os filtros ou criar um novo gabinete.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={densityClasses}>
              <SortableHeader
                field="name"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              >
                Gabinete
              </SortableHeader>
            </TableHead>
            <TableHead className={densityClasses}>E-mail Login</TableHead>
            <TableHead className={densityClasses}>
              <SortableHeader
                field="status"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              >
                Status
              </SortableHeader>
            </TableHead>
            <TableHead className={densityClasses}>
              <SortableHeader
                field="registrationDate"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              >
                Data de Cadastro
              </SortableHeader>
            </TableHead>
            <TableHead className={`${densityClasses} w-20`}>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cabinets.map((cabinet) => (
            <TableRow key={cabinet.id} className="hover:bg-gray-50">
              <TableCell className={densityClasses}>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 truncate">
                      {cabinet.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      Admin: {cabinet.adminName}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className={densityClasses}>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-600 truncate max-w-48">
                    {(cabinet as any).loginEmail || cabinet.adminEmail}
                  </span>
                </div>
              </TableCell>
              <TableCell className={densityClasses}>
                <StatusBadge status={cabinet.status} />
              </TableCell>
              <TableCell className={densityClasses}>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{cabinet.registrationDate.toLocaleDateString('pt-BR')}</span>
                </div>
              </TableCell>
              <TableCell className={densityClasses}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onView(cabinet)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </DropdownMenuItem>
                    
                    {canEdit && onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(cabinet)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    
                    {onShowMessages && (
                      <DropdownMenuItem onClick={() => onShowMessages(cabinet)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Mensagens
                      </DropdownMenuItem>
                    )}
                    
                    {onShowAudit && (
                      <DropdownMenuItem onClick={() => onShowAudit(cabinet)}>
                        <History className="h-4 w-4 mr-2" />
                        Histórico
                      </DropdownMenuItem>
                    )}
                    
                    {canManageCredentials && onManageCredentials && (
                      <DropdownMenuItem onClick={() => onManageCredentials(cabinet)}>
                        <Key className="h-4 w-4 mr-2" />
                        Credenciais
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem onClick={() => onStatusChange(cabinet, 'ativo')}>
                      Marcar como Ativo
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => onStatusChange(cabinet, 'pendente')}>
                      Marcar como Pendente
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => onStatusChange(cabinet, 'inativo')}>
                      Marcar como Inativo
                    </DropdownMenuItem>
                    
                    {canDelete && (
                      <DropdownMenuItem 
                        onClick={() => onDelete(cabinet.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}