package org.heeyeop.springcoreprinciplesadvanced.trace.strategy;

import lombok.extern.slf4j.Slf4j;
import org.heeyeop.springcoreprinciplesadvanced.trace.strategy.code.strategy.ContextV1;
import org.heeyeop.springcoreprinciplesadvanced.trace.strategy.code.strategy.Strategy;
import org.heeyeop.springcoreprinciplesadvanced.trace.strategy.code.strategy.StrategyLogic1;
import org.heeyeop.springcoreprinciplesadvanced.trace.strategy.code.strategy.StrategyLogic2;
import org.junit.jupiter.api.Test;

@Slf4j
public class ContextV1Test {

    @Test
    void strategyV0() {
        logic1();
        logic2();
    }

    private void logic1() {
        long startTime = System.currentTimeMillis();
        // 비즈니스 로직 실행
        log.info("비즈니스 로직1 실행");
        // 비즈니스 로직 종료
        long endTime = System.currentTimeMillis();
        long resultTime = endTime - startTime;
        log.info("resultTime={}", resultTime);
    }

    private void logic2() {
        long startTime = System.currentTimeMillis();
        // 비즈니스 로직 실행
        log.info("비즈니스 로직2 실행");
        // 비즈니스 로직 종료
        long endTime = System.currentTimeMillis();
        long resultTime = endTime - startTime;
        log.info("resultTime={}", resultTime);
    }

    @Test
    void strategyV1() {
        Strategy strategy1 = new StrategyLogic1();
        ContextV1 logic1 = new ContextV1(strategy1);
        logic1.execute();

        Strategy strategy2 = new StrategyLogic2();
        ContextV1 logic2 = new ContextV1(strategy2);
        logic2.execute();
    }

}
