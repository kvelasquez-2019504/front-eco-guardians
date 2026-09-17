import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, Award, Sparkles, CheckCircle } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { TextField } from '../../molecules/TextField.jsx'
import { SelectField } from '../../molecules/SelectField.jsx'
import { getClasses } from '@/service/class.api.js'
import {
  validateBonusPoints,
  validateBonusReason,
  validateClassGroupId,
} from '@/shared/validator/turnValidators.js'

/**
 * Organismo: TurnBonusModal
 * Modal para otorgar bonificación institucional a una sección destacada en su turno de guardia (POST /turn/:id/bonus).
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onAward - Callback al confirmar bono: (turnId, { classGroupId, points, reason })
 * @param {Object} props.turn - Turno semanal al que pertenece el bono
 * @param {Array} [props.defaultClasses=[]] - Clases sugeridas o de turno
 * @param {boolean} [props.loading=false] - Estado de envío
 */
export const TurnBonusModal = ({
  isOpen,
  onClose,
  onAward,
  turn,
  defaultClasses = [],
  loading = false,
}) => {
  const [classesList, setClassesList] = useState([])
  const [fetchingClasses, setFetchingClasses] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      classGroupId: '',
      points: 50,
      reason: 'Excelente desempeño y compromiso ecológico en su turno de guardia.',
    },
  })

  // Cargar clases si no se pasaron como prop
  useEffect(() => {
    if (!isOpen) return

    let ignore = false
    const init = async () => {
      await Promise.resolve()
      if (ignore) return

      if (defaultClasses && defaultClasses.length > 0) {
        setClassesList(defaultClasses)
        reset({
          classGroupId: defaultClasses[0]?.uid || '',
          points: 50,
          reason: 'Excelente desempeño y compromiso ecológico en su turno de guardia.',
        })
        return
      }

      setFetchingClasses(true)
      const res = await getClasses()
      if (ignore) return
      if (!res.error && res.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.classes || [])
        setClassesList(list)
        if (list.length > 0) {
          reset({
            classGroupId: list[0]?.uid || '',
            points: 50,
            reason: 'Excelente desempeño y compromiso ecológico en su turno de guardia.',
          })
        }
      }
      setFetchingClasses(false)
    }

    init()

    return () => {
      ignore = true
    }
  }, [isOpen, defaultClasses, reset])

  if (!isOpen || !turn) return null

  const onSubmit = (formData) => {
    onAward(turn.uid, {
      classGroupId: formData.classGroupId,
      points: Number(formData.points || 50),
      reason: formData.reason?.trim() || undefined,
    })
  }

  const classOptions = classesList.map((c) => ({
    value: c.uid,
    label: `${c.name || 'Clase'} - Sección ${c.section} ${c.career?.name ? `(${c.career.name})` : ''}`,
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-award-bonus-title"
        className="bg-eco-card border border-eco-border rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Cabecera del modal */}
        <div className="p-6 border-b border-eco-border flex items-center justify-between bg-eco-bg/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Award size={22} />
            </div>
            <div>
              <H3 id="modal-award-bonus-title" className="text-eco-text">
                Otorgar Bono de Guardia
              </H3>
              <p className="text-xs text-eco-muted mt-0.5">
                Bimestre {turn.bimester} • Semana {turn.weekNumber}
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

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          {/* Banner descriptivo */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <Sparkles size={20} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200 leading-relaxed">
              <p className="font-semibold text-amber-300">Puntaje Extra Colectivo:</p>
              Premia a la sección que demostró mayor disciplina, limpieza y proactividad ambiental durante su semana de guardia (Kinal).
            </div>
          </div>

          <SelectField
            label="Sección Destacada"
            error={errors.classGroupId?.message}
            options={classOptions}
            disabled={fetchingClasses}
            helperText={fetchingClasses ? 'Cargando secciones...' : 'Selecciona el aula acreedora al bono institucional'}
            {...register('classGroupId', {
              required: 'Debes seleccionar una clase.',
              validate: validateClassGroupId,
            })}
          />

          <TextField
            label="Puntos a Otorgar"
            type="number"
            error={errors.points?.message}
            helperText="Puntaje por defecto institucional: 50 pts"
            {...register('points', {
              required: 'El puntaje es obligatorio.',
              validate: validateBonusPoints,
            })}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-eco-muted uppercase tracking-wider block">
              Motivo o Justificación del Bono
            </label>
            <textarea
              rows={3}
              placeholder="Ej: Cuidado ejemplar de contenedores de reciclaje y apoyo en los pasillos durante recesos..."
              className="w-full bg-eco-bg border border-eco-border rounded-xl p-3 text-sm text-eco-text placeholder:text-eco-muted/60 focus:border-eco-primary focus:ring-1 focus:ring-eco-primary outline-hidden resize-none transition-all"
              {...register('reason', {
                validate: validateBonusReason,
              })}
            />
            {errors.reason && (
              <p className="text-xs text-red-400">{errors.reason.message}</p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="pt-4 border-t border-eco-border flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold border-none"
            >
              <CheckCircle size={18} />
              Asignar Bono (+50 pts)
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
