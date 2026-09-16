import { apiClient } from './api.config.js'

/**
 * Listar los alumnos inscritos en una clase específica (TEACHER, COORDINATOR, ADMIN)
 * @param {string} classGroupId - uid de la clase
 * @param {Object} [params={}] - Parámetros de consulta opcionales (ej: { shift: 'MATUTINA' | 'VESPERTINA' })
 * @returns {Promise<any>}
 */
export const getClassStudents = async (classGroupId, params = {}) => {
  try {
    return await apiClient.get(`/enrollment/class/${classGroupId}/students`, { params })
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Consultar las clases y jornadas en las que está matriculado el alumno autenticado (STUDENT, ADMIN)
 * @returns {Promise<any>}
 */
export const getMyEnrollments = async () => {
  try {
    return await apiClient.get('/enrollment/my-enrollment')
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Inscribir uno o múltiples alumnos en una clase y jornada (ADMIN, COORDINATOR)
 * @param {Object} enrollmentData
 * @param {string} enrollmentData.classGroupId - uid de la clase
 * @param {'MATUTINA' | 'VESPERTINA'} enrollmentData.shift - Jornada escolar
 * @param {string} [enrollmentData.studentId] - uid de un alumno individual
 * @param {Array<string>} [enrollmentData.studentIds] - Arreglo de uids de alumnos (matrícula masiva)
 * @param {number} [enrollmentData.academicYear] - Ciclo lectivo (ej. 2026)
 * @returns {Promise<any>}
 */
export const enrollStudents = async (enrollmentData) => {
  try {
    return await apiClient.post('/enrollment', enrollmentData)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Desinscribir a un alumno de una clase (soft delete) (ADMIN, COORDINATOR)
 * @param {string} enrollmentId - Identificador único de la inscripción
 * @returns {Promise<any>}
 */
export const unenrollStudent = async (enrollmentId) => {
  try {
    return await apiClient.delete(`/enrollment/${enrollmentId}`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

export default {
  getClassStudents,
  getMyEnrollments,
  enrollStudents,
  unenrollStudent,
}
