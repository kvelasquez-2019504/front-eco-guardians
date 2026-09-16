import { useLocation } from 'react-router'
import { toast } from 'sonner'
import { Shield, Sparkles, GraduationCap, School } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore.js'
import { H1, H2, H3 } from '../components/atoms/Heading.jsx'
import { AuraBadge } from '../components/atoms/AuraBadge.jsx'

export const DemoDashboardPage = () => {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const setRole = useAuthStore((state) => state.setRole)

  const roles = [
    {
      id: 'STUDENT',
      label: 'Estudiante',
      icon: Sparkles,
      desc: 'Acceso a Módulo Ecológico, Turnos y Podios. Nivel de Aura visible.',
    },
    {
      id: 'TEACHER',
      label: 'Docente',
      icon: GraduationCap,
      desc: 'Acceso a Panel Docente, Turnos y Módulo Ecológico.',
    },
    {
      id: 'COORDINATOR',
      label: 'Coordinador',
      icon: School,
      desc: 'Gestión de turnos y administración académica general.',
    },
    {
      id: 'ADMIN',
      label: 'Administrador',
      icon: Shield,
      desc: 'Acceso total a todos los módulos y configuración de Sistema.',
    },
  ]

  const handleRoleChange = (roleId) => {
    setRole(roleId)
    toast.success(`Rol cambiado a ${roleId}. El menú lateral se ha actualizado.`)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Encabezado del Dashboard */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-green/15 text-eco-green text-xs font-bold mb-3">
              <Shield size={14} /> Control de Acceso por Roles (RBAC) Activo
            </div>
            <H1 variant="gradient">Panel de Eco-Guardianes</H1>
            <p className="text-sm text-eco-muted font-body mt-1">
              Ruta activa actual: <code className="bg-eco-bg px-2 py-0.5 rounded text-eco-cyan font-mono">{location.pathname}</code>
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-3 bg-eco-bg/80 border border-eco-border px-4 py-3 rounded-xl shrink-0">
              <div>
                <span className="text-xs text-eco-muted block font-body">Sesión iniciada como:</span>
                <span className="font-heading font-black text-sm text-eco-text">
                  {user.name} {user.lastName}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-bold text-eco-cyan">{user.role}</span>
                  {user.role === 'STUDENT' && user.ecoAura && (
                    <AuraBadge level={user.ecoAura.level} points={user.ecoAura.points} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selector de Roles en Vivo para pruebas */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <H2 variant="primary">Simulador de Roles (Prueba de Menús)</H2>
          <p className="text-xs text-eco-muted font-body mt-0.5">
            Haz clic en cualquiera de los 4 roles para ver cómo el Sidebar filtra y restringe automáticamente los módulos:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {roles.map((r) => {
            const isCurrent = user?.role === r.id
            const Icon = r.icon

            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleChange(r.id)}
                className={`
                  p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3
                  ${
                    isCurrent
                      ? 'border-eco-green bg-eco-green/10 shadow-md shadow-eco-green/10 ring-1 ring-eco-green'
                      : 'border-eco-border bg-eco-bg/60 hover:bg-eco-card-hover hover:border-eco-border/80'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${isCurrent ? 'bg-eco-green text-eco-bg' : 'bg-eco-card text-eco-muted'}`}>
                    <Icon size={18} />
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-eco-green text-eco-bg">
                      Activo
                    </span>
                  )}
                </div>

                <div>
                  <H3 className="text-sm font-bold text-eco-text">{r.label}</H3>
                  <p className="text-xs text-eco-muted font-body mt-1 leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Matriz de Acceso Rápida */}
      <div className="bg-eco-card/60 border border-eco-border rounded-2xl p-6 shadow-lg space-y-3">
        <H3 variant="focus">Guía de Filtrado Estricto</H3>
        <ul className="text-xs text-eco-muted space-y-2 font-body list-disc pl-5">
          <li><strong className="text-eco-text">STUDENT:</strong> Solo ve Módulo Ecológico (puede subir evidencias), Turnos y Podios. Cuenta con su insignia de Eco-Aura en el pie.</li>
          <li><strong className="text-eco-text">TEACHER:</strong> Accede a su Panel Docente (Mis Clases), Turnos y Módulo Ecológico.</li>
          <li><strong className="text-eco-text">COORDINATOR:</strong> Acceso a Administración Académica (Niveles, Carreras, Talleres, Matrícula) y Gestión de Turnos.</li>
          <li><strong className="text-eco-text">ADMIN:</strong> Visualiza absolutamente todos los grupos, incluyendo Coordinaciones y el grupo exclusivo de Sistema (Usuarios).</li>
        </ul>
      </div>
    </div>
  )
}

export default DemoDashboardPage
