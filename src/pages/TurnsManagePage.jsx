import { useState, useEffect, useCallback } from 'react'
import { Sliders, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { H1 } from '@/components/atoms/Heading.jsx'
import { Button } from '@/components/atoms/Button.jsx'
import {
  getTurns,
  generateTurnSchedule,
  createTurn,
  updateTurn,
  deleteTurn,
  awardTurnBonus,
} from '@/service/turn.api.js'
import { TurnsTable } from '@/components/organisms/turn/TurnsTable.jsx'
import { TurnGenerateModal } from '@/components/organisms/turn/TurnGenerateModal.jsx'
import { TurnCreateModal } from '@/components/organisms/turn/TurnCreateModal.jsx'
import { TurnEditModal } from '@/components/organisms/turn/TurnEditModal.jsx'
import { TurnDeleteModal } from '@/components/organisms/turn/TurnDeleteModal.jsx'
import { TurnBonusModal } from '@/components/organisms/turn/TurnBonusModal.jsx'

/**
 * Página: TurnsManagePage
 * Panel administrativo para programar, editar y bonificar turnos semanales de guardianes.
 * Acceso: ADMIN y COORDINATOR.
 * Ruta: /turns/manage
 */
export const TurnsManagePage = () => {
  const [turns, setTurns] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Modales de operación
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false)

  const [selectedTurn, setSelectedTurn] = useState(null)

  const fetchAllTurns = useCallback(async () => {
    setLoading(true)
    const res = await getTurns()
    if (!res.error && res.data) {
      const list = Array.isArray(res.data) ? res.data : (res.data.turns || [])
      setTurns(list)
    } else {
      setTurns([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    let ignore = false
    const init = async () => {
      await Promise.resolve()
      if (!ignore) {
        fetchAllTurns()
      }
    }
    init()
    return () => {
      ignore = true
    }
  }, [fetchAllTurns])

  // 1. Generación algorítmica
  const handleGenerateSchedule = async (payload) => {
    setActionLoading(true)
    const res = await generateTurnSchedule(payload)
    setActionLoading(false)

    if (res.error) {
      toast.error(res.e?.response?.data?.message || 'Error al generar la matriz bimestral.')
      return
    }

    toast.success('¡Matriz oficial de 8 semanas generada exitosamente!')
    setIsGenerateModalOpen(false)
    fetchAllTurns()
  }

  // 2. Creación manual
  const handleCreateTurn = async (turnData) => {
    setActionLoading(true)
    const res = await createTurn(turnData)
    setActionLoading(false)

    if (res.error) {
      toast.error(res.e?.response?.data?.message || 'Error al crear el turno semanal.')
      return
    }

    toast.success('Turno semanal registrado correctamente.')
    setIsCreateModalOpen(false)
    fetchAllTurns()
  }

  // 3. Edición
  const handleOpenEdit = (turn) => {
    setSelectedTurn(turn)
    setIsEditModalOpen(true)
  }

  const handleUpdateTurn = async (turnId, updateData) => {
    setActionLoading(true)
    const res = await updateTurn(turnId, updateData)
    setActionLoading(false)

    if (res.error) {
      toast.error(res.e?.response?.data?.message || 'Error al actualizar el turno.')
      return
    }

    toast.success('Turno actualizado con éxito.')
    setIsEditModalOpen(false)
    setSelectedTurn(null)
    fetchAllTurns()
  }

  // 4. Desactivación lógica (ADMIN)
  const handleOpenDelete = (turn) => {
    setSelectedTurn(turn)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteTurn = async (turnId) => {
    setActionLoading(true)
    const res = await deleteTurn(turnId)
    setActionLoading(false)

    if (res.error) {
      toast.error(res.e?.response?.data?.message || 'Error al desactivar el turno.')
      return
    }

    toast.success('Turno desactivado del calendario.')
    setIsDeleteModalOpen(false)
    setSelectedTurn(null)
    fetchAllTurns()
  }

  // 5. Asignación de bono
  const handleOpenBonus = (turn) => {
    setSelectedTurn(turn)
    setIsBonusModalOpen(true)
  }

  const handleAwardBonus = async (turnId, bonusData) => {
    setActionLoading(true)
    const res = await awardTurnBonus(turnId, bonusData)
    setActionLoading(false)

    if (res.error) {
      toast.error(res.e?.response?.data?.message || 'Error al otorgar el bono institucional.')
      return
    }

    toast.success('¡Bono de guardia asignado a la sección exitosamente!')
    setIsBonusModalOpen(false)
    setSelectedTurn(null)
    fetchAllTurns()
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
              <Sliders size={14} /> Administración de Turnos
            </div>
            <H1 variant="gradient">Gestión de Turnos y Rondas</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Programación de matrices bimestrales de 8 semanas, administración de guardias y asignación de bonificaciones de mérito.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={fetchAllTurns}
              disabled={loading}
              className="text-xs gap-1.5 border-eco-border hover:border-eco-primary text-eco-muted hover:text-eco-text"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla con botones de acción únicos en su barra de filtros */}
      <TurnsTable
        turns={turns}
        loading={loading}
        onOpenGenerate={() => setIsGenerateModalOpen(true)}
        onOpenCreate={() => setIsCreateModalOpen(true)}
        onOpenEdit={handleOpenEdit}
        onOpenDelete={handleOpenDelete}
        onOpenBonus={handleOpenBonus}
      />

      {/* Modales */}
      <TurnGenerateModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onGenerate={handleGenerateSchedule}
        loading={actionLoading}
      />

      <TurnCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTurn}
        loading={actionLoading}
      />

      <TurnEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedTurn(null)
        }}
        onUpdate={handleUpdateTurn}
        turn={selectedTurn}
        loading={actionLoading}
      />

      <TurnDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedTurn(null)
        }}
        onConfirm={handleDeleteTurn}
        turn={selectedTurn}
        loading={actionLoading}
      />

      <TurnBonusModal
        isOpen={isBonusModalOpen}
        onClose={() => {
          setIsBonusModalOpen(false)
          setSelectedTurn(null)
        }}
        onAward={handleAwardBonus}
        turn={selectedTurn}
        loading={actionLoading}
      />
    </div>
  )
}
export default TurnsManagePage
