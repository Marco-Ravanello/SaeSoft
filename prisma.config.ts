import { defineConfig } from "prisma/config";
import path from 'path';

// Para Prisma 7 migrations
const dbPath = path.resolve(process.cwd(), 'dev.db');
const dbUrl = `file:${dbPath}`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: dbUrl,
  },
});
