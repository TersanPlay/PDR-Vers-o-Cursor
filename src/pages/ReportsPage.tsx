import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Input component import removed since it's not being used
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
// import { Pagination } from '../components/ui/Pagination';
import { useToast } from '@/components/ui/use-toast';

import { usePermissions } from '@/contexts/AuthContext';
import { Download, FileText, Users, Calendar, Activity, MessageSquare, Phone, Mail, MapPin, User, BarChart3, FileSpreadsheet, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { InteractionType, InteractionStatus } from '@/types';
// Lazy loading das bibliotecas de exportação
const loadExportLibraries = async () => {
  const [jsPDF, XLSX] = await Promise.all([
    import('jspdf').then(module => {
      import('jspdf-autotable');
      return module.default;
    }),
    import('xlsx')
  ]);
  return { jsPDF, XLSX };
};

// Declaração de tipos para jsPDF autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
    lastAutoTable?: { finalY: number };
  }
}

const ReportsPage: React.FC = () => {
  const { canExport } = usePermissions();
  const { toast } = useToast();
  

  
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [reportData, setReportData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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

  // Funções de paginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: string) => {
    setItemsPerPage(parseInt(newItemsPerPage));
    setCurrentPage(1); // Reset para primeira página
  };

  // Calcular dados paginados
  const totalPages = Math.ceil(reportData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = reportData.slice(startIndex, endIndex);

  // Reset página quando dados mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [reportData, selectedReportType]);

  // Função para carregar dados do relatório baseado no tipo selecionado
  const loadReportData = useCallback(async (reportType: string) => {
    if (!reportType) {
      setReportData([]);
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulação de dados - em produção viria de uma API
      let data: any[] = [];
      
      switch (reportType) {
        case 'interactions-by-type':
          data = metrics.interactionsByType.map((item, index) => ({
            id: index + 1,
            tipo: item.label,
            quantidade: item.count,
            percentual: ((item.count / metrics.totalInteractions) * 100).toFixed(1) + '%'
          }));
          break;
          
        case 'interactions-by-status':
          data = metrics.interactionsByStatus.map((item, index) => ({
            id: index + 1,
            status: item.label,
            quantidade: item.count,
            percentual: ((item.count / metrics.totalInteractions) * 100).toFixed(1) + '%'
          }));
          break;
          
        case 'people-by-relationship':
          data = metrics.peopleByRelationshipType.map((item, index) => ({
            id: index + 1,
            vinculo: item.label,
            quantidade: item.count,
            percentual: ((item.count / metrics.totalPeople) * 100).toFixed(1) + '%'
          }));
          break;
          
        case 'distribution-by-neighborhood':
          data = metrics.byNeighborhood.map((item, index) => ({
            id: index + 1,
            bairro: item.neighborhood,
            quantidade: item.count,
            percentual: ((item.count / metrics.totalPeople) * 100).toFixed(1) + '%'
          }));
          break;
          
        case 'distribution-by-age':
          data = metrics.byAge.map((item, index) => ({
            id: index + 1,
            faixaEtaria: item.range + ' anos',
            quantidade: item.count,
            percentual: ((item.count / metrics.totalPeople) * 100).toFixed(1) + '%'
          }));
          break;
          
        default:
          data = [];
      }
      
      setReportData(data);
    } catch (error) {
      toast.error('Erro ao carregar dados do relatório');
    } finally {
      setIsLoading(false);
    }
  }, [metrics, toast]);

  // Carregar dados quando o tipo de relatório mudar
  useEffect(() => {
    if (selectedReportType && Object.keys(metrics).length > 0) {
      loadReportData(selectedReportType);
    }
  }, [selectedReportType, metrics, loadReportData]);

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleExportReport = async (format: 'pdf' | 'excel') => {
    if (!canExport) {
      toast.error('Você não tem permissão para gerar relatórios');
      return;
    }

    if (!selectedReportType || reportData.length === 0) {
      toast.error('Selecione um tipo de relatório primeiro');
      return;
    }

    try {
      setIsLoading(true);
      
      const reportTypeNames = {
        'interactions-by-type': 'Interações por Tipo',
        'interactions-by-status': 'Interações por Status', 
        'people-by-relationship': 'Pessoas por Tipo de Vínculo',
        'distribution-by-neighborhood': 'Distribuição por Bairro',
        'distribution-by-age': 'Distribuição por Faixa Etária'
      };
      
      const reportName = reportTypeNames[selectedReportType as keyof typeof reportTypeNames];
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `${reportName.replace(/\s+/g, '_')}_${timestamp}`;

      if (format === 'pdf') {
        // Carregar biblioteca jsPDF dinamicamente
        const { jsPDF } = await loadExportLibraries();
        const doc = new jsPDF();
        
        // Verificar se o jsPDF foi inicializado corretamente
        if (!doc) {
          throw new Error('Falha ao inicializar o gerador de PDF');
        }
        
        // Título do relatório
        doc.setFontSize(16);
        doc.text(reportName, 20, 20);
        
        // Data de geração
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30);
        
        // Preparar dados para a tabela
        const tableData = reportData.map(item => {
          const categoria = item.tipo || item.status || item.vinculo || item.bairro || item.faixaEtaria;
          
          // Validar se os dados essenciais existem
          if (!categoria || item.quantidade === undefined || !item.percentual) {
            console.warn('Dados incompletos encontrados:', item);
            return [
              categoria || 'N/A',
              (item.quantidade || 0).toString(),
              item.percentual || '0%'
            ];
          }
          
          return [
            categoria,
            item.quantidade.toString(),
            item.percentual
          ];
        });

        // Cabeçalhos da tabela
        let headers = ['Categoria', 'Quantidade', 'Percentual'];
        if (selectedReportType === 'interactions-by-type') {
          headers = ['Tipo de Interação', 'Quantidade', 'Percentual'];
        } else if (selectedReportType === 'interactions-by-status') {
          headers = ['Status', 'Quantidade', 'Percentual'];
        } else if (selectedReportType === 'people-by-relationship') {
          headers = ['Tipo de Vínculo', 'Quantidade', 'Percentual'];
        } else if (selectedReportType === 'distribution-by-neighborhood') {
          headers = ['Bairro', 'Quantidade', 'Percentual'];
        } else if (selectedReportType === 'distribution-by-age') {
          headers = ['Faixa Etária', 'Quantidade', 'Percentual'];
        }

        // Calcular totais para adicionar ao final da tabela
        const totalQuantidade = reportData.reduce((sum, item) => sum + item.quantidade, 0);
        const totalPercentual = reportData.reduce((sum, item) => {
          const numericPercent = parseFloat(item.percentual.replace('%', ''));
          return sum + numericPercent;
        }, 0);

        // Adicionar linha de total
        const tableDataWithTotal = [
          ...tableData,
          ['TOTAL', totalQuantidade.toString(), `${totalPercentual.toFixed(1)}%`]
        ];

        // Adicionar tabela ao PDF
        if (!doc.autoTable) {
          throw new Error('Plugin autoTable não está disponível');
        }
        
        doc.autoTable({
          head: [headers],
          body: tableDataWithTotal,
          startY: 40,
          theme: 'grid',
          styles: {
            fontSize: 10,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold',
          },
          // Estilo especial para a linha de total
          didParseCell: (data: any) => {
            if (data.row.index === tableDataWithTotal.length - 1) {
              data.cell.styles.fillColor = [240, 240, 240];
              data.cell.styles.fontStyle = 'bold';
            }
          }
        });

        // Adicionar informações adicionais no final do PDF
        const finalY = doc.lastAutoTable?.finalY || 100;
        
        doc.setFontSize(10);
        doc.text(`Total de registros: ${reportData.length}`, 20, finalY + 15);
        doc.text(`Maior valor: ${Math.max(...reportData.map(item => item.quantidade)).toLocaleString()}`, 20, finalY + 25);
        doc.text(`Menor valor: ${Math.min(...reportData.map(item => item.quantidade)).toLocaleString()}`, 20, finalY + 35);
        
        const mediaQuantidade = (totalQuantidade / reportData.length).toFixed(0);
        doc.text(`Média: ${parseInt(mediaQuantidade).toLocaleString()}`, 20, finalY + 45);

        // Salvar o PDF
        doc.save(`${fileName}.pdf`);
        
      } else if (format === 'excel') {
        // Carregar biblioteca XLSX dinamicamente
        const { XLSX } = await loadExportLibraries();
        
        // Exportar como Excel
        const worksheetData = reportData.map((item, index) => {
          const categoria = item.tipo || item.status || item.vinculo || item.bairro || item.faixaEtaria;
          const percentualNumerico = parseFloat(item.percentual.replace('%', ''));
          
          return {
            'ID': index + 1,
            'Categoria': categoria,
            'Quantidade': item.quantidade,
            'Percentual_Numerico': percentualNumerico,
            'Percentual_Formatado': item.percentual
          };
        });

        // Calcular estatísticas para adicionar no Excel
        const totalQuantidade = reportData.reduce((sum, item) => sum + item.quantidade, 0);
        const totalPercentual = reportData.reduce((sum, item) => {
          const numericPercent = parseFloat(item.percentual.replace('%', ''));
          return sum + numericPercent;
        }, 0);
        const mediaQuantidade = Math.round(totalQuantidade / reportData.length);
        const maiorValor = Math.max(...reportData.map(item => item.quantidade));
        const menorValor = Math.min(...reportData.map(item => item.quantidade));

        // Criar workbook e worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet([]);

        // Melhorias no Excel: Adicionar metadados e formatação
        const headerInfo = [
          [`Relatório: ${reportName}`],
          [`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`],
          [`Hora de Geração: ${new Date().toLocaleTimeString('pt-BR')}`],
          [`Total de Registros: ${reportData.length}`],
          [''],
          ['ESTATÍSTICAS RESUMIDAS:'],
          [`Total Geral: ${totalQuantidade.toLocaleString()}`],
          [`Média: ${mediaQuantidade.toLocaleString()}`],
          [`Maior Valor: ${maiorValor.toLocaleString()}`],
          [`Menor Valor: ${menorValor.toLocaleString()}`],
          [`Percentual Total: ${totalPercentual.toFixed(1)}%`],
          [''],
          ['DADOS DETALHADOS:']
        ];

        // Inserir informações do cabeçalho
        XLSX.utils.sheet_add_aoa(worksheet, headerInfo, { origin: 'A1' });
        
        // Reposicionar os dados principais
        const dataStartRow = headerInfo.length + 1;
        XLSX.utils.sheet_add_json(worksheet, worksheetData, { 
          origin: `A${dataStartRow}`,
          skipHeader: false 
        });

        // Adicionar linha de totais no final dos dados
        const totalRowPosition = dataStartRow + worksheetData.length + 1;
        const totalRowData = [
          ['', 'TOTAL', totalQuantidade, totalPercentual, `${totalPercentual.toFixed(1)}%`]
        ];
        XLSX.utils.sheet_add_aoa(worksheet, totalRowData, { origin: `A${totalRowPosition}` });

        // Configurar largura das colunas
        const columnWidths = [
          { wch: 8 },  // ID
          { wch: 30 }, // Categoria
          { wch: 15 }, // Quantidade
          { wch: 18 }, // Percentual numérico
          { wch: 18 }  // Percentual formatado
        ];
        worksheet['!cols'] = columnWidths;

        // Adicionar worksheet ao workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, reportName.substring(0, 31)); // Limite de 31 caracteres para nome da aba

        // Salvar o arquivo Excel
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
      }

      const totalQuantity = reportData.reduce((sum, item) => sum + item.quantidade, 0);
      toast.success(`Relatório "${reportName}" exportado com sucesso! ${reportData.length} registros processados. Total: ${totalQuantity.toLocaleString()}, Média: ${Math.round(totalQuantity / reportData.length).toLocaleString()}`);
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      toast.error('Erro ao exportar relatório. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-l-4 border-l-indigo-500">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <FileText className="h-8 w-8 text-indigo-600" />
          Relatorios e Auditoria
          <Badge variant="outline" className="ml-2 bg-indigo-100 text-indigo-700 border-indigo-300">
            Analytics
          </Badge>
        </h1>
        <p className="text-gray-600 mt-2">
          Gere relatorios personalizados e visualize logs de auditoria do sistema
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
            <p className="text-xs text-muted-foreground">Distribuicao geografica</p>
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
              Interacoes por Tipo
            </CardTitle>
            <CardDescription className="text-gray-600">
              Distribuicao dos tipos de interacoes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.interactionsByType.map((item) => {
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
              Interacoes por Status
            </CardTitle>
            <CardDescription className="text-gray-600">
              Status atual das interacoes
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
              <BarChart3 className="h-5 w-5 text-indigo-500" />
              Gerar Relatorio Personalizado
            </CardTitle>
            <CardDescription className="text-gray-600">
              Selecione o tipo de relatório para visualizar os dados automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Tipo de Relatório</Label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interactions-by-type">Interações por Tipo</SelectItem>
                <SelectItem value="interactions-by-status">Interações por Status</SelectItem>
                <SelectItem value="people-by-relationship">Pessoas por Tipo de Vínculo</SelectItem>
                <SelectItem value="distribution-by-neighborhood">Distribuição por Bairro</SelectItem>
                <SelectItem value="distribution-by-age">Distribuição por Faixa Etária</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedReportType && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="font-medium">Relatório Selecionado:</span>
                </div>
                <p className="text-sm text-blue-600">
                  {selectedReportType === 'interactions-by-type' && 'Mostra a distribuição das interações por tipo (atendimento, ligação, etc.)'}
                  {selectedReportType === 'interactions-by-status' && 'Mostra a distribuição das interações por status (concluído, pendente, etc.)'}
                  {selectedReportType === 'people-by-relationship' && 'Mostra a distribuição das pessoas por tipo de vínculo (eleitor, parceiro, etc.)'}
                  {selectedReportType === 'distribution-by-neighborhood' && 'Mostra a distribuição das pessoas por bairro'}
                  {selectedReportType === 'distribution-by-age' && 'Mostra a distribuição das pessoas por faixas etárias'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Tabela de Relatório */}
      {selectedReportType && reportData.length > 0 && (
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Resultado do Relatório
              <Badge variant="outline" className="ml-2 bg-green-100 text-green-700 border-green-300">
                {reportData.length} registros
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-600">
               {selectedReportType === 'interactions-by-type' && 'Distribuição das interações por tipo'}
               {selectedReportType === 'interactions-by-status' && 'Distribuição das interações por status'}
               {selectedReportType === 'people-by-relationship' && 'Distribuição das pessoas por tipo de vínculo'}
               {selectedReportType === 'distribution-by-neighborhood' && 'Distribuição das pessoas por bairro'}
               {selectedReportType === 'distribution-by-age' && 'Distribuição das pessoas por faixa etária'}
             </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mr-3"></div>
                <span className="text-gray-600">Carregando dados...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">#</TableHead>
                      <TableHead>
                         {selectedReportType === 'interactions-by-type' && 'Tipo de Interação'}
                         {selectedReportType === 'interactions-by-status' && 'Status'}
                         {selectedReportType === 'people-by-relationship' && 'Tipo de Vínculo'}
                         {selectedReportType === 'distribution-by-neighborhood' && 'Bairro'}
                         {selectedReportType === 'distribution-by-age' && 'Faixa Etária'}
                       </TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                      <TableHead className="text-right">Percentual</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">{row.id}</TableCell>
                        <TableCell>
                           {row.tipo || row.status || row.vinculo || row.bairro || row.faixaEtaria}
                         </TableCell>
                        <TableCell className="text-right font-medium">
                          {row.quantidade.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                            {row.percentual}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
            }
            
            {/* Componente de Paginação */}
              {reportData.length > itemsPerPage && (
                <div className="flex items-center justify-between mt-4 p-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>
                      Mostrando {startIndex + 1} a {Math.min(endIndex, reportData.length)} de {reportData.length} registros
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <span className="text-sm px-2">
                      Página {currentPage} de {totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-sm">Itens por página:</span>
                      <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            
            {canExport() && reportData.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      disabled={isLoading}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Relatório
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    <DropdownMenuItem 
                      onClick={() => handleExportReport('pdf')}
                      disabled={isLoading}
                      className="cursor-pointer"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Exportar como PDF
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleExportReport('excel')}
                      disabled={isLoading}
                      className="cursor-pointer"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Exportar como Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
              {metrics.peopleByRelationshipType.map((item, index: number) => (
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
              Distribuicao por Bairro
            </CardTitle>
            <CardDescription className="text-gray-600">
              Top 5 bairros com mais registros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.byNeighborhood.map((item, index: number) => (
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

      {/* Distribuicao por Faixa Etaria */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Faixa Etária</CardTitle>
          <CardDescription>Quantidade de pessoas por faixa etaria</CardDescription>
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


    </div>
  );
};

export default ReportsPage;