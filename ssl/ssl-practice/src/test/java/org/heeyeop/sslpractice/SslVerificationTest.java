package org.heeyeop.sslpractice;

import org.heeyeop.sslpractice.service.CertificateService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.File;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class SslVerificationTest {

    @Autowired
    private CertificateService certificateService;

    @Test
    public void testGoogleCertValidation() {
        String filePath = "data/google_com.pem";
        File file = new File(filePath);
        String absolutePath = file.getAbsolutePath();
        
        boolean isValid = certificateService.validateCertificateFile(absolutePath);
        assertTrue(isValid, "Google certificate should be valid");
    }
}
