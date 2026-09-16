import { useState } from 'react'
import { toast } from 'sonner'
import { H1, H2, H3 } from '../components/atoms/Heading.jsx'
import { TextField } from '../components/molecules/TextField.jsx'
import { SelectField } from '../components/molecules/SelectField.jsx'
import { CheckboxField } from '../components/molecules/CheckboxField.jsx'
import { Button } from '../components/atoms/Button.jsx'

export const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('student')

  const roleOptions = [
    { value: 'student', label: '🎓 Estudiante (Básicos)' },
    { value: 'teacher', label: '👨‍🏫 Docente Titular' },
    { value: 'supervisor', label: '📋 Encargado de Salón / TICs' },
    { value: 'maintenance', label: '🧹 Personal de Mantenimiento' },
  ]

  const sectionOptions = [
    { value: '1a', label: '1ro Básico - Sección A' },
    { value: '1b', label: '1ro Básico - Sección B' },
    { value: '2a', label: '2do Básico - Sección A' },
    { value: '2b', label: '2do Básico - Sección B' },
    { value: '3a', label: '3ro Básico - Sección A' },
    { value: '3b', label: '3ro Básico - Sección B' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      toast.success('¡Sesión iniciada correctamente en Eco-Guardianes! 🌿')
    }, 1200)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-eco-bg gap-8">
      {/* Tarjeta de Login principal */}
      <div className="w-full max-w-md bg-eco-card border border-eco-border rounded-2xl p-8 shadow-2xl">
        {/* Encabezado usando el Átomo H1 con variante Gradient */}
        <div className="text-center mb-6">
          <span className="text-4xl block mb-2">🌿</span>
          <H1 variant="gradient" align="center">
            Eco-Guardianes
          </H1>
          <p className="text-sm text-eco-muted font-body mt-1">
            Fundación Kinal • Clasificación y Gamificación
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectField
            id="role"
            name="role"
            label="Rol Institucional"
            options={roleOptions}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />

          {(role === 'student' || role === 'teacher') && (
            <SelectField
              id="section"
              name="section"
              label="Grado y Sección"
              options={sectionOptions}
              defaultValue="3b"
              helperText="Determina la rotación de tus turnos semanales"
              required
            />
          )}

          <TextField
            id="carnet"
            name="carnet"
            label="Carnet o Correo Kinal"
            placeholder="ej. 2026123"
            required
          />

          <TextField
            id="password"
            name="password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            required
          />

          <CheckboxField
            id="remember"
            name="remember"
            label="Mantener sesión iniciada"
            defaultChecked
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={loading}
          >
            {loading ? 'Accediendo...' : 'Entrar a Eco-Guardianes'}
          </Button>
        </form>
      </div>

      {/* Tarjeta de Demostración de Encabezados (H1, H2, H3) */}
      <div className="w-full max-w-md bg-eco-card/50 border border-eco-border/80 rounded-2xl p-6 space-y-4">
        <span className="text-xs font-semibold text-eco-cyan uppercase tracking-wider block">
          Átomo: Heading (Demostración de Jerarquía)
        </span>

        <div className="space-y-3 pt-2">
          <div>
            <span className="text-xs text-eco-muted font-mono block mb-1">H1 (level=1, variant="gradient"):</span>
            <H1 variant="gradient">Guardianes de Turno</H1>
          </div>

          <div>
            <span className="text-xs text-eco-muted font-mono block mb-1">H2 (level=2, variant="primary"):</span>
            <H2 variant="primary">Tabla de Posiciones Kinal</H2>
          </div>

          <div>
            <span className="text-xs text-eco-muted font-mono block mb-1">H3 (level=3, variant="focus"):</span>
            <H3 variant="focus">Área de Basureros Central (⭐ 5.0)</H3>
          </div>

          <div>
            <span className="text-xs text-eco-muted font-mono block mb-1">H3 (level=3, variant="default"):</span>
            <H3>3ro Básico - Sección "B"</H3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
