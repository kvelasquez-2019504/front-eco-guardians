import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import {
  getCoordinatorAssignments as getAssignmentsRequest,
  assignLevelsToCoordinator as assignRequest,
  unassignLevelFromCoordinator as unassignRequest,
} from '@/service/coordinator.api.js'
import { getUsers as getUsersRequest } from '@/service/user.api.js'
import { getLevels as getLevelsRequest } from '@/service/level.api.js'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Custom Hook: useCoordinatorsAdmin
 * Administra el ciclo de vida de las asignaciones de niveles a coordinadores:
 * Listado general, carga de coordinadores y niveles para asignación, asignación múltiple y desasignación.
 */
export const useCoordinatorsAdmin = () => {
  const currentAuthUser = useAuthStore((state) => state.user)
  const isAdmin = currentAuthUser?.role === 'ADMIN'

  // Estados de datos
  const [assignments, setAssignments] = useState([])
  const [coordinatorsList, setCoordinatorsList] = useState([])
  const [levelsList, setLevelsList] = useState([])

  // Estados de carga
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Búsqueda reactiva en cliente
  const [searchQuery, setSearchQuery] = useState('')

  // Estados modales
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false)

  /**
   * Consulta el listado general de asignaciones activas (GET /coordinator)
   */
  const fetchAssignments = useCallback(async () => {
    setLoading(true)
    const response = await getAssignmentsRequest()

    if (response.error) {
      setLoading(false)
      const serverData = response.e?.response?.data
      const errorMsg =
        serverData?.msg ||
        serverData?.message ||
        'Error al cargar las asignaciones de coordinadores.'
      toast.error(errorMsg)
      return { success: false }
    }

    const loadedAssignments = Array.isArray(response.data)
      ? response.data
      : response.data?.assignments || response.data?.data || []

    setAssignments(loadedAssignments)
    setLoading(false)
    return { success: true, data: loadedAssignments }
  }, [])

  /**
   * Carga la lista de usuarios con rol COORDINATOR y el catálogo de niveles para el modal
   */
  const loadModalDependencies = useCallback(async () => {
    // 1. Cargar coordinadores activos
    const usersRes = await getUsersRequest({ role: 'COORDINATOR', limit: 100 })
    if (!usersRes.error) {
      const users = usersRes.data?.users || []
      setCoordinatorsList(users.filter((u) => u.status !== false))
    }

    // 2. Cargar niveles activos
    const levelsRes = await getLevelsRequest()
    if (!levelsRes.error) {
      const levels = Array.isArray(levelsRes.data)
        ? levelsRes.data
        : levelsRes.data?.levels || []
      setLevelsList(levels.filter((l) => l.status !== false))
    }
  }, [])

  // Carga inicial desacoplada
  useEffect(() => {
    let ignore = false

    const load = async () => {
      await Promise.resolve()
      if (ignore) return
      setLoading(true)

      const [assignRes, usersRes, levelsRes] = await Promise.all([
        getAssignmentsRequest(),
        getUsersRequest({ role: 'COORDINATOR', limit: 100 }),
        getLevelsRequest(),
      ])

      if (ignore) return

      // Asignaciones
      if (!assignRes.error) {
        const list = Array.isArray(assignRes.data)
          ? assignRes.data
          : assignRes.data?.assignments || assignRes.data?.data || []
        setAssignments(list)
      } else {
        const msg =
          assignRes.e?.response?.data?.msg ||
          'Error al cargar las asignaciones de coordinadores.'
        toast.error(msg)
      }

      // Coordinadores
      if (!usersRes.error) {
        const users = usersRes.data?.users || []
        setCoordinatorsList(users.filter((u) => u.status !== false))
      }

      // Niveles
      if (!levelsRes.error) {
        const levels = Array.isArray(levelsRes.data)
          ? levelsRes.data
          : levelsRes.data?.levels || []
        setLevelsList(levels.filter((l) => l.status !== false))
      }

      setLoading(false)
    }

    load()

    return () => {
      ignore = true
    }
  }, [])

  /**
   * Apertura y cierre de modales
   */
  const openAssignModal = () => {
    loadModalDependencies()
    setIsAssignModalOpen(true)
  }

  const closeAssignModal = () => setIsAssignModalOpen(false)

  const openUnassignModal = (assignment) => {
    setSelectedAssignment(assignment)
    setIsUnassignModalOpen(true)
  }

  const closeUnassignModal = () => {
    setSelectedAssignment(null)
    setIsUnassignModalOpen(false)
  }

  /**
   * Asignar uno o más niveles a un coordinador (POST /coordinator/assign)
   */
  const handleAssignLevels = async ({ coordinatorId, levelIds }) => {
    setActionLoading(true)

    const response = await assignRequest({
      coordinatorId,
      levelIds,
    })

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data

      if (serverData?.errors && Array.isArray(serverData.errors)) {
        toast.error(serverData.errors[0]?.msg || 'Error de validación al asignar niveles.')
        return { success: false, errors: serverData.errors }
      }

      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al realizar la asignación de niveles.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('¡Nivel(es) asignado(s) al coordinador exitosamente!')
    closeAssignModal()
    fetchAssignments()
    return { success: true, data: response.data }
  }

  /**
   * Desasignar un nivel a un coordinador (DELETE /coordinator/unassign)
   */
  const handleUnassignLevel = async ({ coordinatorId, levelId }) => {
    setActionLoading(true)

    const response = await unassignRequest({
      coordinatorId,
      levelId,
    })

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data
      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al desasignar el nivel educativo.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('Nivel desasignado del coordinador exitosamente.')
    closeUnassignModal()
    fetchAssignments()
    return { success: true, data: response.data }
  }

  // Filtrado reactivo en cliente por coordinador o nivel
  const filteredAssignments = assignments.filter((assign) => {
    if (!searchQuery.trim()) return true
    const term = searchQuery.toLowerCase()

    const coordName = `${assign.coordinator?.name || ''} ${assign.coordinator?.lastName || ''}`.toLowerCase()
    const coordEmail = (assign.coordinator?.email || '').toLowerCase()
    const coordCode = (assign.coordinator?.code || '').toLowerCase()
    const levelName = (assign.level?.name || '').toLowerCase()
    const levelStage = (assign.level?.stage || '').toLowerCase()

    return (
      coordName.includes(term) ||
      coordEmail.includes(term) ||
      coordCode.includes(term) ||
      levelName.includes(term) ||
      levelStage.includes(term)
    )
  })

  return {
    // Datos
    assignments: filteredAssignments,
    rawAssignments: assignments,
    coordinatorsList,
    levelsList,
    loading,
    actionLoading,
    isAdmin,
    currentAuthUser,

    // Búsqueda
    searchQuery,
    setSearchQuery,
    fetchAssignments,

    // Modales y acciones
    selectedAssignment,
    isAssignModalOpen,
    isUnassignModalOpen,
    openAssignModal,
    closeAssignModal,
    openUnassignModal,
    closeUnassignModal,

    // Acciones de negocio
    handleAssignLevels,
    handleUnassignLevel,
  }
}

export default useCoordinatorsAdmin
