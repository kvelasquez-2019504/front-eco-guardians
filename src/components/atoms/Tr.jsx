/**
 * Átomo: Tr (Table Row)
 * Fila configurable e interactiva para tablas de ranking, turnos y calificaciones en Eco-Guardianes.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Celdas Th o Td contenidas en la fila
 * @param {'default' | 'header' | 'highlight' | 'focus'} [props.variant='default'] - Estilo visual de la fila
 * @param {boolean} [props.isHighlighted=false] - Resalta la fila si corresponde a la sección del usuario actual
 * @param {boolean} [props.isClickable=false] - Aplica cursor de puntero y estados de interacción al hacer clic
 * @param {Function} [props.onClick] - Evento al hacer clic en la fila
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const Tr = ({
  children,
  variant = 'default',
  isHighlighted = false,
  isClickable = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles = 'transition-colors duration-150'

  const variants = {
    // Fila estándar con hover suave
    default: 'hover:bg-eco-card-hover/80',
    // Fila de encabezado
    header: 'border-b border-eco-border',
    // Resaltado de la propia sección del usuario (borde verde y fondo tenue)
    highlight: 'bg-eco-green/10 hover:bg-eco-green/15 border-l-4 border-l-eco-green',
    // Resaltado de sección en turno de supervisión activa
    focus: 'bg-eco-focus/10 hover:bg-eco-focus/15 border-l-4 border-l-eco-focus',
  }

  const effectiveVariant = isHighlighted ? 'highlight' : variant
  const selectedVariant = variants[effectiveVariant] || variants.default
  const cursorStyle = isClickable || onClick ? 'cursor-pointer' : ''

  return (
    <tr
      onClick={onClick}
      className={`${baseStyles} ${selectedVariant} ${cursorStyle} ${className}`}
      {...props}
    >
      {children}
    </tr>
  )
}

export default Tr
