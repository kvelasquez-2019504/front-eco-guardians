import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Guard: ProtectedRoute
 * Protege rutas privadas (Dashboard, Turnos, Rankings).
 * Si el usuario no está autenticado, lo redirige al login.
 */
export const ProtectedRoute = () => {
  const status = useAuthStore((state) => state.status)

  // Pantalla de carga mientras se verifica la sesión en el arranque
  if (status === 'checking') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-eco-bg text-eco-text">
        <span className="text-4xl animate-bounce mb-3" role="img" aria-label="Hoja">
          🌿
        </span>
        <p className="font-heading font-bold text-sm text-eco-green tracking-wide">
          Verificando sesión...
        </p>
      </div>
    )
  }

  // Si no está autenticado, bloquear acceso y enviar a /login
  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
