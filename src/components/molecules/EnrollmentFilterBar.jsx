import { Search, RefreshCw, UserPlus, Filter, FolderKanban } from 'lucide-react'
import { Button } from '../atoms/Button.jsx'

/**
 * Molécula: EnrollmentFilterBar
 * Barra interactiva para la gestión de matrículas:
 * Permite cambiar de clase activa, filtrar por jornada escolar (Matutina/Vespertina),
 * buscar alumnos en tiempo real y abrir el modal para matricular nuevos alumnos (única ubicación del botón).
 * 
 * @param {Object} props
 * @param {Array} [props.classesList=[]] - Catálogo de clases activas
 * @param {string} props.selectedClassId - ID de la clase seleccionada
 * @param {Function} props.onSelectClass - Callback al cambiar de clase
 * @param {string} props.searchQuery - Filtro de texto por alumno
 * @param {Function} props.onSearchQueryChange - Callback para cambio en búsqueda
 * @param {string} props.shiftFilter - Filtro por jornada ('', 'MATUTINA', 'VESPERTINA')
 * @param {Function} props.onShiftFilterChange - Callback para cambio de jornada
 * @param {Function} props.onRefresh - Callback al refrescar
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {boolean} [props.canManage=false] - Permiso para matricular (ADMIN o COORDINATOR)
 * @param {Function} [props.onEnroll] - Callback al presionar "Matricular Alumnos"
 */
export const EnrollmentFilterBar = ({
  classesList = [],
  selectedClassId,
  onSelectClass,
  searchQuery,
  onSearchQueryChange,
  shiftFilter,
  onShiftFilterChange,
  onRefresh,
  loading = false,
  canManage = false,
  onEnroll,
}) => {
  return (
    <div className="bg-eco-card border border-eco-border rounded-2xl p-4 shadow-lg flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      {/* 1. Selector de Clase Activa */}
      <div className="relative min-w-[260px] lg:max-w-xs">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-eco-green">
          <FolderKanban size={16} />
        </div>
        <select
          value={selectedClassId}
          onChange={(e) => onSelectClass(e.target.value)}
          disabled={loading || classesList.length === 0}
          aria-label="Seleccionar clase activa"
          className="w-full pl-10 pr-8 py-2.5 rounded-xl font-body text-xs sm:text-sm text-eco-text bg-eco-bg/90 border border-eco-border focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 outline-none transition-all duration-200 appearance-none cursor-pointer"
        >
          {classesList.length === 0 ? (
            <option value="">No hay clases registradas</option>
          ) : (
            classesList.map((cls) => (
              <option key={cls.uid} value={cls.uid}>
                {cls.name} (Secc. {cls.section}) - {cls.type === 'GUIA' ? 'Básico' : 'Diversificado'}
              </option>
            ))
          )}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-eco-muted">
          <Filter size={14} />
        </div>
      </div>

      {/* 2. Búsqueda de Alumno en vivo */}
      <div className="relative flex-1 min-w-[200px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-eco-muted">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Buscar alumno por nombre, carnet o correo..."
          aria-label="Buscar alumno en la clase"
          disabled={!selectedClassId}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl font-body text-sm text-eco-text bg-eco-bg/90 border border-eco-border focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 outline-none transition-all duration-200 placeholder:text-eco-muted disabled:opacity-50"
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

      {/* 3. Filtro por Jornada y Acciones */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Filtro por Jornada */}
        <div className="relative min-w-[130px]">
          <select
            value={shiftFilter}
            onChange={(e) => onShiftFilterChange(e.target.value)}
            disabled={!selectedClassId}
            aria-label="Filtrar por jornada"
            className="w-full pl-3 pr-8 py-2.5 rounded-xl font-body text-xs sm:text-sm text-eco-text bg-eco-bg/90 border border-eco-border focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 outline-none transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50"
          >
            <option value="">Todas las Jornadas</option>
            <option value="MATUTINA">Jornada Matutina</option>
            <option value="VESPERTINA">Jornada Vespertina</option>
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
          disabled={loading || !selectedClassId}
          aria-label="Recargar lista de alumnos"
          title="Recargar lista de alumnos"
          className="shrink-0 px-3"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-eco-green' : ''} />
        </Button>

        {/* Botón Principal para Matricular (Única ubicación en la pantalla para evitar duplicados en la cabecera) */}
        {canManage && onEnroll && (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onEnroll}
            disabled={!selectedClassId}
            leftIcon={<UserPlus size={16} />}
            className="shrink-0 whitespace-nowrap text-xs sm:text-sm"
          >
            Matricular Alumnos
          </Button>
        )}
      </div>
    </div>
  )
}

export default EnrollmentFilterBar
