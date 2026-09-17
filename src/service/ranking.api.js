import { apiClient } from './api.config.js'

/**
 * Consultar el leaderboard consolidado de secciones con podio (Top 3)
 * @param {Object} [params={}]
 * @param {number} [params.bimester] - Bimestre: 1, 2, 3 o 4 (si se omite, calcula acumulado anual)
 * @param {'BASICO' | 'DIVERSIFICADO'} [params.stage] - Etapa educativa
 * @param {'MATUTINA' | 'VESPERTINA'} [params.shift] - Jornada escolar
 * @param {number} [params.academicYear=2026] - Ciclo lectivo
 * @returns {Promise<any>}
 */
export const getCollectiveRanking = async (params = {}) => {
  try {
    return await apiClient.get('/ranking/collective', { params })
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Consultar el ranking individual de estudiantes por puntos de Eco-Aura
 * @param {Object} [params={}]
 * @param {'NOVATO' | 'GUARDIAN' | 'LEYENDA'} [params.level] - Rango de medalla
 * @param {number} [params.limit=20] - Límite de alumnos a retornar
 * @param {number} [params.from=0] - Desplazamiento para paginación
 * @returns {Promise<any>}
 */
export const getIndividualRanking = async (params = {}) => {
  try {
    return await apiClient.get('/ranking/individual', { params })
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Listar podios archivados e inmutables de bimestres anteriores
 * @param {Object} [params={}]
 * @param {number} [params.bimester] - Filtrar por bimestre
 * @param {number} [params.academicYear] - Ciclo lectivo
 * @returns {Promise<any>}
 */
export const getRankingHistory = async (params = {}) => {
  try {
    return await apiClient.get('/ranking/history', { params })
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Consultar el detalle de un podio histórico por su ID
 * @param {string} id - uid del historial
 * @returns {Promise<any>}
 */
export const getRankingHistoryById = async (id) => {
  try {
    return await apiClient.get(`/ranking/history/${id}`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Ejecutar el cierre oficial del bimestre y congelar ganadores (ADMIN, COORDINATOR)
 * @param {Object} payload
 * @param {number} payload.bimester - Número de bimestre a cerrar (1 al 4)
 * @param {number} [payload.academicYear=2026] - Ciclo lectivo
 * @param {string} [payload.notes] - Observaciones institucionales
 * @returns {Promise<any>}
 */
export const closeBimester = async (payload) => {
  try {
    return await apiClient.post('/ranking/close-bimester', payload)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}
