import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const diagnostics = {
    time: new Date().toISOString(),
    node_version: process.version,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL,
      AUTH_SECRET: process.env.AUTH_SECRET ? "Configurada (OK)" : "No configurada (FAIL)",
      AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
    },
    database: "Desconocido"
  }

  try {
    // Prueba rápida de conexión
    await prisma.$queryRaw`SELECT 1`
    const users = await prisma.user.findMany({ select: { username: true, role: true } })
    diagnostics.database = {
      status: "Conectada correctamente",
      users: users
    } as any
  } catch (error: any) {
    diagnostics.database = `Error: ${error.message}`
  }

  return NextResponse.json(diagnostics)
}
