import React from 'react'
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ToastProvider } from './lib/ToastContext'
import { Layout } from './components/layout/Layout'
import { AuthGuard } from './components/auth/AuthGuard'
import { useAuth } from './hooks/useAuth'
import { DevRoleSwitcherFloating } from './components/dev/DevRoleSwitcherFloating'

// Specialized Portal Pages
import { DeveloperAuthPage } from './pages/DeveloperAuthPage'
import { DeveloperDashboardPage } from './pages/DeveloperDashboardPage'
import { GeneralAccessPortalPage } from './pages/GeneralAccessPortalPage'
import { PortalClientePage } from './pages/PortalClientePage'
import { GestionEmpleadosPage } from './pages/GestionEmpleadosPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'

// Workshop ERP Pages
import { InicioPage } from './pages/InicioPage'
import { DashboardPage } from './pages/DashboardPage'
import { ClientesPage } from './pages/ClientesPage'
import { VehiculosPage } from './pages/VehiculosPage'
import { SolicitudesPage } from './pages/SolicitudesPage'
import { PresupuestosPage } from './pages/PresupuestosPage'
import { ListadoPreciosPage } from './pages/ListadoPreciosPage'
import { CitasPage } from './pages/CitasPage'
import { ReparacionesPage } from './pages/ReparacionesPage'
import { ExpedientesPage } from './pages/ExpedientesPage'
import { FacturasPage } from './pages/FacturasPage'
import { BalancesPage } from './pages/BalancesPage'
import { ConfiguracionPage } from './pages/ConfiguracionPage'
import { MetisIAPage } from './pages/MetisIAPage'

/**
 * Root Entry Gate:
 * In case of no active session or initial development access,
 * prioritize and redirect to Login or Developer Portal Authentication.
 */
const RootEntryGate: React.FC = () => {
  const { perfil, rolActual } = useAuth()

  if (!perfil) {
    return <Navigate to="/login" replace />
  }

  // If logged in as client -> go to client portal
  if (rolActual === 'CLIENTE') {
    return <Navigate to="/cliente" replace />
  }

  // For Developer, Usuario or Autorizado -> render workshop dashboard
  return <InicioPage />
}

/**
 * RootDispatcher:
 * Differentiates between gestarian.com (Central Landing with 3 cards)
 * and gestarian2.web.app (Gestarian Pro ERP application).
 */
const RootDispatcher: React.FC = () => {
  const host = window.location.hostname.toLowerCase()
  const search = window.location.search
  const viewMode = sessionStorage.getItem('gestarian_view_mode')

  // In gestarian2.web.app (or gestarian2.firebaseapp.com) -> ALWAYS GESTARIAN PRO
  if (host.includes('gestarian2')) {
    return (
      <Layout>
        <RootEntryGate />
      </Layout>
    )
  }

  // In www.gestarian.com or gestarian.com -> ALWAYS CENTRAL LANDING PAGE
  if (host.includes('gestarian.com')) {
    return <LandingPage />
  }

  // In localhost or local network:
  // If user selected Pro or explicitly navigated to Pro mode -> Render Pro
  if (viewMode === 'pro' || search.includes('pro=true')) {
    return (
      <Layout>
        <RootEntryGate />
      </Layout>
    )
  }

  // Default on localhost: Central Landing Page
  return <LandingPage />
}

export default function App() {
  return (
    <ToastProvider>
      <HashRouter>
        <DevRoleSwitcherFloating />
        <Routes>
          {/* Root Path: Automatically dispatched based on host/mode */}
          <Route path="/" element={<RootDispatcher />} />

          {/* Central Landing Page with 3 cards (Lite, Pro, Enterprise) */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/planes" element={<LandingPage />} />

          {/* User & Client Authentication Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Public & Developer Direct Portals (No Workshop Layout) */}
          <Route path="/dev-auth" element={<DeveloperAuthPage />} />
          
          <Route 
            path="/dev" 
            element={
              <AuthGuard allowedRoles={['DESARROLLADOR']}>
                <DeveloperDashboardPage />
              </AuthGuard>
            } 
          />

          <Route path="/portal" element={<GeneralAccessPortalPage />} />

          <Route 
            path="/cliente" 
            element={
              <AuthGuard allowedRoles={['CLIENTE', 'DESARROLLADOR', 'USUARIO', 'AUTORIZADO']}>
                <PortalClientePage />
              </AuthGuard>
            } 
          />

          {/* Workshop ERP Application: Gestarian Pro (With Layout, Header, Sidebar & Simulation Banner) */}
          <Route element={<Layout />}>
            <Route path="/inicio" element={<RootEntryGate />} />

            <Route 
              path="/clientes" 
              element={
                <AuthGuard allowedRoles={['DESARROLLADOR', 'USUARIO', 'AUTORIZADO']} requiredPermission="clientes">
                  <ClientesPage />
                </AuthGuard>
              } 
            />

            <Route 
              path="/vehiculos" 
              element={
                <AuthGuard allowedRoles={['DESARROLLADOR', 'USUARIO', 'AUTORIZADO']} requiredPermission="vehiculos">
                  <VehiculosPage />
                </AuthGuard>
              } 
            />

            <Route 
              path="/solicitudes" 
              element={
                <AuthGuard allowedRoles={['DESARROLLADOR', 'USUARIO', 'AUTORIZADO']}>
                  <SolicitudesPage />
                </AuthGuard>
              } 
            />

            <Route 
              path="/presupuestos" 
              element={
                <AuthGuard allowedRoles={['DESARROLLADOR', 'USUARIO', 'AUTORIZADO']} requiredPermission="presupuestos_crear">
                  <PresupuestosPage />
                </AuthGuard>
              } 
            />

            <Route 
              path="/tarifas" 
              element={
                <AuthGuard allowedRoles={['DESARROLLADOR', 'USUARIO', 'AUTORIZADO']}>
                  <ListadoPreciosPage />
                </AuthGuard>
              } 
            />

            <Route 
              path="/expedientes" 
              element={
                <AuthGuard allowedRoles={['DESARROLLADOR', 'USUARIO', 'AUTORIZADO']} requiredPermission="expedientes">
                  <ExpedientesPage />
                </AuthGuard>
              } 
            />

            <Route 
              path="/citas" 
              element={
                <AuthGuard allowedRoles={['DESARROLLADOR', 'USUARIO', 'AUTORIZADO']} requiredPermission="citas">
                  <CitasPage />
                </AuthGuard>
              } 
            />

            <Route 
              path="/reparaciones" 
              element={
                <AuthGuard allowedRoles={['DESARROLLADOR', 'USUARIO', 'AUTORIZADO']} requiredPermission="reparaciones">
                  <ReparacionesPage />
                </AuthGuard>
              } 
            />

            <Route 
              path="/facturas" 
              element={
                <AuthGuard allowedRoles={['DESARROLLADOR', 'USUARIO', 'AUTORIZADO']} requiredPermission="facturas_ver">
                  <FacturasPage />
                </AuthGuard>
              } 
            />

            {/* Balances & Fiscal: strictly for Usuario (Dueño) and Desarrollador */}
            <Route 
              path="/balances" 
              element={
                <AuthGuard allowedRoles={['DESARROLLADOR', 'USUARIO']}>
                  <BalancesPage />
                </AuthGuard>
              } 
            />

            {/* Employee Management: strictly for Usuario (Dueño) and Desarrollador */}
            <Route 
              path="/empleados" 
              element={
                <AuthGuard allowedRoles={['DESARROLLADOR', 'USUARIO']}>
                  <GestionEmpleadosPage />
                </AuthGuard>
              } 
            />

            <Route 
              path="/metis" 
              element={
                <AuthGuard allowedRoles={['DESARROLLADOR', 'USUARIO', 'AUTORIZADO']}>
                  <MetisIAPage />
                </AuthGuard>
              } 
            />

            {/* Workshop Configuration: strictly for Usuario (Dueño) and Desarrollador */}
            <Route 
              path="/configuracion" 
              element={
                <AuthGuard allowedRoles={['DESARROLLADOR', 'USUARIO']}>
                  <ConfiguracionPage />
                </AuthGuard>
              } 
            />
          </Route>

          {/* Compatibility /app routes: redirect /app/clientes to /clientes, /app to /inicio, etc. */}
          <Route path="/app" element={<Navigate to="/inicio" replace />} />
          <Route path="/app/clientes" element={<Navigate to="/clientes" replace />} />
          <Route path="/app/vehiculos" element={<Navigate to="/vehiculos" replace />} />
          <Route path="/app/solicitudes" element={<Navigate to="/solicitudes" replace />} />
          <Route path="/app/presupuestos" element={<Navigate to="/presupuestos" replace />} />
          <Route path="/app/tarifas" element={<Navigate to="/tarifas" replace />} />
          <Route path="/app/expedientes" element={<Navigate to="/expedientes" replace />} />
          <Route path="/app/citas" element={<Navigate to="/citas" replace />} />
          <Route path="/app/reparaciones" element={<Navigate to="/reparaciones" replace />} />
          <Route path="/app/facturas" element={<Navigate to="/facturas" replace />} />
          <Route path="/app/balances" element={<Navigate to="/balances" replace />} />
          <Route path="/app/empleados" element={<Navigate to="/empleados" replace />} />
          <Route path="/app/metis" element={<Navigate to="/metis" replace />} />
          <Route path="/app/configuracion" element={<Navigate to="/configuracion" replace />} />

          {/* Global Fallback: redirects to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ToastProvider>
  )
}
