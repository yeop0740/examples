package org.heeyeop.practicalprogrammingforspringdevelopers.infrastructure;

import lombok.RequiredArgsConstructor;
import org.heeyeop.practicalprogrammingforspringdevelopers.application.AccountRepository;
import org.heeyeop.practicalprogrammingforspringdevelopers.domain.Account;
import org.heeyeop.practicalprogrammingforspringdevelopers.entity.AccountJpaEntity;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AccountRepositoryImpl implements AccountRepository {

    private final AccountJpaRepository accountJpaRepository;

    @Override
    public Account findById(long id) {
        return accountJpaRepository.findById(id)
                .orElseThrow(RuntimeException::new)
                .toModel();
    }

    @Override
    public void save(Account account) {
        accountJpaRepository.save(AccountJpaEntity.from(account));
    }
}
