/**
 * Átomo: UserAvatar
 * Avatar circular accesible que calcula y renderiza las iniciales de nombre y apellido.
 * 
 * @param {Object} props
 * @param {string} [props.name=''] - Nombre del usuario
 * @param {string} [props.lastName=''] - Apellido del usuario
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Tamaño del avatar
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const UserAvatar = ({
  name = '',
  lastName = '',
  size = 'md',
  className = '',
}) => {
  // Extraer iniciales (ej: Pepito Atunio -> PA)
  const firstInitial = name.trim().charAt(0).toUpperCase()
  const secondInitial = lastName.trim().charAt(0).toUpperCase()
  const initials = `${firstInitial}${secondInitial}` || 'EG'

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  const selectedSize = sizes[size] || sizes.md

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full font-heading font-black select-none shrink-0 
        bg-gradient-to-br from-emerald-600 via-eco-green to-teal-500 text-eco-bg border border-eco-green/40 shadow-sm
        ${selectedSize} ${className}`}
      aria-label={`Avatar de ${name} ${lastName}`.trim()}
    >
      <span>{initials}</span>
      {/* Indicador sutil de estado activo en línea */}
      <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full bg-eco-green ring-2 ring-eco-card" />
    </div>
  )
}

export default UserAvatar
