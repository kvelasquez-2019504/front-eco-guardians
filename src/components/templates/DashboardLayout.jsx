import { useState } from 'react'
import { Outlet } from 'react-router'
import { Menu } from 'lucide-react'
import { Sidebar } from '../organisms/Sidebar.jsx'

/**
 * Plantilla: DashboardLayout
 * Estructura de pantalla completa con Sidebar fijo en escritorio, drawer responsivo en móviles y contenedor <main> con <Outlet />.
 */
export const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-eco-bg text-eco-text">
      {/* 1. Sidebar Fijo para Escritorio (md en adelante) */}
      <div className="hidden md:flex shrink-0 h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* 2. Drawer Móvil con Backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Overlay oscuro de fondo */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Contenedor del Sidebar móvil */}
          <div className="relative z-10 w-64 h-full animate-in slide-in-from-left duration-200">
            <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. Columna Principal de Contenido */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Barra superior visible exclusivamente en móviles */}
        <header className="h-16 md:hidden flex items-center justify-between px-4 bg-eco-card border-b border-eco-border shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="Hoja">🌿</span>
            <span className="font-heading font-black text-lg text-eco-text">
              Eco-Guardianes
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menú de navegación"
            className="p-2 rounded-xl text-eco-muted hover:text-eco-text hover:bg-eco-card-hover border border-eco-border/60 transition-colors cursor-pointer"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Contenedor principal donde se inyectan las vistas de las rutas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
