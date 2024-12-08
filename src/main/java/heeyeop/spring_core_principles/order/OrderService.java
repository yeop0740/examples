package heeyeop.spring_core_principles.order;

public interface OrderService {

    Order createOrder(Long memberId, String itemName, int itemPrice);
}
