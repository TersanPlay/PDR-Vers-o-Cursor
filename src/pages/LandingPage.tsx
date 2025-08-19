import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Users, BarChart3, Settings, CheckCircle, Star, Globe } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

/**
 * Landing Page Hero - Pagina inicial persuasiva e envolvente
 */
export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient - same as LoginPage */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
      
      {/* Animated background elements - same as LoginPage */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-300/10 to-pink-300/10 rounded-full blur-2xl animate-bounce delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-cyan-300/10 to-blue-300/10 rounded-full blur-xl animate-bounce delay-700"></div>
      </div>
      
      {/* Geometric pattern overlay - same as LoginPage */}
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
      
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PDR Sistema</h1>
              <p className="text-sm text-gray-600">Plataforma de Gestao</p>
            </div>
          </div>
          <Link to="/login">
            <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 backdrop-blur-sm">
              Fazer Login
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200 backdrop-blur-sm">
                  <Star className="h-3 w-3 mr-1" />
                  Plataforma Completa de Gestao
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Gerencie seu
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Sistema </span>
                  com Eficiencia
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Uma solucao completa para gestao de pessoas, relatorios e configuracoes do sistema. 
                  Controle total com seguranca e praticidade em uma unica plataforma.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Gestao completa de usuarios e permissoes</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Relatorios detalhados e analises em tempo real</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Interface moderna e intuitiva</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Seguranca avancada e controle de acesso</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    Acessar Sistema
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/cadastro">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-3 text-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 backdrop-blur-sm">
                    Criar Conta
                    <Users className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-3 text-lg border-2 border-purple-500 text-purple-600 hover:bg-purple-50 hover:text-purple-700 backdrop-blur-sm">
                  Saiba Mais
                  <Globe className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/50">
                {/* Mock Dashboard */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Dashboard</h3>
                    <Badge className="bg-green-100 text-green-700 border border-green-200">Online</Badge>
                  </div>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Usuarios</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-800">1,234</p>
                    </div>
                    <div className="bg-purple-50 backdrop-blur-sm rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">Relatorios</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-800">89</p>
                    </div>
                  </div>

                  {/* Mock Chart */}
                  <div className="bg-gray-50 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Atividade Recente</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-3/4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-2"></div>
                        <span className="text-xs text-gray-600">85%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="w-2/3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full h-2"></div>
                        <span className="text-xs text-gray-600">67%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="w-1/2 bg-gradient-to-r from-green-500 to-green-600 rounded-full h-2"></div>
                        <span className="text-xs text-gray-600">52%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Settings className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="h-4 w-4 text-white drop-shadow-sm" />
              </div>
              <span className="text-gray-600">© 2024 PDR Sistema. Todos os direitos reservados.</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Fazer Login
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Suporte</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage