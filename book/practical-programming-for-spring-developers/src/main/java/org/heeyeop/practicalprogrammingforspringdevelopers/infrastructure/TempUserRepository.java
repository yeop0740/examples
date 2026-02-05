package org.heeyeop.practicalprogrammingforspringdevelopers.infrastructure;

import org.heeyeop.practicalprogrammingforspringdevelopers.application.UserRepository;
import org.heeyeop.practicalprogrammingforspringdevelopers.domain.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 구현체가 없다는 경고를 없애기 위한 임시 구현체
 */
@Repository
public class TempUserRepository implements UserRepository {

    @Override
    public Optional<User> findByEmail(String email) {
        return Optional.empty();
    }

    @Override
    public User save(User user) {
        return null;
    }

}
