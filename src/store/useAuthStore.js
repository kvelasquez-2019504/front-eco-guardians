import { create } from 'zustand'

/**
 * Tienda de autenticación global (Zustand)
 * Gestiona el usuario activo, rol, nivel de Eco-Aura y función de logout.
 */
export const useAuthStore = create((set) => ({
  user: {
    uid: 'kinal-2026-001',
    name: 'Kenneth',
    lastName: 'Velásquez',
    role: 'STUDENT', // Roles posibles: 'ADMIN' | 'COORDINATOR' | 'TEACHER' | 'STUDENT'
    ecoAura: {
      points: 1250,
      level: 'GUARDIAN', // 'NOVATO' | 'GUARDIAN' | 'LEYENDA'
    },
  },

  // Acción para cambiar de rol interactivamente (ideal para pruebas y demos de RBAC)
  setRole: (newRole) =>
    set((state) => ({
      user: state.user ? { ...state.user, role: newRole } : null,
    })),

  // Acción para actualizar usuario
  setUser: (user) => set({ user }),

  // Cierre de sesión y limpieza de estado
  logout: () => {
    set({ user: null })
  },
}))

export default useAuthStore
