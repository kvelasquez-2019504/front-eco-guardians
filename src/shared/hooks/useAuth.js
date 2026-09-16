import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { login as loginRequest } from '@/service/auth.api.js'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Custom Hook: useAuth
 * Orquesta el flujo de autenticación: LoginForm -> useAuth -> auth.api -> useAuthStore
 */
export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  /**
   * Iniciar sesión con email y password
   * @param {Object} credentials - { email, password }
   * @param {Object} [options] - Opciones adicionales (redirección)
   * @returns {Promise<{ success: boolean, data?: any, errorData?: any }>}
   */
  const loginUser = async (credentials, options = {}) => {
    setLoading(true)

    const response = await loginRequest(credentials)

    if (response.error) {
      setLoading(false)

      const serverError = response.e?.response?.data

      // Error 400 de express-validator con array de { errors: [{ path, msg }] }
      if (serverError?.errors && Array.isArray(serverError.errors)) {
        const firstMessage = serverError.errors[0]?.msg || 'Error de validación en credenciales'
        toast.error(firstMessage)

        return {
          success: false,
          errorData: serverError.errors,
        }
      }

      // Mensaje de error puntual (ej: 401 Credenciales incorrectas)
      const errorMsg =
        serverError?.msg ||
        serverError?.message ||
        (typeof serverError === 'string' ? serverError : 'Correo o contraseña incorrectos.')

      toast.error(errorMsg)

      return {
        success: false,
        errorData: errorMsg,
      }
    }

    setLoading(false)

    const responseData = response.data
    const token = responseData?.token
    const user = responseData?.user

    // Guardar usuario y token en Zustand y localStorage
    setAuth(user, token)

    toast.success('¡Bienvenido de nuevo a Eco-Guardianes! 🌿')

    // Redirigir al dashboard
    navigate(options.redirectTo || '/')

    return {
      success: true,
      data: responseData,
    }
  }

  return {
    loginUser,
    loading,
  }
}

export default useAuth
