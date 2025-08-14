import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface MaintenanceContextType {
  isMaintenanceMode: boolean
  setMaintenanceMode: (enabled: boolean) => void
  isSystemBlocked: boolean
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined)

interface MaintenanceProviderProps {
  children: ReactNode
}

/**
 * Provider para gerenciar o estado global do modo de manutenção
 * Controla se o sistema está em manutenção e se as funcionalidades devem ser bloqueadas
 * Sincroniza o estado entre diferentes abas do navegador
 */
export const MaintenanceProvider: React.FC<MaintenanceProviderProps> = ({ children }) => {
  const MAINTENANCE_KEY = 'maintenance_mode'
  
  // Inicializa o estado com o valor do localStorage
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(() => {
    const stored = localStorage.getItem(MAINTENANCE_KEY)
    return stored ? JSON.parse(stored) : false
  })
  
  const { user } = useAuth()

  // Função para atualizar o modo de manutenção
  const setMaintenanceMode = (enabled: boolean) => {
    setIsMaintenanceMode(enabled)
    localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(enabled))
    
    // Dispara evento customizado para notificar outras abas
    window.dispatchEvent(new CustomEvent('maintenanceModeChanged', {
      detail: { enabled }
    }))
  }

  // Escuta mudanças no localStorage de outras abas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === MAINTENANCE_KEY && e.newValue !== null) {
        const newValue = JSON.parse(e.newValue)
        setIsMaintenanceMode(newValue)
      }
    }

    // Escuta mudanças na mesma aba
    const handleMaintenanceChange = (e: CustomEvent) => {
      // Não precisa fazer nada aqui, o estado já foi atualizado
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('maintenanceModeChanged', handleMaintenanceChange as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('maintenanceModeChanged', handleMaintenanceChange as EventListener)
    }
  }, [])

  // Determina se o sistema deve ser bloqueado
  // Bloqueia apenas usuários não administradores quando em modo de manutenção
  const isSystemBlocked = isMaintenanceMode && user?.role !== 'admin'

  const value: MaintenanceContextType = {
    isMaintenanceMode,
    setMaintenanceMode,
    isSystemBlocked
  }

  return (
    <MaintenanceContext.Provider value={value}>
      {children}
    </MaintenanceContext.Provider>
  )
}

/**
 * Hook para usar o contexto de manutenção
 */
export const useMaintenance = (): MaintenanceContextType => {
  const context = useContext(MaintenanceContext)
  if (context === undefined) {
    throw new Error('useMaintenance deve ser usado dentro de um MaintenanceProvider')
  }
  return context
}

export default MaintenanceContext