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
    LUNCH: "Comedor (Almuerzo)",
    MESA_BOX: "Cajas MESA",
  }
  return translations[service] || service
}
