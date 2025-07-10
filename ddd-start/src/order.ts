import { Money } from './money';
import { OrderLine } from './order-line';
import { OrderState } from './order-status.enum';
import { ShippingInfo } from './shipping-info';
import { OrderNumber } from './order-number';
import { OrderLines } from './order-lines';
import { Orderer } from './orderer';

export class Order {
	#orderNumber: OrderNumber;
	#orderLines: OrderLines;
	#orderer: Orderer;
	#shippingInfo: ShippingInfo;
	#state: OrderState;
	#totalAmounts: Money;

	constructor(
		orderNumber: OrderNumber,
		orderLines: OrderLine[],
		orderer: Orderer,
		shippingInfo: ShippingInfo,
	) {
		this.#orderNumber = orderNumber;
		this.#verifyAtLeastOneOrMoreOrderLines(orderLines);
		this.#orderLines = new OrderLines(orderLines);
		// shipping info 가 null 인 경우는 없는지
		this.#shippingInfo = shippingInfo;
		this.#totalAmounts = this.#calculateTotalAmounts();
		this.#state = OrderState.PAYMENT_WAITING;
		this.#orderer = orderer;
	}

	get orderLines() {
		return this.#orderLines;
	}

	get orderer() {
		return this.#orderer;
	}

	#verifyAtLeastOneOrMoreOrderLines(orderLines: OrderLine[]) {
		if (orderLines.length === 0) {
			throw new Error('An order must have at least one order line.');
		}
	}

	#calculateTotalAmounts() {
		// const totalAmounts = this.#orderLines.reduce((acc, orderLine) => {
		//     return acc.add(orderLine.amount);
		// }, new Money(0));
		//
		// return totalAmounts;
		return this.#orderLines.getTotalAmounts();
	}

	// shipTo(newShippingInfo: ShippingInfo, useNewShippingAddrAsMemberAddr: boolean) {
	//     this.#verifyNotYetShipped();
	//     this.#shippingInfo = newShippingInfo;
	//     if (useNewShippingAddrAsMemberAddr) {
	//       // 다른 애그리거트의 상태를 변경하면 안된다.
	// this.#orderer.member.changeAddress(newShippingInfo); // -> X
	// }
	// }

	shipTo(newShippingInfo: ShippingInfo) {
		// 해당하는 애그리거트의 엔티티만 변경하도록 설정
		this.#verifyNotYetShipped();
		this.#shippingInfo = newShippingInfo;
	}

	changeShipped() {}

	changeShippingInfo(newShipping: ShippingInfo): void;
	changeShippingInfo(
		newShipping: ShippingInfo,
		userNewShippingAddrAsMemberAddr: boolean,
	): void;
	// 애그리거트 루트는 도메인 규칙을 구현한 기능을 제공한다.
	changeShippingInfo(
		newShipping: ShippingInfo,
		userNewShippingAddrAsMemberAddr?: boolean,
	) {
		this.#verifyNotYetShipped();
		// null case 체크해야하나?
		// 밸류가 불변이기 때문에 새로운 객체를 할당해 값을 변경한다.
		this.#shippingInfo = newShipping;
		if (userNewShippingAddrAsMemberAddr) {
			// 한 애그리거트 내부에서 다른 애그리거트에 접근할 수 있으면,
			// 구현이 쉬워진다는 것 때문에 다른 애그리거트의 상태를 변경하는 실수를 저지를 확률이 높다.
			this.#orderer.member.changeAddress(newShipping.address);
		}
	}

	changeOrderLines(newLines: OrderLine[]) {
		this.#orderLines.changeOrderLines(newLines);
		this.#totalAmounts = this.#orderLines.getTotalAmounts();
	}

	cancel() {
		this.#verifyNotYetShipped();
		this.#state = OrderState.CANCELLED;
	}

	completePayment() {}

	#verifyNotYetShipped() {
		if (
			this.#state !== OrderState.PAYMENT_WAITING &&
			this.#state !== OrderState.PREPARING
		) {
			throw new Error(
				'Cannot change shipping info after the order has been shipped.',
			);
		}
	}
}
