import { useState, useEffect, useCallback } from 'react'
import { Medal, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { H1 } from '@/components/atoms/Heading.jsx'
import { Button } from '@/components/atoms/Button.jsx'
import { getCollectiveRanking, closeBimester } from '@/service/ranking.api.js'
import { CollectivePodium } from '@/components/organisms/ranking/CollectivePodium.jsx'
import { CollectiveRankingTable } from '@/components/organisms/ranking/CollectiveRankingTable.jsx'
import { CloseBimesterModal } from '@/components/organisms/ranking/CloseBimesterModal.jsx'

/**
 * Página: CollectiveRankingPage
 * Leaderboard colectivo de secciones con podio olímpico y desglose de puntuaciones.
 * Ruta: /rankings/collective
 */
export const CollectiveRankingPage = () => {
  const [podium, setPodium] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Filtros de consulta
  const [bimester, setBimester] = useState('ALL')
  const [stage, setStage] = useState('ALL')
  const [shift, setShift] = useState('ALL')
  const [academicYear, setAcademicYear] = useState(2026)

  // Modal de cierre de bimestre
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)

  const fetchRanking = useCallback(async () => {
    setLoading(true)
    const params = {
      academicYear,
    }
    if (bimester !== 'ALL') params.bimester = Number(bimester)
    if (stage !== 'ALL') params.stage = stage
    if (shift !== 'ALL') params.shift = shift

    const res = await getCollectiveRanking(params)
    if (!res.error && res.data) {
      setPodium(res.data.podium || [])
      setLeaderboard(res.data.leaderboard || [])
    } else {
      setPodium([])
      setLeaderboard([])
    }
    setLoading(false)
  }, [bimester, stage, shift, academicYear])

  useEffect(() => {
    let ignore = false
    const init = async () => {
      await Promise.resolve()
      if (!ignore) {
        fetchRanking()
      }
    }
    init()
    return () => {
      ignore = true
    }
  }, [fetchRanking])

  const handleCloseBimester = async (payload) => {
    setActionLoading(true)
    const res = await closeBimester(payload)
    setActionLoading(false)

    if (res.error) {
      toast.error(res.e?.response?.data?.message || 'Error al ejecutar el cierre de bimestre.')
      return
    }

    toast.success('¡Cierre oficial de bimestre ejecutado y podio congelado con éxito!')
    setIsCloseModalOpen(false)
    fetchRanking()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 
        Encabezado de la página:
        REGLA ESTRICTA: Sin botones de acción duplicados aquí.
      */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-primary/15 text-eco-primary text-xs font-bold mb-3 border border-eco-primary/30">
              <Medal size={14} /> Leaderboards y Podios
            </div>
            <H1 variant="gradient">Ranking de Secciones</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Clasificación institucional de aulas basada en evidencias ecológicas verificadas y bonos de guardia de Fundación Kinal.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={fetchRanking}
              disabled={loading}
              className="text-xs gap-1.5 border-eco-border hover:border-eco-primary text-eco-muted hover:text-eco-text"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Podio Olímpico Top 3 */}
      <CollectivePodium podium={podium} loading={loading} />

      {/* Tabla Completa de Clasificación */}
      <CollectiveRankingTable
        leaderboard={leaderboard}
        loading={loading}
        bimester={bimester}
        onBimesterChange={setBimester}
        stage={stage}
        onStageChange={setStage}
        shift={shift}
        onShiftChange={setShift}
        academicYear={academicYear}
        onYearChange={setAcademicYear}
        onOpenCloseBimester={() => setIsCloseModalOpen(true)}
      />

      {/* Modal de Cierre Oficial de Bimestre */}
      <CloseBimesterModal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        onConfirm={handleCloseBimester}
        loading={actionLoading}
      />
    </div>
  )
}
export default CollectiveRankingPage
