import axios from 'axios'

const API_URL = import.meta.env.VITE_APP_API_URL

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

const getToken = () => localStorage.getItem('token')

const setToken = (token: string) => localStorage.setItem('token', token)

axiosClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshResponse = await axios.post(`${API_URL}/refresh`, {}, { withCredentials: true })

        const newToken = refreshResponse.data.token
        setToken(newToken)

        originalRequest.headers['Authorization'] = `Bearer ${newToken}`

        return axiosClient(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token failed nya... (╥﹏╥)', refreshError)
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosClient

