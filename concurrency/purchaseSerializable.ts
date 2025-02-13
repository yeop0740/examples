import { Prisma, PrismaClient } from "@prisma/client";

export async function purchase(
  accountId: number,
  changeAmount: number,
  prisma: PrismaClient
) {
  await prisma.$transaction(
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
}
