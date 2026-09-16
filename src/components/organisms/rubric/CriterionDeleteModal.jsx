import { AlertTriangle, X } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { RubricCategoryBadge } from '../../molecules/RubricCategoryBadge.jsx'

/**
 * Organismo: CriterionDeleteModal
 * Modal de confirmación para desactivar lógicamente un criterio de la rúbrica (DELETE /rubric/:id).
 * Ubicado en: src/components/organisms/rubric/
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.criterion - Criterio a desactivar
 * @param {Function} props.onConfirm - Callback al confirmar (uid)
 * @param {boolean} [props.loading=false] - Estado de la petición
 */
export const CriterionDeleteModal = ({
  isOpen,
  onClose,
  criterion,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen || !criterion) return null

  const handleConfirm = () => {
    onConfirm(criterion.uid)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-criterion-title"
    >
      <div className="relative w-full max-w-md bg-eco-card border border-eco-border rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Cabecera con advertencia */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              <AlertTriangle size={20} />
            </div>
            <div>
              <H3 id="delete-criterion-title" className="text-base font-bold text-eco-text">
                Desactivar Criterio
              </H3>
              <span className="text-xs text-eco-muted font-body">
                Confirmación de acción administrativa
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Cerrar modal"
            className="p-1.5 rounded-lg text-eco-muted hover:text-eco-text hover:bg-eco-border/50 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Resumen del criterio */}
        <div className="bg-eco-bg/80 border border-eco-border rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-sm text-eco-text">
              {criterion.title}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-eco-card border border-eco-border text-eco-green">
              +{criterion.points} pts
            </span>
          </div>

          <div className="pt-1">
            <RubricCategoryBadge category={criterion.category} />
          </div>
        </div>

        {/* Mensaje explicativo */}
        <p className="text-xs text-eco-muted font-body leading-relaxed">
          Al desactivar este criterio, se retirará definitivamente de las listas de evaluación de evidencias. Las calificaciones pasadas y puntos acumulados por los alumnos se mantendrán intactos para preservar el historial (Soft Delete).
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
            Sí, Desactivar Criterio
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CriterionDeleteModal
