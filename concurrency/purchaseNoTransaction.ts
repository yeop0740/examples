import { Prisma, PrismaClient } from "@prisma/client";

export async function purchase(
  accountId: number,
  changeAmount: number,
  prisma: PrismaClient
) {
  const prevAccountDetail = await prisma.accountDetail.findFirst({
    where: { accountId },
    orderBy: { createdAt: Prisma.SortOrder.desc },
  });
  if (prevAccountDetail === null) {
    throw new Error("not found account detail");
  }

  await prisma.accountDetail.create({
    data: {
      prevBalance: prevAccountDetail.newBalance,
      changeAmount: changeAmount,
      newBalance: prevAccountDetail.newBalance - changeAmount,
      accountId: accountId,
      prevAccountDetailId: prevAccountDetail.id,
    },
  });
}
