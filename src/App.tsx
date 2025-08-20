import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { MaintenanceProvider, useMaintenance } from './contexts/MaintenanceContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { Toaster } from './components/ui/toaster'
import MaintenanceBanner from './components/MaintenanceBanner'
import MaintenanceBlock from './components/MaintenanceBlock'
import MaintenanceNotification from './components/MaintenanceNotification'
import './App.css'

// Lazy loading das páginas
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })))
const LandingPage = React.lazy(() => import('./pages/LandingPage'))
const CabinetRegistrationPage = React.lazy(() => import('./pages/CabinetRegistrationPage'))
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'))
const PersonFormPage = React.lazy(() => import('./pages/PersonFormPage'))
const PersonSearchPage = React.lazy(() => import('./pages/PersonSearchPage'))
const PersonProfilePage = React.lazy(() => import('./pages/PersonProfilePage'))
const ReportsPage = React.lazy(() => import('./pages/ReportsPage'))
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'))
const InteractionsPage = React.lazy(() => import('./pages/InteractionsPage'))
const CabinetManagementPage = React.lazy(() => import('./pages/CabinetManagementPage'))
const TaskManagementPage = React.lazy(() => import('./pages/TaskManagementPage'))

// Componente de loading
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
)

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
          
          <Suspense fallback={<PageLoader />}>
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
              <ProtectedRoute requiredRoles={['admin', 'chefe_gabinete', 'assessor']}>
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
              <ProtectedRoute requiredRoles={['admin', 'chefe_gabinete', 'assessor']}>
                <Layout>
                  <InteractionsPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/relatorios" element={
              <ProtectedRoute requiredRoles={['admin', 'chefe_gabinete', 'assessor']}>
                <Layout>
                  <ReportsPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/gabinetes" element={
              <ProtectedRoute requiredRoles={['admin', 'chefe_gabinete']}>
                <Layout>
                  <CabinetManagementPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/tarefas" element={
              <ProtectedRoute requiredRoles={['admin', 'chefe_gabinete', 'assessor']}>
                <Layout>
                  <TaskManagementPage />
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
          </Suspense>
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