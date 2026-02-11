package org.heeyeop.sslpractice.infrastructure;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.security.*;
import java.security.cert.*;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
public class X509CertificateValidator {

    private final List<TrustAnchor> trustAnchors = init();

    /**
     * ca의 public key로 signature 를 verification 하는지 모르겠네;;
     */
    public void validateChain(List<X509Certificate> certificates) {
        CertPath certPath = getCertPath(certificates);
        String certs = certPath.getCertificates().stream()
                .map(cert -> (X509Certificate) cert)
                .map(cert -> String.format("[Subject]: %s\n[Issuer]: %s\n", cert.getSubjectX500Principal(), cert.getIssuerX500Principal()))
                .collect(Collectors.joining(","));
        System.out.println("certs = " + certs);
        try {
            CertPathValidator validator = CertPathValidator.getInstance("PKIX");

            PKIXParameters parameters = new PKIXParameters(new HashSet<>(trustAnchors));
            CertStore certStore = CertStore.getInstance("Collection", new CollectionCertStoreParameters(certificates));
            parameters.addCertStore(certStore);

            validator.validate(certPath, parameters);
        } catch (NoSuchAlgorithmException e) {
            log.error("cert path validator init error {}", e.getMessage());
            throw new RuntimeException("internal server error");
        } catch (CertPathValidatorException e) {
            log.info("");
            throw new RuntimeException(e);
        } catch (InvalidAlgorithmParameterException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * - root CA의 인증서만 있는 경우
     * - self-signed 인증서의 경우
     */
    public CertPath getCertPath(List<X509Certificate> certificates) {
        if (certificates.size() == 1 && isLeafCertificate(certificates.get(0))) {
            throw new RuntimeException("self-signed pem file");
        }

        X509Certificate leafCertificate = getLeafCertificate(certificates);

        try {
            CertPathBuilder cpb = CertPathBuilder.getInstance("PKIX");

            X509CertSelector selector = new X509CertSelector();
            selector.setCertificate(leafCertificate);

            PKIXBuilderParameters parameters = new PKIXBuilderParameters(new HashSet<>(trustAnchors), selector);
            CertStore certStore = CertStore.getInstance("Collection", new CollectionCertStoreParameters(certificates));
            parameters.addCertStore(certStore);

            CertPathBuilderResult result = cpb.build(parameters);
            return result.getCertPath();
        } catch (InvalidAlgorithmParameterException iape) {
            log.error("invalid algorithm {}", iape.getMessage());
            throw new RuntimeException("internal server error");
        } catch (GeneralSecurityException e) {
            log.error("CertPath validation failed: {}", e.getMessage());
            throw new RuntimeException("internal server error");
        }
    }

    private X509Certificate getLeafCertificate(List<X509Certificate> certificates) {
        List<X509Certificate> leafCertificates = certificates.stream()
                .filter(this::isLeafCertificate)
                .toList();

        if (leafCertificates.isEmpty()) {
            throw new RuntimeException("Certificate chain is empty");
        }

        if (leafCertificates.size() > 1) {
            throw new RuntimeException("Certificate chain contains more than one leaf certificate");
        }

        return leafCertificates.get(0);
    }

    public void validateValidity(X509Certificate certificate, LocalDateTime now) {
        try {
            certificate.checkValidity(Date.from(now.toInstant(ZoneOffset.UTC)));
        } catch (CertificateExpiredException | CertificateNotYetValidException e) {
            log.error("not valid time {}", e.getMessage());
            throw new RuntimeException("invalid certificate");
        };
    }

    private boolean isLeafCertificate(X509Certificate certificate) {
        return certificate.getBasicConstraints() == -1;
    }

    private List<TrustAnchor> init() {
        List<TrustAnchor> trustAnchors = new ArrayList<>();
        String rootCaFilePath = Paths.get(System.getProperty("java.home"), "lib", "security", "cacerts").toString();

        try {
            KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
            try (FileInputStream fis = new FileInputStream(rootCaFilePath)) {
                keyStore.load(fis, "changeit".toCharArray());
            }

            return Collections.list(keyStore.aliases()).stream()
                    .map(alias -> {
                        try {
                            return keyStore.getCertificate(alias);
                        } catch (KeyStoreException e) {
                            log.error("not found alias certificate {}", e.getMessage());
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .map(cert -> new TrustAnchor((X509Certificate) cert, null))
                    .toList();
        } catch (GeneralSecurityException e) {
            log.error("keystore init error {}", e.getMessage());
            throw new RuntimeException("internal server error");
        } catch (IOException ie) {
            log.error("io exception {}", ie.getMessage());
            throw new RuntimeException("internal server error");
        }
    }

}
