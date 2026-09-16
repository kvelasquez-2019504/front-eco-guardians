import { BookOpen, Award, CheckCircle2, Flame, Layers } from 'lucide-react'
import { useRubric } from '@/shared/hooks/useRubric.js'
import { H1 } from '@/components/atoms/Heading.jsx'
import { RubricFilterBar } from '@/components/molecules/RubricFilterBar.jsx'
import { RubricCriteriaTable } from '@/components/organisms/rubric/RubricCriteriaTable.jsx'
import { CriterionCreateModal } from '@/components/organisms/rubric/CriterionCreateModal.jsx'
import { CriterionEditModal } from '@/components/organisms/rubric/CriterionEditModal.jsx'
import { CriterionDeleteModal } from '@/components/organisms/rubric/CriterionDeleteModal.jsx'

/**
 * Página: RubricPage
 * Consulta y gestión de la Rúbrica Oficial de Evaluación de Eco-Guardianes.
 * Ruta: /rubric
 */
export const RubricPage = () => {
  const {
    filteredCriteria,
    metrics,
    loading,
    actionLoading,
    seedLoading,
    canManage,
    canDelete,
    canSeed,

    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    activeFilter,
    setActiveFilter,
    fetchCriteria,

    selectedCriterion,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,

    handleCreateCriterion,
    handleUpdateCriterion,
    handleToggleActive,
    handleDeleteCriterion,
    handleSeedCriteria,
  } = useRubric()

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Encabezado principal y métricas (sin botones duplicados) */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-green/15 text-eco-green text-xs font-bold mb-3 border border-eco-green/30">
              <BookOpen size={14} /> Módulo Ecológico
            </div>
            <H1 variant="gradient">Rúbrica Oficial</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Criterios y estándares evaluables para la asignación de puntajes Eco-Aura en turnos y evidencias ecológicas de Fundación Kinal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            {/* Tarjetas métricas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              {/* Total Criterios */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[80px]">
                <span className="text-[11px] font-body text-eco-muted flex items-center justify-center gap-1">
                  <Award size={12} /> Criterios
                </span>
                <span className="font-heading font-black text-xl text-eco-text block mt-0.5">
                  {metrics.total}
                </span>
              </div>

              {/* En Evaluación */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[80px]">
                <span className="text-[11px] font-body text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 size={12} /> Activos
                </span>
                <span className="font-heading font-black text-xl text-emerald-400 block mt-0.5">
                  {metrics.activeInEvaluation}
                </span>
              </div>

              {/* Puntaje Máximo Acumulado */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[80px]">
                <span className="text-[11px] font-body text-eco-green flex items-center justify-center gap-1">
                  <Flame size={12} /> Puntos Máx.
                </span>
                <span className="font-heading font-black text-xl text-eco-green block mt-0.5">
                  {metrics.totalPoints} <span className="text-xs font-normal opacity-70">pts</span>
                </span>
              </div>

              {/* Categorías Cubiertas */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[80px]">
                <span className="text-[11px] font-body text-eco-cyan flex items-center justify-center gap-1">
                  <Layers size={12} /> Categorías
                </span>
                <span className="font-heading font-black text-xl text-eco-cyan block mt-0.5">
                  {metrics.categoriesCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Barra de filtros y acciones (única ubicación de los botones) */}
      <RubricFilterBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        activeFilter={activeFilter}
        onActiveFilterChange={setActiveFilter}
        onRefresh={fetchCriteria}
        loading={loading}
        canSeed={canSeed}
        onSeed={handleSeedCriteria}
        seedLoading={seedLoading}
        canManage={canManage}
        onCreate={openCreateModal}
      />

      {/* 3. Tabla de criterios */}
      <RubricCriteriaTable
        criteria={filteredCriteria}
        loading={loading}
        canManage={canManage}
        canDelete={canDelete}
        onEdit={openEditModal}
        onToggleActive={handleToggleActive}
        onDelete={openDeleteModal}
        onSeed={handleSeedCriteria}
        seedLoading={seedLoading}
      />

      {/* 4. Modales de Gestión */}
      {/* Modal Crear */}
      <CriterionCreateModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSave={handleCreateCriterion}
        loading={actionLoading}
      />

      {/* Modal Editar */}
      <CriterionEditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        criterion={selectedCriterion}
        onSave={handleUpdateCriterion}
        loading={actionLoading}
      />

      {/* Modal Desactivar */}
      <CriterionDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        criterion={selectedCriterion}
        onConfirm={handleDeleteCriterion}
        loading={actionLoading}
      />
    </div>
  )
}

export default RubricPage
