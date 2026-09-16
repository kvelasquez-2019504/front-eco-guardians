/**
 * Validadores puros para el módulo de Matrícula de Alumnos (Enrollment)
 */

export const validateClassGroupSelection = (classGroupId) => {
  if (!classGroupId || typeof classGroupId !== 'string' || classGroupId.trim().length === 0) {
    return 'Debes seleccionar una clase o sección escolar.'
  }
  return true
}

export const validateShiftSelection = (shift, coveredShifts = []) => {
  if (!shift || typeof shift !== 'string' || shift.trim().length === 0) {
    return 'Debes seleccionar la jornada escolar (Matutina o Vespertina).'
  }

  const normalized = shift.trim().toUpperCase()
  if (!['MATUTINA', 'VESPERTINA'].includes(normalized)) {
    return 'La jornada escolar solo puede ser MATUTINA o VESPERTINA.'
  }

  if (Array.isArray(coveredShifts) && coveredShifts.length > 0) {
    if (!coveredShifts.includes(normalized)) {
      return `La clase seleccionada no opera en la jornada ${normalized}. Jornadas disponibles: ${coveredShifts.join(', ')}.`
    }
  }

  return true
}

export const validateStudentsSelection = (studentIds) => {
  if (!studentIds) {
    return 'Debes seleccionar al menos un alumno para matricular.'
  }

  if (Array.isArray(studentIds)) {
    if (studentIds.length === 0) {
      return 'Debes seleccionar al menos un alumno para matricular.'
    }
  } else if (typeof studentIds === 'string' && studentIds.trim().length === 0) {
    return 'Debes seleccionar al menos un alumno para matricular.'
  }

  return true
}

export const validateAcademicYear = (year) => {
  if (!year) return true // Opcional
  const num = Number(year)
  if (isNaN(num) || num < 2020 || num > 2100) {
    return 'El ciclo escolar debe ser un año válido (ej. 2026).'
  }
  return true
}
