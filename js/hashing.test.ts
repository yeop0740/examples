import { hashEmail } from "./hashing";

describe("hashEmail", () => {
  it("같은 이메일 주소에 대해 항상 동일한 해시 값을 반환해야 한다", () => {
    const email = "test@example.com";
    const received = hashEmail(email);
    const expected = hashEmail(email);

    expect(received).toBe(expected);
  });

  it("다른 이메일 주소에 대해 다른 해시 값을 반환해야 한다", () => {
    const email1 = "user1@example.com";
    const email2 = "user2@example.com";

    const received = hashEmail(email1);
    const expected = hashEmail(email2);

    expect(received).not.toBe(expected);
  });

  it("null 값을 전달하면 런타임 에러가 발생해야 한다", () => {
    expect(() => hashEmail(null as unknown as string)).toThrow(TypeError);
  });

  it("undefined 값을 전달하면 런타임 에러가 발생해야 한다", () => {
    expect(() => hashEmail(undefined as unknown as string)).toThrow(TypeError);
  });
});
