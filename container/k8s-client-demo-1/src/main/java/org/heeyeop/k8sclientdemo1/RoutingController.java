package org.heeyeop.k8sclientdemo1;

import lombok.RequiredArgsConstructor;

import org.heeyeop.k8sclientdemo1.dto.CreateHttpRouteRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/http-routes")
public class RoutingController {

    private final HttpRouteRepository httpRouteRepository;

    @PostMapping
    public void createRoute(@RequestBody CreateHttpRouteRequest request) {
        httpRouteRepository.save(request.resourceName(), request.domainName());
    }

    @GetMapping
    public List<String> getRoutes() {
        return httpRouteRepository.getRoutes();
    }

    @DeleteMapping("/{domainName}")
    public void deleteRoute(@PathVariable String domainName) {
        httpRouteRepository.delete(domainName);
    }

}
