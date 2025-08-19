import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, User, Download, Trash2, Eye, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { PageHeader, FormCard, LoadingSpinner } from '@/components/ui'
import { usePermissions } from '@/contexts/AuthContext'
import { personService } from '@/services/personService'
import { maskPhone } from '@/utils/lgpd'
import { Person, SearchFilters } from '@/types'
import { useToast } from '@/components/ui/use-toast'

const PersonSearchPage: React.FC = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { canCreate, canEdit, canDelete, canExport } = usePermissions()
  const canViewSensitive = true // Temporário - ajustar conforme necessário
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    name: '',
    phone: '',
    city: '',
    state: '',
  });
  
  const [results, setResults] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);

  const handleSearch = useCallback(async () => {
    // Verificar se pelo menos um campo foi preenchido
    const hasFilters = Object.values(searchFilters).some(value => value.trim() !== '');
    if (!hasFilters) {
      toast.error('Preencha pelo menos um campo para realizar a busca');
      return;
    }

    try {
      setIsLoading(true);
      const searchResult = await personService.searchPersons(searchFilters, 'current-user');
      const searchResults = searchResult.people;
      setResults(searchResults);
      setHasSearched(true);
      
      if (searchResults.length === 0) {
        toast.info('Nenhuma pessoa encontrada com os critérios informados');
      } else {
        toast.success(`${searchResults.length} pessoa(s) encontrada(s)`);
      }
    } catch (error) {
      toast.error('Erro ao realizar a busca');
    } finally {
      setIsLoading(false);
    }
  }, [searchFilters]);

  // Busca automática com debounce
  useEffect(() => {
    // Limpar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Verificar se há pelo menos um filtro preenchido
    const hasFilters = Object.values(searchFilters).some(value => value.trim() !== '');
    
    if (hasFilters) {
      // Criar novo timeout para busca
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch();
      }, 500); // 500ms de debounce
    } else {
      // Se não há filtros, limpar resultados mas manter hasSearched se já foi feita uma busca
      setResults([]);
      // Não resetar hasSearched para manter a seção de resultados visível
    }

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchFilters, handleSearch]);

  const handleClearFilters = () => {
    setSearchFilters({
      name: '',
      phone: '',
      city: '',
      state: '',
    });
    setResults([]);
    setHasSearched(false);
  };

  const handleExport = async () => {
    if (!canExport) {
      toast.error('Você não tem permissão para exportar dados');
      return;
    }

    try {
      setIsLoading(true);
      await personService.exportPersons(searchFilters, 'csv', 'current-user');
      toast.success('Dados exportados com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!canDelete) {
      toast.error('Você não tem permissão para excluir pessoas');
      return;
    }

    if (window.confirm(`Tem certeza que deseja excluir ${name}?`)) {
      try {
        await personService.deletePerson(id, 'current-user');
        toast.success('Pessoa excluída com sucesso!');
        // Atualizar a lista removendo a pessoa excluída
        setResults(prev => prev.filter(person => person.id !== id));
      } catch (error) {
        toast.error('Erro ao excluir pessoa');
      }
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Buscar Pessoas"
        description="Use os filtros abaixo para encontrar pessoas no sistema"
        icon={Search}
        action={canCreate() ? {
          label: 'Nova Pessoa',
          onClick: () => navigate('/pessoa/novo'),
          icon: Plus
        } : undefined}
      />

      {/* Filtros de Busca */}
      <FormCard
        title="Filtros de Busca"
        description="Digite nos campos abaixo - a busca é feita automaticamente enquanto você digita"
        icon={Search}
        variant="blue"
      >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Digite o nome"
                value={searchFilters.name}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>



            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={searchFilters.phone}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                placeholder="Digite a cidade"
                value={searchFilters.city}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                placeholder="SP"
                value={searchFilters.state}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, state: e.target.value }))}
                maxLength={2}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isLoading && (
                <>
                  <LoadingSpinner size="sm" variant="blue" />
                  <span>Buscando automaticamente...</span>
                </>
              )}
              {!isLoading && hasSearched && (
                <span className="text-green-600">✓ Busca concluída</span>
              )}
            </div>
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
          </div>
      </FormCard>

      {/* Resultados */}
      {(hasSearched || Object.values(searchFilters).some(value => value.trim() !== '')) && (
        <FormCard
          title="Resultados da Busca"
          description={`${results.length} pessoa(s) encontrada(s)`}
          icon={User}
          variant="green"
        >
          <div className="flex justify-between items-center mb-4">
            <div></div>
            {results.length > 0 && canExport() && (
              <Button variant="outline" onClick={handleExport} disabled={isLoading}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            )}
          </div>
            {results.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma pessoa encontrada</h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Não encontramos nenhuma pessoa com os critérios de busca informados. 
                  Tente ajustar os filtros ou verificar a ortografia.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">💡</span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-1">Dicas para melhorar sua busca:</p>
                      <ul className="text-blue-800 space-y-1 list-none">
                        <li>• Verifique se os dados estão corretos</li>
                        <li>• Tente buscar apenas por nome</li>
                        <li>• Use termos mais gerais</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((person) => (
                  <div
                    key={person.id}
                    className="border border-l-4 border-l-blue-500 rounded-lg p-4 hover:bg-muted/50 transition-colors shadow-sm hover:shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-500" />
                            <h3 className="font-semibold text-lg text-gray-900">{person.name}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              ID: {person.id}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Ativo
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">

                          <div>
                            <span className="font-medium">Telefone:</span>{' '}
                            {canViewSensitive ? person.phone : maskPhone(person.phone || '')}
                          </div>
                          <div>
                            <span className="font-medium">Data Nasc.:</span>{' '}
                            {formatDate(person.birthDate)}
                          </div>
                          <div>
                            <span className="font-medium">Cidade:</span>{' '}
                            {person.address?.city}/{person.address?.state}
                          </div>
                          <div>
                            <span className="font-medium">Bairro:</span>{' '}
                            {person.address?.neighborhood}
                          </div>
                          <div>
                            <span className="font-medium">Cadastrado:</span>{' '}
                            {formatDate(person.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/person/${person.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {canEdit() && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/person/${person.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {canDelete() && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(person.id, person.name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </FormCard>
      )}

      {/* Informações sobre LGPD */}
      <FormCard
        title="Informações sobre Privacidade"
        description="Proteção de dados conforme LGPD"
        icon={Eye}
        variant="purple"
      >
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              • Os dados pessoais são protegidos conforme a Lei Geral de Proteção de Dados (LGPD).
            </p>
            <p>
              • Informações sensíveis são mascaradas para usuários sem permissão específica.
            </p>
            <p>
              • Todas as ações de busca e visualização são registradas para auditoria.
            </p>
            <p>
              • A exportação de dados requer permissões especiais e é auditada.
            </p>
          </div>
      </FormCard>
    </div>
  );
};

export default PersonSearchPage;