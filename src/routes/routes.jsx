import { DashboardLayout } from '@/components/templates/DashboardLayout.jsx'
import { DashboardHomePage } from '@/pages/DashboardHomePage.jsx'
import { UsersPage } from '@/pages/admin/UsersPage.jsx'
import { LevelsPage } from '@/pages/admin/LevelsPage.jsx'
import { CareersPage } from '@/pages/admin/CareersPage.jsx'
import { CoordinatorsPage } from '@/pages/admin/CoordinatorsPage.jsx'
import { ClassesPage } from '@/pages/admin/ClassesPage.jsx'
import { EnrollmentPage } from '@/pages/admin/EnrollmentPage.jsx'
import { RubricPage } from '@/pages/RubricPage.jsx'
import { LoginPage } from '@/pages/LoginPage.jsx'
import { RegisterPage } from '@/pages/RegisterPage.jsx'
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
            element: <DashboardHomePage />,
          },
          {
            path: 'admin/users',
            element: <UsersPage />,
          },
          {
            path: 'admin/levels',
            element: <LevelsPage />,
          },
          {
            path: 'admin/careers',
            element: <CareersPage />,
          },
          {
            path: 'admin/coordinators',
            element: <CoordinatorsPage />,
          },
          {
            path: 'admin/classes',
            element: <ClassesPage />,
          },
          {
            path: 'teacher/classes',
            element: <ClassesPage />,
          },
          {
            path: 'admin/enrollment',
            element: <EnrollmentPage />,
          },
          {
            path: 'rubric',
            element: <RubricPage />,
          },
        ],
      },
    ],
  },

  // 2. Rutas Públicas: Redirigen a '/' si ya existe sesión activa
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

export default routes
