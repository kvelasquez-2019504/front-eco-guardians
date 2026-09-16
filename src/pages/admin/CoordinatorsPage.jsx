import { School, UserCheck, Layers } from 'lucide-react'
import { useCoordinatorsAdmin } from '@/shared/hooks/useCoordinatorsAdmin.js'
import { H1 } from '@/components/atoms/Heading.jsx'
import { CoordinatorFilterBar } from '@/components/molecules/CoordinatorFilterBar.jsx'
import { CoordinatorAssignmentsTable } from '@/components/organisms/coordinator/CoordinatorAssignmentsTable.jsx'
import { AssignLevelsModal } from '@/components/organisms/coordinator/AssignLevelsModal.jsx'
import { UnassignLevelModal } from '@/components/organisms/coordinator/UnassignLevelModal.jsx'

/**
 * Página: CoordinatorsPage
 * Gestión de Coordinaciones y Asignación de Niveles Educativos en Eco-Guardianes.
 * Ruta: /admin/coordinators
 */
export const CoordinatorsPage = () => {
  const {
    assignments,
    rawAssignments,
    coordinatorsList,
    levelsList,
    loading,
    actionLoading,
    isAdmin,

    searchQuery,
    setSearchQuery,
    fetchAssignments,

    selectedAssignment,
    isAssignModalOpen,
    isUnassignModalOpen,
    openAssignModal,
    closeAssignModal,
    openUnassignModal,
    closeUnassignModal,

    handleAssignLevels,
    handleUnassignLevel,
  } = useCoordinatorsAdmin()

  // Conteo de métricas en tiempo real
  const totalAssignments = rawAssignments.length

  // Coordinadores únicos con al menos un nivel asignado
  const uniqueCoordinatorsCount = new Set(
    rawAssignments
      .map((a) => a.coordinator?.uid || a.coordinator?._id)
      .filter(Boolean)
  ).size

  // Grados únicos que tienen al menos un coordinador asignado
  const uniqueLevelsCount = new Set(
    rawAssignments
      .map((a) => a.level?.uid || a.level?._id)
      .filter(Boolean)
  ).size

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Encabezado principal y métricas (sin botones duplicados) */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-green/15 text-eco-green text-xs font-bold mb-3 border border-eco-green/30">
              <School size={14} /> Administración Académica
            </div>
            <H1 variant="gradient">Coordinaciones</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Vinculación de grados y ciclos educativos a coordinadores para la supervisión de turnos ecológicos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            {/* Tarjetas métricas */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              {/* Total Asignaciones */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-4 py-3 text-center min-w-[85px]">
                <span className="text-[11px] font-body text-eco-muted block">Asignaciones</span>
                <span className="font-heading font-black text-xl text-eco-text">
                  {totalAssignments}
                </span>
              </div>

              {/* Coordinadores Activos con Nivel */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-4 py-3 text-center min-w-[85px]">
                <span className="text-[11px] font-body text-emerald-400 block flex items-center justify-center gap-1">
                  <UserCheck size={12} /> Coordinadores
                </span>
                <span className="font-heading font-black text-xl text-emerald-400">
                  {uniqueCoordinatorsCount}
                </span>
              </div>

              {/* Grados Supervisados */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-4 py-3 text-center min-w-[85px]">
                <span className="text-[11px] font-body text-eco-cyan block flex items-center justify-center gap-1">
                  <Layers size={12} /> Grados
                </span>
                <span className="font-heading font-black text-xl text-eco-cyan">
                  {uniqueLevelsCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Barra de Filtros y Acciones (botón de asignación reside exclusivamente aquí) */}
      <CoordinatorFilterBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onRefresh={fetchAssignments}
        loading={loading}
        isAdmin={isAdmin}
        onAssign={openAssignModal}
      />

      {/* 3. Tabla Principal de Asignaciones */}
      <CoordinatorAssignmentsTable
        assignments={assignments}
        loading={loading}
        isAdmin={isAdmin}
        onUnassign={openUnassignModal}
        onOpenAssign={openAssignModal}
      />

      {/* 4. Modales para ADMIN */}
      {isAdmin && (
        <>
          {isAssignModalOpen && (
            <AssignLevelsModal
              isOpen={isAssignModalOpen}
              onClose={closeAssignModal}
              coordinatorsList={coordinatorsList}
              levelsList={levelsList}
              onSave={handleAssignLevels}
              loading={actionLoading}
            />
          )}

          <UnassignLevelModal
            isOpen={isUnassignModalOpen}
            onClose={closeUnassignModal}
            assignment={selectedAssignment}
            onConfirm={handleUnassignLevel}
            loading={actionLoading}
          />
        </>
      )}
    </div>
  )
}

export default CoordinatorsPage
