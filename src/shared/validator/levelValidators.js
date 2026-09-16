import { LEVEL_STAGES } from '@/service/level.api.js'

/**
 * Validadores puros para el módulo de Niveles Educativos (Level)
 */

export const validateLevelName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'El nombre del nivel o grado es requerido.'
  }
  const trimmed = name.trim()
  if (trimmed.length < 3) {
    return 'El nombre debe contener al menos 3 caracteres.'
  }
  if (trimmed.length > 60) {
    return 'El nombre no puede exceder los 60 caracteres.'
  }
  return true
}

export const validateLevelStage = (stage) => {
  if (!stage) {
    return 'La etapa educativa es obligatoria.'
  }
  if (!LEVEL_STAGES.includes(stage)) {
    return `La etapa debe ser: ${LEVEL_STAGES.join(' o ')}.`
  }
  return true
}

export const validateGradeNumber = (gradeNumber) => {
  if (gradeNumber === undefined || gradeNumber === null || gradeNumber === '') {
    return 'El número de grado es requerido.'
  }
  const parsed = Number(gradeNumber)
  if (isNaN(parsed) || !Number.isInteger(parsed)) {
    return 'El número de grado debe ser un valor entero.'
  }
  if (parsed < 1 || parsed > 6) {
    return 'El grado debe encontrarse entre 1 y 6.'
  }
  return true
}

export const validateAllowedSections = (sections) => {
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return 'Debe habilitar al menos una sección para el grado.'
  }
  return true
}
