package org.heeyeop.practicalprogrammingforspringdevelopers.infrastructure;

import org.heeyeop.practicalprogrammingforspringdevelopers.application.UserRepository;
import org.heeyeop.practicalprogrammingforspringdevelopers.domain.User;

import java.util.Optional;

public class StubEmptyUserRepository implements UserRepository {

    @Override
    public Optional<User> findByEmail(String email) {
        return Optional.empty();
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
