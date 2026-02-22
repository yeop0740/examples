package org.heeyeop.k8sclientdemo1;

import lombok.RequiredArgsConstructor;
import org.heeyeop.k8sclientdemo1.dto.RegisterDomainRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/domains")
public class DomainController {

    private final GatewayRepository gatewayRepository;
    private final HttpRouteRepository httpRouteRepository;

    @PostMapping
    public void registerDomain(@RequestBody RegisterDomainRequest request) {
        String resourceName = request.domainName().replace(".", "-");
        String gatewayName = resourceName;
        String httpRouteName = "http-" + resourceName;

        // create gateway
        gatewayRepository.save(gatewayName, request.domainName());

        // create http-route
        httpRouteRepository.save(httpRouteName, "http", request.domainName(), gatewayName);
    }

    @DeleteMapping("/{domainName}")
    public void deleteDomain(@PathVariable String domainName) {
        String resourceName = domainName.replace(".", "-");
        String gatewayName = resourceName;
        String httpRouteName = "http-" + resourceName;

        // delete http-route
        httpRouteRepository.delete(httpRouteName);

        // delete gateway
        gatewayRepository.delete(gatewayName);
    }

}
