import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { personService } from '@/services/personService';
import { usePermissions } from '@/components/ProtectedRoute';
import { maskPhone, maskEmail } from '@/utils/lgpd';
import { Edit, ArrowLeft, Plus, Calendar, User, Phone, MapPin, FileText } from 'lucide-react';
import type { Person, Interaction, InteractionFormData } from '@/types';

const PersonProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { canEdit, canViewSensitiveData } = usePermissions();
  
  const [person, setPerson] = useState<Person | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const [newInteraction, setNewInteraction] = useState<Partial<InteractionFormData>>({
    type: 'atendimento',
    title: '',
    description: '',
    status: 'pendente'
  });

  useEffect(() => {
    if (id) {
      loadPersonData();
    }
  }, [id]);

  const loadPersonData = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const personData = await personService.getPersonById(id);
      if (personData) {
        setPerson(personData);
        setInteractions(personData.interactions || []);
      } else {
        toast.error('Pessoa não encontrada');
        navigate('/search');
      }
    } catch (error) {
      toast.error('Erro ao carregar dados da pessoa');
      navigate('/search');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddInteraction = async () => {
    if (!id || !newInteraction.description?.trim()) {
      toast.error('Descrição da interação é obrigatória');
      return;
    }

    try {
      const interactionData = {
          type: newInteraction.type || 'atendimento',
          description: newInteraction.description || '',
          title: newInteraction.title || '',
          status: newInteraction.status || 'pendente',
          personId: id,
          responsibleUserId: 'user123', // TODO: usar userId real
        };

      await personService.addInteraction(id, interactionData, 'user123'); // TODO: usar userId real
      toast.success('Interação adicionada com sucesso!');
      
      // Recarregar dados para mostrar a nova interação
      await loadPersonData();
      
      // Limpar formulário
      setNewInteraction({
        type: 'atendimento',
        title: '',
        description: '',
        status: 'pendente'
      });
      setShowAddInteraction(false);
    } catch (error) {
      toast.error('Erro ao adicionar interação');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getInteractionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      contact: 'Contato',
      visit: 'Visita',
      phone_call: 'Ligação',
      email: 'E-mail',
      meeting: 'Reunião',
      document: 'Documento',
      other: 'Outro',
    };
    return types[type] || type;
  };

  const getInteractionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      contact: 'bg-blue-100 text-blue-800',
      visit: 'bg-green-100 text-green-800',
      phone_call: 'bg-yellow-100 text-yellow-800',
      email: 'bg-purple-100 text-purple-800',
      meeting: 'bg-orange-100 text-orange-800',
      document: 'bg-gray-100 text-gray-800',
      other: 'bg-pink-100 text-pink-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Pessoa não encontrada</p>
        <Button onClick={() => navigate('/search')} className="mt-4">
          Voltar à Busca
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-l-4 border-l-blue-500">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/search')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 rounded-full p-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{person.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ID: {person.id}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Perfil Ativo
                  </span>
                </div>
              </div>
            </div>
          </div>
          {canEdit() && (
            <Button onClick={() => navigate(`/person/${person.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Pessoais */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-l-4 border-l-green-500 shadow-sm">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <User className="h-5 w-5 text-green-500" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Data de Nascimento</Label>
                  <p className="text-sm">{formatDate(person.birthDate.toISOString())}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Idade</Label>
                  <p className="text-sm">
                    {new Date().getFullYear() - new Date(person.birthDate).getFullYear()} anos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 shadow-sm">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Phone className="h-5 w-5 text-purple-500" />
                Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                  <p className="text-sm">
                    {canViewSensitiveData() ? person.phone : maskPhone(person.phone || '')}
                  </p>
                </div>
                {person.email && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">E-mail</Label>
                    <p className="text-sm">
                      {canViewSensitiveData() ? person.email : maskEmail(person.email || '')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 shadow-sm">
            <CardHeader className="bg-orange-50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <MapPin className="h-5 w-5 text-orange-500" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  {person.address?.street}, {person.address?.number}
                  {person.address?.complement && `, ${person.address.complement}`}
                </p>
                <p className="text-sm">
                  {person.address?.neighborhood} - {person.address?.city}/{person.address?.state}
                </p>
                <p className="text-sm text-muted-foreground">
                  CEP: {person.address?.cep}
                </p>
              </div>
            </CardContent>
          </Card>



          {person.notes && (
            <Card className="border-l-4 border-l-indigo-500 shadow-sm">
              <CardHeader className="bg-indigo-50">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <FileText className="h-5 w-5 text-indigo-500" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{person.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar com informações adicionais */}
        <div className="space-y-6">
          <Card className="border-l-4 border-l-cyan-500 shadow-sm">
            <CardHeader className="bg-cyan-50">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Calendar className="h-5 w-5 text-cyan-500" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Cadastrado em</Label>
                <p className="text-sm">{formatDateTime(person.createdAt.toISOString())}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Última atualização</Label>
                <p className="text-sm">{formatDateTime(person.updatedAt.toISOString())}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Total de interações</Label>
                <p className="text-sm">{interactions.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Interações */}
          <Card className="border-l-4 border-l-emerald-500 shadow-sm">
            <CardHeader className="bg-emerald-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-900">Interações</CardTitle>
                <Button
                  size="sm"
                  onClick={() => setShowAddInteraction(!showAddInteraction)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova
                </Button>
              </div>
              <CardDescription className="text-gray-600">
                Histórico de contatos e interações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formulário para nova interação */}
              {showAddInteraction && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="interactionType">Tipo</Label>
                    <select
                      id="interactionType"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={newInteraction.type}
                      onChange={(e) => setNewInteraction(prev => ({ ...prev, type: e.target.value as any }))}
                    >
                      <option value="atendimento">Atendimento</option>
                      <option value="ligacao">Ligação</option>
                      <option value="email">E-mail</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="reuniao">Reunião</option>
                      <option value="visita">Visita</option>
                      <option value="evento">Evento</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interactionTitle">Título</Label>
                    <Input
                      id="interactionTitle"
                      placeholder="Título da interação..."
                      value={newInteraction.title}
                      onChange={(e) => setNewInteraction(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interactionDescription">Descrição</Label>
                    <Input
                      id="interactionDescription"
                      placeholder="Descreva a interação..."
                      value={newInteraction.description}
                      onChange={(e) => setNewInteraction(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interactionStatus">Status</Label>
                    <select
                      id="interactionStatus"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={newInteraction.status}
                      onChange={(e) => setNewInteraction(prev => ({ ...prev, status: e.target.value as any }))}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluido">Concluído</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddInteraction}>
                      Salvar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAddInteraction(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              {/* Lista de interações */}
              {interactions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma interação registrada
                </p>
              ) : (
                <div className="space-y-3">
                  {interactions
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((interaction) => (
                      <div key={interaction.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInteractionTypeColor(interaction.type)}`}>
                            {getInteractionTypeLabel(interaction.type)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(interaction.createdAt.toISOString())}
                          </span>
                        </div>
                        <p className="text-sm">{interaction.description}</p>
                        {/* Removido interaction.notes pois não existe no tipo Interaction */}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonProfilePage;