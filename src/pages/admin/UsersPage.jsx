import { Shield, UserCheck, UserX } from 'lucide-react'
import { useUsersAdmin } from '@/shared/hooks/useUsersAdmin.js'
import { H1 } from '@/components/atoms/Heading.jsx'
import { UserFilterBar } from '@/components/molecules/UserFilterBar.jsx'
import { UsersTable } from '@/components/organisms/user/UsersTable.jsx'
import { UserCreateModal } from '@/components/organisms/user/UserCreateModal.jsx'
import { UserEditModal } from '@/components/organisms/user/UserEditModal.jsx'
import { UserDeleteModal } from '@/components/organisms/user/UserDeleteModal.jsx'

/**
 * Página: UsersPage
 * Vista administrativa completa para gestión de usuarios (CRUD) en Eco-Guardianes.
 * Permite crear, listar, filtrar, editar y desactivar cuentas de usuario.
 * Ruta: /admin/users
 */
export const UsersPage = () => {
  const {
    users,
    rawUsers,
    total,
    loading,
    actionLoading,
    availableRoles,
    currentAuthUser,

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
  } = useUsersAdmin()

  // Conteo de métricas en la página actual
  const activeCount = rawUsers.filter((u) => u.status !== false).length
  const inactiveCount = rawUsers.filter((u) => u.status === false).length

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Encabezado de la página con métricas y botón de creación */}
      <div className="bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-cyan/15 text-eco-cyan text-xs font-bold mb-3 border border-eco-cyan/30">
              <Shield size={14} /> Módulo de Administración y Sistema
            </div>
            <H1 variant="gradient">Gestión de Usuarios</H1>
            <p className="text-xs sm:text-sm text-eco-muted font-body mt-1">
              Supervisión de credenciales, roles institucionales y estados de cuenta en Eco-Guardianes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            {/* Tarjetas métricas rápidas */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              {/* Total */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-4 py-3 min-w-[85px] text-center">
                <span className="text-[11px] font-body text-eco-muted block">Total</span>
                <span className="font-heading font-black text-xl text-eco-text">
                  {total}
                </span>
              </div>

              {/* Activos */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-4 py-3 min-w-[85px] text-center">
                <span className="text-[11px] font-body text-emerald-400 block flex items-center justify-center gap-1">
                  <UserCheck size={12} /> Activos
                </span>
                <span className="font-heading font-black text-xl text-emerald-400">
                  {activeCount}
                </span>
              </div>

              {/* Inactivos */}
              <div className="bg-eco-bg/80 border border-eco-border rounded-xl px-4 py-3 min-w-[85px] text-center">
                <span className="text-[11px] font-body text-rose-400 block flex items-center justify-center gap-1">
                  <UserX size={12} /> Inactivos
                </span>
                <span className="font-heading font-black text-xl text-rose-400">
                  {inactiveCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Barra de Filtros y Búsqueda */}
      <UserFilterBar
        roleFilter={roleFilter}
        onRoleFilterChange={handleRoleFilterChange}
        limit={limit}
        onLimitChange={handleLimitChange}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onRefresh={() => fetchUsers()}
        onCreateUser={openCreateModal}
        loading={loading}
        availableRoles={availableRoles}
      />

      {/* 3. Tabla Principal de Usuarios */}
      <UsersTable
        users={users}
        loading={loading}
        total={total}
        limit={limit}
        from={from}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        currentAuthUser={currentAuthUser}
      />

      {/* 4. Modal para Crear Usuario */}
      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSave={handleCreateUser}
        loading={actionLoading}
        currentAuthUser={currentAuthUser}
        availableRoles={availableRoles}
      />

      {/* 5. Modal para Editar Usuario */}
      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        user={selectedUser}
        onSave={handleUpdateUser}
        loading={actionLoading}
        currentAuthUser={currentAuthUser}
        availableRoles={availableRoles}
      />

      {/* 6. Modal para Desactivar Usuario */}
      <UserDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        user={selectedUser}
        onConfirm={handleDeleteUser}
        loading={actionLoading}
      />
    </div>
  )
}

export default UsersPage
