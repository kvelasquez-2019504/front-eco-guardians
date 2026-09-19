import { useState, useMemo } from 'react'
import {
  Search,
  Sparkles,
  Trophy,
  Medal,
  Shield,
  Leaf,
  Crown,
  User,
} from 'lucide-react'

/**
 * Organismo: IndividualRankingTable
 * Tabla del ranking individual de estudiantes por puntaje acumulado de Eco-Aura.
 * 
 * @param {Object} props
 * @param {Array} props.students - Arreglo de alumnos ordenados por puntaje
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {string} props.selectedLevel - Nivel de aura seleccionado ('ALL', 'NOVATO', 'GUARDIAN', 'LEYENDA')
 * @param {Function} props.onLevelChange - Callback al cambiar el nivel
 */
export const IndividualRankingTable = ({
  students = [],
  loading = false,
  selectedLevel = 'ALL',
  onLevelChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students
    const term = searchTerm.toLowerCase()
    return students.filter((s) => {
      const fullName = `${s.name || ''} ${s.lastName || ''}`.toLowerCase()
      const codeMatch = s.code?.toLowerCase().includes(term)
      return fullName.includes(term) || codeMatch
    })
  }, [students, searchTerm])

  const top3 = students.slice(0, 3)

  const renderAuraBadge = (level) => {
    const clean = String(level || 'NOVATO').toUpperCase()
    if (clean === 'LEYENDA') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm shadow-amber-400/10">
          <Crown size={12} className="text-amber-400" />
          Leyenda
        </span>
      )
    }
    if (clean === 'GUARDIAN') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
          <Shield size={12} className="text-blue-400" />
          Guardián
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-eco-green/15 text-eco-green border border-eco-green/30">
        <Leaf size={12} className="text-eco-green" />
        Novato
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tarjetas Destacadas: Top 3 Estudiantes Líderes */}
      {!loading && top3.length > 0 && selectedLevel === 'ALL' && !searchTerm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3.map((student, idx) => {
            const is1 = idx === 0
            const is2 = idx === 1

            const borderGlow = is1
              ? 'border-amber-400/60 bg-gradient-to-br from-amber-500/15 via-eco-card to-eco-bg ring-1 ring-amber-400/20'
              : is2
              ? 'border-slate-400/40 bg-gradient-to-br from-slate-500/10 via-eco-card to-eco-bg'
              : 'border-amber-700/40 bg-gradient-to-br from-amber-800/10 via-eco-card to-eco-bg'

            return (
              <div
                key={student.uid || idx}
                className={`p-5 rounded-3xl border shadow-lg flex items-center gap-4 transition-all duration-300 ${borderGlow}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-eco-card-hover border border-eco-border flex items-center justify-center shrink-0 text-xl font-bold">
                  {is1 ? (
                    <Trophy size={28} className="text-amber-400" />
                  ) : is2 ? (
                    <Medal size={28} className="text-slate-300" />
                  ) : (
                    <Medal size={28} className="text-amber-600" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black uppercase text-eco-muted">
                      Puesto #{student.position || idx + 1}
                    </span>
                    {renderAuraBadge(student.ecoAura?.level)}
                  </div>

                  <h4 className="text-base font-bold text-eco-text truncate mt-0.5">
                    {student.name} {student.lastName || ''}
                  </h4>

                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="text-eco-muted text-[11px]">
                      Carné: {student.code || 'N/A'}
                    </span>
                    <div className="flex items-center gap-1 font-black text-amber-400">
                      <Sparkles size={13} />
                      <span>{student.ecoAura?.points || 0} pts</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="p-4 rounded-3xl bg-eco-card border border-eco-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-eco-muted"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o carné de alumno..."
            className="w-full bg-eco-bg border border-eco-border rounded-xl pl-9 pr-3 py-2 text-xs text-eco-text placeholder:text-eco-muted/60 focus:border-eco-primary outline-hidden"
          />
        </div>

        {/* Filtro por Rango Eco-Aura */}
        <div className="flex items-center gap-1 bg-eco-bg p-1 rounded-xl border border-eco-border w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'Todos' },
            { id: 'NOVATO', label: 'Novatos' },
            { id: 'GUARDIAN', label: 'Guardianes' },
            { id: 'LEYENDA', label: 'Leyendas' },
          ].map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => onLevelChange(lvl.id)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap
                ${selectedLevel === lvl.id
                  ? 'bg-eco-primary text-(--color-eco-cyan) shadow-sm'
                  : 'text-eco-muted hover:text-eco-text'}
              `}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Alumnos */}
      <div className="bg-eco-card border border-eco-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-eco-text">
            <thead className="bg-eco-bg/75 border-b border-eco-border text-eco-muted uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-5 py-4 text-center">Posición</th>
                <th className="px-5 py-4">Estudiante</th>
                <th className="px-5 py-4 text-center">Carné Institucional</th>
                <th className="px-5 py-4 text-center">Rango Eco-Aura</th>
                <th className="px-5 py-4 text-right">Puntos Eco-Aura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-eco-border/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-eco-muted">
                    <div className="flex flex-col items-center justify-center gap-2 animate-pulse">
                      <Sparkles size={24} className="text-amber-400 animate-spin" />
                      <span>Cargando ranking individual...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-eco-muted">
                    No se encontraron estudiantes para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
                  const is1 = st.position === 1
                  const is2 = st.position === 2
                  const is3 = st.position === 3

                  return (
                    <tr
                      key={st.uid || st.position}
                      className="hover:bg-eco-card-hover/40 transition-colors"
                    >
                      {/* Posición */}
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        {is1 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/40">
                            <Trophy size={13} className="text-amber-400" />
                            1º
                          </span>
                        ) : is2 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-400/20 text-slate-200 border border-slate-400/30">
                            <Medal size={13} className="text-slate-300" />
                            2º
                          </span>
                        ) : is3 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-800/20 text-amber-400 border border-amber-700/30">
                            <Medal size={13} className="text-amber-600" />
                            3º
                          </span>
                        ) : (
                          <span className="font-bold text-eco-muted">
                            #{st.position}
                          </span>
                        )}
                      </td>

                      {/* Estudiante */}
                      <td className="px-5 py-4 font-bold text-eco-text">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-eco-card-hover border border-eco-border flex items-center justify-center text-eco-muted">
                            <User size={14} />
                          </div>
                          <span className="truncate">
                            {st.name} {st.lastName || ''}
                          </span>
                        </div>
                      </td>

                      {/* Carné */}
                      <td className="px-5 py-4 text-center text-eco-muted font-medium">
                        {st.code || 'Sin carné'}
                      </td>

                      {/* Rango */}
                      <td className="px-5 py-4 text-center">
                        {renderAuraBadge(st.ecoAura?.level)}
                      </td>

                      {/* Puntos */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 font-black text-sm text-amber-400">
                          <Sparkles size={14} />
                          <span>{st.ecoAura?.points || 0}</span>
                          <span className="text-[10px] text-eco-muted font-semibold">pts</span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
