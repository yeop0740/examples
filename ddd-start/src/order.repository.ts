import { Order } from './order';
import { OrderNumber } from './order-number';

export interface OrderRepository {
	findById(orderId: number): Order;

	findByNumber(number: OrderNumber): Order;

	findAllByOrderer(ordererId: number): Order[];

	findAllByOrdererId(
		ordererId: number,
		startRow: number,
		size: number,
	): Order[];

	save(order: Order): void;

	update(order: Order): void;

	delete(order: Order): void;
}
