import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import {
  getUsers as getUsersRequest,
  postUser as postUserRequest,
  updateUser as updateUserRequest,
  deleteUser as deleteUserRequest,
  USER_ROLES,
} from '@/service/user.api.js'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Custom Hook: useUsersAdmin
 * Gestiona el ciclo de vida del CRUD administrativo de usuarios:
 * Listar con paginación y filtro de rol, búsqueda cliente, actualización y soft delete.
 */
export const useUsersAdmin = (initialLimit = 10) => {
  const currentAuthUser = useAuthStore((state) => state.user)

  // Estados de datos y red
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Estados de paginación y filtros
  const [limit, setLimitState] = useState(initialLimit)
  const [from, setFromState] = useState(0)
  const [roleFilter, setRoleFilterState] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Estados de interacción modal
  const [selectedUser, setSelectedUser] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  /**
   * Consulta la lista de usuarios al backend (llamada imperativa para refresco y acciones)
   */
  const fetchUsers = useCallback(
    async (overrideParams = {}) => {
      setLoading(true)

      const queryParams = {
        limit: overrideParams.limit !== undefined ? overrideParams.limit : limit,
        from: overrideParams.from !== undefined ? overrideParams.from : from,
        role: overrideParams.role !== undefined ? overrideParams.role : roleFilter,
      }

      const response = await getUsersRequest(queryParams)

      if (response.error) {
        setLoading(false)
        const serverError = response.e?.response?.data
        const errorMsg =
          serverError?.msg ||
          serverError?.message ||
          'Error al cargar la lista de usuarios.'
        toast.error(errorMsg)
        return { success: false }
      }

      setUsers(response.data?.users || [])
      setTotal(response.data?.total || 0)
      setLoading(false)

      return { success: true, data: response.data }
    },
    [limit, from, roleFilter]
  )

  // Sincronización reactiva con cancelación limpia para evitar cascading renders
  useEffect(() => {
    let ignore = false

    const loadData = async () => {
      // Cede a la cola de microtareas para asegurar ejecución asíncrona fuera del ciclo de render sincrónico
      await Promise.resolve()
      if (ignore) return

      setLoading(true)
      const queryParams = {
        limit,
        from,
        role: roleFilter,
      }

      const response = await getUsersRequest(queryParams)
      if (ignore) return

      if (response.error) {
        setLoading(false)
        const serverError = response.e?.response?.data
        toast.error(serverError?.msg || 'Error al cargar la lista de usuarios.')
        return
      }

      setUsers(response.data?.users || [])
      setTotal(response.data?.total || 0)
      setLoading(false)
    }

    loadData()

    return () => {
      ignore = true
    }
  }, [limit, from, roleFilter])

  /**
   * Cambiar filtro de rol (reinicia la paginación a la primera página)
   */
  const handleRoleFilterChange = (newRole) => {
    setRoleFilterState(newRole)
    setFromState(0)
  }

  /**
   * Cambiar límite por página (reinicia a la primera página)
   */
  const handleLimitChange = (newLimit) => {
    const parsed = Number(newLimit) || 10
    setLimitState(parsed)
    setFromState(0)
  }

  /**
   * Navegar a página anterior
   */
  const handlePrevPage = () => {
    const nextFrom = Math.max(0, from - limit)
    setFromState(nextFrom)
  }

  /**
   * Navegar a página siguiente
   */
  const handleNextPage = () => {
    if (from + limit < total) {
      setFromState(from + limit)
    }
  }

  /**
   * Apertura y cierre de modales
   */
  const openCreateModal = () => {
    setIsCreateModalOpen(true)
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setSelectedUser(null)
    setIsEditModalOpen(false)
  }

  const openDeleteModal = (user) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setSelectedUser(null)
    setIsDeleteModalOpen(false)
  }

  /**
   * Crear usuario administrativo (POST /user)
   */
  const handleCreateUser = async (formData) => {
    setActionLoading(true)

    const payload = {
      name: formData.name?.trim(),
      lastName: formData.lastName?.trim(),
      email: formData.email?.trim(),
      password: formData.password?.trim(),
    }

    if (formData.code?.trim()) {
      payload.code = formData.code.trim()
    }

    if (formData.role) {
      payload.role = formData.role
    }

    const response = await postUserRequest(payload)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data

      // Error 400 con array de express-validator
      if (serverData?.errors && Array.isArray(serverData.errors)) {
        toast.error(serverData.errors[0]?.msg || 'Error de validación al crear usuario.')
        return { success: false, errors: serverData.errors }
      }

      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al crear el nuevo usuario.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success(response.data?.msg || '¡Usuario creado exitosamente!')
    closeCreateModal()
    fetchUsers()
    return { success: true, data: response.data }
  }

  /**
   * Actualizar usuario (PUT /user/:id)
   */
  const handleUpdateUser = async (id, formData) => {
    setActionLoading(true)

    // Filtrar campos para enviar sólo datos válidos y con valor
    const payload = {}
    if (formData.name?.trim()) payload.name = formData.name.trim()
    if (formData.lastName?.trim()) payload.lastName = formData.lastName.trim()
    if (formData.code?.trim()) payload.code = formData.code.trim()

    // Solo ADMIN puede modificar roles
    if (currentAuthUser?.role === 'ADMIN' && formData.role) {
      payload.role = formData.role
    }

    // Contraseña solo si se proporcionó valor
    if (formData.password?.trim()) {
      payload.password = formData.password.trim()
    }

    const response = await updateUserRequest(id, payload)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data

      // Error 400 con array de express-validator
      if (serverData?.errors && Array.isArray(serverData.errors)) {
        toast.error(serverData.errors[0]?.msg || 'Error de validación en los campos.')
        return { success: false, errors: serverData.errors }
      }

      // Error 403 de permisos, 404 de no encontrado o mensaje general
      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al actualizar los datos del usuario.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success(response.data?.msg || 'Usuario actualizado exitosamente.')
    closeEditModal()
    fetchUsers()
    return { success: true, data: response.data }
  }

  /**
   * Desactivar usuario (DELETE /user/:id - Soft Delete)
   */
  const handleDeleteUser = async (id) => {
    // Validación de seguridad previa: no desactivarse a uno mismo
    if (currentAuthUser?._id === id || currentAuthUser?.uid === id) {
      toast.error('No puedes desactivar tu propia cuenta.')
      return { success: false }
    }

    setActionLoading(true)
    const response = await deleteUserRequest(id)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data
      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al desactivar el usuario.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success(response.data?.msg || 'Usuario desactivado exitosamente.')
    closeDeleteModal()
    fetchUsers()
    return { success: true, data: response.data }
  }

  // Filtrado reactivo en cliente sobre la página actual por texto de búsqueda
  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true
    const term = searchQuery.toLowerCase()
    const fullName = `${u.name || ''} ${u.lastName || ''}`.toLowerCase()
    const email = (u.email || '').toLowerCase()
    const code = (u.code || '').toLowerCase()
    const role = (u.role || '').toLowerCase()
    return (
      fullName.includes(term) ||
      email.includes(term) ||
      code.includes(term) ||
      role.includes(term)
    )
  })

  return {
    // Datos
    users: filteredUsers,
    rawUsers: users,
    total,
    loading,
    actionLoading,
    availableRoles: USER_ROLES,
    currentAuthUser,

    // Paginación y filtros
    limit,
    from,
    roleFilter,
    searchQuery,
    setSearchQuery,
    handleRoleFilterChange,
    handleLimitChange,
    handlePrevPage,
    handleNextPage,
    fetchUsers,

    // Modales y acciones
    selectedUser,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
  }
}

export default useUsersAdmin
