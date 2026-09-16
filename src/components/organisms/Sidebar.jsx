import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { LogOut, X } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore.js'
import { navigationConfig } from '../../routes/navigation.config.js'
import { SidebarAccordionHeader } from '../molecules/SidebarAccordionHeader.jsx'
import { SidebarItem } from '../molecules/SidebarItem.jsx'
import { UserProfileCard } from '../molecules/UserProfileCard.jsx'
import { H3 } from '../atoms/Heading.jsx'

/**
 * Organismo: Sidebar
 * Barra de navegación lateral con filtrado estricto por roles (RBAC), acordeones colapsables y pie de usuario.
 * 
 * @param {Object} props
 * @param {Function} [props.onClose] - Callback para cerrar el sidebar en dispositivos móviles
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const Sidebar = ({ onClose, className = '' }) => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const currentRole = user?.role

  // 1. Filtrado Estricto por Roles (RBAC):
  // Solo se conservan grupos que tengan al menos 1 sub-item permitido para el rol del usuario.
  const filteredNavigation = useMemo(() => {
    return navigationConfig
      .filter((group) => group.allowedRoles.includes(currentRole))
      .map((group) => {
        const accessibleItems = group.items.filter((item) =>
          item.allowedRoles.includes(currentRole)
        )
        return {
          ...group,
          items: accessibleItems,
        }
      })
      // Requerimiento 1: Si un grupo se queda sin sub-items visibles, el grupo entero no se renderiza
      .filter((group) => group.items.length > 0)
  }, [currentRole])

  // 2. Estado de apertura/cierre de acordeones (inician todos expandidos para conveniencia de navegación)
  const [openGroups, setOpenGroups] = useState(() => {
    const initialState = {}
    navigationConfig.forEach((group) => {
      initialState[group.id] = true
    })
    return initialState
  })

  const toggleGroup = (groupId) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  const handleLogout = () => {
    logout()
    if (onClose) onClose()
    navigate('/')
  }

  return (
    <aside
      className={`
        w-64 h-full flex flex-col bg-eco-card border-r border-eco-border shadow-xl select-none
        ${className}
      `}
    >
      {/* Encabezado Institucional con Logotipo */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-eco-border shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-2xl shrink-0" role="img" aria-label="Hoja">🌿</span>
          <div className="min-w-0">
            <H3 variant="gradient" className="text-base sm:text-lg leading-tight truncate">
              Eco-Guardianes
            </H3>
            <span className="block text-[10px] font-body text-eco-muted uppercase tracking-widest truncate">
              Fundación Kinal
            </span>
          </div>
        </div>

        {/* Botón de cierre para pantallas móviles */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú lateral"
            className="md:hidden p-1.5 rounded-lg text-eco-muted hover:text-eco-text hover:bg-eco-card-hover transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navegación central scrolleable con acordeones */}
      <nav
        aria-label="Navegación principal"
        className="flex-1 overflow-y-auto px-3 py-4 space-y-3 custom-scrollbar"
      >
        {filteredNavigation.map((group) => {
          const isOpen = Boolean(openGroups[group.id])

          return (
            <div key={group.id} className="space-y-1">
              {/* Encabezado del grupo (Acordeón) */}
              <SidebarAccordionHeader
                title={group.title}
                icon={group.icon}
                isOpen={isOpen}
                onToggle={() => toggleGroup(group.id)}
              />

              {/* Sub-items del acordeón */}
              {isOpen && (
                <div className="pl-3.5 space-y-0.5 pt-0.5 border-l border-eco-border/40 ml-4.5">
                  {group.items.map((item) => (
                    <SidebarItem
                      key={item.id}
                      to={item.path}
                      label={item.label}
                      icon={item.icon}
                      onClick={onClose}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {filteredNavigation.length === 0 && (
          <div className="p-4 text-center text-xs text-eco-muted">
            No hay módulos disponibles para tu rol actual.
          </div>
        )}
      </nav>

      {/* Pie del Sidebar: Perfil de usuario y Cierre de Sesión */}
      <div className="p-3 border-t border-eco-border bg-eco-bg/40 space-y-2 shrink-0">
        <UserProfileCard user={user} />

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-heading font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut size={15} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
