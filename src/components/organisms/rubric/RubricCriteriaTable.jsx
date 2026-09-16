import { Edit2, Trash2, Award, Sparkles, BookOpen, ToggleLeft, ToggleRight } from 'lucide-react'
import { Th } from '../../atoms/Th.jsx'
import { Td } from '../../atoms/Td.jsx'
import { Tr } from '../../atoms/Tr.jsx'
import { Button } from '../../atoms/Button.jsx'
import { UserStatusBadge } from '../../molecules/UserStatusBadge.jsx'
import { RubricCategoryBadge } from '../../molecules/RubricCategoryBadge.jsx'

/**
 * Organismo: RubricCriteriaTable
 * Tabla responsiva para consultar y administrar los criterios oficiales de evaluación ecológica.
 * Ubicada en: src/components/organisms/rubric/
 * 
 * @param {Object} props
 * @param {Array} props.criteria - Lista de criterios filtrados
 * @param {boolean} props.loading - Estado de carga
 * @param {boolean} props.canManage - Permisos de creación y edición (ADMIN o COORDINATOR)
 * @param {boolean} props.canDelete - Permisos de eliminación definitiva (exclusivo ADMIN)
 * @param {Function} props.onEdit - Callback al presionar Editar
 * @param {Function} props.onToggleActive - Callback al alternar isActive en evaluaciones
 * @param {Function} props.onDelete - Callback al presionar Desactivar
 * @param {Function} [props.onSeed] - Callback para sembrado si la tabla está vacía
 * @param {boolean} [props.seedLoading=false] - Estado de carga del sembrado
 */
export const RubricCriteriaTable = ({
  criteria = [],
  loading = false,
  canManage = false,
  canDelete = false,
  onEdit,
  onToggleActive,
  onDelete,
  onSeed,
  seedLoading = false,
}) => {
  return (
    <div className="bg-eco-card border border-eco-border rounded-2xl shadow-xl overflow-hidden flex flex-col">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <Tr variant="header">
              <Th align="center" className="w-16">Orden</Th>
              <Th align="left">Criterio Evaluable</Th>
              <Th align="left">Categoría</Th>
              <Th align="center">Puntaje</Th>
              <Th align="center">En Evaluación</Th>
              <Th align="center">Estado</Th>
              {canManage && <Th align="right">Acciones</Th>}
            </Tr>
          </thead>

          <tbody className="divide-y divide-eco-border/60">
            {/* 1. Estado de Carga */}
            {loading && (
              <tr>
                <td colSpan={canManage ? 7 : 6} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-3 border-eco-green/20 border-t-eco-green rounded-full animate-spin" />
                    <span className="text-sm font-body text-eco-muted">
                      Consultando catálogo oficial de criterios evaluables...
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {/* 2. Estado Vacío */}
            {!loading && criteria.length === 0 && (
              <tr>
                <td colSpan={canManage ? 7 : 6} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                    <div className="p-3 bg-eco-bg rounded-2xl text-eco-muted border border-eco-border">
                      <BookOpen size={32} />
                    </div>
                    <span className="font-heading font-bold text-base text-eco-text">
                      No hay criterios en la rúbrica
                    </span>
                    <p className="text-xs text-eco-muted font-body leading-relaxed">
                      {canManage
                        ? 'Puedes sembrar automáticamente los criterios oficiales de Fundación Kinal o agregar nuevos manualmente.'
                        : 'No se encontraron criterios de evaluación que coincidan con los filtros aplicados.'}
                    </p>
                    {canDelete && onSeed && (
                      <div className="pt-2">
                        <Button
                          type="button"
                          variant="primary"
                          size="md"
                          onClick={onSeed}
                          disabled={seedLoading}
                          isLoading={seedLoading}
                          leftIcon={<Sparkles size={16} />}
                        >
                          Sembrar Criterios Oficiales
                        </Button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {/* 3. Filas de Criterios */}
            {!loading &&
              criteria.map((item) => {
                const isInactive = item.status === false
                const isActiveInEvaluation = item.isActive !== false

                return (
                  <Tr
                    key={item.uid}
                    className={`transition-colors duration-150 ${
                      isInactive ? 'opacity-60 bg-eco-bg/40' : 'hover:bg-eco-bg/60'
                    }`}
                  >
                    {/* A. Orden */}
                    <Td align="center" className="py-4">
                      <span className="font-mono text-xs font-bold text-eco-muted px-2 py-1 bg-eco-bg rounded-lg border border-eco-border">
                        #{item.order ?? 0}
                      </span>
                    </Td>

                    {/* B. Criterio Evaluable */}
                    <Td className="py-4 max-w-xs sm:max-w-md">
                      <div className="flex flex-col gap-1">
                        <span className="font-heading font-bold text-sm text-eco-text leading-snug">
                          {item.title}
                        </span>
                        {item.description ? (
                          <p className="text-xs text-eco-muted font-body leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        ) : (
                          <span className="text-[11px] text-eco-muted/70 italic font-body">
                            Sin descripción adicional
                          </span>
                        )}
                      </div>
                    </Td>

                    {/* C. Categoría */}
                    <Td className="py-4">
                      <RubricCategoryBadge category={item.category} />
                    </Td>

                    {/* D. Puntaje Oficial */}
                    <Td align="center" className="py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-black bg-eco-green/15 text-eco-green border border-eco-green/30">
                        <Award size={13} />
                        +{item.points} pts
                      </span>
                    </Td>

                    {/* E. Disponibilidad en Listas de Cotejo (isActive) */}
                    <Td align="center" className="py-4">
                      {canManage && onToggleActive ? (
                        <button
                          type="button"
                          onClick={() => onToggleActive(item)}
                          disabled={isInactive}
                          title={
                            isActiveInEvaluation
                              ? 'Habilitado en formularios de evaluación (clic para pausar)'
                              : 'Pausado de evaluaciones (clic para habilitar)'
                          }
                          aria-label={`Alternar estado de evaluación para ${item.title}`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold transition-all cursor-pointer border ${
                            isActiveInEvaluation
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30 hover:bg-zinc-500/25'
                          }`}
                        >
                          {isActiveInEvaluation ? (
                            <>
                              <ToggleRight size={14} className="text-emerald-400" />
                              <span>Activo</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft size={14} className="text-zinc-400" />
                              <span>Pausado</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold border ${
                            isActiveInEvaluation
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'
                          }`}
                        >
                          {isActiveInEvaluation ? 'Activo' : 'Pausado'}
                        </span>
                      )}
                    </Td>

                    {/* F. Estado Lógico del Registro */}
                    <Td align="center" className="py-4">
                      <UserStatusBadge status={item.status} />
                    </Td>

                    {/* G. Acciones (ADMIN y COORDINATOR) */}
                    {canManage && (
                      <Td align="right" className="py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botón Editar */}
                          {onEdit && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(item)}
                              title="Editar criterio"
                              aria-label={`Editar criterio ${item.title}`}
                              className="p-2 text-eco-muted hover:text-eco-text hover:bg-eco-border/40"
                            >
                              <Edit2 size={15} />
                            </Button>
                          )}

                          {/* Botón Desactivar (Exclusivo ADMIN) */}
                          {canDelete && onDelete && !isInactive && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(item)}
                              title="Desactivar criterio de la base de datos"
                              aria-label={`Desactivar criterio ${item.title}`}
                              className="p-2 text-eco-muted hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 size={15} />
                            </Button>
                          )}
                        </div>
                      </Td>
                    )}
                  </Tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RubricCriteriaTable
