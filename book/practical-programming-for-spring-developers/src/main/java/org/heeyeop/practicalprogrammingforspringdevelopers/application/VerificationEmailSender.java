package org.heeyeop.practicalprogrammingforspringdevelopers.application;

import org.heeyeop.practicalprogrammingforspringdevelopers.domain.User;

public interface VerificationEmailSender {
    void send(User user);
}
