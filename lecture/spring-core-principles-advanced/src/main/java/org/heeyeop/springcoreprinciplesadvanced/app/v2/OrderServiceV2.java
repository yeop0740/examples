package org.heeyeop.springcoreprinciplesadvanced.app.v2;

import lombok.RequiredArgsConstructor;
import org.heeyeop.springcoreprinciplesadvanced.trace.TraceId;
import org.heeyeop.springcoreprinciplesadvanced.trace.TraceStatus;
import org.heeyeop.springcoreprinciplesadvanced.trace.hellotrace.HelloTraceV2;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderServiceV2 {

    private final OrderRepositoryV2 orderRepository;
    private final HelloTraceV2 trace;

    public void orderItem(TraceId traceId, String orderId) {
        TraceStatus status = null;
        try {
            status = trace.beginSync(traceId, "OrderServiceV1.orderItem()");
            this.orderRepository.save(status.getTraceId(), orderId);
            trace.end(status);
        } catch (Exception e) {
            trace.exception(status, e);
            throw e;
        }
    }

}
