package heeyeop.spring_core_principles;

import heeyeop.spring_core_principles.member.Grade;
import heeyeop.spring_core_principles.member.Member;
import heeyeop.spring_core_principles.member.MemberService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class MemberApp {

    public static void main(String[] args) {

//        AppConfig appConfig = new AppConfig();
//        MemberService memberService = appConfig.memberService();

        ApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);
        MemberService memberService = ac.getBean("memberService", MemberService.class);

        // 회원 가입 기능 수행
        Member member = new Member(1L, "memberA", Grade.VIP);
        memberService.join(member);

        // 조회 기능 수행 및 회원 가입 기능 확인
        Member findMember = memberService.findMember(1L);
        System.out.println("new member = " + member.getName());
        System.out.println("find member = " + findMember.getName());
    }
}
