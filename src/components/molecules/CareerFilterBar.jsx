import { Search, RefreshCw, Plus } from 'lucide-react'
import { Button } from '../atoms/Button.jsx'

/**
 * Molécula: CareerFilterBar
 * Barra interactiva con búsqueda en vivo, botón de recarga y acciones exclusivas para ADMIN.
 * 
 * @param {Object} props
 * @param {string} props.searchQuery - Término de búsqueda
 * @param {Function} props.onSearchQueryChange - Callback al escribir búsqueda
 * @param {Function} props.onRefresh - Callback al recargar lista
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {boolean} [props.isAdmin=false] - Si el usuario actual es ADMIN
 * @param {Function} [props.onCreateCareer] - Callback para abrir modal de creación
 */
export const CareerFilterBar = ({
  searchQuery,
  onSearchQueryChange,
  onRefresh,
  loading = false,
  isAdmin = false,
  onCreateCareer,
}) => {
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
          placeholder="Buscar por especialidad técnica o descripción..."
          aria-label="Buscar carrera técnica"
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

      {/* 2. Controles de acción */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Botón de Refresco */}
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Recargar lista"
          title="Recargar carreras"
          className="shrink-0 px-3"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-eco-green' : ''} />
        </Button>

        {/* Acciones exclusivas para ADMIN (ocultas para otros roles) */}
        {isAdmin && onCreateCareer && (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onCreateCareer}
            leftIcon={<Plus size={16} />}
            className="shrink-0 whitespace-nowrap text-xs sm:text-sm"
          >
            Nueva Carrera
          </Button>
        )}
      </div>
    </div>
  )
}

export default CareerFilterBar
