/**
 * Átomo: Td (Table Data Cell)
 * Celda de datos accesible y configurable para tablas de rankings, turnos y métricas en Eco-Guardianes.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido de la celda
 * @param {'left' | 'center' | 'right'} [props.align='left'] - Alineación del contenido
 * @param {'default' | 'muted' | 'success' | 'star' | 'focus' | 'bold'} [props.variant='default'] - Estilo semántico
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Espaciado y tamaño de fuente
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const Td = ({
  children,
  align = 'left',
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const aligns = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-3.5 text-sm',
    lg: 'px-6 py-4 text-base',
  }

  const variants = {
    default: 'text-eco-text',
    muted: 'text-eco-muted',
    success: 'text-eco-green font-bold',
    star: 'text-eco-star font-bold',
    focus: 'text-eco-focus font-bold',
    bold: 'text-eco-text font-bold',
  }

  const selectedAlign = aligns[align] || aligns.left
  const selectedSize = sizes[size] || sizes.md
  const selectedVariant = variants[variant] || variants.default

  return (
    <td
      className={`font-body transition-colors ${selectedAlign} ${selectedSize} ${selectedVariant} ${className}`}
      {...props}
    >
      {children}
    </td>
  )
}

export default Td
