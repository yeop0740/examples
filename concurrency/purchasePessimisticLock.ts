import { AccountDetail, Prisma, PrismaClient } from "@prisma/client";

export async function purchase(
  accountId: number,
  changeAmount: number,
  prisma: PrismaClient
) {
  await prisma.$transaction(
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
    { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted }
  );
}
