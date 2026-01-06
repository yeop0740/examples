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

    @Test
    void strategyV2() {
        Strategy strategy1 = new Strategy() {
            @Override
            public void call() {
                log.info("비즈니스 로직1 실행");
            }
        };
        ContextV1 logic1 = new ContextV1(strategy1);
        logic1.execute();

        Strategy strategy2 = new Strategy() {
            @Override
            public void call() {
                log.info("비즈니스 로직2 실행");
            }
        };
        ContextV1 logic2 = new ContextV1(strategy2);
        logic2.execute();
    }

    @Test
    void strategyV3() {
        ContextV1 logic1 = new ContextV1(new Strategy() {
            @Override
            public void call() {
                log.info("비즈니스 로직1 실행");
            }
        });
        logic1.execute();

        ContextV1 logic2 = new ContextV1(new Strategy() {
            @Override
            public void call() {
                log.info("비즈니스 로직2 실행");
            }
        });
        logic2.execute();
    }

    /**
     * 인터페이스에 함수가 1개만 선언되어 있는 경우에 람다로 변환 가능하다.
     */
    @Test
    void strategyV4() {
        ContextV1 logic1 = new ContextV1(() -> log.info("비즈니스 로직1 실행"));
        logic1.execute();

        ContextV1 logic2 = new ContextV1(() -> log.info("비즈니스 로직2 실행"));
        logic2.execute();
    }

}
