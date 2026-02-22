package org.heeyeop.k8sclientdemo1;

import io.fabric8.kubernetes.client.Config;
import io.fabric8.kubernetes.client.ConfigBuilder;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClientBuilder;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class K8sClusterConfig {

    private KubernetesClient client;

    @Value("${kubernetes.master}")
    private String serverApi;

    @Value("${kubernetes.certs.ca.data}")
    private String certCaData;

    @Value("${kubernetes.certs.client.data}")
    private String certClientData;

    @Value("${kubernetes.certs.client.key.data}")
    private String certClientKeyData;

    @Bean
    public Config getK8sConnectionConfig() {
        return new ConfigBuilder()
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
    }

    @Bean
    public KubernetesClient getK8sClient(Config config) {
        if (this.client == null) {
            this.client = new KubernetesClientBuilder()
                    .withConfig(config)
                    .build();
        }

        return this.client;
    }

    @PreDestroy
    public void destroy() {
        if (this.client != null) {
            this.client.close();
            System.out.println("Kubernetes client closed");
        }
    }

}
