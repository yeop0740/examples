package heeyeop.spring_core_principles.order;

import heeyeop.spring_core_principles.discount.DiscountPolicy;
import heeyeop.spring_core_principles.member.Member;
import heeyeop.spring_core_principles.member.MemberRepository;

public class OrderServiceImpl implements OrderService {

    private final MemberRepository memberRepository;
    private final DiscountPolicy discountPolicy;

    public OrderServiceImpl(MemberRepository memberRepository, DiscountPolicy discountPolicy) {
        this.memberRepository = memberRepository;
        this.discountPolicy = discountPolicy;
    }

    @Override
    public Order createOrder(Long memberId, String itemName, int itemPrice) {
        Member member = memberRepository.findById(memberId);
        int discountPrice = discountPolicy.discount(member, itemPrice);

        return new Order(memberId, itemName, itemPrice, discountPrice);
    }

    // 싱글톤 확인을 위한 메서드 추가
    public MemberRepository getMemberRepository() {
        return memberRepository;
    }
}
