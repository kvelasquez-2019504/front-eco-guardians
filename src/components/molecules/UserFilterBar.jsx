import { Search, RefreshCw } from 'lucide-react'
import { SelectField } from './SelectField.jsx'
import { Button } from '../atoms/Button.jsx'

/**
 * Molécula: UserFilterBar
 * Barra de filtros interactiva para búsqueda rápida, filtrado por rol y control de registros por página.
 * 
 * @param {Object} props
 * @param {string} props.roleFilter - Rol seleccionado actualmente
 * @param {Function} props.onRoleFilterChange - Callback al cambiar rol
 * @param {number} props.limit - Cantidad de registros por página
 * @param {Function} props.onLimitChange - Callback al cambiar límite
 * @param {string} props.searchQuery - Texto de búsqueda
 * @param {Function} props.onSearchQueryChange - Callback al escribir en búsqueda
 * @param {Function} props.onRefresh - Callback al hacer clic en recargar
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {Array<string>} [props.availableRoles=[]] - Lista de roles permitidos
 */
export const UserFilterBar = ({
  roleFilter,
  onRoleFilterChange,
  limit,
  onLimitChange,
  searchQuery,
  onSearchQueryChange,
  onRefresh,
  onCreateUser,
  loading = false,
  availableRoles = [],
}) => {
  const roleOptions = [
    { value: '', label: 'Todos los roles' },
    ...availableRoles.map((role) => ({
      value: role,
      label:
        role === 'ADMIN'
          ? 'Administrador'
          : role === 'COORDINATOR'
          ? 'Coordinador'
          : role === 'TEACHER'
          ? 'Docente'
          : role === 'STUDENT'
          ? 'Estudiante'
          : role,
    })),
  ]

  const limitOptions = [
    { value: 10, label: '10 por página' },
    { value: 25, label: '25 por página' },
    { value: 50, label: '50 por página' },
  ]

  return (
    <div className="bg-eco-card border border-eco-border rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Campo de búsqueda en vivo */}
      <div className="relative flex-1 min-w-[240px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-eco-muted">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Buscar por nombre, email o código..."
          aria-label="Buscar usuario"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl font-body text-sm text-eco-text bg-eco-bg/90 border border-eco-border focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 outline-none transition-all duration-200 placeholder:text-eco-muted"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchQueryChange('')}
            aria-label="Limpiar búsqueda"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-eco-muted hover:text-eco-text cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Controles de filtro y recarga */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Selector de Rol */}
        <div className="w-44">
          <SelectField
            name="roleFilter"
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            options={roleOptions}
            className="w-full"
            aria-label="Filtrar por rol"
          />
        </div>

        {/* Selector de Límite */}
        <div className="w-36">
          <SelectField
            name="limit"
            value={limit}
            onChange={(e) => onLimitChange(e.target.value)}
            options={limitOptions}
            className="w-full"
            aria-label="Límite por página"
          />
        </div>

        {/* Botón de Refresco */}
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Recargar lista"
          title="Recargar usuarios"
          className="shrink-0 px-3"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-eco-green' : ''} />
        </Button>

        {/* Botón Nuevo Usuario */}
        {onCreateUser && (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onCreateUser}
            className="shrink-0 whitespace-nowrap"
          >
            + Nuevo Usuario
          </Button>
        )}
      </div>
    </div>
  )
}

export default UserFilterBar
