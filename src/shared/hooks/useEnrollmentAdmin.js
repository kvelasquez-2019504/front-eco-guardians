import { useState, useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import {
  getClassStudents as getClassStudentsRequest,
  enrollStudents as enrollStudentsRequest,
  unenrollStudent as unenrollStudentRequest,
} from '@/service/enrollment.api.js'
import { getClasses as getClassesRequest } from '@/service/class.api.js'
import { getUsers as getUsersRequest } from '@/service/user.api.js'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Custom Hook: useEnrollmentAdmin
 * Administra el ciclo de vida de la matrícula de alumnos en clases y secciones:
 * Carga de clases activas, inspección de alumnos matriculados, catálogo de estudiantes,
 * filtros por jornada y búsqueda, cálculo de métricas de aula y Eco-Aura, e inscripción/desinscripción.
 */
export const useEnrollmentAdmin = () => {
  const currentAuthUser = useAuthStore((state) => state.user)
  const isAdmin = currentAuthUser?.role === 'ADMIN'
  const isCoordinator = currentAuthUser?.role === 'COORDINATOR'
  const canManage = isAdmin || isCoordinator

  // Estados de datos
  const [classesList, setClassesList] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [students, setStudents] = useState([])
  const [allStudentsCatalog, setAllStudentsCatalog] = useState([])

  // Estados de carga
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Filtros en cliente
  const [searchQuery, setSearchQuery] = useState('')
  const [shiftFilter, setShiftFilter] = useState('')

  // Estados modales
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
  const [isUnenrollModalOpen, setIsUnenrollModalOpen] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState(null)

  // Objeto de la clase seleccionada actualmente
  const selectedClass = useMemo(() => {
    return classesList.find((c) => c.uid === selectedClassId) || null
  }, [classesList, selectedClassId])

  /**
   * Consulta los alumnos matriculados en una clase específica (GET /enrollment/class/:id/students)
   */
  const fetchClassStudents = useCallback(async (classId) => {
    if (!classId) {
      setStudents([])
      return
    }

    setLoadingStudents(true)
    const response = await getClassStudentsRequest(classId)

    if (response.error) {
      setLoadingStudents(false)
      const serverData = response.e?.response?.data
      const errorMsg =
        serverData?.msg ||
        serverData?.message ||
        'Error al cargar los alumnos matriculados en la clase.'
      toast.error(errorMsg)
      setStudents([])
      return { success: false }
    }

    const loaded = Array.isArray(response.data)
      ? response.data
      : response.data?.students || response.data?.data || []

    setStudents(loaded)
    setLoadingStudents(false)
    return { success: true, data: loaded }
  }, [])

  /**
   * Carga el catálogo de clases activas y los usuarios con rol STUDENT
   */
  const loadDependencies = useCallback(async () => {
    setLoadingClasses(true)

    const [classesRes, studentsRes] = await Promise.all([
      getClassesRequest(),
      getUsersRequest({ role: 'STUDENT', limit: 200 }),
    ])

    // Procesar clases
    let activeClasses = []
    if (!classesRes.error) {
      const clsList = Array.isArray(classesRes.data)
        ? classesRes.data
        : classesRes.data?.classes || classesRes.data?.data || []
      activeClasses = clsList.filter((c) => c.status !== false)
      setClassesList(activeClasses)

      // Auto-seleccionar primera clase si no hay selección
      setSelectedClassId((prev) => {
        if (!prev && activeClasses.length > 0) {
          return activeClasses[0].uid
        }
        return prev
      })
    } else {
      toast.error('Error al cargar catálogo de clases.')
    }

    // Procesar estudiantes
    if (!studentsRes.error) {
      const users = studentsRes.data?.users || []
      setAllStudentsCatalog(users.filter((u) => u.status !== false))
    }

    setLoadingClasses(false)
    return activeClasses
  }, [])

  // Carga inicial al montar el componente
  useEffect(() => {
    let ignore = false

    const init = async () => {
      await Promise.resolve()
      if (ignore) return
      const classes = await loadDependencies()
      if (!ignore && classes && classes.length > 0) {
        fetchClassStudents(classes[0].uid)
      }
    }

    init()

    return () => {
      ignore = true
    }
  }, [loadDependencies, fetchClassStudents])

  /**
   * Efecto cuando cambia la clase seleccionada por el usuario
   */
  const handleSelectClass = (newClassId) => {
    setSelectedClassId(newClassId)
    setSearchQuery('')
    setShiftFilter('')
    if (newClassId) {
      fetchClassStudents(newClassId)
    } else {
      setStudents([])
    }
  }

  /**
   * Control de modales
   */
  const openEnrollModal = () => {
    setIsEnrollModalOpen(true)
  }

  const closeEnrollModal = () => {
    setIsEnrollModalOpen(false)
  }

  const openUnenrollModal = (enrollment) => {
    setSelectedEnrollment(enrollment)
    setIsUnenrollModalOpen(true)
  }

  const closeUnenrollModal = () => {
    setSelectedEnrollment(null)
    setIsUnenrollModalOpen(false)
  }

  /**
   * Inscribir uno o múltiples alumnos (POST /enrollment)
   */
  const handleEnrollStudents = async ({ classGroupId, shift, studentIds, academicYear }) => {
    setActionLoading(true)

    const payload = {
      classGroupId,
      shift,
      academicYear: academicYear ? Number(academicYear) : 2026,
    }

    if (Array.isArray(studentIds) && studentIds.length > 1) {
      payload.studentIds = studentIds
    } else if (Array.isArray(studentIds) && studentIds.length === 1) {
      payload.studentId = studentIds[0]
    } else if (typeof studentIds === 'string') {
      payload.studentId = studentIds
    }

    const response = await enrollStudentsRequest(payload)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data

      if (serverData?.errors && Array.isArray(serverData.errors)) {
        toast.error(serverData.errors[0]?.msg || 'Error de validación al inscribir alumnos.')
        return { success: false, errors: serverData.errors }
      }

      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al realizar la inscripción de alumnos.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    const count = Array.isArray(studentIds) ? studentIds.length : 1
    toast.success(`¡${count} alumno(s) matriculado(s) exitosamente en la jornada ${shift}!`)
    closeEnrollModal()
    fetchClassStudents(classGroupId)
    return { success: true, data: response.data }
  }

  /**
   * Desinscribir a un alumno (DELETE /enrollment/:id)
   */
  const handleUnenrollStudent = async (enrollmentId) => {
    setActionLoading(true)

    const response = await unenrollStudentRequest(enrollmentId)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data
      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al desinscribir al alumno.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('¡Alumno desinscrito de la clase exitosamente!')
    closeUnenrollModal()
    if (selectedClassId) {
      fetchClassStudents(selectedClassId)
    }
    return { success: true, data: response.data }
  }

  /**
   * Alumnos filtrados en la clase
   */
  const filteredStudents = useMemo(() => {
    return students.filter((item) => {
      // Filtro por jornada
      if (shiftFilter && item.shift !== shiftFilter) {
        return false
      }

      // Filtro de búsqueda por texto
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase().trim()

      const s = item.student || {}
      const fullName = `${s.name || ''} ${s.lastName || ''}`.toLowerCase()
      const email = (s.email || '').toLowerCase()
      const code = (s.code || '').toLowerCase()

      return fullName.includes(q) || email.includes(q) || code.includes(q)
    })
  }, [students, shiftFilter, searchQuery])

  /**
   * Métricas de la clase seleccionada
   */
  const metrics = useMemo(() => {
    const total = students.length
    const matutina = students.filter((s) => s.shift === 'MATUTINA').length
    const vespertina = students.filter((s) => s.shift === 'VESPERTINA').length

    let totalPoints = 0
    let studentsWithAura = 0

    students.forEach((s) => {
      if (s.student?.ecoAura?.points !== undefined) {
        totalPoints += Number(s.student.ecoAura.points) || 0
        studentsWithAura += 1
      }
    })

    const avgAura = studentsWithAura > 0 ? Math.round(totalPoints / studentsWithAura) : 0

    return { total, matutina, vespertina, avgAura }
  }, [students])

  // UIDs de alumnos ya inscritos en la clase seleccionada (para bloquear o advertir en el modal)
  const enrolledStudentUids = useMemo(() => {
    return new Set(students.map((item) => item.student?.uid).filter(Boolean))
  }, [students])

  return {
    classesList,
    selectedClassId,
    selectedClass,
    handleSelectClass,
    students,
    filteredStudents,
    allStudentsCatalog,
    enrolledStudentUids,
    metrics,
    loadingClasses,
    loadingStudents,
    actionLoading,
    canManage,
    isAdmin,
    isCoordinator,
    searchQuery,
    setSearchQuery,
    shiftFilter,
    setShiftFilter,
    fetchClassStudents: () => fetchClassStudents(selectedClassId),
    // Modales
    isEnrollModalOpen,
    openEnrollModal,
    closeEnrollModal,
    isUnenrollModalOpen,
    openUnenrollModal,
    closeUnenrollModal,
    selectedEnrollment,
    // Operaciones
    handleEnrollStudents,
    handleUnenrollStudent,
  }
}

export default useEnrollmentAdmin
