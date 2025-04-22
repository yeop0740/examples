/**
 * Testing Asynchronous Code
 * js 에서는 비동기적으로 코드를 실행하는 경우가 빈번하다. 비동기로 실행하는 코드가 잇을 ㅇ경우, jest 는 다른 테스트로 이동하여 수행할 수 있기 때문에 현재 테스트를 진행 하고 있는 코드가 언제 종료되는지 알아야 한다.
 * jest 에는 이를 수행할 수 잇는 몇 가지 방법이 있다.
 */

const fetchData: () => Promise<string> = () => {
  return Promise.resolve("peanut butter");
};

const fetchError = () => {
  return Promise.reject(new Error("fetch error"));
};

/**
 * Promises
 * 테스트에서 promise 객체를 리턴하면, jest 는 promise 가 resolve 할 때까지 기다린다.
 * 만약, promise 가 reject 하면, test 는 fail 된다.
 */
test("the data is peanut butter", () => {
  return fetchData().then((data) => {
    expect(data).toBe("peanut butter");
  });
});

/**
 * async / await
 * promise 대신에 async / await 를 테스트에 사용할 수 있다.
 * async test 를 작성하려면, test 에 넘겨주는 function 인자에 async 키워드를 사용해야한다.
 * 아래 예시 코드에서 확인할 수 있다.
 */
test("the data is peanut butter", async () => {
  const data = await fetchData();
  expect(data).toBe("peanut butter");
});

// 같은 함수에서 에러가 발생하는건 잘 모르겠음. 일단 함수를 따로 구성해서 코드 작성함
test("the fetch fails with an error", async () => {
  expect.assertions(1);
  try {
    await fetchError();
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
  }
});

/**
 * async / await 를 `.resolves`, `.rejects` 와 조합하여 사용할 수도 있다.
 * 이 경우 async / await 는 예제에서 사용하는 promise 와 동일한 논리로 사실상 구문론적(문법적) 설탕?입니다.
 * 문법적 설탕 - 문법적 기능은 그대로인데 그것을 읽는 사람이 직관적으로 쉽게 코드를 읽을 수 있게 만드는 것
 * > 주의 :promise 를 리턴하거나 await 를 명시적으로 사용할 수 있도록 한다. 이를 생략하면 fetchData / fetchError 의 resolve / reject 가 결정되어 promise 가 리턴되기 전에 테스트는 완료된다.
 *
 */
test("the data is peanut butter", async () => {
  await expect(fetchData()).resolves.toBe("peanut butter");
});

test("the fetch fails with an error", async () => {
  await expect(fetchError()).rejects.toBeInstanceOf(Error);
});

/**
 * promise 가 reject 될 것으로 예상한다면, `.catch` 메서드를 사용할 수 있다.
 * `expect.assertions` 를 사용하여 assertions 이 호출되는 횟수를 확인할 수 있도록 한다.
 * promise 가 resolve 되면 테스트가 fail 되지 않기 때문이다.
 */
test("the fetch fails with an error", async () => {
  expect.assertions(1);
  return fetchError().catch((error) => expect(error).toBeInstanceOf(Error));
});

test("the test will not be failed", async () => {
  // 이런 케이스에 `expect.assertions` 로 assertions 횟수를 체크해야한다.
  return fetchData().catch((error) => expect(error).toBeInstanceOf(Error));
});

/**
 * callbacks
 * promise 를 사용하지 않는다면, callback 을 사용할 수 있다.
 * `fetchData` 의 경우로 살펴본다. promise 를 리턴하지 않고 callback 을 호출한다고 가정하자. 예) 데이터를 로딩하고 완료되었을 때 callback 함수를 호출한다.
 * 해당 함수가 리턴하는 값이 'peanut butter' 인지 확인하고자 한다.
 * 일반적으로, jest 테스트는 테스트들의 실행이 끝에 도달했을 때 완료한다. 이는 테스트는 의도대로 동작하지 않을 것이라는 의미이다.
 */
