package org.heeyeop.k8sclientdemo1;

import io.fabric8.kubernetes.api.model.ObjectMeta;
import io.fabric8.kubernetes.api.model.gatewayapi.v1.Gateway;
import io.fabric8.kubernetes.api.model.gatewayapi.v1.GatewayBuilder;
import io.fabric8.kubernetes.client.KubernetesClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class GatewayRepository {

    private static final String HTTPS_LISTENER_NAME = "https";
    private static final String HTTP_LISTENER_NAME = "http";

    private final KubernetesClient client;

    public void save(String resourceName, String hostName) {
        Gateway gateway = new GatewayBuilder()
                .withNewMetadata()
                .withName(resourceName)
                .withNamespace("default")
                .endMetadata()
                .withNewSpec()
                .withGatewayClassName("gateway-class") // 기등록된 gatewayclass resource name
                .addNewListener()
                .withName(HTTP_LISTENER_NAME)
                .withHostname(hostName)
                .withProtocol("HTTP")
                .withPort(80)
                .endListener()
                .endSpec()
                .build();

        this.client.resource(gateway)
                .inNamespace("default")
                .create();
    }

    public void addListener(String gatewayName, String hostName, String secretName) {
        client.resources(Gateway.class)
                .inNamespace("default")
                .withName(gatewayName)
                .edit(g -> new io.fabric8.kubernetes.api.model.gatewayapi.v1.GatewayBuilder(g)
                        .editOrNewSpec()
                        .addNewListener()
                        .withName(HTTPS_LISTENER_NAME)
                        .withHostname(hostName)
                        .withProtocol("HTTPS")
                        .withPort(443)
                        .withNewTls()
                        .withMode("Terminate")
                        .addNewCertificateRef()
                        .withKind("Secret")
                        .withName(secretName)
                        .endCertificateRef()
                        .endTls()
                        .endListener()
                        .endSpec()
                        .build()
                );
    }

    public void removeListener(String gatewayName) {
//        client.resources(Gateway.class)
//                .inNamespace("default")
//                .withName(gatewayName)
//                .edit(g -> {
//                    g.getSpec()
//                            .getListeners()
//                            .removeIf(listener -> listener.getName().equals(HTTPS_LISTENER_NAME));
//
//                    return g;
//                });


        client.resources(Gateway.class)
                .inNamespace("default")
                .withName(gatewayName)
                .edit(g -> new GatewayBuilder(g)
                        .editOrNewSpec()
                        .removeMatchingFromListeners(lb -> lb.getName().equals(HTTPS_LISTENER_NAME))
                        .endSpec()
                        .build());
    }

    public List<String> findAll() {
        return this.client.resources(Gateway.class)
                .inNamespace("default")
                .list()
                .getItems()
                .stream()
                .map(Gateway::getMetadata)
                .map(ObjectMeta::getName)
                .toList();
    }

    public void delete(String gatewayName) {
        client.resources(Gateway.class)
                .inNamespace("default")
                .withName(gatewayName)
                .delete();
    }

}
