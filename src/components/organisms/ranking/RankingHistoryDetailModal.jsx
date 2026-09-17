import { useState } from 'react'
import { X, Trophy, Medal, Sparkles } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'

/**
 * Organismo: RankingHistoryDetailModal
 * Modal interactivo para inspeccionar un podio histórico archivado y sus ganadores congelados.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.history - Registro histórico devuelto por la API
 */
export const RankingHistoryDetailModal = ({
  isOpen,
  onClose,
  history,
}) => {
  const [activeTab, setActiveTab] = useState('general')

  if (!isOpen || !history) return null

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('es-GT', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
  }

  const renderSectionPodium = (list = []) => {
    if (list.length === 0) {
      return (
        <div className="p-8 text-center text-xs text-eco-muted italic">
          No se registraron posiciones para esta categoría.
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map((sec, idx) => {
          const rank = sec.position || idx + 1
          const is1 = rank === 1
          const is2 = rank === 2

          const borderGlow = is1
            ? 'border-amber-400/60 bg-gradient-to-br from-amber-500/15 via-eco-card to-eco-bg'
            : is2
            ? 'border-slate-400/40 bg-gradient-to-br from-slate-500/10 via-eco-card to-eco-bg'
            : 'border-amber-700/40 bg-gradient-to-br from-amber-800/10 via-eco-card to-eco-bg'

          return (
            <div
              key={sec.classGroup || idx}
              className={`p-5 rounded-2xl border shadow-md space-y-3 ${borderGlow}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-eco-muted flex items-center gap-1">
                  {is1 ? <Trophy size={14} className="text-amber-400" /> : <Medal size={14} className={is2 ? 'text-slate-300' : 'text-amber-600'} />}
                  {rank}º Lugar
                </span>
                <span className="text-lg font-black font-heading text-eco-text">#{rank}</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-eco-text truncate">
                  {sec.className || 'Clase'}
                </h4>
                <p className="text-xs font-semibold text-eco-primary">
                  Sección {sec.section || '-'} • {sec.stage || 'Kinal'}
                </p>
              </div>

              <div className="pt-2 border-t border-eco-border/60 flex items-center justify-between text-xs">
                <span className="text-eco-muted">Puntos Finales</span>
                <span className="font-black text-amber-400 text-sm">{sec.totalScore || 0} pts</span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderStudentsTop = (list = []) => {
    if (list.length === 0) {
      return (
        <div className="p-8 text-center text-xs text-eco-muted italic">
          No se registraron alumnos líderes en este cierre.
        </div>
      )
    }

    return (
      <div className="divide-y divide-eco-border/60 border border-eco-border rounded-2xl overflow-hidden bg-eco-bg/50">
        {list.map((st, idx) => {
          const rank = st.position || idx + 1
          return (
            <div
              key={st.student || idx}
              className="p-3.5 flex items-center justify-between gap-3 text-xs hover:bg-eco-card-hover/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 font-black text-center text-eco-muted shrink-0">
                  #{rank}
                </span>
                <div className="min-w-0">
                  <span className="font-bold text-eco-text block truncate">
                    {st.name} {st.lastName || ''}
                  </span>
                  <span className="text-[10px] text-eco-muted">
                    Carné: {st.code || 'N/A'} • Nivel: {st.ecoAuraLevel || 'Novato'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 font-black text-amber-400 shrink-0">
                <Sparkles size={13} />
                <span>{st.ecoAuraPoints || 0} pts</span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-history-detail-title"
        className="bg-eco-card border border-eco-border rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Cabecera */}
        <div className="p-6 border-b border-eco-border flex items-center justify-between bg-eco-bg/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Trophy size={22} />
            </div>
            <div>
              <H3 id="modal-history-detail-title" className="text-eco-text">
                Acta Histórica: Bimestre {history.bimester} • Ciclo {history.academicYear || 2026}
              </H3>
              <p className="text-xs text-eco-muted mt-0.5">
                Cerrado el {formatDate(history.closedAt)} por {history.closedBy?.name || 'Autoridad Institucional'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 text-eco-muted hover:text-eco-text hover:bg-eco-card-hover rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Pestañas de Navegación de Categorías Congeladas */}
        <div className="p-4 px-6 border-b border-eco-border bg-eco-card flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'general', label: 'Podio General' },
            { id: 'basico', label: 'Ciclo Básico' },
            { id: 'diversificado', label: 'Diversificado' },
            { id: 'students', label: 'Top 10 Alumnos' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap
                ${activeTab === tab.id
                  ? 'bg-eco-primary text-black shadow-sm'
                  : 'text-eco-muted hover:text-eco-text hover:bg-eco-card-hover'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido según Pestaña */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {history.notes && (
            <div className="p-3.5 rounded-2xl bg-eco-card-hover/60 border border-eco-border text-xs text-eco-muted italic">
              &ldquo;{history.notes}&rdquo;
            </div>
          )}

          {activeTab === 'general' && renderSectionPodium(history.topSectionsGeneral)}
          {activeTab === 'basico' && renderSectionPodium(history.topSectionsBasico)}
          {activeTab === 'diversificado' && renderSectionPodium(history.topSectionsDiversificado)}
          {activeTab === 'students' && renderStudentsTop(history.topStudents)}
        </div>

        {/* Pie del modal */}
        <div className="p-4 px-6 border-t border-eco-border flex items-center justify-between text-xs text-eco-muted bg-eco-bg/40">
          <span>Registro histórico inmutable</span>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
