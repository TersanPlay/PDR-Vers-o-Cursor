import React, { useState, useEffect } from 'react'
import { usePermissions } from '../contexts/AuthContext'
import { useMaintenance } from '../contexts/MaintenanceContext'
import packageJson from '../../package.json'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Badge } from '../components/ui/badge'
import { Settings, Users, Shield, Database, Lock } from 'lucide-react'
import { User, AuditLog } from '../types'
import { 
  UserManagement, 
  SystemSettingsComponent, 
  SecuritySettings 
} from '../components/settings'

interface SystemSettings {
  systemName: string
  version: string
  sessionTimeout: number
  maintenanceMode: boolean
  backupFrequency: string
  maxFileSize: number
  enableNotifications: boolean
  enableAuditLog: boolean
}

/**
 * Página de configurações e administração do sistema
 */
const SettingsPage: React.FC = () => {
  const permissions = usePermissions()
  const { isMaintenanceMode } = useMaintenance()
  const [users, setUsers] = useState<User[]>([])
  const [settings, setSettings] = useState<SystemSettings>({
    systemName: 'Gabinete Digital',
    version: packageJson.version,
    sessionTimeout: 30,
    maintenanceMode: isMaintenanceMode,
    backupFrequency: 'daily',
    maxFileSize: 10,
    enableNotifications: true,
    enableAuditLog: true
  })
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Sincronizar o estado local com o contexto global
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      maintenanceMode: isMaintenanceMode
    }))
  }, [isMaintenanceMode])

  // Carregar dados iniciais
  useEffect(() => {
    // Simular carregamento inicial de usuários
    const mockUsers: User[] = [
      {
          id: '1',
          name: 'João Silva',
          email: 'joao@gabinete.gov.br',
          role: 'admin',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@gabinete.gov.br',
          role: 'assessor',
          createdAt: new Date('2024-01-16'),
          updatedAt: new Date('2024-01-19')
        },
        {
          id: '3',
          name: 'Pedro Costa',
          email: 'pedro@gabinete.gov.br',
          role: 'visualizador',
          createdAt: new Date('2024-01-17'),
          updatedAt: new Date('2024-01-18')
        }
    ]
    setUsers(mockUsers)
  }, [])

  // Handlers para coordenar os componentes
  const handleUsersChange = (newUsers: User[]) => {
    setUsers(newUsers)
  }

  const handleSettingsChange = (newSettings: SystemSettings) => {
    setSettings(newSettings)
  }

  const handleAuditLogsChange = (newLogs: AuditLog[]) => {
    setAuditLogs(newLogs)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading)
  }






  if (!permissions.canManageUsers()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Acesso Negado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Você não tem permissão para acessar as configuracoes do sistema.
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
          Configuracoes do Sistema
          <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-700 border-purple-300">
            Admin
          </Badge>
        </h1>
        <p className="text-gray-600 mt-2">
          Gerencie usuários e configuracoes do sistema
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
          <UserManagement
            users={users}
            onUsersChange={handleUsersChange}
            isLoading={isLoading}
            onLoadingChange={handleLoadingChange}
          />
        </TabsContent>

        {/* Aba de Sistema */}
        <TabsContent value="system" className="space-y-6">
          <SystemSettingsComponent
            settings={settings}
            onSettingsChange={handleSettingsChange}
            isLoading={isLoading}
            onLoadingChange={handleLoadingChange}
          />
        </TabsContent>

        {/* Aba de Segurança */}
        <TabsContent value="security" className="space-y-6">
          <SecuritySettings
            auditLogs={auditLogs}
            onAuditLogsChange={handleAuditLogsChange}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={1}
            isLoading={isLoading}
            onLoadingChange={handleLoadingChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsPage