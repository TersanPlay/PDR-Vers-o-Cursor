import React from 'react'
import {
  Card,
  CardContent,
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
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  MessageSquare,
  User,
  Phone,
  Mail,
  Users,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { Interaction, InteractionType, InteractionStatus, Person } from '../../types'
import { formatDate, formatDateTime } from '../../lib/utils'

interface InteractionTableProps {
  interactions: Interaction[]
  people: Person[]
  onViewDetails: (interaction: Interaction) => void
  onEdit?: (interaction: Interaction) => void
  onDelete?: (interaction: Interaction) => void
}

const InteractionTable: React.FC<InteractionTableProps> = ({
  interactions,
  people,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  const getStatusIcon = (status: InteractionStatus) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'em_andamento':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'pendente':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'cancelado':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: InteractionStatus) => {
    const variants = {
      'concluido': 'default',
      'em_andamento': 'secondary',
      'pendente': 'outline',
      'cancelado': 'destructive'
    } as const

    const labels = {
      'concluido': 'Concluído',
      'em_andamento': 'Em Andamento',
      'pendente': 'Pendente',
      'cancelado': 'Cancelado'
    }

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const getTypeIcon = (type: InteractionType) => {
    switch (type) {
      case 'atendimento':
        return <User className="h-4 w-4" />
      case 'ligacao':
        return <Phone className="h-4 w-4" />
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />
      case 'reuniao':
        return <Users className="h-4 w-4" />
      case 'visita':
        return <MapPin className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getPersonName = (personId: string) => {
    const person = people.find(p => p.id === personId)
    return person ? person.name : 'Pessoa não encontrada'
  }

  return (
    <Card className="border-l-4 border-l-emerald-500 shadow-sm">
      <CardHeader className="bg-emerald-50">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <MessageSquare className="h-5 w-5 text-emerald-500" />
          Interações ({interactions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Pessoa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Agendada</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interactions.map((interaction) => (
              <TableRow key={interaction.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(interaction.type)}
                    <span className="capitalize">{interaction.type}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{interaction.title}</TableCell>
                <TableCell>{getPersonName(interaction.personId)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(interaction.status)}
                    {getStatusBadge(interaction.status)}
                  </div>
                </TableCell>
                <TableCell>
                  {interaction.scheduledDate ? formatDateTime(interaction.scheduledDate) : '-'}
                </TableCell>
                <TableCell>{formatDate(interaction.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(interaction)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(interaction)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(interaction)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {interactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma interação encontrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default InteractionTable