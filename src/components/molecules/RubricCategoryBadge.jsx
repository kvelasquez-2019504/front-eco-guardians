import { Recycle, Sparkles, Layers, BookOpen } from 'lucide-react'

/**
 * Molécula: RubricCategoryBadge
 * Insignia visual con color e icono temático según la categoría institucional de la rúbrica:
 * - CLASIFICACION (Verde Esmeralda)
 * - LIMPIEZA (Cian)
 * - ORDEN (Ámbar)
 * - GENERAL (Púrpura)
 * 
 * @param {Object} props
 * @param {'CLASIFICACION' | 'LIMPIEZA' | 'ORDEN' | 'GENERAL' | string} props.category - Categoría del criterio
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const RubricCategoryBadge = ({ category = 'GENERAL', className = '' }) => {
  const norm = String(category).trim().toUpperCase()

  const configs = {
    CLASIFICACION: {
      label: 'Clasificación',
      icon: Recycle,
      classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    },
    LIMPIEZA: {
      label: 'Limpieza',
      icon: Sparkles,
      classes: 'bg-eco-cyan/15 text-eco-cyan border-eco-cyan/30',
    },
    ORDEN: {
      label: 'Orden',
      icon: Layers,
      classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    },
    GENERAL: {
      label: 'General',
      icon: BookOpen,
      classes: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    },
  }

  const config = configs[norm] || configs.GENERAL
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

export default RubricCategoryBadge
