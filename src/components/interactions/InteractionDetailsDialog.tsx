import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Calendar, Clock, User, FileText, AlertCircle, CheckCircle, XCircle, Pause } from 'lucide-react'
import { Interaction, Person, InteractionStatus } from '../../types'

interface InteractionDetailsDialogProps {
  isOpen: boolean
  interaction: Interaction | null
  people: Person[]
  onClose: () => void
}

const InteractionDetailsDialog: React.FC<InteractionDetailsDialogProps> = ({
  isOpen,
  interaction,
  people,
  onClose
}) => {
  if (!interaction) return null

  const person = people.find(p => p.id === interaction.personId)

  const getStatusIcon = (status: InteractionStatus) => {
    switch (status) {
      case 'pendente':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'em_progresso':
        return <Clock className="h-4 w-4 text-orange-500" />
      case 'em_andamento':
        return <Pause className="h-4 w-4 text-blue-500" />
      case 'concluido':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelado':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: InteractionStatus) => {
    const variants = {
      pendente: 'secondary',
      em_progresso: 'default',
      em_andamento: 'default',
      concluido: 'default',
      cancelado: 'destructive'
    } as const

    const labels = {
      pendente: 'Pendente',
      em_progresso: 'Em Progresso',
      em_andamento: 'Em Andamento',
      concluido: 'Concluído',
      cancelado: 'Cancelado'
    }

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {labels[status]}
      </Badge>
    )
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalhes da Interação
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre a interação
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Informações principais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <User className="h-4 w-4" />
                Pessoa
              </div>
              <p className="text-sm">{person?.name || 'Pessoa não encontrada'}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                Status
              </div>
              <div>{getStatusBadge(interaction.status)}</div>
            </div>
          </div>

          {/* Título e tipo */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600">Tipo</div>
            <p className="text-sm capitalize">{interaction.type}</p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600">Título</div>
            <p className="text-sm font-medium">{interaction.title}</p>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600">Descrição</div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm whitespace-pre-wrap">{interaction.description}</p>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            {interaction.scheduledDate && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Data Agendada
                </div>
                <p className="text-sm">{formatDateTime(interaction.scheduledDate?.toISOString() || '')}</p>
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Clock className="h-4 w-4" />
                Criado em
              </div>
              <p className="text-sm">{formatDateTime(interaction.createdAt.toISOString())}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Clock className="h-4 w-4" />
                Atualizado em
              </div>
              <p className="text-sm">{formatDateTime(interaction.updatedAt.toISOString())}</p>
            </div>
            {interaction.completedDate && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <CheckCircle className="h-4 w-4" />
                  Concluído em
                </div>
                <p className="text-sm">{formatDateTime(interaction.completedDate.toISOString())}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InteractionDetailsDialog