package org.heeyeop.practicalprogrammingforspringdevelopers.application;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.heeyeop.practicalprogrammingforspringdevelopers.application.dto.UserCreateDto;
import org.heeyeop.practicalprogrammingforspringdevelopers.core.DuplicatedEmailException;
import org.heeyeop.practicalprogrammingforspringdevelopers.domain.User;
import org.heeyeop.practicalprogrammingforspringdevelopers.domain.UserStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Builder
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final VerificationEmailSender verificationEmailSender;

    @Transactional
    public User register(UserCreateDto userCreateDto) {
        if (userRepository.findByEmail(userCreateDto.email()).isPresent()) {
            throw new DuplicatedEmailException();
        }
        User user = User.builder()
                .email(userCreateDto.email())
                .nickname(userCreateDto.nickname())
                .status(UserStatus.PENDING)
                .verificationCode(UUID.randomUUID().toString())
                .build();
        user = userRepository.save(user);
        verificationEmailSender.send(user);
        return user;
    }

}
