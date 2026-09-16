import { apiClient } from './api.config.js'

/**
 * Petición directa para registrar un usuario
 * @param {Object} userData - Datos enviados desde el formulario o hook
 * @returns {Promise<any>} Respuesta de Axios o { error: true, e }
 */
export const postUser = async (userData) => {
  try {
    return await apiClient.post('/user', userData)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

export default {
  postUser,
}
