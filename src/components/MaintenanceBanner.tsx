import React from 'react'
import { AlertTriangle } from 'lucide-react'

interface MaintenanceBannerProps {
  isVisible: boolean
}

/**
 * Banner de modo de manutenção que aparece no topo da aplicação
 * Exibe uma mensagem animada quando o sistema está em manutenção
 */
const MaintenanceBanner: React.FC<MaintenanceBannerProps> = ({ isVisible }) => {
  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 text-white py-3 px-4 relative overflow-hidden">
      {/* Animação de fundo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      
      {/* Conteúdo da mensagem */}
      <div className="relative flex items-center justify-center space-x-3">
        <AlertTriangle className="h-5 w-5 animate-bounce" />
        <div className="text-center">
          <p className="font-semibold text-sm md:text-base">
            🔧 Sistema em Manutenção
          </p>
          <p className="text-xs md:text-sm opacity-90">
            Estamos realizando melhorias no sistema. Algumas funcionalidades podem estar temporariamente indisponíveis.
          </p>
        </div>
        <AlertTriangle className="h-5 w-5 animate-bounce" style={{ animationDelay: '0.5s' }} />
      </div>
      
      {/* Efeito de movimento */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="animate-slide-right bg-gradient-to-r from-transparent via-white/5 to-transparent h-full w-1/3"></div>
      </div>
    </div>
  )
}

export default MaintenanceBanner