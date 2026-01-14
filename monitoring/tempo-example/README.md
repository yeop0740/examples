# tempo-example

[tempo local example](https://github.com/grafana/tempo/tree/main/example/docker-compose/local) 을 참고해 otel 예제를 구성하여 데이터의 흐름을 확인한 예제

```shell
env OTEL_TRACES_EXPORTER=otlp OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318 OTEL_SERVICE_NAME=tempo-example OTEL_NODE_RESOURCE_DETECTORS=all \
tsx --require @opentelemetry/auto-instrumentations-node/register app.ts
```

```shell
env OTEL_TRACES_EXPORTER=console OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318 OTEL_SERVICE_NAME=tempo-example OTEL_NODE_RESOURCE_DETECTORS=all \
tsx --require @opentelemetry/auto-instrumentations-node/register app.ts
```

## 결과
app -> tempo -> grafana 의 결과 데이터를 확인할 수 있습니다.

## 필요한 과정
- 외부 storage 설정(ex - s3 등)
- 내부 동작
- 추가 설정
- prometheus 의 역할
- 좀 더 복잡한 애플리케이션 구동

## 참고
- https://opentelemetry.io/docs/zero-code/js/
- https://opentelemetry.io/docs/languages/js/getting-started/nodejs/
- https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/
- https://grafana.com/docs/tempo/latest/docker-example/
