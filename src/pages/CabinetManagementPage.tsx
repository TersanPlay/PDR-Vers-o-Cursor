import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Building2,
  Eye,
  Edit,
  Trash2,
  Download,
  Mail,
  Phone,
  Globe,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  MessageSquare,
  Send,
  History,
  Paperclip,
  Mic,
  MicOff,
  Bell,
  Key,
  Shield,
  RefreshCw,
  Copy,
  EyeOff,
  Clock,
  Plus
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
// Imports removidos - não utilizados
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Cabinet, 
  CabinetCredentials, 
  CabinetCredentialsUpdateData, 
  PasswordValidationResult 
} from '@/types'
import { credentialsService } from '@/services/credentialsService'
import { auditService } from '@/services/auditService'
import { useAuth } from '@/contexts/AuthContext'
import { validatePasswordStrength } from '@/utils/validation'
import {
  CabinetFilters,
  CabinetTable,
  CabinetCards,
  CabinetPagination,
  useCabinetFilters
} from '@/components/cabinet-management'

// Tipo para histórico de alterações
type AuditLog = {
  id: string
  cabinetId: string
  cabinetName: string
  action: 'status_change' | 'created' | 'updated' | 'deleted' | 'credentials_change_error'
  oldValue?: string
  newValue?: string
  comment?: string
  userId: string
  userName: string
  timestamp: Date
}

// Tipos para sistema de mensagens
type MessageAttachment = {
  id: string
  name: string
  type: 'file' | 'audio'
  url: string
  size: number
  duration?: number // para áudios em segundos
}

type Message = {
  id: string
  cabinetId: string
  content: string
  attachments: MessageAttachment[]
  userId: string
  userName: string
  timestamp: Date
  isStatusRelated: boolean
  statusChange?: {
    from: string
    to: string
  }
}

type NotificationSettings = {
  statusChanges: boolean
  newMessages: boolean
  emailNotifications: boolean
}

// Dados simulados para demonstração
const mockCabinets: (Cabinet & { 
  adminName: string
  adminEmail: string
  status: 'ativo' | 'pendente' | 'inativo'
  registrationDate: Date
})[] = [
  {
    id: '1',
    name: 'Gabinete do Vereador João Silva',
    councilMemberName: 'João Silva',
    municipality: 'São Paulo',
    city: 'São Paulo',
    address: {
      street: 'Rua das Flores, 123',
      number: '123',
      complement: 'Sala 101',
      neighborhood: 'Centro',
      zipCode: '01234-567'
    },
    institutionalPhone: '(11) 3333-4444',
    institutionalEmail: 'gabinete@joaosilva.gov.br',
    website: 'https://joaosilva.gov.br',
    socialMedia: {
      facebook: 'https://facebook.com/joaosilva',
      instagram: 'https://instagram.com/joaosilva'
    },
    adminName: 'Maria Santos',
    adminEmail: 'admin@joaosilva.gov.br',
    status: 'ativo',
    registrationDate: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Gabinete da Vereadora Ana Costa',
    councilMemberName: 'Ana Costa',
    municipality: 'Rio de Janeiro',
    city: 'Rio de Janeiro',
    address: {
      street: 'Avenida Atlântica, 456',
      number: '456',
      neighborhood: 'Copacabana',
      zipCode: '22070-001'
    },
    institutionalPhone: '(21) 2222-3333',
    institutionalEmail: 'contato@anacosta.gov.br',
    adminName: 'Carlos Oliveira',
    adminEmail: 'carlos@anacosta.gov.br',
    status: 'pendente',
    registrationDate: new Date('2024-02-20'),
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20')
  },
  {
    id: '3',
    name: 'Gabinete do Vereador Pedro Lima',
    councilMemberName: 'Pedro Lima',
    municipality: 'Belo Horizonte',
    city: 'Belo Horizonte',
    address: {
      street: 'Rua da Liberdade, 789',
      number: '789',
      neighborhood: 'Savassi',
      zipCode: '30112-000'
    },
    institutionalPhone: '(31) 3333-4444',
    institutionalEmail: 'gabinete@pedrolima.gov.br',
    adminName: 'Lucia Santos',
    adminEmail: 'lucia@pedrolima.gov.br',
    status: 'ativo',
    registrationDate: new Date('2024-03-10'),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  }
]

// Mock data para histórico de auditoria
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    cabinetId: '1',
    cabinetName: 'Gabinete do Vereador João Silva',
    action: 'status_change',
    oldValue: 'pendente',
    newValue: 'ativo',
    comment: 'Documentação aprovada e gabinete ativado',
    userId: 'admin1',
    userName: 'Administrador Sistema',
    timestamp: new Date('2024-01-16T10:30:00')
  },
  {
    id: '2',
    cabinetId: '2',
    cabinetName: 'Gabinete da Vereadora Ana Costa',
    action: 'created',
    newValue: 'pendente',
    comment: 'Gabinete criado aguardando aprovação',
    userId: 'admin1',
    userName: 'Administrador Sistema',
    timestamp: new Date('2024-02-20T14:15:00')
  },
  {
    id: '3',
    cabinetId: '3',
    cabinetName: 'Gabinete do Vereador Pedro Lima',
    action: 'status_change',
    oldValue: 'pendente',
    newValue: 'ativo',
    comment: 'Aprovação automática - documentos em ordem',
    userId: 'admin2',
    userName: 'Maria Administradora',
    timestamp: new Date('2024-03-11T09:45:00')
  }
]

// Mock data para mensagens
const mockMessages: Message[] = [
  {
    id: '1',
    cabinetId: '1',
    content: 'Status alterado para ativo após aprovação da documentação.',
    attachments: [],
    userId: 'admin1',
    userName: 'Administrador Sistema',
    timestamp: new Date('2024-01-16T10:30:00'),
    isStatusRelated: true,
    statusChange: {
      from: 'pendente',
      to: 'ativo'
    }
  },
  {
    id: '2',
    cabinetId: '2',
    content: 'Documentos adicionais solicitados para aprovação.',
    attachments: [
      {
        id: 'att1',
        name: 'documentos_pendentes.pdf',
        type: 'file',
        url: '/files/documentos_pendentes.pdf',
        size: 2048576
      }
    ],
    userId: 'admin1',
    userName: 'Administrador Sistema',
    timestamp: new Date('2024-02-21T14:15:00'),
    isStatusRelated: false
  }
]

const CabinetManagementPage: React.FC = () => {
  const { user, canManageCredentials } = useAuth()
  
  // Estados locais para dados
  const [cabinets, setCabinets] = useState(mockCabinets)
  
  // Hook para gerenciar filtros, ordenação e paginação
  const {
    searchTerm,
    statusFilter,
    viewMode,
    tableDensity,
    sortField,
    sortDirection,
    currentPage,
    itemsPerPage,
    filteredCabinets,
    currentCabinets,
    totalPages,
    setSearchTerm,
    setStatusFilter,
    setViewMode,
    setTableDensity,
    handleSort,
    handlePageChange,
    handleItemsPerPageChange,
    getDensityClasses
  } = useCabinetFilters({ cabinets })
  
  // Estados para modais e dialogs
  const [selectedCabinet, setSelectedCabinet] = useState<typeof mockCabinets[0] | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [showCommentDialog, setShowCommentDialog] = useState(false)
  const [selectedCabinetForComment, setSelectedCabinetForComment] = useState<Cabinet | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [comment, setComment] = useState('')
  const [showAuditDialog, setShowAuditDialog] = useState(false)
  const [selectedCabinetForAudit] = useState<Cabinet | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [showMessagesDialog, setShowMessagesDialog] = useState(false)
  const [selectedCabinetForMessages, setSelectedCabinetForMessages] = useState<Cabinet | null>(null)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [notificationSettings] = useState<NotificationSettings>({
    statusChanges: true,
    newMessages: true,
    emailNotifications: false
  })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCabinetForDelete, setSelectedCabinetForDelete] = useState<Cabinet | null>(null)
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('')
  
  // Estados para gerenciamento de credenciais
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false)
  const [selectedCabinetForCredentials, setSelectedCabinetForCredentials] = useState<Cabinet | null>(null)
  const [cabinetCredentials, setCabinetCredentials] = useState<CabinetCredentials | null>(null)
  const [credentialsFormData, setCredentialsFormData] = useState<CabinetCredentialsUpdateData>({})
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(false)
  const [credentialsError, setCredentialsError] = useState<string | null>(null)
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null)

  // Função para obter badge de status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default">{status}</Badge>
      case 'pendente':
        return <Badge variant="secondary">{status}</Badge>
      case 'inativo':
        return <Badge variant="destructive">{status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Handlers
  const handleViewCabinet = (cabinet: typeof mockCabinets[0]) => {
    setSelectedCabinet(cabinet)
    setIsViewDialogOpen(true)
  }

  const handleShowMessages = (cabinet: typeof mockCabinets[0]) => {
    setSelectedCabinetForMessages(cabinet)
    setShowMessagesDialog(true)
  }

  const handleManageCredentials = async (cabinet: typeof mockCabinets[0]) => {
    setSelectedCabinetForCredentials(cabinet)
    setIsLoadingCredentials(true)
    setCredentialsError('')
    
    try {
      // Simular carregamento das credenciais atuais
      const credentials: CabinetCredentials = {
        id: `cred_${cabinet.id}`,
        cabinetId: cabinet.id,
        username: cabinet.adminEmail.split('@')[0],
        email: cabinet.adminEmail,
        lastPasswordChange: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
        isActive: true,
        createdAt: cabinet.createdAt,
        updatedAt: cabinet.updatedAt
      }
      
      setCabinetCredentials(credentials)
      setCredentialsFormData({
        username: credentials.username,
        email: credentials.email,
        password: '',
        confirmPassword: ''
      })
      setShowCredentialsDialog(true)
    } catch (error) {
      setCredentialsError('Erro ao carregar credenciais')
    } finally {
      setIsLoadingCredentials(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleCredentialsFormChange = (field: string, value: string) => {
    setCredentialsFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Validar senha se o campo for password
    if (field === 'password' && value) {
      const validation = validatePasswordStrength(value)
      setPasswordValidation(validation)
    }
  }

  // Funções movidas para componentes específicos (SortableHeader, StatusBadge, etc.)

  // Função para iniciar mudança de status
  const handleStatusChange = (cabinet: Cabinet, status: string) => {
    setSelectedCabinetForComment(cabinet)
    setNewStatus(status)
    setShowCommentDialog(true)
  }

  const handleConfirmStatusChange = () => {
    if (selectedCabinetForComment && newStatus) {
      const oldStatus = (selectedCabinetForComment as typeof mockCabinets[0]).status
      
      // Atualizar o status do gabinete
      setCabinets(prev => prev.map(cabinet => 
        cabinet.id === selectedCabinetForComment.id 
          ? { ...cabinet, status: newStatus as 'ativo' | 'pendente' | 'inativo', updatedAt: new Date() } 
          : cabinet
      ))
      
      // Adicionar entrada no histórico de auditoria
      const newAuditLog: AuditLog = {
        id: Date.now().toString(),
        cabinetId: selectedCabinetForComment.id,
        cabinetName: selectedCabinetForComment.name,
        action: 'status_change',
        oldValue: oldStatus,
        newValue: newStatus,
        comment: comment || undefined,
        userId: 'current_user',
        userName: 'Usuário Atual',
        timestamp: new Date()
      }
      
      setAuditLogs(prev => [newAuditLog, ...prev])
      
      // Criar mensagem automática para mudança de status
      if (notificationSettings.statusChanges) {
        const statusMessage: Message = {
          id: Date.now().toString() + '_msg',
          cabinetId: selectedCabinetForComment.id,
          content: comment || `Status alterado de ${oldStatus} para ${newStatus}`,
          attachments: [],
          userId: 'current_user',
          userName: 'Usuário Atual',
          timestamp: new Date(),
          isStatusRelated: true,
          statusChange: {
            from: oldStatus,
            to: newStatus
          }
        }
        setMessages(prev => [statusMessage, ...prev])
      }
      
      // Reset do estado
      setShowCommentDialog(false)
      setSelectedCabinetForComment(null)
      setNewStatus('')
      setComment('')
    }
  }



  const confirmDeleteCabinet = () => {
    if (deleteConfirmationText === 'Deletar Gabinete' && selectedCabinetForDelete) {
      setCabinets(prev => prev.filter(cabinet => cabinet.id !== selectedCabinetForDelete.id))
      setShowDeleteDialog(false)
      setSelectedCabinetForDelete(null)
      setDeleteConfirmationText('')
    }
  }

  const cancelDeleteCabinet = () => {
    setShowDeleteDialog(false)
    setSelectedCabinetForDelete(null)
    setDeleteConfirmationText('')
  }



  const handleSendMessage = () => {
    if (selectedCabinetForMessages && (newMessage.trim() || attachments.length > 0 || audioBlob)) {
      const messageAttachments: MessageAttachment[] = []
      
      // Processar anexos de arquivo
      attachments.forEach((file, index) => {
        messageAttachments.push({
          id: `att_${Date.now()}_${index}`,
          name: file.name,
          type: 'file',
          url: URL.createObjectURL(file),
          size: file.size
        })
      })
      
      // Processar áudio gravado
      if (audioBlob) {
        messageAttachments.push({
          id: `audio_${Date.now()}`,
          name: 'audio_gravado.webm',
          type: 'audio',
          url: URL.createObjectURL(audioBlob),
          size: audioBlob.size,
          duration: 0 // Seria calculado em uma implementação real
        })
      }
      
      const message: Message = {
        id: Date.now().toString(),
        cabinetId: selectedCabinetForMessages.id,
        content: newMessage.trim(),
        attachments: messageAttachments,
        userId: 'current_user',
        userName: 'Usuário Atual',
        timestamp: new Date(),
        isStatusRelated: false
      }
      
      setMessages(prev => [message, ...prev])
      
      // Reset
      setNewMessage('')
      setAttachments([])
      setAudioBlob(null)
    }
  }

  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  // Função para verificar permissões de microfone
  const checkMicrophonePermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName })
      return result.state
    } catch (error) {
      // Fallback se a API de permissões não estiver disponível
      return 'prompt'
    }
  }

  const startRecording = async () => {
    // Verificar se o navegador suporta a API de mídia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Seu navegador não suporta gravação de áudio. Use um navegador mais recente.')
      return
    }

    // Verificar permissões antes de tentar acessar
    const permission = await checkMicrophonePermission()
    if (permission === 'denied') {
      alert('Acesso ao microfone foi negado. Para habilitar:\n\n1. Clique no ícone de cadeado/microfone na barra de endereços\n2. Selecione "Permitir" para microfone\n3. Recarregue a página e tente novamente')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Gravação iniciada com sucesso
      
      // Salvar referência para parar manualmente
      (window as any).currentRecorder = mediaRecorder
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error)
      
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            alert('Permissão negada para acessar o microfone. Por favor, permita o acesso ao microfone nas configurações do navegador e tente novamente.')
            break
          case 'NotFoundError':
            alert('Nenhum microfone foi encontrado. Verifique se há um microfone conectado ao dispositivo.')
            break
          case 'NotReadableError':
            alert('O microfone está sendo usado por outro aplicativo. Feche outros aplicativos que possam estar usando o microfone.')
            break
          case 'OverconstrainedError':
            alert('As configurações de áudio solicitadas não são suportadas pelo seu dispositivo.')
            break
          case 'SecurityError':
            alert('Acesso ao microfone bloqueado por questões de segurança. Certifique-se de estar usando HTTPS.')
            break
          default:
            alert(`Erro ao acessar o microfone: ${error.message}`)
        }
      } else {
        alert('Erro desconhecido ao acessar o microfone. Verifique as permissões e tente novamente.')
      }
    }
  }

  const stopRecording = () => {
    const recorder = (window as any).currentRecorder
    if (recorder && recorder.state === 'recording') {
      recorder.stop()
      setIsRecording(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }





  const handleUpdateCredentials = async () => {
    if (!selectedCabinetForCredentials || !user) return
    
    // Validar formulário
    if (!credentialsFormData.username?.trim()) {
      setCredentialsError('Nome de usuário é obrigatório')
      return
    }
    
    if (credentialsFormData.password && !passwordValidation?.isValid) {
      setCredentialsError('A senha não atende aos critérios de segurança')
      return
    }
    
    if (credentialsFormData.password !== credentialsFormData.confirmPassword) {
      setCredentialsError('As senhas não coincidem')
      return
    }
    
    setIsLoadingCredentials(true)
    setCredentialsError('')
    
    // Log de tentativa de alteração de credenciais
    await auditService.log({
      userId: user.id,
      action: 'credentials_change_attempt',
      resourceType: 'cabinet',
      resourceId: selectedCabinetForCredentials.id,
      details: JSON.stringify({
        cabinetName: selectedCabinetForCredentials.name,
        changedFields: {
          username: credentialsFormData.username !== cabinetCredentials?.username,
          password: !!credentialsFormData.password
        }
      })
    })
    
    try {
      await credentialsService.updateCabinetCredentials(
        selectedCabinetForCredentials.id,
        credentialsFormData,
        user.id
      )
      
      // Log de sucesso na alteração de credenciais
      await auditService.log({
        userId: user.id,
        action: 'credentials_change_success',
        resourceType: 'cabinet',
        resourceId: selectedCabinetForCredentials.id,
        details: JSON.stringify({
          cabinetName: selectedCabinetForCredentials.name,
          changedFields: {
            username: credentialsFormData.username !== cabinetCredentials?.username,
            password: !!credentialsFormData.password
          }
        })
      })
      
      // Fechar diálogo e limpar estado
      setShowCredentialsDialog(false)
      setSelectedCabinetForCredentials(null)
      setCabinetCredentials(null)
      setCredentialsFormData({ username: '', password: '', confirmPassword: '' })
      setPasswordValidation(null)
      
      // Mostrar mensagem de sucesso (você pode implementar um toast aqui)
      alert('Credenciais atualizadas com sucesso!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar credenciais'
      
      // Log de erro na alteração de credenciais
      await auditService.log({
        userId: user.id,
        action: 'credentials_change_error',
        resourceType: 'cabinet',
        resourceId: selectedCabinetForCredentials.id,
        details: JSON.stringify({
          cabinetName: selectedCabinetForCredentials.name,
          error: errorMessage,
          changedFields: {
            username: credentialsFormData.username !== cabinetCredentials?.username,
            password: !!credentialsFormData.password
          }
        })
      })
      
      setCredentialsError(errorMessage)
    } finally {
      setIsLoadingCredentials(false)
    }
  }

  const handleGeneratePassword = () => {
    const newPassword = credentialsService.generateSecurePassword()
    setGeneratedPassword(newPassword)
    setCredentialsFormData(prev => ({
      ...prev,
      password: newPassword,
      confirmPassword: newPassword
    }))
    
    const validation = validatePasswordStrength(newPassword)
    setPasswordValidation({
      isValid: validation.isValid,
      errors: validation.errors,
      strength: validation.strength
    })
    setPasswordStrength(validation.strength)
  }

  const handleCopyPassword = async () => {
    if (generatedPassword) {
      try {
        await navigator.clipboard.writeText(generatedPassword)
        // Mostrar feedback visual (você pode implementar um toast aqui)
        alert('Senha copiada para a área de transferência!')
      } catch (error) {
        console.error('Erro ao copiar senha:', error)
      }
    }
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  // Componente CabinetCard removido - agora gerenciado pelo CabinetTable

  const exportData = () => {
    const csvContent = [
      ['Nome do Gabinete', 'Vereador', 'Município', 'Administrador', 'Email Admin', 'Status', 'Data Cadastro'],
      ...filteredCabinets.map(cabinet => [
        cabinet.name,
        cabinet.councilMemberName,
        cabinet.municipality,
        cabinet.adminName,
        cabinet.adminEmail,
        cabinet.status,
        cabinet.registrationDate.toLocaleDateString('pt-BR')
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `gabinetes_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const stats = {
    total: cabinets.length,
    ativos: cabinets.filter(c => c.status === 'ativo').length,
    pendentes: cabinets.filter(c => c.status === 'pendente').length,
    inativos: cabinets.filter(c => c.status === 'inativo').length
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            Gerenciar Cadastros de Gabinetes
          </h1>
          <p className="text-gray-600 mt-1">
            Visualize e gerencie todos os gabinetes cadastrados no sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Gabinetes
            </CardTitle>
            <Building2 className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Gabinetes Ativos
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.ativos}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pendentes de Aprovação
            </CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.pendentes}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Gabinetes Inativos
            </CardTitle>
            <XCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.inativos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Controles */}
      <CabinetFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        viewMode={viewMode}
        tableDensity={tableDensity}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onViewModeChange={setViewMode}
        onTableDensityChange={setTableDensity}
        canCreate={false}
      />

      {/* Lista de Gabinetes */}
      {viewMode === 'table' ? (
        <CabinetTable
          cabinets={currentCabinets}
          sortField={sortField}
          sortDirection={sortDirection}
          density={tableDensity}
          densityClasses={getDensityClasses()}
          onSort={handleSort}
          onView={handleViewCabinet}
          onEdit={() => {}}
          onDelete={() => {}}
          onStatusChange={handleStatusChange}
          onShowMessages={handleShowMessages}
          onManageCredentials={handleManageCredentials}
          onShowHistory={() => {}}
          canManageCredentials={canManageCredentials?.() ?? false}
        />
      ) : (
        <CabinetCards
          cabinets={currentCabinets}
          onView={handleViewCabinet}
          onEdit={() => {}}
          onDelete={() => {}}
          onStatusChange={handleStatusChange}
          onShowMessages={handleShowMessages}
          onShowCredentials={handleManageCredentials}
          onShowHistory={() => {}}
          canManageCredentials={canManageCredentials?.() ?? false}
        />
      )}
      
      {/* Paginação */}
      <CabinetPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredCabinets.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Dialogs */}
      {/* Dialog de Visualização */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Detalhes do Gabinete
            </DialogTitle>
            <DialogDescription>
              Informações completas do gabinete selecionado
            </DialogDescription>
          </DialogHeader>
          
          {selectedCabinet && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Dados do Gabinete
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nome do Gabinete</label>
                      <p className="text-gray-900">{selectedCabinet.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Vereador</label>
                      <p className="text-gray-900">{selectedCabinet.councilMemberName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Município</label>
                      <p className="text-gray-900">{selectedCabinet.municipality}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Cidade</label>
                      <p className="text-gray-900">{selectedCabinet.city}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedCabinet.status)}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Administrador
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nome</label>
                      <p className="text-gray-900">{selectedCabinet.adminName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">E-mail</label>
                      <p className="text-gray-900">{selectedCabinet.adminEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Data de Cadastro</label>
                      <p className="text-gray-900">{selectedCabinet.registrationDate.toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              {selectedCabinet.address && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Endereço
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">
                      {selectedCabinet.address.street}, {selectedCabinet.address.number}
                      {selectedCabinet.address.complement && `, ${selectedCabinet.address.complement}`}
                    </p>
                    <p className="text-gray-600">
                      {selectedCabinet.address.neighborhood} - CEP: {selectedCabinet.address.zipCode}
                    </p>
                  </div>
                </div>
              )}

              {/* Contatos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contatos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCabinet.institutionalPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedCabinet.institutionalPhone}</span>
                    </div>
                  )}
                  {selectedCabinet.institutionalEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedCabinet.institutionalEmail}</span>
                    </div>
                  )}
                  {selectedCabinet.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a href={selectedCabinet.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedCabinet.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Redes Sociais */}
              {selectedCabinet.socialMedia && Object.values(selectedCabinet.socialMedia).some(Boolean) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Redes Sociais</h3>
                  <div className="space-y-2">
                    {selectedCabinet.socialMedia.facebook && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 w-20">Facebook:</span>
                        <a href={selectedCabinet.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedCabinet.socialMedia.facebook}
                        </a>
                      </div>
                    )}
                    {selectedCabinet.socialMedia.instagram && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 w-20">Instagram:</span>
                        <a href={selectedCabinet.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedCabinet.socialMedia.instagram}
                        </a>
                      </div>
                    )}
                    {selectedCabinet.socialMedia.tiktok && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 w-20">TikTok:</span>
                        <a href={selectedCabinet.socialMedia.tiktok} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedCabinet.socialMedia.tiktok}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

        {/* Diálogo de Comentário para Mudança de Status */}
        <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Alterar Status
              </DialogTitle>
              <DialogDescription>
                {selectedCabinetForComment && (
                  <span>
                    Alterando status do gabinete <strong>{selectedCabinetForComment.name}</strong> para <strong>{newStatus}</strong>
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="comment">Comentário/Observação</Label>
                <Textarea
                  id="comment"
                  placeholder="Adicione um comentário sobre esta alteração de status..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCommentDialog(false)
                  setSelectedCabinetForComment(null)
                  setNewStatus('')
                  setComment('')
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleConfirmStatusChange} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Confirmar Alteração
              </Button>
            </div>
          </DialogContent>
         </Dialog>

         {/* Diálogo de Histórico de Auditoria */}
         <Dialog open={showAuditDialog} onOpenChange={setShowAuditDialog}>
           <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <History className="h-5 w-5" />
                 Histórico de Alterações
               </DialogTitle>
               <DialogDescription>
                 {selectedCabinetForAudit && (
                   <span>
                     Histórico completo de alterações do gabinete <strong>{selectedCabinetForAudit.name}</strong>
                   </span>
                 )}
               </DialogDescription>
             </DialogHeader>
             
             <div className="space-y-4">
               {selectedCabinetForAudit && (
                 <div className="space-y-3">
                   {auditLogs
                     .filter(log => log.cabinetId === selectedCabinetForAudit.id)
                     .map((log) => (
                       <div key={log.id} className="border rounded-lg p-4 space-y-2">
                         <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             {log.action === 'status_change' && <Clock className="h-4 w-4 text-blue-500" />}
                             {log.action === 'created' && <Plus className="h-4 w-4 text-green-500" />}
                             {log.action === 'updated' && <Edit className="h-4 w-4 text-yellow-500" />}
                             {log.action === 'deleted' && <Trash2 className="h-4 w-4 text-red-500" />}
                             <span className="font-medium">
                               {log.action === 'status_change' && 'Alteração de Status'}
                               {log.action === 'created' && 'Criação'}
                               {log.action === 'updated' && 'Atualização'}
                               {log.action === 'deleted' && 'Exclusão'}
                             </span>
                           </div>
                           <span className="text-sm text-gray-500">
                             {log.timestamp.toLocaleString('pt-BR')}
                           </span>
                         </div>
                         
                         {log.action === 'status_change' && (
                           <div className="text-sm">
                             <span className="text-gray-600">Status alterado de </span>
                             <Badge variant="outline" className="mx-1">{log.oldValue}</Badge>
                             <span className="text-gray-600"> para </span>
                             <Badge variant="outline" className="mx-1">{log.newValue}</Badge>
                           </div>
                         )}
                         
                         {log.comment && (
                           <div className="bg-gray-50 p-3 rounded text-sm">
                             <strong>Comentário:</strong> {log.comment}
                           </div>
                         )}
                         
                         <div className="flex items-center gap-1 text-xs text-gray-500">
                           <User className="h-3 w-3" />
                           <span>{log.userName}</span>
                         </div>
                       </div>
                     ))
                   }
                   
                   {auditLogs.filter(log => log.cabinetId === selectedCabinetForAudit.id).length === 0 && (
                     <div className="text-center py-8 text-gray-500">
                       <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                       <p>Nenhum histórico encontrado para este gabinete.</p>
                     </div>
                   )}
                 </div>
               )}
             </div>
             
             <div className="flex justify-end pt-4">
               <Button variant="outline" onClick={() => setShowAuditDialog(false)}>
                 Fechar
               </Button>
             </div>
           </DialogContent>
         </Dialog>

        {/* Dialog de Mensagens */}
        <Dialog open={showMessagesDialog} onOpenChange={setShowMessagesDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Mensagens - {selectedCabinetForMessages?.name}
              </DialogTitle>
              <DialogDescription>
                Sistema de comunicação integrado com anexos e áudio
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Lista de Mensagens */}
              <div className="max-h-96 overflow-y-auto space-y-3 border rounded-lg p-4">
                {messages
                  .filter(msg => msg.cabinetId === selectedCabinetForMessages?.id)
                  .map((message) => (
                    <div key={message.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-sm">{message.userName}</span>
                          {message.isStatusRelated && (
                            <Badge variant="secondary" className="text-xs">
                              Mudança de Status
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      
                      {message.content && (
                        <p className="text-sm text-gray-700 mb-2">{message.content}</p>
                      )}
                      
                      {message.statusChange && (
                        <div className="bg-blue-50 p-2 rounded text-xs">
                          Status: {message.statusChange.from} → {message.statusChange.to}
                        </div>
                      )}
                      
                      {/* Anexos */}
                      {message.attachments.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {message.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              {attachment.type === 'audio' ? (
                                <div className="flex items-center gap-2">
                                  <Mic className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm">{attachment.name}</span>
                                  <audio controls className="h-8">
                                    <source src={attachment.url} type="audio/webm" />
                                  </audio>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Paperclip className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{attachment.name}</span>
                                  <span className="text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={attachment.url} download={attachment.name}>
                                      Download
                                    </a>
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                
                {messages.filter(msg => msg.cabinetId === selectedCabinetForMessages?.id).length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Nenhuma mensagem encontrada</p>
                  </div>
                )}
              </div>
              
              {/* Formulário de Nova Mensagem */}
              <div className="space-y-3 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Nova Mensagem</Label>
                  <Textarea
                    id="message"
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={3}
                  />
                </div>
                
                {/* Anexos */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Anexos</Label>
                    <div className="space-y-1">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Áudio Gravado */}
                {audioBlob && (
                  <div className="space-y-2">
                    <Label>Áudio Gravado</Label>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Mic className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">audio_gravado.webm</span>
                      <audio controls className="h-8">
                        <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                      </audio>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAudioBlob(null)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Controles */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Anexar Arquivo */}
                    <Button variant="outline" size="sm" asChild>
                      <label className="cursor-pointer">
                        <Paperclip className="h-4 w-4 mr-1" />
                        Anexar
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileAttachment}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                        />
                      </label>
                    </Button>
                    
                    {/* Gravação de Áudio */}
                    {!isRecording ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={startRecording}
                        disabled={!!audioBlob}
                      >
                        <Mic className="h-4 w-4 mr-1" />
                        Gravar
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={stopRecording}
                      >
                        <MicOff className="h-4 w-4 mr-1" />
                        Parar
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && attachments.length === 0 && !audioBlob}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Enviar
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Confirmação de Exclusão */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Confirmar Exclusão
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Esta ação não pode ser desfeita. O gabinete será permanentemente removido do sistema.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedCabinetForDelete && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-800">
                      {selectedCabinetForDelete.name}
                    </span>
                  </div>
                  <div className="text-sm text-red-700">
                    Vereador(a): {selectedCabinetForDelete.councilMemberName}
                  </div>
                  <div className="text-sm text-red-700">
                    Município: {selectedCabinetForDelete.municipality}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="deleteConfirmation" className="text-sm font-medium">
                  Para confirmar a exclusão, digite exatamente: <span className="font-bold text-red-600">Deletar Gabinete</span>
                </Label>
                <Input
                  id="deleteConfirmation"
                  type="text"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  placeholder="Digite: Deletar Gabinete"
                  className="border-red-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={cancelDeleteCabinet}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDeleteCabinet}
                disabled={deleteConfirmationText !== 'Deletar Gabinete'}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Gabinete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Gerenciamento de Credenciais */}
        <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Gerenciar Credenciais do Gabinete
              </DialogTitle>
              <DialogDescription>
                {selectedCabinetForCredentials && (
                  <span>Alterar credenciais de acesso para: <strong>{selectedCabinetForCredentials.name}</strong></span>
                )}
              </DialogDescription>
            </DialogHeader>
            
            {isLoadingCredentials ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Carregando credenciais...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {credentialsError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-red-800 font-medium">Erro</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">{credentialsError}</p>
                  </div>
                )}
                
                {/* Informações Atuais */}
                {cabinetCredentials && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Credenciais Atuais</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Usuário:</span>
                        <p className="font-medium">{cabinetCredentials.username}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Última alteração:</span>
                        <p className="font-medium">
                          {cabinetCredentials.lastPasswordChange 
                            ? new Date(cabinetCredentials.lastPasswordChange).toLocaleDateString('pt-BR')
                            : 'Nunca alterada'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Formulário de Alteração */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={credentialsFormData.password}
                          onChange={(e) => handleCredentialsFormChange('password', e.target.value)}
                          placeholder="Digite a nova senha"
                          className={passwordValidation?.isValid === false ? 'border-red-300' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={credentialsFormData.confirmPassword}
                          onChange={(e) => handleCredentialsFormChange('confirmPassword', e.target.value)}
                          placeholder="Confirme a nova senha"
                          className={passwordValidation?.isValid === false ? 'border-red-300' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Indicador de Força da Senha */}
                    {passwordStrength && credentialsFormData.password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                passwordStrength === 'weak' ? 'w-1/3 bg-red-500' :
                                passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' :
                                'w-full bg-green-500'
                              }`}
                            />
                          </div>
                          <span className={`text-sm font-medium ${
                            passwordStrength === 'weak' ? 'text-red-600' :
                            passwordStrength === 'medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {passwordStrength === 'weak' ? 'Fraca' :
                             passwordStrength === 'medium' ? 'Média' : 'Forte'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Gerador de Senha */}
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGeneratePassword}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Gerar Senha Segura
                    </Button>
                    {generatedPassword && (
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                          {generatedPassword}
                        </code>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyPassword}
                          className="flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Validação da Senha */}
                  {passwordValidation?.errors && passwordValidation.errors.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-red-800 font-medium text-sm">Requisitos da senha:</span>
                      </div>
                      <ul className="text-red-700 text-sm space-y-1">
                        {passwordValidation?.errors?.map((error, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {passwordValidation?.isValid && credentialsFormData.password && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-800 font-medium text-sm">Senha válida!</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCredentialsDialog(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleUpdateCredentials}
                disabled={!passwordValidation?.isValid || isLoadingCredentials}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Key className="h-4 w-4 mr-2" />
                Atualizar Credenciais
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  )
}

export default CabinetManagementPage