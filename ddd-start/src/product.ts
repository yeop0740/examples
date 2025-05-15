export class Product {
    #id: number
    // category 와의 N - 1 연관관계를 나타낸다.
    // #categoryId: number;
    // category 와의 M - N 연관관계를 나타낸다.
    #categoryIds: Set<number>;
    #storeId: number;

    constructor(id: number, categoryIds: Set<number>, storeId: number) {
        this.#id = id;
        this.#categoryIds = categoryIds;
        this.#storeId = storeId;
    }

    get id(): number {
        return this.#id;
    }
}
