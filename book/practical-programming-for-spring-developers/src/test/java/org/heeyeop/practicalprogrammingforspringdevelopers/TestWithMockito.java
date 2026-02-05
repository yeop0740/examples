package org.heeyeop.practicalprogrammingforspringdevelopers;

import org.heeyeop.practicalprogrammingforspringdevelopers.application.UserRepository;
import org.heeyeop.practicalprogrammingforspringdevelopers.application.UserService;
import org.heeyeop.practicalprogrammingforspringdevelopers.application.VerificationEmailSender;
import org.heeyeop.practicalprogrammingforspringdevelopers.application.dto.UserCreateDto;
import org.heeyeop.practicalprogrammingforspringdevelopers.domain.User;
import org.heeyeop.practicalprogrammingforspringdevelopers.domain.UserStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
public class TestWithMockito {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VerificationEmailSender verificationEmailSender;

    @InjectMocks
    private UserService userService;

    @Test
    public void 중복된_이메일_회원가입_요청이_오면_에러가_발생한다() {
        // given
        UserCreateDto userCreateDto = UserCreateDto.builder()
                .email("foobar@localhost.com")
                .nickname("foobar")
                .build();

        given(userRepository.findByEmail(userCreateDto.email()))
                .willReturn(Optional.of(User.builder()
                        .id(1L)
                        .email("foobar@localhost.com")
                        .nickname("foobar")
                        .status(UserStatus.ACTIVE)
                        .verificationCode("aaaa")
                        .build()));

        // then
        assertThatThrownBy(() -> {
            userService.register(userCreateDto);
        });
    }

    @Test
    public void 이메일_회원가입을_하면_가입_보류_상태가_된다() {
        // given
        UserCreateDto userCreateDto = UserCreateDto.builder()
                .email("foobar@localhost.com")
                .nickname("foobar")
                .build();

        given(userRepository.findByEmail(userCreateDto.email()))
                .willReturn(Optional.empty());

        given(userRepository.save(any()))
                .willReturn(User.builder()
                        .email(userCreateDto.email())
                        .nickname(userCreateDto.nickname())
                        .status(UserStatus.PENDING)
                        .verificationCode(UUID.randomUUID().toString())
                        .build());

        // when
        User user = userService.register(userCreateDto);

        // then
        assertThat(user.isPending()).isTrue();
    }

}
