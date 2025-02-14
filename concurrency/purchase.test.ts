import { Prisma, PrismaClient } from "@prisma/client";
import { CreateAccountDetailEntity } from "./CreateAccountDetailEntity";
import { CreateAccountEntity } from "./CreateAccountEntity";
import { purchase as purchaseNoTransaction } from "./purchaseNoTransaction";

describe("purchaseNoTransaction 은", () => {
  const prisma = new PrismaClient();

  it("한 번의 구매에 대해서 처음 금액에서 사용한 만큼 감소시킨 양이 account detail 에 저장된다.", async () => {
    // given
    const initBalance = 100;
    const changeAmount = 10;
    // type 이 1인 계좌 생성(currency 의 한 종류라고 생각)
    const newAccountEntity = new CreateAccountEntity(1);
    const createdAccount = await prisma.account.create({
      data: newAccountEntity,
    });

    //  기본 계좌 내역 생성(잔액이 100 만큼 있음)
    const newAccountDetailEntity = new CreateAccountDetailEntity(
      0,
      0,
      initBalance,
      createdAccount.id
    );
    await prisma.accountDetail.create({
      data: newAccountDetailEntity,
    });

    // when
    await purchaseNoTransaction(createdAccount.id, changeAmount, prisma);

    // then
    const afterPurchaseAccountDetail = await prisma.accountDetail.findFirst({
      where: { accountId: createdAccount.id },
      orderBy: { createdAt: Prisma.SortOrder.desc },
    });
    expect(afterPurchaseAccountDetail).toBeDefined();
    expect(afterPurchaseAccountDetail?.newBalance).toBe(
      initBalance - changeAmount
    );

    // 데이터베이스 정리
    // 여기서는 AccountDetail -> Account 순으로 삭제한다. sequence 도 다음 insert 를 위해 초기화한다.
    await prisma.accountDetail.deleteMany();
    await prisma.account.deleteMany();
    await prisma.$queryRaw`select setval('account_id_seq', 1, false)`;
    await prisma.$queryRaw`select setval('account_detail_id_seq', 1, false)`;
  });

  it("잔액 부족 시 에러를 발생시킨다.", async () => {
    // given
    const initBalance = 0;
    const changeAmount = 10;

    // type 이 1인 계좌 생성(currency 의 한 종류라고 생각)
    const newAccountEntity = new CreateAccountEntity(1);
    const createdAccount = await prisma.account.create({
      data: newAccountEntity,
    });

    //  기본 계좌 내역 생성(잔액이 0 만큼 있음)
    const newAccountDetailEntity = new CreateAccountDetailEntity(
      0,
      0,
      initBalance,
      createdAccount.id
    );
    await prisma.accountDetail.create({
      data: newAccountDetailEntity,
    });

    // when

    // then
    await expect(
      purchaseNoTransaction(createdAccount.id, changeAmount, prisma)
    ).rejects.toThrow("not enough balance");

    // 아래의 내역이 변하지 않았음을 확인하는 로직은 옳게 설계된 건지?
    const lastAccountDetail = await prisma.accountDetail.findFirst({
      where: { accountId: createdAccount.id },
      orderBy: { createdAt: Prisma.SortOrder.desc },
    });
    expect(lastAccountDetail?.newBalance).toBe(initBalance); // 여기서 lastAccountDetail 이 null/undefined 가 아니라는 것을 어떻게 표현할지 생각

    // 데이터베이스 정리
    // 여기서는 AccountDetail -> Account 순으로 삭제한다. sequence 도 다음 insert 를 위해 초기화한다.
    await prisma.accountDetail.deleteMany();
    await prisma.account.deleteMany();
    await prisma.$queryRaw`select setval('account_id_seq', 1, false)`;
    await prisma.$queryRaw`select setval('account_detail_id_seq', 1, false)`;
  });
});
