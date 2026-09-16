/**
 * Validadores puros para el módulo de Carreras Técnicas (Career)
 */

export const validateCareerName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'El nombre de la especialidad técnica es requerido.'
  }
  const trimmed = name.trim()
  if (trimmed.length < 3) {
    return 'El nombre debe contener al menos 3 caracteres.'
  }
  if (trimmed.length > 80) {
    return 'El nombre no puede exceder los 80 caracteres.'
  }
  return true
}

export const validateCareerDescription = (description) => {
  if (!description || description.trim().length === 0) {
    return true
  }
  if (description.trim().length > 350) {
    return 'La descripción no puede exceder los 350 caracteres.'
  }
  return true
}
