const { PrismaLibSql } = require('@prisma/adapter-libsql');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const bcrypt = require('bcryptjs');

async function main() {
  const dbPath = path.resolve(process.cwd(), 'dev.db');
  const dbUrl = `file:${dbPath}`;

  console.log(`[Seed] 🌱 Cargando datos en: ${dbUrl}`);

  const adapter = new PrismaLibSql({ url: dbUrl });
  const prisma = new PrismaClient({ adapter });

  const adminPassword = await bcrypt.hash('admin123', 10);
  const staffPassword = await bcrypt.hash('staff123', 10);
  const providerPassword = await bcrypt.hash('proveedor123', 10);
  const schoolPassword = await bcrypt.hash('escuela123', 10);

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
  });

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
  });

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
  });

  const provider = await prisma.provider.upsert({
    where: { userId: providerUser.id },
    update: {},
    create: {
      name: 'Proveedor Logística S.A.',
      userId: providerUser.id,
    },
  });

  // 4. Schools of different types
  const schoolsData = [
    { username: 'jardin1', name: 'Jardín Municipal Nro 1', type: 'JARDIN_MUNICIPAL' },
    { username: 'escuela1', name: 'Escuela Primaria Nro 34', type: 'PRIMARIA' },
    { username: 'dispositivo1', name: 'Envión Nudo 1', type: 'DISPOSITIVO_TERRITORIAL' },
  ];

  for (const s of schoolsData) {
    const user = await prisma.user.upsert({
      where: { username: s.username },
      update: { password: schoolPassword },
      create: {
        username: s.username,
        password: schoolPassword,
        name: s.name,
        role: 'SCHOOL',
      },
    });

    const school = await prisma.school.upsert({
      where: { userId: user.id },
      update: { providerId: provider.id, type: s.type },
      create: {
        name: s.name,
        userId: user.id,
        providerId: provider.id,
        type: s.type,
      },
    });

    // Servicios base
    await prisma.schoolService.upsert({
      where: { schoolId_serviceType: { schoolId: school.id, serviceType: 'BREAKFAST_SNACK' } },
      update: { quota: 250 },
      create: { schoolId: school.id, serviceType: 'BREAKFAST_SNACK', quota: 250 }
    });

    if (s.type !== 'JARDIN_MUNICIPAL' && s.type !== 'DISPOSITIVO_TERRITORIAL') {
      await prisma.schoolService.upsert({
        where: { schoolId_serviceType: { schoolId: school.id, serviceType: 'MESA_BOX' } },
        update: { quota: 100 },
        create: { schoolId: school.id, serviceType: 'MESA_BOX', quota: 100 }
      });
    }
  }

  console.log('✅ Seed completed successfully');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Error en el seed:', e);
  process.exit(1);
});
