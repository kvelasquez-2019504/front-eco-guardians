import { School, CheckCircle2, XCircle } from 'lucide-react'
import { useCareersAdmin } from '@/shared/hooks/useCareersAdmin.js'
import { H1 } from '@/components/atoms/Heading.jsx'
import { CareerFilterBar } from '@/components/molecules/CareerFilterBar.jsx'
import { CareersTable } from '@/components/organisms/CareersTable.jsx'
import { CareerCreateModal } from '@/components/organisms/CareerCreateModal.jsx'
import { CareerEditModal } from '@/components/organisms/CareerEditModal.jsx'
import { CareerDeleteModal } from '@/components/organisms/CareerDeleteModal.jsx'

/**
 * Página: CareersPage
 * Gestión de Carreras Técnicas (Especialidades de Diversificado) en Eco-Guardianes.
 * Ruta: /admin/careers
 */
export const CareersPage = () => {
  const {
    careers,
    rawCareers,
    loading,
    actionLoading,
    seedLoading,
    isAdmin,

    searchQuery,
    setSearchQuery,
    fetchCareers,

    selectedCareer,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,

    handleCreateCareer,
    handleUpdateCareer,
    handleDeleteCareer,
    handleSeedCareers,
  } = useCareersAdmin()

  // Conteo de métricas
  const totalCount = rawCareers.length
  const activeCount = rawCareers.filter((c) => c.status !== false).length
  const inactiveCount = rawCareers.filter((c) => c.status === false).length

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Encabezado principal y métricas (sin botones duplicados) */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-cyan/15 text-eco-cyan text-xs font-bold mb-3 border border-eco-cyan/30">
              <School size={14} /> Administración Académica
            </div>
            <H1 variant="gradient">Carreras Técnicas</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Catálogo de especialidades técnicas vocacionales de Ciclo Diversificado en Fundación Kinal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            {/* Tarjetas métricas */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              {/* Total */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-4 py-3 text-center min-w-[85px]">
                <span className="text-[11px] font-body text-eco-muted block">Total</span>
                <span className="font-heading font-black text-xl text-eco-text">
                  {totalCount}
                </span>
              </div>

              {/* Activas */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-4 py-3 text-center min-w-[85px]">
                <span className="text-[11px] font-body text-emerald-400 block flex items-center justify-center gap-1">
                  <CheckCircle2 size={12} /> Activas
                </span>
                <span className="font-heading font-black text-xl text-emerald-400">
                  {activeCount}
                </span>
              </div>

              {/* Inactivas */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-4 py-3 text-center min-w-[85px]">
                <span className="text-[11px] font-body text-rose-400 block flex items-center justify-center gap-1">
                  <XCircle size={12} /> Inactivas
                </span>
                <span className="font-heading font-black text-xl text-rose-400">
                  {inactiveCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Barra de Filtros y Acciones (botón de creación y seed residen exclusivamente aquí) */}
      <CareerFilterBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onRefresh={fetchCareers}
        loading={loading}
        isAdmin={isAdmin}
        onCreateCareer={isAdmin ? openCreateModal : undefined}
        onSeedCareers={isAdmin ? handleSeedCareers : undefined}
        seedLoading={seedLoading}
      />

      {/* 3. Tabla Principal de Carreras Técnicas */}
      <CareersTable
        careers={careers}
        loading={loading}
        isAdmin={isAdmin}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onSeed={isAdmin ? handleSeedCareers : undefined}
        seedLoading={seedLoading}
      />

      {/* 4. Modales para ADMIN */}
      {isAdmin && (
        <>
          {isCreateModalOpen && (
            <CareerCreateModal
              isOpen={isCreateModalOpen}
              onClose={closeCreateModal}
              onSave={handleCreateCareer}
              loading={actionLoading}
            />
          )}

          {isEditModalOpen && selectedCareer && (
            <CareerEditModal
              key={selectedCareer.uid}
              isOpen={isEditModalOpen}
              onClose={closeEditModal}
              career={selectedCareer}
              onSave={handleUpdateCareer}
              loading={actionLoading}
            />
          )}

          <CareerDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            career={selectedCareer}
            onConfirm={handleDeleteCareer}
            loading={actionLoading}
          />
        </>
      )}
    </div>
  )
}

export default CareersPage
