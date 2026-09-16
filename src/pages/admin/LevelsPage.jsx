import { School, BookOpen, GraduationCap } from 'lucide-react'
import { useLevelsAdmin } from '@/shared/hooks/useLevelsAdmin.js'
import { H1 } from '@/components/atoms/Heading.jsx'
import { LevelFilterBar } from '@/components/molecules/LevelFilterBar.jsx'
import { LevelsTable } from '@/components/organisms/LevelsTable.jsx'
import { LevelCreateModal } from '@/components/organisms/LevelCreateModal.jsx'
import { LevelEditModal } from '@/components/organisms/LevelEditModal.jsx'
import { LevelDeleteModal } from '@/components/organisms/LevelDeleteModal.jsx'

/**
 * Página: LevelsPage
 * Gestión integral de Niveles Educativos y Secciones en Eco-Guardianes.
 * Ruta: /admin/levels
 */
export const LevelsPage = () => {
  const {
    levels,
    rawLevels,
    loading,
    actionLoading,
    seedLoading,
    availableStages,
    isAdmin,

    searchQuery,
    setSearchQuery,
    stageFilter,
    setStageFilter,
    fetchLevels,

    selectedLevel,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,

    handleCreateLevel,
    handleUpdateLevel,
    handleDeleteLevel,
    handleSeedLevels,
  } = useLevelsAdmin()

  // Conteo de métricas
  const totalCount = rawLevels.length
  const basicoCount = rawLevels.filter((l) => l.stage === 'BASICO').length
  const diversificadoCount = rawLevels.filter((l) => l.stage === 'DIVERSIFICADO').length
  const activeCount = rawLevels.filter((l) => l.status !== false).length

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Encabezado principal y métricas */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-green/15 text-eco-green text-xs font-bold mb-3 border border-eco-green/30">
              <School size={14} /> Administración Académica
            </div>
            <H1 variant="gradient">Niveles y Secciones</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Catálogo oficial de grados y letras de secciones habilitadas para asignación y turnos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            {/* Tarjetas métricas rápidas */}
            <div className="grid grid-cols-4 gap-2.5 shrink-0">
              {/* Total */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3 py-2.5 text-center min-w-[70px]">
                <span className="text-[10px] font-body text-eco-muted block">Total</span>
                <span className="font-heading font-black text-lg text-eco-text">
                  {totalCount}
                </span>
              </div>

              {/* Básico */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3 py-2.5 text-center min-w-[70px]">
                <span className="text-[10px] font-body text-eco-cyan block flex items-center justify-center gap-0.5">
                  <BookOpen size={11} /> Básico
                </span>
                <span className="font-heading font-black text-lg text-eco-cyan">
                  {basicoCount}
                </span>
              </div>

              {/* Diversificado */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3 py-2.5 text-center min-w-[70px]">
                <span className="text-[10px] font-body text-purple-300 block flex items-center justify-center gap-0.5">
                  <GraduationCap size={11} /> Diver
                </span>
                <span className="font-heading font-black text-lg text-purple-300">
                  {diversificadoCount}
                </span>
              </div>

              {/* Activos */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3 py-2.5 text-center min-w-[70px]">
                <span className="text-[10px] font-body text-emerald-400 block">Activos</span>
                <span className="font-heading font-black text-lg text-emerald-400">
                  {activeCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Barra de Filtros y Búsqueda */}
      <LevelFilterBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        stageFilter={stageFilter}
        onStageFilterChange={setStageFilter}
        onRefresh={fetchLevels}
        loading={loading}
        isAdmin={isAdmin}
        onCreateLevel={isAdmin ? openCreateModal : undefined}
        onSeedLevels={isAdmin ? handleSeedLevels : undefined}
        seedLoading={seedLoading}
      />

      {/* 3. Tabla Principal de Niveles */}
      <LevelsTable
        levels={levels}
        loading={loading}
        isAdmin={isAdmin}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onSeed={isAdmin ? handleSeedLevels : undefined}
        seedLoading={seedLoading}
      />

      {/* 4. Modales para ADMIN */}
      {isAdmin && (
        <>
          {isCreateModalOpen && (
            <LevelCreateModal
              isOpen={isCreateModalOpen}
              onClose={closeCreateModal}
              onSave={handleCreateLevel}
              loading={actionLoading}
              availableStages={availableStages}
            />
          )}

          {isEditModalOpen && selectedLevel && (
            <LevelEditModal
              key={selectedLevel.uid}
              isOpen={isEditModalOpen}
              onClose={closeEditModal}
              level={selectedLevel}
              onSave={handleUpdateLevel}
              loading={actionLoading}
              availableStages={availableStages}
            />
          )}

          <LevelDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            level={selectedLevel}
            onConfirm={handleDeleteLevel}
            loading={actionLoading}
          />
        </>
      )}
    </div>
  )
}

export default LevelsPage
