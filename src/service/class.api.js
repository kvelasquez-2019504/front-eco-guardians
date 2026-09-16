import { apiClient } from './api.config.js'

/**
 * Listar todas las clases activas con filtros opcionales (ADMIN, COORDINATOR, TEACHER, STUDENT)
 * @param {Object} [params={}] - Parámetros de consulta (level, career, type, teacher, academicYear)
 * @returns {Promise<any>}
 */
export const getClasses = async (params = {}) => {
  try {
    return await apiClient.get('/class', { params })
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Listar las clases que imparte el profesor autenticado (TEACHER, ADMIN, COORDINATOR)
 * @returns {Promise<any>}
 */
export const getMyClasses = async () => {
  try {
    return await apiClient.get('/class/my-classes')
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Consultar el detalle de una clase por su ID (uid) (ADMIN, COORDINATOR, TEACHER, STUDENT)
 * @param {string} id - uid de la clase
 * @returns {Promise<any>}
 */
export const getClassById = async (id) => {
  try {
    return await apiClient.get(`/class/${id}`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Crear una nueva clase o grupo académico (ADMIN, COORDINATOR)
 * @param {Object} classData
 * @param {string} classData.levelId - uid del nivel educativo
 * @param {string} classData.section - Letra de la sección (A, B, etc.)
 * @param {string} [classData.careerId] - Requerido si el nivel es DIVERSIFICADO
 * @param {string} [classData.teacherId] - Opcional uid del profesor
 * @param {number} [classData.academicYear] - Año académico (ej. 2026)
 * @returns {Promise<any>}
 */
export const createClass = async (classData) => {
  try {
    return await apiClient.post('/class', classData)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Actualizar datos generales de una clase existente (ADMIN, COORDINATOR)
 * @param {string} id - uid de la clase
 * @param {Object} classData - Datos a actualizar
 * @returns {Promise<any>}
 */
export const updateClass = async (id, classData) => {
  try {
    return await apiClient.put(`/class/${id}`, classData)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Asignar o sustituir el profesor de la clase (ADMIN, COORDINATOR)
 * @param {string} id - uid de la clase
 * @param {string} teacherId - uid del profesor con rol TEACHER
 * @returns {Promise<any>}
 */
export const assignClassTeacher = async (id, teacherId) => {
  try {
    return await apiClient.put(`/class/${id}/teacher`, { teacherId })
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Desactivación lógica (soft delete) de una clase (ADMIN, COORDINATOR)
 * @param {string} id - uid de la clase
 * @returns {Promise<any>}
 */
export const deleteClass = async (id) => {
  try {
    return await apiClient.delete(`/class/${id}`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

export default {
  getClasses,
  getMyClasses,
  getClassById,
  createClass,
  updateClass,
  assignClassTeacher,
  deleteClass,
}
