import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { personService } from '@/services/personService';
import { cepService } from '@/services/cepService';
import { validateCPF, validateCEP, validatePhone, validateEmail } from '@/utils/validation';
import { User, MapPin, Users } from 'lucide-react';
import type { PersonFormData, RelationshipType } from '@/types';

const personSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  rg: z.string().min(1, 'RG é obrigatório'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  phone: z.string().refine(validatePhone, 'Telefone inválido'),
  email: z.string().email('E-mail inválido').or(z.literal('')),
  relationshipType: z.enum(['eleitor', 'parceiro', 'representante', 'colaborador_assessor', 'fornecedor_prestador', 'voluntario', 'candidato', 'outros'] as const, {
    required_error: 'Tipo de vínculo é obrigatório',
  }),
  address: z.object({
    cep: z.string().refine(validateCEP, 'CEP inválido'),
    street: z.string().min(1, 'Logradouro é obrigatório'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, 'Bairro é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().min(2, 'Estado é obrigatório'),
  }),
  motherName: z.string().optional(),
  fatherName: z.string().optional(),
  observations: z.string().optional(),
});

type PersonFormValues = z.infer<typeof personSchema>;

const PersonFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      address: {
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
      },
    },
  });

  const watchedCep = watch('address.cep');

  // Carregar dados da pessoa se estiver editando
  useEffect(() => {
    if (isEditing && id) {
      const loadPerson = async () => {
        try {
          setIsLoading(true);
          const person = await personService.getById(id);
          if (person) {
            reset({
              name: person.name,
              cpf: person.cpf,
              rg: person.rg,
              birthDate: person.birthDate,
              phone: person.phone,
              email: person.email || '',
              address: person.address,
              motherName: person.motherName || '',
              fatherName: person.fatherName || '',
              observations: person.observations || '',
            });
          }
        } catch (error) {
          toast.error('Erro ao carregar dados da pessoa');
          navigate('/search');
        } finally {
          setIsLoading(false);
        }
      };
      loadPerson();
    }
  }, [id, isEditing, reset, navigate]);

  // Buscar endereço por CEP
  useEffect(() => {
    const fetchAddress = async () => {
      if (watchedCep && validateCEP(watchedCep)) {
        try {
          setIsCepLoading(true);
          const address = await cepService.getAddressByCEP(watchedCep);
          if (address) {
            setValue('address.street', address.street);
            setValue('address.neighborhood', address.neighborhood);
            setValue('address.city', address.city);
            setValue('address.state', address.state);
          }
        } catch (error) {
          toast.error('Erro ao buscar endereço pelo CEP');
        } finally {
          setIsCepLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(fetchAddress, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedCep, setValue]);

  const onSubmit = async (data: PersonFormValues) => {
    try {
      setIsLoading(true);
      
      const personData: PersonFormData = {
        ...data,
        email: data.email || undefined,
        motherName: data.motherName || undefined,
        fatherName: data.fatherName || undefined,
        observations: data.observations || undefined,
      };

      if (isEditing && id) {
        await personService.update(id, personData);
        toast.success('Pessoa atualizada com sucesso!');
      } else {
        await personService.create(personData);
        toast.success('Pessoa cadastrada com sucesso!');
      }
      
      navigate('/search');
    } catch (error) {
      toast.error(isEditing ? 'Erro ao atualizar pessoa' : 'Erro ao cadastrar pessoa');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-l-4 border-l-green-500">
        <div className="flex items-center gap-4">
          <div className="bg-green-500 rounded-full p-3">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Editar Pessoa' : 'Cadastrar Nova Pessoa'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Atualize as informações da pessoa' : 'Preencha os dados para cadastrar uma nova pessoa'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Dados Pessoais */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <User className="h-5 w-5 text-blue-500" />
              Dados Pessoais
            </CardTitle>
            <CardDescription className="text-gray-600">Informações básicas da pessoa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Digite o nome completo"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  {...register('cpf')}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
                {errors.cpf && (
                  <p className="text-sm text-red-500">{errors.cpf.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rg">RG *</Label>
                <Input
                  id="rg"
                  {...register('rg')}
                  placeholder="Digite o RG"
                />
                {errors.rg && (
                  <p className="text-sm text-red-500">{errors.rg.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  {...register('birthDate')}
                />
                {errors.birthDate && (
                  <p className="text-sm text-red-500">{errors.birthDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="(00) 00000-0000"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="email@exemplo.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="motherName">Nome da Mãe</Label>
                <Input
                  id="motherName"
                  {...register('motherName')}
                  placeholder="Digite o nome da mãe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatherName">Nome do Pai</Label>
                <Input
                  id="fatherName"
                  {...register('fatherName')}
                  placeholder="Digite o nome do pai"
                />
              </div>
            </div>

            {/* Tipo de Vínculo */}
            <div className="space-y-2">
              <Label htmlFor="relationshipType">Tipo de Vínculo *</Label>
              <select
                id="relationshipType"
                {...register('relationshipType')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecione o tipo de vínculo</option>
                <option value="eleitor">Eleitor</option>
                <option value="parceiro">Parceiro</option>
                <option value="representante">Representante</option>
                <option value="colaborador_assessor">Colaborador/Assessor</option>
                <option value="fornecedor_prestador">Fornecedor/Prestador de Serviço</option>
                <option value="voluntario">Voluntário</option>
                <option value="candidato">Candidato</option>
                <option value="outros">Outros</option>
              </select>
              {errors.relationshipType && (
                <p className="text-sm text-red-500">{errors.relationshipType.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <MapPin className="h-5 w-5 text-orange-500" />
              Endereço
            </CardTitle>
            <CardDescription className="text-gray-600">Informações de endereço</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP *</Label>
                <div className="relative">
                  <Input
                    id="cep"
                    {...register('address.cep')}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                  {isCepLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
                {errors.address?.cep && (
                  <p className="text-sm text-red-500">{errors.address.cep.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street">Logradouro *</Label>
                <Input
                  id="street"
                  {...register('address.street')}
                  placeholder="Digite o logradouro"
                />
                {errors.address?.street && (
                  <p className="text-sm text-red-500">{errors.address.street.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  {...register('address.number')}
                  placeholder="123"
                />
                {errors.address?.number && (
                  <p className="text-sm text-red-500">{errors.address.number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  {...register('address.complement')}
                  placeholder="Apto, Bloco, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  {...register('address.neighborhood')}
                  placeholder="Digite o bairro"
                />
                {errors.address?.neighborhood && (
                  <p className="text-sm text-red-500">{errors.address.neighborhood.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  {...register('address.city')}
                  placeholder="Digite a cidade"
                />
                {errors.address?.city && (
                  <p className="text-sm text-red-500">{errors.address.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  {...register('address.state')}
                  placeholder="SP"
                  maxLength={2}
                />
                {errors.address?.state && (
                  <p className="text-sm text-red-500">{errors.address.state.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
            <CardDescription>Informações adicionais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <textarea
                id="observations"
                {...register('observations')}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Digite observações adicionais..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Botões */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/search')}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? 'Atualizando...' : 'Cadastrando...'}
              </>
            ) : (
              isEditing ? 'Atualizar' : 'Cadastrar'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonFormPage;