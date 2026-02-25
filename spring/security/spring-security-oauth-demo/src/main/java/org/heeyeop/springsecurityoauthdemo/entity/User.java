package org.heeyeop.springsecurityoauthdemo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"openid", "auth_provider"})
        })
@NoArgsConstructor
@Getter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private AuthProvider authProvider;

    private String openid;

    private String email;

    private String role;

    private User(AuthProvider authProvider, String openid, String email, String role) {
        this.authProvider = authProvider;
        this.openid = openid;
        this.email = email;
        this.role = role;
    }

    public static User register(AuthProvider authProvider, String openid, String email) {
        return new User(authProvider, openid, email, "ROLE_USER");
    }

    public void update(AuthProvider authProvider, String openid, String email) {
        this.authProvider = authProvider;
        this.openid = openid;
        this.email = email;
    }

}
