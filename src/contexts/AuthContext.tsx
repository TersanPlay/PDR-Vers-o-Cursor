import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react'
import { User, AuthContextType, UserRole } from '../types'
import { authService } from '../services/authService'
import { auditService } from '../services/auditService'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          const userData = await authService.validateToken(token)
          setUser(userData)
        }
      } catch (error) {
        console.error('Erro ao validar token:', error)
        localStorage.removeItem('auth_token')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true)
      const { user: userData, token } = await authService.login(email, password)
      
      localStorage.setItem('auth_token', token)
      setUser(userData)
      
      // Registrar log de auditoria
      try {
        await auditService.log({
          userId: userData.id,
          action: 'login',
          resourceType: 'user',
          details: `Login realizado com sucesso`
        })
      } catch (auditError) {
        console.warn('Erro no log de auditoria (não crítico):', auditError)
      }
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      if (user) {
        // Registrar log de auditoria
        await auditService.log({
          userId: user.id,
          action: 'logout',
          resourceType: 'user',
          details: `Logout realizado`
        })
      }
      
      localStorage.removeItem('auth_token')
      setUser(null)
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

// Hook para verificar permissões
export function usePermissions() {
  const { user } = useAuth()

  return useMemo(() => {
    const hasRole = (role: UserRole): boolean => {
      return user?.role === role
    }

    const hasAnyRole = (roles: UserRole[]): boolean => {
      return user ? roles.includes(user.role) : false
    }

    const canCreate = (): boolean => {
      return hasAnyRole(['admin', 'chefe_gabinete', 'assessor'])
    }

    const canEdit = (): boolean => {
      return hasAnyRole(['admin', 'chefe_gabinete', 'assessor'])
    }

    const canDelete = (): boolean => {
      return hasAnyRole(['admin', 'chefe_gabinete'])
    }

    const canExport = (): boolean => {
      return hasAnyRole(['admin', 'chefe_gabinete'])
    }

    const canViewReports = (): boolean => {
      return hasAnyRole(['admin', 'chefe_gabinete', 'assessor'])
    }

    const canViewAuditLogs = (): boolean => {
      return hasAnyRole(['admin', 'chefe_gabinete'])
    }

    const canManageUsers = (): boolean => {
      return hasAnyRole(['admin', 'chefe_gabinete'])
    }

    const canAccessMaintenance = (): boolean => {
      return hasRole('admin')
    }

    const canManageBackup = (): boolean => {
      return hasRole('admin')
    }

    const canCreateUserRole = (targetRole: UserRole): boolean => {
      if (hasRole('admin')) return true
      if (hasRole('chefe_gabinete')) {
        return targetRole === 'visualizador' || targetRole === 'assessor'
      }
      return false
    }

    const canEditUserRole = (targetRole: UserRole): boolean => {
      if (hasRole('admin')) return true
      if (hasRole('chefe_gabinete')) {
        return targetRole === 'visualizador' || targetRole === 'assessor'
      }
      return false
    }

    const canDeleteUserRole = (targetRole: UserRole): boolean => {
      if (hasRole('admin')) return true
      if (hasRole('chefe_gabinete')) {
        return targetRole === 'visualizador' || targetRole === 'assessor'
      }
      return false
    }

    return {
      hasRole,
      hasAnyRole,
      canCreate,
      canEdit,
      canDelete,
      canExport,
      canViewReports,
      canViewAuditLogs,
      canManageUsers,
      canAccessMaintenance,
      canManageBackup,
      canCreateUserRole,
      canEditUserRole,
      canDeleteUserRole
    }
  }, [user])
}