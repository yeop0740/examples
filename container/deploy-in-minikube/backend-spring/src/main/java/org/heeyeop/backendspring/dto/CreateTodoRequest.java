package org.heeyeop.backendspring.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class CreateTodoRequest {
    private String text;

    public CreateTodoDto toDto() {
        return CreateTodoDto.builder()
                .text(this.text)
                .build();
    }
}
