export class OrderNumber {
	#orderNumber: number;

	constructor(orderNumber: number) {
		this.#orderNumber = orderNumber;
	}

	get orderNumber() {
		return this.#orderNumber;
	}
}
