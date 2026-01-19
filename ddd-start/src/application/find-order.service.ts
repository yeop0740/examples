import { MemberRepository } from './persistent/member.repository';
import { OrderRepository } from '../order.repository';
import { ProductRepository } from './persistent/product.repository';
import { OrderView } from '../presentation/dto/order-view.dto';

export class FindOrderService {
	#memberRepository: MemberRepository;
	#orderRepository: OrderRepository;
	#productRepository: ProductRepository;

	constructor(
		memberRepository: MemberRepository,
		orderRepository: OrderRepository,
		productRepository: ProductRepository,
	) {
		this.#memberRepository = memberRepository;
		this.#orderRepository = orderRepository;
		this.#productRepository = productRepository;
	}

	getOrders(ordererId: number) {
		const member = this.#memberRepository.findById(ordererId);
		const orders = this.#orderRepository.findAllByOrderer(ordererId);
		const orderViews = orders.map((order) => {
			const productId = order.orderLines.getOrderLine(0).productId;
			const product = this.#productRepository.findById(productId);
			return new OrderView(order, member, product);
		});
	}
}
