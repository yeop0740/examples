package org.heeyeop.practicalprogrammingforspringdevelopers.entity;

import jakarta.persistence.*;
import org.heeyeop.practicalprogrammingforspringdevelopers.domain.Account;

@Entity
public class AccountJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    @Column
    private String nickname;

    public static AccountJpaEntity from(Account account) {
        AccountJpaEntity entity = new AccountJpaEntity();
        entity.id = account.id;
        entity.email = account.email;
        entity.nickname = account.nickname;
        return entity;
    }

    public Account toModel() {
        return Account.builder()
                .id(this.id)
                .email(this.email)
                .nickname(this.nickname)
                .build();
    }
}
