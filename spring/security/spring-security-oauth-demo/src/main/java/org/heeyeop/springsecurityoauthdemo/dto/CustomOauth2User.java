package org.heeyeop.springsecurityoauthdemo.dto;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@Slf4j
public class CustomOauth2User implements OAuth2User {

    private final Oauth2Response response;
    private final String role;

    public CustomOauth2User(Oauth2Response response, String role) {
        this.response = response;
        this.role = role;
    }

    @Override
    public Map<String, Object> getAttributes() {
        log.info("{}", this.response);
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(() -> role);

        return authorities;
    }

    @Override
    public String getName() {
        return response.getEmail();
    }

}
