/**
 * Átomo: Checkbox
 * Control de casilla de verificación accesible con estilo visual personalizado para Eco-Guardianes.
 * 
 * @param {Object} props
 * @param {string} [props.id] - Identificador único
 * @param {string} [props.name] - Nombre del campo
 * @param {boolean} [props.checked] - Estado controlado
 * @param {boolean} [props.defaultChecked] - Estado no controlado inicial
 * @param {Function} [props.onChange] - Evento de cambio
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {boolean} [props.error=false] - Estado de error visual
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const Checkbox = ({
  id,
  name,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  error = false,
  className = '',
  ...props
}) => {
  return (
    <label
      htmlFor={id}
      className={`relative inline-flex items-center justify-center select-none ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      }`}
    >
      {/* Input nativo accesible para teclado (tecla espacio) y lectores de pantalla */}
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />

      {/* Casilla personalizada */}
      <div
        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200
          ${
            error
              ? 'border-red-500 bg-red-950/20'
              : 'border-eco-border bg-eco-bg/90 peer-hover:border-eco-green/60'
          }
          peer-checked:bg-eco-green peer-checked:border-eco-green
          peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:opacity-100
          peer-focus-visible:ring-2 peer-focus-visible:ring-eco-green/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-eco-card
          ${className}`}
      >
        {/* Ícono de Checkmark SVG */}
        <svg
          className="w-3.5 h-3.5 text-eco-bg stroke-[5] scale-0 opacity-0 transition-all duration-150 ease-out"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    </label>
  )
}

export default Checkbox
