package org.heeyeop.backendspring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.heeyeop.backendspring.Todo;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class GetTodoSummaryResponse {
    private UUID id;
    private String text;
    private boolean completed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static GetTodoSummaryResponse from(Todo todo) {
        return GetTodoSummaryResponse.builder()
                .id(todo.getId())
                .text(todo.getText())
                .completed(todo.isCompleted())
                .createdAt(todo.getCreatedAt())
                .updatedAt(todo.getUpdatedAt())
                .build();
    }
}
