import { useState, useEffect, useCallback } from 'react'
import { History, Trophy, Calendar, Eye, RefreshCw } from 'lucide-react'
import { H1, H3 } from '@/components/atoms/Heading.jsx'
import { Button } from '@/components/atoms/Button.jsx'
import { getRankingHistory } from '@/service/ranking.api.js'
import { RankingHistoryDetailModal } from '@/components/organisms/ranking/RankingHistoryDetailModal.jsx'

/**
 * Página: RankingHistoryPage
 * Archivo histórico de podios y ganadores oficiales congelados de bimestres anteriores.
 * Ruta: /rankings/history
 */
export const RankingHistoryPage = () => {
  const [historyList, setHistoryList] = useState([])
  const [loading, setLoading] = useState(true)
  const [bimesterFilter, setBimesterFilter] = useState('ALL')
  const [academicYear, setAcademicYear] = useState(2026)

  // Modal de detalle
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedHistory, setSelectedHistory] = useState(null)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    const params = { academicYear }
    if (bimesterFilter !== 'ALL') params.bimester = Number(bimesterFilter)

    const res = await getRankingHistory(params)
    if (!res.error && res.data) {
      const list = Array.isArray(res.data) ? res.data : (res.data.history || [])
      setHistoryList(list)
    } else {
      setHistoryList([])
    }
    setLoading(false)
  }, [bimesterFilter, academicYear])

  useEffect(() => {
    let ignore = false
    const init = async () => {
      await Promise.resolve()
      if (!ignore) {
        fetchHistory()
      }
    }
    init()
    return () => {
      ignore = true
    }
  }, [fetchHistory])

  const handleOpenDetail = (item) => {
    setSelectedHistory(item)
    setIsDetailOpen(true)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('es-GT', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 
        Encabezado de la página:
        REGLA ESTRICTA: Sin botones de acción duplicados aquí.
      */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-primary/15 text-eco-primary text-xs font-bold mb-3 border border-eco-primary/30">
              <History size={14} /> Historial Institucional
            </div>
            <H1 variant="gradient">Historial de Podios</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Registro inmutable de los podios oficiales, secciones campeonas y estudiantes premiados en bimestres concluidos.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={fetchHistory}
              disabled={loading}
              className="text-xs gap-1.5 border-eco-border hover:border-eco-primary text-eco-muted hover:text-eco-text"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="p-4 rounded-3xl bg-eco-card border border-eco-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-eco-primary" />
          <span className="text-xs font-semibold text-eco-text">Filtrar Bimestre:</span>
          <div className="flex items-center gap-1 bg-eco-bg p-1 rounded-xl border border-eco-border">
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

        <div className="flex items-center gap-2">
          <span className="text-xs text-eco-muted font-medium">Ciclo:</span>
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(Number(e.target.value))}
            className="bg-eco-bg border border-eco-border rounded-xl px-3 py-1.5 text-xs text-eco-text focus:border-eco-primary outline-hidden cursor-pointer"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
        </div>
      </div>

      {/* Listado de Actas Históricas */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-eco-card-hover" />
          ))}
        </div>
      ) : historyList.length === 0 ? (
        <div className="p-12 rounded-3xl bg-eco-card border border-eco-border text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-eco-card-hover border border-eco-border flex items-center justify-center mx-auto text-eco-muted">
            <History size={28} />
          </div>
          <H3 className="text-eco-text">Sin Cierres Registrados</H3>
          <p className="text-xs text-eco-muted max-w-sm mx-auto">
            Aún no se han ejecutado cierres oficiales de bimestre para este ciclo. Una vez concluido un bimestre, los administradores o coordinadores podrán congelar el podio.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {historyList.map((item) => {
            const champ = item.topSectionsGeneral?.[0]

            return (
              <div
                key={item.uid}
                className="p-6 rounded-3xl bg-eco-card border border-eco-border hover:border-eco-primary/40 hover:bg-eco-card-hover/40 transition-all duration-200 flex flex-col justify-between space-y-5 shadow-sm group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      <Trophy size={13} className="text-amber-400" />
                      Bimestre {item.bimester} • {item.academicYear || 2026}
                    </span>

                    <span className="text-xs text-eco-muted">
                      {formatDate(item.closedAt)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-eco-text group-hover:text-eco-primary transition-colors">
                      {champ ? `Campeón General: ${champ.className} (${champ.section})` : `Acta Oficial Bimestre ${item.bimester}`}
                    </h3>
                    {item.notes && (
                      <p className="text-xs text-eco-muted line-clamp-2 mt-1 italic">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-eco-bg/60 border border-eco-border/70 flex items-center justify-between text-xs text-eco-muted">
                    <span>Autoridad de Cierre:</span>
                    <span className="font-semibold text-eco-text">
                      {item.closedBy ? `${item.closedBy.name} ${item.closedBy.lastName || ''}` : 'Autoridad Institucional'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-eco-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-eco-muted">
                    Podios congelados e inmutables
                  </span>
                  <Button
                    variant="primary"
                    onClick={() => handleOpenDetail(item)}
                    className="text-xs gap-1.5"
                  >
                    <Eye size={14} />
                    Ver Acta y Ganadores
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de Detalle */}
      <RankingHistoryDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedHistory(null)
        }}
        history={selectedHistory}
      />
    </div>
  )
}
export default RankingHistoryPage
