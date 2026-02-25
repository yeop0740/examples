package org.heeyeop.springsecurityoauthdemo.dto;

public interface Oauth2Response {
    String getProvider();
    String getOpenid();
    String getEmail();
    String getName();
}
