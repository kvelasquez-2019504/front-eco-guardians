/**
 * Validadores puros para el módulo de Coordinaciones (Coordinator)
 */

export const validateCoordinatorSelection = (coordinatorId) => {
  if (!coordinatorId || coordinatorId.trim().length === 0) {
    return 'Debes seleccionar un coordinador académico.'
  }
  return true
}

export const validateAssignedLevelIds = (levelIds) => {
  if (!levelIds || !Array.isArray(levelIds) || levelIds.length === 0) {
    return 'Debes seleccionar al menos un nivel educativo para asignar.'
  }
  return true
}
