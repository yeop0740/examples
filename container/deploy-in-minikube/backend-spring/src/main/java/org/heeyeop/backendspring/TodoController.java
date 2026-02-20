package org.heeyeop.backendspring;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.heeyeop.backendspring.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

@Slf4j
@CrossOrigin(origins = "http://localhost:8888")
@RestController
@RequiredArgsConstructor
@RequestMapping("/todos")
public class TodoController {

    private final TodoService todoService;

    @PostMapping
    public ResponseEntity<Void> createTodo(@RequestBody CreateTodoRequest request) {
        CreateTodoResponse response = todoService.createTodo(request.toDto());
        return ResponseEntity.created(URI.create("/todos/" + response.getId()))
                .build();
    }

    @GetMapping
    public ResponseEntity<GetTodosResponse> getTodos() {
        return ResponseEntity.ok(todoService.getTodos());
    }

    @PutMapping("/{todoId}")
    public ResponseEntity<Void> updateTodo(@PathVariable UUID todoId, @RequestBody UpdateTodoRequest request) {
        log.info("updateTodo request: {}", request);
        todoService.updateTodo(request.toDto(todoId));
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{todoId}")
    public ResponseEntity<Void> deleteTodo(@PathVariable UUID todoId) {
        todoService.deleteTodo(new DeleteTodoDto(todoId));
        return ResponseEntity.noContent().build();
    }
}
