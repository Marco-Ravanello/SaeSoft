export const translateStatus = (status: string) => {
  const translations: Record<string, string> = {
    PENDING: "Pendiente",
    APPROVED: "Aprobado",
    REJECTED: "Rechazado",
    SIGNED: "Firmado",
    DELIVERED: "Entregado",
  }
  return translations[status] || status
}

export const translateService = (service: string) => {
  const translations: Record<string, string> = {
    BREAKFAST_SNACK: "Desayuno y Merienda",
    LUNCH: "Comedor",
    NUTRITIONAL_REINFORCEMENT: "Refuerzo Nutricional",
    MESA_BOX: "Cajas MESA",
  }
  return translations[service] || service
}

export const translateSchoolType = (type: string) => {
  const translations: Record<string, string> = {
    JARDIN_MUNICIPAL: "Jardín Municipal",
    JARDIN_PROVINCIAL: "Jardín Provincial",
    PRIMARIA: "Primaria",
    SECUNDARIA: "Secundaria",
    DISPOSITIVO_TERRITORIAL: "Dispositivo Territorial",
    TALLER_PROTEGIDO: "Taller Protegido",
  }
  return translations[type] || type
}
