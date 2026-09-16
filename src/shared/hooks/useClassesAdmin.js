import { useState, useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import {
  getClasses as getClassesRequest,
  createClass as createClassRequest,
  updateClass as updateClassRequest,
  assignClassTeacher as assignTeacherRequest,
  deleteClass as deleteClassRequest,
} from '@/service/class.api.js'
import { getLevels as getLevelsRequest } from '@/service/level.api.js'
import { getMyAssignedLevels as getMyAssignedLevelsRequest } from '@/service/coordinator.api.js'
import { getCareers as getCareersRequest } from '@/service/career.api.js'
import { getUsers as getUsersRequest } from '@/service/user.api.js'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Custom Hook: useClassesAdmin
 * Administra el ciclo de vida del módulo de Clases y Secciones (Class):
 * Consulta general, filtrado reactivo, dependencias (niveles, carreras, profesores),
 * creación bajo reglas escolares, edición, asignación de docente y soft delete.
 */
export const useClassesAdmin = () => {
  const currentAuthUser = useAuthStore((state) => state.user)
  const isAdmin = currentAuthUser?.role === 'ADMIN'
  const isCoordinator = currentAuthUser?.role === 'COORDINATOR'
  const canManage = isAdmin || isCoordinator

  // Estados de datos
  const [classes, setClasses] = useState([])
  const [levelsList, setLevelsList] = useState([])
  const [careersList, setCareersList] = useState([])
  const [teachersList, setTeachersList] = useState([])

  // Estados de carga
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Filtros reactivos en cliente
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('')
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('')

  // Estados de modales
  const [selectedClass, setSelectedClass] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  /**
   * Consulta el catálogo de clases desde el backend (GET /class)
   */
  const fetchClasses = useCallback(async () => {
    setLoading(true)
    const response = await getClassesRequest()

    if (response.error) {
      setLoading(false)
      const serverData = response.e?.response?.data
      const errorMsg =
        serverData?.msg ||
        serverData?.message ||
        'Error al cargar el listado de clases y secciones.'
      toast.error(errorMsg)
      return { success: false }
    }

    const loadedClasses = Array.isArray(response.data)
      ? response.data
      : response.data?.classes || response.data?.data || []

    setClasses(loadedClasses)
    setLoading(false)
    return { success: true, data: loadedClasses }
  }, [])

  /**
   * Carga catálogos auxiliares (niveles, carreras y docentes activos)
   */
  const loadDependencies = useCallback(async () => {
    // 1. Niveles: si es COORDINATOR, intentar cargar sus niveles asignados primero
    let levels = []
    if (isCoordinator) {
      const myLevelsRes = await getMyAssignedLevelsRequest()
      if (!myLevelsRes.error) {
        levels = Array.isArray(myLevelsRes.data)
          ? myLevelsRes.data
          : myLevelsRes.data?.levels || myLevelsRes.data?.data || []
      }
    }
    
    // Si no es coordinador o no trajo niveles asignados, cargar catálogo general
    if (levels.length === 0) {
      const levelsRes = await getLevelsRequest()
      if (!levelsRes.error) {
        levels = Array.isArray(levelsRes.data)
          ? levelsRes.data
          : levelsRes.data?.levels || []
      }
    }
    setLevelsList(levels.filter((lvl) => lvl.status !== false))

    // 2. Carreras técnicas activas
    const careersRes = await getCareersRequest()
    if (!careersRes.error) {
      const careers = Array.isArray(careersRes.data)
        ? careersRes.data
        : careersRes.data?.careers || []
      setCareersList(careers.filter((c) => c.status !== false))
    }

    // 3. Profesores activos
    const teachersRes = await getUsersRequest({ role: 'TEACHER', limit: 100 })
    if (!teachersRes.error) {
      const users = teachersRes.data?.users || []
      setTeachersList(users.filter((u) => u.status !== false))
    }
  }, [isCoordinator])

  // Carga inicial coordinada
  useEffect(() => {
    let ignore = false

    const loadInitialData = async () => {
      await Promise.resolve()
      if (ignore) return
      setLoading(true)

      await Promise.all([fetchClasses(), loadDependencies()])
      if (!ignore) {
        setLoading(false)
      }
    }

    loadInitialData()

    return () => {
      ignore = true
    }
  }, [fetchClasses, loadDependencies])

  /**
   * Control de modales
   */
  const openCreateModal = () => {
    loadDependencies()
    setIsCreateModalOpen(true)
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const openEditModal = (classGroup) => {
    loadDependencies()
    setSelectedClass(classGroup)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setSelectedClass(null)
    setIsEditModalOpen(false)
  }

  const openTeacherModal = (classGroup) => {
    loadDependencies()
    setSelectedClass(classGroup)
    setIsTeacherModalOpen(true)
  }

  const closeTeacherModal = () => {
    setSelectedClass(null)
    setIsTeacherModalOpen(false)
  }

  const openDeleteModal = (classGroup) => {
    setSelectedClass(classGroup)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setSelectedClass(null)
    setIsDeleteModalOpen(false)
  }

  /**
   * Crear nueva clase (POST /class)
   */
  const handleCreateClass = async (formData) => {
    setActionLoading(true)

    // Formatear payload según reglas escolares
    const payload = {
      levelId: formData.levelId,
      section: formData.section?.trim().toUpperCase(),
      academicYear: formData.academicYear ? Number(formData.academicYear) : 2026,
    }

    if (formData.careerId) {
      payload.careerId = formData.careerId
    }

    if (formData.teacherId) {
      payload.teacherId = formData.teacherId
    }

    const response = await createClassRequest(payload)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data

      if (serverData?.errors && Array.isArray(serverData.errors)) {
        toast.error(serverData.errors[0]?.msg || 'Error de validación al crear la clase.')
        return { success: false, errors: serverData.errors }
      }

      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al crear la clase o grupo académico.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('¡Clase creada exitosamente con sus secciones y reglas!')
    closeCreateModal()
    fetchClasses()
    return { success: true, data: response.data }
  }

  /**
   * Actualizar clase existente (PUT /class/:id)
   */
  const handleUpdateClass = async (id, formData) => {
    setActionLoading(true)

    const payload = {
      section: formData.section?.trim().toUpperCase(),
      academicYear: formData.academicYear ? Number(formData.academicYear) : 2026,
    }

    if (formData.careerId !== undefined) {
      payload.careerId = formData.careerId || null
    }

    if (formData.teacherId !== undefined) {
      payload.teacherId = formData.teacherId || null
    }

    const response = await updateClassRequest(id, payload)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data

      if (serverData?.errors && Array.isArray(serverData.errors)) {
        toast.error(serverData.errors[0]?.msg || 'Error de validación al actualizar la clase.')
        return { success: false, errors: serverData.errors }
      }

      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al actualizar los datos de la clase.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('¡Datos de la clase actualizados exitosamente!')
    closeEditModal()
    fetchClasses()
    return { success: true, data: response.data }
  }

  /**
   * Asignar o cambiar profesor de la clase (PUT /class/:id/teacher)
   */
  const handleAssignTeacher = async (id, teacherId) => {
    setActionLoading(true)

    const response = await assignTeacherRequest(id, teacherId)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data

      if (serverData?.errors && Array.isArray(serverData.errors)) {
        toast.error(serverData.errors[0]?.msg || 'Error al asignar el docente a la clase.')
        return { success: false, errors: serverData.errors }
      }

      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al asignar el docente a la clase.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('¡Docente asignado a la clase exitosamente!')
    closeTeacherModal()
    fetchClasses()
    return { success: true, data: response.data }
  }

  /**
   * Desactivación lógica de la clase (DELETE /class/:id)
   */
  const handleDeleteClass = async (id) => {
    setActionLoading(true)

    const response = await deleteClassRequest(id)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data
      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al desactivar la clase.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('¡Clase desactivada exitosamente!')
    closeDeleteModal()
    fetchClasses()
    return { success: true, data: response.data }
  }

  /**
   * Lista filtrada de clases
   */
  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      // Filtro por nivel
      if (selectedLevelFilter && cls.level?.uid !== selectedLevelFilter) {
        return false
      }

      // Filtro por tipo (GUIA vs TALLER)
      if (selectedTypeFilter && cls.type !== selectedTypeFilter) {
        return false
      }

      // Filtro de búsqueda en texto
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase().trim()

      const nameMatch = cls.name?.toLowerCase().includes(q)
      const sectionMatch = cls.section?.toLowerCase().includes(q)
      const levelMatch = cls.level?.name?.toLowerCase().includes(q)
      const careerMatch = cls.career?.name?.toLowerCase().includes(q)
      const teacherNameMatch = `${cls.teacher?.name || ''} ${cls.teacher?.lastName || ''}`
        .toLowerCase()
        .includes(q)
      const teacherEmailMatch = cls.teacher?.email?.toLowerCase().includes(q)

      return (
        nameMatch ||
        sectionMatch ||
        levelMatch ||
        careerMatch ||
        teacherNameMatch ||
        teacherEmailMatch
      )
    })
  }, [classes, selectedLevelFilter, selectedTypeFilter, searchQuery])

  // Estadísticas para tarjetas de cabecera
  const metrics = useMemo(() => {
    const total = classes.length
    const guias = classes.filter((c) => c.type === 'GUIA' && c.status !== false).length
    const talleres = classes.filter((c) => c.type === 'TALLER' && c.status !== false).length
    const withTeacher = classes.filter((c) => c.teacher && c.status !== false).length

    return { total, guias, talleres, withTeacher }
  }, [classes])

  return {
    classes,
    filteredClasses,
    metrics,
    levelsList,
    careersList,
    teachersList,
    loading,
    actionLoading,
    canManage,
    isAdmin,
    isCoordinator,
    searchQuery,
    setSearchQuery,
    selectedLevelFilter,
    setSelectedLevelFilter,
    selectedTypeFilter,
    setSelectedTypeFilter,
    fetchClasses,
    // Modales
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
    // Operaciones
    handleCreateClass,
    handleUpdateClass,
    handleAssignTeacher,
    handleDeleteClass,
  }
}

export default useClassesAdmin
