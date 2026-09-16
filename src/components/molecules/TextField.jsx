import { Label } from '../atoms/Label.jsx'
import { Input } from '../atoms/Input.jsx'

/**
 * Molécula: TextField
 * Componente compuesto que integra Label (átomo) + Input (átomo) + Helper / Error text.
 * 
 * @param {Object} props
 * @param {string} [props.label] - Texto de la etiqueta
 * @param {string} [props.id] - ID para asociar label con input
 * @param {string} [props.name] - Nombre del campo
 * @param {string} [props.type='text'] - Tipo de entrada
 * @param {boolean} [props.required=false] - Si es obligatorio (muestra asterisco en Label)
 * @param {string} [props.error] - Mensaje de error de validación
 * @param {string} [props.helperText] - Texto descriptivo o de ayuda debajo del campo
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {string} [props.className] - Clases para el contenedor general
 */
export const TextField = ({
  label,
  id,
  name,
  type = 'text',
  required = false,
  error,
  helperText,
  disabled = false,
  className = '',
  ...props
}) => {
  const inputId = id || name

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <Label htmlFor={inputId} required={required} disabled={disabled}>
          {label}
        </Label>
      )}

      <Input
        id={inputId}
        name={name}
        type={type}
        disabled={disabled}
        error={Boolean(error)}
        {...props}
      />

      {error ? (
        <p className="text-sm text-red-400 font-body flex items-center gap-1 mt-0.5" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-sm text-eco-muted font-body mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

export default TextField
