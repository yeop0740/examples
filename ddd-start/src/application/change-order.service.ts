import { ShippingInfo } from '../shipping-info';
import { OrderRepository } from '../order.repository';
import { MemberRepository } from './persistent/member.repository';

export class ChangeOrderService {
	// 두 개 이상의 애그리거트를 변경해야 한다면
	// 응용 서비스에서 각 애그리거트의 상태를 변경한다.
	#orderRepository: OrderRepository;
	#memberRepository: MemberRepository;

	constructor(
		orderRepository: OrderRepository,
		memberRepository: MemberRepository,
	) {
		this.#orderRepository = orderRepository;
		this.#memberRepository = memberRepository;
	}

	changeShippingInfo(
		orderId: number,
		newShippingInfo: ShippingInfo,
		useNewShippingAddrAsMemberAddr: boolean,
	) {
		const order = this.#orderRepository.findById(orderId);
		if (!order) {
			throw new Error('Order not found');
		}

		// order.shipTo(newShippingInfo);
		order.changeShippingInfo(newShippingInfo);
		if (useNewShippingAddrAsMemberAddr) {
			// const member = this.#memberRepository.findByOrderer(order.orderer);
			const member = this.#memberRepository.findById(order.orderer.member.id);
			member.changeAddress(newShippingInfo.address);
		}
	}

	changeShippingInfoV2(orderId: number, newShippingInfo: ShippingInfo) {
		const order = this.#orderRepository.findById(orderId);
		if (!order) {
			throw new Error('Order not found');
		}

		order.changeShippingInfo(newShippingInfo);
	}
}
