import { Prisma, PrismaClient } from "@prisma/client";
import { AccountDetail } from "./AccountDetail";
import { CreateAccountDetailEntity } from "./CreateAccountDetailEntity";

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

  const prevDetail = new AccountDetail(
    prevAccountDetail.accountId,
    prevAccountDetail.newBalance,
    prevAccountDetail.id
  );
  const newDetail = prevDetail.use(changeAmount);

  const createEntity = CreateAccountDetailEntity.of(prevDetail, newDetail);
  await prisma.accountDetail.create({
    data: createEntity,
  });
}
