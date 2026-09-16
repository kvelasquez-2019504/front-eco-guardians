import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import {
  getLevels as getLevelsRequest,
  createLevel as createLevelRequest,
  seedLevels as seedLevelsRequest,
  updateLevel as updateLevelRequest,
  deleteLevel as deleteLevelRequest,
  LEVEL_STAGES,
} from '@/service/level.api.js'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Custom Hook: useLevelsAdmin
 * Administra el ciclo de vida de los niveles y secciones:
 * Listado, filtros por etapa, búsqueda en vivo, creación, actualización, soft delete y sembrado inicial (seed).
 */
export const useLevelsAdmin = () => {
  const currentAuthUser = useAuthStore((state) => state.user)
  const isAdmin = currentAuthUser?.role === 'ADMIN'

  // Estados de datos y carga
  const [levels, setLevels] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [seedLoading, setSeedLoading] = useState(false)

  // Filtros reactivos
  const [searchQuery, setSearchQuery] = useState('')
  const [stageFilter, setStageFilter] = useState('')

  // Estados modales
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  /**
   * Consulta los niveles registrados en el backend
   */
  const fetchLevels = useCallback(async () => {
    setLoading(true)
    const response = await getLevelsRequest()

    if (response.error) {
      setLoading(false)
      const serverData = response.e?.response?.data
      const errorMsg =
        serverData?.msg ||
        serverData?.message ||
        'Error al cargar la lista de niveles educativos.'
      toast.error(errorMsg)
      return { success: false }
    }

    // El backend puede responder con un array directo o un objeto { levels: [...] } o { data: [...] }
    const loadedLevels = Array.isArray(response.data)
      ? response.data
      : response.data?.levels || response.data?.data || []

    setLevels(loadedLevels)
    setLoading(false)
    return { success: true, data: loadedLevels }
  }, [])

  // Carga inicial desacoplada del ciclo sincrónico de render
  useEffect(() => {
    let ignore = false

    const load = async () => {
      await Promise.resolve()
      if (ignore) return
      setLoading(true)
      const response = await getLevelsRequest()
      if (ignore) return

      if (response.error) {
        setLoading(false)
        const serverData = response.e?.response?.data
        toast.error(
          serverData?.msg ||
            serverData?.message ||
            'Error al cargar la lista de niveles educativos.'
        )
        return
      }

      const loadedLevels = Array.isArray(response.data)
        ? response.data
        : response.data?.levels || response.data?.data || []

      setLevels(loadedLevels)
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
  const openCreateModal = () => setIsCreateModalOpen(true)
  const closeCreateModal = () => setIsCreateModalOpen(false)

  const openEditModal = (level) => {
    setSelectedLevel(level)
    setIsEditModalOpen(true)
  }
  const closeEditModal = () => {
    setSelectedLevel(null)
    setIsEditModalOpen(false)
  }

  const openDeleteModal = (level) => {
    setSelectedLevel(level)
    setIsDeleteModalOpen(true)
  }
  const closeDeleteModal = () => {
    setSelectedLevel(null)
    setIsDeleteModalOpen(false)
  }

  /**
   * Crear un nuevo nivel (POST /level)
   */
  const handleCreateLevel = async (formData) => {
    setActionLoading(true)

    const payload = {
      name: formData.name?.trim(),
      stage: formData.stage,
      gradeNumber: Number(formData.gradeNumber),
      allowedSections: Array.isArray(formData.allowedSections)
        ? formData.allowedSections
        : [],
    }

    const response = await createLevelRequest(payload)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data

      if (serverData?.errors && Array.isArray(serverData.errors)) {
        toast.error(serverData.errors[0]?.msg || 'Error de validación al crear nivel.')
        return { success: false, errors: serverData.errors }
      }

      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al registrar el nivel educativo.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('¡Nivel educativo creado con éxito!')
    closeCreateModal()
    fetchLevels()
    return { success: true, data: response.data }
  }

  /**
   * Actualizar un nivel existente (PUT /level/:id usando level.uid)
   */
  const handleUpdateLevel = async (uid, formData) => {
    setActionLoading(true)

    const payload = {}
    if (formData.name?.trim()) payload.name = formData.name.trim()
    if (formData.stage) payload.stage = formData.stage
    if (formData.gradeNumber !== undefined && formData.gradeNumber !== '') {
      payload.gradeNumber = Number(formData.gradeNumber)
    }
    if (formData.allowedSections) {
      payload.allowedSections = formData.allowedSections
    }

    const response = await updateLevelRequest(uid, payload)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data

      if (serverData?.errors && Array.isArray(serverData.errors)) {
        toast.error(serverData.errors[0]?.msg || 'Error de validación al actualizar.')
        return { success: false, errors: serverData.errors }
      }

      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al actualizar el nivel educativo.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('Nivel educativo actualizado exitosamente.')
    closeEditModal()
    fetchLevels()
    return { success: true, data: response.data }
  }

  /**
   * Desactivar nivel (DELETE /level/:id usando level.uid)
   */
  const handleDeleteLevel = async (uid) => {
    setActionLoading(true)
    const response = await deleteLevelRequest(uid)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data
      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al desactivar el nivel educativo.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('Nivel educativo desactivado exitosamente.')
    closeDeleteModal()
    fetchLevels()
    return { success: true, data: response.data }
  }

  /**
   * Sembrado inicial automático de grados de Kinal (POST /level/seed)
   */
  const handleSeedLevels = async () => {
    setSeedLoading(true)
    const response = await seedLevelsRequest()

    if (response.error) {
      setSeedLoading(false)
      const serverData = response.e?.response?.data
      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al ejecutar el sembrado inicial de grados.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setSeedLoading(false)
    toast.success('¡Grados y niveles oficiales de Kinal sembrados con éxito!')
    fetchLevels()
    return { success: true, data: response.data }
  }

  // Filtrado reactivo en cliente por etapa y término de búsqueda
  const filteredLevels = levels.filter((level) => {
    // 1. Filtro por etapa (BASICO / DIVERSIFICADO)
    if (stageFilter && level.stage !== stageFilter) {
      return false
    }

    // 2. Filtro por texto de búsqueda
    if (!searchQuery.trim()) return true
    const term = searchQuery.toLowerCase()
    const name = (level.name || '').toLowerCase()
    const stage = (level.stage || '').toLowerCase()
    const grade = String(level.gradeNumber || '')
    const sections = Array.isArray(level.allowedSections)
      ? level.allowedSections.join(' ').toLowerCase()
      : ''

    return (
      name.includes(term) ||
      stage.includes(term) ||
      grade.includes(term) ||
      sections.includes(term)
    )
  })

  return {
    // Datos
    levels: filteredLevels,
    rawLevels: levels,
    loading,
    actionLoading,
    seedLoading,
    availableStages: LEVEL_STAGES,
    isAdmin,
    currentAuthUser,

    // Filtros
    searchQuery,
    setSearchQuery,
    stageFilter,
    setStageFilter,
    fetchLevels,

    // Modales y acciones
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

    // Acciones de negocio
    handleCreateLevel,
    handleUpdateLevel,
    handleDeleteLevel,
    handleSeedLevels,
  }
}

export default useLevelsAdmin
