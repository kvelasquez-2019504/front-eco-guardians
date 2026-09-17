import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, Plus, ShieldCheck } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { TextField } from '../../molecules/TextField.jsx'
import { SelectField } from '../../molecules/SelectField.jsx'
import { getLevels } from '@/service/level.api.js'
import {
  validateBimester,
  validateWeekNumber,
  validateStartDate,
  validateEndDate,
} from '@/shared/validator/turnValidators.js'

/**
 * Organismo: TurnCreateModal
 * Modal interactivo para registrar un turno semanal de manera manual (POST /turn).
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSave - Callback al confirmar creación
 * @param {boolean} [props.loading=false] - Estado de guardado
 */
export const TurnCreateModal = ({
  isOpen,
  onClose,
  onSave,
  loading = false,
}) => {
  const [availableLevels, setAvailableLevels] = useState([])
  const [selectedLevels, setSelectedLevels] = useState([])
  const [levelsLoading, setLevelsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      bimester: 1,
      weekNumber: 1,
      startDate: '',
      endDate: '',
      academicYear: 2026,
      isAllLevelsActive: false,
      notes: '',
    },
  })

  const startDateVal = watch('startDate')
  const isAllLevelsActiveVal = watch('isAllLevelsActive')

  // Cargar niveles educativos activos al abrir el modal
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

  if (!isOpen) return null

  const handleToggleLevel = (uid) => {
    setSelectedLevels((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    )
  }

  const onSubmit = (formData) => {
    onSave({
      bimester: Number(formData.bimester),
      weekNumber: Number(formData.weekNumber),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      academicYear: Number(formData.academicYear || 2026),
      isAllLevelsActive: Boolean(formData.isAllLevelsActive),
      activeLevels: formData.isAllLevelsActive ? [] : selectedLevels,
      notes: formData.notes?.trim() || undefined,
    })
  }

  const bimesterOptions = [
    { value: 1, label: 'Bimestre 1' },
    { value: 2, label: 'Bimestre 2' },
    { value: 3, label: 'Bimestre 3' },
    { value: 4, label: 'Bimestre 4' },
  ]

  const weekOptions = Array.from({ length: 8 }, (_, i) => ({
    value: i + 1,
    label: `Semana ${i + 1} ${i >= 6 ? '(Gran Final)' : ''}`,
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-create-turn-title"
        className="bg-eco-card border border-eco-border rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Cabecera del modal */}
        <div className="p-6 border-b border-eco-border flex items-center justify-between bg-eco-bg/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-eco-green/10 text-eco-green rounded-xl border border-eco-green/20">
              <Plus size={22} />
            </div>
            <div>
              <H3 id="modal-create-turn-title" className="text-eco-text">
                Nuevo Turno Semanal
              </H3>
              <p className="text-xs text-eco-muted mt-0.5">
                Configuración manual de ronda de guardianes ecológicos
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
            <SelectField
              label="Bimestre"
              error={errors.bimester?.message}
              options={bimesterOptions}
              {...register('bimester', {
                required: 'El bimestre es obligatorio.',
                validate: validateBimester,
              })}
            />

            <SelectField
              label="Semana del Bimestre"
              error={errors.weekNumber?.message}
              options={weekOptions}
              {...register('weekNumber', {
                required: 'La semana es obligatoria.',
                validate: validateWeekNumber,
              })}
            />
          </div>

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
              <label htmlFor="isAllLevelsActive" className="text-sm font-semibold text-eco-text cursor-pointer flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-amber-400" />
                Gran Final Bimestral
              </label>
              <p className="text-xs text-eco-muted">
                Habilita la participación simultánea de todos los niveles educativos
              </p>
            </div>
            <input
              id="isAllLevelsActive"
              type="checkbox"
              className="w-5 h-5 rounded border-eco-border text-eco-primary focus:ring-eco-primary cursor-pointer accent-eco-primary"
              {...register('isAllLevelsActive')}
            />
          </div>

          {/* Selector de Niveles Educativos Activos (si no es gran final) */}
          {!isAllLevelsActiveVal && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-eco-muted uppercase tracking-wider block">
                Niveles Educativos de Guardia
              </label>
              {levelsLoading ? (
                <p className="text-xs text-eco-muted animate-pulse">Cargando niveles...</p>
              ) : availableLevels.length === 0 ? (
                <p className="text-xs text-eco-muted">No se encontraron niveles educativos registrados.</p>
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
              Notas u Observaciones (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ej: Semana de enfoque en reducción de residuos plásticos..."
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
              <Plus size={18} />
              Guardar Turno
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
