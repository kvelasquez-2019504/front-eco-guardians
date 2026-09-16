import { AuthLayout } from '@/components/templates/AuthLayout.jsx'
import { LoginForm } from '@/components/organisms/LoginForm.jsx'
import loginBg from '@/assets/bg-eco-guardianes-login.jpg'

/**
 * Página: LoginPage
 * Vista de acceso público con imagen de fondo institucional y organismo LoginForm.
 */
export const LoginPage = () => {
  return (
    <AuthLayout bgImage={loginBg}>
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage
