import { BookOpen, GraduationCap } from 'lucide-react'

/**
 * Molécula: LevelStageBadge
 * Insignia para identificar la etapa académica del nivel educativo: Básico o Diversificado.
 * 
 * @param {Object} props
 * @param {'BASICO' | 'DIVERSIFICADO' | string} props.stage - Etapa del grado
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const LevelStageBadge = ({ stage, className = '' }) => {
  const isBasico = stage === 'BASICO'

  const config = isBasico
    ? {
        label: 'Básico',
        icon: BookOpen,
        classes: 'bg-eco-cyan/15 text-eco-cyan border-eco-cyan/30',
      }
    : {
        label: 'Diversificado',
        icon: GraduationCap,
        classes: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
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

export default LevelStageBadge
