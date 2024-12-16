package heeyeop.spring_core_principles.singleton;

import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static org.assertj.core.api.Assertions.assertThat;

class StatefulServiceTest {

    @Test
    void statefulServiceSingleton() {
        ApplicationContext ac = new AnnotationConfigApplicationContext(TestConfig.class);
        StatefulService statefulService1 = ac.getBean(StatefulService.class);
        StatefulService statefulService2 = ac.getBean(StatefulService.class);

        // threadA: user A 가 10_000원 주문
        int priceOfUserA = statefulService1.order("userA", 10_000);

        // threadB : user B 가 20_000원 주문
        int priceOfUserB = statefulService2.order("userB", 20_000);

        // threadA: user A 가 주문 금액 조회
//        int price = statefulService1.getPrice();
        System.out.println("price = " + priceOfUserA);

        assertThat(priceOfUserB).isEqualTo(20_000);
        assertThat(priceOfUserA).isEqualTo(10_000);
    }

    @Configuration
    static class TestConfig {

        @Bean
        public StatefulService statefulService() {
            return new StatefulService();
        }
    }
}