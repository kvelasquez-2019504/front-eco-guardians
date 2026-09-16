import { Compass, Wrench } from 'lucide-react'

/**
 * Molécula: ClassTypeBadge
 * Insignia para identificar el tipo de grupo académico:
 * - GUIA: Ciclo Básico
 * - TALLER: Ciclo Diversificado
 * 
 * @param {Object} props
 * @param {'GUIA' | 'TALLER' | string} props.type - Tipo de clase
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const ClassTypeBadge = ({ type, className = '' }) => {
  const isGuia = type === 'GUIA'

  const config = isGuia
    ? {
        label: 'Clase Guía',
        icon: Compass,
        classes: 'bg-eco-cyan/15 text-eco-cyan border-eco-cyan/30',
      }
    : {
        label: 'Taller Técnico',
        icon: Wrench,
        classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      }

  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-heading font-extrabold tracking-wide border shadow-2xs select-none ${config.classes} ${className}`}
    >
      <Icon size={12} className="shrink-0 stroke-[2.5]" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  )
}

export default ClassTypeBadge
