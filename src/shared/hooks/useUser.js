import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { postUser as postUserRequest } from '@/service/user.api.js'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Custom Hook: useUser
 * Orquesta la lógica de negocio y comunicación con la API de usuario.
 * Flujo: Formulario -> useUser (Hook) -> user.api (Axios) -> useAuthStore (Zustand)
 */
export const useUser = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)

  /**
   * Registro de un nuevo usuario
   * @param {Object} userData - Datos validados del formulario
   * @param {Object} [options] - Opciones adicionales (ej: redirección personalizada)
   * @returns {Promise<{ success: boolean, data?: any, errorData?: any }>}
   */
  const register = async (userData, options = {}) => {
    setLoading(true)

    // Llamada limpia a la API
    const response = await postUserRequest(userData)

    if (response.error) {
      setLoading(false)

      const serverError = response.e?.response?.data

      // Caso A: Error 400 de express-validator con array de { errors: [{ path, msg }] }
      if (serverError?.errors && Array.isArray(serverError.errors)) {
        const firstMessage = serverError.errors[0]?.msg || 'Error de validación en los campos'
        toast.error(firstMessage)

        return {
          success: false,
          errorData: serverError.errors,
        }
      }

      // Caso B: Mensaje simple de error devuelto por la API
      const errorMsg =
        serverError?.msg ||
        serverError?.message ||
        (typeof serverError === 'string' ? serverError : 'Error al registrar el usuario.')

      toast.error(errorMsg)

      return {
        success: false,
        errorData: errorMsg,
      }
    }

    setLoading(false)

    // Éxito: Notificación visual con Sonner
    const successMsg = response.data?.msg || response.data?.message || '¡Cuenta de Eco-Guardián creada con éxito!'
    toast.success(successMsg)

    // Si el backend devuelve el usuario creado o token, se actualiza Zustand
    if (response.data?.user) {
      setUser(response.data.user)
    }

    // Redirección si se solicita o por defecto al login
    if (options.redirectTo !== null) {
      navigate(options.redirectTo || '/login')
    }

    return {
      success: true,
      data: response.data,
    }
  }

  return {
    register,
    loading,
  }
}

export default useUser
