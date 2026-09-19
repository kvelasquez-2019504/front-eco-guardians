import { useState, useMemo } from 'react'
import { Clock, ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from 'lucide-react'

/**
 * Molécula: SchoolScheduleBanner
 * Banner informativo que detalla los horarios oficiales de Fundación Kinal (UTC-6)
 * para el registro de evidencias ecológicas.
 */
export const SchoolScheduleBanner = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Calcular si actualmente es horario escolar en Guatemala (UTC-6)
  const scheduleStatus = useMemo(() => {
    try {
      // Hora actual en zona horaria America/Guatemala
      const now = new Date()
      const guatemalaTimeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'America/Guatemala',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      })
      const guatemalaDayStr = now.toLocaleDateString('en-US', {
        timeZone: 'America/Guatemala',
        weekday: 'short',
      })

      const isWeekend = guatemalaDayStr === 'Sat' || guatemalaDayStr === 'Sun'
      const [hour, minute] = guatemalaTimeStr.split(':').map(Number)
      const currentMinutes = hour * 60 + minute

      // Básico: 07:00 (420) a 13:15 (795)
      // Div Mat: 07:00 (420) a 12:05 (725)
      // Div Vesp: 12:40 (760) a 17:40 (1060)
      const isWithinAnyShift =
        !isWeekend &&
        ((currentMinutes >= 420 && currentMinutes <= 795) ||
          (currentMinutes >= 760 && currentMinutes <= 1060))

      return {
        isActive: isWithinAnyShift,
        currentTime: guatemalaTimeStr,
        day: guatemalaDayStr,
      }
    } catch {
      return { isActive: true, currentTime: '', day: '' }
    }
  }, [])

  return (
    <div className="bg-eco-card border border-eco-border rounded-2xl p-4 shadow-md transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl border ${
              scheduleStatus.isActive
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            }`}
          >
            <Clock size={18} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-xs sm:text-sm text-eco-text">
                Horario Lectivo de Subida de Evidencias (Kinal UTC-6)
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-heading font-extrabold border ${
                  scheduleStatus.isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}
              >
                {scheduleStatus.isActive ? (
                  <>
                    <CheckCircle size={10} /> Activo ({scheduleStatus.currentTime})
                  </>
                ) : (
                  <>
                    <AlertTriangle size={10} /> Fuera de Horario ({scheduleStatus.currentTime})
                  </>
                )}
              </span>
            </div>
            <p className="text-[12px] text-eco-muted font-body mt-0.5">
              El backend valida que las publicaciones de alumnos ocurran durante las horas oficiales de clase.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-eco-muted hover:text-eco-text p-1.5 rounded-xl hover:bg-eco-bg transition-colors cursor-pointer text-xs flex items-center gap-1 font-body"
        >
          <span>{isExpanded ? 'Ocultar' : 'Ver Horarios'}</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-eco-border/60 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs animate-in fade-in duration-150">
          <div className="p-2.5 bg-eco-bg/70 rounded-xl border border-eco-border">
            <span className="font-heading font-bold text-eco-cyan block">Ciclo Básico</span>
            <span className="text-eco-text font-mono text-[12.5px] block mt-0.5">Lunes a Viernes</span>
            <span className="text-eco-muted text-[12.5px]">07:00 a 13:15 hrs</span>
          </div>

          <div className="p-2.5 bg-eco-bg/70 rounded-xl border border-eco-border">
            <span className="font-heading font-bold text-amber-300 block">Diversificado (Matutina)</span>
            <span className="text-eco-text font-mono text-[12.5px] block mt-0.5">Lunes a Viernes</span>
            <span className="text-eco-muted text-[12.5px]">07:00 a 12:05 hrs</span>
          </div>

          <div className="p-2.5 bg-eco-bg/70 rounded-xl border border-eco-border">
            <span className="font-heading font-bold text-indigo-300 block">Diversificado (Vespertina)</span>
            <span className="text-eco-text font-mono text-[12.5px] block mt-0.5">Lunes a Viernes</span>
            <span className="text-eco-muted text-[12.5px]">12:40 a 17:40 hrs</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default SchoolScheduleBanner
