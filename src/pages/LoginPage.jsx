import { useState } from 'react'
import { toast } from 'sonner'
import { H1, H2 } from '../components/atoms/Heading.jsx'
import { Th } from '../components/atoms/Th.jsx'
import { Td } from '../components/atoms/Td.jsx'
import { Tr } from '../components/atoms/Tr.jsx'
import { TextField } from '../components/molecules/TextField.jsx'
import { SelectField } from '../components/molecules/SelectField.jsx'
import { CheckboxField } from '../components/molecules/CheckboxField.jsx'
import { Button } from '../components/atoms/Button.jsx'

export const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('student')

  const [sortField, setSortField] = useState('points')
  const [sortOrder, setSortOrder] = useState('desc')

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
    toast.info(`Ordenando tabla por ${field} (${sortOrder === 'desc' ? 'ascendente' : 'descendente'})`)
  }

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

      {/* Tarjeta de Demostración de Tabla (Átomos Th, Td y Tr) */}
      <div className="w-full max-w-2xl bg-eco-card border border-eco-border rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <H2 variant="primary">Tabla de Posiciones Kinal</H2>
            <p className="text-xs text-eco-muted font-body mt-0.5">
              Demostración atómica: <span className="text-eco-green font-semibold">Tr</span>, <span className="text-eco-green font-semibold">Th</span> y <span className="text-eco-green font-semibold">Td</span>
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-eco-green/15 text-eco-green font-bold">
            En Vivo
          </span>
        </div>

        {/* Tabla estructurada 100% con átomos */}
        <div className="overflow-hidden rounded-xl border border-eco-border">
          <table className="w-full border-collapse">
            <thead>
              <Tr variant="header">
                <Th align="center" className="w-16">Pos.</Th>
                <Th
                  align="left"
                  sortable
                  sortDirection={sortField === 'section' ? sortOrder : null}
                  onSort={() => handleSort('section')}
                >
                  Sección / Grado
                </Th>
                <Th align="center">⭐ Calificación</Th>
                <Th
                  align="right"
                  sortable
                  sortDirection={sortField === 'points' ? sortOrder : null}
                  onSort={() => handleSort('points')}
                >
                  Puntos Eco
                </Th>
              </Tr>
            </thead>
            <tbody className="divide-y divide-eco-border text-sm">
              {/* Fila 1: Resaltada como "Tu Sección" mediante isHighlighted */}
              <Tr
                isHighlighted
                isClickable
                onClick={() => toast.success('3ro Básico "B": ¡Líder actual del ranking!')}
              >
                <Td align="center" variant="star">🥇 1</Td>
                <Td align="left" variant="bold">
                  3ro Básico "B" <span className="ml-2 text-[10px] bg-eco-green/20 text-eco-green px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Tu Sección</span>
                </Td>
                <Td align="center" variant="star">4.9 / 5.0</Td>
                <Td align="right" variant="success">+850 pts</Td>
              </Tr>

              {/* Fila 2: Estándar con clic */}
              <Tr
                isClickable
                onClick={() => toast('Detalles de 1ro Básico "A"')}
              >
                <Td align="center" variant="muted">🥈 2</Td>
                <Td align="left" variant="bold">1ro Básico "A"</Td>
                <Td align="center" variant="star">4.7 / 5.0</Td>
                <Td align="right" variant="success">+720 pts</Td>
              </Tr>

              {/* Fila 3: Variante Focus (ej. Sección de turno hoy) */}
              <Tr
                variant="focus"
                isClickable
                onClick={() => toast.warning('2do Básico "B" está de turno hoy')}
              >
                <Td align="center" variant="focus">🥉 3</Td>
                <Td align="left" variant="bold">
                  2do Básico "B" <span className="ml-2 text-[10px] bg-eco-focus/20 text-eco-focus px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">De Turno</span>
                </Td>
                <Td align="center" variant="star">4.5 / 5.0</Td>
                <Td align="right" variant="success">+640 pts</Td>
              </Tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
