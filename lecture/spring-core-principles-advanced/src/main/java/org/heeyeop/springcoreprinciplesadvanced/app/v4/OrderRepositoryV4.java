package org.heeyeop.springcoreprinciplesadvanced.app.v4;

import lombok.RequiredArgsConstructor;
import org.heeyeop.springcoreprinciplesadvanced.trace.logtrace.LogTrace;
import org.heeyeop.springcoreprinciplesadvanced.trace.template.AbstractTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class OrderRepositoryV4 {

    private final LogTrace trace;

    public void save(String itemId) {
        AbstractTemplate<Void> template = new AbstractTemplate<>(trace) {
            @Override
            protected Void call() {
                if (itemId.equals("ex")) {
                    throw new IllegalStateException("예외 발생");
                }
                // 영속성 관련 코드
                sleep(1000);
                return null;
            }
        };

        template.execute("OrderRepositoryV4.save()");
    }

    private void sleep(int millisecond) {
        try {
            Thread.sleep(millisecond);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}
