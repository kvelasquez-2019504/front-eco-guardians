import { Label } from '../atoms/Label.jsx'
import { Select } from '../atoms/Select.jsx'

/**
 * Molécula: SelectField
 * Combina Label (Átomo) + Select (Átomo) + Mensajes de ayuda o error.
 * 
 * @param {Object} props
 * @param {string} [props.label] - Texto de la etiqueta
 * @param {string} [props.id] - ID para asociar label con select
 * @param {string} [props.name] - Nombre del campo
 * @param {boolean} [props.required=false] - Si es obligatorio
 * @param {Array<{value: string|number, label: string}>} [props.options] - Opciones
 * @param {string} [props.placeholder] - Opción por defecto
 * @param {string} [props.error] - Mensaje de error
 * @param {string} [props.helperText] - Texto descriptivo
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {string} [props.className] - Clases para el contenedor
 */
export const SelectField = ({
  label,
  id,
  name,
  required = false,
  options,
  placeholder,
  error,
  helperText,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const selectId = id || name

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <Label htmlFor={selectId} required={required} disabled={disabled}>
          {label}
        </Label>
      )}

      <Select
        id={selectId}
        name={name}
        options={options}
        placeholder={placeholder}
        disabled={disabled}
        error={Boolean(error)}
        {...props}
      >
        {children}
      </Select>

      {error ? (
        <p className="text-xs text-red-400 font-body flex items-center gap-1 mt-0.5" role="alert">
          <span>⚠️</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-eco-muted font-body mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

export default SelectField
