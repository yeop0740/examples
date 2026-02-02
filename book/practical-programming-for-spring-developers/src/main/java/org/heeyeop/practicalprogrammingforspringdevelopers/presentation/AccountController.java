package org.heeyeop.practicalprogrammingforspringdevelopers.presentation;

import ch.qos.logback.core.util.StringUtil;
import lombok.RequiredArgsConstructor;
import org.heeyeop.practicalprogrammingforspringdevelopers.application.AccountService;
import org.heeyeop.practicalprogrammingforspringdevelopers.domain.Account;
import org.heeyeop.practicalprogrammingforspringdevelopers.presentation.dto.AccountUpdateNicknameRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/accounts")
public class AccountController {

    private final AccountService accountService;

    @PatchMapping("/{id}")
    public ResponseEntity<Account> updateNickname(@PathVariable long id, @RequestBody AccountUpdateNicknameRequest request) {
        if (StringUtil.notNullNorEmpty(request.nickname())) {
            Account updatedAccount =accountService.updateNicknameById(id, request.nickname());

            return ResponseEntity.ok(updatedAccount);
        }

        throw new RuntimeException();
    }

}
