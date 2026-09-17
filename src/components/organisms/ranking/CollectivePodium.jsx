import { Trophy, Medal, Award, Sparkles, FileCheck } from 'lucide-react'

/**
 * Organismo: CollectivePodium
 * Presentación visual del podio olímpico (1º, 2º y 3º puesto) de secciones en Eco-Guardianes.
 * 
 * @param {Object} props
 * @param {Array} props.podium - Arreglo de los 3 mejores salones
 * @param {boolean} [props.loading=false] - Estado de carga
 */
export const CollectivePodium = ({ podium = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 rounded-3xl bg-eco-card-hover" />
        ))}
      </div>
    )
  }

  if (!podium || podium.length === 0) {
    return null
  }

  // Orden olímpico: 2º lugar (Plata - izquierda), 1º lugar (Oro - centro/más alto), 3º lugar (Bronce - derecha)
  const first = podium.find((p) => p.position === 1) || podium[0]
  const second = podium.find((p) => p.position === 2) || podium[1]
  const third = podium.find((p) => p.position === 3) || podium[2]

  const podiumSlots = [
    { item: second, rank: 2, label: '2º Lugar', medalColor: 'text-slate-300', bgGlow: 'from-slate-500/15 via-eco-card to-eco-bg', borderColor: 'border-slate-400/40', badgeBg: 'bg-slate-400/20 text-slate-200 border-slate-400/30' },
    { item: first, rank: 1, label: '¡Campeón!', medalColor: 'text-amber-400', bgGlow: 'from-amber-500/20 via-eco-card to-eco-bg', borderColor: 'border-amber-400/60 ring-2 ring-amber-400/20', badgeBg: 'bg-amber-400/25 text-amber-300 border-amber-400/40 shadow-lg shadow-amber-400/20', isCenter: true },
    { item: third, rank: 3, label: '3º Lugar', medalColor: 'text-amber-700', bgGlow: 'from-amber-800/15 via-eco-card to-eco-bg', borderColor: 'border-amber-700/40', badgeBg: 'bg-amber-800/20 text-amber-400 border-amber-700/30' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-eco-primary font-bold text-sm uppercase tracking-wider">
        <Trophy size={18} className="text-amber-400" />
        <span>Podio de Honor Institucional</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
        {podiumSlots.map(({ item, rank, label, medalColor, bgGlow, borderColor, badgeBg, isCenter }) => {
          if (!item) {
            return (
              <div
                key={rank}
                className="rounded-3xl p-6 border border-eco-border/40 bg-eco-card/40 text-center text-xs text-eco-muted min-h-[220px] flex items-center justify-center italic"
              >
                Puesto #{rank} disponible
              </div>
            )
          }

          return (
            <div
              key={item.classGroupId || rank}
              className={`
                relative rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between shadow-xl
                bg-gradient-to-b ${bgGlow} ${borderColor}
                ${isCenter ? 'md:-translate-y-3 md:pb-8 shadow-amber-500/10' : ''}
              `}
            >
              {/* Badge de Posición y Medalla */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${badgeBg}`}>
                  {rank === 1 ? <Trophy size={14} className="text-amber-400" /> : <Medal size={14} className={medalColor} />}
                  {label}
                </span>

                <span className="text-2xl font-black font-heading text-eco-text">
                  #{rank}
                </span>
              </div>

              {/* Datos de la Clase */}
              <div className="space-y-2 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-eco-text leading-tight group-hover:text-eco-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold text-eco-primary mt-0.5">
                    Sección {item.section} • {item.levelName || item.stage}
                  </p>
                </div>

                {item.careerName && (
                  <span className="inline-block text-[11px] px-2.5 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium">
                    {item.careerName}
                  </span>
                )}

                <p className="text-xs text-eco-muted truncate">
                  Docente: {item.teacher || 'Sin asignar'}
                </p>
              </div>

              {/* Desglose de Puntuación */}
              <div className="pt-4 border-t border-eco-border/70 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-eco-muted">
                  <span className="flex items-center gap-1">
                    <FileCheck size={14} className="text-eco-primary" />
                    <span>{item.postsCount} evidencias:</span>
                  </span>
                  <span className="font-semibold text-eco-text">{item.postPoints} pts</span>
                </div>

                <div className="flex items-center justify-between text-xs text-eco-muted">
                  <span className="flex items-center gap-1">
                    <Award size={14} className="text-amber-400" />
                    <span>Bonos de turno:</span>
                  </span>
                  <span className="font-semibold text-amber-300">+{item.bonusPoints} pts</span>
                </div>

                <div className="pt-2 border-t border-eco-border/50 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-eco-text">Puntaje Total</span>
                  <div className="flex items-center gap-1">
                    <Sparkles size={16} className="text-amber-400" />
                    <span className="text-xl font-black font-heading text-amber-400">
                      {item.totalScore}
                    </span>
                    <span className="text-xs font-semibold text-eco-muted">pts</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
