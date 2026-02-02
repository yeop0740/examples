package org.heeyeop.practicalprogrammingforspringdevelopers.infrastructure;

import org.heeyeop.practicalprogrammingforspringdevelopers.entity.AccountJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountJpaRepository extends JpaRepository<AccountJpaEntity, Long> {
}
