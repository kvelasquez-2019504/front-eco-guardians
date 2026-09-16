import { Link } from 'react-router'
import { Users, Calendar, Leaf, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore.js'
import { H1, H2, H3 } from '@/components/atoms/Heading.jsx'
import { AuraBadge } from '@/components/atoms/AuraBadge.jsx'
import { UserRoleBadge } from '@/components/molecules/UserRoleBadge.jsx'

/**
 * Página: DashboardHomePage
 * Vista principal real del panel de Eco-Guardianes tras iniciar sesión.
 * Reemplaza la vista demo temporal sin simuladores de roles.
 */
export const DashboardHomePage = () => {
  const user = useAuthStore((state) => state.user)
  const isStudent = user?.role === 'STUDENT'
  const canManageUsers = user?.role === 'ADMIN' || user?.role === 'COORDINATOR'

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Banner de Bienvenida */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserRoleBadge role={user?.role} />
              {isStudent && user?.ecoAura && (
                <AuraBadge level={user.ecoAura.level} points={user.ecoAura.points} />
              )}
            </div>

            <H1 variant="gradient">
              ¡Hola, {user?.name || 'Guardián'} {user?.lastName || ''}!
            </H1>

            <p className="text-sm text-eco-muted font-body max-w-xl leading-relaxed">
              Bienvenido a la plataforma de monitoreo y clasificación de residuos sólidos en Fundación Kinal. Desde aquí puedes supervisar actividades y colaborar por un campus sostenible.
            </p>
          </div>

          {/* Tarjeta de Código o Carnet */}
          {user?.code && (
            <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-5 py-3.5 shrink-0 text-center">
              <span className="text-xs text-eco-muted font-body block">Identificador Oficial</span>
              <span className="font-mono text-base font-bold text-eco-cyan">
                {user.code}
              </span>
            </div>
          )}
        </div>

        {/* Decoración gráfica de fondo sutil */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-eco-green/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Accesos Rápidos según rol */}
      <div className="space-y-3">
        <H2 variant="primary">Accesos Directos</H2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tarjeta de Usuarios (para Admin y Coordinador) */}
          {canManageUsers && (
            <Link
              to="/admin/users"
              className="bg-eco-card border border-eco-border hover:border-eco-green/60 p-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 group flex flex-col justify-between gap-4"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 bg-eco-bg rounded-xl text-eco-cyan border border-eco-border group-hover:bg-eco-cyan/15 group-hover:border-eco-cyan/30 transition-colors">
                  <Users size={22} />
                </div>
                <span className="text-xs text-eco-muted group-hover:text-eco-green flex items-center gap-1 font-bold">
                  Ingresar <ArrowRight size={14} />
                </span>
              </div>

              <div>
                <H3 className="text-sm font-bold text-eco-text group-hover:text-eco-green transition-colors">
                  Gestión de Usuarios
                </H3>
                <p className="text-xs text-eco-muted font-body mt-1">
                  Administra las cuentas de estudiantes, docentes y coordinadores del sistema.
                </p>
              </div>
            </Link>
          )}

          {/* Tarjeta de Módulo Ecológico */}
          <div className="bg-eco-card/70 border border-eco-border p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4 opacity-90">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-eco-bg rounded-xl text-eco-green border border-eco-border">
                <Leaf size={22} />
              </div>
              <span className="text-[10px] uppercase font-bold text-eco-muted bg-eco-bg px-2 py-0.5 rounded-full border border-eco-border">
                Próximamente
              </span>
            </div>

            <div>
              <H3 className="text-sm font-bold text-eco-text">
                Módulo Ecológico
              </H3>
              <p className="text-xs text-eco-muted font-body mt-1">
                Subida de evidencias de reciclaje y cálculo del impacto ecológico.
              </p>
            </div>
          </div>

          {/* Tarjeta de Turnos y Rondas */}
          <div className="bg-eco-card/70 border border-eco-border p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4 opacity-90">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-eco-bg rounded-xl text-eco-focus border border-eco-border">
                <Calendar size={22} />
              </div>
              <span className="text-[10px] uppercase font-bold text-eco-muted bg-eco-bg px-2 py-0.5 rounded-full border border-eco-border">
                Próximamente
              </span>
            </div>

            <div>
              <H3 className="text-sm font-bold text-eco-text">
                Turnos y Guardianes
              </H3>
              <p className="text-xs text-eco-muted font-body mt-1">
                Calendario de rondas de supervisión y asignación semanal por sección.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHomePage
