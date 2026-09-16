import { apiClient } from './api.config.js'

/**
 * Servicio de Autenticación: Inicio de sesión
 * Endpoint: POST /eco-guardians/v1/auth/login
 * Acceso: Público
 * 
 * @param {Object} credentials - Credenciales de acceso
 * @param {string} credentials.email - Correo del usuario
 * @param {string} credentials.password - Contraseña
 * @returns {Promise<any>} Respuesta de Axios o { error: true, e }
 */
export const login = async (credentials) => {
  try {
    return await apiClient.post('/auth/login', credentials)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Servicio de Autenticación: Renovación de Token JWT
 * Endpoint: GET /eco-guardians/v1/auth/renew
 * Acceso: Requiere JWT (enviado automáticamente vía interceptor de Axios)
 * 
 * @returns {Promise<any>} Respuesta de Axios o { error: true, e }
 */
export const renewToken = async () => {
  try {
    return await apiClient.get('/auth/renew')
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

export default {
  login,
  renewToken,
}
