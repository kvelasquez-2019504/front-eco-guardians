/**
 * Átomo: Button
 * Botón interactivo accesible con múltiples variantes, tamaños y estado de carga para Eco-Guardianes.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Texto o contenido del botón
 * @param {'primary' | 'secondary' | 'outline' | 'focus' | 'ghost' | 'danger'} [props.variant='primary'] - Estilo visual
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Tamaño del botón
 * @param {boolean} [props.isLoading=false] - Muestra spinner de carga y deshabilita interacción
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {boolean} [props.fullWidth=false] - Ocupa el 100% del ancho del contenedor
 * @param {React.ReactNode} [props.leftIcon] - Ícono o elemento al lado izquierdo
 * @param {React.ReactNode} [props.rightIcon] - Ícono o elemento al lado derecho
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - Tipo de botón HTML
 * @param {string} [props.className] - Clases personalizadas adicionales
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = 'button',
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-heading font-bold transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eco-focus focus-visible:ring-offset-2 focus-visible:ring-offset-eco-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]'

  const variants = {
    // 1. Primario: Verde ecológico de alta jerarquía
    primary:
      'bg-eco-green hover:bg-eco-green-hover text-eco-bg shadow-md shadow-eco-green/20 hover:shadow-lg hover:shadow-eco-green/30',
    // 2. Secundario: Superficie oscura de tarjeta
    secondary:
      'bg-eco-card hover:bg-eco-card-hover text-eco-text border border-eco-border hover:border-eco-border/80',
    // 3. Outline: Contorno verde elegante
    outline:
      'border border-eco-green text-eco-green hover:bg-eco-green/10',
    // 4. Focus / Alerta: Naranja fuego para turnos activos o calificaciones urgentes
    focus:
      'bg-eco-focus hover:bg-orange-600 text-white shadow-md shadow-eco-focus/20 hover:shadow-lg hover:shadow-eco-focus/30',
    // 5. Ghost: Transparente para enlaces o acciones sutiles
    ghost:
      'text-eco-muted hover:text-eco-text hover:bg-eco-card/60',
    // 6. Danger: Para acciones destructivas o reportes
    danger:
      'bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-xl gap-2.5'
  }

  const selectedVariant = variants[variant] || variants.primary
  const selectedSize = sizes[size] || sizes.md

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${selectedVariant}
        ${selectedSize}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Spinner animado cuando está en estado de carga */}
      {isLoading && (
        <svg
          className="animate-spin -ml-0.5 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Ícono izquierdo */}
      {!isLoading && leftIcon && (
        <span className="shrink-0">{leftIcon}</span>
      )}

      {/* Contenido / Texto */}
      <span>{children}</span>

      {/* Ícono derecho */}
      {!isLoading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  )
}

export default Button
