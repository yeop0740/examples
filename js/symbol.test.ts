describe("Symbol type 은", () => {
  it("동일한 문자열에 대한 Symbol 은 다른 Symbol 을 반환한다", () => {
    const symbol = Symbol("test");
    const sameStringSymbol = Symbol("test");

    expect(symbol).not.toEqual(sameStringSymbol);
    expect(symbol).not.toBe(sameStringSymbol);
    expect(symbol).not.toStrictEqual(sameStringSymbol);
  });

  it("다른 문자열에 대한 Symbol 은 다른 Symbol 을 반환한다", () => {
    const symbol = Symbol("test");
    const differentStringSymbol = Symbol("text");

    expect(symbol).not.toEqual(differentStringSymbol);
    expect(symbol).not.toBe(differentStringSymbol);
    expect(symbol).not.toStrictEqual(differentStringSymbol);
  });

  it("Symbol.for()를 사용하면 동일한 문자열에 대해 동일한 Symbol을 반환한다", () => {
    const symbol = Symbol.for("test");
    const sameStringSymbol = Symbol.for("test");

    expect(symbol).toBe(sameStringSymbol);
    expect(symbol).toEqual(sameStringSymbol);
    expect(symbol).toStrictEqual(sameStringSymbol);
  });

  it("Symbol.for()를 사용하지 않은 Symbol은 동일한 문자열에 대해 다른 Symbol을 반환한다", () => {
    const symbol = Symbol("test");
    const differentStringSymbol = Symbol.for("text");

    expect(symbol).not.toEqual(differentStringSymbol);
    expect(symbol).not.toBe(differentStringSymbol);
    expect(symbol).not.toStrictEqual(differentStringSymbol);
  });
});

it("같은 string 에 대해 동일한 값으로 취급한다.", () => {
  const string = "test";
  const sameString = "test";

  expect(string).toBe(sameString);
  expect(string).toEqual(sameString);
  expect(string).toStrictEqual(sameString);
});

it("다른 string 에 대해 동일한 값으로 취급한다.", () => {
  const string = "test";
  const differentString = "text";

  expect(string).not.toBe(differentString);
  expect(string).not.toEqual(differentString);
  expect(string).not.toStrictEqual(differentString);
});
