import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Checkbox } from '../ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'


import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  User,
  MapPin
} from 'lucide-react'
import { Task } from '../../types'

interface StatusButtonAlternativesProps {
  onClose?: () => void
}

const StatusButtonAlternatives: React.FC<StatusButtonAlternativesProps> = ({ onClose }) => {
  // Estados para cada alternativa
  const [status1, setStatus1] = useState<Task['status']>('pending')
  const [status2, setStatus2] = useState<Task['status']>('pending')
  const [status3, setStatus3] = useState<Task['status']>('pending')
  const [status4, setStatus4] = useState<Task['status']>('pending')
  const [status5, setStatus5] = useState<Task['status']>('pending')
  const [status8, setStatus8] = useState<Task['status']>('pending')

  // Tarefa de exemplo
  const sampleTask: Task = {
    id: '1',
    title: 'Reunião com Lideranças Comunitárias',
    description: 'Discussão sobre melhorias no bairro Centro',
    status: 'pending',
    priority: 'high',
    assignee: 'João Silva',
    dueDate: new Date(),
    date: new Date(),
    time: '14:00',
    location: 'Gabinete Municipal',
    participants: 'Líderes comunitários, Assessores',
    category: 'Reunião',
    activityType: 'reuniao_liderancas'
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'pending':
        return <Circle className="h-4 w-4 text-orange-600" />
      default:
        return <Circle className="h-4 w-4 text-slate-400" />
    }
  }

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'Concluída'
      case 'in-progress': return 'Em Andamento'
      case 'pending': return 'Pendente'
      default: return 'Pendente'
    }
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const TaskCardExample = ({ 
    status, 
    children, 
    title 
  }: { 
    status: Task['status']
    children: React.ReactNode
    title: string
  }) => (
    <Card className={`w-full max-w-md mx-auto transition-all duration-200 ${
      status === 'completed' ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-400' :
      status === 'in-progress' ? 'bg-gradient-to-br from-blue-50 to-sky-50 border-l-4 border-l-blue-400' :
      'bg-gradient-to-br from-orange-50 to-amber-50 border-l-4 border-l-orange-400'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            {children}
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-sm leading-tight ${
                status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {title}
              </h3>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {sampleTask.description}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-purple-100 text-purple-800 border-purple-200">
            Reunião de Lideranças
          </Badge>
          <Badge variant="outline" className={`text-xs ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="h-3 w-3" />
          <span>Hoje às 14:00</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <MapPin className="h-3 w-3" />
          <span>{sampleTask.location}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <User className="h-3 w-3" />
          <span>{sampleTask.assignee}</span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              🎨 Alternativas para Botão de Status - Demonstração Interativa
            </CardTitle>
            <Button variant="outline" onClick={onClose}>
              ✕ Fechar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          <Tabs defaultValue="alt1" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
              <TabsTrigger value="alt1" className="text-xs">Dropdown</TabsTrigger>
              <TabsTrigger value="alt2" className="text-xs">Checkbox</TabsTrigger>
              <TabsTrigger value="alt3" className="text-xs">3 Botões</TabsTrigger>
              <TabsTrigger value="alt4" className="text-xs">Duplo Click</TabsTrigger>
              <TabsTrigger value="alt5" className="text-xs">Swipe</TabsTrigger>
              <TabsTrigger value="alt8" className="text-xs">Barra Progresso</TabsTrigger>
            </TabsList>

            {/* Alternativa 1: Dropdown de Status */}
            <TabsContent value="alt1" className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-2">🔽 Alternativa 1: Dropdown de Status</h3>
                <p className="text-sm text-gray-600">Selecione diretamente o status desejado no dropdown</p>
              </div>
              <TaskCardExample status={status1} title="Reunião com Lideranças - Dropdown">
                <Select value={status1} onValueChange={(value: Task['status']) => setStatus1(value)}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">🟡 Pendente</SelectItem>
                    <SelectItem value="in-progress">🔵 Em Andamento</SelectItem>
                    <SelectItem value="completed">🟢 Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </TaskCardExample>
              <div className="bg-blue-50 p-3 rounded-lg text-sm">
                <strong>Vantagens:</strong> Controle direto, não precisa clicar múltiplas vezes<br/>
                <strong>Desvantagens:</strong> Ocupa mais espaço visual
              </div>
            </TabsContent>

            {/* Alternativa 2: Checkbox + Botão */}
            <TabsContent value="alt2" className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-2">✅ Alternativa 2: Checkbox + Botão</h3>
                <p className="text-sm text-gray-600">Checkbox para conclusão + botão para alternar entre pendente/em andamento</p>
              </div>
              <TaskCardExample status={status2} title="Reunião com Lideranças - Checkbox">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={status2 === 'completed'}
                    onCheckedChange={(checked) => 
                      setStatus2(checked ? 'completed' : 'pending')
                    }
                  />
                  {status2 !== 'completed' && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => setStatus2(
                        status2 === 'pending' ? 'in-progress' : 'pending'
                      )}
                    >
                      {status2 === 'pending' ? '▶️ Iniciar' : '⏸️ Pausar'}
                    </Button>
                  )}
                </div>
              </TaskCardExample>
              <div className="bg-green-50 p-3 rounded-lg text-sm">
                <strong>Vantagens:</strong> Ação de conclusão intuitiva, separação clara de ações<br/>
                <strong>Desvantagens:</strong> Mais elementos na interface
              </div>
            </TabsContent>

            {/* Alternativa 3: Três Botões */}
            <TabsContent value="alt3" className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-2">🎯 Alternativa 3: Três Botões de Ação</h3>
                <p className="text-sm text-gray-600">Botões individuais para cada status</p>
              </div>
              <TaskCardExample status={status3} title="Reunião com Lideranças - 3 Botões">
                <div className="flex gap-1">
                  <Button 
                    variant={status3 === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatus3('pending')}
                    className="h-6 w-6 p-0"
                    title="Pendente"
                  >
                    🟡
                  </Button>
                  <Button 
                    variant={status3 === 'in-progress' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatus3('in-progress')}
                    className="h-6 w-6 p-0"
                    title="Em Andamento"
                  >
                    🔵
                  </Button>
                  <Button 
                    variant={status3 === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatus3('completed')}
                    className="h-6 w-6 p-0"
                    title="Concluída"
                  >
                    🟢
                  </Button>
                </div>
              </TaskCardExample>
              <div className="bg-yellow-50 p-3 rounded-lg text-sm">
                <strong>Vantagens:</strong> Acesso direto a qualquer status, visual claro<br/>
                <strong>Desvantagens:</strong> Ocupa mais espaço horizontal
              </div>
            </TabsContent>

            {/* Alternativa 4: Clique Duplo */}
            <TabsContent value="alt4" className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-2">🖱️ Alternativa 4: Clique Duplo para Conclusão</h3>
                <p className="text-sm text-gray-600">Clique simples alterna, clique duplo conclui</p>
              </div>
              <TaskCardExample status={status4} title="Reunião com Lideranças - Duplo Click">
                <button
                  onClick={() => {
                    const newStatus = status4 === 'pending' ? 'in-progress' : 'pending'
                    setStatus4(newStatus)
                  }}
                  onDoubleClick={() => setStatus4('completed')}
                  className="flex-shrink-0 hover:scale-110 transition-transform"
                  title="Clique: Alternar | Duplo clique: Concluir"
                >
                  {getStatusIcon(status4)}
                </button>
              </TaskCardExample>
              <div className="bg-purple-50 p-3 rounded-lg text-sm">
                <strong>Vantagens:</strong> Mantém simplicidade, adiciona atalho para conclusão<br/>
                <strong>Desvantagens:</strong> Pode ser menos descobrível<br/>
                <strong>Dica:</strong> Clique simples alterna entre Pendente/Em Andamento, duplo clique marca como Concluída
              </div>
            </TabsContent>

            {/* Alternativa 5: Swipe/Arrastar */}
            <TabsContent value="alt5" className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-2">📱 Alternativa 5: Gestos de Swipe</h3>
                <p className="text-sm text-gray-600">Arraste para a direita para concluir, esquerda para pendente</p>
              </div>
              <div className="relative">
                <TaskCardExample status={status5} title="Reunião com Lideranças - Swipe">
                  <div className="flex items-center gap-2">
                    <button
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      onClick={() => {
                        const newStatus = status5 === 'pending' ? 'in-progress' : 
                                        status5 === 'in-progress' ? 'completed' : 'pending'
                        setStatus5(newStatus)
                      }}
                    >
                      {getStatusIcon(status5)}
                    </button>
                    <div className="text-xs text-gray-500">
                      👆 Clique para simular swipe
                    </div>
                  </div>
                </TaskCardExample>
              </div>
              <div className="bg-pink-50 p-3 rounded-lg text-sm">
                <strong>Vantagens:</strong> Experiência mobile moderna, intuitivo<br/>
                <strong>Desvantagens:</strong> Requer biblioteca adicional, pode conflitar com scroll<br/>
                <strong>Simulação:</strong> Clique no ícone para simular o gesto de swipe
              </div>
            </TabsContent>




            {/* Alternativa 8: Barra de Progresso */}
            <TabsContent value="alt8" className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-2">🎨 Alternativa 8: Barra de Progresso Interativa</h3>
                <p className="text-sm text-gray-600">Clique na barra para definir o progresso</p>
              </div>
              <TaskCardExample status={status8} title="Reunião com Lideranças - Barra Progresso">
                <div className="w-full">
                  <div 
                    className="w-full bg-gray-200 rounded-full h-3 cursor-pointer transition-all hover:h-4"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const x = e.clientX - rect.left
                      const percentage = x / rect.width
                      
                      if (percentage < 0.33) {
                        setStatus8('pending')
                      } else if (percentage < 0.66) {
                        setStatus8('in-progress')
                      } else {
                        setStatus8('completed')
                      }
                    }}
                    title="Clique para alterar o progresso"
                  >
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        status8 === 'completed' ? 'w-full bg-green-500' :
                        status8 === 'in-progress' ? 'w-2/3 bg-blue-500' :
                        'w-1/3 bg-orange-500'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Pendente</span>
                    <span>Em Andamento</span>
                    <span>Concluída</span>
                  </div>
                </div>
              </TaskCardExample>
              <div className="bg-teal-50 p-3 rounded-lg text-sm">
                <strong>Vantagens:</strong> Visual intuitivo de progresso, interação direta<br/>
                <strong>Desvantagens:</strong> Pode ser menos preciso em telas pequenas
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <h4 className="font-semibold text-lg mb-2">🏆 Recomendação Final</h4>
            <p className="text-sm text-gray-700">
              Para o sistema PDR, recomendamos a <strong>Alternativa 2 (Checkbox + Botão)</strong> por oferecer 
              o melhor equilíbrio entre usabilidade, intuitividade e consistência com padrões de interface 
              modernos para gestão de tarefas parlamentares.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatusButtonAlternatives