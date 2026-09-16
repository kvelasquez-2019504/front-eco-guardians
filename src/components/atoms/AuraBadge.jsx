import { Sparkles, Shield, Flame } from 'lucide-react'

/**
 * Átomo: AuraBadge
 * Muestra el rango de Eco-Aura (NOVATO, GUARDIAN, LEYENDA) con colores específicos de Tailwind.
 * 
 * @param {Object} props
 * @param {'NOVATO' | 'GUARDIAN' | 'LEYENDA'} [props.level='NOVATO'] - Nivel de aura del alumno
 * @param {number} [props.points] - Puntos opcionales a mostrar
 * @param {string} [props.className] - Clases adicionales
 */
export const AuraBadge = ({
  level = 'NOVATO',
  points,
  className = '',
}) => {
  const configs = {
    NOVATO: {
      label: 'Novato',
      classes: 'bg-eco-cyan/15 text-eco-cyan border-eco-cyan/30',
      icon: Sparkles,
    },
    GUARDIAN: {
      label: 'Guardián',
      classes: 'bg-eco-green/15 text-eco-green border-eco-green/30',
      icon: Shield,
    },
    LEYENDA: {
      label: 'Leyenda',
      classes: 'bg-eco-star/15 text-eco-star border-eco-star/30',
      icon: Flame,
    },
  }

  const normalizedLevel = String(level).toUpperCase()
  const config = configs[normalizedLevel] || configs.NOVATO
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-heading font-extrabold uppercase tracking-wider border shadow-xs select-none ${config.classes} ${className}`}
      title={`Nivel Eco-Aura: ${config.label}${points !== undefined ? ` • ${points} pts` : ''}`}
    >
      <Icon size={12} className="shrink-0 stroke-[2.5]" aria-hidden="true" />
      <span>{config.label}</span>
      {points !== undefined && (
        <span className="opacity-80 font-normal">({points})</span>
      )}
    </span>
  )
}

export default AuraBadge
