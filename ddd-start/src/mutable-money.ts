import { Money } from './money';

export class MutableMoney {
	#value: number;

	constructor(value: number) {
		this.#value = value;
	}

	get value(): number {
		return this.#value;
	}

	set value(value: number) {
		this.#value = value;
	}

	toMutableMoney() {
		return new Money(this.#value);
	}
}
