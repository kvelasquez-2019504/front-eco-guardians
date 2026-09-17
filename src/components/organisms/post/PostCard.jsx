import { useState } from 'react'
import { Sun, Moon, ShieldCheck, Award, MessageSquare, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'
import { UserAvatar } from '../../atoms/UserAvatar.jsx'
import { AuraBadge } from '../../atoms/AuraBadge.jsx'
import { Button } from '../../atoms/Button.jsx'
import { EvaluationScoreBadge } from '../../molecules/EvaluationScoreBadge.jsx'
import { getMediaUrl } from '@/service/api.config.js'

/**
 * Organismo: PostCard
 * Tarjeta de presentación de una evidencia ecológica comunitaria:
 * Autor, aula, jornada, galería fotográfica, descripción, barra de puntajes híbridos
 * y acciones de calificación con rúbrica, consulta de historial y eliminación.
 * Ubicada en: src/components/organisms/post/
 * 
 * @param {Object} props
 * @param {Object} props.post - Objeto de publicación
 * @param {Object} [props.currentAuthUser] - Usuario autenticado
 * @param {Function} props.onEvaluate - Callback para abrir modal de calificar
 * @param {Function} props.onViewDetail - Callback para abrir modal de detalle/evaluaciones
 * @param {Function} props.onDelete - Callback para abrir modal de eliminación
 */
export const PostCard = ({
  post,
  currentAuthUser,
  onEvaluate,
  onViewDetail,
  onDelete,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const student = post.student || {}
  const fullName = `${student.name || ''} ${student.lastName || ''}`.trim() || 'Estudiante'
  const isMatutina = post.shift === 'MATUTINA'
  const studentId = student.uid || student._id
  const isAuthor = Boolean(currentAuthUser?.uid) && (currentAuthUser.uid === studentId)
  const isAdmin = currentAuthUser?.role === 'ADMIN'
  const isStudent = currentAuthUser?.role === 'STUDENT'
  const isOfficialEvaluator = ['ADMIN', 'COORDINATOR', 'TEACHER'].includes(currentAuthUser?.role)
  const canDelete = isAuthor || isAdmin

  // Comprobar si el usuario actual ya evaluó esta publicación (regla antifraude)
  const evaluationsList = post.evaluations || []
  const hasEvaluated = evaluationsList.some(
    (ev) =>
      ev.evaluator?.uid === currentAuthUser?.uid ||
      ev.evaluator?._id === currentAuthUser?.uid ||
      ev.evaluator === currentAuthUser?.uid
  )

  const images = post.images || []
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('es-GT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Fecha no registrada'

  return (
    <article className="bg-eco-card border border-eco-border rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 hover:border-eco-green/30 transition-all duration-200">
      {/* 1. Cabecera del Autor y Contexto */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <UserAvatar name={fullName} size="md" />

          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-heading font-bold text-sm sm:text-base text-eco-text">
                {fullName}
              </span>
              {student.code && (
                <span className="font-mono text-xs text-eco-green font-semibold">
                  {student.code}
                </span>
              )}
              {student.ecoAura && (
                <AuraBadge level={student.ecoAura.level} points={student.ecoAura.points} />
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-eco-muted font-body mt-0.5 flex-wrap">
              <span>{publishedDate}</span>
              <span>•</span>
              <span className="text-eco-text font-medium">
                {post.classGroup?.name || 'Aula escolar'} (Secc. {post.classGroup?.section || 'A'})
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-heading font-semibold text-[11px] text-amber-300">
                {isMatutina ? <Sun size={11} /> : <Moon size={11} />}
                {isMatutina ? 'Matutina' : 'Vespertina'}
              </span>
            </div>
          </div>
        </div>

        {/* Verificación Oficial Docente */}
        {post.isOfficiallyVerified && (
          <div
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-heading font-extrabold shrink-0"
            title="Esta evidencia fue verificada y aprobada oficialmente por docentes"
          >
            <ShieldCheck size={14} />
            <span className="hidden sm:inline">Verificada Oficial</span>
          </div>
        )}
      </div>

      {/* 2. Galería de Imágenes */}
      {images.length > 0 && (
        <div className="rounded-2xl overflow-hidden bg-eco-bg border border-eco-border">
          {/* Imagen principal activa */}
          <div className="relative aspect-video max-h-96 w-full overflow-hidden flex items-center justify-center bg-black/40">
            <img
              src={getMediaUrl(images[activeImageIndex])}
              alt={`Evidencia ecológica por ${fullName}`}
              className="w-full h-full object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              onClick={() => onViewDetail(post)}
            />
          </div>

          {/* Miniaturas si hay múltiples imágenes */}
          {images.length > 1 && (
            <div className="p-2 flex items-center gap-2 overflow-x-auto custom-scrollbar bg-eco-card/50">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-eco-green ring-2 ring-eco-green/30'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getMediaUrl(img)}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Descripción de la Acción Ecológica */}
      <p className="text-sm font-body text-eco-text leading-relaxed whitespace-pre-line">
        {post.description}
      </p>

      {/* 4. Barra de Puntajes y Recompensas */}
      <div className="p-3.5 rounded-2xl bg-eco-bg border border-eco-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <EvaluationScoreBadge
          officialScore={post.officialScore}
          communityScore={post.communityScore}
          isOfficiallyVerified={post.isOfficiallyVerified}
        />

        <div className="flex items-center gap-3 text-xs text-eco-muted font-body">
          <span className="font-heading font-semibold text-eco-text">
            +{post.totalEcoAuraEarned || 0} pts Eco-Aura generados
          </span>
          <span>•</span>
          <span>{evaluationsList.length} evaluaciones</span>
        </div>
      </div>

      {/* 5. Acciones del Post */}
      <div className="pt-2 border-t border-eco-border/60 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Botón Calificar con Rúbrica */}
          {isAuthor ? (
            <span
              title="No puedes calificar tu propia evidencia"
              className="text-xs text-eco-muted/70 italic flex items-center gap-1 font-body"
            >
              <AlertCircle size={13} /> Tu publicación (autocalificación no permitida)
            </span>
          ) : hasEvaluated ? (
            <span
              title="Ya registraste una evaluación para esta evidencia"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-heading font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20"
            >
              <CheckCircle2 size={14} /> Ya calificaste esta evidencia
            </span>
          ) : isStudent ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onEvaluate(post)}
              leftIcon={<Award size={15} />}
              className="bg-eco-cyan text-black hover:bg-eco-cyan/90 border-eco-cyan font-bold"
            >
              Revisar Evidencia (+5 pts Eco-Aura)
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onEvaluate(post)}
              leftIcon={<Award size={15} />}
            >
              Calificar con Rúbrica {isOfficialEvaluator ? '(Oficial)' : ''}
            </Button>
          )}

          {/* Botón Ver Evaluaciones e Historial */}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onViewDetail(post)}
            leftIcon={<MessageSquare size={14} />}
          >
            Ver Evaluaciones ({evaluationsList.length})
          </Button>
        </div>

        {/* Botón Eliminar (Autor o ADMIN) */}
        {canDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(post)}
            title="Desactivar publicación"
            aria-label="Desactivar publicación"
            className="text-eco-muted hover:text-red-400 hover:bg-red-500/10 p-2"
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>
    </article>
  )
}

export default PostCard
