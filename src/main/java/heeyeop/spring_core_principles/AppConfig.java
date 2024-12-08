package heeyeop.spring_core_principles;

import heeyeop.spring_core_principles.discount.DiscountPolicy;
import heeyeop.spring_core_principles.discount.FixDiscountPolicy;
import heeyeop.spring_core_principles.member.MemberRepository;
import heeyeop.spring_core_principles.member.MemberService;
import heeyeop.spring_core_principles.member.MemberServiceImpl;
import heeyeop.spring_core_principles.member.MemoryMemberRepository;
import heeyeop.spring_core_principles.order.OrderService;
import heeyeop.spring_core_principles.order.OrderServiceImpl;

public class AppConfig {

    public MemberService memberService() {
        return new MemberServiceImpl(memberRepository());
    }

    public OrderService orderService() {
        return new OrderServiceImpl(memberRepository(), discountPolicy());
    }

    private static MemberRepository memberRepository() {
        return new MemoryMemberRepository();
    }

    private static DiscountPolicy discountPolicy() {
        return new FixDiscountPolicy();
    }
}
