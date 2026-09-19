import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, ShieldAlert } from 'lucide-react'
import { H3 } from '../../atoms/Heading.jsx'
import { Button } from '../../atoms/Button.jsx'
import { TextField } from '../../molecules/TextField.jsx'
import { SelectField } from '../../molecules/SelectField.jsx'
import {
  validateEditName,
  validateEditLastName,
  validateEditPassword,
  validateEditRole,
} from '@/shared/validator/userValidators.js'

/**
 * Organismo: UserEditModal
 * Modal interactivo para actualizar información y roles de un usuario (PUT /user/:id).
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.user - Usuario seleccionado a editar
 * @param {Function} props.onSave - Callback al guardar (id, data)
 * @param {boolean} [props.loading=false] - Estado de guardado
 * @param {Object} props.currentAuthUser - Usuario autenticado en sesión
 * @param {Array<string>} [props.availableRoles=[]] - Lista de roles permitidos
 */
export const UserEditModal = ({
  isOpen,
  onClose,
  user,
  onSave,
  loading = false,
  currentAuthUser,
  availableRoles = [],
}) => {
  const isAdmin = currentAuthUser?.role === 'ADMIN'

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
      code: '',
      role: 'STUDENT',
      password: '',
    },
  })

  // Sincronizar formulario cada vez que se selecciona un usuario diferente
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        lastName: user.lastName || '',
        code: user.code || '',
        role: user.role || 'STUDENT',
        password: '',
      })
    }
  }, [user, reset])

  if (!isOpen || !user) return null

  const onSubmit = (formData) => {
    onSave(user.uid, formData)
  }

  const roleOptions = availableRoles.map((role) => ({
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
      aria-labelledby="edit-user-title"
    >
      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-lg bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Cabecera del Modal */}
        <div className="flex items-start justify-between gap-3 border-b border-eco-border/80 pb-4">
          <div>
            <H3 id="edit-user-title" variant="primary">
              Editar Usuario
            </H3>
            <p className="text-xs text-eco-muted font-body mt-0.5">
              Actualizando datos de: <span className="text-eco-text font-bold">{user.email}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Cerrar modal de edición"
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
              id="edit-name"
              label="Nombre"
              placeholder="Pepito"
              required
              error={errors.name?.message}
              {...register('name', { validate: validateEditName })}
            />

            <TextField
              id="edit-lastName"
              label="Apellido"
              placeholder="Atunio"
              required
              error={errors.lastName?.message}
              {...register('lastName', { validate: validateEditLastName })}
            />
          </div>

          {/* Fila 2: Código y Rol */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <TextField
              id="edit-code"
              label="Código / Carnet"
              placeholder="2026001"
              error={errors.code?.message}
              {...register('code')}
            />

            <SelectField
              id="edit-role"
              label="Rol del Usuario"
              options={roleOptions}
              disabled={!isAdmin}
              helperText={
                !isAdmin
                  ? 'Solo un Administrador puede cambiar roles'
                  : undefined
              }
              error={errors.role?.message}
              {...register('role', { validate: validateEditRole })}
            />
          </div>

          {/* Fila 3: Contraseña (Opcional) */}
          <TextField
            id="edit-password"
            type="password"
            label="Nueva Contraseña"
            placeholder="Dejar en blanco para no modificar"
            helperText="Opcional. Si se ingresa una contraseña, debe tener al menos 6 caracteres."
            error={errors.password?.message}
            {...register('password', { validate: validateEditPassword })}
          />

          {/* Advertencia de Permisos si no es Admin */}
          {!isAdmin && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-eco-cyan/10 border border-eco-cyan/20 text-eco-cyan text-xs font-body">
              <ShieldAlert size={16} className="shrink-0" />
              <span>Como Coordinador, puedes modificar los datos de estudiantes y docentes. El rol se conserva.</span>
            </div>
          )}

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
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserEditModal
