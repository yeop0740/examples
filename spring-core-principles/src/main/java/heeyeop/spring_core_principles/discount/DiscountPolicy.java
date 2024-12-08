package heeyeop.spring_core_principles.discount;

import heeyeop.spring_core_principles.member.Member;

public interface DiscountPolicy {

    /**
     * @return 할인 금액
     */
    int discount(Member member, int price);
}
