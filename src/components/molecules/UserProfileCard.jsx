import { UserAvatar } from '../atoms/UserAvatar.jsx'
import { AuraBadge } from '../atoms/AuraBadge.jsx'

/**
 * Molécula: UserProfileCard
 * Tarjeta de información del usuario activo para el pie del Sidebar.
 * Presenta Avatar con iniciales, nombre completo, rol formateado y AuraBadge si es estudiante.
 * 
 * @param {Object} props
 * @param {Object} props.user - Objeto de usuario { uid, name, lastName, role, ecoAura }
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const UserProfileCard = ({ user, className = '' }) => {
  if (!user) return null

  const roleLabels = {
    ADMIN: 'Administrador',
    COORDINATOR: 'Coordinador',
    TEACHER: 'Docente',
    STUDENT: 'Estudiante',
  }

  const roleLabel = roleLabels[user.role] || user.role

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl bg-eco-bg/60 border border-eco-border/80 transition-colors ${className}`}
    >
      <UserAvatar name={user.name} lastName={user.lastName} size="md" />

      <div className="flex flex-col min-w-0 flex-1">
        <span
          className="font-heading font-bold text-xs text-eco-text truncate"
          title={`${user.name} ${user.lastName}`}
        >
          {user.name} {user.lastName}
        </span>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] font-body text-eco-muted truncate">
            {roleLabel}
          </span>
        </div>

        {/* El AuraBadge se muestra exclusivamente si el usuario es estudiante */}
        {user.role === 'STUDENT' && user.ecoAura && (
          <div className="mt-1.5">
            <AuraBadge
              level={user.ecoAura.level}
              points={user.ecoAura.points}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfileCard
