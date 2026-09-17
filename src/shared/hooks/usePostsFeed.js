import { useState, useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import {
  getPosts as getPostsRequest,
  getMyPosts as getMyPostsRequest,
  createPost as createPostRequest,
  evaluatePost as evaluatePostRequest,
  deletePost as deletePostRequest,
} from '@/service/post.api.js'
import { getClasses as getClassesRequest } from '@/service/class.api.js'
import { getRubricCriteria as getRubricCriteriaRequest } from '@/service/rubric.api.js'
import { useAuthStore } from '@/store/useAuthStore.js'

/**
 * Custom Hook: usePostsFeed
 * Administra el ciclo de vida del muro de evidencias ecológicas:
 * Feed comunitario o Muro Personal (según modo), filtrado por aula/jornada/verificación,
 * creación de publicaciones (validando horario de Kinal), evaluación con rúbrica
 * (modelo híbrido oficial/pares con recompensa Eco-Vigilante) y soft delete.
 * 
 * @param {'feed' | 'my-posts'} [mode='feed'] - Modo de visualización
 */
export const usePostsFeed = (mode = 'feed') => {
  const currentAuthUser = useAuthStore((state) => state.user)
  const isAdmin = currentAuthUser?.role === 'ADMIN'
  const isCoordinator = currentAuthUser?.role === 'COORDINATOR'
  const isTeacher = currentAuthUser?.role === 'TEACHER'
  const isStudent = currentAuthUser?.role === 'STUDENT'
  const canPost = isStudent || isAdmin

  // Estados de datos
  const [posts, setPosts] = useState([])
  const [classesList, setClassesList] = useState([])
  const [rubricCriteria, setRubricCriteria] = useState([])

  // Estados de carga
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Filtros reactivos en cliente
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClassFilter, setSelectedClassFilter] = useState('')
  const [selectedShiftFilter, setSelectedShiftFilter] = useState('')
  const [selectedVerifiedFilter, setSelectedVerifiedFilter] = useState('')

  // Estados de modales
  const [selectedPostForDetail, setSelectedPostForDetail] = useState(null)
  const [selectedPostForEvaluate, setSelectedPostForEvaluate] = useState(null)
  const [selectedPostForDelete, setSelectedPostForDelete] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  /**
   * Consulta las publicaciones del feed o muro personal
   */
  const fetchPosts = useCallback(async () => {
    setLoading(true)

    const response = mode === 'my-posts'
      ? await getMyPostsRequest()
      : await getPostsRequest()

    if (response.error) {
      setLoading(false)
      const serverData = response.e?.response?.data
      const errorMsg =
        serverData?.msg ||
        serverData?.message ||
        'Error al cargar las evidencias ecológicas.'
      toast.error(errorMsg)
      return { success: false }
    }

    const loaded = Array.isArray(response.data)
      ? response.data
      : response.data?.posts || response.data?.data || []

    setPosts(loaded)
    setLoading(false)
    return { success: true, data: loaded }
  }, [mode])

  /**
   * Carga dependencias auxiliares: aulas activas y rúbrica oficial
   */
  const loadDependencies = useCallback(async () => {
    const [classesRes, rubricRes] = await Promise.all([
      getClassesRequest(),
      getRubricCriteriaRequest({ all: 'false' }),
    ])

    if (!classesRes.error) {
      const cls = Array.isArray(classesRes.data)
        ? classesRes.data
        : classesRes.data?.classes || classesRes.data?.data || []
      setClassesList(cls.filter((c) => c.status !== false))
    }

    if (!rubricRes.error) {
      const criteria = Array.isArray(rubricRes.data)
        ? rubricRes.data
        : rubricRes.data?.criteria || rubricRes.data?.data || []
      setRubricCriteria(criteria.filter((c) => c.isActive !== false && c.status !== false))
    }
  }, [])

  // Carga inicial
  useEffect(() => {
    let ignore = false

    const init = async () => {
      await Promise.resolve()
      if (ignore) return
      await Promise.all([fetchPosts(), loadDependencies()])
    }

    init()

    return () => {
      ignore = true
    }
  }, [fetchPosts, loadDependencies])

  /**
   * Apertura y cierre de modales
   */
  const openCreateModal = () => setIsCreateModalOpen(true)
  const closeCreateModal = () => setIsCreateModalOpen(false)

  const openDetailModal = (post) => setSelectedPostForDetail(post)
  const closeDetailModal = () => setSelectedPostForDetail(null)

  const openEvaluateModal = (post) => setSelectedPostForEvaluate(post)
  const closeEvaluateModal = () => setSelectedPostForEvaluate(null)

  const openDeleteModal = (post) => setSelectedPostForDelete(post)
  const closeDeleteModal = () => setSelectedPostForDelete(null)

  /**
   * Subir nueva evidencia ecológica (POST /post)
   */
  const handleCreatePost = async (formData) => {
    setActionLoading(true)

    const payload = {
      description: formData.description?.trim(),
      images: formData.images,
    }

    const response = await createPostRequest(payload)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data

      if (serverData?.errors && Array.isArray(serverData.errors)) {
        toast.error(serverData.errors[0]?.msg || 'Error de validación al registrar evidencia.')
        return { success: false, errors: serverData.errors }
      }

      const msg =
        serverData?.msg ||
        serverData?.message ||
        'No se pudo registrar la evidencia ecológica. Verifica el horario escolar de Kinal.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('¡Evidencia ecológica registrada exitosamente!')
    closeCreateModal()
    fetchPosts()
    return { success: true, data: response.data }
  }

  /**
   * Calificar publicación con la rúbrica oficial (POST /post/:id/evaluate)
   */
  const handleEvaluatePost = async (postId, evaluationData) => {
    setActionLoading(true)

    const response = await evaluatePostRequest(postId, evaluationData)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data

      if (serverData?.errors && Array.isArray(serverData.errors)) {
        toast.error(serverData.errors[0]?.msg || 'Error de validación al evaluar la publicación.')
        return { success: false, errors: serverData.errors }
      }

      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al calificar la evidencia ecológica.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    if (isStudent) {
      toast.success('¡Evaluación registrada! Has recibido +5 pts de Eco-Aura como Eco-Vigilante.')
    } else {
      toast.success('¡Evaluación oficial registrada y puntos asignados al ranking escolar!')
    }

    closeEvaluateModal()
    fetchPosts()
    return { success: true, data: response.data }
  }

  /**
   * Desactivar publicación (DELETE /post/:id)
   */
  const handleDeletePost = async (postId) => {
    setActionLoading(true)

    const response = await deletePostRequest(postId)

    if (response.error) {
      setActionLoading(false)
      const serverData = response.e?.response?.data
      const msg =
        serverData?.msg ||
        serverData?.message ||
        'Error al desactivar la publicación.'
      toast.error(msg)
      return { success: false, error: msg }
    }

    setActionLoading(false)
    toast.success('¡Publicación retirada exitosamente!')
    closeDeleteModal()
    fetchPosts()
    return { success: true, data: response.data }
  }

  /**
   * Filtrado reactivo de publicaciones
   */
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Filtro por aula
      if (selectedClassFilter && post.classGroup?.uid !== selectedClassFilter) {
        return false
      }

      // Filtro por jornada
      if (selectedShiftFilter && post.shift !== selectedShiftFilter) {
        return false
      }

      // Filtro por verificación oficial
      if (selectedVerifiedFilter === 'verified' && !post.isOfficiallyVerified) {
        return false
      }
      if (selectedVerifiedFilter === 'unverified' && post.isOfficiallyVerified) {
        return false
      }

      // Filtro de búsqueda por texto
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase().trim()

      const descMatch = (post.description || '').toLowerCase().includes(q)
      const authorMatch = `${post.student?.name || ''} ${post.student?.lastName || ''}`
        .toLowerCase()
        .includes(q)
      const codeMatch = (post.student?.code || '').toLowerCase().includes(q)
      const classMatch = (post.classGroup?.name || '').toLowerCase().includes(q)

      return descMatch || authorMatch || codeMatch || classMatch
    })
  }, [posts, selectedClassFilter, selectedShiftFilter, selectedVerifiedFilter, searchQuery])

  /**
   * Métricas calculadas para cabeceras
   */
  const metrics = useMemo(() => {
    const total = posts.length
    const verified = posts.filter((p) => p.isOfficiallyVerified).length
    const officialScoreSum = posts.reduce((acc, p) => acc + (Number(p.officialScore) || 0), 0)
    const communityScoreSum = posts.reduce((acc, p) => acc + (Number(p.communityScore) || 0), 0)
    const myAuraSum = posts.reduce((acc, p) => acc + (Number(p.totalEcoAuraEarned) || 0), 0)

    return {
      total,
      verified,
      officialScoreSum,
      communityScoreSum,
      myAuraSum,
    }
  }, [posts])

  return {
    posts,
    filteredPosts,
    classesList,
    rubricCriteria,
    metrics,
    loading,
    actionLoading,
    canPost,
    isAdmin,
    isCoordinator,
    isTeacher,
    isStudent,
    currentAuthUser,
    searchQuery,
    setSearchQuery,
    selectedClassFilter,
    setSelectedClassFilter,
    selectedShiftFilter,
    setSelectedShiftFilter,
    selectedVerifiedFilter,
    setSelectedVerifiedFilter,
    fetchPosts,
    // Modales
    selectedPostForDetail,
    openDetailModal,
    closeDetailModal,
    selectedPostForEvaluate,
    openEvaluateModal,
    closeEvaluateModal,
    selectedPostForDelete,
    openDeleteModal,
    closeDeleteModal,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    // Operaciones
    handleCreatePost,
    handleEvaluatePost,
    handleDeletePost,
  }
}

export default usePostsFeed
