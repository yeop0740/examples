import {Order} from "../order";
import {ShippingInfo} from "../shipping-info";
import {Receiver} from "../receiver";
import {Address} from "../address";
import {OrderLine} from "../order-line";
import {Product} from "../product";
import {Money} from "../money";
import {OrderNumber} from "../order-number";
import { OrderRepository } from "../order.repository";

export class CancelOrderService {
    #orderRepository: OrderRepository;

    constructor(orderRepository: OrderRepository) {
        this.#orderRepository = orderRepository;
    }

    public cancelOrder(orderNumber: OrderNumber) {
        // order 라는 도메인 모델에게 cancel 행위를 위임한다.
        const order = this.#orderRepository.findByNumber(orderNumber);
        if (order === null) {
            throw new Error('Order not found');
        }

        order.cancel();
    }

    #findOrderById(orderId: number) {
        const orderNumber = new OrderNumber(orderId);
        const receiver = new Receiver('test', '010-1234-5678');
        const address = new Address('서울시 강남구 역삼동', '서울시 테헤란로', '123-456');
        const shippingInfo = new ShippingInfo(receiver, address);
        const product = new Product();
        const orderLine = new OrderLine(product, new Money(1000), 1);

        return new Order(orderNumber, [orderLine], shippingInfo);
    }
}
