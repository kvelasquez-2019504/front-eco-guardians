/**
 * Átomo: SidebarIcon
 * Envoltorio accesible para renderizar íconos de lucide-react en la navegación lateral.
 * 
 * @param {Object} props
 * @param {React.ComponentType} props.icon - Componente de ícono de Lucide (ej: Leaf, Users)
 * @param {number} [props.size=18] - Tamaño en píxeles
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const SidebarIcon = ({
  icon: Icon,
  size = 18,
  className = '',
  ...props
}) => {
  if (!Icon) return null

  return (
    <span className={`shrink-0 inline-flex items-center justify-center ${className}`} {...props}>
      <Icon size={size} aria-hidden="true" />
    </span>
  )
}

export default SidebarIcon
