import { AlertTriangle, X } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { UserAvatar } from '../../atoms/UserAvatar.jsx'
import { LevelStageBadge } from '../../molecules/LevelStageBadge.jsx'

/**
 * Organismo: UnassignLevelModal
 * Modal de confirmación para desvincular un nivel educativo de un coordinador (DELETE /coordinator/unassign).
 * Ubicado en: src/components/organisms/coordinator/
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.assignment - Asignación seleccionada
 * @param {Function} props.onConfirm - Callback al confirmar ({ coordinatorId, levelId })
 * @param {boolean} [props.loading=false] - Estado de la petición
 */
export const UnassignLevelModal = ({
  isOpen,
  onClose,
  assignment,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen || !assignment) return null

  const coordinator = assignment.coordinator || {}
  const level = assignment.level || {}

  const handleConfirm = () => {
    const coordinatorId = coordinator.uid || coordinator._id
    const levelId = level.uid || level._id
    onConfirm({ coordinatorId, levelId })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unassign-modal-title"
    >
      <div className="relative w-full max-w-md bg-eco-card border border-eco-border rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              <AlertTriangle size={20} />
            </div>
            <div>
              <H3 id="unassign-modal-title" className="text-base font-bold text-eco-text">
                Desasignar Nivel Educativo
              </H3>
              <span className="text-xs text-eco-muted font-body">
                Confirmación de desvinculación académica
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Cerrar modal"
            className="p-1.5 rounded-lg text-eco-muted hover:text-eco-text hover:bg-eco-card-hover transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Resumen del coordinador y grado */}
        <div className="bg-eco-bg/80 border border-eco-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <UserAvatar
              name={coordinator.name || 'C'}
              lastName={coordinator.lastName || 'O'}
              size="md"
            />
            <div className="min-w-0">
              <span className="text-xs text-eco-muted block font-body">Coordinador:</span>
              <span className="font-heading font-bold text-sm text-eco-text truncate block">
                {coordinator.name} {coordinator.lastName}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-eco-border/80 flex items-center justify-between gap-2">
            <div>
              <span className="text-xs text-eco-muted block font-body">Grado a desvincular:</span>
              <span className="font-heading font-bold text-sm text-eco-cyan block">
                {level.name}
              </span>
            </div>
            <LevelStageBadge stage={level.stage} />
          </div>
        </div>

        {/* Mensaje explicativo */}
        <p className="text-xs text-eco-muted font-body leading-relaxed">
          Al desasignar este grado, el coordinador dejará de recibir alertas, evidencias de reciclaje y gestión de turnos correspondiente a este nivel educativo.
        </p>

        {/* Botones de acción */}
        <div className="pt-2 border-t border-eco-border flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={loading}
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="danger"
            size="md"
            isLoading={loading}
            onClick={handleConfirm}
          >
            {loading ? 'Desasignando...' : 'Confirmar Desasignación'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UnassignLevelModal
