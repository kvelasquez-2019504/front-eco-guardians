import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Edit2, Sparkles } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { SelectField } from '../../molecules/SelectField.jsx'
import { TextField } from '../../molecules/TextField.jsx'
import { LevelStageBadge } from '../../molecules/LevelStageBadge.jsx'
import { ClassTypeBadge } from '../../molecules/ClassTypeBadge.jsx'
import {
  validateClassSection,
  validateClassCareer,
  validateAcademicYear,
} from '@/shared/validator/classValidators.js'

/**
 * Organismo: ClassEditModal
 * Modal para actualizar los datos generales de una clase existente (PUT /class/:id).
 * Permite ajustar la sección escolar, docente titular, carrera técnica (si diversificado) y ciclo lectivo.
 * Ubicado en: src/components/organisms/class/
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar modal
 * @param {Object} props.classGroup - Datos actuales de la clase
 * @param {Function} props.onSave - Callback al confirmar edición (id, data)
 * @param {boolean} [props.loading=false] - Estado de guardado
 * @param {Array} [props.careersList=[]] - Catálogo de especialidades técnicas
 * @param {Array} [props.teachersList=[]] - Catálogo de profesores activos
 */
export const ClassEditModal = ({
  isOpen,
  onClose,
  classGroup,
  onSave,
  loading = false,
  careersList = [],
  teachersList = [],
}) => {
  const isDiversificado = classGroup?.level?.stage === 'DIVERSIFICADO'
  const allowedSections = classGroup?.level?.allowedSections || ['A', 'B', 'C', 'D']

  const [selectedSection, setSelectedSection] = useState(classGroup?.section || '')
  const [selectedCareerId, setSelectedCareerId] = useState(classGroup?.career?.uid || '')
  const [selectedTeacherId, setSelectedTeacherId] = useState(classGroup?.teacher?.uid || '')

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      academicYear: classGroup?.academicYear || 2026,
    },
  })

  if (!isOpen || !classGroup) return null

  const onSubmit = (formData) => {
    // Validar sección
    const sectionVal = validateClassSection(selectedSection, allowedSections)
    if (sectionVal !== true) {
      setError('section', { type: 'manual', message: sectionVal })
      return
    }

    // Validar carrera si es Diversificado
    if (isDiversificado) {
      const careerVal = validateClassCareer(selectedCareerId, 'DIVERSIFICADO')
      if (careerVal !== true) {
        setError('careerId', { type: 'manual', message: careerVal })
        return
      }
    }

    onSave(classGroup.uid, {
      section: selectedSection,
      careerId: isDiversificado ? selectedCareerId : undefined,
      teacherId: selectedTeacherId || undefined,
      academicYear: formData.academicYear || 2026,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-edit-class-title"
        className="bg-eco-card border border-eco-border rounded-3xl w-full max-w-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Cabecera del modal */}
        <div className="p-6 border-b border-eco-border flex items-center justify-between bg-eco-bg/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-eco-green/10 text-eco-green rounded-xl border border-eco-green/20">
              <Edit2 size={22} />
            </div>
            <div>
              <H3 id="modal-edit-class-title" className="text-eco-text">
                Editar Clase
              </H3>
              <p className="text-xs text-eco-muted font-body">
                Modifica los parámetros académicos y la asignación docente
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Cerrar modal"
            className="text-eco-muted hover:text-eco-text p-2 rounded-xl hover:bg-eco-border/50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {/* Resumen Informativo del Grado */}
          <div className="p-4 rounded-2xl bg-eco-bg border border-eco-border flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-eco-muted font-body">Grado Escolar:</span>
              <span className="font-heading font-bold text-sm text-eco-text">
                {classGroup.level?.name || 'Nivel Escolar'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LevelStageBadge stage={classGroup.level?.stage || 'BASICO'} />
              <ClassTypeBadge type={classGroup.type} />
            </div>
          </div>

          {/* 1. Selección de Sección */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-heading font-bold text-eco-text uppercase tracking-wider">
                Sección Escolar *
              </label>
              <span className="text-[11px] text-eco-muted font-body">
                Secciones permitidas para este grado
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {allowedSections.map((sec) => {
                const isChosen = selectedSection === sec
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => {
                      setSelectedSection(sec)
                      clearErrors('section')
                    }}
                    disabled={loading}
                    className={`w-12 h-11 rounded-xl font-heading font-bold text-sm transition-all duration-200 border cursor-pointer ${
                      isChosen
                        ? 'bg-eco-green text-eco-bg border-eco-green shadow-md scale-105'
                        : 'bg-eco-bg text-eco-text border-eco-border hover:border-eco-green/50'
                    }`}
                  >
                    {sec}
                  </button>
                )
              })}
            </div>
            {errors.section && (
              <p className="text-xs text-red-400 font-body">{errors.section.message}</p>
            )}
          </div>

          {/* 2. Especialidad Técnica (si es DIVERSIFICADO) */}
          {isDiversificado && (
            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-bold text-eco-text uppercase tracking-wider">
                Especialidad Técnica (Carrera) *
              </label>
              <select
                value={selectedCareerId}
                onChange={(e) => {
                  setSelectedCareerId(e.target.value)
                  clearErrors('careerId')
                }}
                disabled={loading}
                aria-label="Seleccionar especialidad técnica"
                className={`w-full px-3.5 py-2.5 rounded-xl font-body text-sm bg-eco-bg text-eco-text border ${
                  errors.careerId ? 'border-red-500' : 'border-eco-border focus:border-eco-green'
                } outline-none transition-all`}
              >
                <option value="">-- Selecciona Especialidad Técnica --</option>
                {careersList.map((car) => (
                  <option key={car.uid} value={car.uid}>
                    {car.name}
                  </option>
                ))}
              </select>
              {errors.careerId && (
                <p className="text-xs text-red-400 font-body">{errors.careerId.message}</p>
              )}
            </div>
          )}

          {/* 3. Docente Titular */}
          <SelectField
            label="Docente Titular"
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            disabled={loading}
            options={[
              { value: '', label: '-- Sin docente titular asignado --' },
              ...teachersList.map((t) => ({
                value: t.uid,
                label: `${t.name} ${t.lastName || ''} (${t.email})`,
              })),
            ]}
          />

          {/* 4. Ciclo Escolar */}
          <TextField
            label="Ciclo Escolar (Año Lectivo)"
            type="number"
            disabled={loading}
            placeholder="2026"
            error={errors.academicYear?.message}
            {...register('academicYear', {
              validate: validateAcademicYear,
            })}
          />

          {/* Previsualización del Nombre Actualizado */}
          <div className="p-4 rounded-2xl bg-eco-green/5 border border-eco-green/20 flex items-center gap-2">
            <Sparkles size={16} className="text-eco-green shrink-0" />
            <span className="text-xs font-heading text-eco-text">
              Identificador actual: <strong className="text-eco-green">{classGroup.name}</strong>
            </span>
          </div>

          {/* Botones de acción */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-eco-border">
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

export default ClassEditModal
