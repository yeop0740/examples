import {Order} from "./order";
import {OrderNumber} from "./order-number";

export interface OrderRepository {
    findByNumber(number: OrderNumber): Order;
    save(order: Order): void;
    delete(order: Order): void;

    findById(orderId: number): Order;

    findAllByOrderer(ordererId: number): Order[];
}
