import { Trash2, Sun, Moon, Users, UserPlus } from 'lucide-react'
import { Th } from '../../atoms/Th.jsx'
import { Td } from '../../atoms/Td.jsx'
import { Tr } from '../../atoms/Tr.jsx'
import { Button } from '../../atoms/Button.jsx'
import { UserAvatar } from '../../atoms/UserAvatar.jsx'
import { AuraBadge } from '../../atoms/AuraBadge.jsx'
import { UserStatusBadge } from '../../molecules/UserStatusBadge.jsx'

/**
 * Organismo: EnrolledStudentsTable
 * Tabla interactiva para visualizar los alumnos inscritos en una clase o grupo académico.
 * Ubicada en: src/components/organisms/enrollment/
 * 
 * @param {Object} props
 * @param {Array} props.students - Lista de alumnos matriculados
 * @param {boolean} props.loading - Estado de carga
 * @param {boolean} props.canManage - Permisos de edición (ADMIN o COORDINATOR)
 * @param {Function} props.onUnenroll - Callback para abrir confirmación de desinscripción
 * @param {Function} [props.onEnroll] - Callback para abrir modal de matrícula cuando está vacía
 * @param {Object} [props.selectedClass] - Datos de la clase activa
 */
export const EnrolledStudentsTable = ({
  students = [],
  loading = false,
  canManage = false,
  onUnenroll,
  onEnroll,
  selectedClass,
}) => {
  return (
    <div className="bg-eco-card border border-eco-border rounded-2xl shadow-xl overflow-hidden flex flex-col">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <Tr variant="header">
              <Th align="left">Estudiante</Th>
              <Th align="left">Correo Electrónico</Th>
              <Th align="center">Jornada</Th>
              <Th align="center">Rango Eco-Aura</Th>
              <Th align="center">Ciclo</Th>
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
                      Consultando estudiantes matriculados en la clase...
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {/* 2. Estado Vacío */}
            {!loading && students.length === 0 && (
              <tr>
                <td colSpan={canManage ? 7 : 6} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                    <div className="p-3 bg-eco-bg rounded-2xl text-eco-muted border border-eco-border">
                      <Users size={32} />
                    </div>
                    <span className="font-heading font-bold text-base text-eco-text">
                      No hay alumnos matriculados en esta clase
                    </span>
                    <p className="text-xs text-eco-muted font-body leading-relaxed">
                      {canManage
                        ? `Puedes inscribir alumnos de Ciclo ${selectedClass?.type === 'GUIA' ? 'Básico' : 'Diversificado'} a la sección.`
                        : 'No se encontraron estudiantes matriculados que coincidan con la búsqueda.'}
                    </p>
                    {canManage && onEnroll && selectedClass && (
                      <div className="pt-2">
                        <Button
                          type="button"
                          variant="primary"
                          size="md"
                          onClick={onEnroll}
                          leftIcon={<UserPlus size={16} />}
                        >
                          Matricular Primeros Alumnos
                        </Button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {/* 3. Filas de Estudiantes Matriculados */}
            {!loading &&
              students.map((item) => {
                const s = item.student || {}
                const fullName = `${s.name || ''} ${s.lastName || ''}`.trim() || 'Estudiante'
                const isMatutina = item.shift === 'MATUTINA'

                return (
                  <Tr
                    key={item.enrollmentId || item.uid}
                    className="hover:bg-eco-bg/60 transition-colors duration-150"
                  >
                    {/* A. Estudiante (Avatar, Nombre y Código) */}
                    <Td className="py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={fullName} size="md" />
                        <div className="flex flex-col">
                          <span className="font-body font-semibold text-sm text-eco-text leading-tight">
                            {fullName}
                          </span>
                          <span className="font-mono text-xs text-eco-green font-semibold mt-0.5">
                            {s.code || 'Sin código'}
                          </span>
                        </div>
                      </div>
                    </Td>

                    {/* B. Correo Electrónico */}
                    <Td className="py-4">
                      <span className="font-mono text-xs text-eco-muted">
                        {s.email || 'No registrado'}
                      </span>
                    </Td>

                    {/* C. Jornada Escolar */}
                    <Td align="center" className="py-4">
                      {isMatutina ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          <Sun size={12} /> Matutina
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          <Moon size={12} /> Vespertina
                        </span>
                      )}
                    </Td>

                    {/* D. Rango Eco-Aura */}
                    <Td align="center" className="py-4">
                      <AuraBadge
                        level={s.ecoAura?.level || 'NOVATO'}
                        points={s.ecoAura?.points}
                      />
                    </Td>

                    {/* E. Ciclo Lectivo */}
                    <Td align="center" className="py-4">
                      <span className="font-mono text-xs text-eco-muted">
                        {item.academicYear || 2026}
                      </span>
                    </Td>

                    {/* F. Estado */}
                    <Td align="center" className="py-4">
                      <UserStatusBadge status={s.status} />
                    </Td>

                    {/* G. Acciones (Exclusivo ADMIN y COORDINATOR) */}
                    {canManage && (
                      <Td align="right" className="py-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onUnenroll(item)}
                          title="Desinscribir alumno de la clase"
                          aria-label={`Desinscribir alumno ${fullName}`}
                          className="p-2 text-eco-muted hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                        </Button>
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

export default EnrolledStudentsTable
