import { Prisma, PrismaClient } from "@prisma/client";
import { CreateAccountDetailEntity } from "./CreateAccountDetailEntity";
import { CreateAccountEntity } from "./CreateAccountEntity";
import { purchase as purchaseNoTransaction } from "./purchaseNoTransaction";

describe("purchaseNoTransaction 은", () => {
  const prisma = new PrismaClient();

  beforeAll(() => {
    prisma.$connect();
  });

  afterAll(() => {
    prisma.$disconnect();
  });

  afterEach(async () => {
    // 데이터베이스 정리
    // 여기서는 AccountDetail -> Account 순으로 삭제한다. sequence 도 다음 insert 를 위해 초기화한다.
    await prisma.accountDetail.deleteMany();
    await prisma.account.deleteMany();
    await prisma.$queryRaw`select setval('account_id_seq', 1, false)`;
    await prisma.$queryRaw`select setval('account_detail_id_seq', 1, false)`;
  });

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
  });

  it("잔액 1 소진에 대한 구매 100회 동시 실행 시 PrismaClient 에러가 발생하여 주어진 횟수만큼 수행되지 않는다.", async () => {
    // given
    const initBalance = 200;
    const changeAmount = 1;
    const numberOfTrials = 100;

    // type 이 1인 계좌 생성(currency 의 한 종류라고 생각)
    const newAccountEntity = new CreateAccountEntity(1);
    const createdAccount = await prisma.account.create({
      data: newAccountEntity,
    });

    //  기본 계좌 내역 생성(잔액이 200 만큼 있음)
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
    const purchases = new Array<any>();
    for (let i = 0; i < numberOfTrials; i++) {
      const promise = purchaseNoTransaction(
        createdAccount.id,
        changeAmount,
        prisma
      );
      purchases.push(promise);
    }

    // then
    await expect(Promise.all(purchases)).rejects.toThrow(
      Prisma.PrismaClientKnownRequestError
    );

    const lastAccountDetail = await prisma.accountDetail.findFirst({
      where: { accountId: createdAccount.id },
      orderBy: { createdAt: Prisma.SortOrder.desc },
    });
    // 몇 회 수행되는지에 대해 비결정적이라서 아래처럼 일치하지 않을 것이라고 단언하는게 애매(어떤 운에 작용에 의해 모두 성공할 수 있는 가능성이 0이 아님)
    expect(lastAccountDetail?.newBalance).not.toBe(
      initBalance - numberOfTrials * changeAmount
    );
  });
});
