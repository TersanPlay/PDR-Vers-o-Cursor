import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UserRole } from '../types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  requireAuth?: boolean
}

/**
 * Componente para proteger rotas com base na autenticação e permissões
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requireAuth = true
}) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Verificar se precisa estar autenticado
  if (requireAuth && !isAuthenticated) {
    // Salvar a rota atual para redirecionar após login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Verificar se tem as permissões necessárias
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role)
    
    if (!hasRequiredRole) {
      // Redirecionar para página de acesso negado ou dashboard
      return <Navigate to="/dashboard" replace />
    }
  }

  // Se passou por todas as verificações, renderizar o componente
  return <>{children}</>
}

/**
 * Hook para verificar permissões específicas
 */
export const usePermissions = () => {
  const { user } = useAuth()

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role
  }

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false
  }

  const canCreate = (): boolean => {
    return hasAnyRole(['admin', 'assessor'])
  }

  const canEdit = (): boolean => {
    return hasAnyRole(['admin', 'assessor'])
  }

  const canDelete = (): boolean => {
    return hasRole('admin')
  }

  const canViewSensitiveData = (): boolean => {
    return hasAnyRole(['admin', 'assessor'])
  }

  const canExport = (): boolean => {
    return hasAnyRole(['admin', 'assessor'])
  }

  const canManageUsers = (): boolean => {
    return hasRole('admin')
  }

  const canViewAuditLogs = (): boolean => {
    return hasRole('admin')
  }

  return {
    user,
    hasRole,
    hasAnyRole,
    canCreate,
    canEdit,
    canDelete,
    canViewSensitiveData,
    canExport,
    canManageUsers,
    canViewAuditLogs
  }
}