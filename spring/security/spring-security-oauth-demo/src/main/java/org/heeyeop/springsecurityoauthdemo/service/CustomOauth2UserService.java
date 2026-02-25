package org.heeyeop.springsecurityoauthdemo.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.heeyeop.springsecurityoauthdemo.dto.CustomOauth2User;
import org.heeyeop.springsecurityoauthdemo.dto.NaverOauth2Response;
import org.heeyeop.springsecurityoauthdemo.dto.Oauth2Response;
import org.heeyeop.springsecurityoauthdemo.entity.AuthProvider;
import org.heeyeop.springsecurityoauthdemo.entity.User;
import org.heeyeop.springsecurityoauthdemo.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOauth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("user attr : {}", oAuth2User.getAttributes());

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Oauth2Response response;
        if (registrationId.equals("naver")) {
            response = new NaverOauth2Response(oAuth2User.getAttributes());
        } else {
            return null;
        }

        // TODO: enum 변환에서 에러 발생하는 경우 -> 한무 반복 -> 추가로 조사
        String openid = response.getOpenid();
        AuthProvider authProvider = AuthProvider.valueOf(response.getProvider().toUpperCase());

        User user = userRepository.findByAuthProviderAndOpenid(authProvider, openid).orElse(User.register(authProvider, openid, response.getEmail()));
        user.update(authProvider, openid, response.getEmail());
        User registeredUser = userRepository.save(user);

        return new CustomOauth2User(response, registeredUser.getRole());
    }

}
