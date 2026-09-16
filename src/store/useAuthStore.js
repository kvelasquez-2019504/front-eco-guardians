import { create } from 'zustand'

/**
 * Tienda de autenticación global (Zustand)
 * Gestiona el usuario activo, token JWT, estado del ciclo de vida de la sesión (status) y logout.
 */
const initialToken = localStorage.getItem('token')

export const useAuthStore = create((set) => ({
  user: null,
  token: initialToken || null,
  // 'checking': verificando sesión en arranque | 'authenticated': logueado | 'unauthenticated': no logueado
  status: initialToken ? 'checking' : 'unauthenticated',

  // Establecer sesión autenticada tras login o renovación exitosa
  setAuth: (user, token) => {
    if (token) {
      localStorage.setItem('token', token)
    }
    set({
      user,
      token: token || null,
      status: 'authenticated',
    })
  },

  // Marcar como no autenticado (sin sesión o token expirado)
  setUnauthenticated: () => {
    localStorage.removeItem('token')
    set({
      user: null,
      token: null,
      status: 'unauthenticated',
    })
  },

  // Acción para cambiar de rol interactivamente (para pruebas de simulador RBAC)
  setRole: (newRole) =>
    set((state) => ({
      user: state.user ? { ...state.user, role: newRole } : null,
    })),

  // Actualizar datos del usuario
  setUser: (user) => set({ user }),

  // Cierre de sesión voluntario
  logout: () => {
    localStorage.removeItem('token')
    set({
      user: null,
      token: null,
      status: 'unauthenticated',
    })
  },
}))

export default useAuthStore
