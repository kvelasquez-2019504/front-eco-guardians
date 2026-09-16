/**
 * Validadores puros para el módulo de Clases y Secciones (Class)
 */

export const validateClassLevel = (levelId) => {
  if (!levelId || typeof levelId !== 'string' || levelId.trim().length === 0) {
    return 'Debes seleccionar un nivel educativo.'
  }
  return true
}

export const validateClassSection = (section, allowedSections = []) => {
  if (!section || typeof section !== 'string' || section.trim().length === 0) {
    return 'Debes seleccionar una sección para la clase.'
  }

  if (Array.isArray(allowedSections) && allowedSections.length > 0) {
    if (!allowedSections.includes(section.trim().toUpperCase())) {
      return `La sección "${section}" no está permitida para este nivel escolar.`
    }
  }

  return true
}

export const validateClassCareer = (careerId, stage) => {
  if (stage === 'DIVERSIFICADO') {
    if (!careerId || typeof careerId !== 'string' || careerId.trim().length === 0) {
      return 'Debes seleccionar una especialidad técnica obligatoria para Diversificado.'
    }
  }
  return true
}

export const validateTeacherAssignment = (teacherId) => {
  if (!teacherId || typeof teacherId !== 'string' || teacherId.trim().length === 0) {
    return 'Debes seleccionar un docente activo.'
  }
  return true
}

export const validateAcademicYear = (year) => {
  if (!year) return true // Opcional, backend usa por defecto 2026
  const numYear = Number(year)
  if (isNaN(numYear) || numYear < 2020 || numYear > 2100) {
    return 'El ciclo escolar debe ser un año lectivo válido (ejemplo: 2026).'
  }
  return true
}
