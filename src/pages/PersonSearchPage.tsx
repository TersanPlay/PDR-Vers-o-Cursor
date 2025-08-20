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
import { formatDate } from '@/lib/utils'

const PersonSearchPage: React.FC = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { canCreate, canEdit, canDelete, canExport } = usePermissions()
  const canViewSensitive = true // Temporário - ajustar conforme necessário
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  
  const [results, setResults] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(async () => {
    // Verificar se o campo de busca foi preenchido
    if (!searchQuery.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      // Criar filtros baseados na query unificada
      const filters: SearchFilters = {
        name: searchQuery,
        phone: searchQuery,
        email: searchQuery,
        relationshipType: undefined // Será tratado no backend se necessário
      };
      
      const searchResult = await personService.searchPersons(filters, 'current-user');
      const searchResults = searchResult.people;
      setResults(searchResults);
      setHasSearched(true);
      
      // Não exibir notificação quando não há resultados - o card já mostra a mensagem
      if (searchResults.length > 0) {
        toast.success(`${searchResults.length} pessoa(s) encontrada(s)`);
      }
    } catch (error) {
      toast.error('Erro ao realizar a busca');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, toast]);

  // Busca automática com debounce
  useEffect(() => {
    // Limpar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Verificar se há texto na busca
    if (searchQuery.trim()) {
      // Criar novo timeout para busca
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch();
      }, 500); // 500ms de debounce
    } else {
      // Se não há texto, limpar resultados mas manter hasSearched se já foi feita uma busca
      setResults([]);
      // Não resetar hasSearched para manter a seção de resultados visível
    }

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, handleSearch]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSearchFilters({});
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



  return (
    <div className="space-y-6">
      <PageHeader
        title="Buscar Pessoas"
        description="Use os filtros abaixo para encontrar pessoas no sistema"
        icon={Search}
        action={canCreate() ? {
          label: 'Nova Pessoa',
          onClick: () => navigate('/person/new'),
          icon: Plus
        } : undefined}
      />

      {/* Filtros de Busca */}
      <FormCard
        title="Filtros de Busca"
        description="Digite para buscar por nome, telefone, e-mail ou tipo de vínculo - a busca é feita automaticamente enquanto você digita"
        icon={Search}
        variant="blue"
      >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar Pessoa</Label>
              <Input
                id="search"
                placeholder="Digite nome, telefone, e-mail ou tipo de vínculo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-base"
              />
              <p className="text-sm text-muted-foreground">
                Exemplos: "João Silva", "(11) 99999-9999", "joao@email.com", "cidadão", "parceiro"
              </p>
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
              Limpar Busca
            </Button>
          </div>
      </FormCard>

      {/* Resultados */}
      {(hasSearched || Object.values(searchFilters).some(value => value.trim() !== '')) ? (
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
      ) : (
        <FormCard
          title="Nenhum Dado Disponível"
          description="Não há pessoas cadastradas no sistema"
          icon={User}
          variant="blue"
        >
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sistema sem dados</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Ainda não há pessoas cadastradas no sistema. 
              Comece adicionando a primeira pessoa para começar a usar as funcionalidades de busca.
            </p>
            {canCreate() && (
              <Button 
                onClick={() => navigate('/person/new')}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeira Pessoa
              </Button>
            )}
          </div>
        </FormCard>
      )}

      {/* Card de Informações sobre LGPD */}
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