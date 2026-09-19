import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, UserPlus } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { TextField } from '../../molecules/TextField.jsx'
import { SelectField } from '../../molecules/SelectField.jsx'
import {
  validateName,
  validateLastName,
  validateEmail,
  validatePassword,
} from '@/shared/validator/userValidators.js'

/**
 * Organismo: UserCreateModal
 * Modal administrativo para dar de alta nuevos usuarios en Eco-Guardianes (POST /user).
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSave - Callback al confirmar creación (formData)
 * @param {boolean} [props.loading=false] - Estado de guardado
 * @param {Object} props.currentAuthUser - Usuario autenticado en sesión
 * @param {Array<string>} [props.availableRoles=[]] - Lista de roles del sistema
 */
export const UserCreateModal = ({
  isOpen,
  onClose,
  onSave,
  loading = false,
  currentAuthUser,
  availableRoles = [],
}) => {
  const isCoordinator = currentAuthUser?.role === 'COORDINATOR'

  // Coordinador solo puede asignar roles STUDENT o TEACHER
  const selectableRoles = isCoordinator
    ? availableRoles.filter((r) => r === 'STUDENT' || r === 'TEACHER')
    : availableRoles

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      role: 'STUDENT',
      code: '',
    },
  })

  // Limpiar campos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        lastName: '',
        email: '',
        password: '',
        role: 'STUDENT',
        code: '',
      })
    }
  }, [isOpen, reset])

  if (!isOpen) return null

  const onSubmit = (formData) => {
    onSave(formData)
  }

  const roleOptions = selectableRoles.map((role) => ({
    value: role,
    label:
      role === 'ADMIN'
        ? 'Administrador'
        : role === 'COORDINATOR'
        ? 'Coordinador'
        : role === 'TEACHER'
        ? 'Docente'
        : role === 'STUDENT'
        ? 'Estudiante'
        : role,
  }))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-user-title"
    >
      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-lg bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Cabecera del Modal */}
        <div className="flex items-start justify-between gap-3 border-b border-eco-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-eco-green/15 text-eco-green border border-eco-green/30">
              <UserPlus size={20} />
            </div>
            <div>
              <H3 id="create-user-title" variant="primary">
                Crear Nuevo Usuario
              </H3>
              <p className="text-xs text-eco-muted font-body mt-0.5">
                Alta institucional de cuentas para el campus
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Cerrar modal de creación"
            className="p-1.5 rounded-lg text-eco-muted hover:text-eco-text hover:bg-eco-card-hover transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Fila 1: Nombre y Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <TextField
              id="create-name"
              label="Nombre"
              placeholder="Pepito"
              required
              error={errors.name?.message}
              {...register('name', { validate: validateName })}
            />

            <TextField
              id="create-lastName"
              label="Apellido"
              placeholder="Atunio"
              required
              error={errors.lastName?.message}
              {...register('lastName', { validate: validateLastName })}
            />
          </div>

          {/* Fila 2: Correo Electrónico */}
          <TextField
            id="create-email"
            type="email"
            label="Correo Institucional o Personal"
            placeholder="estudiante@kinal.edu.gt"
            required
            error={errors.email?.message}
            {...register('email', { validate: validateEmail })}
          />

          {/* Fila 3: Contraseña */}
          <TextField
            id="create-password"
            type="password"
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            required
            helperText="Se utilizará para el primer ingreso del usuario"
            error={errors.password?.message}
            {...register('password', { validate: validatePassword })}
          />

          {/* Fila 4: Rol y Código */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <SelectField
              id="create-role"
              label="Rol del Usuario"
              required
              options={roleOptions}
              error={errors.role?.message}
              {...register('role')}
            />

            <TextField
              id="create-code"
              label="Carnet o Código"
              placeholder="2026001 (Opcional)"
              error={errors.code?.message}
              {...register('code')}
            />
          </div>

          {/* Botones de Acción */}
          <div className="pt-3 border-t border-eco-border flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              size="md"
              disabled={loading}
              onClick={onClose}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
            >
              {loading ? 'Creando Usuario...' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserCreateModal
