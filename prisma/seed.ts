import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'
import path from 'path'
import dotenv from 'dotenv'

// Cargar .env de forma explícita para scripts fuera de Next.js
dotenv.config()

// Forzamos ruta absoluta igual que en la app para evitar URL_INVALID
let dbUrl = process.env.DATABASE_URL
if (!dbUrl || String(dbUrl).includes("undefined") || String(dbUrl).trim() === "") {
  const dbPath = path.resolve(process.cwd(), 'dev.db')
  dbUrl = `file:${dbPath}`
}

console.log(`[Seed] 🌱 Iniciando carga de datos en: ${dbUrl}`)
const libsql = createClient({ url: dbUrl })
const adapter = new PrismaLibSql(libsql as any)
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const staffPassword = await bcrypt.hash('staff123', 10)
  const providerPassword = await bcrypt.hash('proveedor123', 10)
  const schoolPassword = await bcrypt.hash('escuela123', 10)

  // 1. Admin
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: adminPassword },
    create: {
      username: 'admin',
      password: adminPassword,
      name: 'Admin SAE',
      role: 'ADMIN',
    },
  })

  // 2. Staff
  await prisma.user.upsert({
    where: { username: 'staff' },
    update: { password: staffPassword },
    create: {
      username: 'staff',
      password: staffPassword,
      name: 'Administrativo SAE',
      role: 'STAFF',
    },
  })

  // 3. Provider
  const providerUser = await prisma.user.upsert({
    where: { username: 'proveedor1' },
    update: { password: providerPassword },
    create: {
      username: 'proveedor1',
      password: providerPassword,
      name: 'Proveedor Logística S.A.',
      role: 'PROVIDER',
    },
  })

  const provider = await prisma.provider.upsert({
    where: { userId: providerUser.id },
    update: {},
    create: {
      name: 'Proveedor Logística S.A.',
      userId: providerUser.id,
    },
  })

  // 4. School
  const schoolUser = await prisma.user.upsert({
    where: { username: 'escuela1' },
    update: { password: schoolPassword },
    create: {
      username: 'escuela1',
      password: schoolPassword,
      name: 'Escuela Nro 1 "D.F. Sarmiento"',
      role: 'SCHOOL',
    },
  })

  await prisma.school.upsert({
    where: { userId: schoolUser.id },
    update: { providerId: provider.id },
    create: {
      name: 'Escuela Nro 1 "D.F. Sarmiento"',
      userId: schoolUser.id,
      providerId: provider.id,
      services: {
        create: [
          { serviceType: 'BREAKFAST_SNACK', quota: 250 },
          { serviceType: 'LUNCH', quota: 180 },
        ]
      }
    },
  })

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
