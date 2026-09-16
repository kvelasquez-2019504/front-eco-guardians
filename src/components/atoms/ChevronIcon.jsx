import { ChevronDown } from 'lucide-react'

/**
 * Átomo: ChevronIcon
 * Indicador de acordeón con rotación animada en CSS (0deg cerrado, 180deg abierto).
 * 
 * @param {Object} props
 * @param {boolean} [props.isOpen=false] - Estado abierto o cerrado del acordeón
 * @param {number} [props.size=16] - Tamaño del ícono
 * @param {string} [props.className] - Clases adicionales
 */
export const ChevronIcon = ({
  isOpen = false,
  size = 16,
  className = '',
}) => {
  return (
    <span
      className={`shrink-0 inline-flex items-center justify-center transition-transform duration-200 ease-out text-eco-muted ${
        isOpen ? 'rotate-180 text-eco-green' : 'rotate-0'
      } ${className}`}
      aria-hidden="true"
    >
      <ChevronDown size={size} />
    </span>
  )
}

export default ChevronIcon
