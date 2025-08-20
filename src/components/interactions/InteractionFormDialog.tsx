import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { 
  User, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Users,
  CheckCircle,
  XCircle,
  MapPin,
  Circle,
  Tag
} from 'lucide-react'
import { InteractionType, InteractionStatus, Person, InteractionPriority } from '../../types'

interface InteractionFormData {
  personId: string
  type: InteractionType
  title: string
  description: string
  status: InteractionStatus
  scheduledDate?: string
  priority: InteractionPriority
  followUpDate?: string
  // Campos para eventos
  eventLocation?: string
  eventStartTime?: string
  eventEndTime?: string
  eventScheduledBy?: string
}

interface InteractionFormDialogProps {
  isOpen: boolean
  isEditMode: boolean
  formData: InteractionFormData
  people: Person[]
  onClose: () => void
  onSubmit: () => void
  onFormDataChange: (data: Partial<InteractionFormData>) => void
}

const InteractionFormDialog: React.FC<InteractionFormDialogProps> = ({
  isOpen,
  isEditMode,
  formData,
  people,
  onClose,
  onSubmit,
  onFormDataChange
}) => {
  const handleInputChange = (field: keyof InteractionFormData, value: any) => {
    onFormDataChange({ [field]: value })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {isEditMode ? 'Editar Interação' : 'Nova Interação'}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                {isEditMode 
                  ? 'Atualize as informações da interação'
                  : 'Registre um novo atendimento ou acompanhamento'
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600" />
                <Label className="font-medium text-gray-700">Vincular Pessoa *</Label>
              </div>
              <div className="relative">
                <Select 
                  value={formData.personId} 
                  onValueChange={(value) => handleInputChange('personId', value)}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Selecione uma pessoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {people.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-600" />
                <Label htmlFor="type" className="font-medium text-gray-700">Tipo *</Label>
              </div>
              <div className="relative">
                <Select 
                  value={formData.type} 
                  onValueChange={(value: InteractionType) => handleInputChange('type', value)}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Tipo de interação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="atendimento">📋 Atendimento</SelectItem>
                    <SelectItem value="ligacao">📞 Ligação</SelectItem>
                    <SelectItem value="email">📧 E-mail</SelectItem>
                    <SelectItem value="whatsapp">💬 WhatsApp</SelectItem>
                    <SelectItem value="reuniao">🤝 Reunião</SelectItem>
                    <SelectItem value="visita">🏠 Visita</SelectItem>
                    <SelectItem value="evento">🎉 Evento</SelectItem>
                    <SelectItem value="outro">📝 Outro</SelectItem>
                  </SelectContent>
                </Select>
                <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          

          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-600" />
              <Label htmlFor="title" className="font-medium text-gray-700">Título *</Label>
            </div>
            <div className="relative">
              <Input
                id="title"
                placeholder="Título da interação"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="pl-10"
              />
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-600" />
              <Label htmlFor="description" className="font-medium text-gray-700">Descrição *</Label>
            </div>
            <div className="relative">
              <textarea
                id="description"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background pl-10 pr-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Descreva detalhadamente a interação..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Campos específicos para eventos */}
          {formData.type === 'evento' && (
            <div className="space-y-4 p-6 border-2 border-dashed border-green-200 rounded-xl bg-green-50">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Informações do Evento</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <Label htmlFor="eventLocation" className="font-medium text-gray-700">Local *</Label>
                  </div>
                  <div className="relative">
                    <Select 
                      value={formData.eventLocation || ''} 
                      onValueChange={(value) => handleInputChange('eventLocation', value)}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Selecione o local" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plenario">🏛️ Plenário</SelectItem>
                        <SelectItem value="plenarinho">🏢 Plenarinho</SelectItem>
                        <SelectItem value="presidencia">🏛️ Presidência</SelectItem>
                        <SelectItem value="estacionamento_interno">🚗 Estacionamento Interno</SelectItem>
                        <SelectItem value="estacionamento_externo">🅿️ Estacionamento Externo</SelectItem>
                        <SelectItem value="outros">📍 Outros</SelectItem>
                      </SelectContent>
                    </Select>
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <Label htmlFor="eventStartTime" className="font-medium text-gray-700">Horário de Início *</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="eventStartTime"
                      type="time"
                      value={formData.eventStartTime || ''}
                      onChange={(e) => handleInputChange('eventStartTime', e.target.value)}
                      className="pl-10"
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <Label htmlFor="eventEndTime" className="font-medium text-gray-700">Horário de Fim *</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="eventEndTime"
                      type="time"
                      value={formData.eventEndTime || ''}
                      onChange={(e) => handleInputChange('eventEndTime', e.target.value)}
                      className="pl-10"
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-600" />
                  <Label htmlFor="eventScheduledBy" className="font-medium text-gray-700">Marcado por *</Label>
                </div>
                <div className="relative">
                  <Select 
                    value={formData.eventScheduledBy || ''} 
                    onValueChange={(value) => handleInputChange('eventScheduledBy', value)}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Como foi marcado o evento?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">📧 E-mail</SelectItem>
                      <SelectItem value="visita">🏠 Visita</SelectItem>
                      <SelectItem value="reuniao">🤝 Reunião</SelectItem>
                      <SelectItem value="whatsapp">💬 WhatsApp</SelectItem>
                      <SelectItem value="ligacao">📞 Ligação</SelectItem>
                      <SelectItem value="outros">📝 Outros</SelectItem>
                    </SelectContent>
                  </Select>
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gray-600" />
                <Label htmlFor="status" className="font-medium text-gray-700">Status</Label>
              </div>
              <div className="relative">
                <Select 
                  value={formData.status} 
                  onValueChange={(value: InteractionStatus) => handleInputChange('status', value)}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">⏳ Pendente</SelectItem>
                    <SelectItem value="em_progresso">🔄 Em Progresso</SelectItem>
                    <SelectItem value="em_andamento">⚡ Em Andamento</SelectItem>
                    <SelectItem value="concluido">✅ Concluído</SelectItem>
                    <SelectItem value="cancelado">❌ Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            {!isEditMode && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-gray-600" />
                  <Label htmlFor="priority" className="font-medium text-gray-700">Prioridade</Label>
                </div>
                <div className="relative">
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value: 'baixa' | 'media' | 'alta') => handleInputChange('priority', value)}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Baixa
                        </div>
                      </SelectItem>
                      <SelectItem value="normal">
                        <div className="flex items-center gap-2">
                          <Circle className="h-4 w-4 text-blue-500" />
                          Normal
                        </div>
                      </SelectItem>
                      <SelectItem value="media">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          Média
                        </div>
                      </SelectItem>
                      <SelectItem value="alta">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          Alta
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <Label htmlFor="scheduledDate" className="font-medium text-gray-700">Data Agendada</Label>
              </div>
              <div className="relative">
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={formData.scheduledDate || ''}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            {!isEditMode && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <Label htmlFor="followUpDate" className="font-medium text-gray-700">Data de Follow-up</Label>
                </div>
                <div className="relative">
                  <Input
                    id="followUpDate"
                    type="date"
                    value={formData.followUpDate || ''}
                    onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                    className="pl-10"
                  />
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="pt-6 border-t bg-gray-50 rounded-b-lg -mx-6 -mb-6 px-6 pb-6">
          <div className="flex gap-3 w-full justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-6 py-2 font-medium"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={onSubmit}
              className="px-6 py-2 font-medium bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isEditMode ? 'Atualizar Interação' : 'Salvar Interação'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InteractionFormDialog
export type { InteractionFormData }