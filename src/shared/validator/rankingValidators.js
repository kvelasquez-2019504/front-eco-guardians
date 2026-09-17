/**
 * Validadores puros para el módulo de Rankings y Clasificaciones (Ranking)
 */

export const ALLOWED_STAGES = ['BASICO', 'DIVERSIFICADO']
export const ALLOWED_SHIFTS = ['MATUTINA', 'VESPERTINA']
export const ALLOWED_AURA_LEVELS = ['NOVATO', 'GUARDIAN', 'LEYENDA']

export const validateBimesterNumber = (bimester) => {
  if (bimester === undefined || bimester === null || String(bimester).trim() === '') {
    return 'El número de bimestre es obligatorio.'
  }
  const num = Number(bimester)
  if (!Number.isInteger(num) || num < 1 || num > 4) {
    return 'El bimestre debe ser un número entero entre 1 y 4.'
  }
  return true
}

export const validateBimesterParam = (bimester) => {
  if (bimester === undefined || bimester === null || String(bimester).trim() === '' || bimester === 'ALL') {
    return true
  }
  return validateBimesterNumber(bimester)
}

export const validateStageParam = (stage) => {
  if (!stage || stage === 'ALL') return true
  const clean = String(stage).trim().toUpperCase()
  if (!ALLOWED_STAGES.includes(clean)) {
    return `Etapa escolar inválida. Debe ser una de: ${ALLOWED_STAGES.join(', ')}.`
  }
  return true
}

export const validateShiftParam = (shift) => {
  if (!shift || shift === 'ALL') return true
  const clean = String(shift).trim().toUpperCase()
  if (!ALLOWED_SHIFTS.includes(clean)) {
    return `Jornada inválida. Debe ser una de: ${ALLOWED_SHIFTS.join(', ')}.`
  }
  return true
}

export const validateAuraLevelParam = (level) => {
  if (!level || level === 'ALL') return true
  const clean = String(level).trim().toUpperCase()
  if (!ALLOWED_AURA_LEVELS.includes(clean)) {
    return `Nivel Eco-Aura inválido. Debe ser uno de: ${ALLOWED_AURA_LEVELS.join(', ')}.`
  }
  return true
}

export const validateCloseBimesterNotes = (notes) => {
  if (!notes) return true
  if (typeof notes === 'string' && notes.trim().length > 500) {
    return 'Las observaciones no pueden exceder los 500 caracteres.'
  }
  return true
}
