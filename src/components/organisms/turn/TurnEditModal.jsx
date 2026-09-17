import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, Save, Edit3, ShieldCheck } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { TextField } from '../../molecules/TextField.jsx'
import { getLevels } from '@/service/level.api.js'
import {
  validateStartDate,
  validateEndDate,
} from '@/shared/validator/turnValidators.js'

/**
 * Organismo: TurnEditModal
 * Modal interactivo para actualizar fechas, notas y niveles de un turno semanal (PUT /turn/:id).
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onUpdate - Callback al confirmar actualización (id, data)
 * @param {Object} props.turn - Objeto del turno a editar
 * @param {boolean} [props.loading=false] - Estado de guardado
 */
export const TurnEditModal = ({
  isOpen,
  onClose,
  onUpdate,
  turn,
  loading = false,
}) => {
  const [availableLevels, setAvailableLevels] = useState([])
  const [selectedLevels, setSelectedLevels] = useState([])
  const [levelsLoading, setLevelsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  })

  const startDateVal = watch('startDate')
  const isAllLevelsActiveVal = watch('isAllLevelsActive')

  useEffect(() => {
    if (!isOpen) return

    const fetchLevels = async () => {
      setLevelsLoading(true)
      const res = await getLevels()
      if (!res.error && res.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.levels || [])
        setAvailableLevels(list)
      }
      setLevelsLoading(false)
    }

    fetchLevels()
  }, [isOpen])

  // Cargar valores iniciales del turno seleccionado
  useEffect(() => {
    if (isOpen && turn) {
      const formatDate = (dateStr) => {
        if (!dateStr) return ''
        return dateStr.split('T')[0]
      }

      reset({
        startDate: formatDate(turn.startDate),
        endDate: formatDate(turn.endDate),
        academicYear: turn.academicYear || 2026,
        isAllLevelsActive: Boolean(turn.isAllLevelsActive),
        notes: turn.notes || '',
      })

      if (turn.activeLevels && Array.isArray(turn.activeLevels)) {
        const uids = turn.activeLevels.map((lvl) => (typeof lvl === 'string' ? lvl : lvl.uid))
        setSelectedLevels(uids)
      } else {
        setSelectedLevels([])
      }
    }
  }, [isOpen, turn, reset])

  if (!isOpen || !turn) return null

  const handleToggleLevel = (uid) => {
    setSelectedLevels((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    )
  }

  const onSubmit = (formData) => {
    onUpdate(turn.uid, {
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      academicYear: Number(formData.academicYear || 2026),
      isAllLevelsActive: Boolean(formData.isAllLevelsActive),
      activeLevels: formData.isAllLevelsActive ? [] : selectedLevels,
      notes: formData.notes?.trim() || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-edit-turn-title"
        className="bg-eco-card border border-eco-border rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Cabecera del modal */}
        <div className="p-6 border-b border-eco-border flex items-center justify-between bg-eco-bg/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-eco-primary/10 text-eco-primary rounded-xl border border-eco-primary/20">
              <Edit3 size={22} />
            </div>
            <div>
              <H3 id="modal-edit-turn-title" className="text-eco-text">
                Editar Turno: Bimestre {turn.bimester} - Semana {turn.weekNumber}
              </H3>
              <p className="text-xs text-eco-muted mt-0.5">
                Modificar calendario de guardia y grados participantes
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Fecha de Inicio"
              type="date"
              error={errors.startDate?.message}
              {...register('startDate', {
                required: 'La fecha de inicio es obligatoria.',
                validate: validateStartDate,
              })}
            />

            <TextField
              label="Fecha de Fin"
              type="date"
              error={errors.endDate?.message}
              {...register('endDate', {
                required: 'La fecha de fin es obligatoria.',
                validate: (val) => validateEndDate(val, startDateVal),
              })}
            />
          </div>

          <TextField
            label="Ciclo Lectivo"
            type="number"
            error={errors.academicYear?.message}
            {...register('academicYear', {
              required: 'El año lectivo es obligatorio.',
              min: { value: 2024, message: 'Mínimo 2024.' },
              max: { value: 2030, message: 'Máximo 2030.' },
            })}
          />

          {/* Gran Final Checkbox */}
          <div className="p-3 rounded-2xl bg-eco-card-hover/50 border border-eco-border flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="editIsAllLevelsActive" className="text-sm font-semibold text-eco-text cursor-pointer flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-amber-400" />
                Gran Final Bimestral
              </label>
              <p className="text-xs text-eco-muted">
                Habilita la participación simultánea de todos los niveles educativos
              </p>
            </div>
            <input
              id="editIsAllLevelsActive"
              type="checkbox"
              className="w-5 h-5 rounded border-eco-border text-eco-primary focus:ring-eco-primary cursor-pointer accent-eco-primary"
              {...register('isAllLevelsActive')}
            />
          </div>

          {/* Selector de Niveles Educativos Activos */}
          {!isAllLevelsActiveVal && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-eco-muted uppercase tracking-wider block">
                Niveles Educativos de Guardia
              </label>
              {levelsLoading ? (
                <p className="text-xs text-eco-muted animate-pulse">Cargando niveles...</p>
              ) : availableLevels.length === 0 ? (
                <p className="text-xs text-eco-muted">No se encontraron niveles educativos.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto custom-scrollbar p-1">
                  {availableLevels.map((lvl) => {
                    const isChecked = selectedLevels.includes(lvl.uid)
                    return (
                      <button
                        key={lvl.uid}
                        type="button"
                        onClick={() => handleToggleLevel(lvl.uid)}
                        className={`
                          p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between
                          ${isChecked
                            ? 'bg-eco-green/15 border-eco-green text-eco-text font-medium'
                            : 'bg-eco-card-hover/40 border-eco-border text-eco-muted hover:text-eco-text'}
                        `}
                      >
                        <span className="truncate">{lvl.name}</span>
                        <span className="text-[10px] uppercase text-eco-muted shrink-0 ml-1.5">{lvl.stage}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Observaciones */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-eco-muted uppercase tracking-wider block">
              Notas u Observaciones
            </label>
            <textarea
              rows={2}
              placeholder="Notas sobre este turno..."
              className="w-full bg-eco-bg border border-eco-border rounded-xl p-3 text-sm text-eco-text placeholder:text-eco-muted/60 focus:border-eco-primary focus:ring-1 focus:ring-eco-primary outline-hidden resize-none transition-all"
              {...register('notes')}
            />
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
              className="gap-2"
            >
              <Save size={18} />
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
