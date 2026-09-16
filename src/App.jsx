import { useEffect } from 'react'
import { useRoutes } from 'react-router'
import { Toaster } from 'sonner'
import { useAuth } from '@/shared/hooks/useAuth.js'
import { routes } from './routes/routes.jsx'

function App() {
  const routing = useRoutes(routes)
  const { checkAuthSession } = useAuth()

  useEffect(() => {
    // Verificación única de sesión al arrancar la aplicación
    checkAuthSession()
  }, [checkAuthSession])

  return (
    <>
      {/* Contenedor global de notificaciones toast */}
      <Toaster position="top-right" richColors closeButton />

      {/* Renderizado dinámico de rutas basado en routes.jsx */}
      {routing}
    </>
  )
}

export default App
