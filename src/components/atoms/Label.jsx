/**
 * Átomo: Label
 * Etiqueta accesible para campos de formulario y controles UI.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Texto o elementos dentro del label
 * @param {string} [props.htmlFor] - Identificador del input asociado
 * @param {boolean} [props.required] - Indica si el campo es obligatorio (muestra asterisco)
 * @param {'sm' | 'md' | 'lg'} [props.size] - Tamaño visual del texto
 * @param {boolean} [props.disabled] - Aplica estilo atenuado si el campo está deshabilitado
 * @param {string} [props.className] - Clases utilitarias de Tailwind adicionales
 */
export const Label = ({
  children,
  htmlFor,
  required = false,
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const selectedSize = sizes[size] || sizes.md

  return (
    <label
      htmlFor={htmlFor}
      className={`inline-flex items-center font-body font-medium tracking-wide transition-colors select-none ${selectedSize} ${
        disabled ? 'text-eco-muted/60 cursor-not-allowed' : 'text-eco-text cursor-pointer'
      } ${className}`}
      {...props}
    >
      <span>{children}</span>
      {required && (
        <span
          className="ml-1 text-eco-focus font-bold text-xs"
          title="Campo obligatorio"
          aria-hidden="true"
        >
          *
        </span>
      )}
    </label>
  )
}

export default Label
