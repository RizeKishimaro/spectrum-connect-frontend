
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AgentPortal } from './components/agent-portal'
import { LoginPage } from './pages/Login'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { JSX } from 'react'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/portal" element={
            <PrivateRoute>
              <AgentPortal />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

