import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { X, FolderPlus, Compass, Wrench, Sun, Moon, Sparkles } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { SelectField } from '../../molecules/SelectField.jsx'
import { TextField } from '../../molecules/TextField.jsx'
import {
  validateClassLevel,
  validateClassSection,
  validateClassCareer,
  validateAcademicYear,
} from '@/shared/validator/classValidators.js'

/**
 * Organismo: ClassCreateModal
 * Modal para registrar una nueva clase o sección escolar bajo las reglas institucionales:
 * - Ciclo Básico: GUIA, turno Matutina, sin especialidad técnica.
 * - Diversificado: TALLER, turnos Matutina y Vespertina, con especialidad técnica obligatoria.
 * Ubicado en: src/components/organisms/class/
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar modal
 * @param {Function} props.onSave - Callback al confirmar creación
 * @param {boolean} [props.loading=false] - Estado de envío
 * @param {Array} [props.levelsList=[]] - Catálogo de niveles activos
 * @param {Array} [props.careersList=[]] - Catálogo de carreras técnicas activas
 * @param {Array} [props.teachersList=[]] - Catálogo de profesores activos
 */
export const ClassCreateModal = ({
  isOpen,
  onClose,
  onSave,
  loading = false,
  levelsList = [],
  careersList = [],
  teachersList = [],
}) => {
  const [selectedLevelId, setSelectedLevelId] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedCareerId, setSelectedCareerId] = useState('')
  const [selectedTeacherId, setSelectedTeacherId] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      academicYear: 2026,
    },
  })

  // Nivel seleccionado actualmente
  const selectedLevel = useMemo(() => {
    return levelsList.find((lvl) => lvl.uid === selectedLevelId) || null
  }, [levelsList, selectedLevelId])

  const isDiversificado = selectedLevel?.stage === 'DIVERSIFICADO'
  const allowedSections = selectedLevel?.allowedSections || ['A', 'B', 'C', 'D']

  // Carrera seleccionada
  const selectedCareer = useMemo(() => {
    return careersList.find((c) => c.uid === selectedCareerId) || null
  }, [careersList, selectedCareerId])

  // Previsualización del nombre institucional autogenerado
  const previewName = useMemo(() => {
    if (!selectedLevel) return 'Selecciona un nivel educativo para previsualizar la clase...'
    const secStr = selectedSection ? `Sección ${selectedSection}` : 'Sección [?]'

    if (isDiversificado) {
      const carStr = selectedCareer ? selectedCareer.name : '[Seleccionar Carrera]'
      return `${selectedLevel.name} - ${carStr} - ${secStr}`
    }

    return `${selectedLevel.name} - ${secStr}`
  }, [selectedLevel, isDiversificado, selectedCareer, selectedSection])

  if (!isOpen) return null

  const handleLevelChange = (e) => {
    const nextLevelId = e.target.value
    setSelectedLevelId(nextLevelId)
    setSelectedSection('')
    clearErrors('levelId')
    clearErrors('section')
    clearErrors('careerId')
  }

  const handleSectionSelect = (sectionChar) => {
    setSelectedSection(sectionChar)
    setValue('section', sectionChar)
    clearErrors('section')
  }

  const onSubmit = (formData) => {
    // Validar nivel
    const levelVal = validateClassLevel(selectedLevelId)
    if (levelVal !== true) {
      setError('levelId', { type: 'manual', message: levelVal })
      return
    }

    // Validar sección contra allowedSections
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

    onSave({
      levelId: selectedLevelId,
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
        aria-labelledby="modal-create-class-title"
        className="bg-eco-card border border-eco-border rounded-3xl w-full max-w-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Cabecera del modal */}
        <div className="p-6 border-b border-eco-border flex items-center justify-between bg-eco-bg/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-eco-green/10 text-eco-green rounded-xl border border-eco-green/20">
              <FolderPlus size={22} />
            </div>
            <div>
              <H3 id="modal-create-class-title" className="text-eco-text">
                Nueva Clase o Sección
              </H3>
              <p className="text-xs text-eco-muted font-body">
                Configura los parámetros académicos según el grado y ciclo escolar
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
          {/* 1. Selección de Nivel Educativo */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-bold text-eco-text uppercase tracking-wider">
              Nivel Educativo *
            </label>
            <select
              value={selectedLevelId}
              onChange={handleLevelChange}
              disabled={loading}
              aria-label="Seleccionar grado educativo"
              className={`w-full px-3.5 py-2.5 rounded-xl font-body text-sm bg-eco-bg text-eco-text border ${
                errors.levelId ? 'border-red-500' : 'border-eco-border focus:border-eco-green'
              } outline-none transition-all`}
            >
              <option value="">-- Selecciona el Grado --</option>
              {levelsList.map((lvl) => (
                <option key={lvl.uid} value={lvl.uid}>
                  {lvl.name} ({lvl.stage === 'BASICO' ? 'Ciclo Básico' : 'Ciclo Diversificado'})
                </option>
              ))}
            </select>
            {errors.levelId && (
              <p className="text-xs text-red-400 font-body">{errors.levelId.message}</p>
            )}
          </div>

          {/* 2. Resumen Automático de Reglas (si hay nivel elegido) */}
          {selectedLevel && (
            <div className="p-4 rounded-2xl bg-eco-bg/80 border border-eco-border/80 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-semibold text-eco-muted">
                  Reglas Institucionales:
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-eco-green">
                  {isDiversificado ? (
                    <>
                      <Wrench size={12} /> Taller Técnico (Diversificado)
                    </>
                  ) : (
                    <>
                      <Compass size={12} /> Clase Guía (Básico)
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-body text-eco-muted">
                <span>Jornadas:</span>
                {isDiversificado ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-eco-card text-amber-300 border border-amber-500/20">
                      <Sun size={11} /> Matutina
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-eco-card text-indigo-300 border border-indigo-500/20">
                      <Moon size={11} /> Vespertina
                    </span>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-eco-card text-amber-300 border border-amber-500/20">
                    <Sun size={11} /> Matutina Única
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 3. Selección de Sección (Validada contra allowedSections) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-heading font-bold text-eco-text uppercase tracking-wider">
                Sección Escolar *
              </label>
              {selectedLevel && (
                <span className="text-[11px] text-eco-muted font-body">
                  Secciones permitidas para el grado
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {allowedSections.map((sec) => {
                const isChosen = selectedSection === sec
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => handleSectionSelect(sec)}
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

          {/* 4. Especialidad Técnica (Obligatoria si es DIVERSIFICADO) */}
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
                <option value="">-- Selecciona la Especialidad Técnica --</option>
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

          {/* 5. Docente Titular Asignado (Opcional) */}
          <SelectField
            label="Docente Titular (Opcional)"
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            disabled={loading}
            options={[
              { value: '', label: '-- Sin asignar por el momento --' },
              ...teachersList.map((t) => ({
                value: t.uid,
                label: `${t.name} ${t.lastName || ''} (${t.email})`,
              })),
            ]}
          />

          {/* 6. Ciclo Escolar */}
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

          {/* 7. Previsualización de Nombre Institucional */}
          <div className="p-4 rounded-2xl bg-eco-green/5 border border-eco-green/20 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-heading font-semibold text-eco-green">
              <Sparkles size={14} />
              <span>Nombre Oficial Generado:</span>
            </div>
            <p className="font-heading font-bold text-sm text-eco-text">
              {previewName}
            </p>
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
              leftIcon={<FolderPlus size={16} />}
            >
              Crear Clase
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClassCreateModal
