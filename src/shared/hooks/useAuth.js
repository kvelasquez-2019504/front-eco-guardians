import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { login as loginRequest, renewToken as renewRequest } from '@/service/auth.api.js'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Custom Hook: useAuth
 * Centraliza la lógica de inicio de sesión y renovación silenciosa de token.
 */
export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const status = useAuthStore((state) => state.status)
  const setAuth = useAuthStore((state) => state.setAuth)
  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated)

  /**
   * Iniciar sesión con email y password
   * @param {Object} credentials - { email, password }
   * @param {Object} [options] - Opciones adicionales (redirección)
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
    const newToken = responseData?.token
    const newUser = responseData?.user

    // Guardar usuario y token en Zustand y localStorage
    setAuth(newUser, newToken)

    toast.success('¡Bienvenido de nuevo a Eco-Guardianes! 🌿')

    // Redirigir al dashboard
    navigate(options.redirectTo || '/')

    return {
      success: true,
      data: responseData,
    }
  }

  /**
   * Renovación y verificación silenciosa de token JWT
   * Se ejecuta una sola vez al cargar la aplicación.
   * NO redirige forzosamente ni lanza toasts molestos si el token expiró.
   */
  const checkAuthSession = useCallback(async () => {
    const storedToken = localStorage.getItem('token')

    // Si no hay token guardado, marcamos como no autenticado inmediatamente
    if (!storedToken) {
      setUnauthenticated()
      return { success: false }
    }

    const response = await renewRequest()

    // Si el token es inválido o expiró
    if (response.error) {
      setUnauthenticated()
      return { success: false }
    }

    const responseData = response.data
    const renewedToken = responseData?.token || storedToken
    const sessionUser = responseData?.user

    // Sesión válida: actualizar usuario y nuevo token
    setAuth(sessionUser, renewedToken)

    return {
      success: true,
      user: sessionUser,
    }
  }, [setAuth, setUnauthenticated])

  return {
    loginUser,
    checkAuthSession,
    loading,
    user,
    token,
    status,
  }
}

export default useAuth
