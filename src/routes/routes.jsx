import { Navigate } from 'react-router'
import { DashboardLayout } from '@/components/templates/DashboardLayout.jsx'
import { DashboardHomePage } from '@/pages/DashboardHomePage.jsx'
import { UsersPage } from '@/pages/admin/UsersPage.jsx'
import { LevelsPage } from '@/pages/admin/LevelsPage.jsx'
import { CareersPage } from '@/pages/admin/CareersPage.jsx'
import { CoordinatorsPage } from '@/pages/admin/CoordinatorsPage.jsx'
import { ClassesPage } from '@/pages/admin/ClassesPage.jsx'
import { EnrollmentPage } from '@/pages/admin/EnrollmentPage.jsx'
import { CloseBimesterPage } from '@/pages/admin/CloseBimesterPage.jsx'
import { TeacherClassesPage } from '@/pages/TeacherClassesPage.jsx'
import { RubricPage } from '@/pages/RubricPage.jsx'
import { CurrentTurnPage } from '@/pages/CurrentTurnPage.jsx'
import { TurnsCalendarPage } from '@/pages/TurnsCalendarPage.jsx'
import { TurnsManagePage } from '@/pages/TurnsManagePage.jsx'
import { CollectiveRankingPage } from '@/pages/CollectiveRankingPage.jsx'
import { IndividualRankingPage } from '@/pages/IndividualRankingPage.jsx'
import { RankingHistoryPage } from '@/pages/RankingHistoryPage.jsx'
import { FeedPage } from '@/pages/FeedPage.jsx'
import { CreatePostPage } from '@/pages/CreatePostPage.jsx'
import { MyPostsPage } from '@/pages/MyPostsPage.jsx'
import { LoginPage } from '@/pages/LoginPage.jsx'
import { RegisterPage } from '@/pages/RegisterPage.jsx'
import { ProtectedRoute } from './ProtectedRoute.jsx'
import { PublicRoute } from './PublicRoute.jsx'

export const routes = [
  // 1. Rutas Privadas: Requieren sesión activa
  {
    path: '/',
    element: <ProtectedRoute />, // Requiere solo estar logueado
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardHomePage />,
          },

          // Módulo Ecológico (Común para todos los roles autenticados)
          {
            path: 'feed',
            element: <FeedPage />,
          },
          {
            path: 'rubric',
            element: <RubricPage />,
          },

          // Solo Alumnos y Admin (Creación y consulta de publicaciones personales)
          {
            element: <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']} />,
            children: [
              {
                path: 'posts/new',
                element: <CreatePostPage />,
              },
              {
                path: 'posts/my-posts',
                element: <MyPostsPage />,
              },
            ],
          },

          // Panel Docente
          {
            element: <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN', 'COORDINATOR']} />,
            children: [
              {
                path: 'teacher/classes',
                element: <TeacherClassesPage />,
              },
            ],
          },

          // Turnos de Guardia (Lectura común / Gestión restringida)
          {
            path: 'turns/current',
            element: <CurrentTurnPage />,
          },
          {
            path: 'turns/calendar',
            element: <TurnsCalendarPage />,
          },
          {
            element: <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR']} />,
            children: [
              {
                path: 'turns/manage',
                element: <TurnsManagePage />,
              },
            ],
          },

          // Leaderboards y Podios (Públicos autenticados)
          {
            path: 'rankings/collective',
            element: <CollectiveRankingPage />,
          },
          {
            path: 'rankings/individual',
            element: <IndividualRankingPage />,
          },
          {
            path: 'rankings/history',
            element: <RankingHistoryPage />,
          },

          // Administración Académica
          {
            element: <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR']} />,
            children: [
              {
                path: 'admin/levels',
                element: <LevelsPage />,
              },
              {
                path: 'admin/careers',
                element: <CareersPage />,
              },
              {
                path: 'admin/classes',
                element: <ClassesPage />,
              },
              {
                path: 'admin/enrollment',
                element: <EnrollmentPage />,
              },
              {
                path: 'admin/close-bimester',
                element: <CloseBimesterPage />,
              },
              {
                path: 'admin/users',
                element: <UsersPage />,
              },
            ],
          },

          // Exclusivo ADMIN
          {
            element: <ProtectedRoute allowedRoles={['ADMIN']} />,
            children: [
              {
                path: 'admin/coordinators',
                element: <CoordinatorsPage />,
              },
            ],
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

  // 3. Comodín: Redirección automática a /feed para rutas no encontradas
  {
    path: '*',
    element: <Navigate to="/feed" replace />,
  },
]

export default routes
