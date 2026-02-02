package org.heeyeop.practicalprogrammingforspringdevelopers.domain;

import lombok.Builder;
import lombok.RequiredArgsConstructor;

@Builder
@RequiredArgsConstructor
public class Account {

    public final Long id;
    public final String email;
    public final String nickname;

    public Account withNickname(String nickname) {
        return Account.builder()
                .id(this.id)
                .email(this.email)
                .nickname(nickname)
                .build();
    }
}
