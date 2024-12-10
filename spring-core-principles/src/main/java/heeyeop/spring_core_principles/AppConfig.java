package heeyeop.spring_core_principles;

import heeyeop.spring_core_principles.discount.DiscountPolicy;
import heeyeop.spring_core_principles.discount.RateDiscountPolicy;
import heeyeop.spring_core_principles.member.MemberRepository;
import heeyeop.spring_core_principles.member.MemberService;
import heeyeop.spring_core_principles.member.MemberServiceImpl;
import heeyeop.spring_core_principles.member.MemoryMemberRepository;
import heeyeop.spring_core_principles.order.OrderService;
import heeyeop.spring_core_principles.order.OrderServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public MemberService memberService() {
        return new MemberServiceImpl(memberRepository());
    }

    @Bean
    public OrderService orderService() {
        return new OrderServiceImpl(memberRepository(), discountPolicy());
    }

    @Bean
    public  MemberRepository memberRepository() {
        return new MemoryMemberRepository();
    }

    @Bean
    public DiscountPolicy discountPolicy() {
        return new RateDiscountPolicy();
    }
}
