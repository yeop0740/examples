package org.heeyeop.backendspring;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.heeyeop.backendspring.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TodoService {

    private final TodoRepository todoRepository;

    @Transactional
    public CreateTodoResponse createTodo(CreateTodoDto dto) {
        Todo todo = todoRepository.save(dto.toEntity());
        return CreateTodoResponse.from(todo);
    }

    public GetTodosResponse getTodos() {
        return GetTodosResponse.from(todoRepository.findAll());
    }

    @Transactional
    public void updateTodo(UpdateTodoDto dto) {
        Todo todo = todoRepository.findById(dto.getId()).orElseThrow();
        log.info("input {}", dto);
        log.info("todo: {}", todo);
        todo.update(dto.isCompleted());
        log.info("todo: {}", todo);
    }

    @Transactional
    public void deleteTodo(DeleteTodoDto dto) {
        todoRepository.deleteById(dto.getId());
    }

}
