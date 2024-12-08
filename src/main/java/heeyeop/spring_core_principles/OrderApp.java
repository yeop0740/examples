package heeyeop.spring_core_principles;

import heeyeop.spring_core_principles.member.Grade;
import heeyeop.spring_core_principles.member.Member;
import heeyeop.spring_core_principles.member.MemberService;
import heeyeop.spring_core_principles.member.MemberServiceImpl;
import heeyeop.spring_core_principles.order.Order;
import heeyeop.spring_core_principles.order.OrderService;
import heeyeop.spring_core_principles.order.OrderServiceImpl;

public class OrderApp {

    public static void main(String[] args) {
        MemberService memberService = new MemberServiceImpl();
        OrderService orderService = new OrderServiceImpl();

        Long memberId = 1L;
        Member member = new Member(memberId, "memberA", Grade.VIP);
        memberService.join(member);

        Order order = orderService.createOrder(memberId, "itemA", 10_000);

        System.out.println("order = " + order);
    }
}
