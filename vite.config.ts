import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Sistema de Cadastro - Gabinete do Vereador',
        short_name: 'PDR Gabinete',
        description: 'Sistema para cadastro e gerenciamento de pessoas do gabinete',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          'utils-vendor': ['date-fns', 'lucide-react', 'sonner'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers'],
          // App chunks
          'pages': [
            './src/pages/PersonSearchPage',
            './src/pages/PersonFormPage',
            './src/pages/PersonProfilePage'
          ],
          'cabinet-management': ['./src/pages/CabinetManagementPage'],
          'task-management': ['./src/pages/TaskManagementPage'],
          'reports': ['./src/pages/ReportsPage'],
          'interactions': ['./src/pages/InteractionsPage'],
          'settings': ['./src/pages/SettingsPage']
        }
      }
    }
  }
})