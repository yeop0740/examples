package org.heeyeop.practicalprogrammingforspringdevelopers.infrastructure;

import org.heeyeop.practicalprogrammingforspringdevelopers.application.UserRepository;
import org.heeyeop.practicalprogrammingforspringdevelopers.domain.User;
import org.heeyeop.practicalprogrammingforspringdevelopers.domain.UserStatus;

import java.util.Optional;

/**
 * findByEmail 메서드에 대해 데이터를 리턴하는 Stub 클래스
 */
public class StubExistUserRepository implements UserRepository {

    @Override
    public Optional<User> findByEmail(String email) {
        return Optional.of(User.builder()
                .id(1L)
                .email(email)
                .nickname("foobar")
                .status(UserStatus.ACTIVE)
                .verificationCode("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                .build());
    }

    @Override
    public User save(User user) {
        return User.builder()
                .id(1L)
                .email(user.getEmail())
                .nickname(user.getNickname())
                .status(user.getStatus())
                .verificationCode(user.getVerificationCode())
                .build();
    }

}
