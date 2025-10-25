import { Product } from '../../product';

export class ProductEntity {
	constructor() {}

	static from(product: Product) {
		return new ProductEntity();
	}
}
