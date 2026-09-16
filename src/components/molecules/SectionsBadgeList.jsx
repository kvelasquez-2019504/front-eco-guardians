/**
 * Molécula: SectionsBadgeList
 * Renderiza la lista de secciones habilitadas para un nivel como una serie de chips ordenados y legibles.
 * 
 * @param {Object} props
 * @param {Array<string>} [props.sections=[]] - Lista de secciones (ej: ['A', 'B', 'C'])
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const SectionsBadgeList = ({ sections = [], className = '' }) => {
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return <span className="text-eco-muted/50 text-xs">—</span>
  }

  // Ordenar alfabéticamente
  const sortedSections = [...sections].sort()

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {sortedSections.map((sec) => (
        <span
          key={sec}
          className="inline-flex items-center justify-center min-w-[24px] px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-eco-bg/90 text-eco-text border border-eco-border shadow-2xs"
        >
          {sec}
        </span>
      ))}
    </div>
  )
}

export default SectionsBadgeList
