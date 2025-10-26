import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'error', 'warn'] });

async function clear() {
  await prisma.$executeRaw(Prisma.sql`set session_replication_role = replica;`);
  const tasks = Prisma.dmmf.datamodel.models.map(async (model) => {
    await prisma.$executeRaw(
      Prisma.sql`delete from ${Prisma.raw(model.dbName)};`,
    );
  });
  await Promise.allSettled(tasks);
}

clear()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
