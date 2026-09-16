/**
 * Átomo: Select
 * Menú desplegable nativo accesible con icono de flecha personalizado y estilo Eco-Dark.
 * 
 * @param {Object} props
 * @param {Array<{value: string|number, label: string, disabled?: boolean}>} [props.options] - Lista de opciones
 * @param {React.ReactNode} [props.children] - Opciones manuales <option> si no se usa props.options
 * @param {string} [props.placeholder] - Texto por defecto no seleccionable
 * @param {string} [props.id] - Identificador único
 * @param {string} [props.name] - Nombre del campo
 * @param {boolean} [props.error=false] - Si está en estado de error
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const Select = ({
  options,
  children,
  placeholder,
  id,
  name,
  value,
  defaultValue,
  onChange,
  disabled = false,
  error = false,
  className = '',
  ...props
}) => {
  return (
    <div className="relative w-full">
      <select
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        className={`w-full appearance-none px-4 py-2.5 pr-10 rounded-xl font-body text-sm text-eco-text bg-eco-bg/90 border transition-all duration-200 outline-none
          ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-eco-border focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 hover:border-eco-border/80'
          }
          ${
            disabled
              ? 'opacity-50 cursor-not-allowed bg-eco-bg/40'
              : 'cursor-pointer'
          }
          ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled className="bg-eco-card text-eco-muted">
            {placeholder}
          </option>
        )}

        {options
          ? options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-eco-card text-eco-text py-1.5"
              >
                {opt.label}
              </option>
            ))
          : children}
      </select>

      {/* Ícono de flecha hacia abajo (Chevron) */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-eco-muted">
        <svg
          className="w-4 h-4 stroke-[2.5]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  )
}

export default Select
