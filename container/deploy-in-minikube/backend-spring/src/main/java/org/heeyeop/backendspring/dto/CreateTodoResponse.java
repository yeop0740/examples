package org.heeyeop.backendspring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.heeyeop.backendspring.Todo;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTodoResponse {
    private UUID id;

    public static CreateTodoResponse from(Todo todo) {
        return CreateTodoResponse.builder()
                .id(todo.getId())
                .build();
    }
}
