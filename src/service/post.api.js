import { apiClient } from './api.config.js'

/**
 * Feed general de evidencias con filtros opcionales (ADMIN, COORDINATOR, TEACHER, STUDENT)
 * @param {Object} [params={}] - Parámetros de consulta:
 *   - classGroupId: uid del aula
 *   - shift: 'MATUTINA' | 'VESPERTINA'
 *   - studentId: uid del estudiante
 *   - limit: número de elementos por página (default 20)
 *   - from: desplazamiento (default 0)
 * @returns {Promise<any>}
 */
export const getPosts = async (params = {}) => {
  try {
    return await apiClient.get('/post', { params })
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Muro personal con las publicaciones del alumno autenticado (STUDENT, ADMIN)
 * @returns {Promise<any>}
 */
export const getMyPosts = async () => {
  try {
    return await apiClient.get('/post/my-posts')
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Consultar detalle completo de una publicación y su historial de evaluaciones (ADMIN, COORDINATOR, TEACHER, STUDENT)
 * @param {string} id - uid de la publicación
 * @returns {Promise<any>}
 */
export const getPostById = async (id) => {
  try {
    return await apiClient.get(`/post/${id}`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Registrar evidencia ecológica con archivos binarios multipart/form-data (STUDENT, ADMIN)
 * Valida horario escolar de Kinal (UTC-6) y matrícula activa del alumno en el backend
 * @param {FormData|Object} postData - Instancia de FormData o payload { description, images: File[] }
 * @returns {Promise<any>}
 */
export const createPost = async (postData) => {
  try {
    let payload = postData

    // Si se pasa un objeto estándar, construir la instancia de FormData automáticamente
    if (!(postData instanceof FormData)) {
      payload = new FormData()
      if (postData.description) {
        payload.append('description', postData.description.trim())
      }
      if (postData.images && Array.isArray(postData.images)) {
        postData.images.forEach((img) => {
          payload.append('images', img)
        })
      }
    }

    return await apiClient.post('/post', payload)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Calificar publicación con la rúbrica oficial (modelo híbrido docente / pares)
 * @param {string} id - uid de la publicación
 * @param {Object} evaluationData
 * @param {Array<{ criterionId: string, achieved: boolean }>} evaluationData.checks - Lista de cotejo
 * @param {string} [evaluationData.comment] - Retroalimentación opcional
 * @returns {Promise<any>}
 */
export const evaluatePost = async (id, evaluationData) => {
  try {
    return await apiClient.post(`/post/${id}/evaluate`, evaluationData)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

/**
 * Desactivar publicación (Autor del post o ADMIN)
 * @param {string} id - uid de la publicación
 * @returns {Promise<any>}
 */
export const deletePost = async (id) => {
  try {
    return await apiClient.delete(`/post/${id}`)
  } catch (e) {
    return {
      error: true,
      e,
    }
  }
}

export default {
  getPosts,
  getMyPosts,
  getPostById,
  createPost,
  evaluatePost,
  deletePost,
}
