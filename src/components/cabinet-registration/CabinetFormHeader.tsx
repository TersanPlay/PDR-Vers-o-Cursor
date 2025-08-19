import React from 'react'
import { Building2 } from 'lucide-react'

/**
 * Componente do cabeçalho do formulário de cadastro de gabinete
 */
export const CabinetFormHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-t-2xl">
      <div className="flex items-center gap-3 mb-4">
        <Building2 className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Cadastro de Gabinete</h1>
      </div>
      <p className="text-blue-100 text-lg">
        Registre seu gabinete no sistema e comece a gerenciar seus contatos e interações
      </p>
    </div>
  )
}