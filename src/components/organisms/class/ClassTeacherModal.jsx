import { useState } from 'react'
import { X, UserPlus, GraduationCap } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { SelectField } from '../../molecules/SelectField.jsx'
import { UserAvatar } from '../../atoms/UserAvatar.jsx'
import { validateTeacherAssignment } from '@/shared/validator/classValidators.js'

/**
 * Organismo: ClassTeacherModal
 * Modal enfocado en asignar o sustituir el profesor de una clase específica (PUT /class/:id/teacher).
 * Ubicado en: src/components/organisms/class/
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar modal
 * @param {Object} props.classGroup - Clase a la que se le asignará el docente
 * @param {Function} props.onSave - Callback al confirmar (classId, teacherId)
 * @param {boolean} [props.loading=false] - Estado de guardado
 * @param {Array} [props.teachersList=[]] - Catálogo de docentes activos
 */
export const ClassTeacherModal = ({
  isOpen,
  onClose,
  classGroup,
  onSave,
  loading = false,
  teachersList = [],
}) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState(classGroup?.teacher?.uid || '')
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen || !classGroup) return null

  const currentTeacher = classGroup.teacher

  const handleSubmit = (e) => {
    e.preventDefault()
    const valid = validateTeacherAssignment(selectedTeacherId)
    if (valid !== true) {
      setErrorMsg(valid)
      return
    }

    setErrorMsg('')
    onSave(classGroup.uid, selectedTeacherId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-teacher-class-title"
        className="bg-eco-card border border-eco-border rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Cabecera del modal */}
        <div className="p-6 border-b border-eco-border flex items-center justify-between bg-eco-bg/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-eco-green/10 text-eco-green rounded-xl border border-eco-green/20">
              <UserPlus size={22} />
            </div>
            <div>
              <H3 id="modal-teacher-class-title" className="text-eco-text">
                Asignar Docente
              </H3>
              <p className="text-xs text-eco-muted font-body">
                Titular para {classGroup.name}
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

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Docente actual */}
          <div className="p-3.5 rounded-2xl bg-eco-bg border border-eco-border space-y-2">
            <span className="text-[11px] font-heading font-bold text-eco-muted uppercase tracking-wider block">
              Docente Actual
            </span>
            {currentTeacher ? (
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={`${currentTeacher.name} ${currentTeacher.lastName || ''}`}
                  size="sm"
                />
                <div className="flex flex-col">
                  <span className="font-body text-sm font-semibold text-eco-text">
                    {currentTeacher.name} {currentTeacher.lastName}
                  </span>
                  <span className="font-mono text-xs text-eco-muted">
                    {currentTeacher.email}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-eco-muted italic font-body">
                Actualmente no hay un docente asignado a esta clase.
              </p>
            )}
          </div>

          {/* Selector de nuevo docente */}
          <div className="space-y-1.5">
            <SelectField
              label="Seleccionar Nuevo Docente Titular *"
              value={selectedTeacherId}
              onChange={(e) => {
                setSelectedTeacherId(e.target.value)
                setErrorMsg('')
              }}
              disabled={loading}
              error={errorMsg}
              options={[
                { value: '', label: '-- Selecciona un Docente --' },
                ...teachersList.map((t) => ({
                  value: t.uid,
                  label: `${t.name} ${t.lastName || ''} - ${t.email}`,
                })),
              ]}
            />
          </div>

          {/* Acciones */}
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
              leftIcon={<GraduationCap size={16} />}
            >
              Confirmar Asignación
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClassTeacherModal
