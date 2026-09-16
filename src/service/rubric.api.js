import { apiClient } from './api.config.js'

/**
 * Listar criterios de la rúbrica (ADMIN, COORDINATOR, TEACHER, STUDENT)
 * @param {Object} [params={}] - Parámetros de consulta opcionales:
 *   - all: 'true' | 'false' (si es true, retorna también los inactivos/pausados)
 *   - category: 'CLASIFICACION' | 'LIMPIEZA' | 'ORDEN' | 'GENERAL'
 * @returns {Promise<any>}
 */
export const getRubricCriteria = async (params = {}) => {
  try {
    return await apiClient.get('/rubric', { params })
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Consultar detalle de un criterio por su ID (uid) (ADMIN, COORDINATOR, TEACHER, STUDENT)
 * @param {string} id - uid del criterio
 * @returns {Promise<any>}
 */
export const getCriterionById = async (id) => {
  try {
    return await apiClient.get(`/rubric/${id}`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Crear un nuevo criterio evaluable con puntaje (ADMIN, COORDINATOR)
 * @param {Object} criterionData
 * @param {string} criterionData.title - Título del criterio
 * @param {number} criterionData.points - Puntaje (>= 1)
 * @param {string} [criterionData.description] - Explicación de cumplimiento
 * @param {'CLASIFICACION' | 'LIMPIEZA' | 'ORDEN' | 'GENERAL'} [criterionData.category='GENERAL'] - Categoría
 * @param {number} [criterionData.order=0] - Orden de presentación
 * @returns {Promise<any>}
 */
export const createCriterion = async (criterionData) => {
  try {
    return await apiClient.post('/rubric', criterionData)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Inicializar criterios institucionales por defecto de Fundación Kinal (Exclusivo ADMIN)
 * @returns {Promise<any>}
 */
export const seedRubricCriteria = async () => {
  try {
    return await apiClient.post('/rubric/seed')
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Actualizar datos de un criterio evaluable (ADMIN, COORDINATOR)
 * @param {string} id - uid del criterio
 * @param {Object} criterionData - Campos a modificar
 * @returns {Promise<any>}
 */
export const updateCriterion = async (id, criterionData) => {
  try {
    return await apiClient.put(`/rubric/${id}`, criterionData)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Alternar activación/desactivación del criterio en listas de cotejo (isActive) (ADMIN, COORDINATOR)
 * @param {string} id - uid del criterio
 * @returns {Promise<any>}
 */
export const toggleCriterionActive = async (id) => {
  try {
    return await apiClient.patch(`/rubric/${id}/toggle`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Desactivación lógica definitiva del criterio (Exclusivo ADMIN)
 * @param {string} id - uid del criterio
 * @returns {Promise<any>}
 */
export const deleteCriterion = async (id) => {
  try {
    return await apiClient.delete(`/rubric/${id}`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

export default {
  getRubricCriteria,
  getCriterionById,
  createCriterion,
  seedRubricCriteria,
  updateCriterion,
  toggleCriterionActive,
  deleteCriterion,
}
