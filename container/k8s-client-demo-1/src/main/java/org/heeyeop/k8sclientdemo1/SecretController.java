package org.heeyeop.k8sclientdemo1;

import lombok.RequiredArgsConstructor;
import org.heeyeop.k8sclientdemo1.dto.CreateSecretRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/secrets")
public class SecretController {

    private final SecretRepository secretRepository;

    @PostMapping
    public void createSecret(@RequestBody CreateSecretRequest request) {
        secretRepository.save(request.filename(), request.secretName());
    }

    @GetMapping
    public List<String> getSecrets() {
        return secretRepository.findAll();
    }

    @DeleteMapping("/{secretName}")
    public void deleteSecret(@PathVariable String secretName) {
        secretRepository.delete(secretName);
    }

}
