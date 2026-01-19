export class Product {
	#id: number;
	// category 와의 N - 1 연관관계를 나타낸다.
	// #categoryId: number;
	// category 와의 M - N 연관관계를 나타낸다.
	#categoryIds: Set<number>;
	#storeId: number;

	// category 와 N - 1 연관관계일 때
	// constructor(id: number, categoryId: number, storeId: number) {
	//     this.#id = id;
	//     this.#categoryId = categoryId;
	//     this.#storeId = storeId;
	// }

	constructor(id: number, categoryIds: Set<number>, storeId: number) {
		this.#id = id;
		this.#categoryIds = categoryIds;
		this.#storeId = storeId;
	}

	get id(): number {
		return this.#id;
	}
}
