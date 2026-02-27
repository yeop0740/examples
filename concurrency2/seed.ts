import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

async function seeding() {
  const user = await prisma.user.create({
    data: {
      id: 'c2e36bd6-7424-4487-a82e-991c4a997231',
      email: 'test@gmail.com',
      password: '$2b$10$5d2DoICXTV55374PkhvfZ.dh15UFzLf3GsLmaLv54YxVNzRrigMt2',
    },
  });
}

seeding()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
