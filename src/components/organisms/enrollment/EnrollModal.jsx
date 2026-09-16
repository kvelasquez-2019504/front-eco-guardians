import { useState, useMemo } from 'react'
import { X, UserPlus, Search, Check, AlertCircle, Sun, Moon } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { UserAvatar } from '../../atoms/UserAvatar.jsx'
import { AuraBadge } from '../../atoms/AuraBadge.jsx'
import {
  validateShiftSelection,
  validateStudentsSelection,
} from '@/shared/validator/enrollmentValidators.js'

/**
 * Organismo: EnrollModal
 * Modal interactivo para matricular alumnos individual o masivamente en una clase y jornada escolar.
 * Ubicado en: src/components/organisms/enrollment/
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar modal
 * @param {Function} props.onSave - Callback al confirmar ({ classGroupId, shift, studentIds, academicYear })
 * @param {boolean} [props.loading=false] - Estado de guardado
 * @param {Object} props.selectedClass - Clase receptora
 * @param {Array} [props.studentsCatalog=[]] - Catálogo de estudiantes disponibles
 * @param {Set} [props.enrolledStudentUids=new Set()] - IDs de alumnos ya matriculados en la clase
 */
export const EnrollModal = ({
  isOpen,
  onClose,
  onSave,
  loading = false,
  selectedClass,
  studentsCatalog = [],
  enrolledStudentUids = new Set(),
}) => {
  const coveredShifts = selectedClass?.coveredShifts || ['MATUTINA']
  const isOnlyMatutina = coveredShifts.length === 1 && coveredShifts[0] === 'MATUTINA'

  // Estado de jornada (por defecto MATUTINA)
  const [selectedShift, setSelectedShift] = useState('MATUTINA')
  // Alumnos seleccionados
  const [selectedStudentIds, setSelectedStudentIds] = useState([])
  // Búsqueda en catálogo
  const [modalSearch, setModalSearch] = useState('')
  // Error manual
  const [validationError, setValidationError] = useState('')

  // Lista de alumnos filtrados por el buscador interno del modal
  const availableStudents = useMemo(() => {
    if (!modalSearch.trim()) return studentsCatalog
    const q = modalSearch.toLowerCase().trim()

    return studentsCatalog.filter((st) => {
      const fullName = `${st.name || ''} ${st.lastName || ''}`.toLowerCase()
      const email = (st.email || '').toLowerCase()
      const code = (st.code || '').toLowerCase()
      return fullName.includes(q) || email.includes(q) || code.includes(q)
    })
  }, [studentsCatalog, modalSearch])

  // Alumnos seleccionables (que no estén ya matriculados)
  const nonEnrolledFilteredStudents = useMemo(() => {
    return availableStudents.filter((st) => !enrolledStudentUids.has(st.uid))
  }, [availableStudents, enrolledStudentUids])

  if (!isOpen || !selectedClass) return null

  const toggleStudent = (uid) => {
    if (enrolledStudentUids.has(uid)) return
    setValidationError('')
    setSelectedStudentIds((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    )
  }

  const handleSelectAllVisible = () => {
    setValidationError('')
    const visibleUids = nonEnrolledFilteredStudents.map((st) => st.uid)
    const allSelected = visibleUids.every((uid) => selectedStudentIds.includes(uid))

    if (allSelected) {
      setSelectedStudentIds((prev) => prev.filter((id) => !visibleUids.includes(id)))
    } else {
      setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...visibleUids])))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validar jornada
    const shiftVal = validateShiftSelection(selectedShift, coveredShifts)
    if (shiftVal !== true) {
      setValidationError(shiftVal)
      return
    }

    // Validar alumnos seleccionados
    const studentsVal = validateStudentsSelection(selectedStudentIds)
    if (studentsVal !== true) {
      setValidationError(studentsVal)
      return
    }

    setValidationError('')
    onSave({
      classGroupId: selectedClass.uid,
      shift: selectedShift,
      studentIds: selectedStudentIds,
      academicYear: selectedClass.academicYear || 2026,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-enroll-title"
        className="bg-eco-card border border-eco-border rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Cabecera del modal */}
        <div className="p-6 border-b border-eco-border flex items-center justify-between bg-eco-bg/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-eco-green/10 text-eco-green rounded-xl border border-eco-green/20">
              <UserPlus size={22} />
            </div>
            <div>
              <H3 id="modal-enroll-title" className="text-eco-text">
                Matricular Alumnos
              </H3>
              <p className="text-xs text-eco-muted font-body">
                Inscripción en: <strong className="text-eco-text">{selectedClass.name}</strong>
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

        {/* Contenido del modal */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1">
          {/* 1. Selector de Jornada */}
          <div className="space-y-2">
            <label className="block text-xs font-heading font-bold text-eco-text uppercase tracking-wider">
              Jornada Escolar *
            </label>
            {isOnlyMatutina ? (
              <div className="p-3 bg-eco-bg border border-eco-border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun size={16} className="text-amber-300" />
                  <span className="font-body text-sm font-semibold text-eco-text">
                    Jornada Matutina Única
                  </span>
                </div>
                <span className="text-[11px] font-body text-eco-muted">
                  Ciclo Básico opera exclusivamente en la mañana
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedShift('MATUTINA')}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                    selectedShift === 'MATUTINA'
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 ring-2 ring-amber-500/20'
                      : 'bg-eco-bg border-eco-border text-eco-muted hover:border-eco-green/40'
                  }`}
                >
                  <Sun size={18} />
                  <div className="text-left">
                    <span className="block font-heading font-bold text-xs">Jornada Matutina</span>
                    <span className="text-[10px] text-eco-muted font-body">Horario matutino</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedShift('VESPERTINA')}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                    selectedShift === 'VESPERTINA'
                      ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-200 ring-2 ring-indigo-500/20'
                      : 'bg-eco-bg border-eco-border text-eco-muted hover:border-eco-green/40'
                  }`}
                >
                  <Moon size={18} />
                  <div className="text-left">
                    <span className="block font-heading font-bold text-xs">Jornada Vespertina</span>
                    <span className="text-[10px] text-eco-muted font-body">Horario vespertino</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 2. Buscador y Acciones Masivas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-heading font-bold text-eco-text uppercase tracking-wider">
                Selección de Estudiantes ({selectedStudentIds.length} seleccionados)
              </label>
              <button
                type="button"
                onClick={handleSelectAllVisible}
                disabled={loading || nonEnrolledFilteredStudents.length === 0}
                className="text-xs text-eco-green hover:underline font-semibold cursor-pointer disabled:opacity-50"
              >
                {nonEnrolledFilteredStudents.every((st) => selectedStudentIds.includes(st.uid))
                  ? 'Deseleccionar Visibles'
                  : 'Seleccionar Visibles'}
              </button>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-eco-muted">
                <Search size={15} />
              </div>
              <input
                type="text"
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                placeholder="Filtrar alumnos por nombre, apellido o carnet..."
                className="w-full pl-9 pr-4 py-2 rounded-xl font-body text-xs text-eco-text bg-eco-bg border border-eco-border focus:border-eco-green outline-none transition-all placeholder:text-eco-muted"
              />
            </div>
          </div>

          {/* Error de validación */}
          {validationError && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 3. Catálogo de Estudiantes Seleccionables */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {availableStudents.length === 0 ? (
              <p className="p-6 text-center text-xs text-eco-muted font-body">
                No se encontraron estudiantes en el catálogo que coincidan con la búsqueda.
              </p>
            ) : (
              availableStudents.map((st) => {
                const isAlreadyEnrolled = enrolledStudentUids.has(st.uid)
                const isSelected = selectedStudentIds.includes(st.uid)
                const fullName = `${st.name || ''} ${st.lastName || ''}`.trim()

                return (
                  <div
                    key={st.uid}
                    onClick={() => toggleStudent(st.uid)}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isAlreadyEnrolled
                        ? 'opacity-50 bg-eco-bg/40 border-eco-border cursor-not-allowed'
                        : isSelected
                        ? 'bg-eco-green/10 border-eco-green shadow-sm cursor-pointer'
                        : 'bg-eco-bg/80 border-eco-border hover:border-eco-green/40 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                          isSelected
                            ? 'bg-eco-green border-eco-green text-eco-bg'
                            : 'border-eco-border bg-eco-card'
                        }`}
                      >
                        {isSelected && <Check size={13} strokeWidth={3} />}
                      </div>

                      <UserAvatar name={fullName} size="sm" />

                      <div className="flex flex-col min-w-0">
                        <span className="font-body font-semibold text-xs text-eco-text truncate">
                          {fullName}
                        </span>
                        <span className="font-mono text-[11px] text-eco-muted truncate">
                          {st.email} • {st.code || 'Sin código'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {st.ecoAura && (
                        <AuraBadge level={st.ecoAura.level} points={st.ecoAura.points} />
                      )}

                      {isAlreadyEnrolled && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-heading font-bold bg-eco-border text-eco-muted">
                          Ya Matriculado
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
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
              disabled={loading || selectedStudentIds.length === 0}
              isLoading={loading}
              leftIcon={<UserPlus size={16} />}
            >
              Matricular ({selectedStudentIds.length})
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EnrollModal
