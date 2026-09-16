import { UserMinus, UserCheck } from 'lucide-react'
import { Th } from '../../atoms/Th.jsx'
import { Td } from '../../atoms/Td.jsx'
import { Tr } from '../../atoms/Tr.jsx'
import { Button } from '../../atoms/Button.jsx'
import { UserAvatar } from '../../atoms/UserAvatar.jsx'
import { LevelStageBadge } from '../../molecules/LevelStageBadge.jsx'
import { SectionsBadgeList } from '../../molecules/SectionsBadgeList.jsx'
import { UserStatusBadge } from '../../molecules/UserStatusBadge.jsx'

/**
 * Organismo: CoordinatorAssignmentsTable
 * Tabla responsiva para visualizar las asignaciones de niveles a coordinadores en Fundación Kinal.
 * Ubicado en: src/components/organisms/coordinator/
 * 
 * @param {Object} props
 * @param {Array} props.assignments - Lista de asignaciones filtradas
 * @param {boolean} props.loading - Estado de carga de datos
 * @param {boolean} props.isAdmin - Si el usuario autenticado tiene permisos de mutación (ADMIN)
 * @param {Function} props.onUnassign - Callback al presionar Desasignar
 * @param {Function} [props.onOpenAssign] - Callback para abrir modal si está vacía
 */
export const CoordinatorAssignmentsTable = ({
  assignments = [],
  loading = false,
  isAdmin = false,
  onUnassign,
  onOpenAssign,
}) => {
  return (
    <div className="bg-eco-card border border-eco-border rounded-2xl shadow-xl overflow-hidden flex flex-col">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <Tr variant="header">
              <Th align="left">Coordinador Académico</Th>
              <Th align="left">Grado Asignado</Th>
              <Th align="left">Etapa y Secciones</Th>
              <Th align="center">Estado</Th>
              {isAdmin && <Th align="right">Acciones</Th>}
            </Tr>
          </thead>

          <tbody className="divide-y divide-eco-border/60">
            {/* 1. Estado de Carga */}
            {loading && (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-3 border-eco-green/20 border-t-eco-green rounded-full animate-spin" />
                    <span className="text-sm font-body text-eco-muted">
                      Consultando asignaciones de coordinadores...
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {/* 2. Estado Vacío */}
            {!loading && assignments.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                    <div className="p-3 bg-eco-bg rounded-2xl text-eco-muted border border-eco-border">
                      <UserCheck size={32} />
                    </div>
                    <span className="font-heading font-bold text-base text-eco-text">
                      No hay asignaciones registradas
                    </span>
                    <p className="text-xs text-eco-muted font-body leading-relaxed">
                      {isAdmin
                        ? 'Aún no se han vinculado grados educativos a ningún coordinador. Puedes asignar niveles haciendo clic en el botón de abajo.'
                        : 'No se encontraron asignaciones de niveles para coordinadores.'}
                    </p>

                    {isAdmin && onOpenAssign && (
                      <div className="pt-2">
                        <Button
                          type="button"
                          variant="primary"
                          size="md"
                          onClick={onOpenAssign}
                          leftIcon={<UserCheck size={16} />}
                        >
                          Asignar Primer Nivel
                        </Button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {/* 3. Filas de Asignaciones */}
            {!loading &&
              assignments.map((assignment) => {
                const coordinator = assignment.coordinator || {}
                const level = assignment.level || {}
                const isInactive = assignment.status === false

                return (
                  <Tr
                    key={assignment.uid}
                    className={isInactive ? 'opacity-65' : ''}
                  >
                    {/* Coordinador */}
                    <Td align="left">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={coordinator.name || 'C'}
                          lastName={coordinator.lastName || 'O'}
                          size="md"
                        />
                        <div className="min-w-0">
                          <span className="block font-heading font-bold text-sm text-eco-text truncate">
                            {coordinator.name} {coordinator.lastName}
                          </span>
                          <span className="block text-xs font-body text-eco-muted truncate">
                            {coordinator.email}
                          </span>
                          {coordinator.code && (
                            <span className="font-mono text-[11px] font-bold text-eco-cyan">
                              {coordinator.code}
                            </span>
                          )}
                        </div>
                      </div>
                    </Td>

                    {/* Grado Asignado */}
                    <Td align="left">
                      <div className="space-y-0.5">
                        <span className="font-heading font-bold text-sm text-eco-text block">
                          {level.name || 'Grado sin nombre'}
                        </span>
                        {level.gradeNumber && (
                          <span className="font-mono text-xs text-eco-muted">
                            {level.gradeNumber}.° Grado
                          </span>
                        )}
                      </div>
                    </Td>

                    {/* Etapa y Secciones */}
                    <Td align="left">
                      <div className="space-y-1.5">
                        <LevelStageBadge stage={level.stage} />
                        <SectionsBadgeList sections={level.allowedSections} />
                      </div>
                    </Td>

                    {/* Estado */}
                    <Td align="center">
                      <UserStatusBadge status={assignment.status} />
                    </Td>

                    {/* Acciones (Exclusivas ADMIN) */}
                    {isAdmin && (
                      <Td align="right">
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => onUnassign(assignment)}
                          title="Desasignar nivel de este coordinador"
                          aria-label={`Desasignar ${level.name} de ${coordinator.name}`}
                          className="px-2.5 py-1.5"
                        >
                          <UserMinus size={14} />
                          <span className="hidden sm:inline">Desasignar</span>
                        </Button>
                      </Td>
                    )}
                  </Tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {/* Pie con conteo informativo */}
      <div className="px-6 py-3.5 bg-eco-bg/60 border-t border-eco-border flex items-center justify-between text-xs text-eco-muted font-body">
        <span>
          Total:{' '}
          <strong className="text-eco-text">{assignments.length}</strong> asignación(es)
          activa(s)
        </span>
        <span className="text-[11px]">
          {isAdmin ? 'Acceso administrativo total' : 'Vista de consulta'}
        </span>
      </div>
    </div>
  )
}

export default CoordinatorAssignmentsTable
