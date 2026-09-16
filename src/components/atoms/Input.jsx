/**
 * Átomo: Input
 * Campo de entrada de texto base accesible y estilizado con la paleta de Eco-Guardianes.
 * 
 * @param {Object} props
 * @param {string} [props.type='text'] - Tipo de input (text, password, email, number, etc.)
 * @param {string} [props.id] - Identificador único
 * @param {string} [props.name] - Nombre del campo
 * @param {boolean} [props.error=false] - Si está en estado de error (activa borde rojo)
 * @param {boolean} [props.disabled=false] - Si el campo está deshabilitado
 * @param {string} [props.className] - Clases de Tailwind adicionales
 */
export const Input = ({
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
  className = '',
  ...props
}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-2.5 rounded-xl font-body text-sm text-eco-text bg-eco-bg/90 border transition-all duration-200 outline-none
        placeholder:text-eco-muted/50
        ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-eco-border focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 hover:border-eco-border/80'
        }
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-eco-bg/40'
            : 'cursor-text'
        }
        ${className}`}
      {...props}
    />
  )
}

export default Input
