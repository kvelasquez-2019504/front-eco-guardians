import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import {
  Archive,
  AlertTriangle,
  Lock,
  History,
  Calendar,
  Sparkles,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import { H1, H3 } from '@/components/atoms/Heading.jsx'
import { Button } from '@/components/atoms/Button.jsx'
import { CloseBimesterModal } from '@/components/organisms/ranking/CloseBimesterModal.jsx'
import { CollectivePodium } from '@/components/organisms/ranking/CollectivePodium.jsx'
import { getCollectiveRanking, closeBimester } from '@/service/ranking.api.js'

/**
 * Página: CloseBimesterPage
 * Vista formal para administradores y coordinadores:
 * Previsualización de los podios en disputa y congelamiento oficial e inmutable del bimestre.
 * Ruta: /admin/close-bimester
 */
export const CloseBimesterPage = () => {
  const navigate = useNavigate()
  const [bimester, setBimester] = useState(1)
  const [rankingData, setRankingData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Cargar podio y datos del bimestre seleccionado
  const fetchBimesterRanking = useCallback(async () => {
    setLoading(true)
    const res = await getCollectiveRanking({ bimester })
    if (!res.error && res.data) {
      setRankingData(res.data)
    } else {
      setRankingData(null)
    }
    setLoading(false)
  }, [bimester])

  useEffect(() => {
    let ignore = false
    const load = async () => {
      await Promise.resolve()
      if (!ignore) {
        fetchBimesterRanking()
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [fetchBimesterRanking])

  // Confirmar cierre oficial de bimestre
  const handleConfirmClose = async (payload) => {
    setActionLoading(true)
    const res = await closeBimester(payload)
    setActionLoading(false)

    if (res.error) {
      const msg =
        res.e?.response?.data?.message ||
        res.e?.response?.data?.msg ||
        'Error al procesar el cierre oficial del bimestre.'
      toast.error(msg)
      return
    }

    toast.success('¡Cierre oficial de bimestre ejecutado y podios archivados!')
    setIsModalOpen(false)
    // Redirigir al historial para auditar el acta congelada
    navigate('/rankings/history')
  }

  const podiumList = rankingData?.podium || []
  const leaderboardList = rankingData?.leaderboard || []

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Encabezado principal */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
              <Archive size={14} /> Administración Académica • Fin de Ciclo
            </div>
            <H1 variant="gradient">Cierre Oficial de Bimestre</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Congelamiento inmutable de podios escolares, fijación de puntajes en el historial institucional y entrega de diplomas ambientales.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              onClick={() => navigate('/rankings/history')}
              className="text-xs gap-1.5 border-eco-border hover:border-eco-cyan text-eco-cyan"
            >
              <History size={15} />
              Consultar Podios Archivados
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Banner de Advertencia Institucional */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <AlertTriangle size={22} />
          </div>
          <div className="space-y-1">
            <h4 className="font-heading font-bold text-sm text-amber-300">
              Protocolo de Congelamiento Permanente
            </h4>
            <p className="text-xs text-eco-muted font-body leading-relaxed max-w-2xl">
              Al ejecutar el cierre oficial, los puntajes de las secciones, el podio general, el podio de Ciclo Básico y Diversificado quedarán grabados en un acta histórica inmutable. Ninguna publicación posterior podrá modificar las posiciones de este bimestre.
            </p>
          </div>
        </div>

        {/* Botón único para abrir el modal formal */}
        <Button
          type="button"
          variant="primary"
          size="md"
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold border-none shrink-0 self-start md:self-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Lock size={16} />
          Ejecutar Cierre Bimestral
        </Button>
      </div>

      {/* 3. Selector de Bimestre para Previsualización */}
      <div className="p-4 rounded-2xl bg-eco-card border border-eco-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-heading font-bold text-eco-text uppercase tracking-wider">
            Previsualizar Bimestre:
          </span>
          <div className="flex items-center gap-1.5 bg-eco-bg p-1 rounded-xl border border-eco-border">
            {[1, 2, 3, 4].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBimester(b)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  bimester === b
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-eco-muted hover:text-eco-text'
                }`}
              >
                Bimestre {b}
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={fetchBimesterRanking}
          disabled={loading}
          className="text-xs gap-1.5 text-eco-muted hover:text-eco-text"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Actualizar Datos
        </Button>
      </div>

      {/* 4. Previsualización del Podio Actual */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-amber-400" />
          <H3 className="text-sm font-bold text-eco-text">
            Previsualización del Podio a Congelar (Bimestre {bimester})
          </H3>
        </div>

        {loading ? (
          <div className="p-16 text-center bg-eco-card border border-eco-border rounded-3xl shadow-xl">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
              <span className="text-sm font-body text-eco-muted">
                Calculando posiciones actuales...
              </span>
            </div>
          </div>
        ) : podiumList.length > 0 ? (
          <div className="space-y-6">
            <CollectivePodium podium={podiumList} />

            {/* Tabla resumen de puntuación */}
            <div className="bg-eco-card border border-eco-border rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between text-xs text-eco-muted">
                <span className="font-heading font-bold text-eco-text uppercase tracking-wider">
                  Resumen de Secciones Líderes
                </span>
                <span>{leaderboardList.length} secciones participantes</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-eco-text">
                  <thead className="bg-eco-bg/60 border-b border-eco-border text-[11px] font-semibold text-eco-muted uppercase">
                    <tr>
                      <th className="px-4 py-2.5">Posición</th>
                      <th className="px-4 py-2.5">Sección / Grado</th>
                      <th className="px-4 py-2.5">Nivel</th>
                      <th className="px-4 py-2.5 text-right">Puntos Totales</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-eco-border/50">
                    {leaderboardList.slice(0, 5).map((row, idx) => (
                      <tr key={row.classGroupId || idx} className="hover:bg-eco-card-hover/40">
                        <td className="px-4 py-3 font-mono font-bold text-eco-green">
                          #{idx + 1}
                        </td>
                        <td className="px-4 py-3 font-semibold text-eco-text">
                          {row.className} ({row.section})
                        </td>
                        <td className="px-4 py-3 text-eco-muted">
                          {row.levelName || 'Nivel'}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-amber-300">
                          {row.totalScore || 0} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-eco-card border border-eco-border rounded-2xl text-eco-muted space-y-2">
            <Calendar size={24} className="mx-auto text-eco-muted/60" />
            <p className="text-xs font-body">
              No hay suficientes publicaciones registradas en el Bimestre {bimester} para generar un podio formal.
            </p>
          </div>
        )}
      </div>

      {/* 5. Modal de Ejecución del Cierre */}
      <CloseBimesterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmClose}
        loading={actionLoading}
      />
    </div>
  )
}

export default CloseBimesterPage
