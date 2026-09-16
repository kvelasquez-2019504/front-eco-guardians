import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Check } from 'lucide-react'
import { H3 } from '../atoms/Heading.jsx'
import { Button } from '../atoms/Button.jsx'
import { TextField } from '../molecules/TextField.jsx'
import { SelectField } from '../molecules/SelectField.jsx'
import {
  validateLevelName,
  validateLevelStage,
  validateGradeNumber,
} from '@/shared/validator/levelValidators.js'

const DEFAULT_SECTIONS_POOL = ['A', 'B', 'C', 'D', 'E', 'F']

/**
 * Organismo: LevelEditModal
 * Modal interactivo para actualizar un nivel educativo existente (PUT /level/:id).
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.level - Nivel seleccionado para edición
 * @param {Function} props.onSave - Callback al confirmar edición (uid, formData)
 * @param {boolean} [props.loading=false] - Estado de guardado
 * @param {Array<string>} [props.availableStages=[]] - Lista de etapas
 */
export const LevelEditModal = ({
  isOpen,
  onClose,
  level,
  onSave,
  loading = false,
  availableStages = [],
}) => {
  const [selectedSections, setSelectedSections] = useState(() =>
    Array.isArray(level?.allowedSections) ? level.allowedSections : []
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: level?.name || '',
      stage: level?.stage || 'BASICO',
      gradeNumber: level?.gradeNumber || 1,
    },
  })

  if (!isOpen || !level) return null

  const toggleSection = (sectionLetter) => {
    setSelectedSections((prev) =>
      prev.includes(sectionLetter)
        ? prev.filter((s) => s !== sectionLetter)
        : [...prev, sectionLetter].sort()
    )
  }

  const onSubmit = (formData) => {
    onSave(level.uid, {
      ...formData,
      allowedSections: selectedSections,
    })
  }

  const stageOptions = availableStages.map((stage) => ({
    value: stage,
    label: stage === 'BASICO' ? 'Ciclo Básico' : 'Ciclo Diversificado',
  }))

  const gradeOptions = [
    { value: 1, label: '1.° Grado' },
    { value: 2, label: '2.° Grado' },
    { value: 3, label: '3.° Grado' },
    { value: 4, label: '4.° Grado' },
    { value: 5, label: '5.° Grado' },
    { value: 6, label: '6.° Grado' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-level-title"
    >
      <div className="relative w-full max-w-lg bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-3 border-b border-eco-border/80 pb-4">
          <div>
            <H3 id="edit-level-title" variant="primary">
              Editar Nivel Educativo
            </H3>
            <p className="text-xs text-eco-muted font-body mt-0.5">
              Actualizando: <span className="text-eco-text font-bold">{level.name}</span>
            </p>
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

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Nombre del Grado */}
          <TextField
            id="edit-level-name"
            label="Nombre del Grado / Nivel"
            placeholder="Primero Básico, Cuarto Bachillerato, etc."
            required
            error={errors.name?.message}
            {...register('name', { validate: validateLevelName })}
          />

          {/* Fila: Etapa y Grado Ordinal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <SelectField
              id="edit-level-stage"
              label="Etapa Académica"
              required
              options={stageOptions}
              error={errors.stage?.message}
              {...register('stage', { validate: validateLevelStage })}
            />

            <SelectField
              id="edit-level-grade"
              label="Número de Grado"
              required
              options={gradeOptions}
              error={errors.gradeNumber?.message}
              {...register('gradeNumber', { validate: validateGradeNumber })}
            />
          </div>

          {/* Selector de Secciones Habilitadas */}
          <div className="space-y-2">
            <label className="text-xs font-heading font-bold text-eco-text block">
              Secciones Habilitadas <span className="text-eco-green">*</span>
            </label>
            <p className="text-xs text-eco-muted font-body">
              Haz clic sobre las letras para activar o desactivar secciones:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {DEFAULT_SECTIONS_POOL.map((sec) => {
                const isSelected = selectedSections.includes(sec)

                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => toggleSection(sec)}
                    className={`
                      px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 border
                      ${
                        isSelected
                          ? 'bg-eco-green text-eco-bg border-eco-green shadow-xs'
                          : 'bg-eco-bg text-eco-muted border-eco-border hover:text-eco-text hover:border-eco-border/80'
                      }
                    `}
                  >
                    {isSelected && <Check size={13} className="stroke-[3]" />}
                    <span>Sección {sec}</span>
                  </button>
                )
              })}
            </div>

            {selectedSections.length === 0 && (
              <p className="text-xs text-red-400 font-body mt-1">
                ⚠️ Debes seleccionar al menos una sección.
              </p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="pt-3 border-t border-eco-border flex items-center justify-end gap-3">
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
              type="submit"
              variant="primary"
              size="md"
              disabled={selectedSections.length === 0}
              isLoading={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LevelEditModal
