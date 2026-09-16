import { Search, RefreshCw, Plus, Filter } from 'lucide-react'
import { Button } from '../atoms/Button.jsx'

/**
 * Molécula: ClassFilterBar
 * Barra de filtrado reactivo para el catálogo de clases y secciones.
 * Incluye búsqueda en vivo, filtros por grado y tipo, botón de refresco
 * y el botón de acción principal "+ Nueva Clase" (única ubicación en la vista).
 * 
 * @param {Object} props
 * @param {string} props.searchQuery - Término de búsqueda
 * @param {Function} props.onSearchQueryChange - Callback para búsqueda
 * @param {string} props.selectedLevelFilter - Nivel seleccionado
 * @param {Function} props.onLevelFilterChange - Callback para cambio de nivel
 * @param {string} props.selectedTypeFilter - Tipo de clase seleccionado ('' | 'GUIA' | 'TALLER')
 * @param {Function} props.onTypeFilterChange - Callback para cambio de tipo
 * @param {Array} [props.levelsList=[]] - Lista de niveles activos para el filtro
 * @param {Function} props.onRefresh - Callback para recargar clases
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {boolean} [props.canManage=false] - Si el usuario tiene permisos (ADMIN o COORDINATOR)
 * @param {Function} [props.onCreate] - Callback para abrir modal de creación
 */
export const ClassFilterBar = ({
  searchQuery,
  onSearchQueryChange,
  selectedLevelFilter,
  onLevelFilterChange,
  selectedTypeFilter,
  onTypeFilterChange,
  levelsList = [],
  onRefresh,
  loading = false,
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
          placeholder="Buscar por clase, sección, grado, carrera o profesor..."
          aria-label="Buscar clases y secciones"
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

      {/* 2. Filtros y Controles de Acción */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Filtro por Nivel Educativo */}
        <div className="relative min-w-[150px]">
          <select
            value={selectedLevelFilter}
            onChange={(e) => onLevelFilterChange(e.target.value)}
            aria-label="Filtrar por nivel educativo"
            className="w-full pl-3 pr-8 py-2.5 rounded-xl font-body text-xs sm:text-sm text-eco-text bg-eco-bg/90 border border-eco-border focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 outline-none transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">Todos los Grados</option>
            {levelsList.map((lvl) => (
              <option key={lvl.uid} value={lvl.uid}>
                {lvl.name} ({lvl.stage === 'BASICO' ? 'Básico' : 'Diversificado'})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-eco-muted">
            <Filter size={14} />
          </div>
        </div>

        {/* Filtro por Tipo de Clase */}
        <div className="relative min-w-[130px]">
          <select
            value={selectedTypeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            aria-label="Filtrar por tipo de clase"
            className="w-full pl-3 pr-8 py-2.5 rounded-xl font-body text-xs sm:text-sm text-eco-text bg-eco-bg/90 border border-eco-border focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 outline-none transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">Todos los Tipos</option>
            <option value="GUIA">Guía (Básicos)</option>
            <option value="TALLER">Taller (Diversificado)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-eco-muted">
            <Filter size={14} />
          </div>
        </div>

        {/* Botón de Refresco */}
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Recargar catálogo de clases"
          title="Recargar catálogo de clases"
          className="shrink-0 px-3"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-eco-green' : ''} />
        </Button>

        {/* Botón Principal para ADMIN / COORDINATOR (Única ubicación en la pantalla) */}
        {canManage && onCreate && (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onCreate}
            leftIcon={<Plus size={16} />}
            className="shrink-0 whitespace-nowrap text-xs sm:text-sm"
          >
            Nueva Clase
          </Button>
        )}
      </div>
    </div>
  )
}

export default ClassFilterBar
