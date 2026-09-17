import { useState, useEffect, useCallback } from 'react'
import { Calendar, RefreshCw } from 'lucide-react'
import { H1 } from '@/components/atoms/Heading.jsx'
import { Button } from '@/components/atoms/Button.jsx'
import { getTurns, getCurrentTurn } from '@/service/turn.api.js'
import { TurnsCalendarView } from '@/components/organisms/turn/TurnsCalendarView.jsx'

/**
 * Página: TurnsCalendarPage
 * Cronograma interactivo de las 8 semanas de rotación por bimestre en Fundación Kinal.
 * Ruta: /turns/calendar
 */
export const TurnsCalendarPage = () => {
  const [turns, setTurns] = useState([])
  const [selectedBimester, setSelectedBimester] = useState(1)
  const [selectedYear, setSelectedYear] = useState(2026)
  const [currentTurnId, setCurrentTurnId] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cargar el ID del turno actual para marcar la semana "En Curso"
  useEffect(() => {
    let ignore = false
    const fetchCurrent = async () => {
      await Promise.resolve()
      if (ignore) return
      const res = await getCurrentTurn()
      if (!ignore && !res.error && res.data) {
        const currentUid = res.data.turn?.uid || res.data.uid
        if (currentUid) setCurrentTurnId(currentUid)
      }
    }
    fetchCurrent()
    return () => {
      ignore = true
    }
  }, [])

  const fetchTurns = useCallback(async () => {
    setLoading(true)
    const res = await getTurns({
      bimester: selectedBimester,
      academicYear: selectedYear,
    })

    if (!res.error && res.data) {
      const list = Array.isArray(res.data) ? res.data : (res.data.turns || [])
      setTurns(list)
    } else {
      setTurns([])
    }
    setLoading(false)
  }, [selectedBimester, selectedYear])

  useEffect(() => {
    let ignore = false
    const init = async () => {
      await Promise.resolve()
      if (!ignore) {
        fetchTurns()
      }
    }
    init()
    return () => {
      ignore = true
    }
  }, [fetchTurns])

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 
        Encabezado de la página:
        REGLA ESTRICTA: Sin botones de acción duplicados aquí.
      */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-primary/15 text-eco-primary text-xs font-bold mb-3 border border-eco-primary/30">
              <Calendar size={14} /> Turnos y Guardianes
            </div>
            <H1 variant="gradient">Calendario de Rondas</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Visualización del esquema oficial de 8 semanas lectivas: Ronda 1, Revancha y Gran Final Bimestral.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={fetchTurns}
              disabled={loading}
              className="text-xs gap-1.5 border-eco-border hover:border-eco-primary text-eco-muted hover:text-eco-text"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Grid del Cronograma Oficial */}
      <TurnsCalendarView
        turns={turns}
        selectedBimester={selectedBimester}
        onSelectBimester={setSelectedBimester}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        loading={loading}
        currentTurnId={currentTurnId}
      />
    </div>
  )
}
export default TurnsCalendarPage
