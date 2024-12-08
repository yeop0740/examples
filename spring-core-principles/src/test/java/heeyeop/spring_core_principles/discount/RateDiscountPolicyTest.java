package heeyeop.spring_core_principles.discount;

import heeyeop.spring_core_principles.member.Grade;
import heeyeop.spring_core_principles.member.Member;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

class RateDiscountPolicyTest {

    DiscountPolicy discountPolicy = new RateDiscountPolicy();

    @Test
    @DisplayName("VIP 는 10% 할인이 적용되어야 한다.")
    void vipO() {
        // given
        Member member = new Member(1L, "memberVIP", Grade.VIP);

        // when
        int discount = discountPolicy.discount(member, 10_000);

        //then
        assertThat(discount).isEqualTo(1_000);
    }

    @Test
    @DisplayName("VIP 가 아니면 할인이 적용되지 않는다.")
    void vipX() {
        // given
        Member member = new Member(2L, "memberBASIC", Grade.BASIC);

        // when
        int discount = discountPolicy.discount(member, 10_000);

        // then
        assertThat(discount).isEqualTo(0);
    }
}
