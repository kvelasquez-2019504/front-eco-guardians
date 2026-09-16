import { NavLink } from 'react-router'
import { SidebarIcon } from '../atoms/SidebarIcon.jsx'
import { SidebarText } from '../atoms/SidebarText.jsx'

/**
 * Molécula: SidebarItem
 * Enlace de navegación individual que utiliza NavLink con indicador visual de ruta activa.
 * 
 * @param {Object} props
 * @param {string} props.to - Ruta de destino
 * @param {string} props.label - Nombre del enlace
 * @param {React.ComponentType} [props.icon] - Ícono de lucide-react
 * @param {Function} [props.onClick] - Callback al presionar el enlace
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const SidebarItem = ({
  to,
  label,
  icon: Icon,
  onClick,
  className = '',
}) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        group flex items-center gap-3 px-3.5 py-2.5 rounded-r-xl text-xs font-body font-medium transition-all duration-150
        border-l-2 select-none
        ${
          isActive
            ? 'border-eco-green bg-eco-green/10 text-eco-green font-semibold shadow-xs'
            : 'border-transparent text-eco-muted hover:text-eco-text hover:bg-eco-card-hover/60'
        }
        ${className}
      `}
    >
      {({ isActive }) => (
        <>
          <SidebarIcon
            icon={Icon}
            size={17}
            className={`transition-colors ${
              isActive ? 'text-eco-green' : 'text-eco-muted group-hover:text-eco-text'
            }`}
          />
          <SidebarText className="flex-1">{label}</SidebarText>
        </>
      )}
    </NavLink>
  )
}

export default SidebarItem
