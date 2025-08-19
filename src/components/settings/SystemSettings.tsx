import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Checkbox } from '../ui/checkbox'
import {
  Settings,
  Save,
  AlertTriangle,
  Info,
  Clock,
  Shield,
  Database,
  Upload,
  Download
} from 'lucide-react'
import { useToast } from '../ui/use-toast'
import { usePermissions } from '../../contexts/AuthContext'
import { useMaintenance } from '../../contexts/MaintenanceContext'

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

interface SystemSettingsProps {
  settings: SystemSettings
  onSettingsChange: (settings: SystemSettings) => void
  isLoading: boolean
  onLoadingChange: (loading: boolean) => void
}

/**
 * Componente para gerenciamento das configurações do sistema
 */
export const SystemSettingsComponent: React.FC<SystemSettingsProps> = ({
  settings,
  onSettingsChange,
  isLoading,
  onLoadingChange
}) => {
  const permissions = usePermissions()
  const { toast } = useToast()
  const { setMaintenanceMode } = useMaintenance()
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings)
  const [hasChanges, setHasChanges] = useState(false)

  // Sincronizar configurações locais com as props
  useEffect(() => {
    setLocalSettings(settings)
    setHasChanges(false)
  }, [settings])

  // Detectar mudanças
  useEffect(() => {
    const changed = JSON.stringify(localSettings) !== JSON.stringify(settings)
    setHasChanges(changed)
  }, [localSettings, settings])

  const handleInputChange = (field: keyof SystemSettings, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveSettings = async () => {
    if (!permissions.hasRole('admin')) {
      toast.error('Você não tem permissão para alterar as configurações do sistema.')
      return
    }

    onLoadingChange(true)
    try {
      // Validações
      if (localSettings.sessionTimeout < 5 || localSettings.sessionTimeout > 1440) {
        toast.error('O timeout de sessão deve estar entre 5 e 1440 minutos.')
        return
      }

      if (localSettings.maxFileSize < 1 || localSettings.maxFileSize > 100) {
        toast.error('O tamanho máximo de arquivo deve estar entre 1 e 100 MB.')
        return
      }

      // Atualizar configurações
      onSettingsChange(localSettings)
      
      // Atualizar contexto de manutenção se necessário
      if (localSettings.maintenanceMode !== settings.maintenanceMode) {
        setMaintenanceMode(localSettings.maintenanceMode)
      }

      toast.success('Configurações salvas com sucesso.')
      
      setHasChanges(false)
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error('Não foi possível salvar as configurações.')
    } finally {
      onLoadingChange(false)
    }
  }

  const handleResetSettings = () => {
    if (confirm('Tem certeza que deseja descartar as alterações?')) {
      setLocalSettings(settings)
      setHasChanges(false)
    }
  }

  const handleBackup = async () => {
    try {
      // Simular backup do sistema
      const backupData = {
        settings: localSettings,
        timestamp: new Date().toISOString(),
        version: localSettings.version
      }
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `backup-sistema-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.default({
        title: 'Backup Criado',
        description: 'Backup do sistema baixado com sucesso.'
      })
    } catch (error) {
      console.error('Erro ao criar backup:', error)
      toast.error('Não foi possível criar o backup.')
    }
  }

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!localSettings.maintenanceMode) {
      toast.error('Ative o modo de manutenção antes de restaurar um backup.')
      return
    }

    try {
      const text = await file.text()
      const backupData = JSON.parse(text)
      
      if (!backupData.settings || !backupData.version) {
        throw new Error('Formato de backup inválido')
      }
      
      setLocalSettings(backupData.settings)
      toast.success('Configurações restauradas com sucesso. Lembre-se de salvar as alterações.')
    } catch (error) {
      console.error('Erro ao restaurar backup:', error)
      toast.error('Não foi possível restaurar o backup. Verifique se o arquivo é válido.')
    }
    
    // Limpar input
    event.target.value = ''
  }

  return (
    <Card className="border-l-4 border-l-green-500 shadow-sm">
      <CardHeader className="bg-green-50">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Settings className="h-5 w-5 text-green-500" />
          Configurações do Sistema
          {hasChanges && (
            <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
              Alterações não salvas
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-gray-600">
          Configure as definições gerais do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="systemName">Nome do Sistema</Label>
            <Input
              id="systemName"
              value={localSettings.systemName}
              onChange={(e) => handleInputChange('systemName', e.target.value)}
              placeholder="Nome do sistema"
              disabled={!permissions.hasRole('admin')}
            />
          </div>
          <div>
            <Label htmlFor="version">Versão</Label>
            <Input
              id="version"
              value={localSettings.version}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Versão atual do sistema (somente leitura)</p>
          </div>
        </div>

        {/* Configurações de Sessão */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Configurações de Sessão
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                min="5"
                max="1440"
                value={localSettings.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value) || 30)}
                disabled={!permissions.hasRole('admin')}
              />
              <p className="text-xs text-gray-500 mt-1">Entre 5 e 1440 minutos</p>
            </div>
            <div>
              <Label htmlFor="maxFileSize">Tamanho Máximo de Arquivo (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                min="1"
                max="100"
                value={localSettings.maxFileSize}
                onChange={(e) => handleInputChange('maxFileSize', parseInt(e.target.value) || 10)}
                disabled={!permissions.hasRole('admin')}
              />
              <p className="text-xs text-gray-500 mt-1">Entre 1 e 100 MB</p>
            </div>
          </div>
        </div>

        {/* Configurações de Sistema */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            Configurações de Sistema
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="maintenanceMode"
                checked={localSettings.maintenanceMode}
                onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                disabled={!permissions.hasRole('admin')}
              />
              <Label htmlFor="maintenanceMode" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Modo de Manutenção
              </Label>
            </div>
            {localSettings.maintenanceMode && (
              <div className="ml-6 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-sm text-orange-700 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  O sistema está em modo de manutenção. Apenas administradores podem acessar.
                </p>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableNotifications"
                checked={localSettings.enableNotifications}
                onCheckedChange={(checked) => handleInputChange('enableNotifications', checked)}
                disabled={!permissions.hasRole('admin')}
              />
              <Label htmlFor="enableNotifications">Habilitar Notificações</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableAuditLog"
                checked={localSettings.enableAuditLog}
                onCheckedChange={(checked) => handleInputChange('enableAuditLog', checked)}
                disabled={!permissions.hasRole('admin')}
              />
              <Label htmlFor="enableAuditLog">Habilitar Log de Auditoria</Label>
            </div>
          </div>
        </div>

        {/* Backup e Restauração */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-500" />
            Backup e Restauração
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleBackup}
              disabled={!permissions.hasRole('admin')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Criar Backup
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleRestore}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={!permissions.hasRole('admin')}
              />
              <Button
                variant="outline"
                disabled={!permissions.hasRole('admin')}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Restaurar Backup
              </Button>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        {permissions.hasRole('admin') && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleResetSettings}
              disabled={!hasChanges || isLoading}
            >
              Descartar Alterações
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={!hasChanges || isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        )}
        
        {!permissions.hasRole('admin') && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Você não tem permissão para alterar as configurações do sistema.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SystemSettingsComponent