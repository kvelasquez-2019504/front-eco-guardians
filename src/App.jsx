import { useRoutes } from 'react-router'
import { Toaster } from 'sonner'
import { routes } from './routes/routes.jsx'

function App() {
  const routing = useRoutes(routes)

  return (
    <>
      {/* Contenedor global de notificaciones toast */}
      <Toaster position="top-right" richColors />

      {/* Renderizado dinámico de rutas basado en routes.jsx */}
      {routing}
    </>
  )
}

export default App
