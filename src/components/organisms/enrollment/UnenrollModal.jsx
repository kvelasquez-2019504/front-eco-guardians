import { AlertTriangle, X } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { UserAvatar } from '../../atoms/UserAvatar.jsx'

/**
 * Organismo: UnenrollModal
 * Modal de confirmación para desinscribir a un alumno de una clase (DELETE /enrollment/:id).
 * Ubicado en: src/components/organisms/enrollment/
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.enrollment - Objeto de inscripción a eliminar
 * @param {Function} props.onConfirm - Callback al confirmar (enrollmentId)
 * @param {boolean} [props.loading=false] - Estado de la petición
 * @param {Object} [props.selectedClass] - Datos de la clase activa
 */
export const UnenrollModal = ({
  isOpen,
  onClose,
  enrollment,
  onConfirm,
  loading = false,
  selectedClass,
}) => {
  if (!isOpen || !enrollment) return null

  const student = enrollment.student || {}
  const fullName = `${student.name || ''} ${student.lastName || ''}`.trim() || 'Estudiante'
  const enrollmentId = enrollment.enrollmentId || enrollment.uid

  const handleConfirm = () => {
    onConfirm(enrollmentId)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unenroll-student-title"
    >
      <div className="relative w-full max-w-md bg-eco-card border border-eco-border rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Cabecera con advertencia */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              <AlertTriangle size={20} />
            </div>
            <div>
              <H3 id="unenroll-student-title" className="text-base font-bold text-eco-text">
                Desinscribir Alumno
              </H3>
              <span className="text-xs text-eco-muted font-body">
                Confirmación de retiro de la clase
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

        {/* Resumen del estudiante y clase */}
        <div className="bg-eco-bg/80 border border-eco-border rounded-xl p-4 flex items-center gap-3">
          <UserAvatar name={fullName} size="md" />
          <div className="flex flex-col min-w-0">
            <span className="font-heading font-bold text-sm text-eco-text truncate">
              {fullName}
            </span>
            <span className="text-xs font-mono text-eco-muted truncate">
              {student.email}
            </span>
            <span className="text-[11px] font-body text-eco-green mt-0.5">
              Clase: {selectedClass?.name || 'Clase Actual'} • Jornada {enrollment.shift}
            </span>
          </div>
        </div>

        {/* Mensaje explicativo */}
        <p className="text-xs text-eco-muted font-body leading-relaxed">
          Al desinscribir a este alumno, ya no formará parte activa del grupo escolar ni de los turnos de guardia asociados a esta sección. Su historial previo de Eco-Aura se mantendrá intacto en la plataforma.
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
            Sí, Desinscribir Alumno
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UnenrollModal
