import { Checkbox } from '../atoms/Checkbox.jsx'

/**
 * Molécula: CheckboxField
 * Agrupa el átomo Checkbox con su etiqueta descriptiva, texto secundario y posibles mensajes de error.
 * 
 * @param {Object} props
 * @param {string} [props.id] - Identificador único que conecta la casilla con el texto
 * @param {string} [props.name] - Nombre del campo
 * @param {React.ReactNode} props.label - Texto de la casilla
 * @param {string} [props.description] - Texto explicativo secundario
 * @param {string} [props.error] - Mensaje de validación en caso de error
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {string} [props.className] - Clases adicionales
 */
export const CheckboxField = ({
  id,
  name,
  label,
  description,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  const inputId = id || name

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-3 ">
        <div className="pt-0.5">
          <Checkbox
            id={inputId}
            name={name}
            disabled={disabled}
            error={Boolean(error)}
            {...props}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor={inputId}
            className={`font-body text-sm select-none transition-colors ${
              disabled
                ? 'text-eco-muted/50 cursor-not-allowed'
                : 'text-eco-text cursor-pointer hover:text-white'
            }`}
          >
            {label}
          </label>

          {description && (
            <p className="text-xs text-eco-muted font-body mt-0.5 select-none leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 font-body flex items-center gap-1 pl-8" role="alert">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  )
}

export default CheckboxField
