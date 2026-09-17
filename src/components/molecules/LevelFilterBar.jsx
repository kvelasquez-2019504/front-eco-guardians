import { Search, RefreshCw, Plus } from 'lucide-react'
import { SelectField } from './SelectField.jsx'
import { Button } from '../atoms/Button.jsx'

/**
 * Molécula: LevelFilterBar
 * Barra interactiva con búsqueda en vivo, filtro por etapa académica y botones de acción (solo ADMIN).
 * 
 * @param {Object} props
 * @param {string} props.searchQuery - Término de búsqueda
 * @param {Function} props.onSearchQueryChange - Callback al escribir búsqueda
 * @param {string} props.stageFilter - Etapa seleccionada ('', 'BASICO', 'DIVERSIFICADO')
 * @param {Function} props.onStageFilterChange - Callback al cambiar etapa
 * @param {Function} props.onRefresh - Callback al recargar lista
 * @param {boolean} [props.loading=false] - Estado de carga de la lista
 * @param {boolean} [props.isAdmin=false] - Si el usuario actual es ADMIN
 * @param {Function} [props.onCreateLevel] - Callback para abrir modal de creación
 */
export const LevelFilterBar = ({
  searchQuery,
  onSearchQueryChange,
  stageFilter,
  onStageFilterChange,
  onRefresh,
  loading = false,
  isAdmin = false,
  onCreateLevel,
}) => {
  const stageOptions = [
    { value: '', label: 'Todas las etapas' },
    { value: 'BASICO', label: 'Ciclo Básico' },
    { value: 'DIVERSIFICADO', label: 'Ciclo Diversificado' },
  ]

  return (
    <div className="bg-eco-card border border-eco-border rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* 1. Búsqueda en vivo */}
      <div className="relative flex-1 min-w-[240px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-eco-muted">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Buscar por grado o sección (ej: Primero, A, Básico)..."
          aria-label="Buscar nivel educativo"
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

      {/* 2. Controles de filtro y acciones */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Selector de Etapa */}
        <div className="w-48">
          <SelectField
            name="stageFilter"
            value={stageFilter}
            onChange={(e) => onStageFilterChange(e.target.value)}
            options={stageOptions}
            className="w-full"
            aria-label="Filtrar por etapa educativa"
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
          title="Recargar niveles"
          className="shrink-0 px-3"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-eco-green' : ''} />
        </Button>

        {/* Acciones exclusivas para ADMIN (ocultas para COORDINATOR) */}
        {isAdmin && onCreateLevel && (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onCreateLevel}
            leftIcon={<Plus size={16} />}
            className="shrink-0 whitespace-nowrap text-xs sm:text-sm"
          >
            Nuevo Nivel
          </Button>
        )}
      </div>
    </div>
  )
}

export default LevelFilterBar
