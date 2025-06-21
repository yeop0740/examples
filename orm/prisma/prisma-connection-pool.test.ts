import { PrismaClient } from "./generated/prisma";
import { longTask } from "./prisma-connection-pool";

describe("prisma 의 connection pool 은", () => {
  const prisma = new PrismaClient({
    datasourceUrl:
      "postgresql://postgres:1234@localhost:5432/postgres?schema=public&connection_limit=3",
    transactionOptions: {
      maxWait: 2000, // 2초
      timeout: 5000, // 5초
    },
  });

  afterAll(() => {
    prisma.$disconnect();
  });

  it("[test0] 단순 라운드 트립 테스트", async () => {
    console.time("test start");
    const result = await prisma.$queryRaw`select 1`;
    console.timeEnd("test start"); // 0.03 초 근방
    console.log(result);
  });

  it("[test1] 동일 스레드(요청) 내에서 await 는 블락된다.", async () => {
    console.time("test start");
    for (let i = 0; i < 3; i++) {
      await longTask(prisma, 1);
    }
    // 3초 언저리를 기록할 것으로 예상
    console.timeEnd("test start");
  });

  it("[test2] 동일 스레드(요청) 내에서 멀티 스레드처럼 행동할 수 있다.", async () => {
    console.time("test start");
    const tasks = new Array<unknown>();
    for (let i = 0; i < 3; i++) {
      tasks.push(longTask(prisma, 1));
    }
    await Promise.all(tasks); // 모든 작업이 fulfilled 되지 않으면 에러 발생
    // 1 ~ 2초 언저리를 기록할 것으로 예상
    console.timeEnd("test start");
  });

  it("connection_pool_timeout 은 기본값이 10초 이다.", async () => {
    const tasks = new Array<unknown>();

    for (let i = 0; i < 20; i++) {
      const task = longTask(prisma, 6);
      tasks.push(task);
    }

    const results = await Promise.allSettled(tasks);
    // console.log(results);
  }, 1000000);

  it("transaction api 를 이용한 것에만 transactionOptions.timeout 값이 적용된다.", async () => {
    const task = prisma.$transaction(async (tx) => {
      return longTask(tx, 7);
    });
    const result = await Promise.allSettled([task]);
    // console.log(result);
  }, 1000000);

  it("transaction api 를 이용하지 않은 것에 transactionOptions.timeout 값이 적용되지 않는다.", async () => {
    const task = longTask(prisma, 7);
    const result = await Promise.allSettled([task]);
    // console.log(result);
  }, 1000000);
});
