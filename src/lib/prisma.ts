import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import path from 'path'

const prismaClientSingleton = () => {
  let url = process.env.DATABASE_URL

  // Verificación extrema para evitar el error 'undefined' en entornos de túnel
  if (!url || String(url).includes("undefined") || String(url).trim() === "") {
    // En Google Colab, la ruta estándar es esta.
    url = "file:/content/SaeSoft3F/dev.db"
    console.log(`[Prisma] ⚠️ DATABASE_URL no válida. Usando fallback Colab: ${url}`)
  } else {
    // Limpiamos la URL de posibles caracteres invisibles o saltos de línea
    url = String(url).trim()
    console.log(`[Prisma] ✅ Conectando a: ${url}`)
  }

  try {
    const libsql = createClient({ url })
    const adapter = new PrismaLibSql(libsql as any)
    return new PrismaClient({ adapter })
  } catch (error) {
    console.error("[Prisma] Falló la inicialización:", error)
    // Último recurso: ruta relativa simple
    const fallback = createClient({ url: "file:dev.db" })
    return new PrismaClient({ adapter: new PrismaLibSql(fallback as any) })
  }
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
