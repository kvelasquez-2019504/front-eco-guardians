import { X, CheckCircle2, XCircle, MessageSquare, Award } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { UserAvatar } from '../../atoms/UserAvatar.jsx'
import { EvaluationScoreBadge } from '../../molecules/EvaluationScoreBadge.jsx'
import { getMediaUrl } from '@/service/api.config.js'

/**
 * Organismo: PostDetailModal
 * Modal para visualizar el detalle íntegro de una evidencia ecológica y el historial
 * completo de evaluaciones recibidas (docentes y de pares).
 * Ubicado en: src/components/organisms/post/
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar modal
 * @param {Object} props.post - Objeto de publicación
 */
export const PostDetailModal = ({ isOpen, onClose, post }) => {
  if (!isOpen || !post) return null

  const student = post.student || {}
  const fullName = `${student.name || ''} ${student.lastName || ''}`.trim() || 'Estudiante'
  const evaluations = post.evaluations || []
  const images = post.images || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-post-detail-title"
        className="bg-eco-card border border-eco-border rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Cabecera del modal */}
        <div className="p-6 border-b border-eco-border flex items-center justify-between bg-eco-bg/50">
          <div className="flex items-center gap-3">
            <UserAvatar name={fullName} size="md" />
            <div>
              <H3 id="modal-post-detail-title" className="text-eco-text">
                {fullName}
              </H3>
              <div className="flex items-center gap-2 text-xs text-eco-muted font-body mt-0.5">
                <span>{post.classGroup?.name || 'Aula'} (Secc. {post.classGroup?.section || 'A'})</span>
                <span>•</span>
                <span>Jornada {post.shift}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="text-eco-muted hover:text-eco-text p-2 rounded-xl hover:bg-eco-border/50 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
          {/* 1. Galería de Fotos */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden bg-eco-bg border border-eco-border aspect-video flex items-center justify-center"
                >
                  <img
                    src={getMediaUrl(img)}
                    alt={`Foto ${idx + 1} de evidencia`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 2. Descripción de la Acción */}
          <div className="p-4 rounded-2xl bg-eco-bg border border-eco-border space-y-1.5">
            <span className="text-[11px] font-heading font-bold text-eco-muted uppercase tracking-wider block">
              Descripción de la Evidencia
            </span>
            <p className="text-sm font-body text-eco-text leading-relaxed whitespace-pre-line">
              {post.description}
            </p>
          </div>

          {/* 3. Resumen de Puntajes */}
          <div className="p-4 rounded-2xl bg-eco-card border border-eco-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <EvaluationScoreBadge
              officialScore={post.officialScore}
              communityScore={post.communityScore}
              isOfficiallyVerified={post.isOfficiallyVerified}
            />

            <span className="text-xs font-heading font-bold text-eco-green">
              Total Eco-Aura ganado: +{post.totalEcoAuraEarned || 0} pts
            </span>
          </div>

          {/* 4. Historial de Evaluaciones */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-eco-green" />
              <H3 className="text-sm font-bold text-eco-text">
                Historial de Evaluaciones ({evaluations.length})
              </H3>
            </div>

            {evaluations.length === 0 ? (
              <p className="p-6 text-center text-xs text-eco-muted font-body bg-eco-bg rounded-2xl border border-eco-border">
                Esta evidencia aún no cuenta con evaluaciones registradas.
              </p>
            ) : (
              <div className="space-y-3">
                {evaluations.map((ev, idx) => {
                  const evalName = ev.evaluator
                    ? `${ev.evaluator.name || ''} ${ev.evaluator.lastName || ''}`.trim()
                    : 'Evaluador'
                  const isOfficial = ['ADMIN', 'COORDINATOR', 'TEACHER'].includes(ev.evaluatorRole)
                  const evalDate = ev.evaluatedAt
                    ? new Date(ev.evaluatedAt).toLocaleDateString('es-GT', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''

                  return (
                    <div
                      key={ev.uid || ev._id || idx}
                      className="p-4 rounded-2xl bg-eco-bg/80 border border-eco-border space-y-3"
                    >
                      {/* Cabecera del evaluador */}
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar name={evalName} size="sm" />
                          <div className="flex flex-col">
                            <span className="font-heading font-bold text-xs text-eco-text">
                              {evalName}
                            </span>
                            <span className="text-[10px] font-mono text-eco-muted">
                              {ev.evaluatorRole} {evalDate && `• ${evalDate}`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold border ${
                              isOfficial
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : 'bg-eco-cyan/15 text-eco-cyan border-eco-cyan/30'
                            }`}
                          >
                            <Award size={12} />
                            +{ev.score || 0} pts {isOfficial ? 'Oficial' : 'Comunidad'}
                          </span>
                        </div>
                      </div>

                      {/* Comentario si existe */}
                      {ev.comment && (
                        <p className="text-xs font-body text-eco-text italic bg-eco-card p-3 rounded-xl border border-eco-border/60">
                          &ldquo;{ev.comment}&rdquo;
                        </p>
                      )}

                      {/* Criterios marcados */}
                      {ev.checks && ev.checks.length > 0 && (
                        <div className="pt-2 border-t border-eco-border/50 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {ev.checks.map((check, cIdx) => (
                            <div
                              key={cIdx}
                              className="flex items-center justify-between gap-2 text-xs font-body p-2 rounded-lg bg-eco-card/50 border border-eco-border/40"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                {check.achieved ? (
                                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                                ) : (
                                  <XCircle size={13} className="text-zinc-500 shrink-0" />
                                )}
                                <span className="truncate text-eco-text text-[11px]">
                                  {check.title || 'Criterio evaluado'}
                                </span>
                              </div>

                              <span className="font-mono text-[10px] font-bold text-eco-muted shrink-0">
                                {check.achieved ? `+${check.pointsEarned || 0} pts` : '0 pts'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetailModal
