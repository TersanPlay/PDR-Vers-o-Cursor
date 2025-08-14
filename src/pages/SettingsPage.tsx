import React, { useState, useEffect, useCallback } from 'react'
import { usePermissions } from '../contexts/AuthContext'
import { useMaintenance } from '../contexts/MaintenanceContext'
import { auditService } from '../services/auditService'
import packageJson from '../../package.json'
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
  Users,
  Plus,
  Edit,
  Trash2,
  Settings,
  Shield,
  Database,
  Bell,
  Lock,
  Download,
  Upload,
  HardDrive,
  Eye,
  User as UserIcon,
  Mail,
  KeyRound,
  Crown,
  UserCheck,
  UserCog,
  X
} from 'lucide-react'
import { User, UserRole, AuditLog } from '../types'
import { toast } from '../components/ui/use-toast'

interface SystemSettings {
  siteName: string
  sessionTimeout: number
  maintenanceMode: boolean
  systemVersion: string
}

interface UserFormData {
  name: string
  email: string
  role: UserRole
  password?: string
}

/**
 * Página de configurações e administração do sistema
 */
const SettingsPage: React.FC = () => {
  const permissions = usePermissions()
  const { isMaintenanceMode, setMaintenanceMode } = useMaintenance()
  const [users, setUsers] = useState<User[]>([])
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'Gabinete Digital',
    sessionTimeout: 30,
    maintenanceMode: isMaintenanceMode,
    systemVersion: packageJson.version
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userForm, setUserForm] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'visualizador'
  })
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Simular carregamento de usuários
  const loadUsers = async () => {
    setIsLoading(true)
    try {
      // Simulação de dados de usuários
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@gabinete.gov.br',
          role: 'admin',
          createdAt: new Date('2024-01-15'),
          lastLogin: new Date('2024-01-20')
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@gabinete.gov.br',
          role: 'assessor',
          createdAt: new Date('2024-01-16'),
          lastLogin: new Date('2024-01-19')
        },
        {
          id: '3',
          name: 'Pedro Costa',
          email: 'pedro@gabinete.gov.br',
          role: 'visualizador',
          createdAt: new Date('2024-01-17'),
          lastLogin: new Date('2024-01-18')
        }
      ]
      setUsers(mockUsers)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os usuários.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (permissions.canManageUsers()) {
      loadUsers()
    }
  }, [permissions])

  // Sincronizar o estado local com o contexto global
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      maintenanceMode: isMaintenanceMode
    }))
  }, [isMaintenanceMode])

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Atualizar o contexto global do modo de manutenção
      setMaintenanceMode(settings.maintenanceMode)
      
      // Simulação de salvamento das configurações
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Sucesso',
        description: settings.maintenanceMode 
          ? 'Modo de manutenção ativado. Sistema bloqueado para usuários não administradores.'
          : 'Configurações salvas com sucesso.'
      })
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveUser = async () => {
    if (!userForm.name || !userForm.email) {
      toast({
        title: 'Erro',
        description: 'Nome e email são obrigatórios.',
        variant: 'destructive'
      })
      return
    }

    // Verificar permissões para criar/editar usuário
    if (editingUser) {
      if (!permissions.canEditUserRole(userForm.role)) {
        toast({
          title: 'Erro',
          description: 'Você não tem permissão para editar usuários com esta função.',
          variant: 'destructive'
        })
        return
      }
    } else {
      if (!permissions.canCreateUserRole(userForm.role)) {
        toast({
          title: 'Erro',
          description: 'Você não tem permissão para criar usuários com esta função.',
          variant: 'destructive'
        })
        return
      }
    }

    setIsLoading(true)
    try {
      // Simulação de salvamento do usuário
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingUser) {
        // Atualizar usuário existente
        setUsers(prev => prev.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...userForm }
            : user
        ))
        toast({
          title: 'Sucesso',
          description: 'Usuário atualizado com sucesso.'
        })
      } else {
        // Criar novo usuário
        const newUser: User = {
          id: Date.now().toString(),
          ...userForm,
          createdAt: new Date(),
          lastLogin: null
        }
        setUsers(prev => [...prev, newUser])
        toast({
          title: 'Sucesso',
          description: 'Usuário criado com sucesso.'
        })
      }
      
      setIsUserDialogOpen(false)
      setEditingUser(null)
      setUserForm({ name: '', email: '', role: 'visualizador' })
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o usuário.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role
    })
    setIsUserDialogOpen(true)
  }

  const handleDeleteUser = async (userId: string) => {
    const userToDelete = users.find(user => user.id === userId)
    if (!userToDelete) return

    // Verificar permissões para excluir usuário
    if (!permissions.canDeleteUserRole(userToDelete.role)) {
      toast({
        title: 'Erro',
        description: 'Você não tem permissão para excluir usuários com esta função.',
        variant: 'destructive'
      })
      return
    }

    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return
    }

    setIsLoading(true)
    try {
      // Simulação de exclusão
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUsers(prev => prev.filter(user => user.id !== userId))
      toast({
        title: 'Sucesso',
        description: 'Usuário excluído com sucesso.'
      })
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o usuário.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'chefe_gabinete':
        return 'Chefe de Gabinete'
      case 'assessor':
        return 'Assessor'
      case 'visualizador':
        return 'Visualizador'
      default:
        return role
    }
  }

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'chefe_gabinete':
        return 'destructive'
      case 'assessor':
        return 'default'
      case 'visualizador':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  // Função para realizar backup do sistema
  const handleBackup = async () => {
    // Verificar se o sistema está em modo de manutenção
    if (!isMaintenanceMode) {
      toast({
        title: 'Operação Não Permitida',
        description: 'O backup só pode ser realizado com o sistema em modo de manutenção.',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulação de processo de backup
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Criar dados de backup simulados
      const backupData = {
        timestamp: new Date().toISOString(),
        version: packageJson.version,
        settings: settings,
        users: users,
        metadata: {
          totalUsers: users.length,
          systemStatus: settings.maintenanceMode ? 'maintenance' : 'operational'
        }
      }
      
      // Criar e baixar arquivo de backup
      const dataStr = JSON.stringify(backupData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `backup-sistema-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast({
        title: 'Backup Realizado',
        description: 'Backup do sistema criado e baixado com sucesso.'
      })
    } catch (error) {
      console.error('Erro ao realizar backup:', error)
      toast({
        title: 'Erro no Backup',
        description: 'Não foi possível realizar o backup do sistema.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para restaurar backup do sistema
  const handleRestore = async () => {
    // Verificar se o sistema está em modo de manutenção
    if (!isMaintenanceMode) {
      toast({
        title: 'Operação Não Permitida',
        description: 'A restauração só pode ser realizada com o sistema em modo de manutenção.',
        variant: 'destructive'
      })
      return
    }

    if (!confirm('Tem certeza que deseja restaurar um backup? Esta ação irá sobrescrever as configurações atuais.')) {
      return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return

      setIsLoading(true)
      try {
        const text = await file.text()
        const backupData = JSON.parse(text)
        
        // Validar estrutura do backup
        if (!backupData.settings || !backupData.users || !backupData.timestamp) {
          throw new Error('Arquivo de backup inválido')
        }
        
        // Simulação de processo de restauração
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Restaurar configurações
        if (backupData.settings) {
          setSettings({
            ...backupData.settings,
            systemVersion: packageJson.version // Manter versão atual
          })
        }
        
        // Restaurar usuários
        if (backupData.users) {
          setUsers(backupData.users)
        }
        
        toast({
          title: 'Restauração Concluída',
          description: `Backup de ${new Date(backupData.timestamp).toLocaleDateString('pt-BR')} restaurado com sucesso.`
        })
      } catch (error) {
        console.error('Erro ao restaurar backup:', error)
        toast({
          title: 'Erro na Restauração',
          description: 'Não foi possível restaurar o backup. Verifique se o arquivo é válido.',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    input.click()
  }

  // Funções para logs de auditoria
  const loadAuditLogs = useCallback(async () => {
    try {
      const response = await auditService.getLogs({ limit: 50 })
      setAuditLogs(response.logs)
      setCurrentPage(1) // Reset para primeira página ao carregar novos logs
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar logs de auditoria',
        variant: 'destructive'
      })
      setAuditLogs([])
      setCurrentPage(1)
    }
  }, [])

  const handleExportAuditLogs = async () => {
    if (!permissions.canViewAuditLogs()) {
      toast({
        title: 'Erro',
        description: 'Você não tem permissão para exportar logs de auditoria',
        variant: 'destructive'
      })
      return
    }

    try {
      setIsLoading(true)
      await auditService.exportLogs()
      toast({
        title: 'Sucesso',
        description: 'Logs de auditoria exportados com sucesso!'
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao exportar logs de auditoria',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getActionLabel = (action: string) => {
    const actions: Record<string, string> = {
      login: 'Login',
      logout: 'Logout',
      create: 'Criação',
      update: 'Atualização',
      delete: 'Exclusão',
      view: 'Visualização',
      search: 'Busca',
      export: 'Exportação',
    }
    return actions[action] || action
  }

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      login: 'bg-green-100 text-green-800',
      logout: 'bg-gray-100 text-gray-800',
      create: 'bg-blue-100 text-blue-800',
      update: 'bg-yellow-100 text-yellow-800',
      delete: 'bg-red-100 text-red-800',
      view: 'bg-purple-100 text-purple-800',
      search: 'bg-indigo-100 text-indigo-800',
      export: 'bg-orange-100 text-orange-800',
    }
    return colors[action] || 'bg-gray-100 text-gray-800'
  }

  // Carregar logs de auditoria quando o componente montar
  useEffect(() => {
    if (permissions.canViewAuditLogs()) {
      loadAuditLogs()
    }
  }, [loadAuditLogs, permissions])

  if (!permissions.canManageUsers()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Acesso Negado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Você não tem permissão para acessar as configurações do sistema.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-l-4 border-l-purple-500">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-8 w-8 text-purple-600" />
          Configurações do Sistema
          <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-700 border-purple-300">
            Admin
          </Badge>
        </h1>
        <p className="text-gray-600 mt-2">
          Gerencie usuários e configurações do sistema
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* Aba de Usuários */}
        <TabsContent value="users" className="space-y-6">
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Users className="h-5 w-5 text-blue-500" />
                    Gerenciamento de Usuários
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Gerencie os usuários do sistema e suas permissões
                  </CardDescription>
                </div>
                <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Novo Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader className="text-center pb-4">
                      <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3">
                        {editingUser ? (
                          <Edit className="h-6 w-6 text-white" />
                        ) : (
                          <Plus className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <DialogTitle className="text-xl font-semibold text-gray-900">
                        {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        {editingUser 
                          ? 'Edite as informações do usuário selecionado'
                          : 'Preencha as informações para criar um novo usuário'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-gray-500" />
                          Nome Completo
                        </Label>
                        <div className="relative">
                          <Input
                            id="name"
                            value={userForm.name}
                            onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Digite o nome completo"
                            className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          Email
                        </Label>
                        <div className="relative">
                          <Input
                            id="email"
                            type="email"
                            value={userForm.email}
                            onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="usuario@exemplo.com"
                            className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-gray-500" />
                          Função no Sistema
                        </Label>
                        <Select
                          value={userForm.role}
                          onValueChange={(value: UserRole) => setUserForm(prev => ({ ...prev, role: value }))}
                        >
                          <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Selecione uma função" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin" className="flex items-center gap-2">
                              <div className="flex items-center gap-2 w-full">
                                <Crown className="h-4 w-4 text-red-500" />
                                <span>Administrador</span>
                                <Badge variant="destructive" className="ml-auto text-xs">Total</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="chefe_gabinete" className="flex items-center gap-2">
                              <div className="flex items-center gap-2 w-full">
                                <UserCog className="h-4 w-4 text-purple-500" />
                                <span>Chefe de Gabinete</span>
                                <Badge variant="secondary" className="ml-auto text-xs">Avançado</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="assessor" className="flex items-center gap-2">
                              <div className="flex items-center gap-2 w-full">
                                <UserCheck className="h-4 w-4 text-blue-500" />
                                <span>Assessor</span>
                                <Badge variant="outline" className="ml-auto text-xs">Padrão</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="visualizador" className="flex items-center gap-2">
                              <div className="flex items-center gap-2 w-full">
                                <Eye className="h-4 w-4 text-gray-500" />
                                <span>Visualizador</span>
                                <Badge variant="outline" className="ml-auto text-xs bg-gray-50">Básico</Badge>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {!editingUser && (
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <KeyRound className="h-4 w-4 text-gray-500" />
                            Senha Temporária
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type="password"
                              value={userForm.password || ''}
                              onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                              placeholder="Digite uma senha temporária"
                              className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            O usuário deverá alterar esta senha no primeiro acesso
                          </p>
                        </div>
                      )}
                    </div>
                    <DialogFooter className="pt-6 border-t border-gray-100">
                      <div className="flex gap-3 w-full">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsUserDialogOpen(false)
                            setEditingUser(null)
                            setUserForm({ name: '', email: '', role: 'visualizador' })
                          }}
                          className="flex-1 h-11 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button 
                          onClick={handleSaveUser} 
                          disabled={isLoading}
                          className="flex-1 h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                              Salvando...
                            </>
                          ) : (
                            <>
                              {editingUser ? (
                                <Edit className="h-4 w-4 mr-2" />
                              ) : (
                                <Plus className="h-4 w-4 mr-2" />
                              )}
                              {editingUser ? 'Atualizar' : 'Criar Usuário'}
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin 
                          ? new Date(user.lastLogin).toLocaleDateString('pt-BR')
                          : 'Nunca'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.role === 'admin'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Sistema */}
        <TabsContent value="system" className="space-y-6">
          <Card className="border-l-4 border-l-green-500 shadow-sm">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Database className="h-5 w-5 text-green-500" />
                Configurações do Sistema
              </CardTitle>
              <CardDescription className="text-gray-600">
                Configure as opções gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="siteName">Nome do Sistema</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="systemVersion">Versão do Sistema</Label>
                  <Input
                    id="systemVersion"
                    value={settings.systemVersion}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                    title="Versão automática baseada no package.json"
                  />
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))}
                    min="5"
                    max="480"
                  />
                </div>


                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                    disabled={!permissions.canAccessMaintenance()}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Label htmlFor="maintenanceMode" className={`text-sm font-medium ${permissions.canAccessMaintenance() ? 'text-gray-700' : 'text-gray-400'}`}>
                    Modo de Manutenção
                    {!permissions.canAccessMaintenance() && (
                      <span className="text-xs text-red-500 ml-2">(Apenas Administradores)</span>
                    )}
                  </Label>
                </div>
              </div>
              
              {settings.maintenanceMode && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Modo de Manutenção Ativo
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          O sistema está em modo de manutenção. Apenas administradores podem acessar o sistema.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Informações do Sistema</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700 mb-4">
                  <div>
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      settings.maintenanceMode 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {settings.maintenanceMode ? 'Manutenção' : 'Operacional'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Último Backup:</span>
                    <span className="ml-2">Hoje às 03:00</span>
                  </div>

                </div>
                
                {/* Seção de Backup e Restauração */}
                <div className="border-t border-blue-200 pt-4">
                  <h5 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    Backup e Restauração
                  </h5>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={handleBackup} 
                      disabled={isLoading || !isMaintenanceMode || !permissions.canManageBackup()}
                      variant="outline"
                      size="sm"
                      className={`flex items-center gap-2 ${
                        isMaintenanceMode && permissions.canManageBackup()
                          ? 'bg-white hover:bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                      }`}
                      title={!permissions.canManageBackup() ? 'Disponível apenas para Administradores' : !isMaintenanceMode ? 'Disponível apenas em modo de manutenção' : ''}
                    >
                      <Download className="h-4 w-4" />
                      {isLoading ? 'Criando Backup...' : 'Fazer Backup'}
                    </Button>
                    <Button 
                      onClick={handleRestore} 
                      disabled={isLoading || !isMaintenanceMode || !permissions.canManageBackup()}
                      variant="outline"
                      size="sm"
                      className={`flex items-center gap-2 ${
                        isMaintenanceMode && permissions.canManageBackup()
                          ? 'bg-white hover:bg-orange-50 border-orange-300 text-orange-700'
                          : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                      }`}
                      title={!permissions.canManageBackup() ? 'Disponível apenas para Administradores' : !isMaintenanceMode ? 'Disponível apenas em modo de manutenção' : ''}
                    >
                      <Upload className="h-4 w-4" />
                      {isLoading ? 'Restaurando...' : 'Restaurar Backup'}
                    </Button>
                  </div>
                  {isMaintenanceMode ? (
                    <p className="text-sm mt-2 text-blue-600">
                      Use o backup para salvar as configurações atuais do sistema. A restauração irá sobrescrever as configurações existentes.
                    </p>
                  ) : (
                    <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
                      <div className="flex items-center justify-center">
                        <p className="text-lg font-semibold text-amber-800 text-center">
                          ⚠️ As operações de backup e restauração só estão disponíveis para Administradores e quando o sistema está em modo de manutenção.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Segurança */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-l-4 border-l-red-500 shadow-sm">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Lock className="h-5 w-5 text-red-500" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>
                Configure as opções de segurança e auditoria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Log de Auditoria</Label>
                    <p className="text-sm text-gray-500">
                      Registrar todas as ações dos usuários no sistema (sempre ativo)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">Ativo</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Logs de Auditoria */}
          {permissions.canViewAuditLogs() && (
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Eye className="h-5 w-5 text-blue-500" />
                  Logs de Auditoria
                  <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-700 border-blue-300">
                    {auditLogs.length} registros
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Visualize e exporte os logs de auditoria do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Últimas {auditLogs.length} ações registradas no sistema
                  </p>
                  <Button
                    onClick={handleExportAuditLogs}
                    disabled={isLoading || auditLogs.length === 0}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Exportar Logs
                  </Button>
                </div>

                {auditLogs.length > 0 ? (
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">Data/Hora</TableHead>
                            <TableHead className="font-semibold">Usuário</TableHead>
                            <TableHead className="font-semibold">Ação</TableHead>
                            <TableHead className="font-semibold">Recurso</TableHead>
                            <TableHead className="font-semibold">IP</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(() => {
                            const startIndex = (currentPage - 1) * itemsPerPage
                            const endIndex = startIndex + itemsPerPage
                            const paginatedLogs = auditLogs.slice(startIndex, endIndex)
                            
                            return paginatedLogs.map((log) => (
                              <TableRow key={log.id} className="hover:bg-gray-50">
                                <TableCell className="font-mono text-sm">
                                  {formatDateTime(log.timestamp)}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {log.userName}
                                </TableCell>
                                <TableCell>
                                  <Badge className={getActionColor(log.action)}>
                                    {getActionLabel(log.action)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                  {log.resource}
                                </TableCell>
                                <TableCell className="font-mono text-sm text-gray-500">
                                  {log.ipAddress}
                                </TableCell>
                              </TableRow>
                            ))
                          })()
                          }
                        </TableBody>
                      </Table>
                    </div>
                    
                    {/* Paginação */}
                    {auditLogs.length > itemsPerPage && (
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, auditLogs.length)} a {Math.min(currentPage * itemsPerPage, auditLogs.length)} de {auditLogs.length} registros
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            Anterior
                          </Button>
                          <span className="text-sm text-gray-600">
                            Página {currentPage} de {Math.ceil(auditLogs.length / itemsPerPage)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(auditLogs.length / itemsPerPage)))}
                            disabled={currentPage === Math.ceil(auditLogs.length / itemsPerPage)}
                          >
                            Próxima
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Eye className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>Nenhum log de auditoria encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsPage