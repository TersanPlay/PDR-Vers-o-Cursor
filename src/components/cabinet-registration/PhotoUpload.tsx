import React from 'react'
import { Upload, X } from 'lucide-react'
import { CabinetRegistrationData } from '@/types'

interface PhotoUploadProps {
  formData: CabinetRegistrationData
  isDragOver: boolean
  onFileChange: (file: File | null) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onOpenFileDialog: () => void
}

/**
 * Componente para upload de brasão ou foto do vereador
 */
export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  formData,
  isDragOver,
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onOpenFileDialog
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
        <Upload className="h-4 w-4 text-blue-600" />
        Brasão ou Foto do Vereador (Opcional)
      </h3>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {formData.councilMemberPhoto ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <img
                src={URL.createObjectURL(formData.councilMemberPhoto)}
                alt="Preview do brasão/foto"
                className="w-32 h-32 object-cover rounded-lg border shadow-sm"
              />
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <span className="truncate max-w-48">{formData.councilMemberPhoto.name}</span>
              <button
                type="button"
                onClick={() => onFileChange(null)}
                className="text-red-500 hover:text-red-700 p-1 rounded"
                title="Remover arquivo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={onOpenFileDialog}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Alterar arquivo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className={`h-12 w-12 mx-auto transition-colors ${
              isDragOver ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <div>
              <p className={`mb-2 transition-colors ${
                isDragOver ? 'text-blue-700 font-medium' : 'text-gray-600'
              }`}>
                {isDragOver ? 'Solte o arquivo aqui' : 'Clique para fazer upload ou arraste o arquivo aqui'}
              </p>
              <p className="text-sm text-gray-500">PNG, JPG, WebP até 5MB</p>
              <p className="text-xs text-gray-400 mt-1">Tamanho recomendado: 200x200px (formato quadrado)</p>
            </div>
            <button
              type="button"
              onClick={onOpenFileDialog}
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              Selecionar arquivo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}