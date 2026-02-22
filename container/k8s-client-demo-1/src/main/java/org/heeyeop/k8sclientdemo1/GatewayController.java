package org.heeyeop.k8sclientdemo1;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/gateways")
public class GatewayController {

    private final GatewayRepository gatewayRepository;

    @GetMapping
    public List<String> getGateways() {
        return gatewayRepository.findAll();
    }

}
