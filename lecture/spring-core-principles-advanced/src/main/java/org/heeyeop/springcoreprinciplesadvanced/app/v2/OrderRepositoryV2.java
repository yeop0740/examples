package org.heeyeop.springcoreprinciplesadvanced.app.v2;

import lombok.RequiredArgsConstructor;
import org.heeyeop.springcoreprinciplesadvanced.trace.TraceId;
import org.heeyeop.springcoreprinciplesadvanced.trace.TraceStatus;
import org.heeyeop.springcoreprinciplesadvanced.trace.hellotrace.HelloTraceV2;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class OrderRepositoryV2 {

    private final HelloTraceV2 trace;

    public void save(TraceId traceId, String itemId) {
        TraceStatus status = null;
        try {
            status = trace.beginSync(traceId, "OrderRepositoryV2.save()");
            // 저장 로직
            if (itemId.equals("ex")) {
                throw new IllegalStateException("예외 발생!");
            }
            // 영속성 관련 코드
            sleep(1000);
            trace.end(status);
        } catch (Exception e) {
            trace.exception(status, e);
            throw e;
        }
    }

    private void sleep(int millisecond) {
        try {
            Thread.sleep(millisecond);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}
