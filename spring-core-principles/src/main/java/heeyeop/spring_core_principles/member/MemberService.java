package heeyeop.spring_core_principles.member;

public interface MemberService {

    void join(Member member);

    Member findMember(Long memberId);
}
