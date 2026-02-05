package org.heeyeop.practicalprogrammingforspringdevelopers.application.dto;

import lombok.Builder;

@Builder
public record UserCreateDto(String email, String nickname) {
}
