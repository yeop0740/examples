import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

const currencyNameIdMap = {
  ["별사탕"]: 0,
  ["건빵"]: 1,
};

export const prisma = new PrismaClient();

export async function createAccount(prisma: PrismaClient) {
  const accounts = await prisma.account.createManyAndReturn({
    data: [
      { type: currencyNameIdMap.별사탕 },
      { type: currencyNameIdMap.건빵 },
      { type: currencyNameIdMap.별사탕 },
      { type: currencyNameIdMap.건빵 },
      { type: currencyNameIdMap.별사탕 },
      { type: currencyNameIdMap.건빵 },
      { type: currencyNameIdMap.별사탕 },
      { type: currencyNameIdMap.건빵 },
      { type: currencyNameIdMap.별사탕 },
      { type: currencyNameIdMap.건빵 },
    ],
  });

  const accountDetailInput = accounts.map((account) => {
    return {
      prevBalance: 0,
      changeAmount: 0,
      newBalance: 0,
      accountId: account.id,
      prevAccountDetailId: null,
    };
  });

  await prisma.accountDetail.createMany({
    data: accountDetailInput,
  });
}

export async function deleteAll(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
    await deleteAccountDetail(tx);
    await deleteAccount(tx);
  });
}

async function deleteAccountDetail(
  prisma: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) {
  return prisma.accountDetail.deleteMany({});
}

async function deleteAccount(
  prisma: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) {
  return prisma.account.deleteMany({});
}

deleteAll(prisma)
  .then(() => console.log("data cleaned"))
  .catch((e) => {
    console.log("data deletion failed");
    console.log(e);
    process.exit(1);
  });

createAccount(prisma)
  .then(() => console.log("data injection success"))
  .catch((e) => {
    console.log("data injection failed");
    console.log(e);
    process.exit(1);
  });
