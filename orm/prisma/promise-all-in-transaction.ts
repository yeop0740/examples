import { PrismaClient } from "./generated/prisma/client";

const prisma = new PrismaClient();

async function findManyWithPromiseAllInTransaction() {
  await prisma.$transaction(async (tx) => {
    await Promise.all([tx.user.findMany(), tx.user.findMany()]); // 동일 TransactionClient 를 사용하여 같은 트랜잭션 에서 실행, 하지만 순차적으로 실행된다.
  });
}

async function findManyInTransactionSequential() {
  await prisma.$transaction([prisma.user.findMany(), prisma.user.findMany()]);
}

async function findManyInTransactionInteractively() {
  await prisma.$transaction(async (tx) => {
    await tx.user.findMany();
    await tx.user.findMany();
  });
}

findManyWithPromiseAllInTransaction()
  .then(() => console.log("done"))
  .catch(console.error);
