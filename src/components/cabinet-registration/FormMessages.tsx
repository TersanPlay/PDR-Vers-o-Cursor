import React from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface FormMessagesProps {
  error: string
  success: string
}

/**
 * Componente para exibir mensagens de erro e sucesso no formulário
 */
export const FormMessages: React.FC<FormMessagesProps> = ({ error, success }) => {
  return (
    <>
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircle className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}
    </>
  )
}