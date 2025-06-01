// src/contexts/AuthContext.tsx
import { setUser } from '@/redux/actions/userAction'
import { jwtDecode } from 'jwt-decode'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { redirect, useNavigate } from 'react-router-dom'

interface AuthContextType {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = () => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(true)
    if (token) {
      const payload = jwtDecode(token)
      console.log(payload)
      dispatch(setUser({
        name: payload.user.name,
        id: payload.user.id,
        user: payload.user
      }))
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    navigate("/login")
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      const payload = jwtDecode(token)
      console.log(payload)
      const currentTime = Math.floor(Date.now() / 1000)
      if (payload.exp > currentTime) {
        dispatch(setUser({
          name: payload?.user?.name,
          id: payload?.user?.id,
          user: payload?.user
        }))

        console.log("success")
        setIsAuthenticated(true);
        navigate("/portal", { replace: true });
      } else {
        console.log("Token expired 💔")
        logout()
      }
    }
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

