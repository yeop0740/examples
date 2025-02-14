import { Prisma, PrismaClient } from "@prisma/client";
import { CreateAccountDetailEntity } from "./CreateAccountDetailEntity";
import { AccountDetail as DAccountDetail } from "./AccountDetail";

export async function purchase(
  accountId: number,
  changeAmount: number,
  prisma: PrismaClient
) {
  await prisma.$transaction(
    async (tx) => {
      const [prevAccountDetail] = await tx.$queryRaw<
        {
          id: number;
          created_at: Date;
          updated_at: Date;
          prev_account_detail_id: number;
          account_id: number;
          change_amount: number;
          new_balance: number;
          prev_balance: number;
        }[]
      >(
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

      const prevDetail = new DAccountDetail(
        prevAccountDetail.account_id,
        prevAccountDetail.new_balance,
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
