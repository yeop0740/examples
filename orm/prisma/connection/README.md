# prisma orm 에 대한 다양한 테스트

## prisma-slow-query.test.ts

트랜잭션 내부에서의 타임아웃 관련 에러를 확인하는 테스트들을 작성했습니다.
아래의 에러와 동일한 에러를 찾는 것이 주요 목표입니다.

```shell
prisma:error
    Invalid `prisma.$executeRaw()` invocation:
    Transaction API error: Transaction already closed: A query cannot be executed on an expired transaction. The timeout for this transaction was 5000 ms, however 6023 ms passed since the start of the transaction. Consider increasing the interactive transaction timeout or doing less work in the transaction.
```

### 테스트 조건

- `maxWait` : 2000ms
- `timeout` : 5000ms
- `pool_timeout` : 10000ms
- `connection_limit` : 3

### test1-1

단순히 오래 걸리는 하나의 연산

```ts
export async function longTask(prisma: Prisma.TransactionClient, time: number) {
  return prisma.$executeRaw<void>`select pg_sleep(${time})`;
}

it("[test1-1]", async () => {
  await longTask(prisma, 7); // `timeout` 값을 넘는 쿼리
}, 1000000);
```

![테스트1-1](https://github.com/yeop0740/examples/blob/prisma-transaction-api/orm/prisma/connection/image/Pasted%20image%2020250621214432.png)

`timeout` 보다 더 오래 걸리는 쿼리를 단순히 하나 실행합니다. 에러는 발생하지 않습니다.

### 테스트 1 - 2

sequential operation 의 transaction api 를 사용한 경우

```ts
export async function longTaskInSequentialOperation(
  prisma: PrismaClient,
  time: number
) {
  return prisma.$transaction([
    prisma.$executeRaw<void>`select pg_sleep(${time})`,
  ]);
}

it("[test1-2]", async () => {
  await longTaskInSequentialOperation(prisma, 7);
}, 1000000);
```

![테스트1-2](https://github.com/yeop0740/examples/blob/prisma-transaction-api/orm/prisma/connection/image/Pasted%20image%2020250621214508.png)

테스트 1 - 1 과 동일한 상황입니다. 명시적으로 transaction api 를 사용한 점이 차이입니다. 이때 에러는 발생하지 않습니다.

### 테스트 1 - 3

interactive transaction api 를 사용한 경우

```ts
export async function longTaskWithInteractiveTransaction(
  prisma: PrismaClient,
  time: number
) {
  return prisma.$transaction(async (tx) => {
    await longTask(tx, time);
  });
}

it("[test1-3]", async () => {
  await expect(longTaskWithInteractiveTransaction(prisma, 7)).rejects.toThrow(
    "Invalid `prisma.$executeRaw()` invocation:\n\n\nTransaction API error: Transaction already closed: A query cannot be executed on an expired transaction."
  );
}, 1000000);
```

![테스트1-3](https://github.com/yeop0740/examples/blob/prisma-transaction-api/orm/prisma/connection/image/Pasted%20image%2020250621214547.png)

테스트 1 - 1, 1 - 2 와 동일한 상황이며, 명시적으로 interactive transaction api 를 사용한 점이 차이입니다. 이때 아래의 에러가 발생합니다. 실제 production 에서 발생한 에러와 거의 동일한 것을 알 수 있습니다.

테스트 1 - 4, 5, 6

```ts
export async function longTaskWithInteractiveTransaction2(
  prisma: PrismaClient,
  time: number
) {
  return prisma.$transaction(async (hello) => {
    await hello.$executeRaw<void>`select pg_sleep(${time})`;
  });
}

export async function longTaskWithInteractiveTransaction3(
  yummy: PrismaClient,
  time: number
) {
  return yummy.$transaction(async (hello) => {
    await hello.$executeRaw<void>`select pg_sleep(${time})`;
  });
}

it("[test1-4]", async () => {
  await expect(longTaskWithInteractiveTransaction2(prisma, 7)).rejects.toThrow(
    "Invalid `prisma.$executeRaw()` invocation:\n\n\nTransaction API error: Transaction already closed: A query cannot be executed on an expired transaction."
  );
}, 1000000);

it("[test1-5]).", async () => {
  await expect(longTaskWithInteractiveTransaction3(prisma, 7)).rejects.toThrow(
    "Invalid `prisma.$executeRaw()` invocation:\n\n\nTransaction API error: Transaction already closed: A query cannot be executed on an expired transaction."
  );
}, 1000000);

it("[test1-6]).", async () => {
  await expect(
    longTaskWithInteractiveTransaction3(transaction, 7)
  ).rejects.toThrow(
    "Invalid `prisma.$executeRaw()` invocation:\n\n\nTransaction API error: Transaction already closed: A query cannot be executed on an expired transaction."
  );
}, 1000000);
```

![테스트1-4](https://github.com/yeop0740/examples/blob/prisma-transaction-api/orm/prisma/connection/image/Pasted%20image%2020250621214633.png)

테스트 1 - 1, 1 - 2, 1 - 3 과 동일한 상황이며, interactive transaction api 에서 transaction client 를 참조하는 변수 명, prisma client 명을 변경하여 동일한 테스트를 수행해 보았습니다. 동일한 에러, 로그가 발생하는 것을 확인할 수 있습니다.

이를 통해 interactive transaction api 내부에서 호출되는 모든 쿼리들은 `prisma.~` 의 형태로 통일되게 표현된다는 것을 확인했습니다.

위의 에러가 발생하면 발생한 테이블과 interactive transaction api 가 사용된 곳을 확인하면 된다라는 것을 알 수 있습니다.

### 테스트 1 - 7

sequential operation 에 사용하는 transaction api 내에 두 개의 쿼리를 실행하는 경우

```ts
it("[test1-7]", async () => {
  console.time("[test1-7]");
  const task1 = prisma.$executeRaw<void>`select pg_sleep(7)`;
  const task2 = prisma.$executeRaw<void>`select pg_sleep(7)`;
  await prisma.$transaction([task1, task2]);
  console.timeEnd("[test1-7]");
}, 1000000);
```

혹시나 두 개의 쿼리가 두 개의 커넥션에서 병렬적으로 수행될 수 있다는 생각(트랜잭션이 보장되지 않는다는 의심)에 시간을 측정했을 때 두 연산이 순차적으로 진행(수행시간 \* 2) 되었음을 확인할 수 있습니다. 또한 에러는 발생하지 않음을 확인할 수 있었습니다.

### 테스트 1 - 8

interactive transaction api 내에 두 개의 쿼리를 실행하는 경우
각각의 쿼리는 3 초 동안 수행되어 timeout 을 넘지 않지만, 두 개의 쿼리가 모두 수행되면 timeout 을 넘습니다.

```ts
export async function twoLongTaskWithInteractiveTransaction(
  prisma: PrismaClient,
  time: number
) {
  return prisma.$transaction(async (tx) => {
    await longTask(tx, time);
    await longTask(tx, time);
  });
}

it("[test1-8]", async () => {
  await expect(
    twoLongTaskWithInteractiveTransaction(prisma, 3)
  ).rejects.toThrow(
    "Invalid `prisma.$executeRaw()` invocation:\n\n\nTransaction API error: Transaction already closed: A query cannot be executed on an expired transaction."
  );
}, 1000000);
```

### TODO

- [ ] sleep 쿼리를 사용하기 위해 native query 를 실행하는 api 를 사용했는데, 실제로 prisma 에서 제공하는 api 를 사용해도 동일한 에러가 발생 확인
- [ ] 롤백이 잘 수행되는지 확인 필요
