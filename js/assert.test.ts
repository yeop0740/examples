import assert, { AssertionError } from "assert";

describe("assert", () => {
  it("assert 내부가 true 이면, 에러를 발생시키지 않는다.", () => {
    expect(() => {
      assert(true);
    }).not.toThrow();
  });

  it("assert 내부가 falsy value 이면, AssertionError 가 발생한다.", () => {
    expect(() => {
      assert(false);
    }).toThrow(AssertionError);
  });

  it("assert 내부가 falsy value 이면, AssertionError 가 발생한다.", () => {
    expect(() => {
      const payload = {
        sub: "1",
        email: undefined,
      };

      assert(
        payload !== undefined &&
          payload.sub !== undefined &&
          payload.email !== undefined
      );
    }).toThrow(AssertionError);
  });
});
