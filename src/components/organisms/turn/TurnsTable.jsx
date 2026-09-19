import { useState, useMemo } from 'react'
import {
  Search,
  CalendarPlus,
  Plus,
  Edit2,
  Trash2,
  Award,
  Calendar,
  Sparkles,
  Clock,
} from 'lucide-react'
import { Button } from '../../atoms/Button.jsx'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Organismo: TurnsTable
 * Tabla administrativa de turnos semanales con filtrado estricto por roles (RBAC) y acciones centralizadas.
 * 
 * @param {Object} props
 * @param {Array} props.turns - Listado de turnos
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {Function} props.onOpenGenerate - Abrir modal de generación algorítmica
 * @param {Function} props.onOpenCreate - Abrir modal de creación manual
 * @param {Function} props.onOpenEdit - Abrir modal de edición
 * @param {Function} props.onOpenDelete - Abrir modal de desactivación
 * @param {Function} props.onOpenBonus - Abrir modal de bono
 */
export const TurnsTable = ({
  turns = [],
  loading = false,
  onOpenGenerate,
  onOpenCreate,
  onOpenEdit,
  onOpenDelete,
  onOpenBonus,
}) => {
  const user = useAuthStore((state) => state.user)
  const currentRole = user?.role
  const isAdmin = currentRole === 'ADMIN'
  const isCoordinatorOrAdmin = isAdmin || currentRole === 'COORDINATOR'

  const [searchTerm, setSearchTerm] = useState('')
  const [bimesterFilter, setBimesterFilter] = useState('ALL')

  // Filtrado reactivo en memoria
  const filteredTurns = useMemo(() => {
    return turns.filter((turn) => {
      const matchBimester =
        bimesterFilter === 'ALL' || String(turn.bimester) === String(bimesterFilter)

      const searchLower = searchTerm.toLowerCase()
      const matchSearch =
        !searchTerm ||
        `semana ${turn.weekNumber}`.includes(searchLower) ||
        `bimestre ${turn.bimester}`.includes(searchLower) ||
        (turn.notes && turn.notes.toLowerCase().includes(searchLower)) ||
        (turn.activeLevels &&
          turn.activeLevels.some((lvl) =>
            lvl.name?.toLowerCase().includes(searchLower)
          ))

      return matchBimester && matchSearch
    })
  }, [turns, bimesterFilter, searchTerm])

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('es-GT', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="space-y-4">
      {/* 
        Barra de Filtros y Acciones:
        REGLA ESTRICTA: Los botones de acción se ubican exclusivamente en esta barra,
        nunca duplicados en la cabecera.
      */}
      <div className="p-4 rounded-3xl bg-eco-card border border-eco-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filtros de Búsqueda y Bimestre */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-eco-muted"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por semana, notas o grado..."
              className="w-full bg-eco-bg border border-eco-border rounded-xl pl-9 pr-3.5 py-2 text-xs text-eco-text placeholder:text-eco-muted/60 focus:border-eco-primary outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-eco-bg p-1 rounded-xl border border-eco-border shrink-0">
            <button
              type="button"
              onClick={() => setBimesterFilter('ALL')}
              className={`
                px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer
                ${bimesterFilter === 'ALL'
                  ? 'bg-eco-primary text-(--color-eco-cyan) shadow-sm'
                  : 'text-eco-muted hover:text-eco-text'}
              `}
            >
              Todos
            </button>
            {[1, 2, 3, 4].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBimesterFilter(String(b))}
                className={`
                  px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer
                  ${bimesterFilter === String(b)
                    ? 'bg-eco-primary text-(--color-eco-green) shadow-sm'
                    : 'text-eco-muted hover:text-eco-text'}
                `}
              >
                B{b}
              </button>
            ))}
          </div>
        </div>

        {/* Botones de Acción (Única ubicación autorizada) */}
        {isCoordinatorOrAdmin && (
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
            <Button
              variant="outline"
              onClick={onOpenGenerate}
              className="text-xs gap-1.5 border-eco-border hover:border-eco-primary text-eco-text"
            >
              <CalendarPlus size={16} className="text-eco-primary" />
              Generar Matriz Bimestral
            </Button>

            <Button
              variant="primary"
              onClick={onOpenCreate}
              className="text-xs gap-1.5"
            >
              <Plus size={16} />
              Crear Turno Manual
            </Button>
          </div>
        )}
      </div>

      {/* Contenedor de la Tabla */}
      <div className="bg-eco-card border border-eco-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-eco-text">
            <thead className="bg-eco-bg/75 border-b border-eco-border text-eco-muted uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-5 py-4">Bimestre y Semana</th>
                <th className="px-5 py-4">Periodo de Guardia</th>
                <th className="px-5 py-4">Niveles Educativos</th>
                <th className="px-5 py-4 text-center">Bonos de Guardia</th>
                <th className="px-5 py-4 text-center">Estado</th>
                {isCoordinatorOrAdmin && (
                  <th className="px-5 py-4 text-right">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-eco-border/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-eco-muted">
                    <div className="flex flex-col items-center justify-center gap-2 animate-pulse">
                      <Clock size={24} className="text-eco-primary animate-spin" />
                      <span>Cargando turnos semanales...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTurns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-eco-muted">
                    No se encontraron turnos registrados para el criterio seleccionado.
                  </td>
                </tr>
              ) : (
                filteredTurns.map((turn) => {
                  const isGranFinal = Boolean(turn.isAllLevelsActive)
                  const bonusCount = turn.bonusAwarded?.length || 0

                  return (
                    <tr
                      key={turn.uid}
                      className="hover:bg-eco-card-hover/40 transition-colors"
                    >
                      {/* Bimestre y Semana */}
                      <td className="px-5 py-4 font-bold text-eco-text">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-eco-card-hover text-eco-primary border border-eco-border">
                            <Clock size={14} />
                          </span>
                          <div>
                            <span className="block">Semana {turn.weekNumber}</span>
                            <span className="text-[10px] text-eco-muted uppercase font-normal">
                              Bimestre {turn.bimester} • {turn.academicYear || 2026}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Periodo de Guardia */}
                      <td className="px-5 py-4 text-eco-muted whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-eco-primary shrink-0" />
                          <span>{formatDate(turn.startDate)} - {formatDate(turn.endDate)}</span>
                        </div>
                      </td>

                      {/* Niveles de Guardia */}
                      <td className="px-5 py-4">
                        {isGranFinal ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30">
                            <Sparkles size={11} />
                            Todos los Grados (Gran Final)
                          </span>
                        ) : turn.activeLevels && turn.activeLevels.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {turn.activeLevels.map((lvl, idx) => (
                              <span
                                key={lvl.uid || idx}
                                className="px-2 py-0.5 rounded-md bg-eco-card-hover border border-eco-border text-[10px] text-eco-text truncate"
                              >
                                {lvl.name || 'Nivel'}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-eco-muted italic">
                            Sin niveles definidos
                          </span>
                        )}
                      </td>

                      {/* Bonos de Guardia */}
                      <td className="px-5 py-4 text-center">
                        {bonusCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            <Award size={13} />
                            {bonusCount} {bonusCount === 1 ? 'bono' : 'bonos'}
                          </span>
                        ) : (
                          <span className="text-eco-muted text-[11px]">0 bonos</span>
                        )}
                      </td>

                      {/* Estado */}
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`
                            px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase
                            ${turn.status !== false
                              ? 'bg-eco-green/15 text-eco-green border border-eco-green/30'
                              : 'bg-red-500/15 text-red-400 border border-red-500/30'}
                          `}
                        >
                          {turn.status !== false ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      {/* Acciones */}
                      {isCoordinatorOrAdmin && (
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Otorgar Bono */}
                            <button
                              type="button"
                              onClick={() => onOpenBonus(turn)}
                              title="Otorgar bono a sección destacada"
                              className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 rounded-lg transition-colors cursor-pointer"
                            >
                              <Award size={16} />
                            </button>

                            {/* Editar Turno */}
                            <button
                              type="button"
                              onClick={() => onOpenEdit(turn)}
                              title="Editar fechas o notas del turno"
                              className="p-1.5 text-eco-primary hover:text-eco-text hover:bg-eco-card-hover rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 size={16} />
                            </button>

                            {/* Desactivar Turno (Exclusivo ADMIN) */}
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => onOpenDelete(turn)}
                                title="Desactivar turno"
                                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
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
