/**
 * Validadores puros para autenticación y usuarios
 * Cumplen con las restricciones de la especificación técnica de la API.
 */

export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'El nombre es requerido y no puede contener solo espacios.'
  }
  return true
}

export const validateLastName = (lastName) => {
  if (!lastName || lastName.trim().length === 0) {
    return 'El apellido es requerido y no puede contener solo espacios.'
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
