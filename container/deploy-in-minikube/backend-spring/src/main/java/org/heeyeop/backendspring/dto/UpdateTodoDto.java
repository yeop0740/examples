package org.heeyeop.backendspring.dto;

import lombok.*;

import java.util.UUID;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@ToString
public class UpdateTodoDto {
    private UUID id;
    private boolean completed;
}
