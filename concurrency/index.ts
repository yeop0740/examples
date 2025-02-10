import { Prisma, PrismaClient } from "@prisma/client";

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

// Run the server!
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
