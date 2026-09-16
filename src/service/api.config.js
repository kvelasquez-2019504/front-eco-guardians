import axios from 'axios'

/**
 * Configuración base del cliente HTTP con Axios
 * Conexión centralizada a la API REST de Eco-Guardianes
 */
export const api = axios.create({
  baseURL: 'http://localhost:3000/eco-guardians/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Alias apiClient para compatibilidad
export const apiClient = api

// Interceptor para inyectar token de autenticación automáticamente si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['x-token'] = token
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default api
