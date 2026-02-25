package org.heeyeop.springsecurityoauthdemo.repository;

import org.heeyeop.springsecurityoauthdemo.entity.AuthProvider;
import org.heeyeop.springsecurityoauthdemo.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long> {

    Optional<User> findByAuthProviderAndOpenid(AuthProvider authProvider, String openid);

}
