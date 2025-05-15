import {Product} from "./product";

export class ProductFactory {
    static create(productId: number, categoryIds: Set<number>, storeId: number) {
        return new Product(productId, categoryIds, storeId);
    }
}
