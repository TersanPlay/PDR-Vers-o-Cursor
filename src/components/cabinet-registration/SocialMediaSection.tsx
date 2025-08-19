import React from 'react'
import { Globe, Facebook, Instagram, Music } from 'lucide-react'
import { CabinetRegistrationData } from '@/types'

interface SocialMediaSectionProps {
  formData: CabinetRegistrationData
  onInputChange: (field: string, value: string) => void
}

/**
 * Componente para a seção de website e redes sociais
 */
export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700">Website e Redes Sociais (Opcional)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-600" />
            Website
          </label>
          <input
            type="url"
            value={formData.website || ''}
            onChange={(e) => onInputChange('website', e.target.value)}
            placeholder="https://www.gabinete.gov.br"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Facebook className="h-4 w-4 text-blue-600" />
            Facebook
          </label>
          <input
            type="url"
            value={formData.socialMedia?.facebook || ''}
            onChange={(e) => onInputChange('socialMedia.facebook', e.target.value)}
            placeholder="https://facebook.com/gabinete"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Instagram className="h-4 w-4 text-blue-600" />
            Instagram
          </label>
          <input
            type="url"
            value={formData.socialMedia?.instagram || ''}
            onChange={(e) => onInputChange('socialMedia.instagram', e.target.value)}
            placeholder="https://instagram.com/gabinete"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Music className="h-4 w-4 text-blue-600" />
            TikTok
          </label>
          <input
            type="url"
            value={formData.socialMedia?.tiktok || ''}
            onChange={(e) => onInputChange('socialMedia.tiktok', e.target.value)}
            placeholder="https://tiktok.com/@gabinete"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}