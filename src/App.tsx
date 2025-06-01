
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AgentPortal } from './components/agent-portal'
import { LoginPage } from './pages/Login'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { JSX } from 'react'
import { WebPhoneProvider } from './contexts/web-phone-context'
import { SidebarProvider } from './components/ui/sidebar'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Router>

      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/portal" element={
            <PrivateRoute>

              <SidebarProvider>
                <WebPhoneProvider>
                  <AgentPortal />
                </WebPhoneProvider>
              </SidebarProvider>
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>

      </AuthProvider>
    </Router>
  )
}

export default App

