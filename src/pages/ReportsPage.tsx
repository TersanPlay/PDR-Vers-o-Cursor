import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { personService } from '@/services/personService';
import { usePermissions } from '@/contexts/AuthContext';
import { Download, FileText, Users, Calendar, Activity, MessageSquare, Phone, Mail, MapPin, User } from 'lucide-react';
import type { ReportFilter, InteractionType, InteractionStatus, Interaction, Person } from '@/types';

const ReportsPage: React.FC = () => {
  const { canExport } = usePermissions();
  
  const [reportFilters, setReportFilters] = useState<ReportFilter>({
    startDate: '',
    endDate: '',
    city: '',
    state: '',
    ageMin: undefined,
    ageMax: undefined,
  });
  

  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    totalPeople: 0,
    newThisMonth: 0,
    byNeighborhood: [] as { neighborhood: string; count: number }[],
    byAge: [] as { range: string; count: number }[],
    totalInteractions: 0,
    interactionsByType: [] as { type: InteractionType; count: number; label: string }[],
    interactionsByStatus: [] as { status: InteractionStatus; count: number; label: string }[],
    interactionsThisMonth: 0,
    peopleByRelationshipType: [] as { type: string; count: number; label: string }[]
  });

  const loadMetrics = useCallback(async () => {
    try {
      // Simulação de métricas - em produção viria de uma API
      setMetrics({
        totalPeople: 1247,
        newThisMonth: 89,
        byNeighborhood: [
          { neighborhood: 'Centro', count: 456 },
          { neighborhood: 'Vila Madalena', count: 234 },
          { neighborhood: 'Copacabana', count: 123 },
          { neighborhood: 'Savassi', count: 98 },
          { neighborhood: 'Asa Norte', count: 87 },
        ],
        byAge: [
          { range: '18-25', count: 234 },
          { range: '26-35', count: 345 },
          { range: '36-45', count: 289 },
          { range: '46-55', count: 198 },
          { range: '56+', count: 181 },
        ],
        totalInteractions: 2834,
        interactionsThisMonth: 156,
        interactionsByType: [
          { type: 'atendimento', count: 892, label: 'Atendimento' },
          { type: 'ligacao', count: 567, label: 'Ligação' },
          { type: 'whatsapp', count: 445, label: 'WhatsApp' },
          { type: 'email', count: 334, label: 'E-mail' },
          { type: 'reuniao', count: 289, label: 'Reunião' },
          { type: 'visita', count: 198, label: 'Visita' },
          { type: 'evento', count: 87, label: 'Evento' },
          { type: 'outro', count: 22, label: 'Outro' }
        ],
        interactionsByStatus: [
          { status: 'concluido', count: 1456, label: 'Concluído' },
          { status: 'pendente', count: 789, label: 'Pendente' },
          { status: 'em_andamento', count: 445, label: 'Em Andamento' },
          { status: 'cancelado', count: 144, label: 'Cancelado' }
        ],
        peopleByRelationshipType: [
          { type: 'eleitor', count: 567, label: 'Eleitor' },
          { type: 'parceiro', count: 234, label: 'Parceiro' },
          { type: 'colaborador_assessor', count: 156, label: 'Colaborador/Assessor' },
          { type: 'voluntario', count: 123, label: 'Voluntário' },
          { type: 'fornecedor_prestador', count: 89, label: 'Fornecedor/Prestador' },
          { type: 'representante', count: 45, label: 'Representante' },
          { type: 'candidato', count: 23, label: 'Candidato' },
          { type: 'outros', count: 10, label: 'Outros' }
        ]
      });
    } catch (error) {
      toast.error('Erro ao carregar métricas');
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleGenerateReport = async () => {
    if (!canExport) {
      toast.error('Você não tem permissão para gerar relatórios');
      return;
    }

    try {
      setIsLoading(true);
      
      // Buscar pessoas com base nos filtros
      const searchFilters = {
        city: reportFilters.city,
        state: reportFilters.state,
      };
      
      const people = await personService.search(searchFilters);
      
      // Filtrar por data se especificada
      let filteredPeople = people;
      if (reportFilters.startDate || reportFilters.endDate) {
        filteredPeople = people.filter(person => {
          const createdDate = new Date(person.createdAt);
          const start = reportFilters.startDate ? new Date(reportFilters.startDate) : new Date('1900-01-01');
          const end = reportFilters.endDate ? new Date(reportFilters.endDate) : new Date();
          return createdDate >= start && createdDate <= end;
        });
      }
      
      // Filtrar por idade se especificada
      if (reportFilters.ageMin !== undefined || reportFilters.ageMax !== undefined) {
        filteredPeople = filteredPeople.filter(person => {
          const age = new Date().getFullYear() - new Date(person.birthDate).getFullYear();
          const minAge = reportFilters.ageMin || 0;
          const maxAge = reportFilters.ageMax || 150;
          return age >= minAge && age <= maxAge;
        });
      }
      
      await personService.exportData(filteredPeople);
      toast.success(`Relatório gerado com ${filteredPeople.length} registros!`);
    } catch (error) {
      toast.error('Erro ao gerar relatório');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-l-4 border-l-indigo-500">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <FileText className="h-8 w-8 text-indigo-600" />
          Relatórios e Auditoria
          <Badge variant="outline" className="ml-2 bg-indigo-100 text-indigo-700 border-indigo-300">
            Analytics
          </Badge>
        </h1>
        <p className="text-gray-600 mt-2">
          Gere relatórios personalizados e visualize logs de auditoria do sistema
        </p>
      </div>

      {/* Métricas Gerais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50">
            <CardTitle className="text-sm font-medium text-gray-900">Total de Pessoas</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.totalPeople.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{metrics.newThisMonth} este mês</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-emerald-50">
            <CardTitle className="text-sm font-medium text-gray-900">Total de Interações</CardTitle>
            <MessageSquare className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{metrics.totalInteractions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{metrics.interactionsThisMonth} este mês</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-orange-50">
            <CardTitle className="text-sm font-medium text-gray-900">Bairros Ativos</CardTitle>
            <MapPin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.byNeighborhood.length}</div>
            <p className="text-xs text-muted-foreground">Distribuição geográfica</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-purple-50">
            <CardTitle className="text-sm font-medium text-gray-900">Interações Pendentes</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.interactionsByStatus.find(s => s.status === 'pendente')?.count || 0}</div>
            <p className="text-xs text-muted-foreground">Requerem atenção</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interações por Tipo */}
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="bg-emerald-50">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <MessageSquare className="h-5 w-5 text-emerald-500" />
              Interações por Tipo
            </CardTitle>
            <CardDescription className="text-gray-600">
              Distribuição dos tipos de interações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.interactionsByType.map((item, index) => {
                const getTypeIcon = (type: InteractionType) => {
                  switch (type) {
                    case 'atendimento': return <User className="h-4 w-4" />
                    case 'ligacao': return <Phone className="h-4 w-4" />
                    case 'email': return <Mail className="h-4 w-4" />
                    case 'whatsapp': return <MessageSquare className="h-4 w-4" />
                    case 'reuniao': return <Users className="h-4 w-4" />
                    case 'visita': return <MapPin className="h-4 w-4" />
                    default: return <Calendar className="h-4 w-4" />
                  }
                }
                return (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Interações por Status */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Activity className="h-5 w-5 text-blue-500" />
              Interações por Status
            </CardTitle>
            <CardDescription className="text-gray-600">
              Status atual das interações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.interactionsByStatus.map((item) => {
                const getStatusColor = (status: InteractionStatus) => {
                  switch (status) {
                    case 'concluido': return 'text-green-600'
                    case 'em_andamento': return 'text-blue-600'
                    case 'pendente': return 'text-yellow-600'
                    case 'cancelado': return 'text-red-600'
                    default: return 'text-gray-600'
                  }
                }
                return (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status).replace('text-', 'bg-')}`}></div>
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Gerador de Relatórios */}
        <Card className="border-l-4 border-l-indigo-500 shadow-sm">
          <CardHeader className="bg-indigo-50">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FileText className="h-5 w-5 text-indigo-500" />
              Gerar Relatório Personalizado
            </CardTitle>
            <CardDescription className="text-gray-600">
              Configure os filtros e gere um relatório personalizado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={reportFilters.startDate}
                  onChange={(e) => setReportFilters(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={reportFilters.endDate}
                  onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="Digite a cidade"
                  value={reportFilters.city}
                  onChange={(e) => setReportFilters(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  placeholder="SP"
                  maxLength={2}
                  value={reportFilters.state}
                  onChange={(e) => setReportFilters(prev => ({ ...prev, state: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ageMin">Idade Mínima</Label>
                <Input
                  id="ageMin"
                  type="number"
                  placeholder="18"
                  value={reportFilters.ageMin || ''}
                  onChange={(e) => setReportFilters(prev => ({ ...prev, ageMin: e.target.value ? parseInt(e.target.value) : undefined }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ageMax">Idade Máxima</Label>
                <Input
                  id="ageMax"
                  type="number"
                  placeholder="65"
                  value={reportFilters.ageMax || ''}
                  onChange={(e) => setReportFilters(prev => ({ ...prev, ageMax: e.target.value ? parseInt(e.target.value) : undefined }))}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleGenerateReport} 
              disabled={isLoading || !canExport}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Gerando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </>
              )}
            </Button>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Tipo de Vínculo */}
        <Card className="border-l-4 border-l-violet-500 shadow-sm">
          <CardHeader className="bg-violet-50">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Users className="h-5 w-5 text-violet-500" />
              Pessoas por Tipo de Vínculo
            </CardTitle>
            <CardDescription className="text-gray-600">
              Distribuição dos tipos de relacionamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.peopleByRelationshipType.map((item, index) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distribuição por Cidade */}
        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <MapPin className="h-5 w-5 text-orange-500" />
              Distribuição por Bairro
            </CardTitle>
            <CardDescription className="text-gray-600">
              Top 5 bairros com mais registros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.byNeighborhood.map((item, index) => (
                <div key={item.neighborhood} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                    <span className="text-sm">{item.neighborhood}</span>
                  </div>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por Faixa Etária */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Faixa Etária</CardTitle>
          <CardDescription>Quantidade de pessoas por faixa etária</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {metrics.byAge.map((item) => (
              <div key={item.range} className="text-center">
                <div className="text-2xl font-bold">{item.count}</div>
                <div className="text-sm text-muted-foreground">{item.range} anos</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informações sobre LGPD */}
      <Card>
        <CardHeader>
          <CardTitle>Conformidade LGPD</CardTitle>
          <CardDescription>
            Informações sobre proteção de dados e auditoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              • Todos os relatórios respeitam as diretrizes da LGPD, mascarando dados sensíveis quando necessário.
            </p>
            <p>
              • A geração de relatórios é registrada nos logs de auditoria para rastreabilidade.
            </p>
            <p>
              • Apenas usuários com permissões específicas podem gerar relatórios e visualizar logs.
            </p>
            <p>
              • Os dados exportados são criptografados e incluem apenas informações autorizadas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;