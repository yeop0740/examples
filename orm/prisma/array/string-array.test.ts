import { PrismaClient, User } from "./generated/prisma";

let prisma: PrismaClient;

beforeAll(async () => {
  prisma = new PrismaClient();
});

afterEach(async () => {
  await prisma.user.deleteMany();
});

describe("문자열 배열을 사용할 때", () => {
  it("prisma 의 api 를 사용하면 null 값을 빈 배열로 변환한다", async () => {
    const createdUser = await prisma.user.create({
      data: {},
    });

    const user = await prisma.user.findUnique({
      where: {
        id: createdUser.id,
      },
    });

    expect(user).not.toBeFalsy();
    expect(user!.images).toEqual([]);
  });

  it("native query 를 사용하면 null 값을 null 로 변환한다", async () => {
    const createdUser = await prisma.user.create({
      data: {},
    });

    const [user] = await prisma.$queryRaw<
      User[]
    >`select * from "User" where id = ${createdUser.id}`;

    expect(user).not.toBeFalsy();
    expect(user!.images).toBeNull();
    expect(user!.images).not.toEqual([]);
  });
});
