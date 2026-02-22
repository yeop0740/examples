package org.heeyeop.k8sclientdemo1.dto;

public record CreateSecretRequest(String secretName, String filename) {
}
