import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/eco-guardians/v1'
export const SERVER_HOST = import.meta.env.VITE_SERVER_HOST || 'http://localhost:3000'

/**
 * Resolver URL absoluta para imágenes y streaming multimedia del backend
 * @param {string|Object} img - Cadena de URL o subdocumento de imagen ({ url, ... })
 * @returns {string} URL formateada para etiquetas <img>
 */
export const getMediaUrl = (img) => {
  if (!img) return ''
  const url = typeof img === 'string' ? img : img.url || ''
  if (!url) return ''
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url
  }
  return `${SERVER_HOST}${url.startsWith('/') ? '' : '/'}${url}`
}

/**
 * Configuración base del cliente HTTP con Axios
 * Conexión centralizada a la API REST de Eco-Guardianes
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Alias apiClient para compatibilidad
export const apiClient = api

// Interceptor para inyectar token de autenticación y gestionar multipart/form-data
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['x-token'] = token
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // Si la carga es FormData, eliminar Content-Type para que el navegador
    // añada automáticamente 'multipart/form-data; boundary=...'
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    return config
  },
  (error) => Promise.reject(error),
)

export default api
