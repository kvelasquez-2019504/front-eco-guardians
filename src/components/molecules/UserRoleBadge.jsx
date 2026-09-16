import { Shield, School, GraduationCap, Sparkles, User } from 'lucide-react'

/**
 * Molécula: UserRoleBadge
 * Insignia visual semántica para distinguir los roles del sistema Eco-Guardianes.
 * 
 * @param {Object} props
 * @param {'ADMIN' | 'COORDINATOR' | 'TEACHER' | 'STUDENT' | string} props.role - Rol del usuario
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const UserRoleBadge = ({ role, className = '' }) => {
  const configs = {
    ADMIN: {
      label: 'Administrador',
      icon: Shield,
      classes: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    },
    COORDINATOR: {
      label: 'Coordinador',
      icon: School,
      classes: 'bg-eco-cyan/15 text-eco-cyan border-eco-cyan/30',
    },
    TEACHER: {
      label: 'Docente',
      icon: GraduationCap,
      classes: 'bg-eco-star/15 text-eco-star border-eco-star/30',
    },
    STUDENT: {
      label: 'Estudiante',
      icon: Sparkles,
      classes: 'bg-eco-green/15 text-eco-green border-eco-green/30',
    },
  }

  const normalizedRole = (role || '').toUpperCase()
  const config = configs[normalizedRole] || {
    label: role || 'Sin Rol',
    icon: User,
    classes: 'bg-eco-card text-eco-muted border-eco-border',
  }

  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-heading font-extrabold tracking-wide border shadow-2xs select-none ${config.classes} ${className}`}
    >
      <Icon size={12} className="shrink-0 stroke-[2.5]" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  )
}

export default UserRoleBadge
