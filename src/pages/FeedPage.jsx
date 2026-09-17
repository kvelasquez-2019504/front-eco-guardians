import { Rss, ShieldCheck, Award, Sparkles, FolderKanban } from 'lucide-react'
import { usePostsFeed } from '@/shared/hooks/usePostsFeed.js'
import { H1 } from '@/components/atoms/Heading.jsx'
import { SchoolScheduleBanner } from '@/components/molecules/SchoolScheduleBanner.jsx'
import { PostFilterBar } from '@/components/molecules/PostFilterBar.jsx'
import { PostCard } from '@/components/organisms/post/PostCard.jsx'
import { EvaluatePostModal } from '@/components/organisms/post/EvaluatePostModal.jsx'
import { PostDetailModal } from '@/components/organisms/post/PostDetailModal.jsx'
import { PostCreateModal } from '@/components/organisms/post/PostCreateModal.jsx'
import { PostDeleteModal } from '@/components/organisms/post/PostDeleteModal.jsx'

/**
 * Página: FeedPage
 * Muro comunitario general de evidencias ecológicas escolares.
 * Ruta: /feed
 */
export const FeedPage = () => {
  const {
    filteredPosts,
    classesList,
    rubricCriteria,
    metrics,
    loading,
    actionLoading,
    canPost,
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

    handleCreatePost,
    handleEvaluatePost,
    handleDeletePost,
  } = usePostsFeed('feed')

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Encabezado principal y métricas (sin botones duplicados) */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-green/15 text-eco-green text-xs font-bold mb-3 border border-eco-green/30">
              <Rss size={14} /> Módulo Ecológico
            </div>
            <H1 variant="gradient">Feed de Evidencias</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Registro vivo de acciones ambientales de los Eco-Guardianes de Fundación Kinal y evaluación comunitaria.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            {/* Tarjetas métricas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              {/* Total Evidencias */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[75px]">
                <span className="text-[11px] font-body text-eco-muted flex items-center justify-center gap-1">
                  <FolderKanban size={12} /> Evidencias
                </span>
                <span className="font-heading font-black text-xl text-eco-text block mt-0.5">
                  {metrics.total}
                </span>
              </div>

              {/* Verificadas Oficiales */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[75px]">
                <span className="text-[11px] font-body text-emerald-400 flex items-center justify-center gap-1">
                  <ShieldCheck size={12} /> Verificadas
                </span>
                <span className="font-heading font-black text-xl text-emerald-400 block mt-0.5">
                  {metrics.verified}
                </span>
              </div>

              {/* Puntos Oficiales */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[75px]">
                <span className="text-[11px] font-body text-eco-green flex items-center justify-center gap-1">
                  <Award size={12} /> Puntos Of.
                </span>
                <span className="font-heading font-black text-xl text-eco-green block mt-0.5">
                  {metrics.officialScoreSum}
                </span>
              </div>

              {/* Eco-Aura Comunitario */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-3.5 py-3 text-center min-w-[75px]">
                <span className="text-[11px] font-body text-eco-cyan flex items-center justify-center gap-1">
                  <Sparkles size={12} /> Puntos Pares
                </span>
                <span className="font-heading font-black text-xl text-eco-cyan block mt-0.5">
                  {metrics.communityScoreSum}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Banner de Horarios Oficiales de Kinal */}
      <SchoolScheduleBanner />

      {/* 3. Barra de filtros interactiva con el botón '+ Subir Evidencia' (única ubicación) */}
      <PostFilterBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        classesList={classesList}
        selectedClassFilter={selectedClassFilter}
        onClassFilterChange={setSelectedClassFilter}
        selectedShiftFilter={selectedShiftFilter}
        onShiftFilterChange={setSelectedShiftFilter}
        selectedVerifiedFilter={selectedVerifiedFilter}
        onVerifiedFilterChange={setSelectedVerifiedFilter}
        onRefresh={fetchPosts}
        loading={loading}
        canPost={canPost}
        onCreatePost={openCreateModal}
      />

      {/* 4. Stream de Publicaciones */}
      {loading ? (
        <div className="p-16 text-center bg-eco-card border border-eco-border rounded-3xl shadow-xl">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-eco-green/20 border-t-eco-green rounded-full animate-spin" />
            <span className="text-sm font-body text-eco-muted">
              Cargando evidencias ecológicas de la comunidad...
            </span>
          </div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-16 text-center bg-eco-card border border-eco-border rounded-3xl shadow-xl space-y-4">
          <div className="w-14 h-14 mx-auto p-3.5 bg-eco-bg text-eco-muted rounded-2xl border border-eco-border flex items-center justify-center">
            <Rss size={28} />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-heading font-bold text-base text-eco-text">
              No hay evidencias registradas en este momento
            </h3>
            <p className="text-xs text-eco-muted font-body leading-relaxed">
              Sé el primero en documentar tu acción ambiental o ajusta los filtros seleccionados.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.uid}
              post={post}
              currentAuthUser={currentAuthUser}
              onEvaluate={openEvaluateModal}
              onViewDetail={openDetailModal}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      )}

      {/* 5. Modales de Gestión */}
      {/* Modal para Calificar con Rúbrica */}
      <EvaluatePostModal
        isOpen={Boolean(selectedPostForEvaluate)}
        onClose={closeEvaluateModal}
        post={selectedPostForEvaluate}
        rubricCriteria={rubricCriteria}
        onSave={handleEvaluatePost}
        loading={actionLoading}
        currentAuthUser={currentAuthUser}
      />

      {/* Modal de Detalle Completo e Historial */}
      <PostDetailModal
        isOpen={Boolean(selectedPostForDetail)}
        onClose={closeDetailModal}
        post={selectedPostForDetail}
      />

      {/* Modal para Subir Nueva Evidencia */}
      <PostCreateModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSave={handleCreatePost}
        loading={actionLoading}
      />

      {/* Modal de Confirmación de Desactivación */}
      <PostDeleteModal
        isOpen={Boolean(selectedPostForDelete)}
        onClose={closeDeleteModal}
        post={selectedPostForDelete}
        onConfirm={handleDeletePost}
        loading={actionLoading}
      />
    </div>
  )
}

export default FeedPage
