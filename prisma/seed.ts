import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
const adapter = new PrismaLibSql({ url: "file:./dev.db" })
const prisma = new PrismaClient({ adapter })
async function main() {
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'admin123',
      name: 'Admin SAE',
      role: 'ADMIN' as any,
    },
  })
}
main().then(() => prisma.$disconnect())
