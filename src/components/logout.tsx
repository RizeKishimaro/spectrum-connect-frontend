import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

const Logout = () => {
  const { logout } = useAuth()
  useEffect(() => {
    logout()
  })
  return (
    <div>Please wait while we're saving your data</div>
  )
}

export default Logout
