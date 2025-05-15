import {Product} from "./product";

export class Category {
    #id: number;
    // #products: Set<Product>;

    // constructor(products: Set<Product>) {
    //     this.#products = products;
    // }
    constructor(id: number) {
        this.#id = id;
    }

    get id() {
        return this.#id;
    }

    // getProducts(page: number, size: number) {
        // 이 경우 category 에 속한 product 수가 많을 때 성능에 문제가 생긴다.
        // 대게 category 에 속한 product 수는 많아지기 마련이다.
        // 따라서 개념적으로는 애그리거트 간에 1 - N 연관이 있더라도 성능 문제로 인해 애그리거트 간 1 - N 연관을 실제 구현엔 반영하지 않는다.
        // return this.#sortById(this.#products).slice((page - 1) * size, page * size);
    // }

    // #sortById(products: Set<Product>) {
    //     const unSortedProducts = Array.from(this.#products);
    //     return unSortedProducts.sort((a, b) => a.id - b.id);
    // }
}
