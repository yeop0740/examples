import { AccountDetail, Prisma, PrismaClient } from "@prisma/client";
import { CreateAccountDetailEntity } from "./CreateAccountDetailEntity";
import { AccountDetail as DAccountDetail } from "./AccountDetail";

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
        for update skip locked;
        `
      );
      if (prevAccountDetail === null) {
        // 없거나 실행중일 수 있다.
        throw new Error("not found account detail");
      }

      const prevDetail = new DAccountDetail(
        prevAccountDetail.accountId,
        prevAccountDetail.newBalance,
        prevAccountDetail.id
      );
      const newDetail = prevDetail.use(changeAmount);

      const createEntity = CreateAccountDetailEntity.of(prevDetail, newDetail);
      return tx.accountDetail.create({
        data: createEntity,
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted }
  );
}
