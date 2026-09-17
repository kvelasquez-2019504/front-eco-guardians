import { ShieldCheck, Award, Calendar, Users, GraduationCap, CheckCircle2, Clock } from 'lucide-react'
import { H2, H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Organismo: CurrentTurnHero
 * Vista destacada del turno semanal activo hoy con las secciones de guardia de Fundación Kinal.
 * 
 * @param {Object} props
 * @param {Object} [props.turn] - Objeto del turno activo devuelto por GET /turn/current
 * @param {Array} [props.activeGuardianClasses=[]] - Secciones en guardia
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {Function} [props.onOpenBonus] - Callback para abrir modal de bonos (ADMIN / COORDINATOR)
 */
export const CurrentTurnHero = ({
  turn,
  activeGuardianClasses = [],
  loading = false,
  onOpenBonus,
}) => {
  const user = useAuthStore((state) => state.user)
  const canManageBonus = user?.role === 'ADMIN' || user?.role === 'COORDINATOR'

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('es-GT', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="p-8 rounded-3xl bg-eco-card border border-eco-border animate-pulse space-y-6">
        <div className="h-8 w-64 bg-eco-card-hover rounded-xl" />
        <div className="h-4 w-96 bg-eco-card-hover rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-eco-card-hover rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!turn) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-eco-card border border-eco-border text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-eco-card-hover flex items-center justify-center mx-auto text-eco-muted border border-eco-border">
          <Clock size={32} />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <H3 className="text-eco-text">Sin Turno Activo Esta Semana</H3>
          <p className="text-sm text-eco-muted">
            No se ha programado una ronda de guardia para la fecha de hoy. Consulta el calendario de rondas o genera la matriz bimestral.
          </p>
        </div>
      </div>
    )
  }

  const isGranFinal = Boolean(turn.isAllLevelsActive)

  return (
    <div className="space-y-6">
      {/* Banner Principal del Turno de la Semana */}
      <div className={`
        relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-xl transition-all
        ${isGranFinal
          ? 'bg-gradient-to-br from-amber-950/40 via-eco-card to-eco-bg border-amber-500/40'
          : 'bg-gradient-to-br from-eco-green/10 via-eco-card to-eco-bg border-eco-primary/30'}
      `}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`
                inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                ${isGranFinal
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                  : 'bg-eco-primary/15 text-eco-primary border border-eco-primary/30'}
              `}>
                <ShieldCheck size={14} />
                {isGranFinal ? '🏆 Gran Final Bimestral' : 'Ronda Oficial de Guardia'}
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-eco-card-hover border border-eco-border text-eco-muted">
                Bimestre {turn.bimester} • Semana {turn.weekNumber}
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-medium bg-eco-card-hover border border-eco-border text-eco-muted">
                Ciclo {turn.academicYear || 2026}
              </span>
            </div>

            <div>
              <H2 className="text-eco-text text-2xl sm:text-3xl font-bold tracking-tight">
                {isGranFinal
                  ? '¡Todos los Grados en Guardia Simultánea!'
                  : `Guardianes en Acción: Semana ${turn.weekNumber}`}
              </H2>
              <p className="text-sm text-eco-muted mt-1 flex items-center gap-2">
                <Calendar size={15} className="text-eco-primary shrink-0" />
                <span>Periodo activo: {formatDate(turn.startDate)} al {formatDate(turn.endDate)}</span>
              </p>
            </div>

            {turn.notes && (
              <p className="text-xs text-eco-text/90 italic bg-eco-card-hover/60 px-3.5 py-2 rounded-xl border border-eco-border max-w-xl">
                &ldquo;{turn.notes}&rdquo;
              </p>
            )}
          </div>

          {/* Acción rápida de otorgar bono (para Admin y Coordinador) */}
          {canManageBonus && onOpenBonus && (
            <div className="shrink-0">
              <Button
                variant="primary"
                onClick={() => onOpenBonus(turn)}
                className="gap-2 shadow-lg shadow-amber-500/10 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold border-none"
              >
                <Award size={18} />
                Otorgar Bono de Guardia
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Secciones Activas de Guardia (activeGuardianClasses) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-eco-primary/10 text-eco-primary border border-eco-primary/20">
              <Users size={20} />
            </div>
            <div>
              <H3 className="text-eco-text text-lg">Secciones Guardianas de Turno</H3>
              <p className="text-xs text-eco-muted">
                Aulas y salones asignados a la supervisión y mantenimiento ecológico esta semana
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-eco-card-hover text-eco-primary font-bold border border-eco-border">
            {activeGuardianClasses.length} {activeGuardianClasses.length === 1 ? 'Sección' : 'Secciones'}
          </span>
        </div>

        {activeGuardianClasses.length === 0 ? (
          <div className="p-6 rounded-2xl bg-eco-card border border-eco-border text-center text-xs text-eco-muted">
            No se han registrado secciones específicas para los niveles educativos de este turno.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGuardianClasses.map((cls) => (
              <div
                key={cls.uid}
                className="p-5 rounded-2xl bg-eco-card border border-eco-border hover:border-eco-primary/40 hover:bg-eco-card-hover/40 transition-all duration-200 flex flex-col justify-between space-y-4 group shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-eco-text group-hover:text-eco-primary transition-colors truncate">
                        {cls.name}
                      </h4>
                      <span className="text-xs font-semibold text-eco-primary">
                        Sección {cls.section}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-eco-card-hover border border-eco-border text-eco-muted shrink-0">
                      {cls.level?.stage || 'Kinal'}
                    </span>
                  </div>

                  {cls.career && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium">
                      <GraduationCap size={13} />
                      <span className="truncate">{cls.career.name}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-eco-border/60 text-xs flex items-center justify-between text-eco-muted">
                  <span className="truncate">
                    Docente: {cls.teacher ? `${cls.teacher.name} ${cls.teacher.lastName || ''}` : 'Sin asignar'}
                  </span>
                  <CheckCircle2 size={15} className="text-eco-primary shrink-0 ml-2" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bonificaciones Otorgadas en este Turno (bonusAwarded) */}
      {turn.bonusAwarded && turn.bonusAwarded.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
            <Award size={20} />
            <span>Bonificaciones de Guardia Otorgadas en esta Ronda</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {turn.bonusAwarded.map((bonus, idx) => (
              <div
                key={bonus._id || idx}
                className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-eco-text text-sm">
                    {bonus.classGroup?.name || 'Sección Premiada'} ({bonus.classGroup?.section || ''})
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    +{bonus.points} pts
                  </span>
                </div>
                {bonus.reason && (
                  <p className="text-xs text-amber-200/90 leading-relaxed italic">
                    &ldquo;{bonus.reason}&rdquo;
                  </p>
                )}
                <div className="text-[10px] text-eco-muted flex justify-between pt-1 border-t border-amber-500/20">
                  <span>Otorgado</span>
                  <span>{formatDate(bonus.awardedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
