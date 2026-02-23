/**
 * add, multiply 연산을 할 때 단순히 해당 객체의 value 를 변경하는 것이 아니라
 * 새로운 Money 객체를 만들어서 반환하고 있는 것을 확인할 수 있다.
 * 이처럼 데이터 변경 기능을 제공하지 않는 타입을 불변(immutable) 이라고 표현한다. -> 안전한 코드를 작성할 수 있다.
 */
export class Money {
	#value: number;

	constructor(value: number) {
		this.#value = value;
	}

	get value(): number {
		return this.#value;
	}

	add(money: Money) {
		return new Money(this.#value + money.value);
	}

	multiply(multiplier: number) {
		return new Money(this.#value * multiplier);
	}
}
