
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { AnimatedBackground } from '@/components/login/animated-background'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Button } from '@/components/ui/button'

export const LoginPage = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/portal', { replace: true })
    }
  }, [isAuthenticated])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/login`, {
        email,
        password,
      })

      const token = response.data.access_token
      const user = response.data.user
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      login()
      toast.success("Login successful! 🎀")

      setTimeout(() => {
        navigate('/portal')
      }, 5000)

    } catch (error: any) {
      console.error(error)
      if (error.response) {
        toast.error(`Login failed: ${error.response.data.message || 'Unknown error'} (´。＿。｀)`)
      } else {
        toast.error("Server error... please try again later! (つ﹏<)･ﾟ｡")
      }
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <AnimatedBackground />

      <div className="z-10 w-full max-w-md px-4">
        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Call Center Admin</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">SIP Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="1001"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">SIP Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" onClick={handleLogin}>
                {"Sign in"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-xs text-center text-muted-foreground mt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
