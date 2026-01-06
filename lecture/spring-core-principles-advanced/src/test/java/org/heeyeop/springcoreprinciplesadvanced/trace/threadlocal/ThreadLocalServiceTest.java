package org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal;

import lombok.extern.slf4j.Slf4j;
import org.heeyeop.springcoreprinciplesadvanced.trace.threadlocal.code.ThreadLocalService;
import org.junit.jupiter.api.Test;

@Slf4j
public class ThreadLocalServiceTest {

    private ThreadLocalService threadLocalService = new ThreadLocalService();

    @Test
    void field_synchronous() {
        log.info("main start");
        Runnable userA = () -> {
            threadLocalService.logic("userA");
        };
        Runnable userB = () -> {
            threadLocalService.logic("userB");
        };

        Thread threadA = new Thread(userA);
        threadA.setName("tread-A");
        Thread threadB = new Thread(userB);
        threadB.setName("tread-B");

        threadA.start();
        sleep(2000); // A 의 실행 대기
        threadB.start();
        sleep(2000); // B 의 실행 대기
        log.info("main end");
    }

    @Test
    void field_asynchronous() {
        log.info("main start");
        Runnable userA = () -> {
            threadLocalService.logic("userA");
        };
        Runnable userB = () -> {
            threadLocalService.logic("userB");
        };

        Thread threadA = new Thread(userA);
        threadA.setName("tread-A");
        Thread threadB = new Thread(userB);
        threadB.setName("tread-B");

        threadA.start();
        threadB.start();
        sleep(3000); // B 의 실행 대기
        log.info("main end");
    }

    void sleep(int millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
