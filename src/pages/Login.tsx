
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import spectrumLogo from '../../public/logo.png' // <- replace with your logo path
import { toast } from 'sonner'

export const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = () => {
    login()
    toast("Login successful!")
    setTimeout(() => {
      navigate('/portal')
    }, 5000)

  }

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row">
      {/* Left side: Logo */}
      <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white flex items-center justify-center p-10">
        <div className="text-center">
          <img src={spectrumLogo} alt="Spectrum Connect" className="w-32 h-32 mx-auto mb-6 rounded-md" />

          <h1 className="text-4xl font-extrabold tracking-wide flex flex-wrap justify-center space-x-1">
            {[
              { letter: 'S', color: 'text-red-500' },
              { letter: 'p', color: 'text-orange-500' },
              { letter: 'e', color: 'text-amber-500' },
              { letter: 'c', color: 'text-yellow-400' },
              { letter: 't', color: 'text-green-500' },
              { letter: 'r', color: 'text-teal-500' },
              { letter: 'u', color: 'text-blue-500' },
              { letter: 'm', color: 'text-indigo-500' },
              { letter: ' ', color: '' },
              { letter: 'C', color: 'text-purple-500' },
              { letter: 'o', color: 'text-pink-500' },
              { letter: 'n', color: 'text-rose-500' },
              { letter: 'n', color: 'text-fuchsia-500' },
              { letter: 'e', color: 'text-emerald-500' },
              { letter: 'c', color: 'text-cyan-500' },
              { letter: 't', color: 'text-lime-500' },
            ].map(({ letter, color }, index) => (
              <span key={index} className={`${color} hover:scale-125 transition-all duration-300 font-bold cursor-pointer`}>
                {letter}
              </span>
            ))}
          </h1>
          <p className="mt-2 text-lg opacity-80">Empowering every voice, one connection at a time~ 🎧🌐</p>
        </div>
      </div>

      <div className="md:w-1/2 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow dark:border-gray-700">
          <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">
            Sign in to your account
          </h1>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 mr-2 border-gray-300 rounded dark:bg-gray-700" />
              <span className="text-gray-500 dark:text-gray-300">Remember me</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
              Forgot password?
            </a>
          </div>
          <button
            onClick={handleLogin}
            className="w-full py-2.5 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm"
          >
            Sign in
          </button>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Don’t have an account yet?{' '}
            <a href="#" className="text-blue-600 hover:underline dark:text-blue-400 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

