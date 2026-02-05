package org.heeyeop.practicalprogrammingforspringdevelopers.infrastructure;

import org.heeyeop.practicalprogrammingforspringdevelopers.application.VerificationEmailSender;
import org.heeyeop.practicalprogrammingforspringdevelopers.domain.User;
import org.springframework.stereotype.Component;

/**
 * 구현체 없는 경고를 없애기 위한 임시 구현체
 */
@Component
public class TempVerificationEmailSender implements VerificationEmailSender {

    @Override
    public void send(User user) {
        // do nothing...
    }

}
