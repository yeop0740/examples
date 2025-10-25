import { PrismaService } from './prisma/prisma.service';
import { OrderRepository } from '../order.repository';
import { Order } from '../order';
import { OrderNumber } from '../order-number';
import { Orderer } from '../orderer';
import { Member } from '../member';
import { Password } from '../password';
import { Address } from '../address';
import { ShippingInfo } from '../shipping-info';
import { Receiver } from '../receiver';

export class PrismaOrderRepository implements OrderRepository {
	constructor(prisma: PrismaService) {}

	findById(orderId: number) {
		return new Order(
			new OrderNumber(0),
			[],
			new Orderer(
				new Member(
					0,
					'0',
					'0',
					new Password('0'),
					new Address('1', '1', '111'),
				),
			),
			new ShippingInfo(new Receiver('0', '0'), new Address('1', '1', '111')),
		);
	}

	findByNumber(number: OrderNumber) {
		return new Order(
			new OrderNumber(0),
			[],
			new Orderer(
				new Member(
					0,
					'0',
					'0',
					new Password('0'),
					new Address('1', '1', '111'),
				),
			),
			new ShippingInfo(new Receiver('0', '0'), new Address('1', '1', '111')),
		);
	}

	findAllByOrderer(ordererId: number) {
		return new Array<Order>();
	}

	findAllByOrdererId(ordererId: number, startRow: number, size: number) {
		return new Array<Order>();
	}

	save(order: Order) {
		return new Order(
			new OrderNumber(0),
			[],
			new Orderer(
				new Member(
					0,
					'0',
					'0',
					new Password('0'),
					new Address('1', '1', '111'),
				),
			),
			new ShippingInfo(new Receiver('0', '0'), new Address('1', '1', '111')),
		);
	}

	update(order: Order) {
		return;
	}

	delete(order: Order) {
		return;
	}
}
