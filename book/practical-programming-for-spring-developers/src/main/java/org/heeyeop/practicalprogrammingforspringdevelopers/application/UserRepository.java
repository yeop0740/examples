package org.heeyeop.practicalprogrammingforspringdevelopers.application;

import org.heeyeop.practicalprogrammingforspringdevelopers.domain.User;

import java.util.Optional;

public interface UserRepository {
    Optional<User> findByEmail(String email);
    User save(User user);
}
