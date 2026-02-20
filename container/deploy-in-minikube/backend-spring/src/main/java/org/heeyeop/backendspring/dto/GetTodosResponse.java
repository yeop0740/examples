package org.heeyeop.backendspring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.heeyeop.backendspring.Todo;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class GetTodosResponse {
    private List<GetTodoSummaryResponse> entities;

    public static GetTodosResponse from(List<Todo> entities) {
        return GetTodosResponse.builder()
                .entities(entities.stream().map(GetTodoSummaryResponse::from).toList())
                .build();
    }
}
