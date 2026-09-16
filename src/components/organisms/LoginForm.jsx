import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { useAuth } from '@/shared/hooks/useAuth.js'
import {
  validateEmail,
  validateLoginPassword,
} from '@/shared/validator/userValidators.js'
import { TextField } from '@/components/molecules/TextField.jsx'
import { CheckboxField } from '@/components/molecules/CheckboxField.jsx'
import { Button } from '@/components/atoms/Button.jsx'
import { H2 } from '@/components/atoms/Heading.jsx'

/**
 * Organismo: LoginForm
 * Formulario de inicio de sesión conectado al flujo: Form -> useAuth (Hook) -> auth.api -> useAuthStore
 * 
 * @param {Object} props
 * @param {Function} [props.onSuccess] - Callback opcional tras autenticarse
 */
export const LoginForm = ({ onSuccess }) => {
  const { loginUser, loading } = useAuth()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
  })

  const onSubmit = async (formData) => {
    // Enviamos estrictamente los campos del contrato del endpoint POST /auth/login
    const credentials = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    }

    const result = await loginUser(credentials)

    // Si el backend devuelve errores de express-validator (400), mapearlos a cada input
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
    <div className="w-full max-w-md bg-eco-card border border-eco-border rounded-2xl p-6 sm:p-8 space-y-6 select-none">
      {/* Encabezado del Login */}
      <div className="text-center space-y-1.5">
        <span className="text-3xl block" role="img" aria-label="Planta">🌿</span>
        <H2 variant="gradient" align="center">
          Iniciar Sesión
        </H2>
        <p className="text-xs sm:text-sm text-eco-muted font-body">
          Ingresa tus credenciales para acceder a Eco-Guardianes Kinal
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Correo Electrónico */}
        <TextField
          id="email"
          type="email"
          label="Correo Electrónico"
          placeholder="estudiante@kinal.edu.gt"
          required
          error={errors.email?.message}
          {...register('email', { validate: validateEmail })}
        />

        {/* Contraseña */}
        <TextField
          id="password"
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          required
          error={errors.password?.message}
          {...register('password', { validate: validateLoginPassword })}
        />

        {/* Opciones adicionales: Recordar y Recuperación */}
        <div className="flex items-center justify-between pt-1">
          <CheckboxField
            id="remember"
            label="Recordarme"
            {...register('remember')}
          />

          <span className="text-xs text-eco-muted hover:text-eco-text cursor-pointer transition-colors">
            ¿Olvidaste tu contraseña?
          </span>
        </div>

        {/* Botón de acceso */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={loading}
          >
            {loading ? 'Validando Credenciales...' : 'Entrar a Eco-Guardianes'}
          </Button>
        </div>

        {/* Enlace para registrarse */}
        <div className="text-center pt-2">
          <p className="text-xs text-eco-muted font-body">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-eco-green hover:underline font-bold">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
