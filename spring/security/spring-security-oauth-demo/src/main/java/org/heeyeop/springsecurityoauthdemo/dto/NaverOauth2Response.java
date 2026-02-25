package org.heeyeop.springsecurityoauthdemo.dto;

import java.util.Map;

public class NaverOauth2Response implements Oauth2Response {

    private final Map<String, Object> attributes;

    public NaverOauth2Response(Map<String, Object> attributes) {
        this.attributes = (Map<String, Object>) attributes.get("response");
    }

    @Override
    public String getProvider() {
        return "naver";
    }

    @Override
    public String getOpenid() {
        return attributes.get("id").toString();
    }

    @Override
    public String getEmail() {
        return attributes.get("email").toString();
    }

    @Override
    public String getName() {
        return attributes.get("name").toString();
    }

}
