import React, { useState, useEffect } from 'react'
import { useAuth, usePermissions } from '../contexts/AuthContext'
import { User, Cabinet, Department, CabinetOrDepartment } from '../types'
import { authService } from '../services/authService'
import { cabinetService } from '../services/cabinetService'
import { departmentService } from '../services/departmentService'
import { credentialsService } from '../services/credentialsService'
import {
  User as UserIcon,
  Building2,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Key,
  Shield,
  Users,
  Settings,
  Camera
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { toast } from 'sonner'

type ProfileType = 'user' | 'cabinet' | 'department'

interface ProfileData {
  type: ProfileType
  data: User | Cabinet | Department
}

/**
 * Página de perfil que exibe informações detalhadas para Usuários, Gabinetes e Departamentos
 */
export const ProfilePage: React.FC = () => {
  const { user, hasRole } = useAuth()
  const [currentProfile, setCurrentProfile] = useState<ProfileData | undefined>(undefined)
  const [availableProfiles, setAvailableProfiles] = useState<ProfileData[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<User | Cabinet | Department>>({})
  const [showCredentials, setShowCredentials] = useState(false)
  const [credentials, setCredentials] = useState<{
    id: string
    cabinetId: string
    username: string
    email: string
    lastPasswordChange: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  } | undefined>(undefined)
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    loadProfiles()
  }, [user])

  // Carregar perfis disponíveis
  const loadProfiles = async () => {
    if (!user) return

    const profiles: ProfileData[] = []

    // Sempre adicionar o perfil do usuário atual
    profiles.push({
      type: 'user',
      data: user
    })

    // Se for administrador, carregar todos os gabinetes e departamentos
    if (hasRole('admin')) {
      try {
        const allProfiles = cabinetService.getAllCabinetsAndDepartments()
        const cabinets = allProfiles.filter(profile => !isDepartment(profile)) as Cabinet[]
        const departments = allProfiles.filter(profile => isDepartment(profile)) as Department[]
        
        cabinets.forEach(cabinet => {
          profiles.push({
            type: 'cabinet',
            data: cabinet
          })
        })

        departments.forEach(department => {
          profiles.push({
            type: 'department',
            data: department
          })
        })
      } catch (error) {
        console.error('Erro ao carregar perfis:', error)
        toast.error('Erro ao carregar perfis disponíveis')
      }
    } else if (user.cabinetId) {
      // Se for chefe de gabinete, carregar apenas seu gabinete
      try {
        const cabinet = cabinetService.getCabinetById(user.cabinetId)
        if (cabinet) {
          profiles.push({
            type: 'cabinet',
            data: cabinet
          })
        }
      } catch (error) {
        console.error('Erro ao carregar gabinete:', error)
      }
    }

    setAvailableProfiles(profiles)
    
    // Definir perfil atual (usuário por padrão)
    if (profiles.length > 0) {
      setCurrentProfile(profiles[0])
    }
  }

  const handleProfileChange = (profileIndex: number) => {
    setCurrentProfile(availableProfiles[profileIndex])
    setIsEditing(false)
    setShowCredentials(false)
  }

  const handleEdit = () => {
    if (currentProfile) {
      setEditData({ ...currentProfile.data })
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    if (!currentProfile) return

    try {
      if (currentProfile.type === 'cabinet') {
        await cabinetService.updateCabinet(editData.id, editData)
        toast.success('Gabinete atualizado com sucesso')
      } else if (currentProfile.type === 'department') {
        await departmentService.updateDepartment(editData.id, editData)
        toast.success('Departamento atualizado com sucesso')
      }
      
      // Recarregar perfis
      await loadProfiles()
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar alterações')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({})
  }

  const loadCredentials = async () => {
    if (!currentProfile || currentProfile.type === 'user') return

    setIsLoadingCredentials(true)
    try {
      const creds = await credentialsService.getCabinetCredentials(currentProfile.data.id)
      setCredentials(creds)
      setShowCredentials(true)
    } catch (error) {
      console.error('Erro ao carregar credenciais:', error)
      toast.error('Erro ao carregar credenciais')
    } finally {
      setIsLoadingCredentials(false)
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ativo: { label: 'Ativo', variant: 'default' as const },
      pendente: { label: 'Pendente', variant: 'secondary' as const },
      inativo: { label: 'Inativo', variant: 'destructive' as const }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      admin: 'Administrador',
      chefe_gabinete: 'Chefe de Gabinete',
      assessor: 'Assessor',
      visualizador: 'Visualizador'
    }
    return roleLabels[role as keyof typeof roleLabels] || role
  }

  // Função helper para determinar se é um departamento
  const isDepartment = (item: CabinetOrDepartment): item is Department => {
    return 'areaOfActivity' in item
  }

  const isCabinet = (data: User | Cabinet | Department): data is Cabinet => {
    return 'municipality' in data && !('areaOfActivity' in data)
  }

  const isUser = (data: User | Cabinet | Department): data is User => {
    return 'role' in data && 'email' in data && !('municipality' in data)
  }

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  const renderUserProfile = (userData: User) => (
    <div className="space-y-6">
      {/* Seção de Identificação Visual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-white text-xl">
                  {getUserInitials(userData.name)}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                disabled
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome Completo</Label>
                  <p className="text-sm font-medium">{userData.name}</p>
                </div>
                <div>
                  <Label>Função</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{getRoleLabel(userData.role)}</Badge>
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-gray-600">{userData.email}</p>
                </div>
                <div>
                  <Label>Data de Cadastro</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(userData.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCabinetProfile = (cabinetData: Cabinet) => (
    <div className="space-y-6">
      {/* Seção de Identificação Visual */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações do Gabinete
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusBadge(cabinetData.status)}
            {hasRole('admin') && (
              <Button
                size="sm"
                variant="outline"
                onClick={isEditing ? handleSave : handleEdit}
                disabled={isEditing && !editData.name}
              >
                {isEditing ? (
                  <><Save className="h-4 w-4 mr-2" />Salvar</>
                ) : (
                  <><Edit3 className="h-4 w-4 mr-2" />Editar</>
                )}
              </Button>
            )}
            {isEditing && (
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-blue-600 text-white text-xl">
                  {getUserInitials(cabinetData.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome do Gabinete</Label>
                  {isEditing ? (
                    <Input
                      value={editData.name || ''}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      placeholder="Nome do gabinete"
                    />
                  ) : (
                    <p className="text-sm font-medium">{cabinetData.name}</p>
                  )}
                </div>
                <div>
                  <Label>Vereador</Label>
                  {isEditing ? (
                    <Input
                      value={editData.councilMemberName || ''}
                      onChange={(e) => setEditData({...editData, councilMemberName: e.target.value})}
                      placeholder="Nome do vereador"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{cabinetData.councilMemberName}</p>
                  )}
                </div>
                <div>
                  <Label>Município</Label>
                  {isEditing ? (
                    <Input
                      value={editData.municipality || ''}
                      onChange={(e) => setEditData({...editData, municipality: e.target.value})}
                      placeholder="Município"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{cabinetData.municipality}</p>
                  )}
                </div>
                <div>
                  <Label>Cidade</Label>
                  {isEditing ? (
                    <Input
                      value={editData.city || ''}
                      onChange={(e) => setEditData({...editData, city: e.target.value})}
                      placeholder="Cidade"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{cabinetData.city}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Contatos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Informações de Contato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Telefone Institucional</Label>
              {isEditing ? (
                <Input
                  value={editData.institutionalPhone || ''}
                  onChange={(e) => setEditData({...editData, institutionalPhone: e.target.value})}
                  placeholder="(00) 0000-0000"
                />
              ) : (
                <p className="text-sm text-gray-600">{cabinetData.institutionalPhone || 'Não informado'}</p>
              )}
            </div>
            <div>
              <Label>Email Institucional</Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editData.institutionalEmail || ''}
                  onChange={(e) => setEditData({...editData, institutionalEmail: e.target.value})}
                  placeholder="email@gabinete.gov.br"
                />
              ) : (
                <p className="text-sm text-gray-600">{cabinetData.institutionalEmail || 'Não informado'}</p>
              )}
            </div>
            <div>
              <Label>Website</Label>
              {isEditing ? (
                <Input
                  value={editData.website || ''}
                  onChange={(e) => setEditData({...editData, website: e.target.value})}
                  placeholder="https://www.gabinete.gov.br"
                />
              ) : (
                <p className="text-sm text-gray-600">{cabinetData.website || 'Não informado'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Credenciais (apenas para Administradores) */}
      {hasRole('admin') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Credenciais de Acesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={loadCredentials}
                  disabled={isLoadingCredentials}
                >
                  {showCredentials ? (
                    <><EyeOff className="h-4 w-4 mr-2" />Ocultar Credenciais</>
                  ) : (
                    <><Eye className="h-4 w-4 mr-2" />Visualizar Credenciais</>
                  )}
                </Button>
              </div>
              
              {showCredentials && credentials && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label>Usuário</Label>
                    <p className="text-sm font-mono">{credentials.username}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm font-mono">{credentials.email}</p>
                  </div>
                  <div>
                    <Label>Última Alteração de Senha</Label>
                    <p className="text-sm text-gray-600">
                      {new Date(credentials.lastPasswordChange).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={credentials.isActive ? 'default' : 'destructive'}>
                      {credentials.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderDepartmentProfile = (departmentData: Department) => (
    <div className="space-y-6">
      {/* Seção de Identificação Visual */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações do Departamento
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusBadge(departmentData.status)}
            {hasRole('admin') && (
              <Button
                size="sm"
                variant="outline"
                onClick={isEditing ? handleSave : handleEdit}
                disabled={isEditing && !editData.name}
              >
                {isEditing ? (
                  <><Save className="h-4 w-4 mr-2" />Salvar</>
                ) : (
                  <><Edit3 className="h-4 w-4 mr-2" />Editar</>
                )}
              </Button>
            )}
            {isEditing && (
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-green-600 text-white text-xl">
                  {getUserInitials(departmentData.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome do Departamento</Label>
                  {isEditing ? (
                    <Input
                      value={editData.name || ''}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      placeholder="Nome do departamento"
                    />
                  ) : (
                    <p className="text-sm font-medium">{departmentData.name}</p>
                  )}
                </div>
                <div>
                  <Label>Responsável</Label>
                  {isEditing ? (
                    <Input
                      value={editData.councilMemberName || ''}
                      onChange={(e) => setEditData({...editData, councilMemberName: e.target.value})}
                      placeholder="Nome do responsável"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{departmentData.councilMemberName}</p>
                  )}
                </div>
                <div>
                  <Label>Área de Atuação</Label>
                  {isEditing ? (
                    <Input
                      value={editData.areaOfActivity || ''}
                      onChange={(e) => setEditData({...editData, areaOfActivity: e.target.value})}
                      placeholder="Área de atuação"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{departmentData.areaOfActivity}</p>
                  )}
                </div>
                <div>
                  <Label>Localização</Label>
                  {isEditing ? (
                    <Select
                      value={editData.location || ''}
                      onValueChange={(value) => setEditData({...editData, location: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a localização" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Térreo">Térreo</SelectItem>
                        <SelectItem value="1° andar">1° andar</SelectItem>
                        <SelectItem value="2° andar">2° andar</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-gray-600">{departmentData.location}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Contatos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Informações de Contato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Telefone Institucional</Label>
              {isEditing ? (
                <Input
                  value={editData.institutionalPhone || ''}
                  onChange={(e) => setEditData({...editData, institutionalPhone: e.target.value})}
                  placeholder="(00) 0000-0000"
                />
              ) : (
                <p className="text-sm text-gray-600">{departmentData.institutionalPhone || 'Não informado'}</p>
              )}
            </div>
            <div>
              <Label>Email Institucional</Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editData.institutionalEmail || ''}
                  onChange={(e) => setEditData({...editData, institutionalEmail: e.target.value})}
                  placeholder="email@departamento.gov.br"
                />
              ) : (
                <p className="text-sm text-gray-600">{departmentData.institutionalEmail || 'Não informado'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Credenciais (apenas para Administradores) */}
      {hasRole('admin') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Credenciais de Acesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={loadCredentials}
                  disabled={isLoadingCredentials}
                >
                  {showCredentials ? (
                    <><EyeOff className="h-4 w-4 mr-2" />Ocultar Credenciais</>
                  ) : (
                    <><Eye className="h-4 w-4 mr-2" />Visualizar Credenciais</>
                  )}
                </Button>
              </div>
              
              {showCredentials && credentials && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label>Usuário</Label>
                    <p className="text-sm font-mono">{credentials.username}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm font-mono">{credentials.email}</p>
                  </div>
                  <div>
                    <Label>Última Alteração de Senha</Label>
                    <p className="text-sm text-gray-600">
                      {new Date(credentials.lastPasswordChange).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={credentials.isActive ? 'default' : 'destructive'}>
                      {credentials.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header com navegação entre perfis */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie informações do perfil
          </p>
        </div>

        {/* Seletor de perfis (apenas para Administradores) */}
        {hasRole('admin') && availableProfiles.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="profile-selector">Visualizar perfil:</Label>
              <Select
                value={availableProfiles.findIndex(p => p === currentProfile).toString()}
                onValueChange={(value) => handleProfileChange(parseInt(value))}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
                <SelectContent>
                  {availableProfiles.map((profile, index) => {
                    const data = profile.data
                    let label = ''
                    let icon = null
                    
                    if (profile.type === 'user') {
                       label = `${data.name}`
                       icon = <UserIcon className="h-4 w-4" />
                     } else if (profile.type === 'cabinet') {
                       label = `${data.name}`
                       icon = <Building className="h-4 w-4" />
                     } else if (profile.type === 'department') {
                       label = `${data.name}`
                       icon = <Building className="h-4 w-4" />
                    }
                    
                    return (
                      <SelectItem key={index} value={index.toString()}>
                        <div className="flex items-center gap-2">
                          {icon}
                          <span>{label}</span>
                          <Badge variant="outline" className="ml-2">
                            {profile.type === 'user' ? 'Usuário' : 
                             profile.type === 'cabinet' ? 'Gabinete' : 'Departamento'}
                          </Badge>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            
            {/* Botões de navegação rápida */}
            <div className="flex items-center gap-1">
              <Button
                variant={currentProfile?.type === 'user' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  const userProfile = availableProfiles.find(p => p.type === 'user')
                  if (userProfile) {
                    const index = availableProfiles.findIndex(p => p === userProfile)
                    handleProfileChange(index)
                  }
                }}
              >
                <UserIcon className="h-4 w-4 mr-1" />
                Usuário
              </Button>
              {availableProfiles.some(p => p.type === 'cabinet') && (
                <Button
                   variant={currentProfile?.type === 'cabinet' ? 'default' : 'outline'}
                   size="sm"
                   onClick={() => {
                     const cabinetProfile = availableProfiles.find(p => p.type === 'cabinet')
                     if (cabinetProfile) {
                       const index = availableProfiles.findIndex(p => p === cabinetProfile)
                       handleProfileChange(index)
                     }
                   }}
                 >
                   <Building className="h-4 w-4 mr-1" />
                   Gabinetes
                 </Button>
              )}
              {availableProfiles.some(p => p.type === 'department') && (
                <Button
                  variant={currentProfile?.type === 'department' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const departmentProfile = availableProfiles.find(p => p.type === 'department')
                    if (departmentProfile) {
                      const index = availableProfiles.findIndex(p => p === departmentProfile)
                      handleProfileChange(index)
                    }
                  }}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Departamentos
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo do perfil */}
      <div className="max-w-4xl">
        {currentProfile.type === 'user' && renderUserProfile(currentProfile.data as User)}
        {currentProfile.type === 'cabinet' && renderCabinetProfile(currentProfile.data as Cabinet)}
        {currentProfile.type === 'department' && renderDepartmentProfile(currentProfile.data as Department)}
      </div>
    </div>
  )
}

export default ProfilePage