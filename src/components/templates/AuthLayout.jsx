/**
 * Plantilla: AuthLayout
 * Estructura de pantalla completa para vistas de autenticación (Login, Register).
 * Soporta imagen de fondo responsiva con superposición oscura (overlay) y desenfoque sutil
 * para preservar el contraste WCAG y la paleta Eco-Dark.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Organismo a renderizar (LoginForm, RegisterForm)
 * @param {string} [props.bgImage] - URL o import de la imagen de fondo
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const AuthLayout = ({ children, bgImage, className = '' }) => {
  return (
    <div
      className={`relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none bg-eco-bg ${className}`}
    >
      {/* 1. Capa de Imagen de Fondo */}
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 scale-105"
          style={{ backgroundImage: `url(${bgImage})` }}
          aria-hidden="true"
        >
          {/* 2. Capa de Superposición (Overlay) Eco-Dark para legibilidad y elegancia */}
          <div className="absolute inset-0 bg-gradient-to-b from-eco-bg/45 via-eco-bg/65 to-eco-bg/50 backdrop-blur-[2px]" />
        </div>
      )}

      {/* 3. Contenedor del Formulario (Z-index elevado) */}
      <div className="relative z-10 w-full flex justify-center py-6 animate-in fade-in zoom-in-95 duration-300">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
