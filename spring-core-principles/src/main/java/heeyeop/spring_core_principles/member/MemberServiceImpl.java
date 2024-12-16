package heeyeop.spring_core_principles.member;

public class MemberServiceImpl implements  MemberService {

    private final MemberRepository memberRepository;

    public MemberServiceImpl(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public void join(Member member) {
        memberRepository.save(member);
    }

    @Override
    public Member findMember(Long memberId) {
        return memberRepository.findById(memberId);
    }

    // 싱글톤 확인을 위한 메서드 추가
    public MemberRepository getMemberRepository() {
        return memberRepository;
    }
}
