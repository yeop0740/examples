import { Prisma, PrismaClient } from './generated/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'error', 'warn'] });

async function clear() {
  await prisma.$executeRaw(Prisma.sql`set session_replication_role = replica;`);
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
  await prisma.$executeRaw(Prisma.sql`set session_replication_role = origin;`);
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
