package org.heeyeop.k8sclientdemo1.dto;

public record CreateHttpRouteRequest(String resourceName, String domainName, String parentRefName) {
}
