import type { Prisma, PrismaClient } from "./generated/prisma/client";

export async function longTask(prisma: Prisma.TransactionClient, time: number) {
  return prisma.$executeRaw<void>`select pg_sleep(${time})`;
}

export async function longTaskWithInteractiveTransaction(prisma: PrismaClient, time: number) {
  return prisma.$transaction(async (tx) => {
    await longTask(tx, time);
  });
}

export async function longTaskWithInteractiveTransaction2(prisma: PrismaClient, time: number) {
  return prisma.$transaction(async (hello) => {
    await hello.$executeRaw<void>`select pg_sleep(${time})`;
  });
}

export async function longTaskWithInteractiveTransaction3(yummy: PrismaClient, time: number) {
  return yummy.$transaction(async (hello) => {
    await hello.$executeRaw<void>`select pg_sleep(${time})`;
  });
}

export async function twoLongTaskWithInteractiveTransaction(prisma: PrismaClient, time: number) {
  return prisma.$transaction(async (tx) => {
    await longTask(tx, time);
    await longTask(tx, time);
  });
}

export async function longTaskInSequentialOperation(prisma: PrismaClient, time: number) {
  return prisma.$transaction([prisma.$executeRaw<void>`select pg_sleep(${time})`]);
}
