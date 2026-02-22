package org.heeyeop.k8sclientdemo1;

import io.fabric8.kubernetes.api.model.ObjectMeta;
import io.fabric8.kubernetes.api.model.Secret;
import io.fabric8.kubernetes.api.model.SecretBuilder;
import io.fabric8.kubernetes.client.KubernetesClient;
import lombok.RequiredArgsConstructor;
import org.bouncycastle.openssl.jcajce.JcaPEMWriter;
import org.springframework.stereotype.Component;

import java.io.StringWriter;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class SecretRepository {

    private final KubernetesClient client;

    public void save(String filename, String resourceName) {
        Path dataDir = Paths.get("data");
        Path inputPem = dataDir.resolve(filename);

        String certificate;
        String privateKey;

        try {
            PemUtils.PemData pemData = PemUtils.parsePemFile(inputPem);
            certificate = toPemString(pemData.certificate());
            privateKey = toPemString(pemData.privateKey());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        Secret tlsSecret = new SecretBuilder()
                .withNewMetadata()
                .withName(resourceName)
                .withNamespace("default")
                .endMetadata()
                .withType("kubernetes.io/tls") // 중요: TLS Secret은 이 타입을 명시해야 합니다.
                .withStringData(Map.of(
                        "tls.crt", certificate,
                        "tls.key", privateKey))
                .build();

        // secret의 create은 동일 이름의 resource가 기등록되어 있으면 예외를 발생
        client.secrets()
                .inNamespace("default")
                .resource(tlsSecret)
                .create();
    }

    public List<String> findAll() {
        return this.client.secrets()
                .inNamespace("default")
                .list()
                .getItems()
                .stream()
                .map(Secret::getMetadata)
                .map(ObjectMeta::getName)
                .toList();
    }

    public void renew(String filename, String secretName) {
        Path dataDir = Paths.get("data");
        Path inputPem = dataDir.resolve(filename);

        String certificate;
        String privateKey;

        try {
            PemUtils.PemData pemData = PemUtils.parsePemFile(inputPem);
            certificate = toPemString(pemData.certificate());
            privateKey = toPemString(pemData.privateKey());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        this.client.secrets()
                .inNamespace("default")
                .withName(secretName)
                .edit(s -> new SecretBuilder(s)
                        .addToStringData("tls.crt", certificate)
                        .addToStringData("tls.key", privateKey)
                        .build()
                );
    }

    public void delete(String resourceName) {
        this.client.secrets()
                .inNamespace("default")
                .withName(resourceName)
                .delete();
    }

    private String toPemString(Object object) throws Exception {
        StringWriter sw = new StringWriter();
        try (JcaPEMWriter pemWriter = new JcaPEMWriter(sw)) {
            pemWriter.writeObject(object);
        }
        return sw.toString();
    }

}
