import { Edit2, Trash2, Briefcase } from 'lucide-react'
import { Th } from '../../atoms/Th.jsx'
import { Td } from '../../atoms/Td.jsx'
import { Tr } from '../../atoms/Tr.jsx'
import { Button } from '../../atoms/Button.jsx'
import { UserStatusBadge } from '../../molecules/UserStatusBadge.jsx'

/**
 * Organismo: CareersTable
 * Tabla responsiva para visualizar las especialidades técnicas de Fundación Kinal.
 * 
 * @param {Object} props
 * @param {Array} props.careers - Lista de carreras filtradas
 * @param {boolean} props.loading - Estado de carga de datos
 * @param {boolean} props.isAdmin - Si el usuario autenticado tiene permisos de mutación (ADMIN)
 * @param {Function} props.onEdit - Callback al presionar Editar
 * @param {Function} props.onDelete - Callback al presionar Desactivar
 */
export const CareersTable = ({
  careers = [],
  loading = false,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-eco-card border border-eco-border rounded-2xl shadow-xl overflow-hidden flex flex-col">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <Tr variant="header">
              <Th align="left">Especialidad Técnica</Th>
              <Th align="left">Descripción y Competencias</Th>
              <Th align="center">Estado</Th>
              {isAdmin && <Th align="right">Acciones</Th>}
            </Tr>
          </thead>

          <tbody className="divide-y divide-eco-border/60">
            {/* 1. Estado de Carga */}
            {loading && (
              <tr>
                <td colSpan={isAdmin ? 4 : 3} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-3 border-eco-green/20 border-t-eco-green rounded-full animate-spin" />
                    <span className="text-sm font-body text-eco-muted">
                      Consultando catálogo de carreras técnicas...
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {/* 2. Estado Vacío */}
            {!loading && careers.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 4 : 3} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                    <div className="p-3 bg-eco-bg rounded-2xl text-eco-muted border border-eco-border">
                      <Briefcase size={32} />
                    </div>
                    <span className="font-heading font-bold text-base text-eco-text">
                      No hay carreras técnicas registradas
                    </span>
                    <p className="text-xs text-eco-muted font-body leading-relaxed">
                      No se encontraron carreras técnicas registradas en el sistema.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {/* 3. Filas de Carreras */}
            {!loading &&
              careers.map((career) => {
                const isInactive = career.status === false

                return (
                  <Tr
                    key={career.uid}
                    className={isInactive ? 'opacity-65' : ''}
                  >
                    {/* Nombre de la Carrera */}
                    <Td align="left">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-eco-bg text-eco-cyan border border-eco-border shrink-0">
                          <Briefcase size={16} />
                        </div>
                        <span className="font-heading font-bold text-sm text-eco-text">
                          {career.name}
                        </span>
                      </div>
                    </Td>

                    {/* Descripción */}
                    <Td align="left" variant="muted" size="sm">
                      <p className="line-clamp-2 max-w-md">
                        {career.description?.trim() || (
                          <span className="text-eco-muted/50 italic">Sin descripción registrada</span>
                        )}
                      </p>
                    </Td>

                    {/* Estado */}
                    <Td align="center">
                      <UserStatusBadge status={career.status} />
                    </Td>

                    {/* Acciones (Exclusivas ADMIN) */}
                    {isAdmin && (
                      <Td align="right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botón Editar */}
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onEdit(career)}
                            title="Editar carrera"
                            aria-label={`Editar ${career.name}`}
                            className="px-2.5 py-1.5"
                          >
                            <Edit2 size={14} className="text-eco-text" />
                            <span className="hidden sm:inline">Editar</span>
                          </Button>

                          {/* Botón Desactivar */}
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            disabled={isInactive}
                            onClick={() => onDelete(career)}
                            title={
                              isInactive
                                ? 'La carrera ya está inactiva'
                                : 'Desactivar carrera'
                            }
                            aria-label={`Desactivar ${career.name}`}
                            className="px-2.5 py-1.5"
                          >
                            <Trash2 size={14} />
                            <span className="hidden sm:inline">Desactivar</span>
                          </Button>
                        </div>
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
          <strong className="text-eco-text">{careers.length}</strong> especialidad(es)
          mostrada(s)
        </span>
        <span className="text-[11px]">
          {isAdmin ? 'Acceso administrativo total' : 'Vista de solo lectura'}
        </span>
      </div>
    </div>
  )
}

export default CareersTable
