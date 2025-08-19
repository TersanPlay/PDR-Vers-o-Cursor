import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { FileText, Eye, EyeOff, AlertCircle } from 'lucide-react'

/**
 * Página de login do sistema
 */
export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Rota para redirecionar após login
  const from = (location.state as any)?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  const demoCredentials = [
    {
      role: 'Administrador',
      email: 'admin@gabinete.gov.br',
      password: 'admin123',
      description: 'Acesso completo ao sistema'
    },
    {
      role: 'Chefe de Gabinete',
      email: 'chefe@gabinete.gov.br',
      password: 'chefe123',
      description: 'Gerencia credenciais do próprio gabinete'
    },
    {
      role: 'Assessor',
      email: 'assessor@gabinete.gov.br',
      password: 'assessor123',
      description: 'Pode criar e editar cadastros'
    },
    {
      role: 'Visualizador',
      email: 'visualizador@gabinete.gov.br',
      password: 'visualizador123',
      description: 'Apenas visualização'
    }
  ]

  const fillCredentials = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background with gradient and geometric shapes */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-300/10 to-pink-300/10 rounded-full blur-2xl animate-bounce delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-cyan-300/10 to-blue-300/10 rounded-full blur-xl animate-bounce delay-700"></div>
      </div>
      
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-gray-900" />
        </svg>
      </div>
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Main login card with backdrop blur */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
        {/* Header */}
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Gabinete Digital
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de Cadastro de Pessoas
          </p>
        </div>

        {/* Formulário de Login */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Digite seu email"
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Erro no login
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botão de Login */}
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </div>

          {/* Link para Cadastro */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link
                to="/cadastro"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Cadastre seu gabinete
              </Link>
            </p>
          </div>
        </form>

        {/* Credenciais de Demonstração */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Credenciais de demonstração</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {demoCredentials.map((cred, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => fillCredentials(cred.email, cred.password)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{cred.role}</h4>
                    <p className="text-xs text-gray-500">{cred.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">{cred.email}</p>
                    <p className="text-xs text-gray-400">{cred.password}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-center text-gray-500">
            Clique em qualquer credencial acima para preencher automaticamente
          </p>
        </div>

        {/* Informações de Segurança */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Sistema em Conformidade com LGPD
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Este sistema segue as diretrizes da Lei Geral de Proteção de Dados (LGPD) 
                  para garantir a segurança e privacidade das informações pessoais.
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}