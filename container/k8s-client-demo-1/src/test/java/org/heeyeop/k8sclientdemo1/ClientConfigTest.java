package org.heeyeop.k8sclientdemo1;

import io.fabric8.kubernetes.client.Config;
import io.fabric8.kubernetes.client.ConfigBuilder;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClientBuilder;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class ClientConfigTest {

    @Value("${kubernetes.master}")
    private String serverApi;

    @Value("${kubernetes.certs.ca.data}")
    private String certCaData;

    @Value("${kubernetes.certs.client.data}")
    private String certClientData;

    @Value("${kubernetes.certs.client.key.data}")
    private String certClientKeyData;

    @Test
    void config_client_example() {
        Config config = new ConfigBuilder()
                .withMasterUrl(serverApi)
                .withCaCertData(certCaData)
                .withNamespace("default")
                .withClientCertData(certClientData)
                .withClientKeyData(certClientKeyData)
                // .withOauthToken("your-token")
                // .withUsername("admin")
                // .withPassword("password")
                // .withCaCertFile("/path/to/ca.crt")
                .build();

        try (KubernetesClient configuredClient = new KubernetesClientBuilder().withConfig(config).build()) {
            System.out.println("Master URL: " + configuredClient.getConfiguration().getMasterUrl());
            List<String> names = configuredClient.namespaces().list().getItems().stream().map(namespace -> namespace.getMetadata().getName()).toList();
            System.out.println("names = " + names);
        }
    }

}

/**
 * default                Active   8d
 * envoy-gateway-system   Active   8d
 * kube-node-lease        Active   8d
 * kube-public            Active   8d
 * kube-system            Active   8d
 * local-path-storage     Active   8d
 */
