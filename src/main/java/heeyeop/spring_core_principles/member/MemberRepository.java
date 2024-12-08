package heeyeop.spring_core_principles.member;

public interface MemberRepository {

    void save(Member member);

    Member findById(Long id);
}
