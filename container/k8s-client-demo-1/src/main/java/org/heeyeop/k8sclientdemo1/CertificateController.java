package org.heeyeop.k8sclientdemo1;

import lombok.RequiredArgsConstructor;
import org.heeyeop.k8sclientdemo1.dto.RegisterCertificateRequest;
import org.heeyeop.k8sclientdemo1.dto.RenewCertificateRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/certificates")
public class CertificateController {

    private final GatewayRepository gatewayRepository;
    private final HttpRouteRepository httpRouteRepository;
    private final SecretRepository secretRepository;

    @PostMapping
    public void registerCertificate(@RequestBody RegisterCertificateRequest request) {
        String resourceName = request.domainName().replace(".", "-");
        String secretName = resourceName;
        String gatewayName = resourceName;
        String httpRouteName = "https-" + resourceName;

        // create secret
        // TODO: save 이후의 과정이 실패하는 케이스(각각의 케이스가 부분 성공하는 경우) 처리 로직 보강 필요
        secretRepository.save(request.filename(), secretName);

        // add listener to gateway
        gatewayRepository.addListener(gatewayName, request.domainName(), secretName);

        // create HTTPRoute for https
        httpRouteRepository.save(httpRouteName, "https", request.domainName(), secretName);
    }

    @PutMapping("/{secretName}")
    public void renewCertificate(@RequestBody RenewCertificateRequest request, @PathVariable String secretName) {
        // renew secret
        secretRepository.renew(request.filename(), secretName);
    }

    @DeleteMapping("/{domainName}")
    public void deleteCertificate(@PathVariable String domainName) {
        String resourceName = domainName.replace(".", "-");
        String httpRouteName = "https-" + resourceName;
        String secretName = resourceName;
        String gatewayName = resourceName;

        // delete http-route
        httpRouteRepository.delete(httpRouteName); // 멱등성 있음

        // remove listener from gateway
        gatewayRepository.removeListener(gatewayName);

        // delete secret
        secretRepository.delete(secretName);
    }

}
