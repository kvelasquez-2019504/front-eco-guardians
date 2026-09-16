import { School, Users, Sun, Moon, Sparkles } from 'lucide-react'
import { useEnrollmentAdmin } from '@/shared/hooks/useEnrollmentAdmin.js'
import { H1 } from '@/components/atoms/Heading.jsx'
import { EnrollmentFilterBar } from '@/components/molecules/EnrollmentFilterBar.jsx'
import { EnrolledStudentsTable } from '@/components/organisms/enrollment/EnrolledStudentsTable.jsx'
import { EnrollModal } from '@/components/organisms/enrollment/EnrollModal.jsx'
import { UnenrollModal } from '@/components/organisms/enrollment/UnenrollModal.jsx'

/**
 * Página: EnrollmentPage
 * Gestión de Matrícula de Alumnos y Asignación de Jornadas en Eco-Guardianes.
 * Ruta: /admin/enrollment
 */
export const EnrollmentPage = () => {
  const {
    classesList,
    selectedClassId,
    selectedClass,
    handleSelectClass,
    filteredStudents,
    allStudentsCatalog,
    enrolledStudentUids,
    metrics,
    loadingClasses,
    loadingStudents,
    actionLoading,
    canManage,

    searchQuery,
    setSearchQuery,
    shiftFilter,
    setShiftFilter,
    fetchClassStudents,

    isEnrollModalOpen,
    openEnrollModal,
    closeEnrollModal,
    isUnenrollModalOpen,
    openUnenrollModal,
    closeUnenrollModal,
    selectedEnrollment,

    handleEnrollStudents,
    handleUnenrollStudent,
  } = useEnrollmentAdmin()

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Encabezado principal y métricas (sin botones duplicados) */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-green/15 text-eco-green text-xs font-bold mb-3 border border-eco-green/30">
              <School size={14} /> Administración Académica
            </div>
            <H1 variant="gradient">Matrícula de Alumnos</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Inscripción de estudiantes a clases y secciones, asignación de jornadas (Matutina/Vespertina) y monitoreo de Eco-Aura.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            {/* Tarjetas métricas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              {/* Total Matriculados */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[80px]">
                <span className="text-[11px] font-body text-eco-muted flex items-center justify-center gap-1">
                  <Users size={12} /> Matriculados
                </span>
                <span className="font-heading font-black text-xl text-eco-text block mt-0.5">
                  {metrics.total}
                </span>
              </div>

              {/* Matutina */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[80px]">
                <span className="text-[11px] font-body text-amber-300 flex items-center justify-center gap-1">
                  <Sun size={12} /> Matutina
                </span>
                <span className="font-heading font-black text-xl text-amber-300 block mt-0.5">
                  {metrics.matutina}
                </span>
              </div>

              {/* Vespertina */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[80px]">
                <span className="text-[11px] font-body text-indigo-300 flex items-center justify-center gap-1">
                  <Moon size={12} /> Vespertina
                </span>
                <span className="font-heading font-black text-xl text-indigo-300 block mt-0.5">
                  {metrics.vespertina}
                </span>
              </div>

              {/* Promedio Eco-Aura */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[80px]">
                <span className="text-[11px] font-body text-eco-green flex items-center justify-center gap-1">
                  <Sparkles size={12} /> Prom. Aura
                </span>
                <span className="font-heading font-black text-xl text-eco-green block mt-0.5">
                  {metrics.avgAura} <span className="text-xs font-normal opacity-70">pts</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Barra de filtros interactiva con el botón '+ Matricular Alumnos' (única ubicación) */}
      <EnrollmentFilterBar
        classesList={classesList}
        selectedClassId={selectedClassId}
        onSelectClass={handleSelectClass}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        shiftFilter={shiftFilter}
        onShiftFilterChange={setShiftFilter}
        onRefresh={fetchClassStudents}
        loading={loadingClasses || loadingStudents}
        canManage={canManage}
        onEnroll={openEnrollModal}
      />

      {/* 3. Tabla de alumnos matriculados */}
      <EnrolledStudentsTable
        students={filteredStudents}
        loading={loadingStudents}
        canManage={canManage}
        onUnenroll={openUnenrollModal}
        onEnroll={openEnrollModal}
        selectedClass={selectedClass}
      />

      {/* 4. Modales de Gestión */}
      {/* Modal de Matrícula */}
      <EnrollModal
        isOpen={isEnrollModalOpen}
        onClose={closeEnrollModal}
        onSave={handleEnrollStudents}
        loading={actionLoading}
        selectedClass={selectedClass}
        studentsCatalog={allStudentsCatalog}
        enrolledStudentUids={enrolledStudentUids}
      />

      {/* Modal de Desinscripción */}
      <UnenrollModal
        isOpen={isUnenrollModalOpen}
        onClose={closeUnenrollModal}
        enrollment={selectedEnrollment}
        onConfirm={handleUnenrollStudent}
        loading={actionLoading}
        selectedClass={selectedClass}
      />
    </div>
  )
}

export default EnrollmentPage
