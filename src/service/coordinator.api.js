import { apiClient } from './api.config.js'

/**
 * Listar todas las asignaciones activas de coordinadores y niveles educativos (Exclusivo ADMIN)
 * @returns {Promise<any>} Respuesta con lista de asignaciones o { error: true, e }
 */
export const getCoordinatorAssignments = async () => {
  try {
    return await apiClient.get('/coordinator')
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Consultar los niveles educativos asignados al coordinador logueado (COORDINATOR, ADMIN)
 * @returns {Promise<any>} Respuesta con niveles asignados o { error: true, e }
 */
export const getMyAssignedLevels = async () => {
  try {
    return await apiClient.get('/coordinator/my-levels')
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Consultar los niveles asignados a un coordinador específico por su ID (uid) (ADMIN, COORDINATOR)
 * @param {string} coordinatorId - uid del usuario coordinador
 * @returns {Promise<any>} Respuesta con niveles asignados o { error: true, e }
 */
export const getLevelsByCoordinatorId = async (coordinatorId) => {
  try {
    return await apiClient.get(`/coordinator/${coordinatorId}/levels`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Asignar uno o más niveles educativos a un coordinador (Exclusivo ADMIN)
 * @param {Object} params
 * @param {string} params.coordinatorId - uid del coordinador
 * @param {Array<string>} params.levelIds - Arreglo de uids de los niveles a asignar
 * @returns {Promise<any>} Respuesta con las asignaciones creadas o { error: true, e }
 */
export const assignLevelsToCoordinator = async ({ coordinatorId, levelIds }) => {
  try {
    return await apiClient.post('/coordinator/assign', {
      coordinatorId,
      levelIds,
    })
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Desasignar un nivel educativo a un coordinador (Exclusivo ADMIN)
 * @param {Object} params
 * @param {string} params.coordinatorId - uid del coordinador
 * @param {string} params.levelId - uid del nivel educativo a remover
 * @returns {Promise<any>} Respuesta de confirmación o { error: true, e }
 */
export const unassignLevelFromCoordinator = async ({ coordinatorId, levelId }) => {
  try {
    // Axios DELETE requiere enviar el cuerpo dentro de la propiedad 'data' de la configuración
    return await apiClient.delete('/coordinator/unassign', {
      data: {
        coordinatorId,
        levelId,
      },
    })
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

export default {
  getCoordinatorAssignments,
  getMyAssignedLevels,
  getLevelsByCoordinatorId,
  assignLevelsToCoordinator,
  unassignLevelFromCoordinator,
}
