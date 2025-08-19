import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Phone,
  Globe,
  MapPin,
  User,
  MessageSquare,
  History,
  Key,
  MoreVertical
} from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { Cabinet } from '@/types'

interface CabinetCardsProps {
  cabinets: Cabinet[]
  onView: (cabinet: Cabinet) => void
  onEdit?: (cabinet: Cabinet) => void
  onDelete?: (cabinet: Cabinet) => void
  onStatusChange?: (cabinet: Cabinet, status: string) => void
  onShowMessages?: (cabinet: Cabinet) => void
  onShowCredentials?: (cabinet: Cabinet) => void
  onShowHistory?: (cabinet: Cabinet) => void
  canEdit?: boolean
  canDelete?: boolean
  canManageCredentials?: boolean
}

/**
 * Componente para exibir gabinetes em modo de cards/grade
 */
export const CabinetCards: React.FC<CabinetCardsProps> = ({
  cabinets,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onShowMessages,
  onShowCredentials,
  onShowHistory,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cabinets.map((cabinet) => (
        <Card key={cabinet.id} className="hover:shadow-lg transition-shadow min-h-[320px]">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg leading-tight break-words">{cabinet.name}</CardTitle>
                </div>
              </div>
              <div className="flex-shrink-0">
                <StatusBadge status={cabinet.status} />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 flex-1 flex flex-col">
            {/* Informações do Vereador */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="break-words font-medium">{cabinet.councilMemberName}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="break-words">{cabinet.municipality}</span>
              </div>
            </div>

            {/* Informações de Contato */}
            <div className="space-y-2 flex-1">
              {cabinet.adminEmail && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="break-words">{cabinet.adminEmail}</span>
                </div>
              )}
              
              {cabinet.institutionalPhone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="break-words">{cabinet.institutionalPhone}</span>
                </div>
              )}
              
              {cabinet.website && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <Globe className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="break-words">{cabinet.website}</span>
                </div>
              )}
            </div>

            {/* Data de Criação */}
            <div className="text-xs text-gray-500 pt-2 border-t mt-auto">
              Criado em {new Date(cabinet.createdAt).toLocaleDateString('pt-BR')}
            </div>

            {/* Ações */}
            <div className="flex flex-wrap gap-2 pt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onView(cabinet)}
                className="flex-1 min-w-0"
              >
                <Eye className="h-4 w-4 mr-1" />
                Ver
              </Button>
              
              {onShowMessages && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onShowMessages(cabinet)}
                  className="flex-1 min-w-0"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Msgs
                </Button>
              )}
              
              {canEdit && onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(cabinet)}
                  className="flex-1 min-w-0"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              )}
              
              {canManageCredentials && onShowCredentials && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onShowCredentials(cabinet)}
                  className="flex-1 min-w-0"
                >
                  <Key className="h-4 w-4 mr-1" />
                  Creds
                </Button>
              )}
              
              {onShowHistory && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onShowHistory(cabinet)}
                  className="flex-1 min-w-0"
                >
                  <History className="h-4 w-4 mr-1" />
                  Hist
                </Button>
              )}
              
              {onStatusChange && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 min-w-0"
                    >
                      <MoreVertical className="h-4 w-4 mr-1" />
                      Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onStatusChange(cabinet, 'ativo')}>
                      Marcar como Ativo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(cabinet, 'pendente')}>
                      Marcar como Pendente
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(cabinet, 'inativo')}>
                      Marcar como Inativo
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              {canDelete && onDelete && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(cabinet)}
                  className="flex-1 min-w-0"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Del
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}