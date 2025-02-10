import { AccountDetail, Prisma, PrismaClient } from "@prisma/client";

import express from "express";

const app = express();
const port = 3000;

const prisma = new PrismaClient();

app.get("/", (_, res) => {
  res.send({ hello: "world" });
});

app.get("/ping", (_, res) => {
  res.send("pong");
});

/**
 * 트랜잭션을 적용하지 않은 경우
 */
app.post("/purchase1", async function (req, res) {
  const changeAmount = 1;
  const accountId = req.body["accountId"];
  const prevAccountDetail = await prisma.accountDetail.findFirst({
    where: { accountId },
    orderBy: { createdAt: Prisma.SortOrder.desc },
  });
  if (prevAccountDetail === null) {
    throw new Error("not found account detail");
  }

  const accountDetail = await prisma.accountDetail.create({
    data: {
      prevBalance: prevAccountDetail.newBalance,
      changeAmount: changeAmount,
      newBalance: prevAccountDetail.newBalance - changeAmount,
      accountId: accountId,
      prevAccountDetailId: prevAccountDetail.id,
    },
  });

  res.send(accountDetail);
});

/**
 * 기본 트랜잭션을 적용한 경우(postgres 의 경우 read committed 가 디폴트 격리 수준임)
 */
app.post("/purchase2", async function (req, res) {
  const changeAmount = 1;
  const accountId = req.body["accountId"];

  const accountDetail = await prisma.$transaction(
    async (tx) => {
      const prevAccountDetail = await tx.accountDetail.findFirst({
        where: { accountId },
        orderBy: { createdAt: Prisma.SortOrder.desc },
      });
      if (prevAccountDetail === null) {
        throw new Error("not found account detail");
      }

      if (prevAccountDetail.newBalance < changeAmount) {
        throw new Error("not enough balance");
      }

      return tx.accountDetail.create({
        data: {
          prevBalance: prevAccountDetail.newBalance,
          changeAmount: changeAmount,
          newBalance: prevAccountDetail.newBalance - changeAmount,
          accountId: accountId,
          prevAccountDetailId: prevAccountDetail.id,
        },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted }
  );

  res.send(accountDetail);
});

/**
 * REPEATABLE_READ 격리 수준을 적용한 경우
 */
app.post("/purchase3", async function (req, res) {
  const changeAmount = 1;
  const accountId = req.body["accountId"];

  const accountDetail = await prisma.$transaction(
    async (tx) => {
      const prevAccountDetail = await tx.accountDetail.findFirst({
        where: { accountId },
        orderBy: { createdAt: Prisma.SortOrder.desc },
      });
      if (prevAccountDetail === null) {
        throw new Error("not found account detail");
      }

      if (prevAccountDetail.newBalance < changeAmount) {
        throw new Error("not enough balance");
      }

      return tx.accountDetail.create({
        data: {
          prevBalance: prevAccountDetail.newBalance,
          changeAmount: changeAmount,
          newBalance: prevAccountDetail.newBalance - changeAmount,
          accountId: accountId,
          prevAccountDetailId: prevAccountDetail.id,
        },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead }
  );

  res.send(accountDetail);
});

/**
 * SERIALIZABLE 격리 수준을 적용한 경우
 */
app.post("/purchase4", async function (req, res) {
  const changeAmount = 1;
  const accountId = req.body["accountId"];

  const accountDetail = await prisma.$transaction(
    async (tx) => {
      const prevAccountDetail = await tx.accountDetail.findFirst({
        where: { accountId },
        orderBy: { createdAt: Prisma.SortOrder.desc },
      });
      if (prevAccountDetail === null) {
        throw new Error("not found account detail");
      }

      if (prevAccountDetail.newBalance < changeAmount) {
        throw new Error("not enough balance");
      }

      return tx.accountDetail.create({
        data: {
          prevBalance: prevAccountDetail.newBalance,
          changeAmount: changeAmount,
          newBalance: prevAccountDetail.newBalance - changeAmount,
          accountId: accountId,
          prevAccountDetailId: prevAccountDetail.id,
        },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );

  res.send(accountDetail);
});

/**
 * select for update 를 적용한 경우
 */
app.post("/purchase4", async function (req, res) {
  const changeAmount = 1;
  const accountId = req.body["accountId"];

  const accountDetail = await prisma.$transaction(
    async (tx) => {
      const prevAccountDetail = await tx.$queryRaw<AccountDetail | null>(
        Prisma.sql`
        select *
        from account_detail as ad
        where account_id = ${accountId}
        order by created_at desc
        limit 1
        for update;
        `
      );
      console.log(prevAccountDetail);
      // 타임아웃이 발생할 듯
      if (prevAccountDetail === null) {
        throw new Error("not found account detail");
      }

      if (prevAccountDetail.newBalance < changeAmount) {
        throw new Error("not enough balance");
      }

      return tx.accountDetail.create({
        data: {
          prevBalance: prevAccountDetail.newBalance,
          changeAmount: changeAmount,
          newBalance: prevAccountDetail.newBalance - changeAmount,
          accountId: accountId,
          prevAccountDetailId: prevAccountDetail.id,
        },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );

  res.send(accountDetail);
});

/**
 * select for update skip lock 를 적용한 경우
 */
app.post("/purchase4", async function (req, res) {
  const changeAmount = 1;
  const accountId = req.body["accountId"];

  const accountDetail = await prisma.$transaction(
    async (tx) => {
      const prevAccountDetail = await tx.$queryRaw<AccountDetail | null>(
        Prisma.sql`
        select *
        from account_detail as ad
        where account_id = ${accountId}
        order by created_at desc
        limit 1
        for update skip locked;
        `
      );
      console.log(prevAccountDetail);
      if (prevAccountDetail === null) {
        // 없거나 실행중일 수 있다.
        throw new Error("not found account detail");
      }

      if (prevAccountDetail.newBalance < changeAmount) {
        throw new Error("not enough balance");
      }

      return tx.accountDetail.create({
        data: {
          prevBalance: prevAccountDetail.newBalance,
          changeAmount: changeAmount,
          newBalance: prevAccountDetail.newBalance - changeAmount,
          accountId: accountId,
          prevAccountDetailId: prevAccountDetail.id,
        },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );

  res.send(accountDetail);
});

/**
 * redis 를 사용한 락이 있지만, 이거는 좀 공부를 하고 해야할 것 같다.
 */

// Run the server!
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
