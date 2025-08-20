import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  MapPin,
  Users
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Task, ActivityType } from '../../types'

const activityTypeLabels: Record<ActivityType, string> = {
  sessao_plenaria: 'Sessão Plenária',
  reuniao_comissao: 'Reunião de Comissão',
  audiencia_publica: 'Audiência Pública',
  outra_atividade: 'Outra Atividade',
  sessao_solene: 'Sessão Solene',
  reuniao_liderancas: 'Reunião de Lideranças',
  visita_tecnica: 'Visita Técnica',
  coletiva_imprensa: 'Coletiva de Imprensa',
  encontro_comunidade: 'Encontro com Comunidade',
  seminario: 'Seminário',
  conferencia: 'Conferência',
  palestra: 'Palestra',
  cerimonia_oficial: 'Cerimônia Oficial',
  evento_cultural: 'Evento Cultural',
  evento_esportivo: 'Evento Esportivo',
  capacitacao_treinamento: 'Capacitação / Treinamento',
  reuniao_interna: 'Reunião Interna',
  viagem_oficial: 'Viagem Oficial',
  entrevista: 'Entrevista',
  reuniao_virtual: 'Reunião Virtual'
}

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (taskId: string, status: Task['status']) => void
  isSelected?: boolean
  onSelect?: (taskId: string) => void
  showCheckbox?: boolean
  viewMode?: "list" | "grid"
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  isSelected = false,
  onSelect,
  showCheckbox = false,
  viewMode = "list"
}) => {


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'pending':
        return <Circle className="h-4 w-4 text-orange-600" />
      default:
        return <Circle className="h-4 w-4 text-slate-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída'
      case 'in_progress':
        return 'Em Andamento'
      case 'pending':
        return 'Pendente'
      default:
        return 'Pendente'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
    }
  }

  const getCardBackground = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-400'
      case 'in_progress':
        return 'bg-gradient-to-br from-blue-50 to-sky-50 border-l-4 border-l-blue-400'
      case 'pending':
        return 'bg-gradient-to-br from-orange-50 to-amber-50 border-l-4 border-l-orange-400'
      default:
        return 'bg-gradient-to-br from-slate-50 to-gray-50 border-l-4 border-l-slate-400'
    }
  }

  const getActivityTypeColor = (activityType: ActivityType) => {
    switch (activityType) {
      case 'sessao_plenaria':
        return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200'
      case 'reuniao_comissao':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
      case 'audiencia_publica':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
      case 'sessao_solene':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200'
      case 'reuniao_liderancas':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200'
      case 'visita_tecnica':
        return 'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200'
      case 'coletiva_imprensa':
        return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200'
      case 'encontro_comunidade':
        return 'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200'
      case 'seminario':
        return 'bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-200'
      case 'conferencia':
        return 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200'
      case 'palestra':
        return 'bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200'
      case 'cerimonia_oficial':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'
      case 'evento_cultural':
        return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 hover:bg-fuchsia-200'
      case 'evento_esportivo':
        return 'bg-lime-100 text-lime-800 border-lime-200 hover:bg-lime-200'
      case 'capacitacao_treinamento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
      case 'reuniao_interna':
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
      case 'viagem_oficial':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
      case 'entrevista':
        return 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200'
      case 'reuniao_virtual':
        return 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
    }
  }



  // Função para converter data do formato dd/MM/yyyy para Date
  const parseDate = (dateStr: Date | string): Date => {
    if (typeof dateStr === 'string' && dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/')
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    }
    return new Date(dateStr)
  }

  const isOverdue = task.dueDate && new Date() > parseDate(task.dueDate) && task.status !== 'completed'

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
      task.status === 'completed' ? 'opacity-80' : ''
    } ${
      getCardBackground(task.status)
    } ${
      isOverdue && task.status !== 'in_progress' ? 'border-l-red-500 bg-gradient-to-br from-red-50 to-pink-50' : ''
    } ${
      isSelected ? 'ring-2 ring-blue-500' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            {showCheckbox && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect?.(task.id)}
                className="flex-shrink-0 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            )}
            <Select
              value={task.status}
              onValueChange={(value) => onStatusChange(task.id, value as Task['status'])}
            >
              <SelectTrigger className="w-32 h-8 text-xs border-0 bg-transparent hover:bg-gray-50 focus:ring-1 focus:ring-blue-500">
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(task.status)}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending" className="text-xs">
                  <div className="flex items-center gap-2">
                    <Circle className="h-3 w-3 text-orange-600" />
                    Pendente
                  </div>
                </SelectItem>
                <SelectItem value="in_progress" className="text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-blue-600" />
                    Em Andamento
                  </div>
                </SelectItem>
                <SelectItem value="completed" className="text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    Concluída
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold ${viewMode === 'grid' ? 'text-sm' : 'text-sm'} leading-tight ${
                task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-xs text-gray-600 mt-1 ${viewMode === 'grid' ? 'line-clamp-2' : 'line-clamp-2'}`}>
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {/* Tipo de Atividade */}
        <div className="flex items-center gap-2">
          {task.activityType && (
            <Badge variant="outline" className={`text-xs transition-colors duration-200 ${getActivityTypeColor(task.activityType)}`}>
              {activityTypeLabels[task.activityType]}
            </Badge>
          )}
          <Badge variant="outline" className={`text-xs ${getStatusBadgeColor(task.status)}`}>
            {getStatusText(task.status)}
          </Badge>
          {isOverdue && (
            <Badge variant="destructive" className="text-xs flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Atrasada
            </Badge>
          )}
        </div>

        {/* Data e Horário */}
        {task.date && task.time && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="h-3 w-3" />
            <span>
              {typeof task.date === 'string' && task.date.includes('/') 
                ? task.date 
                : format(new Date(task.date), 'dd/MM/yyyy', { locale: ptBR })
              } às {task.time}
            </span>
          </div>
        )}

        {/* Local */}
        {task.location && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{task.location}</span>
          </div>
        )}

        {/* Participantes */}
        {task.participants && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Users className="h-3 w-3" />
            <span className="truncate">{task.participants}</span>
          </div>
        )}

        {/* Responsável */}
        {(task.assignedTo || task.assignee) && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <User className="h-3 w-3" />
            <span>{task.assignedTo || task.assignee}</span>
          </div>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                #{tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TaskCard