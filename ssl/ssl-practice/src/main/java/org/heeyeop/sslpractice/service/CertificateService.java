package org.heeyeop.sslpractice.service;

import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Collection;

@Service
public class CertificateService {

    public boolean validateCertificateFile(String filePath) {
        File file = new File(filePath);
        if (!file.exists() || !file.isFile()) {
            return false;
        }

        try {
            String content = Files.readString(file.toPath(), StandardCharsets.UTF_8);
            return validatePemContent(content);
        } catch (IOException e) {
            return false;
        }
    }

    private boolean validatePemContent(String pemContent) {
        try {
            CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
            ByteArrayInputStream inputStream = new ByteArrayInputStream(pemContent.getBytes(StandardCharsets.UTF_8));
            Collection<? extends java.security.cert.Certificate> certificates = certificateFactory.generateCertificates(inputStream);

            if (certificates.isEmpty()) {
                return false;
            }

            for (java.security.cert.Certificate certificate : certificates) {
                if (certificate instanceof X509Certificate) {
                    ((X509Certificate) certificate).checkValidity();
                }
            }
            return true;
        } catch (CertificateException e) {
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}
