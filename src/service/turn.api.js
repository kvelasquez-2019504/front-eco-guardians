import { apiClient } from './api.config.js'

/**
 * Consultar el turno activo hoy y las secciones de guardia (ADMIN, COORDINATOR, TEACHER, STUDENT)
 * @returns {Promise<any>}
 */
export const getCurrentTurn = async () => {
  try {
    return await apiClient.get('/turn/current')
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Listar calendario de turnos (ADMIN, COORDINATOR, TEACHER, STUDENT)
 * @param {Object} [params={}] - Filtros opcionales:
 *   - bimester: number (1 al 4)
 *   - academicYear: number (por defecto 2026)
 * @returns {Promise<any>}
 */
export const getTurns = async (params = {}) => {
  try {
    return await apiClient.get('/turn', { params })
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Consultar detalle de un turno semanal por su ID (uid) (ADMIN, COORDINATOR, TEACHER, STUDENT)
 * @param {string} id - uid del turno
 * @returns {Promise<any>}
 */
export const getTurnById = async (id) => {
  try {
    return await apiClient.get(`/turn/${id}`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Generar la matriz oficial de 8 semanas del bimestre (ADMIN, COORDINATOR)
 * @param {Object} payload
 * @param {number} payload.bimester - Número de bimestre (1 al 4)
 * @param {string} [payload.startDate] - Fecha de inicio de la semana 1 (ISO Date)
 * @param {number} [payload.academicYear=2026] - Ciclo lectivo
 * @returns {Promise<any>}
 */
export const generateTurnSchedule = async (payload) => {
  try {
    return await apiClient.post('/turn/generate-schedule', payload)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Crear turno semanal manual (ADMIN, COORDINATOR)
 * @param {Object} turnData
 * @param {number} turnData.bimester - Número de bimestre (1 al 4)
 * @param {number} turnData.weekNumber - Número de semana (1 al 8)
 * @param {string} turnData.startDate - Fecha de inicio (ISO Date)
 * @param {string} turnData.endDate - Fecha de fin (ISO Date)
 * @param {number} [turnData.academicYear=2026] - Ciclo lectivo
 * @param {string[]} [turnData.activeLevels] - IDs de niveles educativos
 * @param {boolean} [turnData.isAllLevelsActive=false] - Gran final activa
 * @param {string} [turnData.notes] - Observaciones o notas
 * @returns {Promise<any>}
 */
export const createTurn = async (turnData) => {
  try {
    return await apiClient.post('/turn', turnData)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Otorgar bono de guardia a una sección destacada (ADMIN, COORDINATOR)
 * @param {string} turnId - uid del turno
 * @param {Object} bonusData
 * @param {string} bonusData.classGroupId - uid de la clase premiada
 * @param {number} [bonusData.points=50] - Puntos institucionales otorgados
 * @param {string} [bonusData.reason] - Justificación institucional
 * @returns {Promise<any>}
 */
export const awardTurnBonus = async (turnId, bonusData) => {
  try {
    return await apiClient.post(`/turn/${turnId}/bonus`, bonusData)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Actualizar datos de un turno semanal (ADMIN, COORDINATOR)
 * @param {string} turnId - uid del turno
 * @param {Object} updateData - Campos modificables
 * @returns {Promise<any>}
 */
export const updateTurn = async (turnId, updateData) => {
  try {
    return await apiClient.put(`/turn/${turnId}`, updateData)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Desactivación lógica de un turno semanal (Exclusivo ADMIN)
 * @param {string} turnId - uid del turno
 * @returns {Promise<any>}
 */
export const deleteTurn = async (turnId) => {
  try {
    return await apiClient.delete(`/turn/${turnId}`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}
