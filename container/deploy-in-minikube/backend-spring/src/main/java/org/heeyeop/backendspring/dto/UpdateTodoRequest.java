package org.heeyeop.backendspring.dto;

import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Setter
@ToString
public class UpdateTodoRequest {
    private boolean completed;

    public UpdateTodoDto toDto(UUID todoId) {
        return UpdateTodoDto.builder()
                .id(todoId)
                .completed(this.completed)
                .build();
    }
}
