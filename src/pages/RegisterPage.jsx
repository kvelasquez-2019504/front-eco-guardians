import { AuthLayout } from '@/components/templates/AuthLayout.jsx'
import { RegisterForm } from '@/components/organisms/RegisterForm.jsx'
import registerBg from '@/assets/bg-eco-guardianes-register.jpg'

/**
 * Página: RegisterPage
 * Vista de registro público con imagen de fondo institucional y organismo RegisterForm.
 */
export const RegisterPage = () => {
  return (
    <AuthLayout bgImage={registerBg}>
      <RegisterForm />
    </AuthLayout>
  )
}

export default RegisterPage
