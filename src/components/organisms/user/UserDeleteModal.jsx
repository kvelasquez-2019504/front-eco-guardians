import { AlertTriangle, X } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { UserAvatar } from '../../atoms/UserAvatar.jsx'
import { UserRoleBadge } from '../../molecules/UserRoleBadge.jsx'

/**
 * Organismo: UserDeleteModal
 * Modal de confirmación para desactivar (soft delete) una cuenta de usuario en Eco-Guardianes.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está activo
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.user - Usuario seleccionado para desactivación
 * @param {Function} props.onConfirm - Callback al confirmar la desactivación (id)
 * @param {boolean} [props.loading=false] - Estado de la petición
 */
export const UserDeleteModal = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen || !user) return null

  const handleConfirm = () => {
    onConfirm(user.uid)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-user-title"
    >
      <div className="relative w-full max-w-md bg-eco-card border border-eco-border rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Cabecera con advertencia */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              <AlertTriangle size={20} />
            </div>
            <div>
              <H3 id="delete-user-title" className="text-base font-bold text-eco-text">
                Desactivar Usuario
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
            className="p-1.5 rounded-lg text-eco-muted hover:text-eco-text hover:bg-eco-card-hover transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tarjeta con los datos del usuario afectado */}
        <div className="bg-eco-bg/80 border border-eco-border rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <UserAvatar name={user.name} lastName={user.lastName} size="md" />
            <div className="min-w-0">
              <span className="block font-heading font-bold text-sm text-eco-text truncate">
                {user.name} {user.lastName}
              </span>
              <span className="block text-xs font-body text-eco-muted truncate">
                {user.email}
              </span>
            </div>
          </div>
          <UserRoleBadge role={user.role} />
        </div>

        {/* Mensaje explicativo del Soft Delete */}
        <p className="text-xs text-eco-muted font-body leading-relaxed">
          Al desactivar esta cuenta, el usuario perderá de inmediato el acceso al sistema. Sus evidencias fotográficas, turnos y puntos acumulados se conservarán para fines de auditoría histórica.
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
            {loading ? 'Desactivando...' : 'Confirmar Desactivación'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserDeleteModal
