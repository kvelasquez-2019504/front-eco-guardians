import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  GraduationCap,
  Users,
  Search,
  BookOpen,
  Compass,
  Wrench,
  Sun,
  Moon,
  RefreshCw,
  X,
  UserCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { H1, H3 } from '@/components/atoms/Heading.jsx'
import { Button } from '@/components/atoms/Button.jsx'
import { UserAvatar } from '@/components/atoms/UserAvatar.jsx'
import { getMyClasses } from '@/service/class.api.js'
import { getClassStudents } from '@/service/enrollment.api.js'

/**
 * Página: TeacherClassesPage
 * Vista exclusiva para docentes (y supervisores):
 * Consulta sus clases asignadas (GET /class/my-classes) y la nómina de estudiantes inscritos (GET /enrollment/class/:id/students).
 * No contiene controles administrativos de creación, edición ni eliminación de clases.
 * Ruta: /teacher/classes
 */
export const TeacherClassesPage = () => {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Estado del modal de alumnos
  const [selectedClass, setSelectedClass] = useState(null)
  const [students, setStudents] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [studentSearchQuery, setStudentSearchQuery] = useState('')

  // Cargar clases asignadas al docente
  const fetchMyClasses = useCallback(async () => {
    setLoading(true)
    const response = await getMyClasses()

    if (response.error) {
      setLoading(false)
      const msg =
        response.e?.response?.data?.message ||
        response.e?.response?.data?.msg ||
        'Error al consultar las clases asignadas.'
      toast.error(msg)
      setClasses([])
      return
    }

    const loaded = Array.isArray(response.data)
      ? response.data
      : response.data?.classes || response.data?.data || []

    setClasses(loaded)
    setLoading(false)
  }, [])

  useEffect(() => {
    let ignore = false
    const load = async () => {
      await Promise.resolve()
      if (!ignore) {
        fetchMyClasses()
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [fetchMyClasses])

  // Abrir modal de nómina de alumnos
  const handleViewStudents = async (classGroup) => {
    setSelectedClass(classGroup)
    setStudentSearchQuery('')
    setLoadingStudents(true)

    const classId = classGroup.uid || classGroup._id
    const res = await getClassStudents(classId)

    if (res.error) {
      setLoadingStudents(false)
      const msg =
        res.e?.response?.data?.message ||
        res.e?.response?.data?.msg ||
        'Error al cargar los alumnos matriculados en esta clase.'
      toast.error(msg)
      setStudents([])
      return
    }

    const studentsList = Array.isArray(res.data)
      ? res.data
      : res.data?.students || res.data?.data || []

    setStudents(studentsList)
    setLoadingStudents(false)
  }

  const handleCloseStudentsModal = () => {
    setSelectedClass(null)
    setStudents([])
    setStudentSearchQuery('')
  }

  // Filtrado reactivo de clases
  const filteredClasses = useMemo(() => {
    if (!searchQuery.trim()) return classes
    const q = searchQuery.toLowerCase().trim()

    return classes.filter((cls) => {
      const nameMatch = cls.name?.toLowerCase().includes(q)
      const sectionMatch = cls.section?.toLowerCase().includes(q)
      const levelMatch = cls.level?.name?.toLowerCase().includes(q)
      const careerMatch = cls.career?.name?.toLowerCase().includes(q)
      return nameMatch || sectionMatch || levelMatch || careerMatch
    })
  }, [classes, searchQuery])

  // Filtrado de alumnos en el modal
  const filteredStudents = useMemo(() => {
    if (!studentSearchQuery.trim()) return students
    const q = studentSearchQuery.toLowerCase().trim()

    return students.filter((item) => {
      const studentObj = item.student || item
      const fullName = `${studentObj.name || ''} ${studentObj.lastName || ''}`.toLowerCase()
      const email = studentObj.email?.toLowerCase() || ''
      const code = studentObj.code?.toLowerCase() || ''
      return fullName.includes(q) || email.includes(q) || code.includes(q)
    })
  }, [students, studentSearchQuery])

  // Métricas para la cabecera
  const metrics = useMemo(() => {
    const total = classes.length
    const guias = classes.filter((c) => c.type === 'GUIA').length
    const talleres = classes.filter((c) => c.type === 'TALLER').length
    return { total, guias, talleres }
  }, [classes])

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Encabezado principal y métricas */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-green/15 text-eco-green text-xs font-bold mb-3 border border-eco-green/30">
              <GraduationCap size={14} /> Panel Docente
            </div>
            <H1 variant="gradient">Mis Clases Asignadas</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Supervisión de grupos escolares a tu cargo, detalle de secciones y consulta de estudiantes inscritos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            {/* Tarjetas métricas */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              {/* Total Clases */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[85px]">
                <span className="text-[11px] font-body text-eco-muted flex items-center justify-center gap-1">
                  <BookOpen size={12} /> Total Clases
                </span>
                <span className="font-heading font-black text-xl text-eco-text block mt-0.5">
                  {metrics.total}
                </span>
              </div>

              {/* Clases Guía (Básicos) */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[85px]">
                <span className="text-[11px] font-body text-eco-cyan flex items-center justify-center gap-1">
                  <Compass size={12} /> Guías
                </span>
                <span className="font-heading font-black text-xl text-eco-cyan block mt-0.5">
                  {metrics.guias}
                </span>
              </div>

              {/* Talleres Técnicos (Diversificado) */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[85px]">
                <span className="text-[11px] font-body text-amber-300 flex items-center justify-center gap-1">
                  <Wrench size={12} /> Talleres
                </span>
                <span className="font-heading font-black text-xl text-amber-300 block mt-0.5">
                  {metrics.talleres}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={fetchMyClasses}
              disabled={loading}
              className="text-xs gap-1.5 border-eco-border hover:border-eco-green text-eco-muted hover:text-eco-text self-end sm:self-center"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Barra de Búsqueda */}
      <div className="p-4 rounded-2xl bg-eco-card border border-eco-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-eco-muted"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por clase, sección, grado o carrera..."
            className="w-full bg-eco-bg border border-eco-border rounded-xl pl-9 pr-3.5 py-2 text-xs text-eco-text placeholder:text-eco-muted/60 focus:border-eco-green outline-hidden"
          />
        </div>

        <span className="text-xs text-eco-muted font-body">
          {filteredClasses.length} de {classes.length} clases asignadas
        </span>
      </div>

      {/* 3. Cuadrícula de Clases Asignadas */}
      {loading ? (
        <div className="p-16 text-center bg-eco-card border border-eco-border rounded-3xl shadow-xl">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-eco-green/20 border-t-eco-green rounded-full animate-spin" />
            <span className="text-sm font-body text-eco-muted">
              Cargando tus clases asignadas...
            </span>
          </div>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="p-16 text-center bg-eco-card border border-eco-border rounded-3xl shadow-xl space-y-3">
          <div className="w-12 h-12 mx-auto p-3 bg-eco-bg text-eco-muted rounded-2xl border border-eco-border flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <h3 className="font-heading font-bold text-base text-eco-text">
            No se encontraron clases asignadas
          </h3>
          <p className="text-xs text-eco-muted font-body max-w-sm mx-auto">
            No tienes materias asignadas actualmente o la búsqueda no arrojó resultados. Consulta con la coordinación académica si requieres asignaciones.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => {
            const isTaller = cls.type === 'TALLER'
            const classId = cls.uid || cls._id

            return (
              <div
                key={classId}
                className="bg-eco-card border border-eco-border rounded-2xl p-5 shadow-lg space-y-4 hover:border-eco-green/40 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Encabezado de la tarjeta */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold border ${
                          isTaller
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-eco-cyan/15 text-eco-cyan border-eco-cyan/30'
                        }`}
                      >
                        {isTaller ? <Wrench size={11} /> : <Compass size={11} />}
                        {isTaller ? 'Taller Técnico' : 'Clase Guía'}
                      </span>
                      <h4 className="font-heading font-bold text-base text-eco-text mt-1">
                        {cls.name}
                      </h4>
                    </div>

                    <span className="w-9 h-9 rounded-xl bg-eco-bg border border-eco-border flex items-center justify-center font-heading font-black text-sm text-eco-green">
                      {cls.section}
                    </span>
                  </div>

                  {/* Detalles académicos */}
                  <div className="space-y-1.5 text-xs text-eco-muted font-body pt-1 border-t border-eco-border/50">
                    <div className="flex items-center justify-between">
                      <span>Nivel Educativo:</span>
                      <strong className="text-eco-text font-semibold">
                        {cls.level?.name || 'Nivel asignado'}
                      </strong>
                    </div>

                    {cls.career && (
                      <div className="flex items-center justify-between">
                        <span>Especialidad:</span>
                        <strong className="text-eco-cyan font-semibold truncate max-w-[170px]">
                          {cls.career.name}
                        </strong>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span>Ciclo Lectivo:</span>
                      <span className="font-mono text-eco-text font-bold">
                        {cls.academicYear || 2026}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acción única: Consultar Estudiantes Inscritos */}
                <div className="pt-3 border-t border-eco-border/60">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className="w-full justify-center gap-2"
                    onClick={() => handleViewStudents(cls)}
                  >
                    <Users size={15} />
                    Ver Estudiantes Matriculados
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 4. Modal de Estudiantes Matriculados */}
      {selectedClass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="students-modal-title"
        >
          <div className="relative w-full max-w-2xl bg-eco-card border border-eco-border rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Cabecera del modal */}
            <div className="flex items-start justify-between gap-3 border-b border-eco-border pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-eco-green/15 text-eco-green border border-eco-green/30">
                  <Users size={22} />
                </div>
                <div>
                  <H3 id="students-modal-title" className="text-eco-text text-base sm:text-lg">
                    {selectedClass.name} - Sección {selectedClass.section}
                  </H3>
                  <p className="text-xs text-eco-muted font-body mt-0.5">
                    {selectedClass.level?.name}{' '}
                    {selectedClass.career ? `• ${selectedClass.career.name}` : ''}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseStudentsModal}
                aria-label="Cerrar modal"
                className="p-1.5 rounded-lg text-eco-muted hover:text-eco-text hover:bg-eco-card-hover transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Barra de búsqueda de alumnos dentro de la clase */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-eco-muted"
              />
              <input
                type="text"
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                placeholder="Buscar estudiante por nombre, carnet o correo..."
                className="w-full bg-eco-bg border border-eco-border rounded-xl pl-9 pr-3.5 py-2 text-xs text-eco-text placeholder:text-eco-muted/60 focus:border-eco-green outline-hidden"
              />
            </div>

            {/* Listado scrolleable de alumnos */}
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
              {loadingStudents ? (
                <div className="p-12 text-center text-eco-muted space-y-2">
                  <div className="w-6 h-6 border-2 border-eco-green/30 border-t-eco-green rounded-full animate-spin mx-auto" />
                  <span className="text-xs">Cargando nómina de estudiantes...</span>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-8 text-center bg-eco-bg/60 rounded-2xl border border-eco-border space-y-1">
                  <UserCheck size={24} className="mx-auto text-eco-muted/50" />
                  <span className="block text-xs font-bold text-eco-text">
                    No hay estudiantes inscritos
                  </span>
                  <p className="text-[11px] text-eco-muted font-body">
                    No se registran alumnos matriculados en esta clase o ningún alumno coincide con el filtro.
                  </p>
                </div>
              ) : (
                filteredStudents.map((enrollmentItem, idx) => {
                  const studentObj = enrollmentItem.student || enrollmentItem
                  const fullName = `${studentObj.name || ''} ${studentObj.lastName || ''}`.trim() || 'Estudiante'
                  const shift = enrollmentItem.shift || studentObj.shift || 'MATUTINA'
                  const isMatutina = shift === 'MATUTINA'

                  return (
                    <div
                      key={studentObj.uid || studentObj._id || idx}
                      className="p-3 bg-eco-bg/80 border border-eco-border rounded-xl flex items-center justify-between gap-3 hover:border-eco-border/80 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <UserAvatar name={fullName} size="sm" />
                        <div className="min-w-0">
                          <span className="block font-heading font-bold text-xs text-eco-text truncate">
                            {fullName}
                          </span>
                          <span className="block text-[11px] font-body text-eco-muted truncate">
                            {studentObj.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {studentObj.code && (
                          <span className="font-mono text-[11px] font-bold text-eco-green bg-eco-green/10 px-2 py-0.5 rounded-md border border-eco-green/20">
                            {studentObj.code}
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 text-[11px] font-heading font-semibold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                          {isMatutina ? <Sun size={11} /> : <Moon size={11} />}
                          {isMatutina ? 'Matutina' : 'Vespertina'}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Pie del modal */}
            <div className="pt-3 border-t border-eco-border flex items-center justify-between text-xs text-eco-muted font-body">
              <span>
                Total inscritos: <strong className="text-eco-text">{students.length}</strong> alumnos
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCloseStudentsModal}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherClassesPage
