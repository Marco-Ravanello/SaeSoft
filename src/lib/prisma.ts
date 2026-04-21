import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const prismaClientSingleton = () => {
  let url = process.env.DATABASE_URL

  // Verificación robusta de la URL para evitar errores 'undefined' en strings
  if (!url || url === "undefined" || url === "file:undefined") {
    url = "file:./dev.db"
  }

  console.log(`[Prisma] Inicializando con DB: ${url}`)
  const libsql = createClient({ url })
  const adapter = new PrismaLibSql(libsql as any)
  return new PrismaClient({ adapter })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
