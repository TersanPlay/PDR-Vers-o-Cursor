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
  // Funções de permissão existentes
  hasRole?: (role: UserRole) => boolean
  hasAnyRole?: (roles: UserRole[]) => boolean
  canCreate?: () => boolean
  canEdit?: () => boolean
  canDelete?: () => boolean
  canExport?: () => boolean
  canViewReports?: () => boolean
  canViewAuditLogs?: () => boolean
  canManageUsers?: () => boolean
  canAccessMaintenance?: () => boolean
  canManageBackup?: () => boolean
  canCreateUserRole?: (targetRole: UserRole) => boolean
  canEditUserRole?: (targetRole: UserRole) => boolean
  canDeleteUserRole?: (targetRole: UserRole) => boolean
  // Novas funções para gerenciamento de credenciais
  canManageCredentials?: () => boolean
  canViewCredentials?: (cabinetId?: string) => boolean
  canEditCredentials?: (cabinetId?: string) => boolean
  canViewCredentialsAudit?: () => boolean
}

// Tipos para pessoa
export type RelationshipType = 
  | 'cidadao_civil' 
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
  | 'em_progresso'
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
  priority?: InteractionPriority
  scheduledDate?: Date
  completedDate?: Date
  responsibleUserId: string
  createdAt: Date
  updatedAt: Date
  // Campos específicos para eventos
  eventLocation?: string
  eventStartTime?: string
  eventEndTime?: string
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

// Tipos para gabinetes
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
  adminName: string
  adminEmail: string
  status: 'ativo' | 'pendente' | 'inativo'
  registrationDate: Date
  createdAt: Date
  updatedAt: Date
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
  | 'credentials_update'
  | 'password_change'
  | 'username_change'
  | 'credentials_change_error'
  | 'credentials_change_success'
  | 'credentials_change_attempt'

export interface AuditLog {
  id: string
  userId: string
  action: AuditAction
  resourceType: 'person' | 'interaction' | 'user' | 'report' | 'cabinet' | 'credentials'
  resourceId?: string
  details?: string
  ipAddress: string
  userAgent: string
  createdAt: Date
}

// Tipos para formulários
export interface PersonFormData {
  name: string
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

export type InteractionPriority = 
  | 'baixa'
  | 'normal'
  | 'media'
  | 'alta'

export interface InteractionFormData {
  type: InteractionType
  title: string
  description: string
  status: InteractionStatus
  scheduledDate?: string
  priority: InteractionPriority
  notes?: string
  // Campos para eventos
  eventLocation?: string
  eventStartTime?: string
  eventEndTime?: string
  eventScheduledBy?: string
}

// Tipos para busca
export interface SearchFilters {
  name?: string
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
  // Upload de brasão ou foto do vereador
  councilMemberPhoto?: File | null
  // Dados do usuário administrador
  adminName: string
  adminEmail: string
  adminPhone?: string
  password: string
  confirmPassword: string
}

// Tipos para gerenciamento de credenciais de gabinete
export interface CabinetCredentials {
  id: string
  cabinetId: string
  username: string
  email: string
  lastPasswordChange: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CabinetCredentialsUpdateData {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export interface CredentialsAuditLog {
  id: string
  cabinetId: string
  cabinetName: string
  action: 'username_change' | 'email_change' | 'password_change' | 'credentials_view'
  oldValue?: string
  newValue?: string
  performedBy: string
  performedByName: string
  performedByRole: UserRole
  timestamp: Date
  ipAddress?: string
}

export interface PasswordValidationRules {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  forbiddenPatterns: string[]
}

export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
}

// Tipos para atividades/tarefas
export type ActivityType = 
  | 'sessao_plenaria'
  | 'reuniao_comissao'
  | 'audiencia_publica'
  | 'outra_atividade'
  | 'sessao_solene'
  | 'reuniao_liderancas'
  | 'visita_tecnica'
  | 'coletiva_imprensa'
  | 'encontro_comunidade'
  | 'seminario'
  | 'conferencia'
  | 'palestra'
  | 'cerimonia_oficial'
  | 'evento_cultural'
  | 'evento_esportivo'
  | 'capacitacao_treinamento'
  | 'reuniao_interna'
  | 'viagem_oficial'
  | 'entrevista'
  | 'reuniao_virtual'

export interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "high" | "medium" | "low"
  assignee: string
  assigneeAvatar?: string
  dueDate: Date | string
  date: Date | string
  time: string
  location: string
  participants: string
  category: string
  comments?: number
  attachments?: number
  team?: string[]
  tags?: string[]
  // Propriedades adicionais para compatibilidade com TaskCard
  activityType?: ActivityType
  assignedTo?: string
}

export interface TaskFormData {
  id?: string
  title: string
  description?: string
  activityType: ActivityType
  date: Date
  time: string
  location: string
  status: 'pending' | 'in_progress' | 'completed'
  participants: string
  objectives: string
  observations?: string
  priority: 'low' | 'medium' | 'high'
  assignedTo?: string
  dueDate?: Date
  tags?: string[]
}