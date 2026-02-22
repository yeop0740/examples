package org.heeyeop.k8sclientdemo1;

import io.fabric8.kubernetes.api.model.GenericKubernetesResource;
import io.fabric8.kubernetes.api.model.ObjectMeta;
import io.fabric8.kubernetes.api.model.gatewayapi.v1.HTTPRoute;
import io.fabric8.kubernetes.api.model.gatewayapi.v1.HTTPRouteBuilder;
import io.fabric8.kubernetes.client.KubernetesClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class HttpRouteRepository {

    private final KubernetesClient client;

    public void save(String resourceName, String listenerName, String domainName, String parentRefName) {
        HTTPRoute httpRoute = new HTTPRouteBuilder()
                .withNewMetadata()
                .withName(resourceName)
                .withNamespace("default")
                .endMetadata()
                .withNewSpec()
                .addNewParentRef()
                .withName(parentRefName)
                .withSectionName(listenerName)
                .withNamespace("default")
                .endParentRef()
                .addToHostnames(domainName)
                .addNewRule()
                .addNewMatch()
                .withNewPath()
                .withType("PathPrefix")
                .withValue("/")
                .endPath()
                .endMatch()
                .addNewBackendRef()
                .withName("frontend-service")
                .withPort(80)
                .endBackendRef()
                .endRule()
                .endSpec()
                .build();

        this.client.resource(httpRoute)
                .create();
    }

    public List<String> getRoutes() {
        List<HTTPRoute> httpRoutes = this.client.resources(HTTPRoute.class)
                .inNamespace("default")
                .list()
                .getItems();
        log.info("http routes: {}", httpRoutes);

        return httpRoutes.stream()
                .map(HTTPRoute::getMetadata)
                .map(ObjectMeta::getName)
                .toList();
    }

    public void delete(String resourceName) {
        this.client.resources(HTTPRoute.class)
                .inNamespace("default")
                .withName(resourceName)
                .delete();
    }

}
