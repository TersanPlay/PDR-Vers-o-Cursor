import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  MapPin,
  AlertTriangle,
  Calendar,
  User,
  FileText,
  MoreHorizontal
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dados simulados para demonstração
  const metrics = {
    totalPeople: 9,
    recentInteractions: 9,
    pendingFollowups: 1,
    activePeople: 9
  };

  const recentInteractions = [
    {
      id: 1,
      type: 'Solicitação de melhoria na escola do bairro',
      description: 'Mais recursos escolares para discutir melhorias na infraestrutura da escola municipal. Moradores da rua principal...',
      date: '12 de abril',
      author: 'João Silva',
      status: 'concluída',
      priority: 'alta'
    },
    {
      id: 2,
      type: 'Planejamento do evento de fim de ano',
      description: 'Reunião para organizar o evento de confraternização da associação de comerciantes...',
      date: '10 de abril',
      author: 'Maria Santos',
      status: 'em andamento',
      priority: 'média'
    },
    {
      id: 3,
      type: 'Dúvidas sobre violência infantil',
      description: 'Foi feita pergunta sobre a orientação de violência para crianças de 2 a 5 anos...',
      date: '9 de abril',
      author: 'Carlos Oliveira',
      status: 'concluída',
      priority: 'alta'
    },
    {
      id: 4,
      type: 'Proposta de parceria jurídica',
      description: 'Carta enviada proposta para oferecer orientação jurídica gratuita para a comunidade...',
      date: '8 de abril',
      author: 'Ana Rosa',
      status: 'pendente',
      priority: 'média'
    },
    {
      id: 5,
      type: 'Planejamento de comunicação',
      description: 'Reunião para discutir planejamento da estratégia de comunicação do gabinete...',
      date: '7 de abril',
      author: 'Pedro Costa',
      status: 'concluída',
      priority: 'baixa'
    },
    {
      id: 6,
      type: 'Reagendamento para moradoras de rua',
      description: 'Solicita novos horários para nova reagendamento municipal para moradoras de rua...',
      date: '6 de abril',
      author: 'Lucia Santos',
      status: 'em andamento',
      priority: 'alta'
    },
    {
      id: 7,
      type: 'Solicitação de melhoria na iluminação pública',
      description: 'Serviço Mário solicitou melhorias na iluminação da rua das Flores...',
      date: '5 de abril',
      author: 'Mário Silva',
      status: 'em andamento',
      priority: 'média'
    }
  ];

  const topNeighborhoods = [
    { name: 'Centro', count: 7, color: 'bg-blue-500' },
    { name: 'Bela Vista', count: 6, color: 'bg-green-500' },
    { name: 'Jardim América', count: 4, color: 'bg-purple-500' },
    { name: 'Vila Madalena', count: 3, color: 'bg-yellow-500' },
    { name: 'Novo Éon', count: 2, color: 'bg-orange-500' },
    { name: 'Consolação', count: 1, color: 'bg-red-500' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluída': return 'bg-green-100 text-green-800';
      case 'em andamento': return 'bg-blue-100 text-blue-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'média': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bem-vindo ao Sistema</h1>
          <p className="text-gray-600 mt-1">
            Olá, {user?.name}! Acompanhe as atividades do gabinete
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/pessoa/novo')}>
            <Calendar className="h-4 w-4 mr-2" />
            Novo Cadastro
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/busca')}>
            <FileText className="h-4 w-4 mr-2" />
            Buscar
          </Button>
          <Button size="sm" onClick={() => navigate('/interacoes')}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Interações
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Pessoas
            </CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{metrics.totalPeople}</div>
            <p className="text-xs text-green-600 mt-1">
              +12% este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Interações Recentes
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{metrics.recentInteractions}</div>
            <p className="text-xs text-green-600 mt-1">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Follow-ups Pendentes
            </CardTitle>
            <Clock className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{metrics.pendingFollowups}</div>
            <p className="text-xs text-orange-600 mt-1">
              Requer atenção
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pessoas Ativas
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{metrics.activePeople}</div>
            <p className="text-xs text-purple-600 mt-1">
              Última semana
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Interações Recentes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Interações Recentes</CardTitle>
                <CardDescription>Últimas atividades registradas no sistema</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                Ver Todas
                <MoreHorizontal className="h-4 w-4 ml-2" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInteractions.map((interaction) => (
                  <div key={interaction.id} className="border-l-2 border-gray-200 pl-4 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <h4 className="font-medium text-sm text-gray-900">
                            {interaction.type}
                          </h4>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getStatusColor(interaction.status)}`}
                          >
                            {interaction.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {interaction.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{interaction.date}</span>
                          <span>por {interaction.author}</span>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ml-2 ${getPriorityColor(interaction.priority)}`}
                      >
                        {interaction.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Top Bairros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                Top Bairros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topNeighborhoods.map((neighborhood, index) => {
                  const maxCount = Math.max(...topNeighborhoods.map(n => n.count));
                  const percentage = (neighborhood.count / maxCount) * 100;
                  
                  return (
                    <div key={neighborhood.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${neighborhood.color}`} />
                          <span className="text-sm font-medium text-gray-700">{neighborhood.name}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{neighborhood.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${neighborhood.color} transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Atenção Necessária */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-orange-700">
                <AlertTriangle className="h-5 w-5" />
                Atenção Necessária
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-800 mb-3">
                  Você tem 1 follow-up pendente que precisa de atenção.
                </p>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Resolver
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;