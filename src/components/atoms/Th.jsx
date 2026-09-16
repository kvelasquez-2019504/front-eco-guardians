/**
 * Átomo: Th (Table Header Cell)
 * Celda de cabecera accesible y estilizada para tablas de ranking, turnos y métricas en Eco-Guardianes.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Texto o contenido de la cabecera
 * @param {'left' | 'center' | 'right'} [props.align='left'] - Alineación del texto
 * @param {boolean} [props.sortable=false] - Indica si la columna permite ordenamiento interactivo
 * @param {'asc' | 'desc' | null} [props.sortDirection=null] - Estado actual del ordenamiento
 * @param {Function} [props.onSort] - Evento al presionar la cabecera cuando es ordenable
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const Th = ({
  children,
  align = 'left',
  sortable = false,
  sortDirection = null,
  onSort,
  className = '',
  ...props
}) => {
  const aligns = {
    left: 'text-left justify-start',
    center: 'text-center justify-center',
    right: 'text-right justify-end',
  }

  const selectedAlign = aligns[align] || aligns.left

  return (
    <th
      scope="col"
      aria-sort={
        sortDirection === 'asc'
          ? 'ascending'
          : sortDirection === 'desc'
          ? 'descending'
          : undefined
      }
      onClick={sortable ? onSort : undefined}
      className={`
        px-4 py-3.5 
        text-xs font-heading font-bold uppercase tracking-wider 
        border-b border-eco-border bg-eco-card/95 text-eco-muted
        transition-colors select-none
        ${sortable ? 'cursor-pointer hover:text-eco-text hover:bg-eco-card-hover' : ''}
        ${sortDirection ? 'text-eco-green' : ''}
        ${className}
      `}
      {...props}
    >
      <div className={`inline-flex items-center gap-1.5 w-full ${selectedAlign}`}>
        <span>{children}</span>

        {/* Indicador de ordenamiento para Rankings */}
        {sortable && (
          <span className="shrink-0 transition-transform text-xs" aria-hidden="true">
            {sortDirection === 'asc' && (
              <svg className="w-3.5 h-3.5 text-eco-green stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            )}
            {sortDirection === 'desc' && (
              <svg className="w-3.5 h-3.5 text-eco-green stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
            {sortDirection === null && (
              <svg className="w-3.5 h-3.5 text-eco-muted/40 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
              </svg>
            )}
          </span>
        )}
      </div>
    </th>
  )
}

export default Th
