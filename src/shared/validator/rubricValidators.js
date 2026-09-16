/**
 * Validadores puros para el módulo de Rúbrica Oficial de Evaluación (Rubric)
 */

export const ALLOWED_RUBRIC_CATEGORIES = [
  'CLASIFICACION',
  'LIMPIEZA',
  'ORDEN',
  'GENERAL',
]

export const validateCriterionTitle = (title) => {
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return 'El título del criterio es obligatorio.'
  }
  const clean = title.trim()
  if (clean.length < 3) {
    return 'El título debe contener al menos 3 caracteres.'
  }
  if (clean.length > 100) {
    return 'El título no puede exceder los 100 caracteres.'
  }
  return true
}

export const validateCriterionPoints = (points) => {
  if (points === undefined || points === null || String(points).trim() === '') {
    return 'El puntaje otorgado por el criterio es obligatorio.'
  }
  const num = Number(points)
  if (isNaN(num) || num < 1) {
    return 'El puntaje debe ser un valor numérico mayor o igual a 1.'
  }
  return true
}

export const validateCriterionCategory = (category) => {
  if (!category) return true // El backend asume 'GENERAL' por defecto si se omite
  const clean = String(category).trim().toUpperCase()
  if (!ALLOWED_RUBRIC_CATEGORIES.includes(clean)) {
    return `Categoría inválida. Debe ser una de: ${ALLOWED_RUBRIC_CATEGORIES.join(', ')}.`
  }
  return true
}

export const validateCriterionOrder = (order) => {
  if (order === undefined || order === null || String(order).trim() === '') return true
  const num = Number(order)
  if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
    return 'El orden debe ser un número entero mayor o igual a 0.'
  }
  return true
}

export const validateCriterionDescription = (description) => {
  if (!description) return true
  if (typeof description === 'string' && description.trim().length > 350) {
    return 'La descripción no puede exceder los 350 caracteres.'
  }
  return true
}
