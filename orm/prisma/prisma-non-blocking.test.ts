import { PrismaClient } from "./generated/prisma";

  const prisma = new PrismaClient({
    datasourceUrl:
      "postgresql://postgres:1234@localhost:5432/postgres?schema=public&connection_limit=3",
    transactionOptions: {
      maxWait: 2000, // 2초
      timeout: 5000, // 5초
    },
  });

it('transaction api 내부에서 connection_limit 개수를 초과하여 호출하는 경우', async () => {
    const tasks = []
    for (let i = 0; i < 100; i++) {
        tasks.push(prisma.$transaction(async tx => {await tx.$executeRaw`select pg_sleep(0.5)`}))
    }
    const results = await Promise.allSettled(tasks)
    console.log(results)

    // await prisma.$transaction(async tx => {
    //     const tasks = []
    //     for (let i = 0; i < 4; i++) {
    //         tasks.push(tx.$executeRaw`select pg_sleep(1);`);
    //     }
        
    //     const result = await Promise.allSettled(tasks);
    //     console.log(result)
    // })
}, 10000000)
