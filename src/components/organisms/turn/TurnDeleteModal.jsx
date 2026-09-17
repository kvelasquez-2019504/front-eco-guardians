import { AlertTriangle, Trash2, X } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'

/**
 * Organismo: TurnDeleteModal
 * Modal de confirmación para la desactivación lógica de un turno semanal (DELETE /turn/:id).
 * Exclusivo para el rol ADMIN.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onConfirm - Callback al confirmar la eliminación
 * @param {Object} props.turn - Turno a eliminar
 * @param {boolean} [props.loading=false] - Estado de carga
 */
export const TurnDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  turn,
  loading = false,
}) => {
  if (!isOpen || !turn) return null

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('es-GT', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-delete-turn-title"
        className="bg-eco-card border border-eco-border rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Cabecera de advertencia */}
        <div className="p-6 border-b border-eco-border flex items-center justify-between bg-red-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
              <AlertTriangle size={22} />
            </div>
            <div>
              <H3 id="modal-delete-turn-title" className="text-eco-text text-lg">
                Desactivar Turno
              </H3>
              <p className="text-xs text-red-300 mt-0.5">
                Acción administrativa irreversible
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 text-eco-muted hover:text-eco-text hover:bg-eco-card-hover rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo informativo */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-eco-text leading-relaxed">
            ¿Estás seguro de que deseas desactivar el turno de la{' '}
            <strong className="text-eco-primary">
              Semana {turn.weekNumber} (Bimestre {turn.bimester})
            </strong>
            ?
          </p>

          <div className="p-4 rounded-2xl bg-eco-card-hover/40 border border-eco-border space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-eco-muted">Periodo:</span>
              <span className="font-semibold text-eco-text">
                {formatDisplayDate(turn.startDate)} - {formatDisplayDate(turn.endDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-eco-muted">Modalidad:</span>
              <span className="font-semibold text-eco-text">
                {turn.isAllLevelsActive ? 'Gran Final (Todos los grados)' : 'Rotación regular'}
              </span>
            </div>
            {turn.bonusAwarded && turn.bonusAwarded.length > 0 && (
              <div className="flex justify-between text-amber-400">
                <span>Bonos vinculados:</span>
                <span className="font-semibold">{turn.bonusAwarded.length} sección(es) premiada(s)</span>
              </div>
            )}
          </div>

          <p className="text-xs text-eco-muted">
            Al desactivar este turno, las secciones ya no figurarán en guardia para este periodo en el muro general ni en los registros semanales.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="p-6 pt-2 border-t border-eco-border flex items-center justify-end gap-3 bg-eco-bg/30">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            loading={loading}
            onClick={() => onConfirm(turn.uid)}
            className="gap-2 bg-red-600 hover:bg-red-700 text-white border-none"
          >
            <Trash2 size={18} />
            Confirmar Desactivación
          </Button>
        </div>
      </div>
    </div>
  )
}
