import { School, FolderKanban, Compass, Wrench, GraduationCap } from 'lucide-react'
import { useClassesAdmin } from '@/shared/hooks/useClassesAdmin.js'
import { H1 } from '@/components/atoms/Heading.jsx'
import { ClassFilterBar } from '@/components/molecules/ClassFilterBar.jsx'
import { ClassesTable } from '@/components/organisms/class/ClassesTable.jsx'
import { ClassCreateModal } from '@/components/organisms/class/ClassCreateModal.jsx'
import { ClassEditModal } from '@/components/organisms/class/ClassEditModal.jsx'
import { ClassTeacherModal } from '@/components/organisms/class/ClassTeacherModal.jsx'
import { ClassDeleteModal } from '@/components/organisms/class/ClassDeleteModal.jsx'

/**
 * Página: ClassesPage
 * Gestión de Clases, Grupos y Secciones de Fundación Kinal en Eco-Guardianes.
 * Ruta: /admin/classes
 */
export const ClassesPage = () => {
  const {
    filteredClasses,
    metrics,
    levelsList,
    careersList,
    teachersList,
    loading,
    actionLoading,
    canManage,

    searchQuery,
    setSearchQuery,
    selectedLevelFilter,
    setSelectedLevelFilter,
    selectedTypeFilter,
    setSelectedTypeFilter,
    fetchClasses,

    selectedClass,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    isTeacherModalOpen,
    openTeacherModal,
    closeTeacherModal,
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,

    handleCreateClass,
    handleUpdateClass,
    handleAssignTeacher,
    handleDeleteClass,
  } = useClassesAdmin()

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Encabezado principal y métricas (sin botones de acción duplicados) */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-green/15 text-eco-green text-xs font-bold mb-3 border border-eco-green/30">
              <School size={14} /> Administración Académica
            </div>
            <H1 variant="gradient">Clases y Secciones</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Organización de grupos escolares de Ciclo Básico y Diversificado, asignación de docentes titulares y supervisión de secciones.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            {/* Tarjetas métricas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              {/* Total Clases */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[80px]">
                <span className="text-[11px] font-body text-eco-muted flex items-center justify-center gap-1">
                  <FolderKanban size={12} /> Total Clases
                </span>
                <span className="font-heading font-black text-xl text-eco-text block mt-0.5">
                  {metrics.total}
                </span>
              </div>

              {/* Clases Guía (Básicos) */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[80px]">
                <span className="text-[11px] font-body text-eco-cyan flex items-center justify-center gap-1">
                  <Compass size={12} /> Clases Guía
                </span>
                <span className="font-heading font-black text-xl text-eco-cyan block mt-0.5">
                  {metrics.guias}
                </span>
              </div>

              {/* Talleres Técnicos (Diversificado) */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[80px]">
                <span className="text-[11px] font-body text-amber-300 flex items-center justify-center gap-1">
                  <Wrench size={12} /> Talleres
                </span>
                <span className="font-heading font-black text-xl text-amber-300 block mt-0.5">
                  {metrics.talleres}
                </span>
              </div>

              {/* Con Docente Titular */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[80px]">
                <span className="text-[11px] font-body text-emerald-400 flex items-center justify-center gap-1">
                  <GraduationCap size={12} /> Con Docente
                </span>
                <span className="font-heading font-black text-xl text-emerald-400 block mt-0.5">
                  {metrics.withTeacher}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Barra de filtros interactiva con el botón '+ Nueva Clase' (única ubicación) */}
      <ClassFilterBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedLevelFilter={selectedLevelFilter}
        onLevelFilterChange={setSelectedLevelFilter}
        selectedTypeFilter={selectedTypeFilter}
        onTypeFilterChange={setSelectedTypeFilter}
        levelsList={levelsList}
        onRefresh={fetchClasses}
        loading={loading}
        canManage={canManage}
        onCreate={openCreateModal}
      />

      {/* 3. Tabla principal */}
      <ClassesTable
        classes={filteredClasses}
        loading={loading}
        canManage={canManage}
        onEdit={openEditModal}
        onAssignTeacher={openTeacherModal}
        onDelete={openDeleteModal}
        onCreate={openCreateModal}
      />

      {/* 4. Modales de Gestión */}
      {/* Modal de Creación */}
      <ClassCreateModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSave={handleCreateClass}
        loading={actionLoading}
        levelsList={levelsList}
        careersList={careersList}
        teachersList={teachersList}
      />

      {/* Modal de Edición General */}
      <ClassEditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        classGroup={selectedClass}
        onSave={handleUpdateClass}
        loading={actionLoading}
        careersList={careersList}
        teachersList={teachersList}
      />

      {/* Modal de Asignación Rápida de Docente */}
      <ClassTeacherModal
        isOpen={isTeacherModalOpen}
        onClose={closeTeacherModal}
        classGroup={selectedClass}
        onSave={handleAssignTeacher}
        loading={actionLoading}
        teachersList={teachersList}
      />

      {/* Modal de Desactivación (Soft Delete) */}
      <ClassDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        classGroup={selectedClass}
        onConfirm={handleDeleteClass}
        loading={actionLoading}
      />
    </div>
  )
}

export default ClassesPage
