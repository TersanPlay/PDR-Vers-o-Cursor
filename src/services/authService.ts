import { User, Cabinet, CabinetRegistrationData } from '../types'

/**
 * Serviço de autenticação
 * Em produção, deve se comunicar com uma API real
 */
class AuthService {
  private readonly _API_BASE_URL = '/api/auth'

  /**
   * Realiza login do usuário
   * @param email Email do usuário
   * @param password Senha do usuário
   * @returns Dados do usuário e token
   */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      // Simulação de API - em produção, fazer requisição real
      const response = await this.mockLogin(email, password)
      return response
    } catch (error) {
      console.error('Erro no login:', error)
      throw new Error('Credenciais inválidas')
    }
  }

  /**
   * Valida token de autenticação
   * @param token Token para validar
   * @returns Dados do usuário
   */
  async validateToken(token: string): Promise<User> {
    try {
      // Simulação de API - em produção, fazer requisição real
      const user = await this.mockValidateToken(token)
      return user
    } catch (error) {
      console.error('Erro ao validar token:', error)
      throw new Error('Token inválido')
    }
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<void> {
    try {
      // Em produção, invalidar token no servidor
      localStorage.removeItem('auth_token')
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  /**
   * Atualiza senha do usuário
   * @param currentPassword Senha atual
   * @param newPassword Nova senha
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Simulação de API - em produção, fazer requisição real
      await this.mockChangePassword(currentPassword, newPassword)
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      throw new Error('Erro ao alterar senha')
    }
  }

  /**
   * Registra um novo gabinete com usuário chefe
   * @param registrationData Dados do gabinete e usuário
   */
  async registerCabinet(registrationData: CabinetRegistrationData): Promise<{ success: boolean; message: string }> {
    try {
      // Simulação de API - em produção, fazer requisição real
      return await this.mockRegisterCabinet(registrationData)
    } catch (error) {
      console.error('Erro no cadastro do gabinete:', error)
      throw new Error('Erro ao cadastrar gabinete')
    }
  }

  // Métodos de simulação - remover em produção
  private async mockLogin(email: string, password: string): Promise<{ user: User; token: string }> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Usuários de exemplo
    const mockUsers = [
      {
        id: '1',
        name: 'Administrador',
        email: 'admin@gabinete.gov.br',
        role: 'admin' as const,
        password: 'admin123',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'João Assessor',
        email: 'assessor@gabinete.gov.br',
        role: 'assessor' as const,
        password: 'assessor123',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Maria Visualizadora',
        email: 'visualizador@gabinete.gov.br',
        role: 'visualizador' as const,
        password: 'visualizador123',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }
    ]

    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Credenciais inválidas')
    }

    const { password: _, ...userWithoutPassword } = user
    const token = `mock-token-${user.id}-${Date.now()}`

    return {
      user: userWithoutPassword,
      token
    }
  }

  private async mockValidateToken(token: string): Promise<User> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 500))

    // Extrai ID do usuário do token mock
    const tokenParts = token.split('-')
    if (tokenParts.length < 3 || tokenParts[0] !== 'mock' || tokenParts[1] !== 'token') {
      throw new Error('Token inválido')
    }

    const userId = tokenParts[2]
    
    // Usuários de exemplo (mesmo do mockLogin)
    const mockUsers = [
      {
        id: '1',
        name: 'Administrador',
        email: 'admin@gabinete.gov.br',
        role: 'admin' as const,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'João Assessor',
        email: 'assessor@gabinete.gov.br',
        role: 'assessor' as const,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Maria Visualizadora',
        email: 'visualizador@gabinete.gov.br',
        role: 'visualizador' as const,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }
    ]

    const user = mockUsers.find(u => u.id === userId)
    
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    return user
  }

  private async mockChangePassword(currentPassword: string, newPassword: string): Promise<void> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 800))

    // Validação simples - em produção, validar com hash real
    if (currentPassword !== 'senha123') {
      throw new Error('Senha atual incorreta')
    }

    if (newPassword.length < 6) {
      throw new Error('Nova senha deve ter pelo menos 6 caracteres')
    }

    // Simula sucesso na alteração
    console.log('Senha alterada com sucesso')
  }

  private async mockRegisterCabinet(registrationData: CabinetRegistrationData): Promise<{ success: boolean; message: string }> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Validações básicas
    if (!registrationData.cabinetName.trim()) {
      throw new Error('Nome do gabinete é obrigatório')
    }

    if (!registrationData.councilMemberName.trim()) {
      throw new Error('Nome do vereador é obrigatório')
    }

    if (!registrationData.municipality.trim()) {
      throw new Error('Município é obrigatório')
    }

    if (!registrationData.city.trim()) {
      throw new Error('Cidade é obrigatória')
    }

    if (!registrationData.adminName.trim()) {
      throw new Error('Nome do administrador é obrigatório')
    }

    if (!registrationData.adminEmail.trim()) {
      throw new Error('E-mail do administrador é obrigatório')
    }

    // Validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(registrationData.adminEmail)) {
      throw new Error('E-mail inválido')
    }

    // Validação de senha
    if (registrationData.password.length < 8) {
      throw new Error('Senha deve ter pelo menos 8 caracteres')
    }

    if (registrationData.password !== registrationData.confirmPassword) {
      throw new Error('Senhas não coincidem')
    }

    // Verificar se e-mail já existe (simulação)
    const existingEmails = [
      'admin@gabinete.gov.br',
      'chefe@gabinete.gov.br',
      'assessor@gabinete.gov.br',
      'visualizador@gabinete.gov.br'
    ]

    if (existingEmails.includes(registrationData.adminEmail.toLowerCase())) {
      throw new Error('E-mail já cadastrado no sistema')
    }

    // Simular criação do gabinete e usuário
    const cabinetId = `cabinet_${Date.now()}`
    const userId = `user_${Date.now()}`

    // Em produção, aqui seria feita a inserção no banco de dados
    const newCabinet: Cabinet = {
      id: cabinetId,
      name: registrationData.cabinetName,
      councilMemberName: registrationData.councilMemberName,
      municipality: registrationData.municipality,
      city: registrationData.city,
      address: registrationData.address,
      institutionalPhone: registrationData.institutionalPhone,
      institutionalEmail: registrationData.institutionalEmail,
      website: registrationData.website,
      socialMedia: registrationData.socialMedia,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const newUser: User = {
      id: userId,
      name: registrationData.adminName,
      email: registrationData.adminEmail,
      role: 'chefe_gabinete',
      cabinetId: cabinetId,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Simular armazenamento (em produção, salvar no banco)
    console.log('Gabinete criado:', newCabinet)
    console.log('Usuário criado:', newUser)
    console.log('Senha criptografada:', this.hashPassword(registrationData.password))

    return {
      success: true,
      message: 'Gabinete cadastrado com sucesso! Você pode fazer login agora.'
    }
  }

  private hashPassword(password: string): string {
    // Simulação de hash - em produção usar bcrypt ou similar
    return `hashed_${password}_${Date.now()}`
  }
}

export const authService = new AuthService()