import React, { useState } from "react"
import {
  Card,
  CardContent,
} from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs"

// Removido import do Progress - campo não mais utilizado
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  X,
  Save,
  ArrowUpDown,
  FileText,
  AlignLeft,
  Flag,
  User,
  MapPin,
  Users,
  FolderOpen,
  Tag,
  List,
  Grid3X3
} from "lucide-react"
import { Task } from '../types'
import TaskCard from '../components/tasks/TaskCard'


// Modal Component
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}

// Task Form Component
interface TaskFormProps {
  task?: Task
  onSave: (task: Partial<Task>) => void
  onCancel: () => void
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'pending',
    priority: task?.priority || 'medium',
    assignee: task?.assignee || '',
    assigneeAvatar: task?.assigneeAvatar || '',
    dueDate: task?.dueDate || '',
    date: task?.date || '',
    time: task?.time || '',
    location: task?.location || '',
    participants: task?.participants || '',
    category: task?.category || 'Reuniões',
    comments: task?.comments || 0,
    attachments: task?.attachments || 0,
    tags: task?.tags || []
  })
  
  const [newTag, setNewTag] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    
    onSave({
      ...formData,
      assigneeAvatar: formData.assignee ? formData.assignee.split(' ').map(n => n[0]).join('').toUpperCase() : ''
    })
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
      setNewTag('')
    }
  }

  const removeTag = (indexToRemove: number) => {
    setFormData({ ...formData, tags: formData.tags.filter((_, index) => index !== indexToRemove) })
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <FileText className="h-4 w-4 text-blue-600" />
          Título
        </label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Digite o título da tarefa"
          className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <AlignLeft className="h-4 w-4 text-green-600" />
          Descrição
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descreva a tarefa"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 text-orange-600" />
            Status
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'in-progress' | 'completed' })}
          >
            <option value="pending">Pendente</option>
            <option value="in-progress">Em Andamento</option>
            <option value="completed">Concluída</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Flag className="h-4 w-4 text-red-600" />
            Prioridade
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 text-purple-600" />
            Responsável
          </label>
          <Input
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            placeholder="Nome do responsável"
            className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            Data de Vencimento
          </label>
          <Input
            type="date"
            value={formData.dueDate instanceof Date ? formData.dueDate.toISOString().split('T')[0] : formData.dueDate || ''}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            Data
          </label>
          <Input
            type="date"
            value={formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : formData.date || ''}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 text-teal-600" />
            Horário
          </label>
          <Input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <MapPin className="h-4 w-4 text-emerald-600" />
          Local
        </label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Digite o local da tarefa"
          className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Users className="h-4 w-4 text-pink-600" />
          Participantes
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
          value={formData.participants}
          onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
          placeholder="Digite os participantes da tarefa"
        />
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <FolderOpen className="h-4 w-4 text-amber-600" />
          Categoria
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value="Reuniões">Reuniões</option>
          <option value="Desenvolvimento">Desenvolvimento</option>
          <option value="Eventos">Eventos</option>
          <option value="Estratégia">Estratégia</option>
          <option value="Auditoria">Auditoria</option>
          <option value="Capacitação">Capacitação</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Tag className="h-4 w-4 text-cyan-600" />
          Tags
        </label>
        <div className="flex gap-2 mb-3">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleTagKeyPress}
            placeholder="Digite uma tag e pressione Enter"
            className="flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Button type="button" onClick={addTag} size="sm" className="bg-blue-600 hover:bg-blue-700">
            Adicionar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200 shadow-sm"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={onCancel} className="px-6 py-2">
          Cancelar
        </Button>
        <Button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Salvar Tarefa
        </Button>
      </div>
    </form>
  )
}

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Sessão Ordinária do Período",
    description: "Análise e votação dos projetos de melhoramento e implementação das novas diretrizes.",
    status: "pending",
    priority: "high",
    assignee: "João Silva",
    assigneeAvatar: "JS",
    dueDate: "15/03/2024",
    date: "15/03/2024",
    time: "14:00",
    location: "Plenário Principal",
    participants: "João Silva, Maria Santos, Pedro Costa",
    category: "Reuniões",
    comments: 5,
    attachments: 3,
    tags: ["urgente", "votação", "diretrizes"]
  },
  {
    id: "2",
    title: "Reunião do Comitê de Edificação",
    description: "Proposta para um novo desenvolvimento urbano arquitetônico sustentável.",
    status: "in-progress",
    priority: "medium",
    assignee: "Maria Santos",
    assigneeAvatar: "MS",
    dueDate: "20/03/2024",
    date: "20/03/2024",
    time: "09:30",
    location: "Sala de Reuniões A",
    participants: "Maria Santos, Ana Lima, Carlos Oliveira",
    category: "Desenvolvimento",
    comments: 8,
    attachments: 2,
    tags: ["sustentável", "arquitetura", "urbano"]
  },
  {
    id: "3",
    title: "Sessão Solene de Homenagens",
    description: "Cerimônia de homenagens aos munícipes que contribuíram significativamente.",
    status: "completed",
    priority: "medium",
    assignee: "Pedro Costa",
    assigneeAvatar: "PC",
    dueDate: "10/03/2024",
    date: "10/03/2024",
    time: "19:00",
    location: "Auditório Municipal",
    participants: "Pedro Costa, João Silva, Comunidade",
    category: "Eventos",
    comments: 12,
    attachments: 1,
    tags: ["cerimônia", "homenagem", "munícipes"]
  },
  {
    id: "4",
    title: "Reunião VI Sae com Liderança",
    description: "Planejamento de estratégias operacionais e definição de metas trimestrais.",
    status: "in-progress",
    priority: "high",
    assignee: "Ana Lima",
    assigneeAvatar: "AL",
    dueDate: "18/03/2024",
    date: "18/03/2024",
    time: "10:00",
    location: "Sala Executiva",
    participants: "Ana Lima, Equipe de Liderança",
    category: "Estratégia",
    comments: 4,
    attachments: 1,
    tags: ["planejamento", "metas", "liderança"]
  },
  {
    id: "5",
    title: "Auditoria Política Externa",
    description: "Análise de compliance e processos internos conforme regulamentações.",
    status: "pending",
    priority: "high",
    assignee: "Carlos Oliveira",
    assigneeAvatar: "CO",
    dueDate: "25/03/2024",
    date: "25/03/2024",
    time: "08:00",
    location: "Departamento de Auditoria",
    participants: "Carlos Oliveira, Equipe de Auditoria",
    category: "Auditoria",
    comments: 7,
    attachments: 1,
    tags: ["compliance", "regulamentação", "processos"]
  },
  {
    id: "6",
    title: "Workshop de Inovação Digital",
    description: "Capacitação em tecnologias emergentes para modernização dos processos.",
    status: "pending",
    priority: "medium",
    assignee: "Fernanda Rocha",
    assigneeAvatar: "FR",
    dueDate: "30/03/2024",
    date: "30/03/2024",
    time: "13:30",
    location: "Centro de Treinamento",
    participants: "Fernanda Rocha, Equipe de TI, Servidores",
    category: "Capacitação",
    comments: 6,
    attachments: 4,
    tags: ["inovação", "digital", "capacitação"]
  }
]

// Helper functions




const TaskManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "in-progress" | "completed">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [tagFilter, setTagFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("dueDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [bulkActionMode, setBulkActionMode] = useState(false)
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)

  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesCategory = categoryFilter === "all" || task.category === categoryFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    const matchesTag = tagFilter === "all" || (task.tags && task.tags.includes(tagFilter))
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesTag
  })

  // Obter categorias únicas
  const uniqueCategories = Array.from(new Set(tasks.map(task => task.category)))
  
  // Obter tags únicas
  const uniqueTags = Array.from(new Set(tasks.flatMap(task => task.tags || [])))

  // Função para ordenar tarefas
  const sortTasks = (tasksToSort: Task[]) => {
    return [...tasksToSort].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "dueDate":
          aValue = typeof a.dueDate === 'string' ? new Date(a.dueDate) : a.dueDate
          bValue = typeof b.dueDate === 'string' ? new Date(b.dueDate) : b.dueDate
          break
        case "priority":
          const priorityOrder = { "high": 3, "medium": 2, "low": 1 }
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder]
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder]
          break
        case "status":
          const statusOrder = { "pending": 1, "in-progress": 2, "completed": 3 }
          aValue = statusOrder[a.status as keyof typeof statusOrder]
          bValue = statusOrder[b.status as keyof typeof statusOrder]
          break
        case "assignee":
          aValue = a.assignee.toLowerCase()
          bValue = b.assignee.toLowerCase()
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })
  }

  // Aplicar ordenação às tarefas filtradas
  const sortedAndFilteredTasks = sortTasks(filteredTasks)

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "completed").length,
    pending: tasks.filter((task) => task.status === "pending").length,
    inProgress: tasks.filter((task) => task.status === "in-progress").length,
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsEditModalOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      setTasks(tasks.filter(task => task.id !== taskId))
    }
  }

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus as 'pending' | 'in-progress' | 'completed' } : task
    ))
  }

  const handleCreateTask = () => {
    setIsCreateModalOpen(true)
  }

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      // Editar tarefa existente
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskData }
          : task
      ))
      setIsEditModalOpen(false)
      setEditingTask(undefined)
    } else {
      // Criar nova tarefa
      const { id, ...taskDataWithoutId } = taskData as Task
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskDataWithoutId
      }
      setTasks([...tasks, newTask])
      setIsCreateModalOpen(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditModalOpen(false)
    setEditingTask(undefined)
  }

  const handleCancelCreate = () => {
    setIsCreateModalOpen(false)
  }

  // Funções para ações em lote
  const handleSelectTask = (taskId: string) => {
    const newSelected = new Set(selectedTasks)
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId)
    } else {
      newSelected.add(taskId)
    }
    setSelectedTasks(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedTasks.size === sortedAndFilteredTasks.length) {
      setSelectedTasks(new Set())
    } else {
      setSelectedTasks(new Set(sortedAndFilteredTasks.map(task => task.id)))
    }
  }

  const handleBulkStatusChange = (newStatus: "pending" | "in-progress" | "completed") => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        selectedTasks.has(task.id) 
          ? { ...task, status: newStatus }
          : task
      )
    )
    setSelectedTasks(new Set())
  }

  const handleBulkDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir ${selectedTasks.size} tarefa(s)?`)) {
      setTasks(prevTasks => prevTasks.filter(task => !selectedTasks.has(task.id)))
      setSelectedTasks(new Set())
    }
  }

  const toggleBulkActionMode = () => {
    setBulkActionMode(!bulkActionMode)
    setSelectedTasks(new Set())
  }

  // Função para renderizar lista de tarefas filtradas
  const renderTaskList = (tasksToShow: Task[], emptyMessage: string) => {
    if (tasksToShow.length === 0) {
      return (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyMessage}</h3>
          <p className="mt-1 text-sm text-gray-500">Tente ajustar os filtros de busca.</p>
        </div>
      )
    }

    const gridClasses = viewMode === "grid" 
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
      : "grid gap-4"

    return (
      <div className={gridClasses}>
        {tasksToShow.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            isSelected={selectedTasks.has(task.id)}
            onSelect={handleSelectTask}
            showCheckbox={bulkActionMode}
            viewMode={viewMode}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Tarefas</h1>
          <p className="text-gray-600 mt-1">Organize e acompanhe suas atividades parlamentares</p>
        </div>
        <div className="flex gap-2">

          <Button onClick={handleCreateTask}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Tarefas</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-red-600">{taskStats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-orange-600">{taskStats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por título, descrição ou responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Filtros Avançados */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          {/* Filtro por Categoria */}
          <select
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Todas as categorias</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          {/* Filtro por Prioridade */}
          <select
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">Todas as prioridades</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
          
          {/* Filtro por Tags */}
          <select
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          >
            <option value="all">Todas as tags</option>
            {uniqueTags.map(tag => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </select>
          
          {/* Botão para limpar filtros */}
          {(categoryFilter !== "all" || priorityFilter !== "all" || tagFilter !== "all" || searchTerm) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCategoryFilter("all")
                setPriorityFilter("all")
                setTagFilter("all")
                setSearchTerm("")
              }}
            >
              Limpar Filtros
            </Button>
          )}
          
          {/* Ordenação */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
            <select
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDate">Data de vencimento</option>
              <option value="title">Título</option>
              <option value="priority">Prioridade</option>
              <option value="status">Status</option>
              <option value="assignee">Responsável</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-2"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
          
          {/* Alternância de visualização */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-md">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-r-none border-0"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-l-none border-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Ações em lote */}
          <div className="flex items-center gap-2">
            <Button
              variant={bulkActionMode ? "default" : "outline"}
              size="sm"
              onClick={toggleBulkActionMode}
            >
              {bulkActionMode ? "Cancelar Seleção" : "Selecionar Múltiplas"}
            </Button>
            
            {bulkActionMode && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedTasks.size === sortedAndFilteredTasks.length ? "Desmarcar Todas" : "Selecionar Todas"}
                </Button>
                
                {selectedTasks.size > 0 && (
                  <>
                    <select
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        if (e.target.value) {
                          handleBulkStatusChange(e.target.value as "pending" | "in-progress" | "completed")
                          e.target.value = ""
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Alterar Status</option>
                      <option value="pending">Pendente</option>
                      <option value="in-progress">Em Progresso</option>
                      <option value="completed">Concluída</option>
                    </select>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                    >
                      Excluir ({selectedTasks.size})
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
          
          {/* Contador de resultados */}
          <span className="text-sm text-gray-500 ml-auto">
            {selectedTasks.size > 0 && `${selectedTasks.size} selecionada(s) • `}
            {filteredTasks.length} de {tasks.length} tarefas
          </span>
        </div>
      </div>

      {/* Tasks Tabs */}
      <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | "pending" | "in-progress" | "completed")} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas ({taskStats.total})</TabsTrigger>
          <TabsTrigger value="pending">Pendentes ({taskStats.pending})</TabsTrigger>
          <TabsTrigger value="in-progress">Em Andamento ({taskStats.inProgress})</TabsTrigger>
          <TabsTrigger value="completed">Concluídas ({taskStats.completed})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderTaskList(sortedAndFilteredTasks, "Nenhuma tarefa encontrada")}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {renderTaskList(sortedAndFilteredTasks.filter(task => task.status === "pending"), "Nenhuma tarefa pendente encontrada")}
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          {renderTaskList(sortedAndFilteredTasks.filter(task => task.status === "in-progress"), "Nenhuma tarefa em andamento encontrada")}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {renderTaskList(sortedAndFilteredTasks.filter(task => task.status === "completed"), "Nenhuma tarefa concluída encontrada")}
        </TabsContent>
      </Tabs>

      {/* Modal para criar nova tarefa */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={handleCancelCreate}
        title="Nova Tarefa"
      >
        <TaskForm 
          onSave={handleSaveTask}
          onCancel={handleCancelCreate}
        />
      </Modal>

      {/* Modal para editar tarefa */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={handleCancelEdit}
        title="Editar Tarefa"
      >
        <TaskForm 
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={handleCancelEdit}
        />
      </Modal>


    </div>
  )
}

export default TaskManagementPage