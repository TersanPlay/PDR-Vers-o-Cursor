import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

interface InteractionMetricsProps {
  total: number
  pendentes: number
  concluidas: number
  atrasadas: number
}

const InteractionMetrics: React.FC<InteractionMetricsProps> = ({
  total,
  pendentes,
  concluidas,
  atrasadas
}) => {
  const conclusionRate = total > 0 ? Math.round((concluidas / total) * 100) : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-blue-500 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50">
          <CardTitle className="text-sm font-medium text-gray-900">Total</CardTitle>
          <Calendar className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{total}</div>
          <p className="text-xs text-gray-600">
            Total de interações
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-yellow-500 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-yellow-50">
          <CardTitle className="text-sm font-medium text-gray-900">Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{pendentes}</div>
          <p className="text-xs text-gray-600">
            Em aberto
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-green-500 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50">
          <CardTitle className="text-sm font-medium text-gray-900">Concluídas</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{concluidas}</div>
          <p className="text-xs text-gray-600">
            {conclusionRate}% taxa de conclusão
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-red-500 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-red-50">
          <CardTitle className="text-sm font-medium text-gray-900">Atrasadas</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{atrasadas}</div>
          <p className="text-xs text-gray-600">
            Atenção necessária
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default InteractionMetrics