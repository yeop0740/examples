package heeyeop.spring_core_principles.order;

import heeyeop.spring_core_principles.discount.DiscountPolicy;
import heeyeop.spring_core_principles.discount.FixDiscountPolicy;
import heeyeop.spring_core_principles.member.Member;
import heeyeop.spring_core_principles.member.MemberRepository;
import heeyeop.spring_core_principles.member.MemoryMemberRepository;

public class OrderServiceImpl implements OrderService {

    private final MemberRepository memberRepository = new MemoryMemberRepository();
    private final DiscountPolicy discountPolicy = new FixDiscountPolicy();

    @Override
    public Order createOrder(Long memberId, String itemName, int itemPrice) {
        Member member = memberRepository.findById(memberId);
        int discountPrice = discountPolicy.discount(member, itemPrice);

        return new Order(memberId, itemName, itemPrice, discountPrice);
    }
}
