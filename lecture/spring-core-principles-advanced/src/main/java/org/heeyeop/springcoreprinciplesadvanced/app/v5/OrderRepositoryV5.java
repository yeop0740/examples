package org.heeyeop.springcoreprinciplesadvanced.app.v5;

import org.heeyeop.springcoreprinciplesadvanced.trace.callback.TraceTemplate;
import org.heeyeop.springcoreprinciplesadvanced.trace.logtrace.LogTrace;
import org.springframework.stereotype.Repository;

@Repository
public class OrderRepositoryV5 {

    private final TraceTemplate template;

    public OrderRepositoryV5(LogTrace trace) {
        this.template = new TraceTemplate(trace);
    }

    public void save(String itemId) {
        template.execute("OrderRepositoryV5.save()", () -> {
            if (itemId.equals("ex")) {
                throw new IllegalStateException("예외 발생");
            }
            // 영속성 관련 코드
            sleep(1000);
            return null;
        });
    }

    private void sleep(int millisecond) {
        try {
            Thread.sleep(millisecond);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}
