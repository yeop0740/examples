# S4. DB / Storage Bottleneck for Java + k6

## 분류

별도 분리 케이스

## 목적

backend storage가 병목일 때 protocol 차이가 어느 정도 희석되는지 확인한다.

## Java 서버 설계

- repository 계층에 지연 주입 또는 throttling 기능을 둔다.
- API layer 시간과 backend wait 시간을 분리 계측한다.
- REST와 gRPC가 동일 storage adapter를 사용하도록 강제한다.

## k6 설계

- 기준 workload는 F1 또는 F4를 사용한다.
- backend latency를 단계적으로 높이며 같은 스크립트를 반복한다.
- scenario 태그로 backend 상태를 분리한다.

## 주요 변수

| 항목 | 값 |
| --- | --- |
| backend latency | `5ms`, `20ms`, `100ms`, `500ms` |
| concurrency | low, medium, high |

## 주의사항

- 이 케이스에서 protocol 차이가 작게 나와도 transport가 불리하다는 결론으로 해석하면 안 된다.
