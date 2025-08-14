import React, { useState, useEffect } from 'react'
import { usePermissions } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Phone,
  Mail,
  MessageSquare,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { Interaction, InteractionType, InteractionStatus, Person } from '../types'
import { toast } from '../components/ui/use-toast'
import { formatDate, formatDateTime } from '../lib/utils'

interface InteractionFormData {
  personId: string
  type: InteractionType
  title: string
  description: string
  status: InteractionStatus
  scheduledDate?: string
  priority: 'baixa' | 'media' | 'alta'
  followUpDate?: string
  // Campos para novo visitante
  isNewVisitor?: boolean
  visitorName?: string
  visitorPhone?: string
  visitorEmail?: string
}

const InteractionsPage: React.FC = () => {
  const { canCreate, canEdit, canDelete, canViewReports } = usePermissions()
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
    priority: 'media',
    isNewVisitor: false,
    visitorName: '',
    visitorPhone: '',
    visitorEmail: ''
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
      cpf: '123.456.789-01',
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
      cpf: '987.654.321-09',
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
      cpf: '456.789.123-45',
      birthDate: new Date('1990-12-10'),
      email: 'joao@email.com',
      phone: '(11) 77777-7777',
      relationshipType: 'funcionario',
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
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as interações',
        variant: 'destructive'
      })
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
      let personId = formData.personId
      
      // Se for um novo visitante, criar a pessoa primeiro
      if (formData.isNewVisitor && formData.visitorName) {
        if (!formData.visitorName.trim()) {
          toast({
            title: 'Erro',
            description: 'Nome do visitante é obrigatório',
            variant: 'destructive'
          })
          return
        }
        
        const newPerson: Person = {
          id: `visitor_${Date.now()}`,
          name: formData.visitorName,
          cpf: '', // CPF não obrigatório para visitantes
          rg: '', // RG não obrigatório para visitantes
          birthDate: new Date(), // Data padrão
          phone: formData.visitorPhone || '',
          email: formData.visitorEmail || '',
          relationshipType: 'outros', // Visitantes são classificados como 'outros'
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'current-user',
          updatedBy: 'current-user'
        }
        
        // Adicionar a nova pessoa à lista
        setPeople(prev => [newPerson, ...prev])
        personId = newPerson.id
      }
      
      if (!personId) {
        toast({
          title: 'Erro',
          description: 'Selecione uma pessoa ou preencha os dados do visitante',
          variant: 'destructive'
        })
        return
      }

      const newInteraction: Interaction = {
        id: Date.now().toString(),
        personId: personId,
        type: formData.type,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
        responsibleUserId: 'current-user',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setInteractions(prev => [newInteraction, ...prev])
      setIsCreateDialogOpen(false)
      resetForm()
      toast({
        title: 'Sucesso',
        description: formData.isNewVisitor ? 'Visitante cadastrado e interação criada com sucesso' : 'Interação criada com sucesso'
      })
    } catch (error) {
      console.error('Erro ao criar interação:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a interação',
        variant: 'destructive'
      })
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
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
        updatedAt: new Date()
      }

      setInteractions(prev => 
        prev.map(interaction => 
          interaction.id === selectedInteraction.id ? updatedInteraction : interaction
        )
      )
      setIsEditDialogOpen(false)
      setSelectedInteraction(null)
      resetForm()
      toast({
        title: 'Sucesso',
        description: 'Interação atualizada com sucesso'
      })
    } catch (error) {
      console.error('Erro ao atualizar interação:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a interação',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteInteraction = async (interaction: Interaction) => {
    if (!window.confirm('Tem certeza que deseja excluir esta interação?')) return

    try {
      setInteractions(prev => prev.filter(i => i.id !== interaction.id))
      toast({
        title: 'Sucesso',
        description: 'Interação excluída com sucesso'
      })
    } catch (error) {
      console.error('Erro ao excluir interação:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a interação',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      personId: '',
      type: 'atendimento',
      title: '',
      description: '',
      status: 'pendente',
      priority: 'media',
      isNewVisitor: false,
      visitorName: '',
      visitorPhone: '',
      visitorEmail: ''
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
      priority: 'media'
    })
    setIsEditDialogOpen(true)
  }

  const openDetailsDialog = (interaction: Interaction) => {
    setSelectedInteraction(interaction)
    setIsDetailsDialogOpen(true)
  }

  const getStatusIcon = (status: InteractionStatus) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'em_andamento':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'pendente':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'cancelado':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: InteractionStatus) => {
    const variants = {
      'concluido': 'default',
      'em_andamento': 'secondary',
      'pendente': 'outline',
      'cancelado': 'destructive'
    } as const

    const labels = {
      'concluido': 'Concluído',
      'em_andamento': 'Em Andamento',
      'pendente': 'Pendente',
      'cancelado': 'Cancelado'
    }

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const getTypeIcon = (type: InteractionType) => {
    switch (type) {
      case 'atendimento':
        return <User className="h-4 w-4" />
      case 'ligacao':
        return <Phone className="h-4 w-4" />
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />
      case 'reuniao':
        return <Users className="h-4 w-4" />
      case 'visita':
        return <MapPin className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getPersonName = (personId: string) => {
    const person = people.find(p => p.id === personId)
    return person ? person.name : 'Pessoa não encontrada'
  }

  const filteredInteractions = interactions.filter(interaction => {
    const matchesSearch = interaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getPersonName(interaction.personId).toLowerCase().includes(searchTerm.toLowerCase())
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
          {canCreate && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Interação
            </Button>
          )}
        </div>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50">
            <CardTitle className="text-sm font-medium text-gray-900">Total</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.total}</div>
            <p className="text-xs text-gray-600">
              Total de interações
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-yellow-50">
            <CardTitle className="text-sm font-medium text-gray-900">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.pendentes}</div>
            <p className="text-xs text-gray-600">
              Em aberto
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50">
            <CardTitle className="text-sm font-medium text-gray-900">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.concluidas}</div>
            <p className="text-xs text-gray-600">
              44% taxa de conclusão
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-red-50">
            <CardTitle className="text-sm font-medium text-gray-900">Atrasadas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.atrasadas}</div>
            <p className="text-xs text-gray-600">
              Atenção necessária
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: InteractionStatus | 'todas') => setStatusFilter(value)}>
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
            <Select value={typeFilter} onValueChange={(value: InteractionType | 'todos') => setTypeFilter(value)}>
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

      {/* Tabela de Interações */}
      <Card className="border-l-4 border-l-emerald-500 shadow-sm">
        <CardHeader className="bg-emerald-50">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <MessageSquare className="h-5 w-5 text-emerald-500" />
            Interações ({filteredInteractions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Pessoa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Agendada</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInteractions.map((interaction) => (
                <TableRow key={interaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(interaction.type)}
                      <span className="capitalize">{interaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{interaction.title}</TableCell>
                  <TableCell>{getPersonName(interaction.personId)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(interaction.status)}
                      {getStatusBadge(interaction.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {interaction.scheduledDate ? formatDateTime(interaction.scheduledDate) : '-'}
                  </TableCell>
                  <TableCell>{formatDate(interaction.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDetailsDialog(interaction)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(interaction)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInteraction(interaction)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredInteractions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma interação encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para Nova Interação */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Interação</DialogTitle>
            <DialogDescription>
              Registre um novo atendimento ou acompanhamento
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vincular Pessoa *</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="existing-person"
                      name="person-type"
                      checked={!formData.isNewVisitor}
                      onChange={() => setFormData(prev => ({ ...prev, isNewVisitor: false, personId: '', visitorName: '', visitorPhone: '', visitorEmail: '' }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label htmlFor="existing-person" className="text-sm font-normal">Pessoa cadastrada</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="new-visitor"
                      name="person-type"
                      checked={formData.isNewVisitor}
                      onChange={() => setFormData(prev => ({ ...prev, isNewVisitor: true, personId: '' }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label htmlFor="new-visitor" className="text-sm font-normal">Novo visitante</Label>
                  </div>
                </div>
                {!formData.isNewVisitor && (
                  <Select value={formData.personId} onValueChange={(value) => setFormData(prev => ({ ...prev, personId: value }))}>
                    <SelectTrigger>
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
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select value={formData.type} onValueChange={(value: InteractionType) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de interação" />
                  </SelectTrigger>
                  <SelectContent>
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
            </div>
            
            {/* Campos para novo visitante */}
            {formData.isNewVisitor && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium text-sm text-gray-700">Dados do Visitante</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="visitorName">Nome do Visitante *</Label>
                    <Input
                      id="visitorName"
                      placeholder="Digite o nome completo"
                      value={formData.visitorName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, visitorName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visitorPhone">Telefone</Label>
                    <Input
                      id="visitorPhone"
                      placeholder="(00) 00000-0000"
                      value={formData.visitorPhone || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, visitorPhone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitorEmail">E-mail</Label>
                  <Input
                    id="visitorEmail"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.visitorEmail || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, visitorEmail: e.target.value }))}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Título da interação"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Descreva a interação..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: InteractionStatus) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={formData.priority} onValueChange={(value: 'baixa' | 'media' | 'alta') => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Data Agendada</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={formData.scheduledDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followUpDate">Data de Follow-up</Label>
                <Input
                  id="followUpDate"
                  type="date"
                  value={formData.followUpDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateInteraction}>
              Salvar Interação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Editar Interação */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Interação</DialogTitle>
            <DialogDescription>
              Atualize as informações da interação
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-person">Pessoa *</Label>
                <Select value={formData.personId} onValueChange={(value) => setFormData(prev => ({ ...prev, personId: value }))}>
                  <SelectTrigger>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Tipo *</Label>
                <Select value={formData.type} onValueChange={(value: InteractionType) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de interação" />
                  </SelectTrigger>
                  <SelectContent>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título *</Label>
              <Input
                id="edit-title"
                placeholder="Título da interação"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição *</Label>
              <textarea
                id="edit-description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Descreva a interação..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: InteractionStatus) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-scheduledDate">Data Agendada</Label>
                <Input
                  id="edit-scheduledDate"
                  type="datetime-local"
                  value={formData.scheduledDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditInteraction}>
              Atualizar Interação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Detalhes da Interação */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Interação</DialogTitle>
          </DialogHeader>
          {selectedInteraction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Pessoa</Label>
                  <p className="text-sm">{getPersonName(selectedInteraction.personId)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(selectedInteraction.type)}
                    <span className="text-sm capitalize">{selectedInteraction.type}</span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Título</Label>
                <p className="text-sm font-medium">{selectedInteraction.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Descrição</Label>
                <p className="text-sm">{selectedInteraction.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedInteraction.status)}
                    {getStatusBadge(selectedInteraction.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Data Agendada</Label>
                  <p className="text-sm">
                    {selectedInteraction.scheduledDate ? formatDateTime(selectedInteraction.scheduledDate) : 'Não agendada'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Criado em</Label>
                  <p className="text-sm">{formatDateTime(selectedInteraction.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Atualizado em</Label>
                  <p className="text-sm">{formatDateTime(selectedInteraction.updatedAt)}</p>
                </div>
              </div>
              {selectedInteraction.completedDate && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Concluído em</Label>
                  <p className="text-sm">{formatDateTime(selectedInteraction.completedDate)}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InteractionsPage