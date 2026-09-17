import { useForm } from 'react-hook-form'
import { X, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { SelectField } from '../../molecules/SelectField.jsx'
import { TextField } from '../../molecules/TextField.jsx'
import { validateBimesterNumber, validateCloseBimesterNotes } from '@/shared/validator/rankingValidators.js'

/**
 * Organismo: CloseBimesterModal
 * Modal para ejecutar el cierre oficial de un bimestre y congelar ganadores de forma inmutable (POST /ranking/close-bimester).
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onConfirm - Callback al confirmar el cierre
 * @param {boolean} [props.loading=false] - Estado de envío
 */
export const CloseBimesterModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      bimester: 1,
      academicYear: 2026,
      notes: 'Cierre oficial y premiación de secciones y estudiantes de Fundación Kinal.',
    },
  })

  if (!isOpen) return null

  const onSubmit = (formData) => {
    onConfirm({
      bimester: Number(formData.bimester),
      academicYear: Number(formData.academicYear || 2026),
      notes: formData.notes?.trim() || undefined,
    })
  }

  const bimesterOptions = [
    { value: 1, label: 'Bimestre 1' },
    { value: 2, label: 'Bimestre 2' },
    { value: 3, label: 'Bimestre 3' },
    { value: 4, label: 'Bimestre 4' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-close-bimester-title"
        className="bg-eco-card border border-eco-border rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Cabecera del modal */}
        <div className="p-6 border-b border-eco-border flex items-center justify-between bg-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Lock size={22} />
            </div>
            <div>
              <H3 id="modal-close-bimester-title" className="text-eco-text text-lg">
                Cierre Oficial de Bimestre
              </H3>
              <p className="text-xs text-amber-300 mt-0.5">
                Congelamiento inmutable de podios y ganadores
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
          {/* Alerta Institucional */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs text-amber-200">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <AlertTriangle size={16} />
              <span>Acción Institucional Permanente:</span>
            </div>
            <p className="leading-relaxed">
              Al ejecutar el cierre, el sistema congelará de manera permanente en la base de datos:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-eco-muted">
              <li>Podio de secciones de <strong>Ciclo Básico</strong> (1º, 2º y 3º).</li>
              <li>Podio de secciones técnicas de <strong>Diversificado</strong> (1º, 2º y 3º).</li>
              <li>Podio <strong>General Institucional</strong> de todo el colegio.</li>
              <li>Top 10 de estudiantes líderes en <strong>Eco-Aura</strong>.</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="Bimestre a Cerrar"
              error={errors.bimester?.message}
              options={bimesterOptions}
              {...register('bimester', {
                required: 'El bimestre es obligatorio.',
                validate: validateBimesterNumber,
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

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-eco-muted uppercase tracking-wider block">
              Notas u Observaciones del Cierre
            </label>
            <textarea
              rows={3}
              placeholder="Ej: Ceremonia de premiación bimestral, mención de honor para..."
              className="w-full bg-eco-bg border border-eco-border rounded-xl p-3 text-sm text-eco-text placeholder:text-eco-muted/60 focus:border-eco-primary focus:ring-1 focus:ring-eco-primary outline-hidden resize-none transition-all"
              {...register('notes', {
                validate: validateCloseBimesterNotes,
              })}
            />
            {errors.notes && (
              <p className="text-xs text-red-400">{errors.notes.message}</p>
            )}
          </div>

          {/* Botones de Acción */}
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
              <CheckCircle2 size={18} />
              Cerrar y Congelar Podio
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
