import { useState, useMemo } from 'react'
import {
  Search,
  Trophy,
  Medal,
  Sparkles,
  Lock,
} from 'lucide-react'
import { Button } from '../../atoms/Button.jsx'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Organismo: CollectiveRankingTable
 * Tabla consolidada del ranking colectivo por sección con filtros multicriterio y acción de cierre.
 * 
 * @param {Object} props
 * @param {Array} props.leaderboard - Arreglo completo de secciones ordenadas algorítmicamente
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {string|number} props.bimester - Bimestre seleccionado ('ALL' o 1..4)
 * @param {Function} props.onBimesterChange - Cambio de bimestre
 * @param {string} props.stage - Etapa seleccionada ('ALL', 'BASICO', 'DIVERSIFICADO')
 * @param {Function} props.onStageChange - Cambio de etapa
 * @param {string} props.shift - Jornada seleccionada ('ALL', 'MATUTINA', 'VESPERTINA')
 * @param {Function} props.onShiftChange - Cambio de jornada
 * @param {number} props.academicYear - Ciclo escolar (2026)
 * @param {Function} props.onYearChange - Cambio de año
 * @param {Function} [props.onOpenCloseBimester] - Abrir modal de cierre de bimestre (ADMIN / COORDINATOR)
 */
export const CollectiveRankingTable = ({
  leaderboard = [],
  loading = false,
  bimester = 'ALL',
  onBimesterChange,
  stage = 'ALL',
  onStageChange,
  shift = 'ALL',
  onShiftChange,
  academicYear = 2026,
  onYearChange,
  onOpenCloseBimester,
}) => {
  const user = useAuthStore((state) => state.user)
  const canCloseBimester = user?.role === 'ADMIN' || user?.role === 'COORDINATOR'

  const [searchTerm, setSearchTerm] = useState('')

  // Filtrado reactivo en memoria por texto de búsqueda
  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return leaderboard
    const term = searchTerm.toLowerCase()
    return leaderboard.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(term)
      const sectionMatch = item.section?.toLowerCase().includes(term)
      const careerMatch = item.careerName?.toLowerCase().includes(term)
      const teacherMatch = item.teacher?.toLowerCase().includes(term)
      const levelMatch = item.levelName?.toLowerCase().includes(term)
      return nameMatch || sectionMatch || careerMatch || teacherMatch || levelMatch
    })
  }, [leaderboard, searchTerm])

  return (
    <div className="space-y-4">
      {/* 
        Barra de Filtros y Acciones Únicas:
        REGLA ESTRICTA: El botón de cierre de bimestre se ubica exclusivamente en esta barra,
        nunca en la cabecera de la página.
      */}
      <div className="p-4 rounded-3xl bg-eco-card border border-eco-border shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Controles de Filtros */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto flex-1">
          {/* Buscador */}
          <div className="relative flex-1 sm:max-w-xs min-w-[200px]">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-eco-muted"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar sección, carrera o profesor..."
              className="w-full bg-eco-bg border border-eco-border rounded-xl pl-9 pr-3 py-2 text-xs text-eco-text placeholder:text-eco-muted/60 focus:border-eco-primary outline-hidden"
            />
          </div>

          {/* Selector de Bimestre */}
          <div className="flex items-center gap-1 bg-eco-bg p-1 rounded-xl border border-eco-border shrink-0">
            <button
              type="button"
              onClick={() => onBimesterChange('ALL')}
              className={`
                px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer
                ${bimester === 'ALL'
                  ? 'bg-eco-primary text-black shadow-sm'
                  : 'text-eco-muted hover:text-eco-text'}
              `}
            >
              Anual
            </button>
            {[1, 2, 3, 4].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => onBimesterChange(b)}
                className={`
                  px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer
                  ${String(bimester) === String(b)
                    ? 'bg-eco-primary text-black shadow-sm'
                    : 'text-eco-muted hover:text-eco-text'}
                `}
              >
                B{b}
              </button>
            ))}
          </div>

          {/* Selector de Etapa */}
          <select
            value={stage}
            onChange={(e) => onStageChange(e.target.value)}
            className="bg-eco-bg border border-eco-border rounded-xl px-3 py-2 text-xs text-eco-text focus:border-eco-primary outline-hidden cursor-pointer"
          >
            <option value="ALL">Todas las Etapas</option>
            <option value="BASICO">Ciclo Básico</option>
            <option value="DIVERSIFICADO">Diversificado</option>
          </select>

          {/* Selector de Jornada */}
          <select
            value={shift}
            onChange={(e) => onShiftChange(e.target.value)}
            className="bg-eco-bg border border-eco-border rounded-xl px-3 py-2 text-xs text-eco-text focus:border-eco-primary outline-hidden cursor-pointer"
          >
            <option value="ALL">Todas las Jornadas</option>
            <option value="MATUTINA">Matutina</option>
            <option value="VESPERTINA">Vespertina</option>
          </select>

          {/* Ciclo Lectivo */}
          <select
            value={academicYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="bg-eco-bg border border-eco-border rounded-xl px-3 py-2 text-xs text-eco-text focus:border-eco-primary outline-hidden cursor-pointer"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
        </div>

        {/* Botón Único de Cierre de Bimestre (ADMIN / COORDINATOR) */}
        {canCloseBimester && onOpenCloseBimester && (
          <div className="w-full sm:w-auto shrink-0 flex justify-end">
            <Button
              variant="outline"
              onClick={onOpenCloseBimester}
              className="text-xs gap-1.5 border-amber-500/40 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 font-semibold"
            >
              <Lock size={15} className="text-amber-400" />
              Cerrar Bimestre Oficial
            </Button>
          </div>
        )}
      </div>

      {/* Tabla de Clasificación */}
      <div className="bg-eco-card border border-eco-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-eco-text">
            <thead className="bg-eco-bg/75 border-b border-eco-border text-eco-muted uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-5 py-4 text-center">Posición</th>
                <th className="px-5 py-4">Aula y Sección</th>
                <th className="px-5 py-4">Etapa / Nivel</th>
                <th className="px-5 py-4">Carrera Técnica</th>
                <th className="px-5 py-4">Docente Titular</th>
                <th className="px-5 py-4 text-center">Evidencias</th>
                <th className="px-5 py-4 text-center">Pts. Posts</th>
                <th className="px-5 py-4 text-center">Pts. Bonos</th>
                <th className="px-5 py-4 text-right">Puntaje Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-eco-border/60">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-eco-muted">
                    <div className="flex flex-col items-center justify-center gap-2 animate-pulse">
                      <Trophy size={24} className="text-eco-primary animate-bounce" />
                      <span>Calculando leaderboard en tiempo real...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-eco-muted">
                    No se encontraron aulas para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const isTop1 = item.position === 1
                  const isTop2 = item.position === 2
                  const isTop3 = item.position === 3
                  const isPodium = isTop1 || isTop2 || isTop3

                  return (
                    <tr
                      key={item.classGroupId || item.position}
                      className={`
                        transition-colors hover:bg-eco-card-hover/40
                        ${isTop1 ? 'bg-amber-500/5 font-medium' : ''}
                      `}
                    >
                      {/* Posición */}
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center">
                          {isTop1 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm">
                              <Trophy size={13} className="text-amber-400" />
                              1º
                            </span>
                          ) : isTop2 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-slate-400/20 text-slate-200 border border-slate-400/30">
                              <Medal size={13} className="text-slate-300" />
                              2º
                            </span>
                          ) : isTop3 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-800/20 text-amber-400 border border-amber-700/30">
                              <Medal size={13} className="text-amber-600" />
                              3º
                            </span>
                          ) : (
                            <span className="font-bold text-eco-muted text-xs">
                              #{item.position}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Aula y Sección */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-eco-text truncate max-w-xs">
                          {item.name}
                        </div>
                        <span className="text-[11px] font-semibold text-eco-primary">
                          Sección {item.section}
                        </span>
                      </td>

                      {/* Etapa / Nivel */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs text-eco-text font-medium block">
                          {item.levelName || '-'}
                        </span>
                        <span className="text-[10px] text-eco-muted uppercase">
                          {item.stage || '-'}
                        </span>
                      </td>

                      {/* Carrera Técnica */}
                      <td className="px-5 py-4">
                        {item.careerName ? (
                          <span className="inline-block text-[11px] px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium truncate max-w-xs">
                            {item.careerName}
                          </span>
                        ) : (
                          <span className="text-eco-muted text-[11px]">-</span>
                        )}
                      </td>

                      {/* Docente Titular */}
                      <td className="px-5 py-4 text-eco-muted truncate max-w-[150px]">
                        {item.teacher || 'Sin asignar'}
                      </td>

                      {/* Evidencias */}
                      <td className="px-5 py-4 text-center font-semibold text-eco-text">
                        {item.postsCount}
                      </td>

                      {/* Puntos Posts */}
                      <td className="px-5 py-4 text-center text-eco-muted font-medium">
                        {item.postPoints} pts
                      </td>

                      {/* Puntos Bonos */}
                      <td className="px-5 py-4 text-center text-amber-400 font-semibold">
                        +{item.bonusPoints} pts
                      </td>

                      {/* Puntaje Total */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 font-black text-sm">
                          {isPodium && <Sparkles size={14} className="text-amber-400" />}
                          <span className={isTop1 ? 'text-amber-400 text-base' : 'text-eco-text'}>
                            {item.totalScore}
                          </span>
                          <span className="text-[10px] font-semibold text-eco-muted">pts</span>
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
