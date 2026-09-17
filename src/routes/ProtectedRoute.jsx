import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Guard: ProtectedRoute
 * Protege rutas privadas (Dashboard, Turnos, Rankings).
 * Si el usuario no está autenticado, lo redirige al login.
 */
export const ProtectedRoute = ({ allowedRoles }) => {
  const status = useAuthStore((state) => state.status)
  const user = useAuthStore((state) => state.user)

  // Pantalla de carga mientras se verifica la sesión en el arranque
  if (status === 'checking') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-eco-bg text-eco-text">
        <span className="text-4xl animate-bounce mb-3" role="img" aria-label="Hoja">
          🌿
        </span>
        <p className="font-heading font-bold text-sm text-eco-green tracking-wide">
          Verificando credenciales...
        </p>
      </div>
    )
  }

  // 1. Si no ha iniciado sesión, redirigir a Login
  if (status === 'unauthenticated' || !user) {
    return <Navigate to="/login" replace />
  }

  // 2. Si se especifican roles y el rol del usuario no está autorizado
  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(user.role)) {
    // Redirigir a una ruta segura por defecto según su rol
    return <Navigate to="/feed" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
