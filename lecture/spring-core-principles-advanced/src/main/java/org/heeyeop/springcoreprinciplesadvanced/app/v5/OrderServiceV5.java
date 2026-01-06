package org.heeyeop.springcoreprinciplesadvanced.app.v5;

import org.heeyeop.springcoreprinciplesadvanced.trace.callback.TraceTemplate;
import org.heeyeop.springcoreprinciplesadvanced.trace.logtrace.LogTrace;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceV5 {

    private final OrderRepositoryV5 orderRepository;
    private final TraceTemplate template;

    public OrderServiceV5(OrderRepositoryV5 orderRepository, LogTrace trace) {
        this.orderRepository = orderRepository;
        this.template = new TraceTemplate(trace);
    }

    public void orderItem(String orderId) {
        template.execute("OrderServiceV5.orderItem()", () -> {
            orderRepository.save(orderId);
            return null;
        });
    }
}
