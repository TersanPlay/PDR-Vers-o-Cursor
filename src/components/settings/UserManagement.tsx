import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Badge } from '../ui/badge'
import {
  Users,
  Plus,
  Edit,
  Trash2,
  UserIcon,
  Mail,
  Crown,
  UserCheck,
  UserCog,
  X
} from 'lucide-react'
import { User, UserRole } from '../../types'
import { useToast } from '../ui/use-toast'


interface UserFormData {
  name: string
  email: string
  role: UserRole
  password?: string
}

interface UserManagementProps {
  users: User[]
  onUsersChange: (users: User[]) => void
  isLoading: boolean
  onLoadingChange: (loading: boolean) => void
}

/**
 * Componente para gerenciamento de usuários
 */
export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onUsersChange,
  isLoading,
  onLoadingChange
}) => {
  const { toast } = useToast()
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userForm, setUserForm] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'visualizador'
  })

  const getRoleLabel = (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
      admin: 'Administrador',
      assessor: 'Assessor',
      visualizador: 'Visualizador',
      chefe_gabinete: 'Chefe de Gabinete'
    }
    return labels[role]
  }

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'default'
      case 'chefe_gabinete':
        return 'destructive'
      case 'assessor':
        return 'secondary'
      case 'visualizador':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3" />
      case 'chefe_gabinete':
        return <UserIcon className="h-3 w-3" />
      case 'assessor':
        return <UserCog className="h-3 w-3" />
      case 'visualizador':
        return <UserCheck className="h-3 w-3" />
      default:
        return <UserIcon className="h-3 w-3" />
    }
  }

  const handleSaveUser = async () => {
    if (!userForm.name || !userForm.email) {
      toast.error('Nome e email são obrigatórios.')
      return
    }

    onLoadingChange(true)
    try {
      if (editingUser) {
        // Atualizar usuário existente
        const updatedUsers = users.map(user => 
          user.id === editingUser.id 
            ? { ...user, name: userForm.name, email: userForm.email, role: userForm.role }
            : user
        )
        onUsersChange(updatedUsers)
        toast.success('Usuário atualizado com sucesso.')
      } else {
        // Criar novo usuário
        const newUser: User = {
          id: Date.now().toString(),
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        onUsersChange([...users, newUser])
        toast.success('Usuário criado com sucesso.')
      }
      
      setIsUserDialogOpen(false)
      setEditingUser(null)
      setUserForm({ name: '', email: '', role: 'visualizador' })
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
      toast.error('Não foi possível salvar o usuário.')
    } finally {
      onLoadingChange(false)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role
    })
    setIsUserDialogOpen(true)
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return
    }

    onLoadingChange(true)
    try {
      const updatedUsers = users.filter(user => user.id !== userId)
      onUsersChange(updatedUsers)
      toast.success('Usuário excluído com sucesso.')
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
      toast.error('Não foi possível excluir o usuário.')
    } finally {
      onLoadingChange(false)
    }
  }

  const handleCloseDialog = () => {
    setIsUserDialogOpen(false)
    setEditingUser(null)
    setUserForm({ name: '', email: '', role: 'visualizador' })
  }

  return (
    <Card className="border-l-4 border-l-blue-500 shadow-sm">
      <CardHeader className="bg-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Users className="h-5 w-5 text-blue-500" />
              Gerenciamento de Usuários
              <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-700 border-blue-300">
                {users.length} usuários
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Gerencie os usuários do sistema e suas permissões
            </CardDescription>
          </div>
          <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {editingUser ? (
                    <>
                      <Edit className="h-5 w-5" />
                      Editar Usuário
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Novo Usuário
                    </>
                  )}
                </DialogTitle>
                <DialogDescription>
                  {editingUser 
                    ? 'Edite as informações do usuário selecionado.'
                    : 'Preencha as informações para criar um novo usuário.'
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="userName">Nome</Label>
                  <Input
                    id="userName"
                    value={userForm.name}
                    onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="userEmail">Email</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="userRole">Função</Label>
                  <Select
                    value={userForm.role}
                    onValueChange={(value: UserRole) => setUserForm(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4" />
                          Administrador
                        </div>
                      </SelectItem>
                      <SelectItem value="chefe_gabinete">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4" />
                          Chefe de Gabinete
                        </div>
                      </SelectItem>
                      <SelectItem value="assessor">
                        <div className="flex items-center gap-2">
                          <UserCog className="h-4 w-4" />
                          Assessor
                        </div>
                      </SelectItem>
                      <SelectItem value="visualizador">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          Visualizador
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {!editingUser && (
                  <div>
                    <Label htmlFor="userPassword">Senha Temporária</Label>
                    <Input
                      id="userPassword"
                      type="password"
                      value={userForm.password || ''}
                      onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Senha temporária (opcional)"
                    />
                  </div>
                )}
              </div>
              <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={handleCloseDialog}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSaveUser} disabled={isLoading}>
                  {isLoading ? 'Salvando...' : editingUser ? 'Atualizar' : 'Criar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Usuário</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Função</TableHead>
                <TableHead className="font-semibold">Último Login</TableHead>
                <TableHead className="text-right font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit">
                      {getRoleIcon(user.role)}
                      {getRoleLabel(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {'Nunca'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.role === 'admin'}
                        className={user.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>Nenhum usuário cadastrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UserManagement