import { Search, RefreshCw, Plus, Filter, Sparkles } from 'lucide-react'
import { Button } from '../atoms/Button.jsx'

/**
 * Molécula: RubricFilterBar
 * Barra interactiva para búsqueda reactiva y filtrado de criterios de evaluación.
 * Incluye filtros por categoría y disponibilidad en listas de cotejo,
 * botón de refresco y disparadores para sembrado y creación (única ubicación de botones).
 * 
 * @param {Object} props
 * @param {string} props.searchQuery - Término de búsqueda
 * @param {Function} props.onSearchQueryChange - Callback para cambio de búsqueda
 * @param {string} props.categoryFilter - Categoría seleccionada
 * @param {Function} props.onCategoryFilterChange - Callback para cambio de categoría
 * @param {string} props.activeFilter - Filtro por disponibilidad ('', 'active', 'inactive')
 * @param {Function} props.onActiveFilterChange - Callback para cambio de disponibilidad
 * @param {Function} props.onRefresh - Callback para recargar criterios
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {boolean} [props.canSeed=false] - Si puede sembrar criterios (ADMIN)
 * @param {Function} [props.onSeed] - Callback para sembrado institucional
 * @param {boolean} [props.seedLoading=false] - Estado de carga del sembrado
 * @param {boolean} [props.canManage=false] - Si puede crear criterios (ADMIN o COORDINATOR)
 * @param {Function} [props.onCreate] - Callback para abrir modal de creación
 */
export const RubricFilterBar = ({
  searchQuery,
  onSearchQueryChange,
  categoryFilter,
  onCategoryFilterChange,
  activeFilter,
  onActiveFilterChange,
  onRefresh,
  loading = false,
  canSeed = false,
  onSeed,
  seedLoading = false,
  canManage = false,
  onCreate,
}) => {
  return (
    <div className="bg-eco-card border border-eco-border rounded-2xl p-4 shadow-lg flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      {/* 1. Búsqueda reactiva */}
      <div className="relative flex-1 min-w-[240px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-eco-muted">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Buscar criterio por título o descripción..."
          aria-label="Buscar criterios de evaluación"
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

      {/* 2. Filtros y Acciones */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Filtro por Categoría */}
        <div className="relative min-w-[140px]">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            aria-label="Filtrar por categoría"
            className="w-full pl-3 pr-8 py-2.5 rounded-xl font-body text-xs sm:text-sm text-eco-text bg-eco-bg/90 border border-eco-border focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 outline-none transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">Todas las Categorías</option>
            <option value="CLASIFICACION">Clasificación</option>
            <option value="LIMPIEZA">Limpieza</option>
            <option value="ORDEN">Orden</option>
            <option value="GENERAL">General</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-eco-muted">
            <Filter size={14} />
          </div>
        </div>

        {/* Filtro por Disponibilidad en Evaluación */}
        {canManage && (
          <div className="relative min-w-[130px]">
            <select
              value={activeFilter}
              onChange={(e) => onActiveFilterChange(e.target.value)}
              aria-label="Filtrar por estado en evaluación"
              className="w-full pl-3 pr-8 py-2.5 rounded-xl font-body text-xs sm:text-sm text-eco-text bg-eco-bg/90 border border-eco-border focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 outline-none transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="">Todos los Estados</option>
              <option value="active">En Evaluación</option>
              <option value="inactive">Pausados</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-eco-muted">
              <Filter size={14} />
            </div>
          </div>
        )}

        {/* Botón de Refresco */}
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Recargar criterios"
          title="Recargar criterios"
          className="shrink-0 px-3"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-eco-green' : ''} />
        </Button>

        {/* Botón Sembrado Inicial (Exclusivo ADMIN, única ubicación en la pantalla) */}
        {canSeed && onSeed && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onSeed}
            disabled={seedLoading}
            isLoading={seedLoading}
            leftIcon={<Sparkles size={16} />}
            className="shrink-0 whitespace-nowrap text-xs sm:text-sm"
          >
            Sembrar Rúbrica
          </Button>
        )}

        {/* Botón Principal Nuevo Criterio (ADMIN / COORDINATOR, única ubicación en la pantalla) */}
        {canManage && onCreate && (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onCreate}
            leftIcon={<Plus size={16} />}
            className="shrink-0 whitespace-nowrap text-xs sm:text-sm"
          >
            Nuevo Criterio
          </Button>
        )}
      </div>
    </div>
  )
}

export default RubricFilterBar
