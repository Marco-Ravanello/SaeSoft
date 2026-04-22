import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'
import { initEnv } from './env-init'

const prismaClientSingleton = () => {
  initEnv();
  const url = process.env.DATABASE_URL as string
  console.log(`[Prisma] ✅ Conectando con adapter simplificado a: ${url}`)

  try {
    const adapter = new PrismaLibSql({ url })
    return new PrismaClient({ adapter })
  } catch (error) {
    console.error("[Prisma] Falló la inicialización:", error)
    return new PrismaClient()
  }
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
