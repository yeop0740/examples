package org.heeyeop.practicalprogrammingforspringdevelopers.application;

import org.heeyeop.practicalprogrammingforspringdevelopers.domain.Account;

public interface AccountRepository {

    Account findById(long id);

    void save(Account account);
}
