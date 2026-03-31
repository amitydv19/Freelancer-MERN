import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRoute = error.config?.url?.includes('/auth/login')
    const token = localStorage.getItem('token')

    if (error.response?.status === 401 && !isLoginRoute && token) {
      localStorage.clear()
      window.location.href = '/'
    }

    return Promise.reject(error)
  }
)

export default api