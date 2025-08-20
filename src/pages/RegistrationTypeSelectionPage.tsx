import React from 'react'
import { Link } from 'react-router-dom'
import { Building2, Users } from 'lucide-react'

const RegistrationTypeSelectionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Escolha o Tipo de Cadastro
          </h1>
          <p className="text-gray-600">
            Selecione o tipo de cadastro que deseja realizar
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Cadastro de Gabinete */}
          <Link
            to="/cadastro?tipo=gabinete"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-blue-300"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Cadastro de Gabinete
              </h2>
              <p className="text-gray-600 mb-4">
                Cadastre um gabinete de vereador com todas as informações institucionais
              </p>
              <div className="text-sm text-gray-500">
                <ul className="space-y-1">
                  <li>• Dados do gabinete e vereador</li>
                  <li>• Informações de contato institucional</li>
                  <li>• Endereço e localização</li>
                  <li>• Redes sociais e website</li>
                </ul>
              </div>
            </div>
          </Link>

          {/* Cadastro de Departamento */}
          <Link
            to="/cadastro?tipo=departamento"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-green-300"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Cadastro de Departamento
              </h2>
              <p className="text-gray-600 mb-4">
                Cadastre um departamento ou setor com informações organizacionais
              </p>
              <div className="text-sm text-gray-500">
                <ul className="space-y-1">
                  <li>• Dados do departamento</li>
                  <li>• Área de atuação e responsável</li>
                  <li>• Órgão/setor vinculado</li>
                  <li>• Localização física</li>
                </ul>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegistrationTypeSelectionPage