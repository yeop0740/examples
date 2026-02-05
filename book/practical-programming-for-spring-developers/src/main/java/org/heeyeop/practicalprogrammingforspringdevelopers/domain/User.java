package org.heeyeop.practicalprogrammingforspringdevelopers.domain;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class User {

    private Long id;
    private String email;
    private String nickname;
    private UserStatus status;
    private String verificationCode;

    public boolean isPending() {
        return this.status.equals(UserStatus.PENDING);
    }

}
