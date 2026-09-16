import { DashboardLayout } from '../components/templates/DashboardLayout.jsx'
import { DemoDashboardPage } from '../pages/DemoDashboardPage.jsx'
import { LoginPage } from '../pages/LoginPage.jsx'
import { RegisterPage } from '../pages/RegisterPage.jsx'

export const routes = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DemoDashboardPage />,
      },
      // Rutas dinámicas de los módulos del Sidebar para interactuar y ver la ruta activa
      {
        path: ':section/*',
        element: <DemoDashboardPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
]
