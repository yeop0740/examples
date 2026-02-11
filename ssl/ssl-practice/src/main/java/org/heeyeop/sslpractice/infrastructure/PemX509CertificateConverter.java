package org.heeyeop.sslpractice.infrastructure;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.cert.Certificate;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collection;
import java.util.List;

@Slf4j
@Component
public class PemX509CertificateConverter {

    public List<X509Certificate> fromPem(MultipartFile file) {
        try {
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            Collection<X509Certificate> certificates = (Collection<X509Certificate>) cf.generateCertificates(file.getInputStream());
            return new ArrayList<>(certificates);
        } catch (CertificateException ce) {
            log.error("certificate factory error {}", ce.getMessage());
            throw new RuntimeException("internal server error");
        } catch (IOException ioe) {
            log.error("io error {}", ioe.getMessage());
            throw new RuntimeException("internal server error");
        }
    }

    public byte[] toArray(List<Certificate> certificates) {
        StringBuilder sb = new StringBuilder();
        Base64.Encoder encoder = Base64.getMimeEncoder(64, new byte[]{'\n'});

        try {
            for (Certificate certificate : certificates) {
                sb.append("-----BEGIN CERTIFICATE-----\n");
                sb.append(encoder.encodeToString(certificate.getEncoded()));
                sb.append("\n-----END CERTIFICATE-----\n");
            }
        } catch (CertificateEncodingException e) {
            log.error("certificate encoding error {}", e.getMessage());
            throw new RuntimeException("internal server error");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

}
