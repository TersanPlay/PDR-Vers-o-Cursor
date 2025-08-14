// Tipos de usuário e autenticação
export type UserRole = 'admin' | 'chefe_gabinete' | 'assessor' | 'visualizador'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  cabinetId?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

// Tipos para pessoa
export type RelationshipType = 
  | 'eleitor' 
  | 'parceiro' 
  | 'representante'
  | 'colaborador_assessor'
  | 'fornecedor_prestador'
  | 'voluntario'
  | 'candidato'
  | 'outros'

export interface Address {
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export interface Person {
  id: string
  name: string
  cpf: string
  rg?: string
  birthDate: Date
  email?: string
  phone?: string
  whatsapp?: string
  address?: Address
  relationshipType: RelationshipType
  notes?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
  deletedAt?: Date
  interactions?: Interaction[]
}

// Tipos para interações
export type InteractionType = 
  | 'atendimento'
  | 'ligacao'
  | 'email'
  | 'whatsapp'
  | 'visita'
  | 'evento'
  | 'reuniao'
  | 'outro'

export type InteractionStatus = 
  | 'pendente'
  | 'em_andamento'
  | 'concluido'
  | 'cancelado'

export interface Interaction {
  id: string
  personId: string
  type: InteractionType
  title: string
  description: string
  status: InteractionStatus
  scheduledDate?: Date
  completedDate?: Date
  responsibleUserId: string
  createdAt: Date
  updatedAt: Date
}

// Tipos para relatórios
export interface ReportFilter {
  startDate?: string
  endDate?: string
  relationshipType?: RelationshipType
  neighborhood?: string
  city?: string
  state?: string
  ageMin?: number
  ageMax?: number
  responsibleUserId?: string
}

export interface DashboardMetrics {
  totalPeople: number
  newPeopleThisMonth: number
  totalInteractions: number
  pendingInteractions: number
  peopleByRelationshipType: Record<RelationshipType, number>
  interactionsByType: Record<InteractionType, number>
  peopleByNeighborhood: Record<string, number>
}

// Tipos para auditoria (LGPD)
export type AuditAction = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'export'
  | 'login'
  | 'logout'

export interface AuditLog {
  id: string
  userId: string
  action: AuditAction
  resourceType: 'person' | 'interaction' | 'user' | 'report'
  resourceId?: string
  details?: string
  ipAddress: string
  userAgent: string
  createdAt: Date
}

// Tipos para formulários
export interface PersonFormData {
  name: string
  cpf: string
  rg?: string
  birthDate: string
  email?: string
  phone?: string
  whatsapp?: string
  relationshipType: RelationshipType
  notes?: string
  address?: {
    cep: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
  }
}

export interface InteractionFormData {
  type: InteractionType
  title: string
  description: string
  status: InteractionStatus
  scheduledDate?: string
}

// Tipos para busca
export interface SearchFilters {
  name?: string
  cpf?: string
  phone?: string
  email?: string
  relationshipType?: RelationshipType
  neighborhood?: string
  city?: string
  state?: string
  dateRange?: {
    start: Date
    end: Date
  }
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface SearchResult {
  people: Person[]
  total: number
  page: number
  limit: number
}

// Tipos para gabinete
export interface Cabinet {
  id: string
  name: string
  councilMemberName: string
  municipality: string
  city: string
  address?: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    zipCode: string
  }
  institutionalPhone?: string
  institutionalEmail?: string
  website?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    tiktok?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface CabinetRegistrationData {
  // Dados do gabinete
  cabinetName: string
  councilMemberName: string
  municipality: string
  city: string
  address?: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    zipCode: string
  }
  institutionalPhone?: string
  institutionalEmail?: string
  website?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    tiktok?: string
  }
  // Dados do usuário administrador
  adminName: string
  adminEmail: string
  adminPhone?: string
  password: string
  confirmPassword: string
}