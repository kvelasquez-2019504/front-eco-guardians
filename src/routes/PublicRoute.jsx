import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Guard: PublicRoute
 * Protege rutas públicas exclusivas (Login, Registro).
 * Si el usuario ya está autenticado, no le permite entrar al login/registro y lo redirige al Dashboard.
 */
export const PublicRoute = () => {
  const status = useAuthStore((state) => state.status)

  // Pantalla de carga mientras se verifica la sesión en el arranque
  if (status === 'checking') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-eco-bg text-eco-text">
        <span className="text-4xl animate-bounce mb-3" role="img" aria-label="Hoja">
          🌿
        </span>
        <p className="font-heading font-bold text-sm text-eco-green tracking-wide">
          Cargando...
        </p>
      </div>
    )
  }

  // Si ya está autenticado, prohibir acceso a login/registro y enviar a la raíz
  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PublicRoute
