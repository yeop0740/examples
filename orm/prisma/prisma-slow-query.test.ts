import { PrismaClient } from "./generated/prisma";
import { longTask, longTaskInSequentialOperation, longTaskWithInteractiveTransaction, longTaskWithInteractiveTransaction2, longTaskWithInteractiveTransaction3, twoLongTaskWithInteractiveTransaction } from "./prisma-connection-pool";

describe("prisma 의 slow query 는", () => {
    // `maxWait` 2000ms, `timeout` 5000ms, `pool_timeout` 10000ms
    const prisma = new PrismaClient({
        datasourceUrl: "postgresql://postgres:1234@localhost:5432/postgres?schema=public&connection_limit=3",
        log: ["query", "info", "warn", "error"],
    });

    const transaction = new PrismaClient({
        datasourceUrl: "postgresql://postgres:1234@localhost:5432/postgres?schema=public&connection_limit=3",
        log: ["query", "info", "warn", "error"],
    })

  it("[test1-1] 명시적인 transaction api 를 이용하지 않은 하나의 트랜잭션에서 긴 실행 시간의 단일 쿼리의 경우 에러가 발생하지 않는다.", async () => {
    await longTask(prisma, 7); // `timeout` 값을 넘는 쿼리
  }, 1000000);

  it("[test1-2] 명시적이고 sequential 한 transaction api 를 이용한 하나의 트랜잭션에서 긴 실행 시간의 단일 쿼리의 경우 에러가 발생하지 않는다.", async () => {
    await longTaskInSequentialOperation(prisma, 7);
    // await expect(longTaskInSequentialOperation(prisma, 7)).rejects.toThrow('Transaction API error: Transaction already closed: A query cannot be executed on an expired transaction.');
  }, 1000000);

  it("[test1-3] 명시적이고 interactive 한 transaction api 를 이용한 하나의 트랜잭션에서 긴 실행 시간의 단일 쿼리의 경우 에러가 발생한다.", async () => {
    await expect(longTaskWithInteractiveTransaction(prisma, 7)).rejects.toThrow('Invalid `prisma.$executeRaw()` invocation:\n\n\nTransaction API error: Transaction already closed: A query cannot be executed on an expired transaction.');
  }, 1000000);

  it("[test1-4] 명시적이고 interactive 한 transaction api 를 이용한 하나의 트랜잭션에서 긴 실행 시간의 단일 쿼리의 경우 에러가 발생한다(transaction client variable 변경).", async () => {
    await expect(longTaskWithInteractiveTransaction2(prisma, 7)).rejects.toThrow('Invalid `prisma.$executeRaw()` invocation:\n\n\nTransaction API error: Transaction already closed: A query cannot be executed on an expired transaction.');
  }, 1000000);

  it("[test1-5] 명시적이고 interactive 한 transaction api 를 이용한 하나의 트랜잭션에서 긴 실행 시간의 단일 쿼리의 경우 에러가 발생한다(transaction client variable 변경).", async () => {
    await expect(longTaskWithInteractiveTransaction3(prisma, 7)).rejects.toThrow('Invalid `prisma.$executeRaw()` invocation:\n\n\nTransaction API error: Transaction already closed: A query cannot be executed on an expired transaction.');
  }, 1000000);

  it("[test1-6] 명시적이고 interactive 한 transaction api 를 이용한 하나의 트랜잭션에서 긴 실행 시간의 단일 쿼리의 경우 에러가 발생한다(transaction client variable 변경).", async () => {
    await expect(longTaskWithInteractiveTransaction3(transaction, 7)).rejects.toThrow('Invalid `prisma.$executeRaw()` invocation:\n\n\nTransaction API error: Transaction already closed: A query cannot be executed on an expired transaction.');
  }, 1000000);

  it("[test1-7] 명시적이고 sequential 한 transaction api 를 이용한 하나의 트랜잭션에서 긴 실행 시간의 두개의 쿼리가 수행되는 경우 에러가 발생하지 않는다.", async () => {
    console.time('[test1-7]');
    const task1 = prisma.$executeRaw<void>`select pg_sleep(7)`;
    const task2 = prisma.$executeRaw<void>`select pg_sleep(7)`;
    await prisma.$transaction([task1, task2]);
    console.timeEnd('[test1-7]');
  }, 1000000);

  it("[test1-8] interactive transaction api 내부에 각각은 타임아웃을 넘지 않지만, 합치면 타임아웃을 넘는 두 개의 쿼리를 포함하는 경우 에러가 발생한다.", async () => {
    await expect(twoLongTaskWithInteractiveTransaction(prisma, 3)).rejects.toThrow('Invalid `prisma.$executeRaw()` invocation:\n\n\nTransaction API error: Transaction already closed: A query cannot be executed on an expired transaction.');
  }, 1000000);

  it("[test1-9] 명시적인 transaction api 를 이용하지 않은 하나의 트랜잭션에서 긴 실행 시간의 단일 쿼리의 경우 에러가 발생하지 않는다.", async () => {
    await longTask(prisma, 12); // `pool_timeout` 값을 넘는 쿼리
  }, 1000000);
});
