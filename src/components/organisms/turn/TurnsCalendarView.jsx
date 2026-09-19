import { useMemo } from 'react'
import { Calendar, Award, Clock, CheckCircle } from 'lucide-react'

/**
 * Organismo: TurnsCalendarView
 * Visualizador interactivo del cronograma de 8 semanas de rotación por bimestre en Fundación Kinal.
 * 
 * @param {Object} props
 * @param {Array} props.turns - Listado de turnos obtenidos de la API
 * @param {number} props.selectedBimester - Bimestre seleccionado (1 al 4)
 * @param {Function} props.onSelectBimester - Cambio de bimestre
 * @param {number} props.selectedYear - Año seleccionado (2026)
 * @param {Function} props.onSelectYear - Cambio de año
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {string} [props.currentTurnId] - uid del turno activo hoy
 */
export const TurnsCalendarView = ({
  turns = [],
  selectedBimester = 1,
  onSelectBimester,
  selectedYear = 2026,
  onSelectYear,
  loading = false,
  currentTurnId,
}) => {
  // Mapear cada semana (1-8) al turno registrado si existe
  const scheduleWeeks = useMemo(() => {
    // Matriz teórica de 8 semanas según reglamento de Kinal
    const rules = [
      { week: 1, round: 'Ronda 1', description: '1ro Básico + 4to Diversificado' },
      { week: 2, round: 'Ronda 1', description: '2do Básico + 5to Diversificado' },
      {
        week: 3,
        round: 'Ronda 1',
        description: selectedBimester === 4 ? 'Solo 3ro Básico (6to en Prácticas)' : '3ro Básico + 6to Diversificado',
      },
      { week: 4, round: 'Revancha', description: '1ro Básico + 4to Diversificado' },
      { week: 5, round: 'Revancha', description: '2do Básico + 5to Diversificado' },
      {
        week: 6,
        round: 'Revancha',
        description: selectedBimester === 4 ? 'Solo 3ro Básico (6to en Prácticas)' : '3ro Básico + 6to Diversificado',
      },
      { week: 7, round: 'Gran Final', description: 'Todos los Grados en Simultáneo', isFinal: true },
      { week: 8, round: 'Gran Final', description: 'Todos los Grados en Simultáneo', isFinal: true },
    ]

    return rules.map((rule) => {
      const match = turns.find(
        (t) => Number(t.bimester) === Number(selectedBimester) && Number(t.weekNumber) === rule.week
      )
      return {
        ...rule,
        turnData: match || null,
        isCurrent: match?.uid === currentTurnId,
      }
    })
  }, [turns, selectedBimester, currentTurnId])

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('es-GT', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="space-y-6">
      {/* Barra de Filtros del Calendario */}
      <div className="p-4 rounded-3xl bg-eco-card border border-eco-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-eco-primary" />
          <span className="text-sm font-semibold text-eco-text">
            Bimestre Escolar:
          </span>
          <div className="flex items-center gap-1.5 bg-eco-bg p-1 rounded-xl border border-eco-border">
            {[1, 2, 3, 4].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => onSelectBimester(b)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer
                  ${selectedBimester === b
                    ? 'bg-eco-primary text-(--color-eco-green) shadow-sm'
                    : 'text-eco-muted hover:text-eco-text hover:bg-eco-card-hover'}
                `}
              >
                Bimestre {b}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-eco-muted font-medium">Ciclo Lectivo:</span>
          <select
            value={selectedYear}
            onChange={(e) => onSelectYear(Number(e.target.value))}
            className="bg-eco-bg border border-eco-border rounded-xl px-3 py-1.5 text-xs text-eco-text focus:border-eco-primary outline-hidden cursor-pointer"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
        </div>
      </div>

      {/* Grid de las 8 Semanas de Rotación */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-eco-card-hover" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scheduleWeeks.map((item) => {
            const hasTurn = Boolean(item.turnData)
            const isGranFinal = item.isFinal || item.turnData?.isAllLevelsActive

            return (
              <div
                key={item.week}
                className={`
                  p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden
                  ${item.isCurrent
                    ? 'bg-eco-card border-eco-primary ring-2 ring-eco-primary/30 shadow-eco-primary/10'
                    : isGranFinal
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : hasTurn
                    ? 'bg-eco-card border-eco-border hover:border-eco-border/80'
                    : 'bg-eco-card/50 border-eco-border/50 border-dashed opacity-80'}
                `}
              >
                {/* Indicador de Semana en Curso */}
                {item.isCurrent && (
                  <div className="absolute top-0 right-0 bg-eco-primary text-black text-[10px] font-black px-2.5 py-0.5 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Clock size={11} />
                    <span>En Curso</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-eco-muted uppercase tracking-wider">
                      Semana {item.week}
                    </span>

                    <span className={`
                      text-[10px] px-2 py-0.5 rounded-full font-bold uppercase
                      ${isGranFinal
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : 'bg-eco-card-hover text-eco-primary border border-eco-border'}
                    `}>
                      {item.round}
                    </span>
                  </div>

                  <h4 className={`
                    text-sm font-bold leading-snug
                    ${isGranFinal ? 'text-amber-200' : 'text-eco-text'}
                  `}>
                    {item.description}
                  </h4>

                  {/* Fechas de inicio y fin si está programado */}
                  {hasTurn ? (
                    <div className="text-xs text-eco-muted flex items-center gap-1 pt-1">
                      <Calendar size={13} className="text-eco-primary shrink-0" />
                      <span>{formatDate(item.turnData.startDate)} - {formatDate(item.turnData.endDate)}</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-eco-muted/70 italic">
                      Pendiente de generar
                    </p>
                  )}
                </div>

                {/* Pie de tarjeta con niveles y bonos */}
                <div className="pt-3 border-t border-eco-border/60 flex items-center justify-between text-xs">
                  {hasTurn ? (
                    <>
                      <div className="flex items-center gap-1 text-eco-primary font-medium">
                        <CheckCircle size={14} />
                        <span>Programado</span>
                      </div>
                      {item.turnData.bonusAwarded && item.turnData.bonusAwarded.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                          <Award size={13} />
                          {item.turnData.bonusAwarded.length} bono(s)
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-[11px] text-eco-muted">
                      No sembrado
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
