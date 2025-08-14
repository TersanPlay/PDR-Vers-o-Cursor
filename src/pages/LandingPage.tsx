import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Users, BarChart3, Settings, CheckCircle, Star, Globe } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

/**
 * Landing Page Hero - Página inicial persuasiva e envolvente
 */
export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PDR Sistema</h1>
              <p className="text-sm text-gray-600">Plataforma de Gestão</p>
            </div>
          </div>
          <Link to="/login">
            <Button variant="outline" className="flex items-center gap-2">
              Fazer Login
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  <Star className="h-3 w-3 mr-1" />
                  Plataforma Completa de Gestão
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Gerencie seu
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Sistema </span>
                  com Eficiência
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Uma solução completa para gestão de pessoas, relatórios e configurações do sistema. 
                  Controle total com segurança e praticidade em uma única plataforma.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Gestão completa de usuários e permissões</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Relatórios detalhados e análises em tempo real</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Interface moderna e intuitiva</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Segurança avançada e controle de acesso</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                    Acessar Sistema
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/cadastro">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-3 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                    Criar Conta
                    <Users className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-3 text-lg">
                  Saiba Mais
                  <Globe className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                {/* Mock Dashboard */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Dashboard</h3>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Usuários</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">1,234</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">Relatórios</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">89</p>
                    </div>
                  </div>

                  {/* Mock Chart */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Atividade Recente</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-3/4 bg-blue-200 rounded-full h-2"></div>
                        <span className="text-xs text-gray-600">85%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="w-2/3 bg-purple-200 rounded-full h-2"></div>
                        <span className="text-xs text-gray-600">67%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="w-1/2 bg-green-200 rounded-full h-2"></div>
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
      <footer className="relative z-10 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
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