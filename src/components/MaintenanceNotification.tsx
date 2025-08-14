import React, { useEffect, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { useMaintenance } from '../contexts/MaintenanceContext'
import { useAuth } from '../contexts/AuthContext'

interface MaintenanceNotificationProps {
  onClose?: () => void
}

/**
 * Componente que exibe uma notificação quando o modo de manutenção é ativado
 * Aparece automaticamente quando o estado muda em outras abas
 */
const MaintenanceNotification: React.FC<MaintenanceNotificationProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenShown, setHasBeenShown] = useState(false)
  const { isMaintenanceMode, isSystemBlocked } = useMaintenance()
  const { user } = useAuth()

  useEffect(() => {
    // Mostra a notificação quando o modo de manutenção é ativado
    if (isMaintenanceMode && !hasBeenShown) {
      setIsVisible(true)
      setHasBeenShown(true)
      
      // Auto-hide após 10 segundos para administradores
      if (user?.role === 'admin') {
        const timer = setTimeout(() => {
          setIsVisible(false)
        }, 10000)
        
        return () => clearTimeout(timer)
      }
    }
    
    // Reset quando o modo de manutenção é desativado
    if (!isMaintenanceMode) {
      setIsVisible(false)
      setHasBeenShown(false)
    }
  }, [isMaintenanceMode, hasBeenShown, user?.role])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-orange-50 border border-orange-200 rounded-lg shadow-lg p-4 animate-slide-in-right">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
          
          <div className="flex-1">
            <h3 className="font-semibold text-orange-800 mb-1">
              {isSystemBlocked ? 'Sistema em Manutenção' : 'Modo de Manutenção Ativado'}
            </h3>
            
            <p className="text-sm text-orange-700">
              {isSystemBlocked 
                ? 'O sistema foi colocado em modo de manutenção. Suas funcionalidades foram temporariamente bloqueadas.'
                : 'O sistema está em modo de manutenção. Como administrador, você ainda pode acessar todas as funcionalidades.'
              }
            </p>
            
            {user?.role === 'admin' && (
              <p className="text-xs text-orange-600 mt-2">
                💡 Você pode desativar o modo de manutenção nas configurações do sistema.
              </p>
            )}
          </div>
          
          {user?.role === 'admin' && (
            <button
              onClick={handleClose}
              className="text-orange-400 hover:text-orange-600 transition-colors p-1"
              title="Fechar notificação"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MaintenanceNotification