import {Money} from "./money";
import {OrderLine} from "./order-line";
import {OrderState} from "./order-status.enum";
import {ShippingInfo} from "./shipping-info";

export class Order {
    #orderLines: OrderLine[];
    #shippingInfo: ShippingInfo;
    #state: OrderState;
    #totalAmounts: Money;

    constructor(orderLines: OrderLine[], shippingInfo: ShippingInfo) {
        this.#verifyAtLeastOneOrMoreOrderLines(orderLines);
        this.#orderLines = orderLines;
        // shipping info 가 null 인 경우는 없는지
        this.#shippingInfo = shippingInfo;
        this.#totalAmounts = this.#calculateTotalAmounts();
        this.#state = OrderState.PAYMENT_WAITING;
    }

    #verifyAtLeastOneOrMoreOrderLines(orderLines: OrderLine[]) {
        if (orderLines.length === 0) {
            throw new Error("An order must have at least one order line.");
        }
    }

    #calculateTotalAmounts() {
        const totalAmounts = this.#orderLines.reduce((acc, orderLine) => {
            return acc.add(orderLine.amount);
        }, new Money(0));

        return totalAmounts;
    }

    changeShipped() {
    }

    changeShippingInfo(newShipping: ShippingInfo) {
        this.#verifyNotYetShipped();
        this.#shippingInfo = newShipping;
    }

    cancel() {
        this.#verifyNotYetShipped();
        this.#state = OrderState.CANCELLED;
    }

    completePayment() {
    }

    #verifyNotYetShipped() {
        if (this.#state !== OrderState.PAYMENT_WAITING && this.#state !== OrderState.PREPARING) {
            throw new Error("Cannot change shipping info after the order has been shipped.");
        }
    }
}
