package heeyeop.spring_core_principles.discount;

import heeyeop.spring_core_principles.member.Grade;
import heeyeop.spring_core_principles.member.Member;

public class RateDiscountPolicy implements DiscountPolicy {

    public static final int DISCOUNT_RATE = 10;

    @Override
    public int discount(Member member, int price) {
        if (member.getGrade() == Grade.VIP) {
            return price * DISCOUNT_RATE / 100;
        }

        return 0;
    }



}
