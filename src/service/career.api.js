import { apiClient } from './api.config.js'

/**
 * Listar todas las carreras técnicas activas
 * @returns {Promise<any>} Respuesta con lista de carreras o { error: true, e }
 */
export const getCareers = async () => {
  try {
    return await apiClient.get('/career')
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Consultar una carrera técnica por su ID (uid)
 * @param {string} id - uid de la carrera (MongoDB ObjectId)
 * @returns {Promise<any>} Respuesta con { career } o { error: true, e }
 */
export const getCareerById = async (id) => {
  try {
    return await apiClient.get(`/career/${id}`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Registrar una nueva especialidad técnica (Exclusivo ADMIN)
 * @param {Object} careerData - { name, description }
 * @returns {Promise<any>} Respuesta con la carrera creada o { error: true, e }
 */
export const createCareer = async (careerData) => {
  try {
    return await apiClient.post('/career', careerData)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}


/**
 * Actualizar datos de una carrera técnica (Exclusivo ADMIN)
 * @param {string} id - uid de la carrera (MongoDB ObjectId)
 * @param {Object} careerData - { name, description }
 * @returns {Promise<any>} Respuesta con la carrera actualizada o { error: true, e }
 */
export const updateCareer = async (id, careerData) => {
  try {
    return await apiClient.put(`/career/${id}`, careerData)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Desactivación lógica de una carrera técnica (Soft delete, status: false) (Exclusivo ADMIN)
 * @param {string} id - uid de la carrera (MongoDB ObjectId)
 * @returns {Promise<any>} Respuesta de confirmación o { error: true, e }
 */
export const deleteCareer = async (id) => {
  try {
    return await apiClient.delete(`/career/${id}`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

export default {
  getCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer,
}
