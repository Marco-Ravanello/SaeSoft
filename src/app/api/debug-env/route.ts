import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const testUser = searchParams.get("user")
  const testPass = searchParams.get("pass")

  const diagnostics: any = {
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
      users: users,
      authTest: "No ejecutado"
    }

    if (testUser && testPass) {
      const user = users.find(u => u.username === testUser)
      if (!user) {
        diagnostics.database.authTest = `Usuario '${testUser}' no encontrado`
      } else {
        const fullUser = await prisma.user.findUnique({ where: { username: testUser } })
        if (fullUser) {
          const match = await bcrypt.compare(testPass, fullUser.password)
          diagnostics.database.authTest = match ? "MATCH (Password Correcto)" : "FAIL (Password Incorrecto)"
        }
      }
    }
  } catch (error: any) {
    diagnostics.database = `Error: ${error.message}`
  }

  return NextResponse.json(diagnostics)
}
