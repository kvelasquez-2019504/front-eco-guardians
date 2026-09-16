import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, UserCheck, Check } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { SelectField } from '../../molecules/SelectField.jsx'
import { LevelStageBadge } from '../../molecules/LevelStageBadge.jsx'
import { SectionsBadgeList } from '../../molecules/SectionsBadgeList.jsx'
import { validateCoordinatorSelection } from '@/shared/validator/coordinatorValidators.js'

/**
 * Organismo: AssignLevelsModal
 * Modal interactivo para vincular uno o más grados educativos a un coordinador académico (POST /coordinator/assign).
 * Ubicado en: src/components/organisms/coordinator/
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Array} [props.coordinatorsList=[]] - Lista de usuarios con rol COORDINATOR
 * @param {Array} [props.levelsList=[]] - Catálogo de niveles activos
 * @param {Function} props.onSave - Callback al confirmar asignación ({ coordinatorId, levelIds })
 * @param {boolean} [props.loading=false] - Estado de guardado
 */
export const AssignLevelsModal = ({
  isOpen,
  onClose,
  coordinatorsList = [],
  levelsList = [],
  onSave,
  loading = false,
}) => {
  const [selectedLevelIds, setSelectedLevelIds] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      coordinatorId: '',
    },
  })

  if (!isOpen) return null

  const toggleLevel = (levelUid) => {
    setSelectedLevelIds((prev) =>
      prev.includes(levelUid)
        ? prev.filter((id) => id !== levelUid)
        : [...prev, levelUid]
    )
  }

  const handleSelectAll = () => {
    if (selectedLevelIds.length === levelsList.length) {
      setSelectedLevelIds([])
    } else {
      setSelectedLevelIds(levelsList.map((l) => l.uid))
    }
  }

  const onSubmit = (formData) => {
    onSave({
      coordinatorId: formData.coordinatorId,
      levelIds: selectedLevelIds,
    })
  }

  const coordinatorOptions = [
    { value: '', label: 'Seleccionar coordinador...' },
    ...coordinatorsList.map((c) => ({
      value: c.uid || c._id,
      label: `${c.name} ${c.lastName} (${c.email})`,
    })),
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-levels-title"
    >
      <div className="relative w-full max-w-xl bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-3 border-b border-eco-border/80 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-eco-green/15 text-eco-green border border-eco-green/30">
              <UserCheck size={20} />
            </div>
            <div>
              <H3 id="assign-levels-title" variant="primary">
                Asignar Niveles Educativos
              </H3>
              <p className="text-xs text-eco-muted font-body mt-0.5">
                Vincula grados a un coordinador para la supervisión de turnos y evidencias
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

        {/* Formulario scrolleable */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar" noValidate>
          {/* Selector de Coordinador */}
          <SelectField
            id="assign-coordinator"
            label="Coordinador Académico"
            required
            options={coordinatorOptions}
            error={errors.coordinatorId?.message}
            {...register('coordinatorId', { validate: validateCoordinatorSelection })}
          />

          {/* Selector de Niveles Educativos */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-heading font-bold text-eco-text block">
                Grados Educativos a Asignar <span className="text-eco-green">*</span>
              </label>

              {levelsList.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs font-bold text-eco-cyan hover:underline cursor-pointer"
                >
                  {selectedLevelIds.length === levelsList.length
                    ? 'Deseleccionar todos'
                    : 'Seleccionar todos'}
                </button>
              )}
            </div>

            <p className="text-xs text-eco-muted font-body">
              Selecciona uno o varios grados que estarán bajo la responsabilidad de este coordinador:
            </p>

            {/* Lista de tarjetas de niveles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {levelsList.map((level) => {
                const isChecked = selectedLevelIds.includes(level.uid)

                return (
                  <div
                    key={level.uid}
                    onClick={() => toggleLevel(level.uid)}
                    className={`
                      p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between gap-2 select-none
                      ${
                        isChecked
                          ? 'border-eco-green bg-eco-green/10 shadow-xs ring-1 ring-eco-green'
                          : 'border-eco-border bg-eco-bg/60 hover:bg-eco-card-hover hover:border-eco-border/80'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-heading font-bold text-xs text-eco-text">
                        {level.name}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-eco-green border-eco-green text-eco-bg'
                            : 'border-eco-border bg-eco-card'
                        }`}
                      >
                        {isChecked && <Check size={12} className="stroke-[3]" />}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <LevelStageBadge stage={level.stage} />
                      <SectionsBadgeList sections={level.allowedSections} />
                    </div>
                  </div>
                )
              })}

              {levelsList.length === 0 && (
                <div className="col-span-2 p-6 text-center text-xs text-eco-muted border border-dashed border-eco-border rounded-xl">
                  No hay niveles educativos activos en la base de datos para asignar.
                </div>
              )}
            </div>

            {selectedLevelIds.length === 0 && (
              <p className="text-xs text-red-400 font-body mt-1">
                ⚠️ Debes seleccionar al menos un grado educativo.
              </p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="pt-3 border-t border-eco-border flex items-center justify-end gap-3 shrink-0">
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
              disabled={selectedLevelIds.length === 0}
              isLoading={loading}
            >
              {loading ? 'Asignando...' : 'Confirmar Asignación'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignLevelsModal
