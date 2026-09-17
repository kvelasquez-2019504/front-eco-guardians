import { AlertTriangle, X } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'

/**
 * Organismo: PostDeleteModal
 * Modal de confirmación para desactivar una publicación (DELETE /post/:id).
 * Ubicado en: src/components/organisms/post/
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar modal
 * @param {Object} props.post - Publicación a desactivar
 * @param {Function} props.onConfirm - Callback al confirmar (uid)
 * @param {boolean} [props.loading=false] - Estado de guardado
 */
export const PostDeleteModal = ({
  isOpen,
  onClose,
  post,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen || !post) return null

  const handleConfirm = () => {
    onConfirm(post.uid)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-post-title"
    >
      <div className="relative w-full max-w-md bg-eco-card border border-eco-border rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Cabecera con advertencia */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              <AlertTriangle size={20} />
            </div>
            <div>
              <H3 id="delete-post-title" className="text-base font-bold text-eco-text">
                Desactivar Publicación
              </H3>
              <span className="text-xs text-eco-muted font-body">
                Confirmación de retiro de evidencia
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

        {/* Resumen de la publicación */}
        <div className="bg-eco-bg/80 border border-eco-border rounded-xl p-4 space-y-2">
          <p className="text-xs font-body text-eco-text line-clamp-3 italic">
            &ldquo;{post.description}&rdquo;
          </p>
          <div className="flex items-center justify-between text-[11px] text-eco-muted font-mono pt-1 border-t border-eco-border/50">
            <span>{post.student?.name} {post.student?.lastName}</span>
            <span>{post.images?.length || 0} foto(s)</span>
          </div>
        </div>

        {/* Mensaje explicativo */}
        <p className="text-xs text-eco-muted font-body leading-relaxed">
          Al desactivar esta evidencia, dejará de ser visible en el feed comunitario escolar. Los puntos de Eco-Aura previamente otorgados se mantendrán preservados en el historial (Soft Delete).
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
            Sí, Desactivar Publicación
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PostDeleteModal
