import { Edit2, Trash2, UserPlus, FolderKanban, Sun, Moon, Plus } from 'lucide-react'
import { Th } from '../../atoms/Th.jsx'
import { Td } from '../../atoms/Td.jsx'
import { Tr } from '../../atoms/Tr.jsx'
import { Button } from '../../atoms/Button.jsx'
import { UserAvatar } from '../../atoms/UserAvatar.jsx'
import { UserStatusBadge } from '../../molecules/UserStatusBadge.jsx'
import { LevelStageBadge } from '../../molecules/LevelStageBadge.jsx'
import { ClassTypeBadge } from '../../molecules/ClassTypeBadge.jsx'

/**
 * Organismo: ClassesTable
 * Tabla interactiva para listar y gestionar clases y grupos escolares de Eco-Guardianes.
 * Ubicada en: src/components/organisms/class/
 * 
 * @param {Object} props
 * @param {Array} props.classes - Lista de clases filtradas
 * @param {boolean} props.loading - Estado de carga
 * @param {boolean} props.canManage - Permisos de edición (ADMIN o COORDINATOR)
 * @param {Function} props.onEdit - Callback al presionar Editar
 * @param {Function} props.onAssignTeacher - Callback al presionar Asignar/Cambiar Profesor
 * @param {Function} props.onDelete - Callback al presionar Desactivar
 * @param {Function} [props.onCreate] - Callback para crear clase si está vacía
 */
export const ClassesTable = ({
  classes = [],
  loading = false,
  canManage = false,
  onEdit,
  onAssignTeacher,
  onDelete,
  onCreate,
}) => {
  return (
    <div className="bg-eco-card border border-eco-border rounded-2xl shadow-xl overflow-hidden flex flex-col">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <Tr variant="header">
              <Th align="left">Clase / Grupo</Th>
              <Th align="left">Nivel Escolar</Th>
              <Th align="left">Tipo y Jornadas</Th>
              <Th align="left">Especialidad Técnica</Th>
              <Th align="left">Docente Titular</Th>
              <Th align="center">Estado</Th>
              {canManage && <Th align="right">Acciones</Th>}
            </Tr>
          </thead>

          <tbody className="divide-y divide-eco-border/60">
            {/* 1. Estado de Carga */}
            {loading && (
              <tr>
                <td colSpan={canManage ? 7 : 6} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-3 border-eco-green/20 border-t-eco-green rounded-full animate-spin" />
                    <span className="text-sm font-body text-eco-muted">
                      Cargando catálogo de clases y secciones...
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {/* 2. Estado Vacío */}
            {!loading && classes.length === 0 && (
              <tr>
                <td colSpan={canManage ? 7 : 6} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                    <div className="p-3 bg-eco-bg rounded-2xl text-eco-muted border border-eco-border">
                      <FolderKanban size={32} />
                    </div>
                    <span className="font-heading font-bold text-base text-eco-text">
                      No se encontraron clases o grupos
                    </span>
                    <p className="text-xs text-eco-muted font-body leading-relaxed">
                      {canManage
                        ? 'Puedes dar de alta una nueva clase o sección para Ciclo Básico o Diversificado.'
                        : 'No hay clases registradas que coincidan con los criterios de búsqueda.'}
                    </p>
                    {canManage && onCreate && (
                      <div className="pt-2">
                        <Button
                          type="button"
                          variant="primary"
                          size="md"
                          onClick={onCreate}
                          leftIcon={<Plus size={16} />}
                        >
                          Crear Primera Clase
                        </Button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {/* 3. Filas de Clases */}
            {!loading &&
              classes.map((cls) => {
                const isInactive = cls.status === false
                const hasTeacher = Boolean(cls.teacher)
                const coveredShifts = cls.coveredShifts || ['MATUTINA']

                return (
                  <Tr
                    key={cls.uid}
                    className={`transition-colors duration-150 ${
                      isInactive ? 'opacity-60 bg-eco-bg/40' : 'hover:bg-eco-bg/60'
                    }`}
                  >
                    {/* A. Clase / Grupo */}
                    <Td className="py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-heading font-bold text-sm text-eco-text tracking-wide">
                          {cls.name || `Sección ${cls.section}`}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-eco-bg border border-eco-border text-eco-green">
                            Sección {cls.section}
                          </span>
                          <span className="text-[11px] font-body text-eco-muted">
                            Ciclo {cls.academicYear || 2026}
                          </span>
                        </div>
                      </div>
                    </Td>

                    {/* B. Nivel Escolar */}
                    <Td className="py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="font-body text-sm font-semibold text-eco-text">
                          {cls.level?.name || 'Nivel no especificado'}
                        </span>
                        <LevelStageBadge stage={cls.level?.stage || 'BASICO'} />
                      </div>
                    </Td>

                    {/* C. Tipo y Jornadas */}
                    <Td className="py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <ClassTypeBadge type={cls.type} />
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {coveredShifts.includes('MATUTINA') && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-body bg-eco-bg text-amber-300 border border-amber-500/20">
                              <Sun size={10} /> Matutina
                            </span>
                          )}
                          {coveredShifts.includes('VESPERTINA') && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-body bg-eco-bg text-indigo-300 border border-indigo-500/20">
                              <Moon size={10} /> Vespertina
                            </span>
                          )}
                        </div>
                      </div>
                    </Td>

                    {/* D. Especialidad Técnica */}
                    <Td className="py-4">
                      {cls.career ? (
                        <div className="flex flex-col">
                          <span className="font-body text-sm font-medium text-eco-text">
                            {cls.career.name}
                          </span>
                          <span className="text-[11px] font-body text-eco-muted">
                            Especialidad Técnica
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-body text-eco-muted italic">
                          No aplica (Ciclo Básico)
                        </span>
                      )}
                    </Td>

                    {/* E. Docente Titular */}
                    <Td className="py-4">
                      {hasTeacher ? (
                        <div className="flex items-center gap-2.5">
                          <UserAvatar
                            name={`${cls.teacher.name} ${cls.teacher.lastName || ''}`}
                            size="sm"
                          />
                          <div className="flex flex-col">
                            <span className="font-body text-sm font-medium text-eco-text leading-snug">
                              {cls.teacher.name} {cls.teacher.lastName}
                            </span>
                            <span className="font-mono text-[11px] text-eco-muted truncate max-w-[150px]">
                              {cls.teacher.email}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-body text-eco-muted italic">
                            Sin docente titular
                          </span>
                          {canManage && onAssignTeacher && (
                            <button
                              type="button"
                              onClick={() => onAssignTeacher(cls)}
                              className="text-[11px] text-eco-green hover:underline cursor-pointer font-medium"
                            >
                              + Asignar
                            </button>
                          )}
                        </div>
                      )}
                    </Td>

                    {/* F. Estado */}
                    <Td align="center" className="py-4">
                      <UserStatusBadge status={cls.status} />
                    </Td>

                    {/* G. Acciones (Exclusivo ADMIN y COORDINATOR) */}
                    {canManage && (
                      <Td align="right" className="py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botón Asignar / Cambiar Docente */}
                          {onAssignTeacher && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => onAssignTeacher(cls)}
                              title={hasTeacher ? 'Cambiar profesor' : 'Asignar profesor'}
                              aria-label={hasTeacher ? 'Cambiar profesor' : 'Asignar profesor'}
                              className="p-2 text-eco-muted hover:text-eco-green hover:bg-eco-green/10"
                            >
                              <UserPlus size={15} />
                            </Button>
                          )}

                          {/* Botón Editar Datos */}
                          {onEdit && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(cls)}
                              title="Editar clase"
                              aria-label={`Editar clase ${cls.name}`}
                              className="p-2 text-eco-muted hover:text-eco-text hover:bg-eco-border/40"
                            >
                              <Edit2 size={15} />
                            </Button>
                          )}

                          {/* Botón Desactivar */}
                          {onDelete && !isInactive && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(cls)}
                              title="Desactivar clase"
                              aria-label={`Desactivar clase ${cls.name}`}
                              className="p-2 text-eco-muted hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 size={15} />
                            </Button>
                          )}
                        </div>
                      </Td>
                    )}
                  </Tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClassesTable
