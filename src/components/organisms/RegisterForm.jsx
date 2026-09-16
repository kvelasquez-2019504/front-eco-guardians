import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { useUser } from '@/shared/hooks/useUser.js'
import {
  validateName,
  validateLastName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '@/shared/validator/userValidators.js'
import { TextField } from '@/components/molecules/TextField.jsx'
import { Button } from '@/components/atoms/Button.jsx'
import { H2 } from '@/components/atoms/Heading.jsx'

/**
 * Organismo: RegisterForm
 * Formulario público de registro con validación de contraseña y confirmación.
 * 
 * @param {Object} props
 * @param {Function} [props.onSuccess] - Callback opcional al completar el registro
 */
export const RegisterForm = ({ onSuccess }) => {
  const { register: registerUser, loading } = useUser()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      code: '',
    },
  })

  const onSubmit = async (formData) => {
    // Construimos el payload enviando únicamente los campos que el backend espera
    const payload = {
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      code: formData.code,
    }

    const result = await registerUser(payload)

    // Vincular errores del backend (express-validator) si existieran
    if (!result.success && Array.isArray(result.errorData)) {
      result.errorData.forEach((err) => {
        if (err.path) {
          setError(err.path, {
            type: 'server',
            message: err.msg,
          })
        }
      })
    } else if (result.success && onSuccess) {
      onSuccess(result.data)
    }
  }

  return (
    <div className="w-full max-w-lg bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 select-none">
      {/* Encabezado del Formulario */}
      <div className="text-center space-y-1.5">
        <span className="text-3xl block" role="img" aria-label="Semilla">🌱</span>
        <H2 variant="gradient" align="center">
          Crear Cuenta de Eco-Guardián
        </H2>
        <p className="text-xs sm:text-sm text-eco-muted font-body">
          Regístrate como estudiante para sumarte a la clasificación de residuos en Kinal
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Fila 1: Nombre y Apellido (Obligatorios) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            id="name"
            label="Nombre"
            placeholder="Pepito"
            required
            error={errors.name?.message}
            {...register('name', { validate: validateName })}
          />

          <TextField
            id="lastName"
            label="Apellido"
            placeholder="Atunio"
            required
            error={errors.lastName?.message}
            {...register('lastName', { validate: validateLastName })}
          />
        </div>

        {/* Fila 2: Correo Electrónico (Obligatorio, formato válido) */}
        <TextField
          id="email"
          type="email"
          label="Correo Institucional o Personal"
          placeholder="estudiante@kinal.edu.gt"
          required
          helperText="Se utilizará para tus credenciales y notificaciones"
          error={errors.email?.message}
          {...register('email', { validate: validateEmail })}
        />

        {/* Fila 3: Contraseña y Confirmar Contraseña (Obligatorios) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            id="password"
            type="password"
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            required
            error={errors.password?.message}
            {...register('password', { validate: validatePassword })}
          />

          <TextField
            id="confirmPassword"
            type="password"
            label="Confirmar Contraseña"
            placeholder="Repite tu contraseña"
            required
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              validate: (value, formValues) =>
                validateConfirmPassword(value, formValues.password),
            })}
          />
        </div>

        {/* Fila 4: Código / Carnet Estudiantil (Opcional) */}
        <TextField
          id="code"
          label="Carnet o Código Estudiantil"
          placeholder="2026001 (Opcional)"
          helperText="Si lo dejas en blanco, el sistema lo omitirá"
          error={errors.code?.message}
          {...register('code')}
        />

        {/* Botón de envío */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={loading}
          >
            {loading ? 'Registrando Usuario...' : 'Registrarme en Eco-Guardianes'}
          </Button>
        </div>

        {/* Enlace para volver a Iniciar Sesión */}
        <div className="text-center pt-2">
          <p className="text-xs text-eco-muted font-body">
            ¿Ya tienes una cuenta registrada?{' '}
            <Link to="/login" className="text-eco-green hover:underline font-bold">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm
