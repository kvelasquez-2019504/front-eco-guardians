import { apiClient } from './api.config.js'

/**
 * Constantes oficiales para etapas educativas en Eco-Guardianes
 */
export const LEVEL_STAGES = ['BASICO', 'DIVERSIFICADO']

/**
 * Listar todos los niveles educativos
 * @returns {Promise<any>} Respuesta con lista de niveles o { error: true, e }
 */
export const getLevels = async () => {
  try {
    return await apiClient.get('/level')
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Obtener un nivel educativo por su identificador único (uid)
 * @param {string} id - uid del nivel (MongoDB ObjectId)
 * @returns {Promise<any>} Respuesta con { level } o { error: true, e }
 */
export const getLevelById = async (id) => {
  try {
    return await apiClient.get(`/level/${id}`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Crear un nuevo nivel educativo (Exclusivo ADMIN)
 * @param {Object} levelData - { name, stage, gradeNumber, allowedSections }
 * @returns {Promise<any>} Respuesta con el nivel creado o { error: true, e }
 */
export const createLevel = async (levelData) => {
  try {
    return await apiClient.post('/level', levelData)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}


/**
 * Actualizar datos de un nivel educativo (Exclusivo ADMIN)
 * @param {string} id - uid del nivel (MongoDB ObjectId)
 * @param {Object} levelData - Campos a modificar
 * @returns {Promise<any>} Respuesta con el nivel actualizado o { error: true, e }
 */
export const updateLevel = async (id, levelData) => {
  try {
    return await apiClient.put(`/level/${id}`, levelData)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Desactivar un nivel educativo (Soft delete, status: false) (Exclusivo ADMIN)
 * @param {string} id - uid del nivel (MongoDB ObjectId)
 * @returns {Promise<any>} Respuesta de confirmación o { error: true, e }
 */
export const deleteLevel = async (id) => {
  try {
    return await apiClient.delete(`/level/${id}`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

export default {
  LEVEL_STAGES,
  getLevels,
  getLevelById,
  createLevel,
  updateLevel,
  deleteLevel,
}
