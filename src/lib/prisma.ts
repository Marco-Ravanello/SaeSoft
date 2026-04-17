import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const libsql = createClient({ url: "file:./dev.db" })
const adapter = new PrismaLibSql(libsql as any)
const prisma = new PrismaClient({ adapter })

export default prisma
