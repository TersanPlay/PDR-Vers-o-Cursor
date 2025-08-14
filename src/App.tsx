import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { MaintenanceProvider, useMaintenance } from './contexts/MaintenanceContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
import CabinetRegistrationPage from './pages/CabinetRegistrationPage'
import DashboardPage from './pages/DashboardPage'
import PersonFormPage from './pages/PersonFormPage'
import PersonSearchPage from './pages/PersonSearchPage'
import PersonProfilePage from './pages/PersonProfilePage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import InteractionsPage from './pages/InteractionsPage'
import { Layout } from './components/Layout'
import { Toaster } from './components/ui/toaster'
import MaintenanceBanner from './components/MaintenanceBanner'
import MaintenanceBlock from './components/MaintenanceBlock'
import MaintenanceNotification from './components/MaintenanceNotification'

// Componente interno que usa o contexto de manutenção
function AppContent() {
  const { isMaintenanceMode, isSystemBlocked } = useMaintenance()

  return (
    <Router>
        <div className="min-h-screen bg-background">
          {/* Banner de manutenção */}
          <MaintenanceBanner isVisible={isMaintenanceMode} />
          
          {/* Notificação de manutenção */}
          <MaintenanceNotification />
          
          {/* Bloqueio do sistema durante manutenção */}
          <MaintenanceBlock isBlocked={isSystemBlocked} />
          
          <Routes>
            {/* Rota pública da landing page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Rota pública de login */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rota pública de cadastro de gabinete */}
            <Route path="/cadastro" element={<CabinetRegistrationPage />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/pessoa/novo" element={
              <ProtectedRoute requiredRoles={['admin', 'assessor']}>
                <Layout>
                  <PersonFormPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/busca" element={
              <ProtectedRoute>
                <Layout>
                  <PersonSearchPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/pessoa/:id" element={
              <ProtectedRoute>
                <Layout>
                  <PersonProfilePage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/interacoes" element={
              <ProtectedRoute requiredRoles={['admin', 'assessor']}>
                <Layout>
                  <InteractionsPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/relatorios" element={
              <ProtectedRoute requiredRoles={['admin', 'assessor']}>
                <Layout>
                  <ReportsPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/configuracoes" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <Layout>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster />
        </div>
      </Router>
  )
}

// Componente principal que fornece os contextos
function App() {
  return (
    <AuthProvider>
      <MaintenanceProvider>
        <AppContent />
      </MaintenanceProvider>
    </AuthProvider>
  )
}

export default App