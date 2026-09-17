import { ShieldCheck, Users } from 'lucide-react'

/**
 * Molécula: EvaluationScoreBadge
 * Muestra el desglose del modelo híbrido de evaluación:
 * - Puntaje Oficial (Docentes/Coordinación/Admin) que suma al podio escolar
 * - Puntaje Comunitario (Evaluación entre pares)
 * 
 * @param {Object} props
 * @param {number} [props.officialScore=0] - Puntaje oficial otorgado
 * @param {number} [props.communityScore=0] - Puntaje comunitario de pares
 * @param {boolean} [props.isOfficiallyVerified=false] - Si cuenta con verificación docente
 * @param {string} [props.className=''] - Clases adicionales
 */
export const EvaluationScoreBadge = ({
  officialScore = 0,
  communityScore = 0,
  isOfficiallyVerified = false,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 flex-wrap ${className}`}>
      {/* 1. Puntaje Oficial Docente */}
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-extrabold border shadow-2xs select-none ${
          isOfficiallyVerified
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
            : 'bg-eco-bg text-eco-muted border-eco-border'
        }`}
        title={
          isOfficiallyVerified
            ? 'Puntaje oficial docente validado para el podio institucional'
            : 'Sin evaluación docente oficial por el momento'
        }
      >
        <ShieldCheck size={13} className={isOfficiallyVerified ? 'text-emerald-400' : 'text-eco-muted'} />
        <span>{officialScore} pts Oficial</span>
      </span>

      {/* 2. Puntaje Comunitario (Pares) */}
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-extrabold bg-eco-cyan/15 text-eco-cyan border border-eco-cyan/30 shadow-2xs select-none"
        title="Puntaje comunitario otorgado por compañeros estudiantes"
      >
        <Users size={13} />
        <span>{communityScore} pts Pares</span>
      </span>
    </div>
  )
}

export default EvaluationScoreBadge
