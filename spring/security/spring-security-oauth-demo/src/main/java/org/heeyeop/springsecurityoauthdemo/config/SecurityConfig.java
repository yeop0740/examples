package org.heeyeop.springsecurityoauthdemo.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final OAuth2UserService oAuth2UserService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .oauth2Login(oauth -> oauth
                        .loginPage("http://localhost:5173/login")
                        .userInfoEndpoint((endpoint) -> endpoint.userService(oAuth2UserService))
                        .successHandler((req, res, auth) -> {
                            res.sendRedirect("http://localhost:5173/welcome");
                        })
                        .failureUrl("http://localhost:5173/login-failed")
                )
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/", "/oauth/**", "/login/**").permitAll()
                        .anyRequest().authenticated())
                .logout((logout) -> logout
                        .deleteCookies("JSESSIONID")
                        .invalidateHttpSession(true)
                        .logoutSuccessUrl("http://localhost:5173/login")
                );

        return httpSecurity.build();
    }

}
