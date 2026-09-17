import { Search, RefreshCw, Plus, Filter, FolderKanban, ShieldCheck } from 'lucide-react'
import { Button } from '../atoms/Button.jsx'

/**
 * Molécula: PostFilterBar
 * Barra interactiva para filtrado de publicaciones y evidencias ecológicas:
 * Filtro por aula/sección, jornada, estado de verificación docente,
 * búsqueda reactiva, botón de refresco y disparador de "+ Subir Evidencia" (única ubicación en la vista).
 * 
 * @param {Object} props
 * @param {string} props.searchQuery - Filtro de texto
 * @param {Function} props.onSearchQueryChange - Callback al cambiar búsqueda
 * @param {Array} [props.classesList=[]] - Catálogo de aulas activas
 * @param {string} props.selectedClassFilter - Aula seleccionada
 * @param {Function} props.onClassFilterChange - Callback cambio de aula
 * @param {string} props.selectedShiftFilter - Jornada seleccionada
 * @param {Function} props.onShiftFilterChange - Callback cambio de jornada
 * @param {string} props.selectedVerifiedFilter - Filtro de verificación ('', 'verified', 'unverified')
 * @param {Function} props.onVerifiedFilterChange - Callback cambio de verificación
 * @param {Function} props.onRefresh - Callback al refrescar feed
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {boolean} [props.canPost=false] - Si el usuario puede publicar (STUDENT o ADMIN)
 * @param {Function} [props.onCreatePost] - Callback al presionar "+ Subir Evidencia"
 */
export const PostFilterBar = ({
  searchQuery,
  onSearchQueryChange,
  classesList = [],
  selectedClassFilter,
  onClassFilterChange,
  selectedShiftFilter,
  onShiftFilterChange,
  selectedVerifiedFilter,
  onVerifiedFilterChange,
  onRefresh,
  loading = false,
  canPost = false,
  onCreatePost,
}) => {
  return (
    <div className="bg-eco-card border border-eco-border rounded-2xl p-4 shadow-lg flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      {/* 1. Búsqueda reactiva */}
      <div className="relative flex-1 min-w-[220px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-eco-muted">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Buscar por estudiante, acción ecológica o aula..."
          aria-label="Buscar evidencias ecológicas"
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

      {/* 2. Filtros Selectores y Acciones */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Filtro por Aula / Clase */}
        {classesList.length > 0 && (
          <div className="relative min-w-[150px]">
            <select
              value={selectedClassFilter}
              onChange={(e) => onClassFilterChange(e.target.value)}
              aria-label="Filtrar por clase"
              className="w-full pl-3 pr-8 py-2.5 rounded-xl font-body text-xs sm:text-sm text-eco-text bg-eco-bg/90 border border-eco-border focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 outline-none transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="">Todas las Aulas</option>
              {classesList.map((cls) => (
                <option key={cls.uid} value={cls.uid}>
                  {cls.name} (Secc. {cls.section})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-eco-muted">
              <FolderKanban size={14} />
            </div>
          </div>
        )}

        {/* Filtro por Jornada */}
        <div className="relative min-w-[130px]">
          <select
            value={selectedShiftFilter}
            onChange={(e) => onShiftFilterChange(e.target.value)}
            aria-label="Filtrar por jornada"
            className="w-full pl-3 pr-8 py-2.5 rounded-xl font-body text-xs sm:text-sm text-eco-text bg-eco-bg/90 border border-eco-border focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 outline-none transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">Jornadas: Todas</option>
            <option value="MATUTINA">Matutina</option>
            <option value="VESPERTINA">Vespertina</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-eco-muted">
            <Filter size={14} />
          </div>
        </div>

        {/* Filtro por Verificación Docente */}
        <div className="relative min-w-[140px]">
          <select
            value={selectedVerifiedFilter}
            onChange={(e) => onVerifiedFilterChange(e.target.value)}
            aria-label="Filtrar por verificación oficial"
            className="w-full pl-3 pr-8 py-2.5 rounded-xl font-body text-xs sm:text-sm text-eco-text bg-eco-bg/90 border border-eco-border focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 outline-none transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">Estado: Todos</option>
            <option value="verified">Verificadas</option>
            <option value="unverified">Por Calificar</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-eco-muted">
            <ShieldCheck size={14} />
          </div>
        </div>

        {/* Botón de Refresco */}
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Recargar feed"
          title="Recargar feed"
          className="shrink-0 px-3"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-eco-green' : ''} />
        </Button>

        {/* Botón Principal "+ Subir Evidencia" (Única ubicación en la pantalla) */}
        {canPost && onCreatePost && (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onCreatePost}
            leftIcon={<Plus size={16} />}
            className="shrink-0 whitespace-nowrap text-xs sm:text-sm"
          >
            Subir Evidencia
          </Button>
        )}
      </div>
    </div>
  )
}

export default PostFilterBar
