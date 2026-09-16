/**
 * Átomo: Heading (Encabezados H1, H2, H3, H4)
 * Tipografía semántica y escalable con fuente Outfit para Eco-Guardianes.
 * 
 * @param {Object} props
 * @param {1 | 2 | 3 | 4} [props.level=1] - Nivel semántico y tamaño (h1, h2, h3, h4)
 * @param {string} [props.as] - Permite renderizar una etiqueta HTML diferente a la del nivel
 * @param {'default' | 'primary' | 'focus' | 'muted' | 'gradient'} [props.variant='default'] - Estilo de color
 * @param {'left' | 'center' | 'right'} [props.align='left'] - Alineación del texto
 * @param {React.ReactNode} props.children - Texto o contenido del encabezado
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const Heading = ({
  level = 1,
  as,
  children,
  variant = 'default',
  align = 'left',
  className = '',
  ...props
}) => {
  // Etiqueta semántica HTML dinámica (h1, h2, h3, h4)
  const Tag = as || `h${Math.min(Math.max(level, 1), 6)}`

  const sizes = {
    1: 'text-3xl sm:text-4xl font-black tracking-tight',
    2: 'text-2xl sm:text-3xl font-extrabold tracking-tight',
    3: 'text-xl sm:text-2xl font-bold tracking-normal',
    4: 'text-lg sm:text-xl font-semibold',
  }

  const variants = {
    default: 'text-eco-text',
    primary: 'text-eco-green',
    focus: 'text-eco-focus',
    muted: 'text-eco-muted',
    // Degradado moderno para títulos destacados
    gradient: 'bg-gradient-to-r from-eco-green via-emerald-400 to-eco-cyan bg-clip-text text-transparent',
  }

  const aligns = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const selectedSize = sizes[level] || sizes[1]
  const selectedVariant = variants[variant] || variants.default
  const selectedAlign = aligns[align] || aligns.left

  return (
    <Tag
      className={`font-heading ${selectedSize} ${selectedVariant} ${selectedAlign} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

// Atajos directos para mayor comodidad: <H1 />, <H2 />, <H3 />
export const H1 = (props) => <Heading level={1} {...props} />
export const H2 = (props) => <Heading level={2} {...props} />
export const H3 = (props) => <Heading level={3} {...props} />
export const H4 = (props) => <Heading level={4} {...props} />

export default Heading
