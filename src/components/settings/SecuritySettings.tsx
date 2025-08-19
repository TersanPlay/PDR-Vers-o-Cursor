import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Badge } from '../ui/badge'
import {
  Shield,
  Download,
  Search,
  Calendar,
  User,
  Activity,
  Globe,
  FileText,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react'
import { useToast } from '../ui/use-toast'
import { usePermissions } from '../../contexts/AuthContext'
import { AuditLog } from '../../types'

interface SecuritySettingsProps {
  auditLogs: AuditLog[]
  onAuditLogsChange: (logs: AuditLog[]) => void
  currentPage: number
  onPageChange: (page: number) => void
  totalPages: number
  isLoading: boolean
  onLoadingChange: (loading: boolean) => void
}

/**
 * Componente para gerenciamento de segurança e logs de auditoria
 */
export const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  auditLogs,
  onAuditLogsChange,
  currentPage,
  onPageChange,
  totalPages,
  isLoading,
  onLoadingChange
}) => {
  const permissions = usePermissions()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>(auditLogs)

  // Filtrar logs baseado no termo de busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLogs(auditLogs)
    } else {
      const filtered = auditLogs.filter(log => 
        log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resourceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm)
      )
      setFilteredLogs(filtered)
    }
  }, [auditLogs, searchTerm])

  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }

  const getActionLabel = (action: string): string => {
    const labels: Record<string, string> = {
      'create': 'Criar',
      'read': 'Visualizar',
      'update': 'Atualizar',
      'delete': 'Excluir',
      'export': 'Exportar',
      'login': 'Login',
      'logout': 'Logout',
      'credentials_update': 'Atualizar Credenciais',
      'password_change': 'Alterar Senha',
      'username_change': 'Alterar Nome de Usuário'
    }
    return labels[action] || action
  }

  const getActionColor = (action: string): string => {
    const colors: Record<string, string> = {
      'create': 'default',
      'read': 'outline',
      'update': 'secondary',
      'delete': 'destructive',
      'export': 'outline',
      'login': 'outline',
      'logout': 'outline',
      'credentials_update': 'secondary',
      'password_change': 'secondary',
      'username_change': 'secondary'
    }
    return colors[action] || 'outline'
  }



  const handleExportAuditLogs = async () => {
    if (!permissions.canViewAuditLogs) {
      toast.error('Você não tem permissão para exportar logs de auditoria.')
      return
    }

    try {
      const exportData = filteredLogs.map(log => ({
        'Data/Hora': formatDateTime(log.createdAt),
        'Usuário': log.userId,
        'Ação': getActionLabel(log.action),
        'Recurso': log.resourceType,
        'IP': log.ipAddress,
        'Detalhes': log.details || ''
      }))

      const csvContent = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Logs de auditoria exportados com sucesso.')
    } catch (error) {
      console.error('Erro ao exportar logs:', error)
      toast.error('Não foi possível exportar os logs de auditoria.')
    }
  }

  const loadAuditLogs = async () => {
    if (!permissions.canViewAuditLogs) return

    onLoadingChange(true)
    try {
      // Simular carregamento de logs de auditoria
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Dados mock para demonstração
      const mockLogs: AuditLog[] = [
        {
          id: '1',
          userId: 'admin@sistema.com',
          action: 'login',
          resourceType: 'user',
          resourceId: 'admin-user',
          details: 'Login realizado com sucesso',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0',
          createdAt: new Date(Date.now() - 1000 * 60 * 30)
        },
        {
          id: '2',
          userId: 'assessor@gabinete.com',
          action: 'create',
          resourceType: 'cabinet',
          resourceId: 'cabinet-1',
          details: 'Gabinete do Vereador João criado',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0',
          createdAt: new Date(Date.now() - 1000 * 60 * 60)
        },
        {
          id: '3',
          userId: 'admin@sistema.com',
          action: 'update',
          resourceType: 'user',
          resourceId: 'system-settings',
          details: 'Configurações do sistema atualizadas',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0',
          createdAt: new Date(Date.now() - 1000 * 60 * 90)
        },
        {
          id: '4',
          userId: 'usuario@teste.com',
          action: 'login',
          resourceType: 'user',
          resourceId: 'test-user',
          details: 'Tentativa de login falhada - senha incorreta',
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0',
          createdAt: new Date(Date.now() - 1000 * 60 * 120)
        }
      ]
      
      onAuditLogsChange(mockLogs)
    } catch (error) {
      console.error('Erro ao carregar logs de auditoria:', error)
      toast.error('Não foi possível carregar os logs de auditoria.')
    } finally {
      onLoadingChange(false)
    }
  }

  // Carregar logs ao montar o componente
  useEffect(() => {
    loadAuditLogs()
  }, [])

  if (!permissions.canViewAuditLogs) {
    return (
      <Card className="border-l-4 border-l-red-500 shadow-sm">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Shield className="h-5 w-5 text-red-500" />
            Segurança e Auditoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Você não tem permissão para visualizar as configurações de segurança.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-l-4 border-l-red-500 shadow-sm">
      <CardHeader className="bg-red-50">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Shield className="h-5 w-5 text-red-500" />
          Segurança e Auditoria
          <Badge variant="outline" className="ml-2 bg-red-100 text-red-700 border-red-300">
            {filteredLogs.length} registros
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-600">
          Monitore atividades do sistema e configurações de segurança
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configurações de Segurança */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Configurações de Segurança
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Autenticação Ativa</span>
              </div>
              <p className="text-sm text-gray-600">Sistema de login seguro habilitado</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Logs de Auditoria</span>
              </div>
              <p className="text-sm text-gray-600">Todas as ações são registradas</p>
            </div>
          </div>
        </div>

        {/* Logs de Auditoria */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              Logs de Auditoria
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button
                variant="outline"
                onClick={handleExportAuditLogs}
                className="flex items-center gap-2"
                disabled={filteredLogs.length === 0}
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Carregando logs de auditoria...</p>
            </div>
          ) : filteredLogs.length > 0 ? (
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
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{formatDateTime(log.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{log.userId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionColor(log.action) as any} className="text-xs">
                          {getActionLabel(log.action)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{log.resourceType}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-mono">{log.ipAddress}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>Nenhum log de auditoria encontrado</p>
              {searchTerm && (
                <p className="text-sm mt-2">Tente ajustar os termos de busca</p>
              )}
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Informações Adicionais */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Sobre os Logs de Auditoria</h4>
              <p className="text-sm text-blue-700">
                Os logs de auditoria registram todas as ações importantes realizadas no sistema, 
                incluindo logins, alterações de dados e configurações. Estes registros são 
                essenciais para a segurança e conformidade do sistema.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SecuritySettings