import { apiClient } from './api.config.js'

/**
 * Constante oficial de roles del sistema Eco-Guardianes
 * Utilizada transversalmente en validadores, servicios, filtros y control de acceso.
 */
export const USER_ROLES = ['ADMIN', 'COORDINATOR', 'TEACHER', 'STUDENT']

/**
 * Petición directa para registrar un usuario (registro público o administrativo)
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

/**
 * Listar y filtrar usuarios del sistema
 * @param {Object} [params={}] - Parámetros de consulta
 * @param {number} [params.limit=50] - Cantidad de registros
 * @param {number} [params.from=0] - Desplazamiento inicial
 * @param {string} [params.role] - Filtro opcional por rol
 * @returns {Promise<any>} Respuesta con { total, users } o { error: true, e }
 */
export const getUsers = async (params = {}) => {
  try {
    const cleanParams = {}
    if (params.limit !== undefined && params.limit !== '') cleanParams.limit = params.limit
    if (params.from !== undefined && params.from !== '') cleanParams.from = params.from
    if (params.role) cleanParams.role = params.role

    return await apiClient.get('/user', { params: cleanParams })
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Obtener un usuario por su ID de MongoDB
 * @param {string} id - MongoDB ObjectId del usuario
 * @returns {Promise<any>} Respuesta con { user } o { error: true, e }
 */
export const getUserById = async (id) => {
  try {
    return await apiClient.get(`/user/${id}`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Actualizar datos de un usuario
 * @param {string} id - MongoDB ObjectId del usuario
 * @param {Object} userData - Datos a actualizar ({ name, lastName, password, role, code })
 * @returns {Promise<any>} Respuesta con { msg, user } o { error: true, e }
 */
export const updateUser = async (id, userData) => {
  try {
    return await apiClient.put(`/user/${id}`, userData)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Desactivar un usuario (Soft Delete, pasa status a false)
 * @param {string} id - MongoDB ObjectId del usuario
 * @returns {Promise<any>} Respuesta con { msg, user } o { error: true, e }
 */
export const deleteUser = async (id) => {
  try {
    return await apiClient.delete(`/user/${id}`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

export default {
  USER_ROLES,
  postUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
}
