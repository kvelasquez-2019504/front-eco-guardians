import { Edit2, UserX, Users as UsersIcon } from 'lucide-react'
import { Th } from '../../atoms/Th.jsx'
import { Td } from '../../atoms/Td.jsx'
import { Tr } from '../../atoms/Tr.jsx'
import { Button } from '../../atoms/Button.jsx'
import { UserAvatar } from '../../atoms/UserAvatar.jsx'
import { AuraBadge } from '../../atoms/AuraBadge.jsx'
import { UserRoleBadge } from '../../molecules/UserRoleBadge.jsx'
import { UserStatusBadge } from '../../molecules/UserStatusBadge.jsx'

/**
 * Organismo: UsersTable
 * Tabla completa y responsiva de gestión de usuarios con Atomic Design y control de permisos granular.
 * 
 * @param {Object} props
 * @param {Array} props.users - Lista de usuarios filtrados
 * @param {boolean} props.loading - Estado de carga de la petición
 * @param {number} props.total - Conteo total de registros en backend
 * @param {number} props.limit - Límite de registros por página
 * @param {number} props.from - Desplazamiento actual
 * @param {Function} props.onPrevPage - Navegar a página anterior
 * @param {Function} props.onNextPage - Navegar a página siguiente
 * @param {Function} props.onEdit - Callback al pulsar Editar usuario
 * @param {Function} props.onDelete - Callback al pulsar Desactivar usuario
 * @param {Object} props.currentAuthUser - Usuario autenticado en sesión
 */
export const UsersTable = ({
  users = [],
  loading = false,
  total = 0,
  limit = 10,
  from = 0,
  onPrevPage,
  onNextPage,
  onEdit,
  onDelete,
  currentAuthUser,
}) => {
  const currentUserId = currentAuthUser?.uid || currentAuthUser?._id;
  const isCoordinator = currentAuthUser?.role === 'COORDINATOR'

  // Formateador de fecha amigable para la interfaz
  const formatDate = (dateString) => {
    if (!dateString) return '—'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-GT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return '—'
    }
  }

  // Verificaciones de permisos sobre cada fila
  const getRowPermissions = (targetUser) => {
    const isSelf = targetUser.uid === currentUserId
    const isTargetInactive = targetUser.status === false
    const isTargetPrivileged =
      targetUser.role === 'ADMIN' || targetUser.role === 'COORDINATOR'

    // Un coordinador no puede editar ni desactivar a Administradores ni a otros Coordinadores
    const coordinatorBlocked = isCoordinator && isTargetPrivileged

    const canEdit = !coordinatorBlocked
    const canDelete = !isSelf && !isTargetInactive && !coordinatorBlocked

    let deleteDisabledReason = ''
    if (isSelf) deleteDisabledReason = 'No puedes desactivar tu propia cuenta'
    else if (isTargetInactive) deleteDisabledReason = 'El usuario ya se encuentra inactivo'
    else if (coordinatorBlocked) deleteDisabledReason = 'Los coordinadores solo gestionan alumnos y docentes'

    let editDisabledReason = ''
    if (coordinatorBlocked) editDisabledReason = 'No tienes permisos para modificar este rol'

    return {
      canEdit,
      canDelete,
      deleteDisabledReason,
      editDisabledReason,
    }
  }

  return (
    <div className="bg-eco-card border border-eco-border rounded-2xl shadow-xl overflow-hidden flex flex-col">
      {/* Contenedor scrolleable horizontal para tablas en pantallas pequeñas */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <Tr variant="header">
              <Th align="left">Usuario</Th>
              <Th align="left">Código</Th>
              <Th align="left">Rol</Th>
              <Th align="center">Eco-Aura</Th>
              <Th align="center">Estado</Th>
              <Th align="left">Registro</Th>
              <Th align="center">Acciones</Th>
            </Tr>
          </thead>

          <tbody className="divide-y divide-eco-border/60">
            {/* 1. Estado de Carga */}
            {loading && (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-3 border-eco-green/20 border-t-eco-green rounded-full animate-spin" />
                    <span className="text-sm font-body text-eco-muted">
                      Consultando registros de usuarios...
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {/* 2. Estado Vacío */}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                    <div className="p-3 bg-eco-bg rounded-2xl text-eco-muted border border-eco-border">
                      <UsersIcon size={32} />
                    </div>
                    <span className="font-heading font-bold text-base text-eco-text">
                      No se encontraron usuarios
                    </span>
                    <p className="text-xs text-eco-muted font-body">
                      No hay registros que coincidan con los criterios de búsqueda o el rol seleccionado.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {/* 3. Filas de Usuarios */}
            {!loading &&
              users.map((user) => {
                const { canEdit, canDelete, deleteDisabledReason, editDisabledReason } =
                  getRowPermissions(user)

                return (
                  <Tr key={user.uid} className={user.status === false ? 'opacity-65' : ''}>
                    {/* Celda de Usuario (Avatar + Nombre + Email) */}
                    <Td align="left">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={user.name}
                          lastName={user.lastName}
                          size="md"
                        />
                        <div className="min-w-0">
                          <span className="block font-heading font-bold text-sm text-eco-text truncate">
                            {user.name} {user.lastName}
                          </span>
                          <span className="block text-xs font-body text-eco-muted truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </Td>

                    {/* Celda de Código */}
                    <Td align="left" variant="muted" size="md">
                      <span className="font-mono text-xs text-eco-cyan font-bold">
                        {user.code || '—'}
                      </span>
                    </Td>

                    {/* Celda de Rol */}
                    <Td align="left">
                      <UserRoleBadge role={user.role} />
                    </Td>

                    {/* Celda de Eco-Aura */}
                    <Td align="center">
                      {user.role === 'STUDENT' && user.ecoAura ? (
                        <AuraBadge
                          level={user.ecoAura.level}
                          points={user.ecoAura.points}
                        />
                      ) : (
                        <span className="text-eco-muted/50 text-xs">—</span>
                      )}
                    </Td>

                    {/* Celda de Estado */}
                    <Td align="center">
                      <UserStatusBadge status={user.status} />
                    </Td>

                    {/* Celda de Fecha de Registro */}
                    <Td align="left" variant="muted" size="sm">
                      {formatDate(user.createdAt)}
                    </Td>

                    {/* Celda de Acciones */}
                    <Td align="right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Botón Editar */}
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={!canEdit}
                          onClick={() => onEdit(user)}
                          title={editDisabledReason || 'Editar usuario'}
                          aria-label={`Editar a ${user.name}`}
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
                          disabled={!canDelete}
                          onClick={() => onDelete(user)}
                          title={deleteDisabledReason || 'Desactivar cuenta'}
                          aria-label={`Desactivar a ${user.name}`}
                          className="px-2.5 py-1.5"
                        >
                          <UserX size={14} />
                          <span className="hidden sm:inline">Desactivar</span>
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {/* Paginador y Contador de Registros */}
      <div className="px-6 py-4 bg-eco-bg/60 border-t border-eco-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-eco-muted font-body">
          Mostrando{' '}
          <strong className="text-eco-text">
            {total === 0 ? 0 : from + 1}
          </strong>{' '}
          a{' '}
          <strong className="text-eco-text">
            {Math.min(from + limit, total)}
          </strong>{' '}
          de <strong className="text-eco-text">{total}</strong> usuarios registrados
        </span>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={from === 0 || loading}
            onClick={onPrevPage}
          >
            Anterior
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={from + limit >= total || loading}
            onClick={onNextPage}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UsersTable
