package heeyeop.spring_core_principles.singleton;

import heeyeop.spring_core_principles.AppConfig;
import heeyeop.spring_core_principles.member.MemberRepository;
import heeyeop.spring_core_principles.member.MemberServiceImpl;
import heeyeop.spring_core_principles.order.OrderServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;

public class ConfigurationSingletonTest {

    @Test
    void configurationTest() {
        ApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);

        MemberServiceImpl memberService = ac.getBean("memberService", MemberServiceImpl.class);
        OrderServiceImpl orderService = ac.getBean("orderService", OrderServiceImpl.class);
        MemberRepository memberRepository = ac.getBean("memberRepository", MemberRepository.class);

        MemberRepository memberRepository1 = memberService.getMemberRepository();
        MemberRepository memberRepository2 = orderService.getMemberRepository();

        System.out.println("memberService -> memberRepository = " + memberRepository1);
        System.out.println("orderService -> memberRepository = " + memberRepository2);
        System.out.println("memberRepository = " + memberRepository);

        // 예상
        // call AppConfig.memberService
        // call AppConfig.memberRepository
        // call AppConfig.memberRepository
        // call AppConfig.orderService
        // call AppConfig.memberRepository

        // 실제
        // call AppConfig.memberService
        // call AppConfig.memberRepository
        // call AppConfig.orderService

        assertThat(memberService.getMemberRepository()).isSameAs(memberRepository);
        assertThat(orderService.getMemberRepository()).isSameAs(memberRepository);
    }
}
