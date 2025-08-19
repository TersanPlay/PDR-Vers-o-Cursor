import React from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

interface StatusBadgeProps {
  status: 'ativo' | 'pendente' | 'inativo'
}

/**
 * Componente para exibir badge de status do gabinete
 * @param status - Status do gabinete (ativo, pendente, inativo)
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'ativo':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Ativo
        </Badge>
      )
    case 'pendente':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          Pendente
        </Badge>
      )
    case 'inativo':
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="h-3 w-3 mr-1" />
          Inativo
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}