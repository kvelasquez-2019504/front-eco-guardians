import { FileText, ShieldCheck, Sparkles, Plus } from 'lucide-react'
import { usePostsFeed } from '@/shared/hooks/usePostsFeed.js'
import { H1 } from '@/components/atoms/Heading.jsx'
import { Button } from '@/components/atoms/Button.jsx'
import { SchoolScheduleBanner } from '@/components/molecules/SchoolScheduleBanner.jsx'
import { PostCard } from '@/components/organisms/post/PostCard.jsx'
import { EvaluatePostModal } from '@/components/organisms/post/EvaluatePostModal.jsx'
import { PostDetailModal } from '@/components/organisms/post/PostDetailModal.jsx'
import { PostCreateModal } from '@/components/organisms/post/PostCreateModal.jsx'
import { PostDeleteModal } from '@/components/organisms/post/PostDeleteModal.jsx'

/**
 * Página: MyPostsPage
 * Muro personal del alumno con sus evidencias ecológicas publicadas y Eco-Aura ganado.
 * Ruta: /posts/my-posts
 */
export const MyPostsPage = () => {
  const {
    filteredPosts,
    rubricCriteria,
    metrics,
    loading,
    actionLoading,
    currentAuthUser,

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
  } = usePostsFeed('my-posts')

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Encabezado personal y métricas */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-green/15 text-eco-green text-xs font-bold mb-3 border border-eco-green/30">
              <FileText size={14} /> Módulo Ecológico
            </div>
            <H1 variant="gradient">Mis Publicaciones</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Registro histórico de tus evidencias ecológicas, calificaciones obtenidas y puntos de Eco-Aura acumulados.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            {/* Tarjetas métricas personales */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              {/* Mis Evidencias */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-4 py-3 text-center min-w-[85px]">
                <span className="text-[11px] font-body text-eco-muted block">Mis Evidencias</span>
                <span className="font-heading font-black text-xl text-eco-text block mt-0.5">
                  {metrics.total}
                </span>
              </div>

              {/* Verificadas */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-4 py-3 text-center min-w-[85px]">
                <span className="text-[11px] font-body text-emerald-400 block flex items-center justify-center gap-1">
                  <ShieldCheck size={12} /> Verificadas
                </span>
                <span className="font-heading font-black text-xl text-emerald-400 block mt-0.5">
                  {metrics.verified}
                </span>
              </div>

              {/* Eco-Aura Acumulado */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-4 py-3 text-center min-w-[85px]">
                <span className="text-[11px] font-body text-eco-green block flex items-center justify-center gap-1">
                  <Sparkles size={12} /> Eco-Aura
                </span>
                <span className="font-heading font-black text-xl text-eco-green block mt-0.5">
                  +{metrics.myAuraSum}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Banner de Horarios Oficiales */}
      <SchoolScheduleBanner />

      {/* 3. Barra de Acción Única */}
      <div className="flex items-center justify-between p-4 bg-eco-card border border-eco-border rounded-2xl shadow-lg">
        <span className="text-xs font-heading font-bold text-eco-text">
          Tus evidencias documentadas ({filteredPosts.length})
        </span>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={openCreateModal}
          leftIcon={<Plus size={16} />}
        >
          Nueva Evidencia
        </Button>
      </div>

      {/* 4. Stream de Publicaciones Personales */}
      {loading ? (
        <div className="p-16 text-center bg-eco-card border border-eco-border rounded-3xl shadow-xl">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-eco-green/20 border-t-eco-green rounded-full animate-spin" />
            <span className="text-sm font-body text-eco-muted">
              Cargando tus publicaciones personales...
            </span>
          </div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-16 text-center bg-eco-card border border-eco-border rounded-3xl shadow-xl space-y-4">
          <div className="w-14 h-14 mx-auto p-3.5 bg-eco-bg text-eco-muted rounded-2xl border border-eco-border flex items-center justify-center">
            <FileText size={28} />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-heading font-bold text-base text-eco-text">
              Aún no has publicado evidencias ecológicas
            </h3>
            <p className="text-xs text-eco-muted font-body leading-relaxed">
              Documenta tus actividades de reciclaje, limpieza de talleres o mantenimiento de áreas verdes durante el horario escolar para ganar puntos de Eco-Aura.
            </p>
            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={openCreateModal}
                leftIcon={<Plus size={16} />}
              >
                Subir Primera Evidencia
              </Button>
            </div>
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

      {/* Modales */}
      <EvaluatePostModal
        isOpen={Boolean(selectedPostForEvaluate)}
        onClose={closeEvaluateModal}
        post={selectedPostForEvaluate}
        rubricCriteria={rubricCriteria}
        onSave={handleEvaluatePost}
        loading={actionLoading}
        currentAuthUser={currentAuthUser}
      />

      <PostDetailModal
        isOpen={Boolean(selectedPostForDetail)}
        onClose={closeDetailModal}
        post={selectedPostForDetail}
      />

      <PostCreateModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSave={handleCreatePost}
        loading={actionLoading}
      />

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

export default MyPostsPage
