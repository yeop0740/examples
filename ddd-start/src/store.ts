import { Product } from './product';
import { ProductFactory } from './product.factory';

export class Store {
	#storeId: number;
	#isBlocked: boolean;

	constructor(storeId: number, isBlocked: boolean) {
		this.#storeId = storeId;
		this.#isBlocked = isBlocked;
	}

	get storeId() {
		return this.#storeId;
	}

	get isBlocked() {
		return this.#isBlocked;
	}

	// store 애그리거트에서 product 애그리거트를 생성하는 팩토리 역할을 할 수 있도록 하였다.
	createProduct(productId: number, categoryIds: Set<number>) {
		if (this.isBlocked) {
			throw new Error('store is blocked');
		}

		return new Product(productId, categoryIds, this.storeId);
	}

	// factory 를 사용하더라도 store 애그리거트에 차단된 상점은 상품을 만들 수 없다는 도메인 로직은 한 곳에 위치한다.
	createProductWithProductFactory(productId: number, categoryIds: Set<number>) {
		if (this.isBlocked) {
			throw new Error('store is blocked');
		}

		return ProductFactory.create(productId, categoryIds, this.storeId);
	}
}
