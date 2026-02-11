package org.heeyeop.sslpractice.controller;

import org.heeyeop.sslpractice.service.CertificateService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @GetMapping("/validate-cert")
    public String validateCertificate(@RequestParam String filePath) {
        boolean isValid = certificateService.validateCertificateFile(filePath);
        return isValid ? "Valid Certificate" : "Invalid Certificate";
    }
}
