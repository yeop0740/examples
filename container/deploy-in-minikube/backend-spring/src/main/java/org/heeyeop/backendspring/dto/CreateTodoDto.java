package org.heeyeop.backendspring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.heeyeop.backendspring.Todo;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class CreateTodoDto {
    private String text;

    public Todo toEntity() {
        return Todo.builder()
                .text(this.text)
                .build();
    }
}
