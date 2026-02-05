package org.heeyeop.practicalprogrammingforspringdevelopers;

import org.heeyeop.practicalprogrammingforspringdevelopers.application.UserService;
import org.heeyeop.practicalprogrammingforspringdevelopers.application.dto.UserCreateDto;
import org.heeyeop.practicalprogrammingforspringdevelopers.domain.User;
import org.heeyeop.practicalprogrammingforspringdevelopers.infrastructure.DummyVerificationEmailSender;
import org.heeyeop.practicalprogrammingforspringdevelopers.infrastructure.StubEmptyUserRepository;
import org.heeyeop.practicalprogrammingforspringdevelopers.infrastructure.StubExistUserRepository;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

public class TestWithTestDouble {

    @Test
    public void 중복된_이메일_회원가입_요청이_오면_에러가_발생한다() {
        // given
        UserCreateDto userCreateDto = UserCreateDto.builder()
                .email("foobar@localhost.com")
                .nickname("foobar")
                .build();

        // then
        assertThatThrownBy(() -> {
            UserService userService = UserService.builder()
                    .verificationEmailSender(new DummyVerificationEmailSender())
                    .userRepository(new StubExistUserRepository())
                    .build();
            User user = userService.register(userCreateDto);
        });
    }

    @Test
    public void 이메일_회원가입을_하면_가입_보류_상태가_된다() {
        // given
        UserCreateDto userCreateDto = UserCreateDto.builder()
                .email("foobar@localhost.com")
                .nickname("foobar")
                .build();

        // when
        UserService userService = UserService.builder()
                .verificationEmailSender(new DummyVerificationEmailSender())
                .userRepository(new StubEmptyUserRepository())
                .build();
        User user = userService.register(userCreateDto);

        // then
        assertThat(user.isPending()).isTrue();
    }
}
