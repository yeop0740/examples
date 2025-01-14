function findMaxDate() {
  const test1 = new Date("+010000-12-30T23:59:59.999Z");
  const test2 = new Date("+009999-12-31T23:59:59.999Z");
  const test3 = new Date("+275760-09-13T00:00:00.000Z");
  const test4 = new Date("+275760-09-13T00:00:00.001Z");
  const test5 = new Date("275760-09-13T00:00:00.001Z"); // format 이 바르지 않은 것으로 보인다.

  console.log(test1);
  console.log(test2);
  console.log(test3);
  console.log(test4);
  console.log(test5);
  console.log(test1.getTime());
  console.log(test2.getTime());
  console.log(test3.getTime());
  console.log(test4.getTime());
  console.log(test5.getTime());
}

findMaxDate();
