package org.heeyeop.practicalprogrammingforspringdevelopers.application;

import lombok.RequiredArgsConstructor;
import org.heeyeop.practicalprogrammingforspringdevelopers.domain.Account;
import org.heeyeop.practicalprogrammingforspringdevelopers.presentation.AccountService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    @Override
    @Transactional
    public Account updateNicknameById(long id, String nickname) {
        Account account = accountRepository.findById(id);
        account = account.withNickname(nickname);
        accountRepository.save(account);
        return account;
    }
}
