import { useState, useEffect, useCallback } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { H1 } from '@/components/atoms/Heading.jsx'
import { Button } from '@/components/atoms/Button.jsx'
import { getIndividualRanking } from '@/service/ranking.api.js'
import { IndividualRankingTable } from '@/components/organisms/ranking/IndividualRankingTable.jsx'

/**
 * Página: IndividualRankingPage
 * Ranking individual de estudiantes por puntajes de gamificación Eco-Aura.
 * Ruta: /rankings/individual
 */
export const IndividualRankingPage = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState('ALL')

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    const params = {
      limit: 50,
      from: 0,
    }
    if (selectedLevel !== 'ALL') {
      params.level = selectedLevel
    }

    const res = await getIndividualRanking(params)
    if (!res.error && res.data) {
      const list = res.data.topStudents || (Array.isArray(res.data) ? res.data : [])
      setStudents(list)
    } else {
      setStudents([])
    }
    setLoading(false)
  }, [selectedLevel])

  useEffect(() => {
    let ignore = false
    const init = async () => {
      await Promise.resolve()
      if (!ignore) {
        fetchStudents()
      }
    }
    init()
    return () => {
      ignore = true
    }
  }, [fetchStudents])

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 
        Encabezado de la página:
        REGLA ESTRICTA: Sin botones de acción duplicados aquí.
      */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
              <Sparkles size={14} /> Gamificación Escolar
            </div>
            <H1 variant="gradient">Top Eco-Aura</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Reconocimiento al liderazgo individual y compromiso ecológico demostrado por cada estudiante de Fundación Kinal.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={fetchStudents}
              disabled={loading}
              className="text-xs gap-1.5 border-eco-border hover:border-eco-primary text-eco-muted hover:text-eco-text"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla y Destacados del Ranking Individual */}
      <IndividualRankingTable
        students={students}
        loading={loading}
        selectedLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
      />
    </div>
  )
}
export default IndividualRankingPage
