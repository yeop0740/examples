package org.heeyeop.backendspring;

import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TodoRepository extends CrudRepository<Todo, UUID> {
    List<Todo> findAll();
    Optional<Todo> findById(UUID id);
}
