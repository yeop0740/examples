package org.heeyeop.practicalprogrammingforspringdevelopers.presentation;

import org.heeyeop.practicalprogrammingforspringdevelopers.domain.Account;

public interface AccountService {

    public Account updateNicknameById(long id, String nickname);
}
