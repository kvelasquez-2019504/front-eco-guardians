import { SidebarIcon } from '../atoms/SidebarIcon.jsx'
import { SidebarText } from '../atoms/SidebarText.jsx'
import { ChevronIcon } from '../atoms/ChevronIcon.jsx'

/**
 * Molécula: SidebarAccordionHeader
 * Botón para expandir o colapsar un grupo temático de navegación con ícono, texto y chevron animado.
 * 
 * @param {Object} props
 * @param {string} props.title - Título del grupo
 * @param {React.ComponentType} [props.icon] - Ícono del grupo
 * @param {boolean} props.isOpen - Estado de apertura
 * @param {Function} props.onToggle - Evento para alternar estado
 * @param {string} [props.className] - Clases adicionales
 */
export const SidebarAccordionHeader = ({
  title,
  icon: Icon,
  isOpen = false,
  onToggle,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className={`
        w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-left
        transition-colors duration-150 cursor-pointer select-none group
        hover:bg-eco-card-hover/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-eco-green/40
        ${isOpen ? 'text-eco-text' : 'text-eco-muted hover:text-eco-text'}
        ${className}
      `}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <SidebarIcon
          icon={Icon}
          size={18}
          className={`transition-colors ${
            isOpen ? 'text-eco-green' : 'text-eco-muted group-hover:text-eco-text'
          }`}
        />
        <SidebarText className="text-xs font-heading font-bold uppercase tracking-wider">
          {title}
        </SidebarText>
      </div>

      <ChevronIcon isOpen={isOpen} size={15} />
    </button>
  )
}

export default SidebarAccordionHeader
