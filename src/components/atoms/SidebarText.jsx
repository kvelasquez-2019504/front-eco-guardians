/**
 * Átomo: SidebarText
 * Renderizado de etiquetas de texto para grupos y enlaces del Sidebar con truncado automático.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Texto a renderizar
 * @param {string} [props.className] - Clases de Tailwind adicionales
 * @param {string} [props.title] - Texto para tooltip nativo al pasar el cursor
 */
export const SidebarText = ({
  children,
  className = '',
  title,
  ...props
}) => {
  const tooltip = title || (typeof children === 'string' ? children : undefined)

  return (
    <span
      title={tooltip}
      className={`truncate font-body transition-colors select-none ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export default SidebarText
