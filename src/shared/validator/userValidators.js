import { USER_ROLES } from '@/service/user.api.js'

/**
 * Validadores puros para autenticación y usuarios
 * Cumplen con las restricciones de la especificación técnica de la API.
 */

export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'El nombre es requerido y no puede contener solo espacios.'
  }
  const trimmed = name.trim()
  if (trimmed.length < 2 || trimmed.length > 50) {
    return 'El nombre debe tener entre 2 y 50 caracteres.'
  }
  const lettersOnlyRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/
  if (!lettersOnlyRegex.test(trimmed)) {
    return 'El nombre solo puede contener letras y espacios.'
  }
  return true
}

export const validateLastName = (lastName) => {
  if (!lastName || lastName.trim().length === 0) {
    return 'El apellido es requerido y no puede contener solo espacios.'
  }
  const trimmed = lastName.trim()
  if (trimmed.length < 2 || trimmed.length > 50) {
    return 'El apellido debe tener entre 2 y 50 caracteres.'
  }
  const lettersOnlyRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/
  if (!lettersOnlyRegex.test(trimmed)) {
    return 'El apellido solo puede contener letras y espacios.'
  }
  return true
}

export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return 'El correo electrónico es requerido.'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return 'Dirección de correo electrónico no es válida.'
  }
  return true
}

export const validatePassword = (password) => {
  if (!password) {
    return 'La contraseña es requerida.'
  }
  if (password.length < 6) {
    return 'La contraseña debe tener una longitud mínima de 6 caracteres.'
  }
  return true
}

export const validateLoginPassword = (password) => {
  if (!password || password.trim().length === 0) {
    return 'La contraseña es requerida.'
  }
  return true
}

export const validateConfirmPassword = (confirmPassword, originalPassword) => {
  if (!confirmPassword) {
    return 'Por favor confirma tu contraseña.'
  }
  if (confirmPassword !== originalPassword) {
    return 'Las contraseñas no coinciden.'
  }
  return true
}

/**
 * Validadores para edición administrativa de usuarios (PUT /user/:id)
 * Mantienen la misma coherencia de negocio y reglas que el alta de usuarios.
 */
export const validateEditName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'El nombre es requerido y no puede contener solo espacios.'
  }
  return validateName(name)
}

export const validateEditLastName = (lastName) => {
  if (!lastName || lastName.trim().length === 0) {
    return 'El apellido es requerido y no puede contener solo espacios.'
  }
  return validateLastName(lastName)
}

export const validateEditPassword = (password) => {
  if (!password || password.length === 0) return true
  if (password.length < 6) {
    return 'Si actualizas la contraseña, debe tener al menos 6 caracteres.'
  }
  return true
}

export const validateEditRole = (role) => {
  if (!role) return true
  if (!USER_ROLES.includes(role)) {
    return `El rol debe ser uno de: ${USER_ROLES.join(', ')}.`
  }
  return true
}
