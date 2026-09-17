/**
 * Validadores puros para el módulo de Publicaciones y Evidencias (Post)
 */

export const validatePostDescription = (description) => {
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return 'La descripción de la acción ecológica es obligatoria.'
  }
  const clean = description.trim()
  if (clean.length < 5) {
    return 'La descripción debe tener al menos 5 caracteres.'
  }
  if (clean.length > 500) {
    return 'La descripción no puede exceder los 500 caracteres.'
  }
  return true
}

export const validatePostImages = (images) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return 'Debes incluir al menos una fotografía de evidencia ecológica.'
  }
  if (images.length > 4) {
    return 'Solo puedes adjuntar un máximo de 4 fotografías de evidencia.'
  }

  const validImages = images.filter((img) => {
    if (!img) return false
    if (typeof File !== 'undefined' && img instanceof File) return true
    if (typeof Blob !== 'undefined' && img instanceof Blob) return true
    if (typeof img === 'string' && img.trim().length > 0) return true
    if (typeof img === 'object' && (img.url || img.file)) return true
    return false
  })

  if (validImages.length === 0) {
    return 'Debes incluir al menos una fotografía de evidencia ecológica válida.'
  }
  return true
}

export const validateEvaluationChecks = (checks) => {
  if (!checks || !Array.isArray(checks) || checks.length === 0) {
    return 'Debes evaluar al menos un criterio de la rúbrica oficial.'
  }
  for (const check of checks) {
    if (!check.criterionId || typeof check.criterionId !== 'string') {
      return 'Cada evaluación debe referenciar un criterio válido.'
    }
    if (typeof check.achieved !== 'boolean') {
      return 'Debes marcar si el criterio fue cumplido o no.'
    }
  }
  return true
}

export const validateEvaluationComment = (comment) => {
  if (!comment) return true
  if (typeof comment === 'string' && comment.trim().length > 300) {
    return 'El comentario no puede superar los 300 caracteres.'
  }
  return true
}
