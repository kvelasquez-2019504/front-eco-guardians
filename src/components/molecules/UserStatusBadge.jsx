/**
 * Molécula: UserStatusBadge
 * Muestra el estado activo o desactivado (soft delete) del usuario con un indicador de pulso sutil.
 * 
 * @param {Object} props
 * @param {boolean} props.status - Estado booleano del usuario
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const UserStatusBadge = ({ status, className = '' }) => {
  const isActive = Boolean(status)

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-heading font-bold select-none border ${
        isActive
          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
      } ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
        }`}
        aria-hidden="true"
      />
      <span>{isActive ? 'Activo' : 'Inactivo'}</span>
    </span>
  )
}

export default UserStatusBadge
