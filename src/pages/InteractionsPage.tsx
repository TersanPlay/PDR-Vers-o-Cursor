import React, { useState, useEffect } from 'react'
import { usePermissions } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'

import { Plus, MessageSquare } from 'lucide-react'
import { Interaction, InteractionType, InteractionStatus, Person } from '../types'
import { toast } from '../components/ui/use-toast'
import { useAutoStatusUpdate } from '../hooks/useAutoStatusUpdate'
import {
  InteractionMetrics,
  InteractionFilters,
  InteractionTable,
  InteractionFormDialog,
  InteractionDetailsDialog,
  InteractionFormData
} from '../components/interactions'



const InteractionsPage: React.FC = () => {
  const { canCreate, canEdit, canDelete } = usePermissions()
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<InteractionStatus | 'todas'>('todas')
  const [typeFilter, setTypeFilter] = useState<InteractionType | 'todos'>('todos')
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<InteractionFormData>({
    personId: '',
    type: 'atendimento',
    title: '',
    description: '',
    status: 'pendente',
    priority: 'normal',
    eventLocation: '',
    eventStartTime: '',
    eventEndTime: '',
    eventScheduledBy: ''
  })

  // Hook para atualização automática de status
  const handleInteractionUpdate = (updatedInteraction: Interaction) => {
    setInteractions(prev => 
      prev.map(interaction => 
        interaction.id === updatedInteraction.id ? updatedInteraction : interaction
      )
    )
    toast.success(`Status da interação "${updatedInteraction.title}" atualizado automaticamente para "${updatedInteraction.status}"`)
  }

  useAutoStatusUpdate({
    interactions,
    onUpdateInteraction: handleInteractionUpdate
  })

  // Dados mockados para demonstração
  const mockInteractions: Interaction[] = [
    {
      id: '1',
      personId: '1',
      type: 'atendimento',
      title: 'Consulta sobre serviços de saúde',
      description: 'Dúvidas sobre horários de funcionamento do posto de saúde',
      status: 'concluido',
      scheduledDate: new Date('2024-01-15T10:00:00'),
      completedDate: new Date('2024-01-15T10:30:00'),
      responsibleUserId: 'user1',
      createdAt: new Date('2024-01-14T14:00:00'),
      updatedAt: new Date('2024-01-15T10:30:00')
    },
    {
      id: '2',
      personId: '2',
      type: 'reuniao',
      title: 'Reunião sobre projeto de revitalização',
      description: 'Discussão sobre o projeto de revitalização do centro da cidade',
      status: 'em_andamento',
      scheduledDate: new Date('2024-01-17T14:00:00'),
      responsibleUserId: 'user2',
      createdAt: new Date('2024-01-16T09:00:00'),
      updatedAt: new Date('2024-01-16T09:00:00')
    },
    {
      id: '3',
      personId: '3',
      type: 'ligacao',
      title: 'Solicitação de melhoria na iluminação pública',
      description: 'Senhora Maria solicitou melhoria na iluminação da Rua das Flores',
      status: 'pendente',
      scheduledDate: new Date('2024-01-21T09:00:00'),
      responsibleUserId: 'user3',
      createdAt: new Date('2024-01-14T16:00:00'),
      updatedAt: new Date('2024-01-14T16:00:00')
    },
    {
      id: '4',
      personId: '1',
      type: 'whatsapp',
      title: 'Solicitação de informações sobre documentos',
      description: 'Informações sobre documentos necessários para aposentadoria',
      status: 'cancelado',
      responsibleUserId: 'user1',
      createdAt: new Date('2024-01-10T11:00:00'),
      updatedAt: new Date('2024-01-12T15:00:00')
    }
  ]

  const mockPeople: Person[] = [
    {
      id: '1',
      name: 'Pedro Estevão',
      birthDate: new Date('1980-05-15'),
      email: 'pedro@email.com',
      phone: '(11) 99999-9999',
      relationshipType: 'eleitor',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user1',
      updatedBy: 'user1'
    },
    {
      id: '2',
      name: 'Maria Assunção',
      birthDate: new Date('1975-08-22'),
      email: 'maria@email.com',
      phone: '(11) 88888-8888',
      relationshipType: 'parceiro',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user1',
      updatedBy: 'user1'
    },
    {
      id: '3',
      name: 'João Assessor',
      birthDate: new Date('1990-12-10'),
      email: 'joao@email.com',
      phone: '(11) 77777-7777',
      relationshipType: 'colaborador_assessor',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user1',
      updatedBy: 'user1'
    }
  ]

  useEffect(() => {
    loadInteractions()
    loadPeople()
  }, [])

  const loadInteractions = async () => {
    try {
      setIsLoading(true)
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      setInteractions(mockInteractions)
    } catch (error) {
      console.error('Erro ao carregar interações:', error)
      toast.error('Não foi possível carregar as interações')
    } finally {
      setIsLoading(false)
    }
  }

  const loadPeople = async () => {
    try {
      setPeople(mockPeople)
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error)
    }
  }

  const handleCreateInteraction = async () => {
    try {
      if (!formData.personId) {
        toast.error('Selecione uma pessoa')
        return
      }

      const newInteraction: Interaction = {
        id: Date.now().toString(),
        personId: formData.personId,
        type: formData.type,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
        responsibleUserId: 'current-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        eventLocation: formData.type === 'evento' ? formData.eventLocation : undefined,
        eventStartTime: formData.type === 'evento' ? formData.eventStartTime : undefined,
        eventEndTime: formData.type === 'evento' ? formData.eventEndTime : undefined
      }

      setInteractions(prev => [newInteraction, ...prev])
      setIsCreateDialogOpen(false)
      resetForm()
      toast.success('Interação criada com sucesso')
    } catch (error) {
      console.error('Erro ao criar interação:', error)
      toast.error('Não foi possível criar a interação')
    }
  }

  const handleEditInteraction = async () => {
    if (!selectedInteraction) return

    try {
      const updatedInteraction: Interaction = {
        ...selectedInteraction,
        type: formData.type,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
        updatedAt: new Date(),
        eventLocation: formData.type === 'evento' ? formData.eventLocation : undefined,
        eventStartTime: formData.type === 'evento' ? formData.eventStartTime : undefined,
        eventEndTime: formData.type === 'evento' ? formData.eventEndTime : undefined
      }

      setInteractions(prev => 
        prev.map(interaction => 
          interaction.id === selectedInteraction.id ? updatedInteraction : interaction
        )
      )
      setIsEditDialogOpen(false)
      setSelectedInteraction(null)
      resetForm()
      toast.success('Interação atualizada com sucesso')
    } catch (error) {
      console.error('Erro ao atualizar interação:', error)
      toast.error('Não foi possível atualizar a interação')
    }
  }

  const handleDeleteInteraction = async (interaction: Interaction) => {
    if (!window.confirm('Tem certeza que deseja excluir esta interação?')) return

    try {
      setInteractions(prev => prev.filter(i => i.id !== interaction.id))
      toast.success('Interação excluída com sucesso')
    } catch (error) {
      console.error('Erro ao excluir interação:', error)
      toast.error('Não foi possível excluir a interação')
    }
  }

  const resetForm = () => {
    setFormData({
      personId: '',
      type: 'atendimento',
      title: '',
      description: '',
      status: 'pendente',
      priority: 'normal',
      eventLocation: '',
      eventStartTime: '',
      eventEndTime: ''
    })
  }

  const openEditDialog = (interaction: Interaction) => {
    setSelectedInteraction(interaction)
    setFormData({
      personId: interaction.personId,
      type: interaction.type,
      title: interaction.title,
      description: interaction.description,
      status: interaction.status,
      scheduledDate: interaction.scheduledDate ? 
        interaction.scheduledDate.toISOString().slice(0, 16) : '',
      priority: interaction.priority || 'normal',
      eventLocation: interaction.eventLocation || '',
      eventStartTime: interaction.eventStartTime || '',
      eventEndTime: interaction.eventEndTime || ''
    })
    setIsEditDialogOpen(true)
  }

  const openDetailsDialog = (interaction: Interaction) => {
    setSelectedInteraction(interaction)
    setIsDetailsDialogOpen(true)
  }

  const filteredInteractions = interactions.filter(interaction => {
    const person = people.find(p => p.id === interaction.personId)
    const personName = person ? person.name : 'Pessoa não encontrada'
    
    const matchesSearch = interaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         personName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todas' || interaction.status === statusFilter
    const matchesType = typeFilter === 'todos' || interaction.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getMetrics = () => {
    const total = interactions.length
    const pendentes = interactions.filter(i => i.status === 'pendente').length
    const concluidas = interactions.filter(i => i.status === 'concluido').length
    const atrasadas = interactions.filter(i => 
      i.status === 'pendente' && 
      i.scheduledDate && 
      i.scheduledDate < new Date()
    ).length

    return { total, pendentes, concluidas, atrasadas }
  }

  const metrics = getMetrics()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando interações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-l-4 border-l-blue-500">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 rounded-full p-3">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Interações</h1>
              <p className="text-gray-600">
                Acompanhe todos os atendimentos e follow-ups
              </p>
            </div>
          </div>
          {canCreate() && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Interação
            </Button>
          )}
        </div>
      </div>

      {/* Métricas */}
      <InteractionMetrics 
        total={metrics.total}
        pendentes={metrics.pendentes}
        concluidas={metrics.concluidas}
        atrasadas={metrics.atrasadas}
      />

      {/* Filtros e Busca */}
      <InteractionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      {/* Tabela de Interações */}
      <InteractionTable
        interactions={filteredInteractions}
        people={people}
        onViewDetails={openDetailsDialog}
        onEdit={canEdit() ? openEditDialog : undefined}
        onDelete={canDelete() ? handleDeleteInteraction : undefined}
      />

      {/* Dialog para Nova Interação */}
       <InteractionFormDialog
         isOpen={isCreateDialogOpen}
         isEditMode={false}
         formData={formData}
         people={people}
         onClose={() => setIsCreateDialogOpen(false)}
         onSubmit={handleCreateInteraction}
         onFormDataChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
       />

       {/* Dialog para Editar Interação */}
       <InteractionFormDialog
         isOpen={isEditDialogOpen}
         isEditMode={true}
         formData={formData}
         people={people}
         onClose={() => setIsEditDialogOpen(false)}
         onSubmit={handleEditInteraction}
         onFormDataChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
       />

       {/* Dialog para Detalhes da Interação */}
       <InteractionDetailsDialog
         isOpen={isDetailsDialogOpen}
         interaction={selectedInteraction}
         people={people}
         onClose={() => setIsDetailsDialogOpen(false)}
       />
    </div>
  )
}

export default InteractionsPage