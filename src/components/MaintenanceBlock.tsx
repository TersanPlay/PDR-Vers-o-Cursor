import React from 'react'
import { Settings, Clock, Shield } from 'lucide-react'

interface MaintenanceBlockProps {
  isBlocked: boolean
}

/**
 * Componente que bloqueia o acesso às funcionalidades durante a manutenção
 * Exibe uma tela de bloqueio amigável para usuários não administradores
 */
const MaintenanceBlock: React.FC<MaintenanceBlockProps> = ({ isBlocked }) => {
  if (!isBlocked) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 text-center">
        {/* Ícone animado */}
        <div className="mb-6">
          <div className="relative mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Settings className="h-10 w-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Sistema em Manutenção
        </h2>

        {/* Descrição */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Estamos realizando melhorias importantes no sistema. 
          Durante este período, algumas funcionalidades estão temporariamente indisponíveis.
        </p>

        {/* Informações adicionais */}
        <div className="space-y-3 text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Tempo estimado: Em breve</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Seus dados estão seguros</span>
          </div>
        </div>

        {/* Mensagem de agradecimento */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm font-medium">
            Obrigado pela sua paciência! 🙏
          </p>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceBlock