import { Prisma } from "./generated/prisma/client";

export async function longTask(prisma: Prisma.TransactionClient, time: number) {
  return prisma.$executeRaw<void>`select pg_sleep(${time})`;
}
