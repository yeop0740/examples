import {Product} from "./product";
import {Money} from "./money";

export class OrderLine {
    // #product: Product;
    #productId: number
    #price: Money;
    #quantity: number;
    #amount: Money;

    constructor(product: Product, price: Money, quantity: number) {
        this.#productId = product.id;
        this.#price = price;
        this.#quantity = quantity;
        this.#amount = this.#calculateAmount();
    }

    #calculateAmount() {
        // this.#price * this.#quantity
        return this.#price.multiply(this.#quantity);
    }

    get productId() {
        return this.#productId;
    }

    get amount() {
        return this.#amount;
    }
}
