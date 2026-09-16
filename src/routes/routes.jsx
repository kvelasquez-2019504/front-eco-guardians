import { DashboardLayout } from '../components/templates/DashboardLayout.jsx'
import { DemoDashboardPage } from '../pages/DemoDashboardPage.jsx'
import { LoginPage } from '../pages/LoginPage.jsx'
import { RegisterPage } from '../pages/RegisterPage.jsx'
import { ProtectedRoute } from './ProtectedRoute.jsx'
import { PublicRoute } from './PublicRoute.jsx'

export const routes = [
  // 1. Rutas Privadas: Requieren sesión activa
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DemoDashboardPage />,
          },
          {
            path: ':section/*',
            element: <DemoDashboardPage />,
          },
        ],
      },
    ],
  },

  // 2. Rutas Públicas: Si el usuario ya está autenticado, no le permite entrar y lo envía a '/'
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
]
