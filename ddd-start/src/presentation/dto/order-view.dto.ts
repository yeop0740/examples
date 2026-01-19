import { Order } from '../../order';
import { Member } from '../../member';
import { Product } from '../../product';

export class OrderView {
	constructor(
		public readonly order: Order,
		public readonly member: Member,
		public readonly product: Product,
	) {}
}
