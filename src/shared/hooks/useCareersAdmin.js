import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import {
  getCareers as getCareersRequest,
  createCareer as createCareerRequest,
  updateCareer as updateCareerRequest,
  deleteCareer as deleteCareerRequest,
} from '@/service/career.api.js'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Custom Hook: useCareersAdmin
 * Administra el ciclo de vida de las Carreras Técnicas:
 * Listado, búsqueda en vivo, creación, actualización y soft delete.
 */
export const useCareersAdmin = () => {
  const currentAuthUser = useAuthStore((state) => state.user)
  const isAdmin = currentAuthUser?.role === 'ADMIN'

  // Estados de datos y carga
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Búsqueda reactiva en cliente
  const [searchQuery, setSearchQuery] = useState('')

  // Estados modales
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  /**
   * Consulta las carreras registradas en el backend
   */
  const fetchCareers = useCallback(async () => {
    setLoading(true)
    const response = await getCareersRequest()

    if (response.error) {
      setLoading(false)
      const serverData = response.e?.response?.data
      const errorMsg =
        serverData?.msg ||
        serverData?.message ||
        'Error al cargar la lista de carreras técnicas.'
      toast.error(errorMsg)
      return { success: false }
    }

    const loadedCareers = Array.isArray(response.data)
      ? response.data
      : response.data?.careers || response.data?.data || []

    setCareers(loadedCareers)
    setLoading(false)
    return { success: true, data: loadedCareers }
  }, [])

  // Carga inicial desacoplada del ciclo sincrónico de render
  useEffect(() => {
    let ignore = false

    const load = async () => {
      await Promise.resolve()
      if (ignore) return
      setLoading(true)
      const response = await getCareersRequest()
      if (ignore) return

      if (response.error) {
        setLoading(false)
        const serverData = response.e?.response?.data
        toast.error(
          serverData?.msg ||
            serverData?.message ||
            'Error al cargar la lista de carreras técnicas.'
        )
        return
      }

      const loadedCareers = Array.isArray(response.data)
        ? response.data
        : response.data?.careers || response.data?.data || []

      setCareers(loadedCareers)
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

  const openEditModal = (career) => {
    setSelectedCareer(career)
    setIsEditModalOpen(true)
  }
  const closeEditModal = () => {
    setSelectedCareer(null)
    setIsEditModalOpen(false)
  }

  const openDeleteModal = (career) => {
    setSelectedCareer(career)
    setIsDeleteModalOpen(true)
  }
  const closeDeleteModal = () => {
    setSelectedCareer(null)
    setIsDeleteModalOpen(false)
  }

  /**
   * Registrar una nueva especialidad técnica (POST /career)
   */
  const handleCreateCareer = async (formData) => {
    setActionLoading(true)

    const payload = {
      name: formData.name?.trim(),
      description: formData.description?.trim() || '',
    }

    const response = await createCareerRequest(payload)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data

      if (serverData?.errors && Array.isArray(serverData.errors)) {
        toast.error(serverData.errors[0]?.msg || 'Error de validación al crear carrera.')
        return { success: false, errors: serverData.errors }
      }

      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al registrar la carrera técnica.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('¡Carrera técnica registrada con éxito!')
    closeCreateModal()
    fetchCareers()
    return { success: true, data: response.data }
  }

  /**
   * Actualizar una carrera técnica existente (PUT /career/:id usando career.uid)
   */
  const handleUpdateCareer = async (uid, formData) => {
    setActionLoading(true)

    const payload = {}
    if (formData.name?.trim()) payload.name = formData.name.trim()
    if (formData.description !== undefined) {
      payload.description = formData.description.trim()
    }

    const response = await updateCareerRequest(uid, payload)

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
        'Error al actualizar la carrera técnica.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('Carrera técnica actualizada exitosamente.')
    closeEditModal()
    fetchCareers()
    return { success: true, data: response.data }
  }

  /**
   * Desactivar carrera (DELETE /career/:id usando career.uid)
   */
  const handleDeleteCareer = async (uid) => {
    setActionLoading(true)
    const response = await deleteCareerRequest(uid)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data
      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al desactivar la carrera técnica.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('Carrera técnica desactivada exitosamente.')
    closeDeleteModal()
    fetchCareers()
    return { success: true, data: response.data }
  }

  // Filtrado reactivo en cliente por término de búsqueda
  const filteredCareers = careers.filter((career) => {
    if (!searchQuery.trim()) return true
    const term = searchQuery.toLowerCase()
    const name = (career.name || '').toLowerCase()
    const desc = (career.description || '').toLowerCase()
    return name.includes(term) || desc.includes(term)
  })

  return {
    // Datos
    careers: filteredCareers,
    rawCareers: careers,
    loading,
    actionLoading,
    isAdmin,
    currentAuthUser,

    // Filtro
    searchQuery,
    setSearchQuery,
    fetchCareers,

    // Modales y acciones
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

    // Acciones de negocio
    handleCreateCareer,
    handleUpdateCareer,
    handleDeleteCareer,
  }
}

export default useCareersAdmin
