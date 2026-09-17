import { useForm } from 'react-hook-form'
import { X, CalendarPlus, Sparkles, Info } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { SelectField } from '../../molecules/SelectField.jsx'
import { TextField } from '../../molecules/TextField.jsx'
import { validateBimester, validateStartDate } from '@/shared/validator/turnValidators.js'

/**
 * Organismo: TurnGenerateModal
 * Modal para generar la matriz oficial algorítmica de 8 semanas del bimestre (POST /turn/generate-schedule).
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onGenerate - Callback al confirmar generación
 * @param {boolean} [props.loading=false] - Estado de carga
 */
export const TurnGenerateModal = ({
  isOpen,
  onClose,
  onGenerate,
  loading = false,
}) => {
  // Obtener la fecha del próximo lunes como sugerencia predeterminada
  const getDefaultStartDate = () => {
    const today = new Date()
    const day = today.getDay()
    const diff = (day === 0 ? 1 : 8 - day) // Próximo lunes
    const nextMonday = new Date(today)
    nextMonday.setDate(today.getDate() + (day === 1 ? 0 : diff))
    return nextMonday.toISOString().split('T')[0]
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      bimester: 1,
      startDate: getDefaultStartDate(),
      academicYear: 2026,
    },
  })

  if (!isOpen) return null

  const selectedBimester = Number(watch('bimester') || 1)

  const onSubmit = (formData) => {
    onGenerate({
      bimester: Number(formData.bimester),
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
      academicYear: Number(formData.academicYear || 2026),
    })
  }

  const bimesterOptions = [
    { value: 1, label: 'Bimestre 1 (Ciclo Regular)' },
    { value: 2, label: 'Bimestre 2 (Ciclo Regular)' },
    { value: 3, label: 'Bimestre 3 (Ciclo Regular)' },
    { value: 4, label: 'Bimestre 4 (Exclusión 6to Diversificado por Prácticas)' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-generate-schedule-title"
        className="bg-eco-card border border-eco-border rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Cabecera del modal */}
        <div className="p-6 border-b border-eco-border flex items-center justify-between bg-eco-bg/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-eco-green/10 text-eco-green rounded-xl border border-eco-green/20">
              <CalendarPlus size={22} />
            </div>
            <div>
              <H3 id="modal-generate-schedule-title" className="text-eco-text">
                Generar Matriz Bimestral
              </H3>
              <p className="text-xs text-eco-muted mt-0.5">
                Programa automático de 8 semanas de guardia (Fundación Kinal)
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          {/* Explicación de la Rotación Oficial Kinal */}
          <div className="p-4 rounded-2xl bg-eco-card-hover/60 border border-eco-border/80 space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-eco-primary font-bold">
              <Sparkles size={16} />
              <span>Esquema de Rotación Oficial ({selectedBimester === 4 ? 'Bimestre 4' : 'Bimestres 1 al 3'}):</span>
            </div>
            <ul className="space-y-1.5 text-eco-muted">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-eco-primary shrink-0" />
                <span><strong>Semanas 1 y 4:</strong> 1ro Básico + 4to Diversificado (Ronda 1 y Revancha)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-eco-primary shrink-0" />
                <span><strong>Semanas 2 y 5:</strong> 2do Básico + 5to Diversificado (Ronda 1 y Revancha)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-eco-primary shrink-0" />
                {selectedBimester === 4 ? (
                  <span><strong>Semanas 3 y 6:</strong> Solo 3ro Básico <em>(6to excluido por prácticas externas)</em></span>
                ) : (
                  <span><strong>Semanas 3 y 6:</strong> 3ro Básico + 6to Diversificado</span>
                )}
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span><strong className="text-amber-300">Semanas 7 y 8:</strong> Gran Final Bimestral (Todos los grados en simultáneo)</span>
              </li>
            </ul>
          </div>

          <SelectField
            label="Bimestre Escolar"
            error={errors.bimester?.message}
            options={bimesterOptions}
            {...register('bimester', {
              required: 'El bimestre es obligatorio.',
              validate: validateBimester,
            })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Fecha Inicio (Semana 1)"
              type="date"
              error={errors.startDate?.message}
              helperText="Fecha sugerida: lunes inicial"
              {...register('startDate', {
                required: 'La fecha inicial es obligatoria.',
                validate: validateStartDate,
              })}
            />

            <TextField
              label="Ciclo Lectivo"
              type="number"
              error={errors.academicYear?.message}
              {...register('academicYear', {
                required: 'El año lectivo es obligatorio.',
                min: { value: 2024, message: 'Año mínimo 2024.' },
                max: { value: 2030, message: 'Año máximo 2030.' },
              })}
            />
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
            <Info size={16} className="shrink-0 mt-0.5 text-amber-400" />
            <p>
              El backend generará automáticamente los 8 registros semanales (de lunes a viernes) asignando los niveles educativos correspondientes a cada turno.
            </p>
          </div>

          {/* Botones de acción del modal */}
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
              <Sparkles size={18} />
              Generar 8 Semanas
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
