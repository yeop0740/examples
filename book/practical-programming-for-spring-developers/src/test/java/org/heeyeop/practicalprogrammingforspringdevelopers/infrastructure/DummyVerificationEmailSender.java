package org.heeyeop.practicalprogrammingforspringdevelopers.infrastructure;

import org.heeyeop.practicalprogrammingforspringdevelopers.application.VerificationEmailSender;
import org.heeyeop.practicalprogrammingforspringdevelopers.domain.User;

public class DummyVerificationEmailSender implements VerificationEmailSender {

    @Override
    public void send(User user) {
        // do nothing...
    }

}
