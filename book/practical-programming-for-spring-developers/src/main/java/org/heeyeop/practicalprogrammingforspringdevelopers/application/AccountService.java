package org.heeyeop.practicalprogrammingforspringdevelopers.application;

import lombok.RequiredArgsConstructor;
import org.heeyeop.practicalprogrammingforspringdevelopers.domain.Account;
import org.heeyeop.practicalprogrammingforspringdevelopers.entity.AccountJpaEntity;
import org.heeyeop.practicalprogrammingforspringdevelopers.infrastructure.AccountJpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountJpaRepository accountJpaRepository; // jpa 의존적 코드

    @Transactional
    public Account updateNicknameById(long id, String nickname) {
        Account account = accountJpaRepository.findById(id)
                .orElseThrow(RuntimeException::new)
                .toModel(); // jpa 의존적 코드

        account = account.withNickname(nickname);

        accountJpaRepository.save(AccountJpaEntity.from(account)); // jpa 의존적 코드

        return account;
    }
}
