import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

const adapter = new PrismaLibSql({ url: "file:./dev.db" })
const prisma = new PrismaClient({ adapter })
async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: hashedPassword
    },
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Admin SAE',
      role: 'ADMIN' as any,
    },
  })
}
main().then(() => prisma.$disconnect())
