package org.heeyeop.springcoreprinciplesadvanced.app.v5;

import org.heeyeop.springcoreprinciplesadvanced.trace.callback.TraceTemplate;
import org.heeyeop.springcoreprinciplesadvanced.trace.logtrace.LogTrace;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OrderControllerV5 {

    private final OrderServiceV5 orderService;
    private final TraceTemplate template;

    public OrderControllerV5(OrderServiceV5 orderService, LogTrace trace) {
        this.orderService = orderService;
        this.template = new TraceTemplate(trace); // template 도 빈으로 등록하여 사용할 수 있음. 빈으로 등록하여 사용하면 테스트 할 때 기능과 관련있는 객체를 넣는 것이 아닌 tracetemplate 을 생성해서 넣어줘야 하는 단점이 있음.
    }

    @GetMapping("/v5/request")
    public String request(String itemId) {
        return this.template.execute("OrderControllerV5.request()", () -> {
            orderService.orderItem(itemId);
            return "ok";
        });
    }

}
