function add(a: number, b: number): number {
    return a + b;
}

/**
 * 일급 함수 : 함수를 값으로 다룰 수 있는 개념
 * js, ts 에서는 변수에 함수를 담을 수 있다.
 */
const f1 = function(a: number) {
    return a * a;
}
// [Function: f1]
console.log(f1)

const f2 = add
console.log(f2)

// 함수는 함수를 인자로 받을 수 있다.
