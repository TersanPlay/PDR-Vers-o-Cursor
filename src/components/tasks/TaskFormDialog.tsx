import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Task, TaskFormData, ActivityType } from '../../types'

interface TaskFormDialogProps {
  isOpen: boolean
  task?: Task
  onClose: () => void
  onSubmit: (task: Task) => void
}

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

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  isOpen,
  task,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    id: task?.id,
    title: task?.title || '',
    description: task?.description || '',
    activityType: task?.activityType || 'outra_atividade',
    date: task?.date instanceof Date ? task.date : (task?.date ? new Date(task.date) : new Date()),
    time: task?.time || '',
    location: task?.location || '',
    status: task?.status === 'in-progress' ? 'in_progress' : (task?.status || 'pending'),
    participants: task?.participants || '',
    objectives: '',
    observations: '',
    priority: task?.priority || 'medium',
    assignedTo: task?.assignedTo || '',
    dueDate: task?.dueDate instanceof Date ? task.dueDate : (task?.dueDate ? new Date(task.dueDate) : undefined),
    tags: task?.tags || []
  })
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.location.trim() || !formData.participants.trim() || !formData.objectives.trim()) {
      return
    }
    
    const taskData: Task = {
      id: task?.id || `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title,
      description: formData.description || '',
      status: formData.status === 'in_progress' ? 'in-progress' : formData.status,
      priority: formData.priority,
      assignee: formData.assignedTo || '',
      dueDate: formData.dueDate || new Date(),
      category: 'Geral',
      activityType: formData.activityType,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      participants: formData.participants,
      assignedTo: formData.assignedTo,
      tags: formData.tags
    }
    onSubmit(taskData)
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      activityType: 'outra_atividade',
      date: new Date(),
      time: '',
      location: '',
      status: 'pending',
      participants: '',
      objectives: '',
      priority: 'medium',
      assignedTo: '',
      dueDate: undefined,
      tags: []
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-blue-600">
            Nova Atividade
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título da Atividade */}
          <div className="space-y-2">
            <Label htmlFor="title">Título da Atividade</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Sessão Ordinária do Plenário"
              required
            />
          </div>

          {/* Data e Horário */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? (
                      format(formData.date, 'dd/MM/yyyy', { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    selected={formData.date}
                    onSelect={(date) => {
                      if (date) {
                        setFormData(prev => ({ ...prev, date }))
                      }
                      setIsCalendarOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Horário</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Local */}
          <div className="space-y-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Ex: Plenário Ulysses Guimarães"
              required
            />
          </div>

          {/* Tipo de Atividade e Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Atividade</Label>
              <Select
                value={formData.activityType}
                onValueChange={(value: ActivityType) => 
                  setFormData(prev => ({ ...prev, activityType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(activityTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'pending' | 'in_progress' | 'completed') => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Participantes */}
          <div className="space-y-2">
            <Label htmlFor="participants">Participantes</Label>
            <Input
              id="participants"
              value={formData.participants}
              onChange={(e) => setFormData(prev => ({ ...prev, participants: e.target.value }))}
              placeholder="Ex: Deputado Carlos, Senadora Ana"
              required
            />
          </div>

          {/* Objetivos */}
          <div className="space-y-2">
            <Label htmlFor="objectives">Objetivos</Label>
            <Textarea
              id="objectives"
              value={formData.objectives}
              onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
              placeholder="Descreva os objetivos da atividade"
              rows={3}
              required
            />
          </div>

          {/* Observações e Encaminhamentos */}
          <div className="space-y-2">
            <Label htmlFor="observations">Observações e Encaminhamentos</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
              placeholder="Adicione observações relevantes e encaminhamentos"
              rows={3}
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Salvar Atividade
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TaskFormDialog