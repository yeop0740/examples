import axios from "axios";

describe("promise 를 생성하는 요청 테스트", () => {
  it("정상 동작하는지 확인", async () => {
    const response = await axios.get("http://localhost:3000/prisma");
    expect(response.status).toBe(200);
  });

  it("[test3] 동시에 여러 요청을 보낼 때 시간 측정", async () => {
    const tasks = [];
    console.time("start");
    for (let i = 0; i < 6; i++) {
      tasks.push(axios.get("http://localhost:3000/prisma"));
    }
    const responses = await Promise.all(tasks);
    console.timeEnd("start");
    expect(responses.every((response) => response.status === 200)).toBe(true);
    expect(responses.every((response) => response.data === "OK")).toBe(true);
  });
});
