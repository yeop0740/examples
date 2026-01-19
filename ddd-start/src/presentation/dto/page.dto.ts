import { Product } from '../../product';

export class Page {
	constructor(
		public readonly page: number,
		public readonly size: number,
		public readonly totalCount: number,
		public readonly products: Product[],
	) {}
}
