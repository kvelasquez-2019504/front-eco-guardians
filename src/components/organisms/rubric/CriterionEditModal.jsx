import { useForm } from 'react-hook-form'
import { X, Edit2, Award } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { TextField } from '../../molecules/TextField.jsx'
import { SelectField } from '../../molecules/SelectField.jsx'
import {
  validateCriterionTitle,
  validateCriterionPoints,
  validateCriterionCategory,
  validateCriterionOrder,
  validateCriterionDescription,
} from '@/shared/validator/rubricValidators.js'

/**
 * Organismo: CriterionEditModal
 * Modal interactivo para actualizar los datos de un criterio evaluable (PUT /rubric/:id).
 * Ubicado en: src/components/organisms/rubric/
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.criterion - Criterio a editar
 * @param {Function} props.onSave - Callback al confirmar actualización (id, data)
 * @param {boolean} [props.loading=false] - Estado de guardado
 */
export const CriterionEditModal = ({
  isOpen,
  onClose,
  criterion,
  onSave,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    values: {
      title: criterion?.title || '',
      points: criterion?.points || 1,
      category: criterion?.category || 'GENERAL',
      order: criterion?.order ?? 0,
      description: criterion?.description || '',
    },
  })

  if (!isOpen || !criterion) return null

  const onSubmit = (formData) => {
    onSave(criterion.uid, formData)
  }

  const categoryOptions = [
    { value: 'GENERAL', label: 'General (Cultura y conducta ambiental)' },
    { value: 'CLASIFICACION', label: 'Clasificación (Separación de residuos)' },
    { value: 'LIMPIEZA', label: 'Limpieza (Higiene de instalaciones y áreas)' },
    { value: 'ORDEN', label: 'Orden (Disposición y mantenimiento de puntos)' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-edit-criterion-title"
        className="bg-eco-card border border-eco-border rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Cabecera del modal */}
        <div className="p-6 border-b border-eco-border flex items-center justify-between bg-eco-bg/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-eco-green/10 text-eco-green rounded-xl border border-eco-green/20">
              <Award size={22} />
            </div>
            <div>
              <H3 id="modal-edit-criterion-title" className="text-eco-text">
                Editar Criterio de Evaluación
              </H3>
              <p className="text-xs text-eco-muted font-body">
                Actualiza los lineamientos de evaluación y puntaje oficial
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

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
          {/* Título */}
          <TextField
            label="Título del Criterio *"
            disabled={loading}
            error={errors.title?.message}
            {...register('title', {
              validate: validateCriterionTitle,
            })}
          />

          {/* Puntaje y Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Puntaje Otorgado (pts) *"
              type="number"
              disabled={loading}
              error={errors.points?.message}
              {...register('points', {
                validate: validateCriterionPoints,
              })}
            />

            <SelectField
              label="Categoría Oficial *"
              disabled={loading}
              error={errors.category?.message}
              options={categoryOptions}
              {...register('category', {
                validate: validateCriterionCategory,
              })}
            />
          </div>

          {/* Orden */}
          <TextField
            label="Orden de Presentación (Índice numérico)"
            type="number"
            disabled={loading}
            error={errors.order?.message}
            {...register('order', {
              validate: validateCriterionOrder,
            })}
          />

          {/* Descripción */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-bold text-eco-text uppercase tracking-wider">
              Condiciones de Cumplimiento (Descripción)
            </label>
            <textarea
              rows={3}
              disabled={loading}
              className={`w-full px-3.5 py-2.5 rounded-xl font-body text-sm bg-eco-bg text-eco-text border ${
                errors.description ? 'border-red-500' : 'border-eco-border focus:border-eco-green'
              } outline-none transition-all resize-none placeholder:text-eco-muted`}
              {...register('description', {
                validate: validateCriterionDescription,
              })}
            />
            {errors.description && (
              <p className="text-xs text-red-400 font-body">{errors.description.message}</p>
            )}
          </div>

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
              disabled={loading}
              isLoading={loading}
              leftIcon={<Edit2 size={16} />}
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CriterionEditModal
