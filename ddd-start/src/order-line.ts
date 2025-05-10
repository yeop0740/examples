import {Product} from "./product";
import {Money} from "./money";

export class OrderLine {
    #product: Product;
    #price: Money;
    #quantity: number;
    #amount: Money;

    constructor(product: Product, price: Money, quantity: number) {
        this.#product = product;
        this.#price = price;
        this.#quantity = quantity;
        this.#amount = this.#calculateAmount();
    }

    #calculateAmount() {
        // this.#price * this.#quantity
        return this.#price.multiply(this.#quantity);
    }

    get amount() {
        return this.#amount;
    }
}
