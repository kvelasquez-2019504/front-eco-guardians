import { useState, useMemo } from 'react'
import { X, Award, Check, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { RubricCategoryBadge } from '../../molecules/RubricCategoryBadge.jsx'
import { validateEvaluationChecks, validateEvaluationComment } from '@/shared/validator/postValidators.js'

/**
 * Organismo: EvaluatePostModal
 * Modal interactivo para calificar una evidencia ecológica utilizando la rúbrica oficial de Kinal.
 * Implementa el modelo híbrido:
 * - Docentes / Coordinadores / Admin: Evaluación Oficial (suma al podio escolar y verificación).
 * - Estudiantes: Evaluación entre pares (suma a puntaje comunitario y otorga +5 pts Eco-Vigilante al evaluador).
 * Ubicado en: src/components/organisms/post/
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar modal
 * @param {Object} props.post - Publicación a calificar
 * @param {Array} [props.rubricCriteria=[]] - Criterios activos de la rúbrica
 * @param {Function} props.onSave - Callback al enviar evaluación (postId, { checks, comment })
 * @param {boolean} [props.loading=false] - Estado de guardado
 * @param {Object} [props.currentAuthUser] - Usuario evaluador
 */
export const EvaluatePostModal = ({
  isOpen,
  onClose,
  post,
  rubricCriteria = [],
  onSave,
  loading = false,
  currentAuthUser,
}) => {
  // Mapa de criterios evaluados: { [criterionId]: boolean }
  const [checkedMap, setCheckedMap] = useState({})
  const [comment, setComment] = useState('')
  const [validationError, setValidationError] = useState('')

  const isStudent = currentAuthUser?.role === 'STUDENT'
  const isOfficialEvaluator = !isStudent

  // Calcular puntaje total acumulado en la evaluación
  const totalCalculatedScore = useMemo(() => {
    return rubricCriteria.reduce((acc, cr) => {
      if (checkedMap[cr.uid]) {
        return acc + (Number(cr.points) || 0)
      }
      return acc
    }, 0)
  }, [rubricCriteria, checkedMap])

  if (!isOpen || !post) return null

  const toggleCriterion = (criterionId) => {
    setValidationError('')
    setCheckedMap((prev) => ({
      ...prev,
      [criterionId]: !prev[criterionId],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Preparar arreglo de checks
    const checks = rubricCriteria.map((cr) => ({
      criterionId: cr.uid,
      achieved: Boolean(checkedMap[cr.uid]),
    }))

    const checksVal = validateEvaluationChecks(checks)
    if (checksVal !== true) {
      setValidationError(checksVal)
      return
    }

    const commentVal = validateEvaluationComment(comment)
    if (commentVal !== true) {
      setValidationError(commentVal)
      return
    }

    setValidationError('')
    onSave(post.uid, {
      checks,
      comment: comment.trim() || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-evaluate-title"
        className="bg-eco-card border border-eco-border rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Cabecera del modal */}
        <div className="p-6 border-b border-eco-border flex items-center justify-between bg-eco-bg/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-eco-green/10 text-eco-green rounded-xl border border-eco-green/20">
              <Award size={22} />
            </div>
            <div>
              <H3 id="modal-evaluate-title" className="text-eco-text">
                Calificar con Rúbrica Oficial
              </H3>
              <p className="text-xs text-eco-muted font-body">
                Evidencia de:{' '}
                <strong className="text-eco-text">
                  {post.student?.name} {post.student?.lastName}
                </strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Cerrar modal"
            className="text-eco-muted hover:text-eco-text p-2 rounded-xl hover:bg-eco-border/50 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1">
          {/* Banner de Impacto según el Rol del Evaluador */}
          {isOfficialEvaluator ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
              <ShieldCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-heading font-bold text-xs text-emerald-400 block">
                  Evaluación Oficial Docente / Coordinación
                </span>
                <p className="text-xs text-eco-muted font-body mt-0.5 leading-relaxed">
                  Tu calificación sumará al puntaje oficial del aula para el ranking escolar y otorgará la verificación oficial a esta evidencia.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-eco-cyan/10 border border-eco-cyan/25 flex items-start gap-3">
              <Sparkles size={20} className="text-eco-cyan shrink-0 mt-0.5" />
              <div>
                <span className="font-heading font-bold text-xs text-eco-cyan block">
                  Evaluación entre Pares (Recompensa Eco-Vigilante)
                </span>
                <p className="text-xs text-eco-muted font-body mt-0.5 leading-relaxed">
                  Al completar esta evaluación ganarás automáticamente{' '}
                  <strong className="text-eco-green">+5 puntos de Eco-Aura</strong> por tu labor como Eco-Vigilante escolar.
                </p>
              </div>
            </div>
          )}

          {/* Lista de Cotejo de Criterios de la Rúbrica */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-heading font-bold text-eco-text uppercase tracking-wider">
                Lista de Cotejo ({rubricCriteria.length} criterios oficiales)
              </label>
              <span className="text-xs font-heading font-extrabold text-eco-green">
                Puntaje a otorgar: +{totalCalculatedScore} pts
              </span>
            </div>

            {rubricCriteria.length === 0 ? (
              <p className="p-6 text-center text-xs text-eco-muted font-body bg-eco-bg rounded-xl border border-eco-border">
                No hay criterios activos en la rúbrica escolar para calificar.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {rubricCriteria.map((cr) => {
                  const isAchieved = Boolean(checkedMap[cr.uid])

                  return (
                    <div
                      key={cr.uid}
                      onClick={() => toggleCriterion(cr.uid)}
                      className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer select-none ${
                        isAchieved
                          ? 'bg-eco-green/10 border-eco-green shadow-xs'
                          : 'bg-eco-bg/80 border-eco-border hover:border-eco-green/40'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-5 h-5 mt-0.5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                            isAchieved
                              ? 'bg-eco-green border-eco-green text-eco-bg'
                              : 'border-eco-border bg-eco-card'
                          }`}
                        >
                          {isAchieved && <Check size={13} strokeWidth={3} />}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="font-heading font-bold text-xs text-eco-text">
                            {cr.title}
                          </span>
                          {cr.description && (
                            <p className="text-[11px] text-eco-muted font-body leading-relaxed mt-0.5">
                              {cr.description}
                            </p>
                          )}
                          <div className="pt-1">
                            <RubricCategoryBadge category={cr.category} />
                          </div>
                        </div>
                      </div>

                      <span className="font-heading font-black text-xs text-eco-green shrink-0 px-2 py-0.5 bg-eco-card rounded-md border border-eco-border">
                        +{cr.points} pts
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Campo de Comentarios y Retroalimentación */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-bold text-eco-text uppercase tracking-wider">
              Retroalimentación u Observación (Opcional)
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={loading}
              placeholder="Escribe una observación constructiva sobre la acción ecológica..."
              className="w-full px-3.5 py-2.5 rounded-xl font-body text-xs text-eco-text bg-eco-bg border border-eco-border focus:border-eco-green outline-none transition-all resize-none placeholder:text-eco-muted"
            />
          </div>

          {/* Error de validación */}
          {validationError && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Botones de acción */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-eco-border">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading || rubricCriteria.length === 0}
              isLoading={loading}
              leftIcon={<Award size={16} />}
            >
              Registrar Evaluación (+{totalCalculatedScore} pts)
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EvaluatePostModal
