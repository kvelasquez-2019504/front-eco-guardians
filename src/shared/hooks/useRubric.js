import { useState, useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import {
  getRubricCriteria as getRubricCriteriaRequest,
  createCriterion as createCriterionRequest,
  updateCriterion as updateCriterionRequest,
  toggleCriterionActive as toggleCriterionActiveRequest,
  deleteCriterion as deleteCriterionRequest,
} from '@/service/rubric.api.js'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Custom Hook: useRubric
 * Administra el ciclo de vida de los criterios de evaluación de la Rúbrica Oficial:
 * Listado, filtrado reactivo por categoría y estado de evaluación, creación, edición,
 * alternar disponibilidad (isActive) y desactivación lógica.
 */
export const useRubric = () => {
  const currentAuthUser = useAuthStore((state) => state.user)
  const isAdmin = currentAuthUser?.role === 'ADMIN'
  const isCoordinator = currentAuthUser?.role === 'COORDINATOR'
  const canManage = isAdmin || isCoordinator
  const canDelete = isAdmin

  // Estados de datos
  const [criteria, setCriteria] = useState([])

  // Estados de carga
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Filtros en cliente
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState('')

  // Estados modales
  const [selectedCriterion, setSelectedCriterion] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  /**
   * Consulta los criterios de la rúbrica (GET /rubric)
   */
  const fetchCriteria = useCallback(async () => {
    setLoading(true)
    // Los administradores y coordinadores pueden consultar todos los criterios incluyendo los no activos
    const params = canManage ? { all: 'true' } : {}
    const response = await getRubricCriteriaRequest(params)

    if (response.error) {
      setLoading(false)
      const serverData = response.e?.response?.data
      const errorMsg =
        serverData?.msg ||
        serverData?.message ||
        'Error al cargar los criterios de la rúbrica oficial.'
      toast.error(errorMsg)
      return { success: false }
    }

    const loaded = Array.isArray(response.data)
      ? response.data
      : response.data?.criteria || response.data?.data || []

    setCriteria(loaded)
    setLoading(false)
    return { success: true, data: loaded }
  }, [canManage])

  // Carga inicial al montar
  useEffect(() => {
    let ignore = false

    const init = async () => {
      await Promise.resolve()
      if (ignore) return
      fetchCriteria()
    }

    init()

    return () => {
      ignore = true
    }
  }, [fetchCriteria])

  /**
   * Control de modales
   */
  const openCreateModal = () => setIsCreateModalOpen(true)
  const closeCreateModal = () => setIsCreateModalOpen(false)

  const openEditModal = (criterion) => {
    setSelectedCriterion(criterion)
    setIsEditModalOpen(true)
  }
  const closeEditModal = () => {
    setSelectedCriterion(null)
    setIsEditModalOpen(false)
  }

  const openDeleteModal = (criterion) => {
    setSelectedCriterion(criterion)
    setIsDeleteModalOpen(true)
  }
  const closeDeleteModal = () => {
    setSelectedCriterion(null)
    setIsDeleteModalOpen(false)
  }

  /**
   * Crear criterio (POST /rubric)
   */
  const handleCreateCriterion = async (formData) => {
    setActionLoading(true)

    const payload = {
      title: formData.title.trim(),
      points: Number(formData.points),
      description: formData.description?.trim() || undefined,
      category: formData.category || 'GENERAL',
      order: formData.order !== undefined && formData.order !== '' ? Number(formData.order) : 0,
    }

    const response = await createCriterionRequest(payload)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data

      if (serverData?.errors && Array.isArray(serverData.errors)) {
        toast.error(serverData.errors[0]?.msg || 'Error de validación al crear el criterio.')
        return { success: false, errors: serverData.errors }
      }

      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al crear el criterio evaluable.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('¡Criterio evaluable creado exitosamente!')
    closeCreateModal()
    fetchCriteria()
    return { success: true, data: response.data }
  }

  /**
   * Actualizar criterio (PUT /rubric/:id)
   */
  const handleUpdateCriterion = async (id, formData) => {
    setActionLoading(true)

    const payload = {
      title: formData.title.trim(),
      points: Number(formData.points),
      description: formData.description?.trim() || undefined,
      category: formData.category || 'GENERAL',
      order: formData.order !== undefined && formData.order !== '' ? Number(formData.order) : 0,
    }

    const response = await updateCriterionRequest(id, payload)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data

      if (serverData?.errors && Array.isArray(serverData.errors)) {
        toast.error(serverData.errors[0]?.msg || 'Error de validación al actualizar el criterio.')
        return { success: false, errors: serverData.errors }
      }

      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al actualizar los datos del criterio.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('¡Criterio actualizado exitosamente!')
    closeEditModal()
    fetchCriteria()
    return { success: true, data: response.data }
  }

  /**
   * Alternar estado en listas de cotejo (PATCH /rubric/:id/toggle)
   */
  const handleToggleActive = async (criterion) => {
    setActionLoading(true)

    const response = await toggleCriterionActiveRequest(criterion.uid)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data
      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al cambiar el estado del criterio.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    const nextState = !criterion.isActive
    toast.success(
      nextState
        ? `¡Criterio "${criterion.title}" habilitado en evaluaciones!`
        : `Criterio "${criterion.title}" pausado de las evaluaciones.`
    )
    fetchCriteria()
    return { success: true, data: response.data }
  }

  /**
   * Desactivación lógica (DELETE /rubric/:id)
   */
  const handleDeleteCriterion = async (id) => {
    setActionLoading(true)

    const response = await deleteCriterionRequest(id)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data
      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al desactivar el criterio.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('¡Criterio desactivado exitosamente!')
    closeDeleteModal()
    fetchCriteria()
    return { success: true, data: response.data }
  }


  /**
   * Criterios filtrados
   */
  const filteredCriteria = useMemo(() => {
    return criteria.filter((item) => {
      // Filtro por categoría
      if (categoryFilter && item.category !== categoryFilter) {
        return false
      }

      // Filtro por visibilidad en evaluación (isActive)
      if (activeFilter === 'active' && item.isActive === false) {
        return false
      }
      if (activeFilter === 'inactive' && item.isActive !== false) {
        return false
      }

      // Filtro de búsqueda por texto
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase().trim()

      const titleMatch = (item.title || '').toLowerCase().includes(q)
      const descMatch = (item.description || '').toLowerCase().includes(q)
      const catMatch = (item.category || '').toLowerCase().includes(q)

      return titleMatch || descMatch || catMatch
    })
  }, [criteria, categoryFilter, activeFilter, searchQuery])

  /**
   * Métricas calculadas para cabecera
   */
  const metrics = useMemo(() => {
    const total = criteria.length
    const activeInEvaluation = criteria.filter((c) => c.isActive !== false && c.status !== false).length
    const totalPoints = criteria
      .filter((c) => c.isActive !== false && c.status !== false)
      .reduce((acc, c) => acc + (Number(c.points) || 0), 0)

    const categoriesCount = new Set(
      criteria.filter((c) => c.status !== false).map((c) => c.category)
    ).size

    return {
      total,
      activeInEvaluation,
      totalPoints,
      categoriesCount,
    }
  }, [criteria])

  return {
    criteria,
    filteredCriteria,
    metrics,
    loading,
    actionLoading,
    canManage,
    canDelete,
    isAdmin,
    isCoordinator,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    activeFilter,
    setActiveFilter,
    fetchCriteria,
    // Modales
    selectedCriterion,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    // Operaciones
    handleCreateCriterion,
    handleUpdateCriterion,
    handleToggleActive,
    handleDeleteCriterion,
  }
}

export default useRubric
