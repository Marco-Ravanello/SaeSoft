import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const diagnostics = {
    time: new Date().toISOString(),
    node_version: process.version,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? "Configurada" : "No configurada",
      AUTH_SECRET: process.env.AUTH_SECRET ? "Configurada" : "No configurada",
      AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
    },
    database: "Desconocido"
  }

  try {
    // Prueba rápida de conexión
    await prisma.$queryRaw`SELECT 1`
    diagnostics.database = "Conectada correctamente"
  } catch (error: any) {
    diagnostics.database = `Error: ${error.message}`
  }

  return NextResponse.json(diagnostics)
}
