import { useForm } from 'react-hook-form'
import { X, Briefcase } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { TextField } from '../../molecules/TextField.jsx'
import {
  validateCareerName,
  validateCareerDescription,
} from '@/shared/validator/careerValidators.js'

/**
 * Organismo: CareerCreateModal
 * Modal para registrar una nueva carrera técnica en Eco-Guardianes (POST /career).
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSave - Callback al confirmar registro (formData)
 * @param {boolean} [props.loading=false] - Estado de guardado
 */
export const CareerCreateModal = ({
  isOpen,
  onClose,
  onSave,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      description: '',
    },
  })

  if (!isOpen) return null

  const onSubmit = (formData) => {
    onSave(formData)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-career-title"
    >
      <div className="relative w-full max-w-lg bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-3 border-b border-eco-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-eco-green/15 text-eco-green border border-eco-green/30">
              <Briefcase size={20} />
            </div>
            <div>
              <H3 id="create-career-title" variant="primary">
                Registrar Carrera Técnica
              </H3>
              <p className="text-xs text-eco-muted font-body mt-0.5">
                Alta de especialidad vocacional en Fundación Kinal
              </p>
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

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Nombre de la Carrera */}
          <TextField
            id="career-name"
            label="Nombre de la Especialidad"
            placeholder="Informática, Dibujo Técnico, etc."
            required
            error={errors.name?.message}
            {...register('name', { validate: validateCareerName })}
          />

          {/* Descripción */}
          <div className="flex flex-col gap-1.5 w-full">
            <label
              htmlFor="career-description"
              className="text-xs font-heading font-bold text-eco-text"
            >
              Descripción de Competencias (Opcional)
            </label>
            <textarea
              id="career-description"
              rows={3}
              placeholder="Competencias técnicas, áreas de aprendizaje y proyectos formativos..."
              className="w-full px-4 py-2.5 rounded-xl font-body text-sm text-eco-text bg-eco-bg/90 border border-eco-border focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 outline-none transition-all duration-200 placeholder:text-eco-muted resize-none"
              {...register('description', { validate: validateCareerDescription })}
            />
            {errors.description && (
              <p className="text-xs text-red-400 font-body mt-0.5">
                {errors.description.message}
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
              isLoading={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Carrera'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CareerCreateModal
