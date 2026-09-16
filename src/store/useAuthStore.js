import { create } from 'zustand'

/**
 * Tienda de autenticación global (Zustand)
 * Gestiona el usuario activo, token JWT, rol, nivel de Eco-Aura y función de logout.
 */
export const useAuthStore = create((set) => ({
  user: {
    uid: 'kinal-2026-001',
    name: 'Pepito',
    lastName: 'Atunio',
    role: 'STUDENT', // Roles posibles: 'ADMIN' | 'COORDINATOR' | 'TEACHER' | 'STUDENT'
    ecoAura: {
      points: 1250,
      level: 'GUARDIAN', // 'NOVATO' | 'GUARDIAN' | 'LEYENDA'
    },
  },
  token: localStorage.getItem('token') || null,

  // Guardar sesión tras login exitoso
  setAuth: (user, token) => {
    if (token) {
      localStorage.setItem('token', token)
    }
    set({ user, token: token || null })
  },

  // Acción para cambiar de rol interactivamente (para pruebas de RBAC)
  setRole: (newRole) =>
    set((state) => ({
      user: state.user ? { ...state.user, role: newRole } : null,
    })),

  // Acción para actualizar datos de usuario
  setUser: (user) => set({ user }),

  // Cierre de sesión y limpieza de estado y almacenamiento local
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
}))

export default useAuthStore
