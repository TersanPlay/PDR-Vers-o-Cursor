import React from 'react'
import { Link } from 'react-router-dom'

interface FormActionsProps {
  isLoading: boolean
}

/**
 * Componente para os botões de ação do formulário
 */
export const FormActions: React.FC<FormActionsProps> = ({ isLoading }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
      <button
        type="submit"
        disabled={isLoading}
        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? 'Cadastrando...' : 'Cadastrar Gabinete'}
      </button>
      
      <Link
        to="/login"
        className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-center"
      >
        Já tenho conta
      </Link>
    </div>
  )
}