import { useState, useEffect, useCallback } from 'react'
import { Clock, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { H1 } from '@/components/atoms/Heading.jsx'
import { Button } from '@/components/atoms/Button.jsx'
import { getCurrentTurn, awardTurnBonus } from '@/service/turn.api.js'
import { CurrentTurnHero } from '@/components/organisms/turn/CurrentTurnHero.jsx'
import { TurnBonusModal } from '@/components/organisms/turn/TurnBonusModal.jsx'

/**
 * Página: CurrentTurnPage
 * Visualización del turno semanal activo hoy con las secciones de guardia de Fundación Kinal.
 * Ruta: /turns/current
 */
export const CurrentTurnPage = () => {
  const [turn, setTurn] = useState(null)
  const [activeGuardianClasses, setActiveGuardianClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Estado para el modal de bono
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false)
  const [selectedTurnForBonus, setSelectedTurnForBonus] = useState(null)

  const fetchCurrentTurn = useCallback(async () => {
    setLoading(true)
    const res = await getCurrentTurn()
    if (res.error) {
      // Si el backend retorna 404 (no hay turno hoy), dejamos turn en null
      setTurn(null)
      setActiveGuardianClasses([])
    } else if (res.data) {
      setTurn(res.data.turn || (res.data.bimester ? res.data : null))
      setActiveGuardianClasses(res.data.activeGuardianClasses || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    let ignore = false
    const init = async () => {
      await Promise.resolve()
      if (!ignore) {
        fetchCurrentTurn()
      }
    }
    init()
    return () => {
      ignore = true
    }
  }, [fetchCurrentTurn])

  const handleOpenBonus = (turnObj) => {
    setSelectedTurnForBonus(turnObj)
    setIsBonusModalOpen(true)
  }

  const handleCloseBonus = () => {
    setIsBonusModalOpen(false)
    setSelectedTurnForBonus(null)
  }

  const handleAwardBonus = async (turnId, bonusData) => {
    setActionLoading(true)
    const res = await awardTurnBonus(turnId, bonusData)
    setActionLoading(false)

    if (res.error) {
      toast.error(res.e?.response?.data?.message || 'Error al otorgar el bono de guardia.')
      return
    }

    toast.success('¡Bono de guardia otorgado exitosamente!')
    handleCloseBonus()
    fetchCurrentTurn()
  }

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
              <Clock size={14} /> Turnos y Guardianes
            </div>
            <H1 variant="gradient">Turno de la Semana</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Supervisión en tiempo real de las aulas y grados en turno de guardia ecológica según el calendario oficial de Fundación Kinal.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={fetchCurrentTurn}
              disabled={loading}
              className="text-xs gap-1.5 border-eco-border hover:border-eco-primary text-eco-muted hover:text-eco-text"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Principal con Secciones Activas */}
      <CurrentTurnHero
        turn={turn}
        activeGuardianClasses={activeGuardianClasses}
        loading={loading}
        onOpenBonus={handleOpenBonus}
      />

      {/* Modal para Otorgar Bono */}
      <TurnBonusModal
        isOpen={isBonusModalOpen}
        onClose={handleCloseBonus}
        onAward={handleAwardBonus}
        turn={selectedTurnForBonus}
        defaultClasses={activeGuardianClasses}
        loading={actionLoading}
      />
    </div>
  )
}
export default CurrentTurnPage
