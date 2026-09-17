/**
 * Validadores puros para el módulo de Turnos y Guardianes de la Semana (Turn)
 */

export const validateBimester = (bimester) => {
  if (bimester === undefined || bimester === null || String(bimester).trim() === '') {
    return 'El número de bimestre es obligatorio.'
  }
  const num = Number(bimester)
  if (!Number.isInteger(num) || num < 1 || num > 4) {
    return 'El bimestre debe ser un número entero entre 1 y 4.'
  }
  return true
}

export const validateWeekNumber = (weekNumber) => {
  if (weekNumber === undefined || weekNumber === null || String(weekNumber).trim() === '') {
    return 'El número de semana es obligatorio.'
  }
  const num = Number(weekNumber)
  if (!Number.isInteger(num) || num < 1 || num > 8) {
    return 'La semana debe ser un número entero entre 1 y 8.'
  }
  return true
}

export const validateStartDate = (startDate) => {
  if (!startDate || String(startDate).trim() === '') {
    return 'La fecha de inicio es obligatoria.'
  }
  const parsed = new Date(startDate)
  if (isNaN(parsed.getTime())) {
    return 'La fecha de inicio no tiene un formato de fecha válido.'
  }
  return true
}

export const validateEndDate = (endDate, startDate) => {
  if (!endDate || String(endDate).trim() === '') {
    return 'La fecha de finalización es obligatoria.'
  }
  const parsedEnd = new Date(endDate)
  if (isNaN(parsedEnd.getTime())) {
    return 'La fecha de finalización no tiene un formato de fecha válido.'
  }
  if (startDate) {
    const parsedStart = new Date(startDate)
    if (!isNaN(parsedStart.getTime()) && parsedEnd < parsedStart) {
      return 'La fecha de finalización no puede ser anterior a la fecha de inicio.'
    }
  }
  return true
}

export const validateBonusPoints = (points) => {
  if (points === undefined || points === null || String(points).trim() === '') {
    return 'El puntaje del bono es obligatorio.'
  }
  const num = Number(points)
  if (isNaN(num) || num < 1) {
    return 'El puntaje debe ser un valor numérico mayor o igual a 1.'
  }
  return true
}

export const validateBonusReason = (reason) => {
  if (!reason) return true
  if (typeof reason === 'string' && reason.trim().length > 300) {
    return 'La justificación del bono no puede exceder los 300 caracteres.'
  }
  return true
}

export const validateClassGroupId = (id) => {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return 'Debes seleccionar una clase o sección para otorgar el bono.'
  }
  const cleanId = id.trim()
  const mongoIdRegex = /^[0-9a-fA-F]{24}$/
  if (!mongoIdRegex.test(cleanId)) {
    return 'El identificador de la clase seleccionada no es un ObjectId válido.'
  }
  return true
}
