package org.heeyeop.springcoreprinciplesadvanced.trace.strategy;

import lombok.extern.slf4j.Slf4j;
import org.heeyeop.springcoreprinciplesadvanced.trace.strategy.code.strategy.ContextV2;
import org.heeyeop.springcoreprinciplesadvanced.trace.strategy.code.strategy.Strategy;
import org.heeyeop.springcoreprinciplesadvanced.trace.strategy.code.strategy.StrategyLogic1;
import org.heeyeop.springcoreprinciplesadvanced.trace.strategy.code.strategy.StrategyLogic2;
import org.junit.jupiter.api.Test;

@Slf4j
public class ContextV2Test {

    /**
     * 전략을 구현한 클래스 선언 후 해당 클래스를 생성하여 넘겨주는 코드
     */
    @Test
    void strategyV1() {
        ContextV2 context = new ContextV2();
        context.execute(new StrategyLogic1());
        context.execute(new StrategyLogic2());
    }

    /**
     * 전략을 구현한 익명 클래스를 사용하여 실행 시점에 전략을 넘겨주는 코드
     */
    @Test
    void strategyV2() {
        ContextV2 context = new ContextV2();
        context.execute(new Strategy() {
            @Override
            public void call() {
                log.info("비즈니스 로직1 실행");
            }
        });
        context.execute(new Strategy() {
            @Override
            public void call() {
                log.info("비즈니스 로직2 실행");
            }
        });
    }

    /**
     * 람다를 이용하여 전략 구현체를 실행 시점에 넘겨주는 코드
     */
    @Test
    void strategyV3() {
        ContextV2 context = new ContextV2();
        context.execute(() -> log.info("비즈니스 로직1 실행"));
        context.execute(() -> log.info("비즈니스 로직2 실행"));
    }

}
