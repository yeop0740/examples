package org.heeyeop.springcoreprinciplesadvanced.app.v4;

import lombok.RequiredArgsConstructor;
import org.heeyeop.springcoreprinciplesadvanced.trace.logtrace.LogTrace;
import org.heeyeop.springcoreprinciplesadvanced.trace.template.AbstractTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderServiceV4 {

    private final OrderRepositoryV4 orderRepository;
    private final LogTrace trace;

    public void orderItem(String orderId) {
        AbstractTemplate<Void> template = new AbstractTemplate<>(trace) {
            @Override
            protected Void call() {
                orderRepository.save(orderId);
                return null;
            }
        };

        template.execute("OrderServiceV4.orderItem()");
    }

}
